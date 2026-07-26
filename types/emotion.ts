import type { RegulationGoalId } from "@/lib/context-catalog";
import type { MoodId } from "@/lib/context-catalog";

/** Product-facing emotion ids (English) mapped to internal mood labels */
export type EmotionId =
  | "sad"
  | "anxious"
  | "lonely"
  | "stressed"
  | "calm"
  | "happy"
  | "energetic"
  | "nostalgic"
  | "heartbroken";

export type IntentionId =
  | "process"
  | "comfort"
  | "distraction"
  | "energy"
  | "celebrate";

export interface EmotionProfile {
  primaryEmotion: string;
  secondaryEmotion?: string;
}

export interface RegulationProfile {
  function: string;
  targetState: string;
}

export interface EmotionArcProfile {
  hold: number;
  bridge: number;
  lift: number;
}

export interface ListenerContext {
  bestFor: string[];
  avoidWhen: string[];
}

export interface SongEmotionData {
  title: string;
  artist: string;
  emotion: EmotionProfile;
  regulation: RegulationProfile;
  emotionArc: EmotionArcProfile;
  listenerContext: ListenerContext;
}

export interface EmotionMatchScores {
  sadness: number;
  comfort: number;
  energy: number;
  validation: number;
  processing: number;
}

export interface RecommendedSongSnapshot {
  title: string;
  artist: string;
  url?: string;
  reason?: string;
  emotionMatch?: EmotionMatchScores;
}

export interface MoodSnapshot {
  emotion: EmotionId;
  intensity: number;
  intention: IntentionId;
  /** Internal mood id used by arc scorer */
  moodId: MoodId;
  regulationGoal: RegulationGoalId;
}

export interface MoodRecord {
  id: string;
  date: string;
  emotion: EmotionId;
  intensity: number;
  intention: IntentionId;
  moodId: MoodId;
  regulationGoal: RegulationGoalId;
  recommendedSongs: RecommendedSongSnapshot[];
  playlistName?: string;
  beforeMood: MoodSnapshot;
  afterMood?: MoodSnapshot;
  createdAt: string;
  updatedAt: string;
}
