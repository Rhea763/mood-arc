"use client";

import Image from "next/image";
import { lyricAtTime } from "@/lib/parse-lrc";
import {
  formatTime,
  useDemoAudioPlayer,
} from "@/lib/demo-audio-player-context";

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function GlobalDemoPlayer() {
  const {
    active,
    playlistName,
    tracks,
    trackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrev,
    seek,
    close,
  } = useDemoAudioPlayer();

  if (!active || !currentTrack) return null;

  const lyric = lyricAtTime(currentTrack.lyrics, currentTime);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
      role="region"
      aria-label="完整版示例播放器"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100 shadow-sm">
            <Image
              src={currentTrack.cover}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
              unoptimized
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-stone-400">
              {playlistName}
              {tracks.length > 0 && (
                <span className="ml-2 normal-case text-stone-500">
                  {trackIndex + 1}/{tracks.length}
                </span>
              )}
            </p>
            <p className="truncate text-sm font-semibold text-stone-900">
              {currentTrack.title}
            </p>
            <p className="truncate text-xs text-stone-500">{currentTrack.artist}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={playPrev}
              className="rounded-full p-2 text-stone-600 transition hover:bg-stone-100"
              aria-label="上一首"
            >
              <IconPrev />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full bg-stone-900 p-2.5 text-white transition hover:bg-stone-700"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="rounded-full p-2 text-stone-600 transition hover:bg-stone-100"
              aria-label="下一首"
            >
              <IconNext />
            </button>
            <button
              type="button"
              onClick={close}
              className="ml-1 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
              aria-label="关闭播放器"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <p className="min-h-[1.25rem] truncate text-center text-sm text-stone-600">
          {lyric || "…"}
        </p>

        <div className="flex items-center gap-2 text-[11px] tabular-nums text-stone-400">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer accent-stone-900"
            aria-label="播放进度"
          />
          <span className="w-9">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
