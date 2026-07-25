import type { RegulationGoalId, MoodId } from "@/lib/context-catalog";
import { isValidMood } from "@/lib/context-catalog";
import {
  ARC_LYRIC_TARGETS,
  type LyricFocus,
} from "@/lib/lyric-focus";
import { applyMoodArcOverrides } from "@/lib/mood-arc-overrides";
import type { VocalTimbre } from "@/lib/vocal-timbre";

export type ArcSlotId = "hold" | "bridge" | "lift";

export interface ArcSlot {
  id: ArcSlotId;
  label: string;
  hint: string;
  targetEnergy: [number, number];
  targetValence: [number, number];
  targetLyricFocus: LyricFocus[];
  targetLyricDirectness: [number, number];
  targetVocalTimbre: VocalTimbre[];
  count: number;
}

export interface ArcPlan {
  slots: ArcSlot[];
}

type ArcSlotBase = Omit<
  ArcSlot,
  "targetLyricFocus" | "targetLyricDirectness" | "targetVocalTimbre"
>;

const ARC_VOCAL_TIMBRE_TARGETS: Record<
  RegulationGoalId,
  Record<ArcSlotId, VocalTimbre[]>
> = {
  solace: {
    hold: ["breathy_hushed", "ethereal_float", "soft_warm"],
    bridge: ["soft_warm", "ethereal_float", "cool_sharp"],
    lift: ["soft_warm", "clear_bright", "ethereal_float"],
  },
  diversion: {
    hold: ["soft_warm", "breathy_hushed", "ethereal_float"],
    bridge: ["clear_bright", "playful_bounce", "cool_sharp"],
    lift: ["playful_bounce", "clear_bright", "power_belt"],
  },
  revival: {
    hold: ["breathy_hushed", "ethereal_float", "soft_warm"],
    bridge: ["soft_warm", "clear_bright", "cool_sharp"],
    lift: ["clear_bright", "playful_bounce", "power_belt"],
  },
  celebrate: {
    hold: ["clear_bright", "playful_bounce", "soft_warm"],
    bridge: ["playful_bounce", "clear_bright", "theatrical_bold"],
    lift: ["playful_bounce", "power_belt", "clear_bright"],
  },
  energy: {
    hold: ["clear_bright", "power_belt", "playful_bounce"],
    bridge: ["power_belt", "clear_bright", "cool_sharp"],
    lift: ["power_belt", "playful_bounce", "clear_bright"],
  },
  settle: {
    hold: ["soft_warm", "ethereal_float", "breathy_hushed"],
    bridge: ["ethereal_float", "soft_warm", "breathy_hushed"],
    lift: ["breathy_hushed", "ethereal_float", "soft_warm"],
  },
};

function splitLength(length: number): [number, number, number] {
  if (length <= 6) return [2, Math.floor(length / 2), length - 2 - Math.floor(length / 2)];
  const a = Math.floor(length / 3);
  const b = Math.floor(length / 3);
  const c = length - a - b;
  return [a, b, c];
}

/** 按调节目标 + 可选心情生成三段弧线目标区间 */
export function buildArcPlan(
  goal: RegulationGoalId,
  length: number,
  mood?: string
): ArcPlan {
  const [holdN, bridgeN, liftN] = splitLength(length);

  const plans: Record<RegulationGoalId, ArcSlotBase[]> = {
    solace: [
      {
        id: "hold",
        label: "缓缓",
        hint: "先贴住此刻的情绪，不急着拉嗨",
        targetEnergy: [0.1, 0.4],
        targetValence: [0.1, 0.35],
        count: holdN,
      },
      {
        id: "bridge",
        label: "过渡",
        hint: "情绪仍真实，但稍微能呼吸",
        targetEnergy: [0.35, 0.6],
        targetValence: [0.25, 0.5],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "稍亮",
        hint: "仍被理解，但多一点点力气",
        targetEnergy: [0.4, 0.65],
        targetValence: [0.35, 0.6],
        count: liftN,
      },
    ],
    diversion: [
      {
        id: "hold",
        label: "起手",
        hint: "先接住情绪，再慢慢岔开",
        targetEnergy: [0.35, 0.55],
        targetValence: [0.2, 0.45],
        count: holdN,
      },
      {
        id: "bridge",
        label: "拉开",
        hint: "节奏渐快，离开反复想的事",
        targetEnergy: [0.55, 0.75],
        targetValence: [0.45, 0.7],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "轻快",
        hint: "更外向的能量，帮助转移注意",
        targetEnergy: [0.7, 1],
        targetValence: [0.6, 0.9],
        count: liftN,
      },
    ],
    revival: [
      {
        id: "hold",
        label: "低处",
        hint: "承认此刻还在低谷",
        targetEnergy: [0.15, 0.45],
        targetValence: [0.1, 0.35],
        count: holdN,
      },
      {
        id: "bridge",
        label: "托起",
        hint: "慢慢找回一点力量",
        targetEnergy: [0.45, 0.7],
        targetValence: [0.35, 0.6],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "振作",
        hint: "更明亮、更有向前感",
        targetEnergy: [0.65, 0.95],
        targetValence: [0.55, 0.85],
        count: liftN,
      },
    ],
    celebrate: [
      {
        id: "hold",
        label: "入场",
        hint: "先把好心情托起来",
        targetEnergy: [0.55, 0.75],
        targetValence: [0.6, 0.85],
        count: holdN,
      },
      {
        id: "bridge",
        label: "展开",
        hint: "享受当下，节奏更开",
        targetEnergy: [0.7, 0.9],
        targetValence: [0.7, 0.9],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "高点",
        hint: "把这一刻放大",
        targetEnergy: [0.75, 1],
        targetValence: [0.75, 1],
        count: liftN,
      },
    ],
    energy: [
      {
        id: "hold",
        label: "预热",
        hint: "先稳住节拍",
        targetEnergy: [0.6, 0.8],
        targetValence: [0.55, 0.75],
        count: holdN,
      },
      {
        id: "bridge",
        label: "推进",
        hint: "能量持续上扬",
        targetEnergy: [0.75, 0.9],
        targetValence: [0.6, 0.85],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "爆发",
        hint: "保持高能量不塌",
        targetEnergy: [0.85, 1],
        targetValence: [0.65, 0.9],
        count: liftN,
      },
    ],
    settle: [
      {
        id: "hold",
        label: "卸下",
        hint: "从兴奋或纷乱里慢下来",
        targetEnergy: [0.45, 0.65],
        targetValence: [0.4, 0.65],
        count: holdN,
      },
      {
        id: "bridge",
        label: "沉降",
        hint: "更柔、更贴呼吸",
        targetEnergy: [0.25, 0.5],
        targetValence: [0.35, 0.6],
        count: bridgeN,
      },
      {
        id: "lift",
        label: "安住",
        hint: "安静收尾，温柔沉淀",
        targetEnergy: [0.15, 0.4],
        targetValence: [0.3, 0.55],
        count: liftN,
      },
    ],
  };

  const slots = plans[goal].map((slot) => {
    const lyric = ARC_LYRIC_TARGETS[goal][slot.id];
    return {
      ...slot,
      targetLyricFocus: lyric.targetLyricFocus,
      targetLyricDirectness: lyric.targetLyricDirectness,
      targetVocalTimbre: ARC_VOCAL_TIMBRE_TARGETS[goal][slot.id],
    };
  });

  let plan: ArcPlan = { slots };
  if (mood && isValidMood(mood)) {
    plan = applyMoodArcOverrides(plan, mood as MoodId, goal);
  }
  return plan;
}
