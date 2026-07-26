import { NextResponse } from "next/server";
import {
  getPublicAuthUrl,
  hasAuthSecret,
  hasGoogleOAuth,
  isMockMode,
} from "@/lib/config";

export async function GET() {
  const authUrl = getPublicAuthUrl();
  let authUrlOk = false;
  if (authUrl) {
    try {
      const { pathname } = new URL(authUrl);
      // Must be site root. Paths like /api/auth/callback/google break Auth.js.
      authUrlOk = pathname === "/" || pathname === "";
    } catch {
      authUrlOk = false;
    }
  }

  return NextResponse.json({
    mock: isMockMode(),
    googleConfigured: hasGoogleOAuth(),
    hasAuthSecret: hasAuthSecret(),
    authUrlOk,
    demoArtists: !isMockMode(),
  });
}
