"use client";

import { useState } from "react";
import Image from "next/image";
import { lyricAtTime } from "@/lib/parse-lrc";
import {
  formatTime,
  useDemoAudioPlayer,
} from "@/lib/demo-audio-player-context";

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
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

  const [expanded, setExpanded] = useState(false);

  if (!active || !currentTrack) return null;

  const lyric = lyricAtTime(currentTrack.lyrics, currentTime);

  return (
    <div
      className="fixed top-4 right-4 z-[90] flex flex-col items-end gap-2"
      role="region"
      aria-label="完整版示例播放器"
    >
      {expanded && (
        <div className="w-64 rounded-xl border border-stone-200 bg-white/95 p-3 shadow-lg backdrop-blur-md">
          <p className="truncate text-[10px] font-medium uppercase tracking-wide text-stone-400">
            {playlistName}
            {tracks.length > 0 && (
              <span className="ml-1 normal-case">
                {trackIndex + 1}/{tracks.length}
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-stone-900">
            {currentTrack.title}
          </p>
          <p className="truncate text-xs text-stone-500">{currentTrack.artist}</p>
          <p className="mt-2 min-h-[1.25rem] truncate text-center text-xs text-stone-600">
            {lyric || "…"}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] tabular-nums text-stone-400">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
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
            <span className="w-8">{formatTime(duration)}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={playPrev}
              className="rounded-full p-1.5 text-stone-600 transition hover:bg-stone-100"
              aria-label="上一首"
            >
              <IconPrev />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full bg-stone-900 p-2 text-white transition hover:bg-stone-700"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="rounded-full p-1.5 text-stone-600 transition hover:bg-stone-100"
              aria-label="下一首"
            >
              <IconNext />
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-stone-100 shadow-md ring-1 ring-stone-200/80">
          <Image
            src={currentTrack.cover}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
          {!isPlaying && (
            <span className="absolute inset-0 bg-black/20" aria-hidden />
          )}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center text-white transition hover:bg-black/10"
            aria-label={isPlaying ? "暂停" : "播放"}
          >
            <span className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
              {isPlaying ? <IconPause /> : <IconPlay />}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="absolute bottom-1 left-1 rounded bg-black/45 px-1 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label={expanded ? "收起详情" : "展开详情"}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            close();
          }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-800 text-white shadow transition hover:bg-stone-600"
          aria-label="关闭播放器"
        >
          <IconClose />
        </button>
      </div>
    </div>
  );
}
