import { getNeteaseSongId } from "@/lib/netease-ids";

/** 单曲页：打开后可直接点播放（需登录网易云） */
export function neteaseTrackSongUrl(songId: number | string): string {
  return `https://music.163.com/#/song?id=${songId}`;
}

/** 移动端 / 唤起 App 的歌曲页 */
export function neteaseTrackMobileUrl(songId: number | string): string {
  return `https://music.163.com/m/song?id=${songId}`;
}

/** 网页迷你播放器（部分曲目可自动开始播放） */
export function neteaseTrackEmbedUrl(songId: number | string): string {
  return `https://music.163.com/outchain/player?type=2&id=${songId}&auto=1&height=66`;
}

/** 演示版：优先直达单曲页，无 ID 时退回搜索 */
export function neteaseTrackSearchUrl(artist: string, title: string): string {
  const q = encodeURIComponent(`${title} ${artist}`);
  return `https://music.163.com/#/search/m/?s=${q}`;
}

export function neteaseTrackPlayUrl(artist: string, title: string): string {
  const songId = getNeteaseSongId(artist, title);
  if (songId) return neteaseTrackSongUrl(songId);
  return neteaseTrackSearchUrl(artist, title);
}

export function neteasePlaylistSearchUrl(playlistName: string): string {
  const q = encodeURIComponent(playlistName.replace(/·/g, " "));
  return `https://music.163.com/#/search/m/?s=${q}`;
}
