import type { MoodId, RegulationGoalId } from "@/lib/context-catalog";
import type { ArcPlan, ArcSlot, ArcSlotId } from "@/lib/arc-templates";
import type { LyricFocus } from "@/lib/lyric-focus";
import type { VocalTimbre } from "@/lib/vocal-timbre";

export interface MoodGoalPresentation {
  label: string;
  hint: string;
}

/** 心情 × 调节目标：UI 文案（底层 goal id 不变） */
export const MOOD_GOAL_PRESENTATION: Partial<
  Record<MoodId, Partial<Record<RegulationGoalId, MoodGoalPresentation>>>
> = {
  愤怒: {
    solace: { label: "怒有被听见", hint: "先让火气合法，不必立刻压住" },
    diversion: { label: "岔开火力", hint: "用快节奏把愤怒带离反复指控" },
    revival: { label: "放下后劲", hint: "从爆发慢慢落到能呼吸" },
  },
  伤心: {
    solace: { label: "共情向", hint: "允许情绪存在，被理解、被陪伴" },
    diversion: { label: "转移注意", hint: "先离开反复想的事，轻松带节奏" },
    revival: { label: "慢慢振作", hint: "从低能量逐步拉回稳定与希望" },
  },
  焦虑: {
    solace: { label: "先安放", hint: "允许悬着，不被推着跑" },
    diversion: { label: "岔开思绪", hint: "用节奏打断反复担心" },
    revival: { label: "慢慢落地", hint: "从紧绷回到可承受的稳" },
  },
  疲惫: {
    solace: { label: "先歇一歇", hint: "极低消耗，允许什么都不做" },
    diversion: { label: "轻轻提气", hint: "不紧不慢地提一点节奏" },
    revival: { label: "续一点力", hint: "从瘫软慢慢回到能继续" },
  },
  孤独: {
    solace: { label: "有人味", hint: "被陪伴、被听见，不急着社交" },
    diversion: { label: "轻轻连接", hint: "用温柔节奏靠近世界" },
    revival: { label: "慢慢敞开", hint: "从封闭到愿意再靠近一点" },
  },
  失落: {
    solace: { label: "认得这份空", hint: "允许失落存在，不强行填满" },
    diversion: { label: "先离开空地", hint: "用节奏离开反复下沉" },
    revival: { label: "找回一点光", hint: "从空洞慢慢摸到方向" },
  },
  开心: {
    celebrate: { label: "放大开心", hint: "把好心情托起来、展开" },
    energy: { label: "保持轻快", hint: "节奏不塌，继续明亮" },
    settle: { label: "温柔收下", hint: "从兴奋慢慢落到舒服" },
  },
  兴奋: {
    celebrate: { label: "继续嗨", hint: "把兴奋感维持住" },
    energy: { label: "保持能量", hint: "高节拍不中断" },
    settle: { label: "缓下来", hint: "从亢奋慢慢收束" },
  },
  平静: {
    celebrate: { label: "品味平静", hint: "安静里也有好感受" },
    energy: { label: "添一点律动", hint: "不打破宁静的小幅能量" },
    settle: { label: "更深地静", hint: "沉入安稳与呼吸" },
  },
  满足: {
    celebrate: { label: "回味满足", hint: "把满足感慢慢展开" },
    energy: { label: "轻快延续", hint: "满足之上再加一点活力" },
    settle: { label: "安住此刻", hint: "满足地停下来" },
  },
  期待: {
    celebrate: { label: "期待升温", hint: "把盼望感越托越高" },
    energy: { label: "蓄势", hint: "能量上扬、等待落地" },
    settle: { label: "耐心等", hint: "期待中保持安稳" },
  },
};

interface SlotOverride {
  label?: string;
  hint?: string;
  targetEnergy?: [number, number];
  targetValence?: [number, number];
  targetLyricFocus?: LyricFocus[];
  targetLyricDirectness?: [number, number];
  targetVocalTimbre?: VocalTimbre[];
}

type MoodGoalOverrides = Partial<Record<ArcSlotId, SlotOverride>>;

const MOOD_ARC_OVERRIDES: Partial<
  Record<MoodId, Partial<Record<RegulationGoalId, MoodGoalOverrides>>>
> = {
  愤怒: {
    solace: {
      hold: {
        label: "火气",
        hint: "强音色冲击力，贴合愤怒本身",
        targetEnergy: [0.55, 0.95],
        targetValence: [0.15, 0.45],
        targetLyricFocus: ["anger", "defiance"],
        targetLyricDirectness: [0.75, 1],
        targetVocalTimbre: ["power_belt", "cool_sharp", "theatrical_bold"],
      },
      bridge: {
        label: "过渡",
        hint: "火气仍在，但音色开始变化",
        targetEnergy: [0.45, 0.8],
        targetValence: [0.25, 0.5],
        targetLyricFocus: ["anger", "bittersweet", "defiance"],
        targetLyricDirectness: [0.65, 0.95],
        targetVocalTimbre: ["cool_sharp", "theatrical_bold", "soft_warm"],
      },
      lift: {
        label: "落地",
        hint: "从爆发落到可呼吸的音色",
        targetEnergy: [0.35, 0.65],
        targetValence: [0.35, 0.6],
        targetLyricFocus: ["reflection", "bittersweet", "hope"],
        targetLyricDirectness: [0.45, 0.85],
        targetVocalTimbre: ["soft_warm", "clear_bright", "ethereal_float"],
      },
    },
    diversion: {
      hold: {
        label: "先炸开",
        hint: "高冲击音色，把火甩出去",
        targetEnergy: [0.65, 0.95],
        targetValence: [0.2, 0.5],
        targetLyricFocus: ["anger", "defiance"],
        targetVocalTimbre: ["power_belt", "cool_sharp"],
      },
      bridge: {
        label: "拉开",
        hint: "音色转向明亮、节奏更快",
        targetEnergy: [0.7, 0.9],
        targetValence: [0.45, 0.75],
        targetLyricFocus: ["defiance", "flirt", "celebration"],
        targetVocalTimbre: ["playful_bounce", "clear_bright"],
      },
      lift: {
        label: "轻快",
        hint: "俏皮音色，彻底岔开怒火",
        targetEnergy: [0.75, 1],
        targetValence: [0.6, 0.9],
        targetLyricFocus: ["celebration", "flirt", "defiance"],
        targetVocalTimbre: ["playful_bounce", "clear_bright"],
      },
    },
    revival: {
      hold: {
        label: "余怒",
        hint: "承认愤怒还在，强音色开场",
        targetEnergy: [0.5, 0.9],
        targetValence: [0.15, 0.4],
        targetLyricFocus: ["anger", "defiance"],
        targetVocalTimbre: ["power_belt", "cool_sharp"],
      },
      bridge: {
        label: "托起",
        hint: "音色从硬到柔，找回掌控",
        targetEnergy: [0.45, 0.75],
        targetValence: [0.35, 0.6],
        targetLyricFocus: ["defiance", "reflection", "bittersweet"],
        targetVocalTimbre: ["soft_warm", "clear_bright"],
      },
      lift: {
        label: "振作",
        hint: "明亮音色，向前但不假嗨",
        targetEnergy: [0.6, 0.9],
        targetValence: [0.5, 0.85],
        targetLyricFocus: ["hope", "defiance", "celebration"],
        targetVocalTimbre: ["clear_bright", "playful_bounce"],
      },
    },
  },
  焦虑: {
    solace: {
      hold: {
        label: "悬着",
        hint: "低而贴地的音色，先安放",
        targetEnergy: [0.15, 0.45],
        targetValence: [0.15, 0.4],
        targetLyricFocus: ["introspection", "numbness", "longing"],
        targetVocalTimbre: ["breathy_hushed", "ethereal_float"],
      },
      bridge: {
        label: "缓释",
        hint: "音色略提亮，仍克制",
        targetEnergy: [0.3, 0.55],
        targetValence: [0.3, 0.5],
        targetLyricFocus: ["reflection", "bittersweet", "longing"],
        targetVocalTimbre: ["soft_warm", "ethereal_float"],
      },
      lift: {
        label: "可承受",
        hint: "柔暖音色，回到能呼吸的稳",
        targetEnergy: [0.35, 0.6],
        targetValence: [0.4, 0.65],
        targetLyricFocus: ["reflection", "hope"],
        targetVocalTimbre: ["soft_warm", "clear_bright"],
      },
    },
  },
  疲惫: {
    solace: {
      hold: {
        label: "瘫软",
        hint: "极低能量，慵懒音色",
        targetEnergy: [0.05, 0.25],
        targetValence: [0.15, 0.4],
        targetLyricFocus: ["numbness", "introspection", "grief"],
        targetVocalTimbre: ["breathy_hushed", "ethereal_float"],
      },
      bridge: {
        label: "微动",
        hint: "音色仍软，略有一点推进",
        targetEnergy: [0.2, 0.45],
        targetValence: [0.25, 0.5],
        targetLyricFocus: ["reflection", "nostalgia", "longing"],
        targetVocalTimbre: ["soft_warm", "ethereal_float"],
      },
      lift: {
        label: "续力",
        hint: "柔暖而不累人的音色",
        targetEnergy: [0.3, 0.55],
        targetValence: [0.35, 0.6],
        targetLyricFocus: ["reflection", "hope", "nostalgia"],
        targetVocalTimbre: ["soft_warm", "clear_bright"],
      },
    },
    diversion: {
      hold: {
        label: "先歇",
        hint: "慵懒开场，不突然拉高",
        targetEnergy: [0.15, 0.4],
        targetValence: [0.2, 0.45],
        targetVocalTimbre: ["breathy_hushed", "soft_warm"],
      },
      bridge: {
        label: "轻提",
        hint: "音色渐亮，节奏渐快",
        targetEnergy: [0.4, 0.65],
        targetValence: [0.4, 0.65],
        targetVocalTimbre: ["soft_warm", "clear_bright"],
      },
      lift: {
        label: "提气",
        hint: "明亮轻快，但不轰炸",
        targetEnergy: [0.55, 0.8],
        targetValence: [0.55, 0.8],
        targetVocalTimbre: ["clear_bright", "playful_bounce"],
      },
    },
  },
  孤独: {
    solace: {
      hold: {
        label: "独处",
        hint: "飘渺或低沉，像有人在旁",
        targetEnergy: [0.1, 0.4],
        targetValence: [0.1, 0.35],
        targetLyricFocus: ["longing", "grief", "numbness"],
        targetVocalTimbre: ["breathy_hushed", "ethereal_float"],
      },
      bridge: {
        label: "靠近",
        hint: "音色渐暖，仍私密",
        targetEnergy: [0.3, 0.55],
        targetValence: [0.25, 0.5],
        targetLyricFocus: ["longing", "nostalgia", "bittersweet"],
        targetVocalTimbre: ["ethereal_float", "soft_warm"],
      },
      lift: {
        label: "微光",
        hint: "柔暖音色，多一点连接感",
        targetEnergy: [0.35, 0.6],
        targetValence: [0.35, 0.6],
        targetLyricFocus: ["reflection", "hope", "longing"],
        targetVocalTimbre: ["soft_warm", "clear_bright"],
      },
    },
  },
  伤心: {
    solace: {
      hold: {
        label: "缓缓",
        hint: "慵懒低沉音色，先贴住心碎",
        targetEnergy: [0.1, 0.35],
        targetValence: [0.1, 0.35],
        targetLyricFocus: ["grief", "longing", "nostalgia"],
        targetVocalTimbre: ["breathy_hushed", "ethereal_float", "soft_warm"],
      },
      bridge: {
        label: "过渡",
        hint: "音色开始变化，情绪仍真",
        targetEnergy: [0.3, 0.55],
        targetValence: [0.2, 0.45],
        targetLyricFocus: ["bittersweet", "anger", "grief"],
        targetVocalTimbre: ["soft_warm", "cool_sharp", "ethereal_float"],
      },
      lift: {
        label: "稍亮",
        hint: "音色更清透，多一点点力气",
        targetEnergy: [0.35, 0.6],
        targetValence: [0.3, 0.55],
        targetLyricFocus: ["reflection", "hope", "bittersweet"],
        targetVocalTimbre: ["clear_bright", "soft_warm"],
      },
    },
  },
};

function mergeSlot(base: ArcSlot, patch?: SlotOverride): ArcSlot {
  if (!patch) return base;
  return {
    ...base,
    label: patch.label ?? base.label,
    hint: patch.hint ?? base.hint,
    targetEnergy: patch.targetEnergy ?? base.targetEnergy,
    targetValence: patch.targetValence ?? base.targetValence,
    targetLyricFocus: patch.targetLyricFocus ?? base.targetLyricFocus,
    targetLyricDirectness:
      patch.targetLyricDirectness ?? base.targetLyricDirectness,
    targetVocalTimbre: patch.targetVocalTimbre ?? base.targetVocalTimbre,
  };
}

export function applyMoodArcOverrides(
  plan: ArcPlan,
  mood: MoodId,
  goal: RegulationGoalId
): ArcPlan {
  const moodPatches = MOOD_ARC_OVERRIDES[mood]?.[goal];
  if (!moodPatches) return plan;
  return {
    slots: plan.slots.map((slot) =>
      mergeSlot(slot, moodPatches[slot.id])
    ),
  };
}

export function getMoodGoalPresentation(
  mood: MoodId,
  goal: RegulationGoalId
): MoodGoalPresentation | null {
  return MOOD_GOAL_PRESENTATION[mood]?.[goal] ?? null;
}
