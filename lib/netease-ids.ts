import neteaseIds from "@/data/netease-song-ids.json";

const ID_MAP = neteaseIds as Record<string, number | null>;

export function getNeteaseSongId(artist: string, title: string): number | null {
  const id = ID_MAP[`${artist}::${title}`];
  return typeof id === "number" ? id : null;
}
