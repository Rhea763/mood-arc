import { NextRequest, NextResponse } from "next/server";
import moodMap from "@/lib/mood-map.json";
import { requireAccessToken } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { getMockGenerate } from "@/lib/mock-data";
import {
  isValidMood,
  isValidScenario,
  isValidRegulationGoalForMood,
  goalSearchSuffix,
  scenarioSearchSuffix,
  getRegulationGoalLabel,
  getScenarioLabel,
} from "@/lib/context-catalog";
import {
  isValidPlaylistLength,
} from "@/lib/regulation-goals";
import { scoreVideo } from "@/lib/score";
import {
  createPlaylist,
  searchVideos,
  enrichViewCounts,
  addVideoToPlaylist,
  YouTubeApiError,
} from "@/lib/youtube";
import type {
  GenerateRequest,
  GenerateResponse,
  VideoItem,
} from "@/types/music";

type MoodMap = Record<string, { queries: string[] }>;

const MOODS = moodMap as MoodMap;

function buildSearchQueries(
  mood: string,
  scenario: string | undefined,
  causes: string[] | undefined,
  regulationGoal: string,
  selectedChannelNames: string[]
): string[] {
  const moodEntry = MOODS[mood];
  if (!moodEntry) return [];

  const queries: string[] = [...moodEntry.queries];

  if (scenario && isValidScenario(scenario)) {
    queries.push(scenarioSearchSuffix(scenario));
  }

  if (
    isValidMood(mood) &&
    isValidRegulationGoalForMood(regulationGoal, mood)
  ) {
    queries.push(goalSearchSuffix(regulationGoal));
  }

  if (causes?.includes("感情")) {
    queries.push("love heartbreak music");
  }
  if (causes?.includes("工作")) {
    queries.push("work stress chill music");
  }
  if (causes?.includes("人际")) {
    queries.push("friendship social music");
  }
  if (causes?.includes("家庭")) {
    queries.push("family home acoustic");
  }

  const channelQueries = selectedChannelNames
    .slice(0, 5)
    .map((name) => `${name} music`);
  queries.push(...channelQueries);

  return queries.slice(0, 8);
}

function collectKeywords(queries: string[]): string[] {
  const words = new Set<string>();
  for (const q of queries) {
    for (const part of q.replace(/"/g, "").split(/\s+/)) {
      if (part.length > 2) words.add(part.toLowerCase());
    }
  }
  return [...words];
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

  const searchQueries = buildSearchQueries(
    mood,
    scenario,
    causes,
    regulationGoal,
    selectedChannelNames
  );
  const keywords = collectKeywords(searchQueries);
  const selectedIdSet = new Set(selectedChannelIds);

  try {
    const videoMap = new Map<string, VideoItem>();

    for (const query of searchQueries) {
      const videos = await searchVideos(accessToken, query, 10);
      for (const video of videos) {
        if (!videoMap.has(video.id)) {
          videoMap.set(video.id, video);
        }
      }
    }

    if (videoMap.size === 0) {
      return NextResponse.json(
        { error: "没有找到合适的视频，请换几个频道或心情再试" },
        { status: 404 }
      );
    }

    let candidates = [...videoMap.values()];
    candidates = await enrichViewCounts(accessToken, candidates);

    const scored = candidates
      .map((video) => ({
        video,
        score: scoreVideo(video, selectedChannelNames, keywords),
        isSelectedChannel: selectedIdSet.has(video.channelId),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.video.viewCount ?? 0) - (a.video.viewCount ?? 0);
      });

    const topVideos = scored.slice(0, playlistLength).map((s) => s.video);

    const date = new Date().toISOString().slice(0, 10);
    const goalLabel = getRegulationGoalLabel(regulationGoal);
    const scenarioLabel = scenario ? getScenarioLabel(scenario) : null;
    const nameParts = ["MoodArc", mood];
    if (scenarioLabel) nameParts.push(scenarioLabel);
    nameParts.push(goalLabel, date);
    const playlistName = nameParts.join(" · ");
    const causeText = causes?.length ? causes.join("、") : "无";
    const channelText = selectedChannelNames.slice(0, 5).join("、");
    const description = [
      "MoodArc 生成",
      `心情：${mood}`,
      scenarioLabel ? `情境：${scenarioLabel}` : null,
      `目标：${goalLabel}`,
      `${playlistLength} 首`,
      `原因：${causeText}`,
      `频道：${channelText}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const playlist = await createPlaylist(
      accessToken,
      playlistName,
      description
    );

    for (const video of topVideos) {
      await addVideoToPlaylist(accessToken, playlist.id, video.id);
    }

    const response: GenerateResponse = {
      playlistUrl: playlist.url,
      playlistId: playlist.id,
      playlistName: playlist.title,
      scenario,
      regulationGoal,
      playlistLength,
      videos: topVideos.map((v) => ({
        name: v.name,
        channel: v.channelName,
        url: v.url,
      })),
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
