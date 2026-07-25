import type { DemoTrack } from "@/lib/demo-track-catalog";
import type { ArcSlot } from "@/lib/arc-templates";

/** 演唱音色气质（按单曲标注，非按歌手） */
export type VocalTimbre =
  | "breathy_hushed" // 慵懒气声、低沉绵软（Lana / we can't be friends）
  | "ethereal_float" // 飘渺空灵、混响厚（Gracie 梦幻向）
  | "soft_warm" // 柔暖贴耳、R&B 质感（Ariana thank u / positions）
  | "clear_bright" // 明亮清透、中高声区
  | "playful_bounce" // 俏皮跳跃、轻盈
  | "theatrical_bold" // 戏剧张力、夸张咬字
  | "cool_sharp" // 冷峻利落、暗黑咬字（LWYMMD）
  | "power_belt"; // 强声喊唱、摇滚爆发（good 4 u）

export const VOCAL_TIMBRE_LABELS: Record<VocalTimbre, string> = {
  breathy_hushed: "慵懒低沉",
  ethereal_float: "飘渺空灵",
  soft_warm: "柔暖贴耳",
  clear_bright: "明亮清透",
  playful_bounce: "俏皮跳跃",
  theatrical_bold: "戏剧张力",
  cool_sharp: "冷峻利落",
  power_belt: "强声爆发",
};

/** 音色轴：从内敛贴地 → 外放冲击，用于渐变排序 */
export const TIMBRE_AXIS: Record<VocalTimbre, number> = {
  breathy_hushed: 0.1,
  ethereal_float: 0.22,
  soft_warm: 0.38,
  clear_bright: 0.55,
  playful_bounce: 0.62,
  theatrical_bold: 0.72,
  cool_sharp: 0.82,
  power_belt: 0.95,
};

export function getTimbreAxis(timbre: VocalTimbre): number {
  return TIMBRE_AXIS[timbre];
}

export function scoreVocalTimbreForSlot(track: DemoTrack, slot: ArcSlot): number {
  const list = slot.targetVocalTimbre;
  const idx = list.indexOf(track.vocalTimbre);
  let score = 0;
  if (idx >= 0) {
    score += (list.length - idx) * 0.55;
  } else {
    score -= 1;
  }
  return score;
}

/** 相邻曲目音色不宜雷同；理想间隔约 0.12–0.35 */
export function scoreTimbreTransition(
  track: DemoTrack,
  prev: DemoTrack | null
): number {
  if (!prev) return 0;
  const d = Math.abs(
    getTimbreAxis(track.vocalTimbre) - getTimbreAxis(prev.vocalTimbre)
  );
  if (d < 0.08) return -2.8;
  if (d < 0.15) return -1.2;
  if (d <= 0.38) return 0.9;
  if (d <= 0.55) return 0.4;
  return -0.3;
}

export function orderTracksByTimbreGradient(tracks: DemoTrack[]): DemoTrack[] {
  return [...tracks].sort(
    (a, b) => getTimbreAxis(a.vocalTimbre) - getTimbreAxis(b.vocalTimbre)
  );
}
