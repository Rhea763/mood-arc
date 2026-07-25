import type { VideoItem } from "@/types/music";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

export class YouTubeApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "YouTubeApiError";
  }
}

async function youtubeFetch<T>(
  accessToken: string,
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${YOUTUBE_API}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new YouTubeApiError(
      res.status,
      body || `YouTube API error ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

export async function getMyChannel(accessToken: string) {
  const data = await youtubeFetch<{
    items: Array<{ id: string; snippet: { title: string } }>;
  }>(accessToken, "/channels?part=snippet&mine=true");

  const ch = data.items[0];
  return {
    id: ch?.id ?? "me",
    name: ch?.snippet?.title ?? "YouTube 用户",
  };
}

export async function getSubscriptions(accessToken: string, maxResults = 25) {
  const data = await youtubeFetch<{
    items: Array<{
      snippet: {
        title: string;
        resourceId: { channelId: string };
      };
    }>;
  }>(
    accessToken,
    `/subscriptions?part=snippet&mine=true&maxResults=${maxResults}`
  );

  return data.items.map((item) => ({
    id: item.snippet.resourceId.channelId,
    name: item.snippet.title,
    url: `https://www.youtube.com/channel/${item.snippet.resourceId.channelId}`,
  }));
}

export async function getLikedVideoChannels(accessToken: string, maxResults = 20) {
  const data = await youtubeFetch<{
    items: Array<{
      snippet: {
        channelId: string;
        channelTitle: string;
      };
    }>;
  }>(
    accessToken,
    `/videos?part=snippet&myRating=like&maxResults=${maxResults}`
  );

  const map = new Map<string, { id: string; name: string; url: string }>();
  for (const item of data.items) {
    const id = item.snippet.channelId;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: item.snippet.channelTitle,
        url: `https://www.youtube.com/channel/${id}`,
      });
    }
  }
  return [...map.values()];
}

export async function searchVideos(
  accessToken: string,
  query: string,
  maxResults = 10
): Promise<VideoItem[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(maxResults),
    videoCategoryId: "10",
  });

  const data = await youtubeFetch<{
    items: Array<{
      id: { videoId: string };
      snippet: {
        title: string;
        channelId: string;
        channelTitle: string;
      };
    }>;
  }>(accessToken, `/search?${params}`);

  const videos: VideoItem[] = [];
  for (const item of data.items) {
    const videoId = item.id?.videoId;
    if (!videoId) continue;
    videos.push({
      id: videoId,
      name: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      channelId: item.snippet.channelId,
      channelName: item.snippet.channelTitle,
    });
  }

  return videos;
}

export async function enrichViewCounts(
  accessToken: string,
  videos: VideoItem[]
): Promise<VideoItem[]> {
  if (videos.length === 0) return videos;

  const ids = videos.map((v) => v.id).join(",");
  const data = await youtubeFetch<{
    items: Array<{ id: string; statistics?: { viewCount?: string } }>;
  }>(accessToken, `/videos?part=statistics&id=${ids}`);

  const counts = new Map<string, number>();
  for (const item of data.items) {
    counts.set(item.id, Number(item.statistics?.viewCount ?? 0));
  }

  return videos.map((v) => ({
    ...v,
    viewCount: counts.get(v.id) ?? v.viewCount,
  }));
}

export async function createPlaylist(
  accessToken: string,
  title: string,
  description: string
) {
  const data = await youtubeFetch<{ id: string; snippet: { title: string } }>(
    accessToken,
    "/playlists?part=snippet,status",
    {
      method: "POST",
      body: JSON.stringify({
        snippet: { title, description },
        status: { privacyStatus: "private" },
      }),
    }
  );

  return {
    id: data.id,
    title: data.snippet.title,
    url: `https://www.youtube.com/playlist?list=${data.id}`,
  };
}

export async function addVideoToPlaylist(
  accessToken: string,
  playlistId: string,
  videoId: string
) {
  await youtubeFetch(accessToken, "/playlistItems?part=snippet", {
    method: "POST",
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    }),
  });
}
