import type { DemoTrack } from "@/lib/demo-track-catalog";
import type {
  EmotionArcProfile,
  ListenerContext,
  RegulationProfile,
  SongEmotionData,
} from "@/types/emotion";
import type { LyricFocus } from "@/lib/lyric-focus";

const LYRIC_TO_EMOTION: Record<LyricFocus, string> = {
  grief: "sadness",
  longing: "longing",
  anger: "anger",
  introspection: "reflection",
  defiance: "defiance",
  hope: "hope",
  flirt: "warmth",
  celebration: "joy",
  bittersweet: "bittersweet",
  nostalgia: "nostalgia",
  numbness: "numbness",
  reflection: "reflection",
};

function regulationFromTags(track: DemoTrack): RegulationProfile {
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

function arcFromTrack(track: DemoTrack): EmotionArcProfile {
  const lowEnergy = 1 - track.energy;
  const lowValence = 1 - track.valence;
  let hold = lowEnergy * 0.45 + lowValence * 0.55;
  let bridge =
    Math.abs(track.energy - 0.5) * 0.4 +
    Math.abs(track.valence - 0.45) * 0.35 +
    (track.phaseFit === "bridge" || track.phaseFit === "climax" ? 0.25 : 0);
  let lift = track.energy * 0.45 + track.valence * 0.55;

  if (track.phaseFit === "verse") hold += 0.12;
  if (track.phaseFit === "bridge") bridge += 0.15;
  if (track.phaseFit === "chorus" || track.phaseFit === "climax") lift += 0.12;

  const sum = hold + bridge + lift || 1;
  return {
    hold: Math.round((hold / sum) * 100) / 100,
    bridge: Math.round((bridge / sum) * 100) / 100,
    lift: Math.round((lift / sum) * 100) / 100,
  };
}

function listenerContextFromTrack(track: DemoTrack): ListenerContext {
  const bestFor: string[] = [];
  const avoidWhen: string[] = [];

  if (track.tags.includes("solace") || track.lyricDirectness >= 0.75) {
    bestFor.push("processing feelings", "needing validation");
  }
  if (track.tags.includes("heartbreak")) {
    bestFor.push("heartbreak", "relationship endings");
  }
  if (track.tags.includes("loneliness")) {
    bestFor.push("feeling alone");
  }
  if (track.tags.includes("uptempo") && track.valence >= 0.55) {
    bestFor.push("wanting a lift", "celebration");
  }
  if (track.tags.includes("settle") || track.energy <= 0.35) {
    bestFor.push("winding down", "quiet evenings");
  }

  if (track.energy >= 0.85 && track.tags.includes("party")) {
    avoidWhen.push("deep grief", "overwhelm");
  }
  if (track.lyricDirectness >= 0.85 && track.valence <= 0.3) {
    avoidWhen.push("wanting distraction only");
  }
  if (track.tags.includes("anger") && track.energy >= 0.7) {
    avoidWhen.push("seeking soft comfort");
  }
  if (track.valence >= 0.8 && track.energy >= 0.75) {
    avoidWhen.push("raw sadness at high intensity");
  }

  return {
    bestFor: bestFor.length ? bestFor : ["reflective listening"],
    avoidWhen,
  };
}

export function buildSongEmotionData(track: DemoTrack): SongEmotionData {
  const primary = LYRIC_TO_EMOTION[track.lyricFocus] ?? "mixed";
  const secondary =
    track.tags.includes("heartbreak")
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
    regulation: regulationFromTags(track),
    emotionArc: arcFromTrack(track),
    listenerContext: listenerContextFromTrack(track),
  };
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
