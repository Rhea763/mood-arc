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
  /** Calendar iframe: arc demo without YouTube token */
  embed?: boolean;
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
  note?: string;
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
}
