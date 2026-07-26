import {
  buildSequencedPlaylist,
  sequencedTracksToVideos,
} from "@/lib/generate-playlist";
import { resolveSequencedTracksToYouTube } from "@/lib/resolve-youtube-tracks";
import {
  addVideoToPlaylist,
  createPlaylist,
  YouTubeApiError,
} from "@/lib/youtube";
import type {
  GenerateResponse,
  PlaylistLength,
  RegulationGoalId,
  ScenarioId,
} from "@/types/music";

export class YouTubePlaylistEmptyError extends Error {
  constructor() {
    super("无法在 YouTube 上找到对应曲目");
    this.name = "YouTubePlaylistEmptyError";
  }
}

export async function generateYouTubePlaylist(
  accessToken: string,
  params: {
    mood: string;
    causes?: string[];
    selectedChannelNames: string[];
    regulationGoal: RegulationGoalId;
    playlistLength: PlaylistLength;
    scenario?: ScenarioId;
  }
): Promise<GenerateResponse> {
  const {
    mood,
    causes,
    selectedChannelNames,
    regulationGoal,
    playlistLength,
    scenario,
  } = params;

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

  const resolved = await resolveSequencedTracksToYouTube(accessToken, tracks);

  if (resolved.length === 0) {
    throw new YouTubePlaylistEmptyError();
  }

  const playlist = await createPlaylist(
    accessToken,
    playlistName,
    playlistDescription
  );

  for (const { video } of resolved) {
    await addVideoToPlaylist(accessToken, playlist.id, video.id);
  }

  return {
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
}

export function youtubeErrorMessage(err: unknown): string | null {
  if (err instanceof YouTubeApiError) {
    if (err.status === 401) return "Google 登录已过期";
    if (err.status === 403) {
      return "YouTube API 403（权限或配额）";
    }
    if (err.status === 429) return "YouTube API 配额用尽";
  }
  if (err instanceof YouTubePlaylistEmptyError) {
    return "YouTube 上未找到对应曲目";
  }
  return null;
}

export function shouldEmbedFallbackToNetease(err: unknown): boolean {
  return youtubeErrorMessage(err) !== null;
}
