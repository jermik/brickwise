import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.lofty.ai" },
      { protocol: "https", hostname: "**.lofty.ai" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "brickwise",
  project: "brickwise",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
