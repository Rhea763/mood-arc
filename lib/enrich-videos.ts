import type { RegulationGoalId } from "@/lib/context-catalog";
import { DEMO_TRACKS, getTrackByTitle } from "@/lib/demo-track-catalog";
import {
  buildRecommendationReason,
  computeEmotionMatch,
} from "@/lib/emotion-match";
import type { EmotionId, IntentionId } from "@/types/emotion";
import type { SequencedTrack } from "@/lib/playlist-sequencer";
import type { GenerateVideo } from "@/types/music";

export function enrichVideoWithEmotionContext(
  track: SequencedTrack,
  emotion: EmotionId,
  intensity: number,
  intention: IntentionId,
  goal: RegulationGoalId
): Pick<GenerateVideo, "reason" | "emotionMatch"> {
  const demoTrack = getTrackByTitle(track.title);
  if (!demoTrack) {
    return {
      reason: track.note,
      emotionMatch: {
        sadness: 50,
        comfort: 50,
        energy: Math.round(track.energy * 100),
        validation: 50,
        processing: 50,
      },
    };
  }
  return {
    reason: buildRecommendationReason(
      demoTrack,
      emotion,
      intensity,
      intention,
      goal
    ),
    emotionMatch: computeEmotionMatch(demoTrack, emotion, intensity, goal),
  };
}

export function enrichVideosFromTracks(
  tracks: SequencedTrack[],
  emotion: EmotionId,
  intensity: number,
  intention: IntentionId,
  goal: RegulationGoalId
): Array<Pick<GenerateVideo, "reason" | "emotionMatch">> {
  return tracks.map((track) =>
    enrichVideoWithEmotionContext(track, emotion, intensity, intention, goal)
  );
}

/** Lookup catalog track count for diagnostics */
export function catalogTrackCount(): number {
  return DEMO_TRACKS.length;
}
