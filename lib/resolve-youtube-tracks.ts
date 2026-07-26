import type { SequencedTrack } from "@/lib/playlist-sequencer";
import type { VideoItem } from "@/types/music";
import { searchVideos } from "@/lib/youtube";

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function channelMatchesArtist(channelName: string, artist: string): boolean {
  const ch = normalize(channelName);
  const ar = normalize(artist);
  return ch.includes(ar) || ar.includes(ch);
}

function titleMatches(videoTitle: string, trackTitle: string): boolean {
  const vt = normalize(videoTitle);
  const tt = normalize(trackTitle);
  return vt.includes(tt) || tt.includes(vt);
}

export function pickBestYouTubeMatch(
  results: VideoItem[],
  artist: string,
  title: string
): VideoItem | null {
  if (results.length === 0) return null;

  const exact = results.find(
    (v) =>
      channelMatchesArtist(v.channelName, artist) && titleMatches(v.name, title)
  );
  if (exact) return exact;

  const artistMatch = results.find((v) =>
    channelMatchesArtist(v.channelName, artist)
  );
  if (artistMatch) return artistMatch;

  const titleMatch = results.find((v) => titleMatches(v.name, title));
  if (titleMatch) return titleMatch;

  return results[0];
}

/** Map arc-sequenced demo tracks to YouTube videos (one search per track). */
export async function resolveSequencedTracksToYouTube(
  accessToken: string,
  tracks: SequencedTrack[]
): Promise<Array<{ track: SequencedTrack; video: VideoItem }>> {
  const resolved: Array<{ track: SequencedTrack; video: VideoItem }> = [];
  const usedVideoIds = new Set<string>();

  for (const track of tracks) {
    const query = `${track.artist} ${track.title}`;
    const results = await searchVideos(accessToken, query, 8);
    const match = pickBestYouTubeMatch(
      results.filter((v) => !usedVideoIds.has(v.id)),
      track.artist,
      track.title
    );
    if (match) {
      usedVideoIds.add(match.id);
      resolved.push({ track, video: match });
    }
  }

  return resolved;
}
