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
  qqPlaylistSearchUrl,
  qqTrackSearchUrl,
} from "@/lib/play-links";
import { buildSequencedPlaylist } from "@/lib/generate-playlist";
import { enrichVideoWithEmotionContext } from "@/lib/enrich-videos";
import type { EmotionId, IntentionId } from "@/types/emotion";

export const MOCK_CHANNELS = [
  { id: "ch1", name: "Taylor Swift", url: "#", source: "subscribed" as const },
  { id: "ch2", name: "Ariana Grande", url: "#", source: "subscribed" as const },
  { id: "ch3", name: "Lana Del Rey", url: "#", source: "subscribed" as const },
  { id: "ch4", name: "Olivia Rodrigo", url: "#", source: "both" as const },
  { id: "ch5", name: "Sabrina Carpenter", url: "#", source: "liked" as const },
  { id: "ch6", name: "Charli XCX", url: "#", source: "liked" as const },
  { id: "ch7", name: "Gracie Abrams", url: "#", source: "subscribed" as const },
  { id: "ch8", name: "SZA", url: "#", source: "subscribed" as const },
  { id: "ch9", name: "Adele", url: "#", source: "liked" as const },
  { id: "ch10", name: "周杰伦", url: "#", source: "liked" as const },
  { id: "ch11", name: "刘若英", url: "#", source: "liked" as const },
  { id: "ch12", name: "毛不易", url: "#", source: "liked" as const },
  { id: "ch13", name: "Beyond", url: "#", source: "subscribed" as const },
  { id: "ch14", name: "Clairo", url: "#", source: "liked" as const },
  { id: "ch15", name: "Billie Eilish", url: "#", source: "subscribed" as const },
  { id: "ch16", name: "Lorde", url: "#", source: "liked" as const },
  { id: "ch17", name: "Chappell Roan", url: "#", source: "liked" as const },
  { id: "ch18", name: "Conan Gray", url: "#", source: "liked" as const },
  { id: "ch19", name: "Phoebe Bridgers", url: "#", source: "subscribed" as const },
  { id: "ch20", name: "Frank Ocean", url: "#", source: "subscribed" as const },
  { id: "ch21", name: "JVKE", url: "#", source: "liked" as const },
  { id: "ch22", name: "Jimin", url: "#", source: "liked" as const },
  { id: "ch23", name: "Joji", url: "#", source: "liked" as const },
  { id: "ch24", name: "Jung Kook", url: "#", source: "liked" as const },
  { id: "ch25", name: "NewJeans", url: "#", source: "liked" as const },
  { id: "ch26", name: "Post Malone", url: "#", source: "liked" as const },
  { id: "ch27", name: "Stephen Sanchez", url: "#", source: "liked" as const },
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
  scenario?: ScenarioId,
  opts?: {
    intensity?: number;
    emotion?: EmotionId;
    intention?: IntentionId;
  }
): GenerateResponse {
  const intensity = opts?.intensity ?? 5;
  const emotion = opts?.emotion;
  const intention = opts?.intention;

  const { interpretation, plan, tracks, playlistName, summary } =
    buildSequencedPlaylist(
      mood,
      causes,
      selectedChannelNames,
      regulationGoal,
      playlistLength,
      scenario,
      intensity
    );

  const videos = tracks.map((track) => {
    const songId = getNeteaseSongId(track.artist, track.title);
    const enrich =
      emotion && intention
        ? enrichVideoWithEmotionContext(
            track,
            emotion,
            intensity,
            intention,
            regulationGoal
          )
        : {};
    return {
      name: track.title,
      channel: track.artist,
      url: neteaseTrackPlayUrl(track.artist, track.title),
      neteaseSongId: songId ?? undefined,
      neteaseEmbedUrl: songId ? neteaseTrackEmbedUrl(songId) : undefined,
      qqUrl: qqTrackSearchUrl(track.artist, track.title),
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
      ...enrich,
    };
  });

  return {
    playlistId: "mock-demo-playlist",
    playlistName,
    playlistUrl: neteasePlaylistSearchUrl(playlistName),
    qqPlaylistUrl: qqPlaylistSearchUrl(playlistName),
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
