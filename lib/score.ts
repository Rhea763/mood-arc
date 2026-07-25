import type { VideoItem } from "@/types/music";

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function keywordHits(text: string, keywords: string[]): number {
  const lower = normalize(text);
  let hits = 0;
  for (const kw of keywords) {
    const parts = normalize(kw).split(/\s+/);
    if (parts.some((p) => p.length > 2 && lower.includes(p))) {
      hits += 1;
    }
  }
  return hits;
}

export function scoreVideo(
  video: VideoItem,
  selectedChannelNames: string[],
  queryKeywords: string[]
): number {
  let score = 0;

  const channelLower = normalize(video.channelName);
  const selectedLower = selectedChannelNames.map(normalize);

  if (
    selectedLower.some(
      (c) => channelLower.includes(c) || c.includes(channelLower)
    )
  ) {
    score += 10;
  }

  const text = `${video.name} ${video.channelName}`;
  score += keywordHits(text, queryKeywords) * 3;

  if (video.viewCount != null) {
    score += Math.log10(video.viewCount + 1);
  }

  return score;
}
