/** Rich emotion metadata for a catalog track (source: track-emotion-profiles.json) */
export interface TrackEmotionProfile {
  title: string;
  artist: string;
  language?: string;
  primaryEmotion: string;
  secondaryEmotion?: string;
  energy: number;
  valence: number;
  emotionalIntensity?: number;
  lyricDirectness: number;
  /** Scoring tags aligned with playlist-sequencer + emotionTags */
  tags: string[];
  regulation: {
    function: string;
    targetState: string;
  };
  matchingSignals: {
    comfortSeeking: number;
    reflectionSeeking: number;
    energySeeking: number;
    distractionSeeking: number;
  };
  emotionArc: {
    hold: number;
    bridge: number;
    lift: number;
  };
  listenerContext: {
    bestFor: string[];
    avoidWhen: string[];
  };
  emotionalMeaning?: {
    coreFeeling?: string;
    underlyingNeed?: string;
    emotionalFunction?: string;
  };
}
