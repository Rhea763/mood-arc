"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getEmotionLabel,
  getEmotionLabelZh,
} from "@/lib/emotion-catalog";
import { getMoodRecords } from "@/lib/mood-journey-storage";
import type { MoodRecord } from "@/types/emotion";

export default function JourneyPage() {
  const [records, setRecords] = useState<MoodRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => setRecords(getMoodRecords()));
  }, []);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-5 pb-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mood Journey</h1>
          <p className="mt-1 text-sm text-stone-500">情绪轨迹 · 只记录变化，不做判断</p>
        </div>
        <Link
          href="/"
          className="text-sm text-stone-500 underline-offset-2 hover:underline"
        >
          返回
        </Link>
      </header>

      {records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
          还没有记录。在首页生成歌单后，会在这里看到情绪变化。
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <article
              key={record.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {record.date}
              </p>

              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-stone-500">Before listening</p>
                  <p className="font-medium text-stone-800">
                    {getEmotionLabel(record.beforeMood.emotion)}{" "}
                    {record.beforeMood.intensity}/10
                  </p>
                  <p className="text-xs text-stone-500">
                    {getEmotionLabelZh(record.beforeMood.emotion)}
                  </p>
                </div>

                {record.playlistName && (
                  <div>
                    <p className="text-xs text-stone-500">Playlist</p>
                    <p className="text-stone-700">{record.playlistName}</p>
                  </div>
                )}

                {record.recommendedSongs.length > 0 && (
                  <div>
                    <p className="text-xs text-stone-500">Featured songs</p>
                    <ul className="mt-1 space-y-0.5 text-stone-600">
                      {record.recommendedSongs.slice(0, 3).map((s) => (
                        <li key={`${s.artist}-${s.title}`}>
                          {s.title}
                          <span className="text-stone-400"> — {s.artist}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {record.afterMood ? (
                  <div className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2">
                    <p className="text-xs text-stone-500">After listening</p>
                    <p className="font-medium text-stone-800">
                      {getEmotionLabel(record.afterMood.emotion)}{" "}
                      {record.afterMood.intensity}/10
                    </p>
                    <p className="mt-2 text-xs text-stone-600 italic">
                      Your mood changed
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">
                    听完歌单后可在首页记录「听后的感受」
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
