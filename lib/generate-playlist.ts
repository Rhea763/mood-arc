import type { RegulationGoalId, ScenarioId } from "@/lib/context-catalog";
import {
  getRegulationGoalLabel,
  getScenarioLabel,
} from "@/lib/context-catalog";
import { interpretContext } from "@/lib/context-interpretation";
import type { PlaylistLength } from "@/types/music";
import type { GenerateResponse } from "@/types/music";
import { sequencePlaylist } from "@/lib/playlist-sequencer";

export function buildSequencedPlaylist(
  mood: string,
  causes: string[] | undefined,
  selectedChannelNames: string[],
  regulationGoal: RegulationGoalId,
  playlistLength: PlaylistLength,
  scenario?: ScenarioId
) {
  const interpretation = interpretContext(
    mood,
    scenario,
    causes,
    regulationGoal
  );
  const { plan, tracks } = sequencePlaylist(
    interpretation,
    regulationGoal,
    selectedChannelNames,
    playlistLength,
    mood
  );

  const date = new Date().toISOString().slice(0, 10);
  const goalLabel = getRegulationGoalLabel(regulationGoal, mood);
  const scenarioLabel = scenario ? getScenarioLabel(scenario) : null;
  const causeText = causes?.length ? causes.join("、") : "无";
  const channelText = selectedChannelNames.slice(0, 5).join("、") || "默认口味";

  const nameParts = ["MoodArc", mood];
  if (scenarioLabel) nameParts.push(scenarioLabel);
  nameParts.push(goalLabel, date);
  const playlistName = nameParts.join(" · ");

  const descriptionParts = [
    "MoodArc 生成",
    `心情：${mood}`,
    scenarioLabel ? `情境：${scenarioLabel}` : null,
    `目标：${goalLabel}`,
    `${playlistLength} 首 · 三段弧线`,
    `原因：${causeText}`,
    `艺人：${channelText}`,
  ].filter(Boolean);

  const summaryParts = [
    "弧线打分",
    `心情：${mood}`,
    scenarioLabel ? `情境：${scenarioLabel}` : null,
    `目标：${goalLabel}`,
    `${playlistLength} 首 · 三段弧线`,
    `原因：${causeText}`,
    `艺人：${channelText}`,
  ].filter(Boolean);

  return {
    interpretation,
    plan,
    tracks,
    playlistName,
    playlistDescription: descriptionParts.join(" · "),
    summary: summaryParts.join(" · "),
    scenarioLabel,
    goalLabel,
  };
}

export function sequencedTracksToVideos(
  resolved: Array<{
    track: import("@/lib/playlist-sequencer").SequencedTrack;
    video: import("@/types/music").VideoItem;
  }>
): GenerateResponse["videos"] {
  return resolved.map(({ track, video }) => ({
    name: video.name,
    channel: track.artist,
    url: video.url,
    phase: track.phase,
    phaseLabel: track.phaseLabel,
    energy: track.energy,
    valence: track.valence,
    lyricFocus: track.lyricFocus,
    lyricFocusLabel: track.lyricFocusLabel,
    lyricDirectness: track.lyricDirectness,
    vocalTimbre: track.vocalTimbre,
    vocalTimbreLabel: track.vocalTimbreLabel,
    note: track.note,
  }));
}
