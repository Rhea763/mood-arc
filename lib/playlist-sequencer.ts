import type { RegulationGoalId } from "@/lib/context-catalog";
import type { ContextInterpretation } from "@/lib/context-interpretation";
import { scoreTrack } from "@/lib/context-interpretation";
import type { DemoTrack } from "@/lib/demo-track-catalog";
import { DEMO_TRACKS } from "@/lib/demo-track-catalog";
import {
  buildArcPlan,
  type ArcPlan,
  type ArcSlot,
  type ArcSlotId,
} from "@/lib/arc-templates";
import { LYRIC_FOCUS_LABELS, scoreLyricForArcSlot } from "@/lib/lyric-focus";
import {
  VOCAL_TIMBRE_LABELS,
  orderTracksByTimbreGradient,
  scoreTimbreTransition,
  scoreVocalTimbreForSlot,
} from "@/lib/vocal-timbre";

export interface SequencedTrack {
  title: string;
  artist: string;
  energy: number;
  valence: number;
  lyricFocus: string;
  lyricFocusLabel: string;
  lyricDirectness: number;
  vocalTimbre: string;
  vocalTimbreLabel: string;
  phase: ArcSlotId;
  phaseLabel: string;
  note: string;
}

function inRange(value: number, [lo, hi]: [number, number]): boolean {
  return value >= lo && value <= hi;
}

function rangeDistance(
  value: number,
  [lo, hi]: [number, number]
): number {
  const mid = (lo + hi) / 2;
  return Math.abs(value - mid);
}

function countArtistsInPool(pool: DemoTrack[]): number {
  return new Set(pool.map((t) => t.artist)).size;
}

function maxPerArtistInSlot(slotCount: number, artistCount: number): number {
  if (artistCount <= 0) return 2;
  return Math.max(1, Math.ceil(slotCount / artistCount));
}

/** 正向高能量段：能量过低则暂不入选（除非无曲可选） */
function belowArcFloor(track: DemoTrack, slot: ArcSlot): boolean {
  const energyFloor = slot.targetEnergy[0] - 0.12;
  const valenceFloor = slot.targetValence[0] - 0.12;
  return track.energy < energyFloor && track.valence < valenceFloor;
}

function orderSlotTracks(slot: ArcSlot, tracks: DemoTrack[]): DemoTrack[] {
  if (tracks.length <= 1) return tracks;
  const midEnergy = (slot.targetEnergy[0] + slot.targetEnergy[1]) / 2;
  if (midEnergy >= 0.55) {
    return [...tracks].sort((a, b) => a.energy - b.energy);
  }
  if (midEnergy <= 0.4) {
    return orderTracksByTimbreGradient(tracks);
  }
  return [...tracks].sort(
    (a, b) =>
      (a.energy + a.valence) / 2 - (b.energy + b.valence) / 2
  );
}

function scoreForSlot(
  track: DemoTrack,
  slot: ArcSlot,
  interp: ContextInterpretation,
  goal: RegulationGoalId,
  prevTrack: DemoTrack | null,
  artistCount: Record<string, number>,
  fairShare: number
): number {
  const theme = scoreTrack(track, interp, goal);
  const energyDist = rangeDistance(track.energy, slot.targetEnergy);
  const valenceDist = rangeDistance(track.valence, slot.targetValence);
  const inEnergy = inRange(track.energy, slot.targetEnergy);
  const inValence = inRange(track.valence, slot.targetValence);

  let fit = 0;
  if (inEnergy && inValence) fit += 4;
  fit -= energyDist * 3;
  fit -= valenceDist * 3;
  fit += theme * 0.2;
  fit += scoreLyricForArcSlot(track, slot) * 0.35;
  fit += scoreVocalTimbreForSlot(track, slot) * 0.35;
  fit += scoreTimbreTransition(track, prevTrack) * 0.5;

  if (slot.id === "hold" && track.phaseFit === "verse") fit += 0.4;
  if (
    slot.id === "bridge" &&
    (track.phaseFit === "bridge" || track.phaseFit === "climax")
  )
    fit += 0.35;
  if (slot.id === "lift" && track.phaseFit === "chorus" && track.valence >= 0.55)
    fit += 0.4;

  const used = artistCount[track.artist] ?? 0;
  if (used >= fairShare + 1) fit -= (used - fairShare) * 2;

  return fit;
}

function pickOneForSlot(
  scored: { track: DemoTrack; score: number }[],
  used: Set<string>,
  artistCount: Record<string, number>,
  slotArtistCount: Record<string, number>,
  maxPerArtist: number,
  maxInSlot: number,
  relax: "none" | "slot" | "global" | "all"
): DemoTrack | null {
  for (const { track } of scored) {
    const key = `${track.artist}::${track.title}`;
    if (used.has(key)) continue;
    if (relax === "none" || relax === "slot") {
      if ((artistCount[track.artist] ?? 0) >= maxPerArtist) continue;
    }
    if (relax === "none") {
      if ((slotArtistCount[track.artist] ?? 0) >= maxInSlot) continue;
    }
    used.add(key);
    artistCount[track.artist] = (artistCount[track.artist] ?? 0) + 1;
    slotArtistCount[track.artist] = (slotArtistCount[track.artist] ?? 0) + 1;
    return track;
  }
  return null;
}

function pickForSlot(
  slot: ArcSlot,
  pool: DemoTrack[],
  used: Set<string>,
  artistCount: Record<string, number>,
  maxPerArtist: number,
  maxInSlot: number,
  fairShare: number,
  interp: ContextInterpretation,
  goal: RegulationGoalId,
  prevTrack: DemoTrack | null
): DemoTrack[] {
  const picked: DemoTrack[] = [];
  const slotArtistCount: Record<string, number> = {};
  let last = prevTrack;

  for (let n = 0; n < slot.count; n++) {
    const available = pool.filter((t) => !used.has(`${t.artist}::${t.title}`));
    const arcFit = available.filter((t) => !belowArcFloor(t, slot));
    const candidatePools = [
      arcFit.length > 0 ? arcFit : available,
      available,
    ];

    let chosen: DemoTrack | null = null;
    for (const candidates of candidatePools) {
      const scored = candidates
        .map((track) => ({
          track,
          score: scoreForSlot(
            track,
            slot,
            interp,
            goal,
            last,
            artistCount,
            fairShare
          ),
        }))
        .sort((a, b) => b.score - a.score);

      chosen =
        pickOneForSlot(
          scored,
          used,
          artistCount,
          slotArtistCount,
          maxPerArtist,
          maxInSlot,
          "none"
        ) ??
        pickOneForSlot(
          scored,
          used,
          artistCount,
          slotArtistCount,
          maxPerArtist,
          maxInSlot,
          "slot"
        ) ??
        pickOneForSlot(
          scored,
          used,
          artistCount,
          slotArtistCount,
          maxPerArtist,
          maxInSlot,
          "global"
        );
      if (chosen) break;
    }

    if (!chosen) break;
    picked.push(chosen);
    last = chosen;
  }

  return orderSlotTracks(slot, picked);
}

export function buildCandidatePool(
  interp: ContextInterpretation,
  goal: RegulationGoalId,
  selectedArtists: string[],
  minSize: number
): DemoTrack[] {
  const selectedSet = new Set(selectedArtists);
  const fromSelection = DEMO_TRACKS.filter((t) => selectedSet.has(t.artist));
  if (fromSelection.length >= minSize) return fromSelection;

  const pool = DEMO_TRACKS;

  const scored = pool
    .map((track) => ({
      track,
      score: scoreTrack(track, interp, goal),
    }))
    .sort((a, b) => b.score - a.score);

  const out: DemoTrack[] = [];
  const seen = new Set<string>();
  for (const { track } of scored) {
    const key = `${track.artist}::${track.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(track);
    if (out.length >= minSize) break;
  }
  return out;
}

export function sequencePlaylist(
  interp: ContextInterpretation,
  goal: RegulationGoalId,
  selectedArtists: string[],
  length: number,
  mood?: string
): { plan: ArcPlan; tracks: SequencedTrack[] } {
  const plan = buildArcPlan(goal, length, mood);
  const pool = buildCandidatePool(
    interp,
    goal,
    selectedArtists,
    Math.max(length * 2, 24)
  );
  const used = new Set<string>();
  const artistCount: Record<string, number> = {};
  const artistN = Math.max(1, countArtistsInPool(pool));
  const maxPerArtist = Math.max(2, Math.ceil(length / artistN));
  const fairShare = length / artistN;

  const sequenced: SequencedTrack[] = [];
  let prevTrack: DemoTrack | null = null;

  for (const slot of plan.slots) {
    const maxInSlot = maxPerArtistInSlot(slot.count, artistN);
    const batch = pickForSlot(
      slot,
      pool,
      used,
      artistCount,
      maxPerArtist,
      maxInSlot,
      fairShare,
      interp,
      goal,
      prevTrack
    );
    for (const track of batch) {
      sequenced.push({
        title: track.title,
        artist: track.artist,
        energy: track.energy,
        valence: track.valence,
        lyricFocus: track.lyricFocus,
        lyricFocusLabel: LYRIC_FOCUS_LABELS[track.lyricFocus],
        lyricDirectness: track.lyricDirectness,
        vocalTimbre: track.vocalTimbre,
        vocalTimbreLabel: VOCAL_TIMBRE_LABELS[track.vocalTimbre],
        phase: slot.id,
        phaseLabel: slot.label,
        note: track.note,
      });
      prevTrack = track;
    }
  }

  return { plan, tracks: sequenced };
}
