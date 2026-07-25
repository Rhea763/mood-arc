import type { RegulationGoalId, ScenarioId } from "@/lib/context-catalog";
import { getMoodValence } from "@/lib/context-catalog";
import type { DemoTrack } from "@/lib/demo-track-catalog";
import { DEMO_TRACKS } from "@/lib/demo-track-catalog";

export interface ContextInterpretation {
  /** 给用户看的组合理解 */
  narrative: string;
  /** 用于打分的主题权重 */
  themeWeights: Record<string, number>;
  /** 热闹场合 × 低落心情 */
  energyContrast: boolean;
  /** 是否涉及感情/分手线 */
  romanceThread: boolean;
}

const SCENARIO_ENERGY: Partial<Record<ScenarioId, "high" | "low" | "mixed">> = {
  party: "high",
  workout: "high",
  date: "mixed",
  drive: "high",
  commute: "mixed",
  work: "low",
  sleep: "low",
  alone: "low",
};

const GOAL_TAG_BOOST: Record<RegulationGoalId, Record<string, number>> = {
  solace: {
    solace: 4,
    heartbreak: 3,
    bittersweet: 3,
    loneliness: 2,
    settle: 2,
    party_contrast: 2,
  },
  diversion: {
    diversion: 4,
    uptempo: 3,
    party: 2,
    liberation: 2,
    celebrate: 2,
  },
  revival: {
    revival: 4,
    hope: 3,
    liberation: 3,
    uptempo: 2,
    confidence: 2,
  },
  celebrate: {
    celebrate: 4,
    uptempo: 3,
    party: 3,
    flirt: 2,
    romance: 2,
  },
  energy: {
    energy: 4,
    uptempo: 4,
    party: 3,
    confidence: 2,
  },
  settle: {
    settle: 4,
    solace: 3,
    calm: 2,
    bittersweet: 2,
  },
};

function hasCause(causes: string[] | undefined, keyword: string): boolean {
  return causes?.includes(keyword) ?? false;
}

export function interpretContext(
  mood: string,
  scenario: ScenarioId | undefined,
  causes: string[] | undefined,
  regulationGoal: RegulationGoalId
): ContextInterpretation {
  const valence = getMoodValence(mood);
  const scenarioEnergy = scenario ? SCENARIO_ENERGY[scenario] : undefined;
  const energyContrast =
    valence === "negative" &&
    scenario != null &&
    (scenarioEnergy === "high" || scenario === "date");

  const romanceThread =
    hasCause(causes, "感情") ||
    (scenario === "date" && valence === "negative");

  const themeWeights: Record<string, number> = {};

  const bump = (tag: string, n: number) => {
    themeWeights[tag] = (themeWeights[tag] ?? 0) + n;
  };

  // 心情基调
  if (valence === "negative") {
    bump("heartbreak", 2);
    bump("solace", 2);
    if (mood === "孤独" || mood === "失落") bump("loneliness", 3);
    if (mood === "愤怒") bump("anger", 4);
    if (mood === "伤心") bump("bittersweet", 2);
    if (mood === "焦虑") bump("settle", 2);
    if (mood === "疲惫") bump("settle", 3);
  } else {
    bump("celebrate", 2);
    bump("uptempo", 2);
    if (mood === "兴奋") bump("energy", 3);
    if (mood === "平静" || mood === "满足") bump("settle", 2);
  }

  // 原因线
  if (hasCause(causes, "感情")) {
    bump("romance", 3);
    bump("heartbreak", 2);
  }
  if (hasCause(causes, "工作") || hasCause(causes, "学业")) {
    bump("settle", 2);
    bump("diversion", 1);
  }
  if (hasCause(causes, "人际")) {
    bump("loneliness", 2);
    bump("heartbreak", 1);
  }
  if (hasCause(causes, "家庭")) {
    bump("solace", 2);
    bump("grief", 2);
  }

  // 情境（不是独立标签，而是修饰心情）
  if (scenario === "party") {
    if (valence === "negative") {
      bump("party_contrast", 5);
      bump("bittersweet", 3);
      bump("loneliness", 2);
      // 共情向时少推纯嗨歌
      if (regulationGoal === "solace") bump("party", -2);
      if (regulationGoal === "diversion") bump("party", 2);
      if (regulationGoal === "diversion") bump("uptempo", 2);
    } else {
      bump("party", 4);
      bump("uptempo", 3);
      bump("celebrate", 2);
    }
  }
  if (scenario === "alone" && valence === "negative") {
    bump("loneliness", 4);
    bump("solace", 3);
  }
  if (scenario === "date") {
    bump("romance", 3);
    if (valence === "negative") {
      bump("bittersweet", 4);
      bump("heartbreak", 3);
      bump("party_contrast", 2);
    }
  }
  if (scenario === "sleep") {
    bump("settle", 5);
    bump("solace", 3);
  }
  if (scenario === "work") {
    bump("settle", 4);
  }
  if (scenario === "workout") {
    bump("energy", 4);
    bump("uptempo", 3);
  }
  if (scenario === "drive") {
    bump("uptempo", 2);
    bump("liberation", 2);
  }

  const narrative = buildNarrative(
    mood,
    scenario,
    causes,
    regulationGoal,
    energyContrast,
    romanceThread
  );

  return {
    narrative,
    themeWeights,
    energyContrast,
    romanceThread,
  };
}

function buildNarrative(
  mood: string,
  scenario: ScenarioId | undefined,
  causes: string[] | undefined,
  goal: RegulationGoalId,
  energyContrast: boolean,
  romanceThread: boolean
): string {
  const parts: string[] = [];

  // 核心张力：派对 + 伤心 + 感情
  if (
    scenario === "party" &&
    getMoodValence(mood) === "negative" &&
    hasCause(causes, "感情")
  ) {
    parts.push(
      "热闹派对里还在为感情难过——可能是刚分手、在人群中想起前任，或独自站在嗨氛围里心碎"
    );
  } else if (energyContrast && romanceThread) {
    parts.push(
      "场合气氛和内心不同步——表面热闹或浪漫，心里仍在消化感情"
    );
  } else if (scenario === "party" && getMoodValence(mood) === "negative") {
    parts.push("派对场合里的低落与格格不入——热闹反而衬出孤独或疲惫");
  } else if (scenario === "alone" && getMoodValence(mood) === "negative") {
    parts.push("独处时的情绪回放——需要被听见而不是被推开");
  } else if (scenario === "date" && getMoodValence(mood) === "negative") {
    parts.push("约会场景触发的落差、回忆或不安——浪漫场合里的复杂心情");
  } else {
    parts.push(`此刻主导的是「${mood}」`);
    if (scenario) {
      const labels: Record<ScenarioId, string> = {
        party: "派对聚会",
        commute: "通勤",
        work: "工作学习",
        sleep: "睡前",
        workout: "运动",
        alone: "独处",
        date: "约会",
        drive: "开车兜风",
      };
      parts.push(`叠加「${labels[scenario]}」情境`);
    }
  }

  const goalHint: Record<RegulationGoalId, string> = {
    solace: "歌单会偏向共情陪伴，不急着把你拉嗨",
    diversion: "歌单会穿插轻快节奏，帮你先离开反复想的事",
    revival: "歌单会从低处慢慢托向希望与力量",
    celebrate: "歌单会放大此刻的好心情",
    energy: "歌单会维持高能量与节拍感",
    settle: "歌单会轻柔收尾，帮你慢慢沉静",
  };
  parts.push(goalHint[goal]);

  if (causes?.length) {
    parts.push(`原因线索：${causes.join("、")}`);
  }

  return parts.join("。");
}

function scoreTrack(
  track: DemoTrack,
  interp: ContextInterpretation,
  goal: RegulationGoalId
): number {
  let score = 0;

  for (const tag of track.tags) {
    score += interp.themeWeights[tag] ?? 0;
    score += GOAL_TAG_BOOST[goal][tag] ?? 0;
  }

  if (interp.energyContrast && track.tags.includes("party_contrast")) {
    score += 5;
  }
  if (interp.energyContrast && goal === "solace" && track.tags.includes("uptempo")) {
    score -= 2;
  }
  if (interp.romanceThread && track.tags.includes("romance")) {
    score += 2;
  }

  return score;
}

export { scoreTrack };

export function selectTracksForContext(
  interp: ContextInterpretation,
  goal: RegulationGoalId,
  selectedArtists: string[],
  length: number
): DemoTrack[] {
  const selectedSet = new Set(selectedArtists);
  const fromSelection = DEMO_TRACKS.filter((t) => selectedSet.has(t.artist));
  const pool =
    fromSelection.length >= length
      ? fromSelection
      : DEMO_TRACKS;

  const scored = pool.map((track) => ({
    track,
    score: scoreTrack(track, interp, goal),
  }));

  scored.sort((a, b) => b.score - a.score);

  const picked: DemoTrack[] = [];
  const seen = new Set<string>();
  const artistCount: Record<string, number> = {};

  for (const { track } of scored) {
    const key = `${track.artist}::${track.title}`;
    if (seen.has(key)) continue;
    // 优先已选艺人，且避免同一歌手扎堆
    if (!selectedSet.has(track.artist) && fromSelection.length >= length) continue;
    if ((artistCount[track.artist] ?? 0) >= Math.ceil(length / 2)) continue;

    seen.add(key);
    artistCount[track.artist] = (artistCount[track.artist] ?? 0) + 1;
    picked.push(track);
    if (picked.length >= length) break;
  }

  // 不够则从高分列表补齐
  if (picked.length < length) {
    for (const { track } of scored) {
      const key = `${track.artist}::${track.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(track);
      if (picked.length >= length) break;
    }
  }

  return picked;
}
