import type { NextRequest } from "next/server";

const EMBED_HEADER = "x-moodarc-embed";

/** Embed / iframe: demo arc scoring without YouTube login or token refresh. */
export function isEmbedRequest(req: NextRequest): boolean {
  if (req.headers.get(EMBED_HEADER) === "1") return true;
  const referer = req.headers.get("referer") ?? "";
  return (
    referer.includes("codebuddy.work") ||
    referer.includes("/embed") ||
    referer.includes("mood-arc.vercel.app/embed")
  );
}

export const EMBED_FETCH_HEADERS = { "X-MoodArc-Embed": "1" } as const;
