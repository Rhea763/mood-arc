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

function youtubeErrorHint(err: YouTubeApiError): string {
  const body = err.message.toLowerCase();
  if (err.status === 401) return "登录已过期，请退出后重新登录";
  if (
    err.status === 403 &&
    (body.includes("accessnotconfigured") ||
      body.includes("youtube.googleapis.com") ||
      body.includes("has not been used") ||
      body.includes("disabled"))
  ) {
    return "YouTube Data API v3 未启用：请在 Google Cloud 启用该 API，等待 1–2 分钟后退出并重新登录";
  }
  if (err.status === 403 && body.includes("insufficientpermissions")) {
    return "YouTube 权限不足：请退出后重新登录，并同意 YouTube 相关授权";
  }
  if (err.status === 403) {
    return "YouTube API 403：请确认已启用 YouTube Data API v3，账号在测试用户列表中，并重新登录授权";
  }
  if (err.status === 429) {
    return "YouTube API 配额已用尽，请稍后再试";
  }
  return `获取口味数据失败（YouTube ${err.status}）`;
}

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

    let subscribed: Awaited<ReturnType<typeof getSubscriptions>> = [];
    let likedChannels: Awaited<ReturnType<typeof getLikedVideoChannels>> = [];
    let partialError: string | null = null;

    try {
      subscribed = await getSubscriptions(accessToken, 25);
    } catch (err) {
      if (err instanceof YouTubeApiError) {
        // Private / empty subscriptions should not hard-fail the whole page.
        if (err.status !== 403 && err.status !== 404) throw err;
        partialError = youtubeErrorHint(err);
      } else {
        throw err;
      }
    }

    try {
      likedChannels = await getLikedVideoChannels(accessToken, 20);
    } catch (err) {
      if (err instanceof YouTubeApiError) {
        if (err.status !== 403 && err.status !== 404) throw err;
        partialError = partialError ?? youtubeErrorHint(err);
      } else {
        throw err;
      }
    }

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

    if (ordered.length === 0 && partialError) {
      return NextResponse.json({ error: partialError }, { status: 403 });
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
      const status =
        err.status === 401 || err.status === 403 || err.status === 429
          ? err.status
          : 502;
      return NextResponse.json(
        { error: youtubeErrorHint(err) },
        { status }
      );
    }
    console.error("taste error:", err);
    return NextResponse.json(
      { error: "获取口味数据失败，请稍后重试" },
      { status: 500 }
    );
  }
}
