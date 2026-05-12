import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import { ArticlesFilter } from "./articles-filter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Learn — Tokenized Real Estate Guides & Reviews | Brickwise" },
  description:
    "Free guides on tokenized real estate — platform reviews, beginner how-tos, and RealT vs Lofty comparisons. Updated with live data.",
  keywords: [
    "tokenized real estate guides",
    "RealT review",
    "Lofty review",
    "how to invest tokenized real estate",
    "real estate token investing guide",
    "fractional real estate beginner",
    "RealT vs Lofty",
    "tokenized real estate education",
  ],
  openGraph: {
    title: "Learn — Tokenized Real Estate Guides & Reviews | Brickwise",
    description:
      "Free guides on tokenized real estate — reviews, how-tos, and comparisons for RealT and Lofty investors.",
    type: "website",
    url: "https://brickwise.pro/learn",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Brickwise tokenized real estate guides" }],
  },
  alternates: { canonical: "https://brickwise.pro/learn" },
};

const count = PROPERTIES.length;
const avgYield =
  Math.round((PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / count) * 10) / 10;

export default function LearnPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://brickwise.pro/learn#webpage",
    "name": "Tokenized Real Estate Guides, Reviews & How-Tos",
    "url": "https://brickwise.pro/learn",
    "description":
      "Free educational guides on tokenized real estate investing — platform reviews, beginner how-tos, and comparisons of RealT and Lofty.",
    "isPartOf": { "@id": "https://brickwise.pro/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
        { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://brickwise.pro/learn" },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": LEARN_ARTICLES.map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://brickwise.pro${a.href}`,
        "name": a.title,
      })),
    },
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[860px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>Learn</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] sm:text-[34px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Tokenized Real Estate Guides
          </h1>
          <p className="text-[14px] leading-[1.7] max-w-[560px]" style={{ color: "rgba(242,237,230,0.55)" }}>
            Free, data-driven guides on investing in tokenized real estate — platform reviews, beginner how-tos, and comparisons based on live data from {count} properties.
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap gap-px rounded-[10px] overflow-hidden mb-8"
          style={{ background: "#2A2420", border: "1px solid #2A2420" }}
        >
          {[
            { label: "Guides published", value: String(LEARN_ARTICLES.length) },
            { label: "Properties tracked", value: String(count) },
            { label: "Platform avg yield", value: `${avgYield}%` },
            { label: "Free to access", value: "All" },
          ].map((s) => (
            <div key={s.label} className="flex-1 min-w-[100px] px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[16px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Category filter + article grid (client island) */}
        <ArticlesFilter articles={LEARN_ARTICLES} />

        {/* CTA */}
        <div
          className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "#131109", border: "1px solid #2A2420" }}
        >
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
              Ready to apply what you learned?
            </div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Use Brickwise to filter and score {count} properties by yield, risk, and buy signal.
            </div>
          </div>
          <Link
            href="/analyzer"
            className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85 flex-shrink-0"
            style={{ background: "#22c55e", color: "#0A0907" }}
          >
            Browse Properties →
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
