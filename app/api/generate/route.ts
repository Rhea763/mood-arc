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
  youtubeErrorMessage,
} from "@/lib/youtube-playlist-generate";
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

/** YouTube 失败时统一 fallback 网易云（弧线打分不变） */
async function generateYouTubeOrNetease(
  accessToken: string | null,
  params: GenerateParams,
  opts: { requireLogin: boolean }
): Promise<NextResponse> {
  if (!accessToken) {
    if (opts.requireLogin) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
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
    const detail = youtubeErrorMessage(err);
    if (detail) {
      console.warn("YouTube fallback to Netease:", detail, err);
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        neteaseFallback(params, `${detail}，已改用网易云试听`)
      );
    }
    console.error("generate error:", err);
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      neteaseFallback(params, "YouTube 生成异常，已改用网易云试听")
    );
  }
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

  // 主站 + 嵌入页：YouTube 优先，配额/登录/搜索失败 → 网易云备选
  return generateYouTubeOrNetease(accessToken, params, {
    requireLogin: !embedMode && !accessToken,
  });
}
