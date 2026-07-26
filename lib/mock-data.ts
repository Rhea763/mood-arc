import type {
  GenerateResponse,
  PlaylistLength,
  TasteResponse,
} from "@/types/music";
import type { RegulationGoalId, ScenarioId } from "@/lib/context-catalog";
import { getNeteaseSongId } from "@/lib/netease-ids";
import {
  neteaseTrackEmbedUrl,
  neteaseTrackPlayUrl,
  neteasePlaylistSearchUrl,
} from "@/lib/play-links";
import { buildSequencedPlaylist } from "@/lib/generate-playlist";

export const MOCK_CHANNELS = [
  { id: "ch1", name: "Taylor Swift", url: "#", source: "subscribed" as const },
  { id: "ch2", name: "Ariana Grande", url: "#", source: "subscribed" as const },
  { id: "ch3", name: "Lana Del Rey", url: "#", source: "subscribed" as const },
  { id: "ch4", name: "Olivia Rodrigo", url: "#", source: "both" as const },
  { id: "ch5", name: "Sabrina Carpenter", url: "#", source: "liked" as const },
  { id: "ch6", name: "Charli XCX", url: "#", source: "liked" as const },
  { id: "ch7", name: "Gracie Abrams", url: "#", source: "subscribed" as const },
];

export function getMockTaste(): TasteResponse {
  return {
    user: { id: "demo-user", name: "演示用户" },
    channels: MOCK_CHANNELS,
  };
}

export function getMockGenerate(
  mood: string,
  causes: string[] | undefined,
  selectedChannelNames: string[],
  regulationGoal: RegulationGoalId,
  playlistLength: PlaylistLength,
  scenario?: ScenarioId
): GenerateResponse {
  const { interpretation, plan, tracks, playlistName, summary } =
    buildSequencedPlaylist(
      mood,
      causes,
      selectedChannelNames,
      regulationGoal,
      playlistLength,
      scenario
    );

  const videos = tracks.map((track) => {
    const songId = getNeteaseSongId(track.artist, track.title);
    return {
    name: track.title,
    channel: track.artist,
    url: neteaseTrackPlayUrl(track.artist, track.title),
    neteaseSongId: songId ?? undefined,
    neteaseEmbedUrl: songId ? neteaseTrackEmbedUrl(songId) : undefined,
    phase: track.phase,
    phaseLabel: track.phaseLabel,
    energy: track.energy,
    valence: track.valence,
    lyricFocus: track.lyricFocus,
    lyricFocusLabel: track.lyricFocusLabel,
    lyricDirectness: track.lyricDirectness,
    vocalTimbre: track.vocalTimbre,
    vocalTimbreLabel: track.vocalTimbreLabel,
    note: track.note,
  };
  });

  return {
    playlistId: "mock-demo-playlist",
    playlistName,
    playlistUrl: neteasePlaylistSearchUrl(playlistName),
    videos,
    mock: true,
    scenario,
    regulationGoal,
    playlistLength,
    interpretation: interpretation.narrative,
    summary,
    arcSlots: plan.slots.map((s) => ({
      id: s.id,
      label: s.label,
      hint: s.hint,
    })),
  };
}
