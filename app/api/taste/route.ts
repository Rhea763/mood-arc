import { NextResponse } from "next/server";
import { auth, requireAccessToken } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { getMockTaste } from "@/lib/mock-data";
import {
  getMyChannel,
  getSubscriptions,
  getLikedVideoChannels,
  YouTubeApiError,
} from "@/lib/youtube";
import type { TasteChannel, TasteResponse } from "@/types/music";

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json(getMockTaste());
  }

  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const session = await auth();

  try {
    const channel = await getMyChannel(accessToken);
    const subscribed = await getSubscriptions(accessToken, 25);
    const likedChannels = await getLikedVideoChannels(accessToken, 20);

    const map = new Map<string, TasteChannel>();

    for (const ch of subscribed) {
      map.set(ch.id, {
        id: ch.id,
        name: ch.name,
        url: ch.url,
        source: "subscribed",
      });
    }

    for (const ch of likedChannels) {
      const existing = map.get(ch.id);
      if (existing) {
        existing.source = "both";
      } else {
        map.set(ch.id, {
          id: ch.id,
          name: ch.name,
          url: ch.url,
          source: "liked",
        });
      }
    }

    const ordered: TasteChannel[] = [];
    const seen = new Set<string>();

    for (const ch of subscribed) {
      const item = map.get(ch.id);
      if (item && !seen.has(ch.id)) {
        ordered.push(item);
        seen.add(ch.id);
      }
    }

    for (const ch of likedChannels) {
      if (!seen.has(ch.id)) {
        const item = map.get(ch.id);
        if (item) {
          ordered.push(item);
          seen.add(ch.id);
        }
      }
    }

    const response: TasteResponse = {
      user: {
        id: channel.id,
        name: session?.user?.name ?? channel.name,
      },
      channels: ordered.slice(0, 15),
    };

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof YouTubeApiError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "登录已过期，请重新登录" },
          { status: 401 }
        );
      }
      if (err.status === 403) {
        return NextResponse.json(
          {
            error:
              "YouTube API 403：请在 Google Cloud 启用 YouTube Data API v3，并把账号加入 OAuth 测试用户",
          },
          { status: 403 }
        );
      }
    }
    console.error("taste error:", err);
    return NextResponse.json(
      { error: "获取口味数据失败，请稍后重试" },
      { status: 500 }
    );
  }
}
