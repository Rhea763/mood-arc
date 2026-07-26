export const MOCK_ACCESS_TOKEN = "mock-token";

export function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Mock when explicitly enabled, or when no live API credentials are configured. */
export function isMockMode(): boolean {
  if (process.env.MOODARC_MOCK === "false") return false;
  if (process.env.MOODARC_MOCK === "true") return true;
  return !readEnv("GOOGLE_CLIENT_ID");
}

export function hasGoogleOAuth(): boolean {
  return Boolean(readEnv("GOOGLE_CLIENT_ID") && readEnv("GOOGLE_CLIENT_SECRET"));
}

export function hasAuthSecret(): boolean {
  return Boolean(readEnv("AUTH_SECRET") ?? readEnv("NEXTAUTH_SECRET"));
}

/** Root site URL only — must not include /api/auth/... paths. */
export function getPublicAuthUrl(): string | undefined {
  return readEnv("AUTH_URL") ?? readEnv("NEXTAUTH_URL");
}

export function getAuthSecret(): string {
  return (
    readEnv("AUTH_SECRET") ??
    readEnv("NEXTAUTH_SECRET") ??
    "moodarc-mock-dev-only-secret"
  );
}
