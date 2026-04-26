import { MetadataRoute } from "next";
import { PROPERTIES } from "@/lib/data/properties";

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

  return [...staticRoutes, ...propertyRoutes];
}
