import { MetadataRoute } from "next";
import { PROPERTIES } from "@/lib/data/properties";
import { ALGORAND_PROJECTS } from "@/lib/algorand";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

interface MarketUpdate {
  date: string;
  slug: string;
}

const MARKET_UPDATES = marketUpdatesRaw as unknown as MarketUpdate[];

const slugify = (city: string) => city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://brickwise.pro";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/analyzer`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/compare/realt-vs-lofty`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/compare/best-fractional-real-estate-platforms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/compare/lofty-vs-arrived`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/realt-vs-fundrise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/arrived-vs-fundrise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/ark7-vs-lofty`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compare/best-real-estate-investing-apps`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/learn/what-is-tokenized-real-estate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/lofty-review`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/realt-review`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/how-to-invest-in-tokenized-real-estate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/platform/realt`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/platform/lofty`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/algorand`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  ];

  const algorandRoutes: MetadataRoute.Sitemap = ALGORAND_PROJECTS.map((p) => ({
    url: `${base}/algorand/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const uniqueCities = [...new Set(PROPERTIES.map((p) => p.city))];
  const cityRoutes: MetadataRoute.Sitemap = uniqueCities.map((city) => ({
    url: `${base}/city/${slugify(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const rankingRoutes: MetadataRoute.Sitemap = [
    "highest-yield",
    "buy-signals",
    "undervalued",
    "new-listings",
  ].map((cat) => ({
    url: `${base}/rankings/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

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

  return [...staticRoutes, ...rankingRoutes, ...cityRoutes, ...propertyRoutes, ...marketIndexRoute, ...marketRoutes, ...algorandRoutes];
}
