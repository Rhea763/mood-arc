import type { MoodId, MoodValence } from "@/lib/context-catalog";
import { getMoodValence } from "@/lib/context-catalog";
import type { EmotionId, IntentionId } from "@/types/emotion";
import type { RegulationGoalId } from "@/lib/context-catalog";

export interface EmotionOption {
  id: EmotionId;
  emoji: string;
  labelEn: string;
  labelZh: string;
  moodId: MoodId;
}

export interface IntentionOption {
  id: IntentionId;
  labelEn: string;
  labelZh: string;
  hintZh: string;
}

export const EMOTIONS: EmotionOption[] = [
  { id: "sad", emoji: "🌧", labelEn: "Sad", labelZh: "低落", moodId: "伤心" },
  { id: "anxious", emoji: "😰", labelEn: "Anxious", labelZh: "焦虑", moodId: "焦虑" },
  { id: "lonely", emoji: "🌙", labelEn: "Lonely", labelZh: "孤独", moodId: "孤独" },
  { id: "stressed", emoji: "😫", labelEn: "Stressed", labelZh: "紧绷", moodId: "疲惫" },
  { id: "heartbroken", emoji: "💔", labelEn: "Heartbroken", labelZh: "心碎", moodId: "失落" },
  { id: "nostalgic", emoji: "🍂", labelEn: "Nostalgic", labelZh: "怀旧", moodId: "失落" },
  { id: "calm", emoji: "🌊", labelEn: "Calm", labelZh: "平静", moodId: "平静" },
  { id: "happy", emoji: "☀️", labelEn: "Happy", labelZh: "开心", moodId: "开心" },
  { id: "energetic", emoji: "⚡", labelEn: "Energetic", labelZh: "有劲", moodId: "兴奋" },
];

export const INTENTIONS: IntentionOption[] = [
  {
    id: "process",
    labelEn: "I want to process this feeling",
    labelZh: "想理解和消化情绪",
    hintZh: "允许感受存在，慢慢梳理",
  },
  {
    id: "comfort",
    labelEn: "I want comfort",
    labelZh: "想被安慰",
    hintZh: "被理解、被陪伴，不必马上好起来",
  },
  {
    id: "distraction",
    labelEn: "I want distraction",
    labelZh: "想转移注意力",
    hintZh: "先离开反复想的事，轻松带节奏",
  },
  {
    id: "energy",
    labelEn: "I want energy",
    labelZh: "想提升状态",
    hintZh: "从低能量拉回稳定与动力",
  },
  {
    id: "celebrate",
    labelEn: "I want to celebrate",
    labelZh: "想保持快乐",
    hintZh: "放大好心情，好好感受这一刻",
  },
];

const EMOTION_MAP = new Map(EMOTIONS.map((e) => [e.id, e]));

const INTENTION_TO_GOAL: Record<
  IntentionId,
  Record<MoodValence, RegulationGoalId>
> = {
  process: { negative: "solace", positive: "settle" },
  comfort: { negative: "solace", positive: "settle" },
  distraction: { negative: "diversion", positive: "energy" },
  energy: { negative: "revival", positive: "energy" },
  celebrate: { negative: "revival", positive: "celebrate" },
};

export function getEmotion(id: EmotionId): EmotionOption {
  const found = EMOTION_MAP.get(id);
  if (!found) throw new Error(`Unknown emotion: ${id}`);
  return found;
}

export function getEmotionLabel(id: EmotionId): string {
  const e = EMOTION_MAP.get(id);
  return e ? `${e.emoji} ${e.labelEn}` : id;
}

export function getEmotionLabelZh(id: EmotionId): string {
  const e = EMOTION_MAP.get(id);
  return e ? `${e.emoji} ${e.labelZh}` : id;
}

export function moodIdFromEmotion(id: EmotionId): MoodId {
  return getEmotion(id).moodId;
}

export function regulationGoalFromIntention(
  intention: IntentionId,
  emotion: EmotionId
): RegulationGoalId {
  const moodId = moodIdFromEmotion(emotion);
  const valence = getMoodValence(moodId);
  if (!valence) return "solace";
  return INTENTION_TO_GOAL[intention][valence];
}

export function intentionsForEmotion(emotion: EmotionId): IntentionOption[] {
  const valence = getMoodValence(moodIdFromEmotion(emotion));
  if (valence === "positive") {
    return INTENTIONS.filter((i) =>
      ["process", "comfort", "energy", "celebrate"].includes(i.id)
    );
  }
  return INTENTIONS.filter((i) =>
    ["process", "comfort", "distraction", "energy"].includes(i.id)
  );
}

export function playlistThemeName(
  emotion: EmotionId,
  intention: IntentionId
): string {
  const key = `${emotion}:${intention}`;
  const themes: Record<string, string> = {
    "sad:process": "Songs for emotional processing",
    "sad:comfort": "Songs for gentle comfort",
    "sad:distraction": "Songs to shift your focus",
    "sad:energy": "Songs for slow revival",
    "anxious:process": "Songs to sit with the worry",
    "anxious:comfort": "Songs for calm reassurance",
    "anxious:distraction": "Songs to ease your mind",
    "anxious:energy": "Songs for steady grounding",
    "lonely:process": "Songs for quiet company",
    "lonely:comfort": "Songs that feel like someone stayed",
    "lonely:distraction": "Songs to soften the silence",
    "lonely:energy": "Songs for gentle reconnection",
    "stressed:process": "Songs to release the tension",
    "stressed:comfort": "Songs for deep exhale",
    "stressed:distraction": "Songs to step away",
    "stressed:energy": "Songs for renewed focus",
    "heartbroken:process": "Songs for heartbreak processing",
    "heartbroken:comfort": "Songs for aching hearts",
    "heartbroken:distraction": "Songs to breathe again",
    "heartbroken:energy": "Songs for picking up pieces",
    "nostalgic:process": "Songs for memory and meaning",
    "nostalgic:comfort": "Songs for tender remembering",
    "nostalgic:distraction": "Songs to wander elsewhere",
    "nostalgic:energy": "Songs for bittersweet hope",
    "calm:process": "Songs for quiet reflection",
    "calm:comfort": "Songs for soft stillness",
    "calm:energy": "Songs to stay gently awake",
    "calm:celebrate": "Songs for peaceful joy",
    "happy:process": "Songs to savor the moment",
    "happy:comfort": "Songs for warm contentment",
    "happy:energy": "Songs to keep the spark",
    "happy:celebrate": "Songs for celebrating today",
    "energetic:process": "Songs to channel the rush",
    "energetic:comfort": "Songs to ride the wave",
    "energetic:energy": "Songs to keep moving",
    "energetic:celebrate": "Songs for pure momentum",
  };
  return themes[key] ?? "Songs for where you are right now";
}

export function isValidEmotion(id: string): id is EmotionId {
  return EMOTION_MAP.has(id as EmotionId);
}

export function isValidIntention(id: string): id is IntentionId {
  return INTENTIONS.some((i) => i.id === id);
}

/** Map MoodArc 中文 mood id → companion EmotionId (embed / 心绪日历) */
export function emotionFromMoodId(moodId: string): EmotionId | null {
  const map: Record<string, EmotionId> = {
    伤心: "sad",
    焦虑: "anxious",
    孤独: "lonely",
    疲惫: "stressed",
    失落: "heartbroken",
    平静: "calm",
    开心: "happy",
    兴奋: "energetic",
    愤怒: "stressed",
    满足: "happy",
  };
  return map[moodId] ?? null;
}
