"use client";

import Link from "next/link";
import type { MoodRecord } from "@/types/emotion";
import {
  getEmotionLabelZh,
  playlistThemeName,
} from "@/lib/emotion-catalog";
import { getRegulationGoalLabel } from "@/lib/context-catalog";
import type { EmotionId, IntentionId } from "@/types/emotion";
import type { RegulationGoalId } from "@/types/music";

function intensityBar(intensity: number): string {
  const filled = Math.round(intensity);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

interface DailyMoodCardProps {
  record: MoodRecord | null;
  currentMood?: string | null;
  currentEmotion?: string | null;
  currentIntensity?: number;
  currentIntention?: string | null;
  onScrollToForm?: () => void;
}

export function DailyMoodCard({
  record,
  currentMood,
  currentEmotion,
  currentIntensity = 5,
  currentIntention,
  onScrollToForm,
}: DailyMoodCardProps) {
  const moodLabel = record?.moodId ?? currentMood;
  const emotion = record?.emotion ?? currentEmotion;
  const intensity = record?.intensity ?? currentIntensity;
  const intention = record?.intention ?? currentIntention;
  const regulationGoal = record?.regulationGoal as RegulationGoalId | undefined;

  const hasSelection = Boolean(moodLabel || emotion);

  return (
    <section className="rounded-xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm">
      <p className="text-xs font-medium tracking-wide text-stone-400">
        今天的心绪
      </p>

      {hasSelection ? (
        <div className="mt-4 space-y-3">
          {moodLabel && (
            <div>
              <p className="text-xs text-stone-500">今天的心情</p>
              <p className="text-lg font-medium text-stone-800">{moodLabel}</p>
            </div>
          )}
          {emotion && (
            <div>
              <p className="text-xs text-stone-500">情绪细项</p>
              <p className="text-sm text-stone-700">
                {getEmotionLabelZh(emotion as EmotionId)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-stone-500">情绪强度</p>
            <p className="font-mono text-sm text-stone-700">
              {intensityBar(intensity)} {intensity}/10
            </p>
          </div>
          {regulationGoal && (
            <div>
              <p className="text-xs text-stone-500">调节目标</p>
              <p className="text-sm text-stone-700">
                {getRegulationGoalLabel(regulationGoal)}
              </p>
            </div>
          )}
          {emotion && intention && !regulationGoal && (
            <div>
              <p className="text-xs text-stone-500">推荐歌单主题</p>
              <p className="text-sm text-stone-700 italic">
                &ldquo;
                {playlistThemeName(
                  emotion as EmotionId,
                  intention as IntentionId
                )}
                &rdquo;
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onScrollToForm}
              className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm text-stone-700 hover:border-stone-400"
            >
              更新心情
            </button>
            <Link
              href="/journey"
              className="rounded-full border border-stone-200 px-4 py-1.5 text-sm text-stone-600 hover:border-stone-300"
            >
              情绪轨迹
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-stone-600">
            还没有记录今天的心情。选一种心情，我们会为你匹配歌单。
          </p>
          <button
            type="button"
            onClick={onScrollToForm}
            className="mt-3 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            开始记录
          </button>
        </div>
      )}
    </section>
  );
}
