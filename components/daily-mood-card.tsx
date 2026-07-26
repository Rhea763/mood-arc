"use client";

import Link from "next/link";
import type { MoodRecord } from "@/types/emotion";
import { getEmotionLabel, playlistThemeName } from "@/lib/emotion-catalog";

function intensityBar(intensity: number): string {
  const filled = Math.round(intensity);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

interface DailyMoodCardProps {
  record: MoodRecord | null;
  currentEmotion?: string | null;
  currentIntensity?: number;
  currentIntention?: string | null;
  onScrollToForm?: () => void;
}

export function DailyMoodCard({
  record,
  currentEmotion,
  currentIntensity = 5,
  currentIntention,
  onScrollToForm,
}: DailyMoodCardProps) {
  const emotion = record?.emotion ?? currentEmotion;
  const intensity = record?.intensity ?? currentIntensity;
  const intention = record?.intention ?? currentIntention;

  return (
    <section className="rounded-xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
        How are you feeling today?
      </p>
      <p className="mt-1 text-sm text-stone-500">今天的心绪</p>

      {emotion ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs text-stone-500">Today&apos;s mood</p>
            <p className="text-lg font-medium text-stone-800">
              {getEmotionLabel(emotion as import("@/types/emotion").EmotionId)}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500">Intensity</p>
            <p className="font-mono text-sm text-stone-700">
              {intensityBar(intensity)} {intensity}/10
            </p>
          </div>
          {intention && (
            <div>
              <p className="text-xs text-stone-500">Recommended playlist</p>
              <p className="text-sm text-stone-700 italic">
                &ldquo;
                {playlistThemeName(
                  emotion as import("@/types/emotion").EmotionId,
                  intention as import("@/types/emotion").IntentionId
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
              更新心情 / Update
            </button>
            <Link
              href="/journey"
              className="rounded-full border border-stone-200 px-4 py-1.5 text-sm text-stone-600 hover:border-stone-300"
            >
              情绪轨迹 / Journey
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-stone-600">
            还没有记录今天的心情。选一种情绪，我们会为你匹配歌单。
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
