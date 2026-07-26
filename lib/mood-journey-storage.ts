import type { MoodRecord, MoodSnapshot } from "@/types/emotion";

const STORAGE_KEY = "moodarc_journey_v1";

function readAll(): MoodRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MoodRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: MoodRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createMoodRecord(input: {
  beforeMood: MoodSnapshot;
  recommendedSongs: MoodRecord["recommendedSongs"];
  playlistName?: string;
}): MoodRecord {
  const now = new Date().toISOString();
  const record: MoodRecord = {
    id: `mood_${Date.now()}`,
    date: todayKey(),
    emotion: input.beforeMood.emotion,
    intensity: input.beforeMood.intensity,
    intention: input.beforeMood.intention,
    moodId: input.beforeMood.moodId,
    regulationGoal: input.beforeMood.regulationGoal,
    recommendedSongs: input.recommendedSongs,
    playlistName: input.playlistName,
    beforeMood: input.beforeMood,
    createdAt: now,
    updatedAt: now,
  };
  const all = readAll();
  all.unshift(record);
  writeAll(all.slice(0, 120));
  return record;
}

export function updateMoodRecordAfterMood(
  id: string,
  afterMood: MoodSnapshot
): MoodRecord | null {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  all[idx] = {
    ...all[idx],
    afterMood,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  return all[idx];
}

export function getMoodRecords(): MoodRecord[] {
  return readAll();
}

export function getTodayMoodRecord(): MoodRecord | null {
  const key = todayKey();
  return readAll().find((r) => r.date === key) ?? null;
}

export function getLatestMoodRecord(): MoodRecord | null {
  const all = readAll();
  return all[0] ?? null;
}
