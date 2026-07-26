"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FULL_DEMO_PLAYLIST,
  FULL_DEMO_PLAYLIST_NAME,
  type DemoAudioTrack,
} from "@/lib/demo-full-playlist";

interface DemoAudioPlayerState {
  active: boolean;
  playlistName: string;
  tracks: DemoAudioTrack[];
  trackIndex: number;
  currentTrack: DemoAudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loadFullDemo: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  close: () => void;
}

const DemoAudioPlayerContext = createContext<DemoAudioPlayerState | null>(null);

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export { formatTime };

export function DemoAudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const tracksLengthRef = useRef(0);
  const [active, setActive] = useState(false);
  const [tracks, setTracks] = useState<DemoAudioTrack[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[trackIndex] ?? null;

  trackIndexRef.current = trackIndex;
  tracksLengthRef.current = tracks.length;

  const loadTrack = useCallback((index: number, autoplay = true) => {
    const audio = audioRef.current;
    const list = FULL_DEMO_PLAYLIST;
    if (!audio || index < 0 || index >= list.length) return;

    setTracks(list);
    setTrackIndex(index);
    setActive(true);
    setCurrentTime(0);
    setDuration(0);
    audio.src = list[index]!.src;
    audio.load();
    if (autoplay) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
    }
  }, []);

  const loadFullDemo = useCallback(() => {
    loadTrack(0, true);
  }, [loadTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const playNext = useCallback(() => {
    if (tracks.length === 0) return;
    const next = (trackIndex + 1) % tracks.length;
    loadTrack(next, true);
  }, [trackIndex, tracks.length, loadTrack]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prev = (trackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prev, true);
  }, [trackIndex, tracks.length, loadTrack]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const close = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setActive(false);
    setIsPlaying(false);
    setTracks([]);
    setTrackIndex(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      const len = tracksLengthRef.current;
      if (len === 0) return;
      const next = (trackIndexRef.current + 1) % len;
      const list = FULL_DEMO_PLAYLIST;
      const audioEl = audioRef.current;
      if (!audioEl || next < 0 || next >= list.length) return;
      setTrackIndex(next);
      setCurrentTime(0);
      setDuration(0);
      audioEl.src = list[next]!.src;
      audioEl.load();
      void audioEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-global-demo-player", active);
    return () => document.body.classList.remove("has-global-demo-player");
  }, [active]);

  const value = useMemo<DemoAudioPlayerState>(
    () => ({
      active,
      playlistName: FULL_DEMO_PLAYLIST_NAME,
      tracks,
      trackIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      loadFullDemo,
      togglePlay,
      playNext,
      playPrev,
      seek,
      close,
    }),
    [
      active,
      tracks,
      trackIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      loadFullDemo,
      togglePlay,
      playNext,
      playPrev,
      seek,
      close,
    ],
  );

  return (
    <DemoAudioPlayerContext.Provider value={value}>
      {children}
    </DemoAudioPlayerContext.Provider>
  );
}

export function useDemoAudioPlayer(): DemoAudioPlayerState {
  const ctx = useContext(DemoAudioPlayerContext);
  if (!ctx) {
    throw new Error("useDemoAudioPlayer must be used within DemoAudioPlayerProvider");
  }
  return ctx;
}
