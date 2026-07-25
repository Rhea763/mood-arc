import { neteaseTrackEmbedUrl } from "@/lib/play-links";

interface NeteasePlayerProps {
  songId?: number;
  embedUrl?: string;
  autoPlay?: boolean;
}

/** 网易云外链播放器（outchain/player） */
export function NeteasePlayer({
  songId,
  embedUrl,
  autoPlay = false,
}: NeteasePlayerProps) {
  const src =
    embedUrl ??
    (songId != null ? neteaseTrackEmbedUrl(songId, autoPlay) : undefined);
  if (!src) return null;

  return (
    <iframe
      title="网易云音乐播放器"
      frameBorder="no"
      width={330}
      height={86}
      src={src}
      className="mt-2 rounded-md border border-stone-200 bg-white"
      allow="autoplay"
    />
  );
}
