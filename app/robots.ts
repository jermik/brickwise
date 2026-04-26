import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/analyzer", "/property/"],
        disallow: ["/dashboard", "/portfolio", "/watchlist", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: "https://brickwise.pro/sitemap.xml",
  };
}
