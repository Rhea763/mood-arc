export const DEMO_KEY = "moodarc_demo";

/** Client build-time flag; synced from MOODARC_MOCK in next.config when unset. */
export function isBuildTimeMockDemo(): boolean {
  return process.env.NEXT_PUBLIC_MOODARC_MOCK === "true";
}

export function isLocalDevHost(hostname?: string): boolean {
  const host =
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return host === "localhost" || host === "127.0.0.1";
}
