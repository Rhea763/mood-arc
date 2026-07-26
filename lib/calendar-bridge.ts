/** Map 心绪日历 mood tags → MoodArc mood ids */
export const CALENDAR_TAG_TO_MOOD: Record<string, string> = {
  "😊 开心": "开心",
  "😌 平静": "平静",
  "😰 焦虑": "焦虑",
  "😫 疲惫": "疲惫",
  "😠 愤怒": "愤怒",
  "😢 低落": "失落",
  "🙏 感恩": "满足",
  "😶 迷茫": "孤独",
};

export interface CalendarMoodPayload {
  mood?: string | null;
  tags?: string[];
  happy?: string[];
  sad?: string[];
}

export function moodFromCalendarPayload(payload: CalendarMoodPayload): string | null {
  if (payload.mood && CALENDAR_TAG_TO_MOOD[payload.mood]) {
    return CALENDAR_TAG_TO_MOOD[payload.mood];
  }
  for (const tag of payload.tags ?? []) {
    const mapped = CALENDAR_TAG_TO_MOOD[tag];
    if (mapped) return mapped;
  }
  return null;
}

const CAUSE_KEYWORDS: Array<{ keyword: RegExp; cause: string }> = [
  { keyword: /感情|恋爱|分手|对象|喜欢|前任/, cause: "感情" },
  { keyword: /工作|上班|加班|老板|同事|项目/, cause: "工作" },
  { keyword: /学业|考试|作业|论文|学习|学校/, cause: "学业" },
  { keyword: /朋友|人际|社交|关系|沟通/, cause: "人际" },
  { keyword: /家庭|父母|家人|家里/, cause: "家庭" },
  { keyword: /身体|健康|生病|睡眠|累/, cause: "健康" },
  { keyword: /钱|经济|消费|账单/, cause: "经济" },
];

export function causesFromCalendarPayload(
  payload: CalendarMoodPayload
): string[] {
  const text = [...(payload.sad ?? []), ...(payload.happy ?? [])]
    .filter(Boolean)
    .join(" ");
  if (!text.trim()) return [];

  const found = new Set<string>();
  for (const { keyword, cause } of CAUSE_KEYWORDS) {
    if (keyword.test(text)) found.add(cause);
  }
  return found.size > 0 ? [...found] : ["说不清"];
}

export function buildEmbedSearchParams(
  payload: CalendarMoodPayload
): URLSearchParams {
  const params = new URLSearchParams({ embed: "1" });
  const mood = moodFromCalendarPayload(payload);
  if (mood) params.set("mood", mood);
  const causes = causesFromCalendarPayload(payload);
  if (causes.length) params.set("causes", causes.join(","));
  return params;
}
