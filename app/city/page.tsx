import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";

export const revalidate = 3600;

const slugify = (city: string) =>
  city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Aggregate every property into one entry per city slug, so name variants
// (e.g. "St. Louis" / "St Louis" / "Saint Louis") collapse to a single market.
function buildCities() {
  const bySlug = new Map<
    string,
    { slug: string; nameCounts: Map<string, number>; props: typeof PROPERTIES }
  >();
  for (const p of PROPERTIES) {
    const slug = slugify(p.city);
    if (!slug) continue;
    let entry = bySlug.get(slug);
    if (!entry) {
      entry = { slug, nameCounts: new Map(), props: [] };
      bySlug.set(slug, entry);
    }
    entry.nameCounts.set(p.city, (entry.nameCounts.get(p.city) ?? 0) + 1);
    entry.props.push(p);
  }
  return [...bySlug.values()]
    .map((e) => {
      // Canonical display name = the most frequently used variant.
      const name = [...e.nameCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const count = e.props.length;
      const avgYield = +(e.props.reduce((s, p) => s + p.expectedYield, 0) / count).toFixed(1);
      const maxYield = +Math.max(...e.props.map((p) => p.expectedYield)).toFixed(1);
      const buyCount = e.props.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
      return { slug: e.slug, name, count, avgYield, maxYield, buyCount };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const CITIES = buildCities();
const TOTAL_PROPS = PROPERTIES.length;

export const metadata: Metadata = {
  title: "Tokenized Real Estate by City | Brickwise",
  description: `Browse tokenized real estate across ${CITIES.length} US markets on Lofty and RealT. ${TOTAL_PROPS} properties scored for yield, risk and fair value. Find the highest-yield cities, ranked.`,
  keywords: [
    "tokenized real estate by city",
    "tokenized real estate cities",
    "best cities tokenized real estate",
    "realt cities",
    "lofty cities",
    "fractional real estate by city",
    "highest yield tokenized real estate city",
    "tokenized rental markets",
  ],
  openGraph: {
    title: "Tokenized Real Estate by City — All Markets Ranked | Brickwise",
    description: `Every tokenized real estate market on Lofty and RealT, ranked. ${CITIES.length} cities, ${TOTAL_PROPS} properties scored for yield and risk.`,
    type: "website",
    url: "https://brickwise.pro/city",
  },
  alternates: { canonical: "https://brickwise.pro/city" },
};

export default function CitiesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Tokenized Real Estate Markets",
    "description": `Tokenized real estate cities tracked by Brickwise across Lofty and RealT — ${CITIES.length} markets, ${TOTAL_PROPS} properties.`,
    "url": "https://brickwise.pro/city",
    "numberOfItems": CITIES.length,
    "itemListElement": CITIES.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${c.name} tokenized real estate`,
      "url": `https://brickwise.pro/city/${c.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://brickwise.pro/city" },
    ],
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="px-6 lg:px-10 py-9 max-w-[1080px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[12px]">
          <Link href="/" className="no-underline transition-opacity hover:opacity-70" style={{ color: "rgba(242,237,230,0.45)" }}>
            Home
          </Link>
          <span style={{ color: "rgba(242,237,230,0.25)" }}>/</span>
          <span style={{ color: "#F2EDE6" }}>Cities</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            Tokenized RE by location
          </div>
          <h1
            className="text-[32px] md:text-[38px] font-normal leading-[1.08] tracking-[-0.5px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Tokenized real estate by city
          </h1>
          <p className="text-[13px] mt-2.5 leading-[1.6] max-w-[640px]" style={{ color: "rgba(242,237,230,0.5)" }}>
            Every market we track on Lofty and RealT, ranked by property count. {CITIES.length} cities,{" "}
            {TOTAL_PROPS} properties scored for yield, risk and fair value. Pick a city to see all of its
            listings ranked by score.
          </p>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/city/${c.slug}`}
              className="no-underline rounded-[10px] px-4 py-3.5 transition-colors group"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className="text-[14px] font-medium truncate"
                    style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
                  >
                    {c.name}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(242,237,230,0.45)" }}>
                    {c.count} {c.count === 1 ? "property" : "properties"}
                    {c.buyCount > 0 && (
                      <>
                        {" · "}
                        <span style={{ color: "#7CA982" }}>{c.buyCount} buy</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div
                    className="text-[13px] font-bold"
                    style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                  >
                    {c.avgYield}%
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
                    avg yield
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-10 pt-6 flex items-center gap-3"
          style={{ borderTop: "1px solid #242018" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4d4d4" }} />
          <p className="text-[12px] leading-[1.6]" style={{ color: "#c4c4c4" }}>
            Cities ranked by tracked property count. Yields are net of fees. Scores computed from yield,
            risk, neighbourhood and fair-value metrics. Not financial advice.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
