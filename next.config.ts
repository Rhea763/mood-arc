import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingRoot: path.join(__dirname),
  // Keep client demo flag aligned with server MOODARC_MOCK on Vercel builds.
  env: {
    NEXT_PUBLIC_MOODARC_MOCK:
      process.env.NEXT_PUBLIC_MOODARC_MOCK ??
      process.env.MOODARC_MOCK ??
      "",
  },
};

export default nextConfig;
