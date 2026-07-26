import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { getMockTaste } from "@/lib/mock-data";

/** Demo artists for UI; YouTube login only needed when generating playlists. */
export async function GET() {
  if (isMockMode()) {
    return NextResponse.json(getMockTaste());
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const taste = getMockTaste();
  return NextResponse.json({
    ...taste,
    user: {
      id: session.user.id ?? taste.user.id,
      name: session.user.name ?? taste.user.name,
    },
  });
}
