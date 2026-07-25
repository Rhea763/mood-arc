import { MOOD_GOAL_PRESENTATION } from "@/lib/mood-arc-overrides";

/** 具体情境（可选，单选） */
export const SCENARIOS = [
  {
    id: "party",
    label: "派对聚会",
    hint: "欢快、有节奏，适合大家一起嗨",
  },
  {
    id: "commute",
    label: "通勤路上",
    hint: "提神或放空，打发路程",
  },
  {
    id: "work",
    label: "工作学习",
    hint: "专注背景或轻节奏",
  },
  {
    id: "sleep",
    label: "睡前",
    hint: "安静、慢慢放松入眠",
  },
  {
    id: "workout",
    label: "运动健身",
    hint: "高能量、强节拍",
  },
  {
    id: "alone",
    label: "独处",
    hint: "私人空间里被陪伴",
  },
  {
    id: "date",
    label: "约会浪漫",
    hint: "暧昧、温柔或甜蜜",
  },
  {
    id: "drive",
    label: "开车兜风",
    hint: "开阔、自由、有律动",
  },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]["id"];

export const NEGATIVE_MOODS = [
  "伤心",
  "焦虑",
  "愤怒",
  "疲惫",
  "孤独",
  "失落",
] as const;

export const POSITIVE_MOODS = [
  "开心",
  "平静",
  "兴奋",
  "满足",
  "期待",
] as const;

export const MOODS = [...NEGATIVE_MOODS, ...POSITIVE_MOODS] as const;

export type MoodId = (typeof MOODS)[number];

export type MoodValence = "negative" | "positive";

export const CAUSES = [
  "感情",
  "工作",
  "学业",
  "人际",
  "家庭",
  "健康",
  "经济",
  "说不清",
] as const;

/** 负向心情下的调节目标 */
export const NEGATIVE_REGULATION_GOALS = [
  {
    id: "solace",
    label: "共情向",
    hint: "允许情绪存在，被理解、被陪伴",
  },
  {
    id: "diversion",
    label: "转移注意",
    hint: "先离开反复想的事，轻松带节奏",
  },
  {
    id: "revival",
    label: "慢慢振作",
    hint: "从低能量逐步拉回稳定与希望",
  },
] as const;

/** 正向心情下的调节目标 */
export const POSITIVE_REGULATION_GOALS = [
  {
    id: "celebrate",
    label: "享受当下",
    hint: "放大好心情，好好感受这一刻",
  },
  {
    id: "energy",
    label: "保持能量",
    hint: "维持兴奋感，节奏不塌",
  },
  {
    id: "settle",
    label: "温柔沉淀",
    hint: "从亢奋慢慢落到舒服、安稳",
  },
] as const;

export type NegativeRegulationGoalId =
  (typeof NEGATIVE_REGULATION_GOALS)[number]["id"];

export type PositiveRegulationGoalId =
  (typeof POSITIVE_REGULATION_GOALS)[number]["id"];

export type RegulationGoalId =
  | NegativeRegulationGoalId
  | PositiveRegulationGoalId;

const ALL_GOAL_IDS = new Set<string>([
  ...NEGATIVE_REGULATION_GOALS.map((g) => g.id),
  ...POSITIVE_REGULATION_GOALS.map((g) => g.id),
]);

export function isValidMood(mood: string): mood is MoodId {
  return (MOODS as readonly string[]).includes(mood);
}

export function isValidScenario(id: string): id is ScenarioId {
  return SCENARIOS.some((s) => s.id === id);
}

export function getMoodValence(mood: string): MoodValence | null {
  if ((NEGATIVE_MOODS as readonly string[]).includes(mood)) return "negative";
  if ((POSITIVE_MOODS as readonly string[]).includes(mood)) return "positive";
  return null;
}

export function getGoalsForMood(mood: string) {
  const valence = getMoodValence(mood);
  const base =
    valence === "negative"
      ? NEGATIVE_REGULATION_GOALS
      : valence === "positive"
        ? POSITIVE_REGULATION_GOALS
        : [];
  if (!isValidMood(mood)) return base;
  const pres = MOOD_GOAL_PRESENTATION[mood];
  if (!pres) return base;
  return base.map((g) => ({
    id: g.id,
    label: pres[g.id]?.label ?? g.label,
    hint: pres[g.id]?.hint ?? g.hint,
  }));
}

export function isValidRegulationGoalForMood(
  goalId: string,
  mood: string
): goalId is RegulationGoalId {
  if (!ALL_GOAL_IDS.has(goalId)) return false;
  const valence = getMoodValence(mood);
  if (!valence) return false;
  const goals = getGoalsForMood(mood);
  return goals.some((g) => g.id === goalId);
}

export function isValidRegulationGoal(id: string): id is RegulationGoalId {
  return ALL_GOAL_IDS.has(id);
}

export function getRegulationGoalLabel(
  id: RegulationGoalId,
  mood?: string
): string {
  if (mood && isValidMood(mood)) {
    const pres = MOOD_GOAL_PRESENTATION[mood]?.[id];
    if (pres) return pres.label;
  }
  const g =
    NEGATIVE_REGULATION_GOALS.find((x) => x.id === id) ??
    POSITIVE_REGULATION_GOALS.find((x) => x.id === id);
  return g?.label ?? id;
}

export function getScenarioLabel(id: ScenarioId): string {
  return SCENARIOS.find((s) => s.id === id)?.label ?? id;
}

export function goalSearchSuffix(goal: RegulationGoalId): string {
  switch (goal) {
    case "solace":
      return "emotional acoustic heartfelt";
    case "diversion":
      return "upbeat fun catchy";
    case "revival":
      return "uplifting hopeful gentle";
    case "celebrate":
      return "feel good happy celebration";
    case "energy":
      return "upbeat energetic dance party";
    case "settle":
      return "chill mellow soft acoustic";
  }
}

export function scenarioSearchSuffix(scenario: ScenarioId): string {
  switch (scenario) {
    case "party":
      return "party dance upbeat";
    case "commute":
      return "commute playlist chill";
    case "work":
      return "focus study background music";
    case "sleep":
      return "sleep calm bedtime";
    case "workout":
      return "workout gym energetic";
    case "alone":
      return "solo listening intimate";
    case "date":
      return "romantic date love songs";
    case "drive":
      return "driving road trip playlist";
  }
}
