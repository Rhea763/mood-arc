"use client";

interface EmotionIntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function EmotionIntensitySlider({
  value,
  onChange,
}: EmotionIntensitySliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-700">情绪强度</p>
        <span className="text-sm font-mono text-stone-500">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-stone-900"
        aria-label="Emotional intensity"
      />
      <div className="flex justify-between text-[10px] text-stone-400">
        <span>轻微</span>
        <span>强烈</span>
      </div>
    </div>
  );
}
