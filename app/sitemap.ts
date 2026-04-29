import { MetadataRoute } from "next";
import { PROPERTIES } from "@/lib/data/properties";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

interface MarketUpdate {
  date: string;
  slug: string;
}

const MARKET_UPDATES = marketUpdatesRaw as unknown as MarketUpdate[];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://brickwise.pro";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/analyzer`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/watchlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = PROPERTIES.map((p) => ({
    url: `${base}/property/${p.id}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const marketIndexRoute: MetadataRoute.Sitemap =
    MARKET_UPDATES.length > 0
      ? [
          {
            url: `${base}/market`,
            lastModified: new Date(MARKET_UPDATES[0].date),
            changeFrequency: "daily",
            priority: 0.7,
          },
        ]
      : [];

  const marketRoutes: MetadataRoute.Sitemap = MARKET_UPDATES.map((u) => ({
    url: `${base}/market/${u.slug}`,
    lastModified: new Date(u.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...marketIndexRoute, ...marketRoutes];
}
