"use client";

import type { GenerateVideo } from "@/types/music";

interface SongRecommendationProps {
  video: GenerateVideo;
}

function MatchBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-16 shrink-0 text-stone-500">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-stone-600"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-stone-500">{value}%</span>
    </div>
  );
}

export function SongRecommendation({ video }: SongRecommendationProps) {
  const match = video.emotionMatch;

  return (
    <div className="rounded-lg border border-stone-100 bg-white/80 p-3">
      {video.reason && (
        <p className="text-xs leading-relaxed text-stone-600">
          <span className="font-medium text-stone-700">为什么推荐 · </span>
          {video.reason}
        </p>
      )}
      {match && (
        <div className="mt-2 space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Emotion match
          </p>
          <MatchBar label="Sadness" value={match.sadness} />
          <MatchBar label="Comfort" value={match.comfort} />
          <MatchBar label="Energy" value={match.energy} />
        </div>
      )}
      {!video.reason && video.note && (
        <p className="text-xs text-stone-500">{video.note}</p>
      )}
    </div>
  );
}
