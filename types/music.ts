import type { RegulationGoalId, ScenarioId } from "@/lib/context-catalog";

export type { RegulationGoalId, ScenarioId };

export type PlaylistLength = 8 | 12 | 15 | 20;

export interface TasteChannel {
  id: string;
  name: string;
  url: string;
  source: "subscribed" | "liked" | "both";
}

export interface TasteResponse {
  user: { id: string; name: string };
  channels: TasteChannel[];
}

export interface VideoItem {
  id: string;
  name: string;
  url: string;
  channelId: string;
  channelName: string;
  viewCount?: number;
}

export interface GenerateRequest {
  mood: string;
  scenario?: ScenarioId;
  causes?: string[];
  regulationGoal: RegulationGoalId;
  playlistLength: PlaylistLength;
  selectedChannelIds: string[];
  selectedChannelNames: string[];
  /** Calendar iframe: prefer YouTube, fallback Netease on failure */
  embed?: boolean;
  /** 1–10 emotional intensity */
  intensity?: number;
  /** Product emotion id (sad, anxious, …) */
  emotion?: string;
  /** User intention (process, comfort, …) */
  intention?: string;
}

export interface GenerateVideo {
  name: string;
  channel: string;
  url: string;
  phase?: string;
  phaseLabel?: string;
  energy?: number;
  valence?: number;
  lyricFocus?: string;
  lyricFocusLabel?: string;
  lyricDirectness?: number;
  vocalTimbre?: string;
  vocalTimbreLabel?: string;
  neteaseSongId?: number;
  neteaseEmbedUrl?: string;
  qqUrl?: string;
  note?: string;
  /** Why this song fits the user's mood + intention */
  reason?: string;
  emotionMatch?: {
    sadness: number;
    comfort: number;
    energy: number;
    validation: number;
    processing: number;
  };
}

export interface PlaylistArcSlot {
  id: string;
  label: string;
  hint: string;
}

export interface GenerateResponse {
  playlistUrl: string;
  playlistId: string;
  playlistName: string;
  videos: GenerateVideo[];
  mock?: boolean;
  summary?: string;
  interpretation?: string;
  scenario?: ScenarioId;
  regulationGoal?: RegulationGoalId;
  playlistLength?: PlaylistLength;
  arcSlots?: PlaylistArcSlot[];
  /** Embed: YouTube failed and Netease demo was used instead */
  fallbackReason?: string;
  qqPlaylistUrl?: string;
}
