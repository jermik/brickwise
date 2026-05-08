import { MetadataRoute } from "next";

// Single source of truth for robots policy.
// CRM subdomain (crm.brickwise.pro) is blocked separately at the proxy layer
// in proxy.ts — that intercepts crm.*/robots.txt and returns a Disallow: / response.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Authenticated/private app surfaces
          "/dashboard",
          "/portfolio",
          "/watchlist",
          "/settings",
          // Auth flows
          "/sign-in",
          "/sign-up",
          // Internal tools
          "/announce",
          "/seo-dashboard",
          // CRM (also blocked at the host level via proxy.ts)
          "/crm",
          // GrowthOS internal landing
          "/growthos",
          // Server endpoints
          "/api/",
        ],
      },
    ],
    sitemap: "https://brickwise.pro/sitemap.xml",
    host: "https://brickwise.pro",
  };
}
