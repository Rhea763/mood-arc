import { readEnv } from "@/lib/config";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/** Refresh ~1 minute before Google access_token expiry. */
const EXPIRY_BUFFER_MS = 60_000;

export function accessTokenStillValid(expiresAtMs?: number): boolean {
  if (!expiresAtMs) return false;
  return Date.now() < expiresAtMs - EXPIRY_BUFFER_MS;
}

export function expiresAtFromExpiresIn(expiresInSeconds?: number): number | undefined {
  if (!expiresInSeconds || expiresInSeconds <= 0) return undefined;
  return Date.now() + expiresInSeconds * 1000;
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  accessTokenExpires: number;
  refreshToken?: string;
}> {
  const clientId = readEnv("GOOGLE_CLIENT_ID");
  const clientSecret = readEnv("GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth client credentials missing");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    const detail = data.error_description ?? data.error ?? res.statusText;
    throw new Error(`Google token refresh failed: ${detail}`);
  }

  const accessTokenExpires =
    expiresAtFromExpiresIn(data.expires_in) ?? Date.now() + 3_500_000;

  return {
    accessToken: data.access_token,
    accessTokenExpires,
    refreshToken: data.refresh_token,
  };
}
