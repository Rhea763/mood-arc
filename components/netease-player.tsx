"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchMetingSong,
  parseNeteaseSongIdFromEmbedUrl,
} from "@/lib/meting";
import { neteaseTrackEmbedUrl } from "@/lib/play-links";

interface NeteasePlayerProps {
  songId?: number;
  embedUrl?: string;
  autoPlay?: boolean;
}

type APlayerInstance = { destroy: () => void };

/** 页内试听：Meting 拉流 + APlayer；失败时退回网易云外链 iframe */
export function NeteasePlayer({
  songId,
  embedUrl,
  autoPlay = false,
}: NeteasePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<APlayerInstance | null>(null);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resolvedId =
    songId ??
    (embedUrl ? parseNeteaseSongIdFromEmbedUrl(embedUrl) : undefined);

  useEffect(() => {
    if (!resolvedId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFallbackSrc(null);

    const iframeFallback = embedUrl ?? neteaseTrackEmbedUrl(resolvedId, autoPlay);

    (async () => {
      try {
        const song = await fetchMetingSong(resolvedId);
        if (cancelled) return;

        if (!song) {
          setFallbackSrc(iframeFallback);
          setLoading(false);
          return;
        }

        const mod = await import("aplayer");
        await import("aplayer/dist/APlayer.min.css");
        const APlayerCtor = (mod as { default?: new (opts: object) => APlayerInstance })
          .default;
        if (!APlayerCtor || cancelled || !containerRef.current) {
          setFallbackSrc(iframeFallback);
          setLoading(false);
          return;
        }

        playerRef.current?.destroy();
        containerRef.current.innerHTML = "";

        playerRef.current = new APlayerCtor({
          container: containerRef.current,
          autoplay: autoPlay,
          mini: true,
          audio: [
            {
              name: song.name,
              artist: song.artist,
              url: song.url,
              cover: song.pic,
            },
          ],
        });
        setLoading(false);
      } catch {
        if (!cancelled) {
          setFallbackSrc(iframeFallback);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [resolvedId, embedUrl, autoPlay]);

  if (!resolvedId && !embedUrl) return null;

  if (fallbackSrc) {
    return (
      <iframe
        title="网易云音乐播放器"
        frameBorder="no"
        width={330}
        height={86}
        src={fallbackSrc}
        className="mt-2 rounded-md border border-stone-200 bg-white"
        allow="autoplay"
      />
    );
  }

  return (
    <div className="mt-2 min-h-[66px]">
      {loading && (
        <p className="text-xs text-stone-400">加载播放器…</p>
      )}
      <div ref={containerRef} />
    </div>
  );
}
