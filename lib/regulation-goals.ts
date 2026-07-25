export {
  NEGATIVE_REGULATION_GOALS,
  POSITIVE_REGULATION_GOALS,
  type RegulationGoalId,
  type NegativeRegulationGoalId,
  type PositiveRegulationGoalId,
  isValidRegulationGoal,
  isValidRegulationGoalForMood,
  getRegulationGoalLabel,
  goalSearchSuffix,
  getGoalsForMood,
  getMoodValence,
} from "@/lib/context-catalog";

export const PLAYLIST_LENGTH_OPTIONS = [8, 12, 15, 20] as const;

export type PlaylistLength = (typeof PLAYLIST_LENGTH_OPTIONS)[number];

export const DEFAULT_PLAYLIST_LENGTH: PlaylistLength = 12;

export function isValidPlaylistLength(n: number): n is PlaylistLength {
  return PLAYLIST_LENGTH_OPTIONS.includes(n as PlaylistLength);
}
