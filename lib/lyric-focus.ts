import type { RegulationGoalId } from "@/lib/context-catalog";
import type { ArcSlotId } from "@/lib/arc-templates";
import type { DemoTrack } from "@/lib/demo-track-catalog";

/** 歌词主焦点：描述「词在讲什么」，与节奏 energy 独立 */
export type LyricFocus =
  | "grief" // 心碎、失去、告别
  | "longing" // 渴望、思念、依恋
  | "anger" // 愤怒、背叛、复仇
  | "bittersweet" // 酸涩交织、自嘲
  | "reflection" // 清醒复盘、成长
  | "hope" // 希望、释然、向前
  | "defiance" // 反击、叛逆、甩脱
  | "celebration" // 庆祝、享乐、派对
  | "flirt" // 暧昧、调情、甜蜜
  | "nostalgia" // 怀旧、回忆
  | "numbness" // 麻木、疏离
  | "introspection"; // 内耗、自我怀疑

export const LYRIC_FOCUS_LABELS: Record<LyricFocus, string> = {
  grief: "心碎",
  longing: "思念",
  anger: "愤怒",
  bittersweet: "酸涩",
  reflection: "复盘",
  hope: "希望",
  defiance: "叛逆",
  celebration: "庆祝",
  flirt: "暧昧",
  nostalgia: "怀旧",
  numbness: "麻木",
  introspection: "内耗",
};

export interface LyricSlotTarget {
  targetLyricFocus: LyricFocus[];
  targetLyricDirectness: [number, number];
}

export const ARC_LYRIC_TARGETS: Record<
  RegulationGoalId,
  Record<ArcSlotId, LyricSlotTarget>
> = {
  solace: {
    hold: {
      targetLyricFocus: ["grief", "longing", "introspection", "numbness"],
      targetLyricDirectness: [0.55, 1],
    },
    bridge: {
      targetLyricFocus: ["anger", "bittersweet", "grief", "nostalgia"],
      targetLyricDirectness: [0.45, 0.95],
    },
    lift: {
      targetLyricFocus: ["reflection", "hope", "bittersweet", "longing"],
      targetLyricDirectness: [0.35, 0.8],
    },
  },
  diversion: {
    hold: {
      targetLyricFocus: ["grief", "bittersweet", "longing", "nostalgia"],
      targetLyricDirectness: [0.4, 0.85],
    },
    bridge: {
      targetLyricFocus: ["defiance", "anger", "flirt", "bittersweet"],
      targetLyricDirectness: [0.45, 0.9],
    },
    lift: {
      targetLyricFocus: ["celebration", "flirt", "defiance", "hope"],
      targetLyricDirectness: [0.25, 0.75],
    },
  },
  revival: {
    hold: {
      targetLyricFocus: ["grief", "introspection", "longing", "numbness"],
      targetLyricDirectness: [0.5, 1],
    },
    bridge: {
      targetLyricFocus: ["defiance", "anger", "bittersweet", "reflection"],
      targetLyricDirectness: [0.45, 0.95],
    },
    lift: {
      targetLyricFocus: ["hope", "celebration", "defiance", "reflection"],
      targetLyricDirectness: [0.3, 0.8],
    },
  },
  celebrate: {
    hold: {
      targetLyricFocus: ["celebration", "flirt", "hope", "defiance"],
      targetLyricDirectness: [0.35, 0.8],
    },
    bridge: {
      targetLyricFocus: ["celebration", "flirt", "hope"],
      targetLyricDirectness: [0.3, 0.75],
    },
    lift: {
      targetLyricFocus: ["celebration", "defiance", "flirt"],
      targetLyricDirectness: [0.25, 0.7],
    },
  },
  energy: {
    hold: {
      targetLyricFocus: ["celebration", "defiance", "flirt"],
      targetLyricDirectness: [0.3, 0.75],
    },
    bridge: {
      targetLyricFocus: ["celebration", "defiance", "anger"],
      targetLyricDirectness: [0.35, 0.8],
    },
    lift: {
      targetLyricFocus: ["celebration", "defiance"],
      targetLyricDirectness: [0.25, 0.7],
    },
  },
  settle: {
    hold: {
      targetLyricFocus: ["reflection", "nostalgia", "bittersweet", "longing"],
      targetLyricDirectness: [0.35, 0.75],
    },
    bridge: {
      targetLyricFocus: ["longing", "reflection", "nostalgia", "grief"],
      targetLyricDirectness: [0.3, 0.7],
    },
    lift: {
      targetLyricFocus: ["reflection", "hope", "introspection", "nostalgia"],
      targetLyricDirectness: [0.2, 0.6],
    },
  },
};

function inRange(value: number, [lo, hi]: [number, number]): boolean {
  return value >= lo && value <= hi;
}

function rangeDistance(value: number, [lo, hi]: [number, number]): number {
  const mid = (lo + hi) / 2;
  return Math.abs(value - mid);
}

/** 歌词与弧线段的匹配分（约 0–5） */
export function scoreLyricForArcSlot(track: DemoTrack, slot: {
  targetLyricFocus: LyricFocus[];
  targetLyricDirectness: [number, number];
}): number {
  const focusList = slot.targetLyricFocus;
  const focusIndex = focusList.indexOf(track.lyricFocus);

  let score = 0;
  if (focusIndex >= 0) {
    score += (focusList.length - focusIndex) * 0.6;
  } else {
    score -= 1.2;
  }

  const directDist = rangeDistance(
    track.lyricDirectness,
    slot.targetLyricDirectness
  );
  score -= directDist * 2.5;
  if (inRange(track.lyricDirectness, slot.targetLyricDirectness)) {
    score += 1.2;
  }

  return score;
}

/** 按调节目标（无心情覆盖时） */
export function scoreLyricForSlot(
  track: DemoTrack,
  slotId: ArcSlotId,
  goal: RegulationGoalId
): number {
  const target = ARC_LYRIC_TARGETS[goal][slotId];
  const focusList = target.targetLyricFocus;
  const focusIndex = focusList.indexOf(track.lyricFocus);

  let score = 0;
  if (focusIndex >= 0) {
    score += (focusList.length - focusIndex) * 0.6;
  } else {
    score -= 1.2;
  }

  const directDist = rangeDistance(
    track.lyricDirectness,
    target.targetLyricDirectness
  );
  score -= directDist * 2.5;
  if (inRange(track.lyricDirectness, target.targetLyricDirectness)) {
    score += 1.2;
  }

  return score;
}
