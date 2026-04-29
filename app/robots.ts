import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/analyzer", "/property/", "/market"],
        disallow: ["/dashboard", "/portfolio", "/watchlist", "/sign-in", "/sign-up", "/announce"],
      },
    ],
    sitemap: "https://brickwise.pro/sitemap.xml",
  };
}
