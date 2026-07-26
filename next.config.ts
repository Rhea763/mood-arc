import type { NextConfig } from "next";
import path from "path";

const embedFrameAncestors =
  "frame-ancestors 'self' https://795a2f9aac7d4a539852c493231b2f6b.app.codebuddy.work https://*.app.codebuddy.work https://*.codebuddy.work";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: embedFrameAncestors,
          },
        ],
      },
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: embedFrameAncestors,
          },
        ],
      },
    ];
  },
  // Keep client demo flag aligned with server MOODARC_MOCK on Vercel builds.
  env: {
    NEXT_PUBLIC_MOODARC_MOCK:
      process.env.NEXT_PUBLIC_MOODARC_MOCK ??
      process.env.MOODARC_MOCK ??
      "",
  },
};

export default nextConfig;
