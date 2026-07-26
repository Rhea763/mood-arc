import profiles from "@/data/track-emotion-profiles.json";
import type { TrackEmotionProfile } from "@/types/track-profile";

const ALL_PROFILES = profiles as TrackEmotionProfile[];

const profileKey = (title: string, artist: string) =>
  `${artist.trim().toLowerCase()}::${title.trim().toLowerCase()}`;

const PROFILE_MAP = new Map(
  ALL_PROFILES.map((p) => [profileKey(p.title, p.artist), p])
);

export function getTrackProfile(
  title: string,
  artist: string
): TrackEmotionProfile | undefined {
  return PROFILE_MAP.get(profileKey(title, artist));
}

export function allTrackProfiles(): TrackEmotionProfile[] {
  return ALL_PROFILES;
}

/** Map rich profile tags → arc-scoring tag vocabulary */
export function scoringTagsFromProfile(profile: TrackEmotionProfile): string[] {
  const tags = new Set(profile.tags);
  const fn = profile.regulation.function;

  if (["comfort", "solace", "validation", "soothing"].includes(fn)) {
    tags.add("solace");
  }
  if (["catharsis", "release"].includes(fn)) {
    tags.add("diversion");
    if (profile.primaryEmotion === "anger" || profile.primaryEmotion === "grief") {
      tags.add("anger");
    }
  }
  if (["processing", "reflection", "catharsis"].includes(fn)) {
    tags.add("solace");
  }
  if (["energy", "motivation", "celebration"].includes(fn)) {
    tags.add("energy");
    tags.add("uptempo");
  }
  if (fn === "celebration") tags.add("celebrate");
  if (fn === "distraction") tags.add("diversion");
  if (fn === "healing" || fn === "settling" || fn === "nostalgia") {
    tags.add("settle");
  }
  if (fn === "revival" || fn === "motivation") tags.add("revival");

  if (profile.primaryEmotion === "grief" || profile.primaryEmotion === "heartbreak") {
    tags.add("heartbreak");
  }
  if (profile.primaryEmotion === "love" || profile.primaryEmotion === "happiness") {
    tags.add("romance");
  }
  if (profile.energy >= 0.75) tags.add("uptempo");
  if (profile.valence <= 0.35) tags.add("bittersweet");

  return [...tags];
}

export function recommendationNoteFromProfile(
  profile: TrackEmotionProfile
): string {
  const core =
    profile.emotionalMeaning?.coreFeeling ??
    `${profile.primaryEmotion} with ${profile.secondaryEmotion ?? "mixed"} undertones`;
  return core;
}
