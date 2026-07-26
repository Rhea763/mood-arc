import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { getMockGenerate } from "@/lib/mock-data";
import {
  isValidMood,
  isValidScenario,
  isValidRegulationGoalForMood,
} from "@/lib/context-catalog";
import { isValidPlaylistLength } from "@/lib/regulation-goals";
import {
  buildSequencedPlaylist,
  sequencedTracksToVideos,
} from "@/lib/generate-playlist";
import { resolveSequencedTracksToYouTube } from "@/lib/resolve-youtube-tracks";
import {
  createPlaylist,
  addVideoToPlaylist,
  YouTubeApiError,
} from "@/lib/youtube";
import type { GenerateRequest, GenerateResponse } from "@/types/music";
import moodMap from "@/lib/mood-map.json";

type MoodMap = Record<string, { queries: string[] }>;
const MOODS = moodMap as MoodMap;

export async function POST(req: NextRequest) {
  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式无效" }, { status: 400 });
  }

  const {
    mood,
    scenario,
    causes,
    regulationGoal,
    playlistLength,
    selectedChannelIds,
    selectedChannelNames,
  } = body;

  if (!mood || !isValidMood(mood) || !MOODS[mood]) {
    return NextResponse.json({ error: "请选择有效的心情" }, { status: 400 });
  }

  if (scenario && !isValidScenario(scenario)) {
    return NextResponse.json({ error: "情境选项无效" }, { status: 400 });
  }

  if (
    !regulationGoal ||
    !isValidRegulationGoalForMood(regulationGoal, mood)
  ) {
    return NextResponse.json({ error: "请选择与心情匹配的调节目标" }, { status: 400 });
  }

  if (!playlistLength || !isValidPlaylistLength(playlistLength)) {
    return NextResponse.json({ error: "请选择有效的歌单长度" }, { status: 400 });
  }

  if (!selectedChannelIds?.length || !selectedChannelNames?.length) {
    return NextResponse.json({ error: "请至少选择一个频道" }, { status: 400 });
  }

  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      getMockGenerate(
        mood,
        causes,
        selectedChannelNames,
        regulationGoal,
        playlistLength,
        scenario
      )
    );
  }

  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const {
    interpretation,
    plan,
    tracks,
    playlistName,
    playlistDescription,
    summary,
  } = buildSequencedPlaylist(
    mood,
    causes,
    selectedChannelNames,
    regulationGoal,
    playlistLength,
    scenario
  );

  try {
    const resolved = await resolveSequencedTracksToYouTube(accessToken, tracks);

    if (resolved.length === 0) {
      return NextResponse.json(
        { error: "无法在 YouTube 上找到对应曲目，请稍后重试" },
        { status: 404 }
      );
    }

    const playlist = await createPlaylist(
      accessToken,
      playlistName,
      playlistDescription
    );

    for (const { video } of resolved) {
      await addVideoToPlaylist(accessToken, playlist.id, video.id);
    }

    const response: GenerateResponse = {
      playlistUrl: playlist.url,
      playlistId: playlist.id,
      playlistName: playlist.title,
      scenario,
      regulationGoal,
      playlistLength,
      interpretation: interpretation.narrative,
      summary,
      mock: false,
      arcSlots: plan.slots.map((s) => ({
        id: s.id,
        label: s.label,
        hint: s.hint,
      })),
      videos: sequencedTracksToVideos(resolved),
    };

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof YouTubeApiError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "登录已过期，请重新登录" },
          { status: 401 }
        );
      }
      if (err.status === 403) {
        return NextResponse.json(
          {
            error:
              "YouTube API 403：检查 API 是否启用、OAuth scope 是否包含 youtube、或当日配额是否用尽",
          },
          { status: 403 }
        );
      }
      if (err.status === 429) {
        return NextResponse.json(
          { error: "YouTube API 配额用尽，明天再试或申请提额" },
          { status: 429 }
        );
      }
    }
    console.error("generate error:", err);
    return NextResponse.json(
      { error: "生成播放列表失败，请稍后重试" },
      { status: 500 }
    );
  }
}
