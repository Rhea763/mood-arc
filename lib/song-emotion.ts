import type { DemoTrack } from "@/lib/demo-track-catalog";
import {
  getTrackProfile,
  recommendationNoteFromProfile,
  scoringTagsFromProfile,
} from "@/lib/track-profiles";
import type {
  EmotionArcProfile,
  ListenerContext,
  RegulationProfile,
  SongEmotionData,
} from "@/types/emotion";

export function buildSongEmotionData(track: DemoTrack): SongEmotionData {
  const profile = getTrackProfile(track.title, track.artist);
  if (profile) {
    return {
      title: track.title,
      artist: track.artist,
      emotion: {
        primaryEmotion: profile.primaryEmotion,
        secondaryEmotion: profile.secondaryEmotion,
      },
      regulation: {
        function: profile.regulation.function,
        targetState: profile.regulation.targetState,
      },
      emotionArc: {
        hold: profile.emotionArc.hold,
        bridge: profile.emotionArc.bridge,
        lift: profile.emotionArc.lift,
      },
      listenerContext: {
        bestFor: profile.listenerContext.bestFor,
        avoidWhen: profile.listenerContext.avoidWhen,
      },
    };
  }

  return buildSongEmotionDataFromLegacy(track);
}

function buildSongEmotionDataFromLegacy(track: DemoTrack): SongEmotionData {
  const primary = track.lyricFocus;
  const secondary = track.tags.includes("heartbreak")
    ? "heartbreak"
    : track.tags.includes("hope")
      ? "hope"
      : track.valence >= 0.6
        ? "warmth"
        : undefined;

  return {
    title: track.title,
    artist: track.artist,
    emotion: { primaryEmotion: primary, secondaryEmotion: secondary },
    regulation: regulationFromLegacyTags(track),
    emotionArc: arcFromLegacyTrack(track),
    listenerContext: listenerContextFromLegacy(track),
  };
}

function regulationFromLegacyTags(track: DemoTrack): RegulationProfile {
  if (track.tags.includes("solace")) {
    return { function: "solace", targetState: "held" };
  }
  if (track.tags.includes("diversion")) {
    return { function: "diversion", targetState: "lighter" };
  }
  if (track.tags.includes("revival")) {
    return { function: "revival", targetState: "hopeful" };
  }
  if (track.tags.includes("celebrate")) {
    return { function: "celebration", targetState: "elevated" };
  }
  if (track.tags.includes("settle")) {
    return { function: "settle", targetState: "calm" };
  }
  if (track.tags.includes("energy")) {
    return { function: "energy", targetState: "activated" };
  }
  if (track.valence < 0.35) {
    return { function: "validation", targetState: "seen" };
  }
  return { function: "processing", targetState: "aware" };
}

function arcFromLegacyTrack(track: DemoTrack): EmotionArcProfile {
  const lowEnergy = 1 - track.energy;
  const lowValence = 1 - track.valence;
  let hold = lowEnergy * 0.45 + lowValence * 0.55;
  let bridge =
    Math.abs(track.energy - 0.5) * 0.4 +
    Math.abs(track.valence - 0.45) * 0.35;
  let lift = track.energy * 0.45 + track.valence * 0.55;
  const sum = hold + bridge + lift || 1;
  return {
    hold: Math.round((hold / sum) * 100) / 100,
    bridge: Math.round((bridge / sum) * 100) / 100,
    lift: Math.round((lift / sum) * 100) / 100,
  };
}

function listenerContextFromLegacy(track: DemoTrack): ListenerContext {
  const bestFor: string[] = [];
  const avoidWhen: string[] = [];
  if (track.tags.includes("solace")) {
    bestFor.push("processing feelings", "needing validation");
  }
  if (track.tags.includes("heartbreak")) {
    bestFor.push("heartbreak", "relationship endings");
  }
  return {
    bestFor: bestFor.length ? bestFor : ["reflective listening"],
    avoidWhen,
  };
}

/** Merge profile scoring tags onto a catalog track for arc selection */
export function effectiveTrackTags(track: DemoTrack): string[] {
  const profile = getTrackProfile(track.title, track.artist);
  if (profile) return scoringTagsFromProfile(profile);
  return track.tags;
}

export function effectiveTrackNote(track: DemoTrack): string {
  const profile = getTrackProfile(track.title, track.artist);
  if (profile) return recommendationNoteFromProfile(profile);
  return track.note;
}

export function getSongEmotionData(
  title: string,
  artist: string,
  catalog: DemoTrack[] = []
): SongEmotionData | null {
  const track = catalog.find((t) => t.title === title && t.artist === artist);
  if (!track) return null;
  return buildSongEmotionData(track);
}
