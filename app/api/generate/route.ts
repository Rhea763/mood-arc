import { NextRequest, NextResponse } from "next/server";
import { requireAccessToken } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { isEmbedRequest } from "@/lib/embed-mode";
import { getMockGenerate } from "@/lib/mock-data";
import {
  isValidMood,
  isValidScenario,
  isValidRegulationGoalForMood,
} from "@/lib/context-catalog";
import { isValidPlaylistLength } from "@/lib/regulation-goals";
import {
  generateYouTubePlaylist,
  shouldEmbedFallbackToNetease,
  YouTubePlaylistEmptyError,
  youtubeErrorMessage,
} from "@/lib/youtube-playlist-generate";
import { YouTubeApiError } from "@/lib/youtube";
import type {
  GenerateRequest,
  GenerateResponse,
  PlaylistLength,
  RegulationGoalId,
  ScenarioId,
} from "@/types/music";
import moodMap from "@/lib/mood-map.json";

type MoodMap = Record<string, { queries: string[] }>;
const MOODS = moodMap as MoodMap;

type GenerateParams = {
  mood: string;
  causes?: string[];
  selectedChannelNames: string[];
  regulationGoal: RegulationGoalId;
  playlistLength: PlaylistLength;
  scenario?: ScenarioId;
};

function neteaseFallback(
  params: GenerateParams,
  reason: string
): GenerateResponse {
  return {
    ...getMockGenerate(
      params.mood,
      params.causes,
      params.selectedChannelNames,
      params.regulationGoal,
      params.playlistLength,
      params.scenario
    ),
    fallbackReason: reason,
  };
}

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

  const embedMode = body.embed === true || isEmbedRequest(req);
  const params: GenerateParams = {
    mood,
    causes,
    selectedChannelNames,
    regulationGoal,
    playlistLength,
    scenario,
  };

  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(getMockGenerate(
      mood,
      causes,
      selectedChannelNames,
      regulationGoal,
      playlistLength,
      scenario
    ));
  }

  const accessToken = await requireAccessToken();

  if (embedMode) {
    if (!accessToken) {
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        neteaseFallback(
          params,
          "未登录 Google，已改用网易云试听（弧线打分不变）"
        )
      );
    }

    try {
      const response = await generateYouTubePlaylist(accessToken, params);
      return NextResponse.json(response);
    } catch (err) {
      if (shouldEmbedFallbackToNetease(err)) {
        const detail = youtubeErrorMessage(err) ?? "YouTube 生成失败";
        console.warn("embed YouTube fallback:", detail, err);
        await new Promise((r) => setTimeout(r, 400));
        return NextResponse.json(
          neteaseFallback(params, `${detail}，已改用网易云试听`)
        );
      }
      console.error("embed generate error:", err);
      return NextResponse.json(
        neteaseFallback(params, "YouTube 异常，已改用网易云试听")
      );
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const response = await generateYouTubePlaylist(accessToken, params);
    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof YouTubePlaylistEmptyError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
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
