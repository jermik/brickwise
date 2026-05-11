import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // ─── Core ────────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ─── Images ──────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],      // serve modern formats first
    minimumCacheTTL: 60 * 60 * 24 * 30,         // 30-day CDN cache for images
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.lofty.ai" },
      { protocol: "https", hostname: "**.lofty.ai" },
    ],
  },

  // ─── Bundle optimization ─────────────────────────────────────────────────
  experimental: {
    // Tree-shakes large icon/animation packages at compile time (reduces JS bundle ~15-30%)
    optimizePackageImports: ["lucide-react", "framer-motion", "@vercel/analytics"],
  },

  // ─── HTTP headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      // Immutable cache for hashed static assets (_next/static)
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // 24-hour cache for public static files
      {
        source: "/:path((?!_next).*\\.(?:ico|png|svg|jpg|jpeg|webp|avif|woff2|woff|ttf)$)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // Security headers on all routes
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' blob: data: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https:",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "brickwise",
  project: "brickwise",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { disable: true },
  disableLogger: true,
  automaticVercelMonitors: true,
});
