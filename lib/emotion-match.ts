import type { RegulationGoalId } from "@/lib/context-catalog";
import type { DemoTrack } from "@/lib/demo-track-catalog";
import { getTrackProfile } from "@/lib/track-profiles";
import { buildSongEmotionData } from "@/lib/song-emotion";
import type { EmotionId, EmotionMatchScores, IntentionId } from "@/types/emotion";
import { getEmotion } from "@/lib/emotion-catalog";

const GOAL_PREFERS: Record<
  RegulationGoalId,
  { functions: string[]; arc: "hold" | "bridge" | "lift" }
> = {
  solace: { functions: ["solace", "validation", "comfort"], arc: "hold" },
  diversion: { functions: ["diversion", "release", "catharsis"], arc: "lift" },
  revival: { functions: ["revival", "processing", "motivation"], arc: "bridge" },
  celebrate: { functions: ["celebration", "motivation"], arc: "lift" },
  energy: { functions: ["energy", "motivation"], arc: "lift" },
  settle: { functions: ["settle", "processing", "healing", "comfort"], arc: "hold" },
};

const EMOTION_AFFINITY: Record<
  EmotionId,
  { sadness: number; comfort: number; energy: number }
> = {
  sad: { sadness: 1, comfort: 0.85, energy: 0.15 },
  anxious: { sadness: 0.55, comfort: 0.75, energy: 0.35 },
  lonely: { sadness: 0.75, comfort: 0.9, energy: 0.2 },
  stressed: { sadness: 0.45, comfort: 0.7, energy: 0.5 },
  heartbroken: { sadness: 0.95, comfort: 0.85, energy: 0.1 },
  nostalgic: { sadness: 0.65, comfort: 0.75, energy: 0.25 },
  calm: { sadness: 0.2, comfort: 0.85, energy: 0.25 },
  happy: { sadness: 0.1, comfort: 0.6, energy: 0.85 },
  energetic: { sadness: 0.05, comfort: 0.35, energy: 0.95 },
};

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeEmotionMatch(
  track: DemoTrack,
  emotion: EmotionId,
  intensity: number,
  goal: RegulationGoalId
): EmotionMatchScores {
  const profile = getTrackProfile(track.title, track.artist);
  if (profile) {
    const m = profile.matchingSignals;
    const intensityFactor = 0.75 + intensity / 40;
    return {
      sadness: clampPct(
        (1 - profile.valence) * 70 * EMOTION_AFFINITY[emotion].sadness * intensityFactor * 0.5
      ),
      comfort: clampPct(m.comfortSeeking * 100 * EMOTION_AFFINITY[emotion].comfort),
      energy: clampPct(m.energySeeking * 100 * EMOTION_AFFINITY[emotion].energy),
      validation: clampPct(m.comfortSeeking * 85 * intensityFactor * 0.55),
      processing: clampPct(m.reflectionSeeking * 100 * 0.55),
    };
  }

  const profileData = buildSongEmotionData(track);
  const pref = GOAL_PREFERS[goal];
  const affinity = EMOTION_AFFINITY[emotion];
  const intensityFactor = 0.75 + intensity / 40;

  const sadnessBase =
    (1 - track.valence) * 55 +
    (profileData.emotion.primaryEmotion === "sadness" ? 25 : 0) +
    (profileData.emotion.primaryEmotion === "heartbreak" ? 20 : 0);
  const comfortBase =
    (profileData.regulation.function === "solace" ||
    profileData.regulation.function === "validation" ||
    profileData.regulation.function === "comfort"
      ? 35
      : 0) +
    (track.tags.includes("solace") ? 30 : 0) +
    (1 - track.energy) * 20 +
    profileData.emotionArc.hold * 25;
  const energyBase = track.energy * 55 + profileData.emotionArc.lift * 30;
  const validationBase =
    (profileData.regulation.function === "validation" ||
    profileData.regulation.function === "solace" ||
    profileData.regulation.function === "comfort"
      ? 40
      : 0) +
    track.lyricDirectness * 35;
  const processingBase =
    (profileData.regulation.function === "processing" ? 35 : 0) +
    track.lyricDirectness * 25 +
    profileData.emotionArc.bridge * 25;

  const goalFnBoost = pref.functions.includes(profileData.regulation.function)
    ? 18
    : 0;
  const arcBoost = profileData.emotionArc[pref.arc] * 22;

  return {
    sadness: clampPct(sadnessBase * affinity.sadness * intensityFactor * 0.45),
    comfort: clampPct(
      (comfortBase + goalFnBoost + arcBoost) * affinity.comfort * 0.55
    ),
    energy: clampPct(energyBase * affinity.energy * (2 - intensityFactor * 0.35)),
    validation: clampPct(validationBase * intensityFactor * 0.6),
    processing: clampPct(processingBase * 0.55),
  };
}

export function buildRecommendationReason(
  track: DemoTrack,
  emotion: EmotionId,
  intensity: number,
  intention: IntentionId,
  goal: RegulationGoalId
): string {
  const rich = getTrackProfile(track.title, track.artist);
  if (rich?.emotionalMeaning?.coreFeeling) {
    const emotionMeta = getEmotion(emotion);
    return `Recommended because you're feeling ${emotionMeta.labelEn.toLowerCase()} (${intensity}/10) — ${rich.emotionalMeaning.coreFeeling}`;
  }

  const profile = buildSongEmotionData(track);
  const emotionMeta = getEmotion(emotion);
  const intensityWord =
    intensity >= 8 ? "intense" : intensity >= 5 ? "present" : "gentle";

  const intentionPhrases: Record<IntentionId, string> = {
    process: "helps you sit with what you feel",
    comfort: "offers emotional validation and warmth",
    distraction: "gently shifts your attention",
    energy: "supports a gradual return of energy",
    celebrate: "keeps the good feeling close",
  };

  const arcHint =
    goal === "solace" || goal === "settle"
      ? `Its ${profile.emotionArc.hold >= 0.4 ? "steady" : "soft"} tone matches a need to feel held.`
      : goal === "revival"
        ? "It bridges where you are toward something lighter."
        : goal === "diversion"
          ? "The rhythm gives your mind somewhere else to land."
          : "It fits the lift you're looking for.";

  return `Recommended because you're feeling ${emotionMeta.labelEn.toLowerCase()} (${intensityWord}, ${intensity}/10) and want to ${intention.replace("_", " ")} — this song ${intentionPhrases[intention]}. ${arcHint}`;
}

export function topMatchLabel(scores: EmotionMatchScores): string {
  const entries: [string, number][] = [
    ["Sadness", scores.sadness],
    ["Comfort", scores.comfort],
    ["Energy", scores.energy],
    ["Validation", scores.validation],
    ["Processing", scores.processing],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}
