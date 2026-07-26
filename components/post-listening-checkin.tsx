"use client";

import { useState } from "react";
import { EMOTIONS, intentionsForEmotion } from "@/lib/emotion-catalog";
import type { EmotionId, IntentionId } from "@/types/emotion";
import { EmotionIntensitySlider } from "@/components/emotion-intensity-slider";

interface PostListeningCheckinProps {
  onSave: (emotion: EmotionId, intensity: number, intention: IntentionId) => void;
}

export function PostListeningCheckin({ onSave }: PostListeningCheckinProps) {
  const [emotion, setEmotion] = useState<EmotionId | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [intention, setIntention] = useState<IntentionId | null>(null);

  const availableIntentions = emotion ? intentionsForEmotion(emotion) : [];

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-4">
      <div>
        <p className="text-sm font-medium text-stone-800">听完后，心情如何？</p>
        <p className="text-xs text-stone-500 mt-0.5">
          After listening — we only note the change, not whether music &ldquo;healed&rdquo; you.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {EMOTIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setEmotion(e.id);
              setIntention(null);
            }}
            className={`rounded-lg border py-2 text-xs font-medium transition ${
              emotion === e.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            {e.emoji} {e.labelEn}
          </button>
        ))}
      </div>

      <EmotionIntensitySlider value={intensity} onChange={setIntensity} />

      {emotion && (
        <div className="space-y-2">
          {availableIntentions.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setIntention(i.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                intention === i.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700"
              }`}
            >
              {i.labelZh}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={!emotion || !intention}
        onClick={() => {
          if (emotion && intention) onSave(emotion, intensity, intention);
        }}
        className="w-full rounded-full border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-800 enabled:hover:border-stone-400 disabled:opacity-40"
      >
        记录听后的感受
      </button>
    </div>
  );
}
