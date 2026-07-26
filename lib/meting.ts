/** Public Meting API mirror for Netease stream URLs (demo playback). */
export const METING_API = "https://api.injahow.cn/meting/";

export interface MetingSong {
  name: string;
  artist: string;
  url: string;
  pic: string;
  lrc?: string;
}

export async function fetchMetingSong(songId: number): Promise<MetingSong | null> {
  const res = await fetch(
    `${METING_API}?server=netease&type=song&id=${songId}`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as MetingSong[];
  const song = data?.[0];
  if (!song?.url) return null;
  return song;
}

export function parseNeteaseSongIdFromEmbedUrl(embedUrl: string): number | null {
  const match = embedUrl.match(/[?&]id=(\d+)/);
  return match ? Number(match[1]) : null;
}
