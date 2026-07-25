export const MOCK_ACCESS_TOKEN = "mock-token";

/** Mock when explicitly enabled, or when no live API credentials are configured. */
export function isMockMode(): boolean {
  if (process.env.MOODARC_MOCK === "false") return false;
  if (process.env.MOODARC_MOCK === "true") return true;
  return !process.env.GOOGLE_CLIENT_ID?.trim();
}

export function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "moodarc-mock-dev-only-secret"
  );
}
