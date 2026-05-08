import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { FireEvent } from "@/components/analytics/page-view-tracker";

export const revalidate = 86400; // editorial comparison — refresh daily

export const metadata: Metadata = {
  title: "Best Fractional Real Estate Platforms (2026): Honest Comparison | Brickwise",
  description:
    "Independent editorial comparison of the leading fractional real estate platforms — Lofty, RealT, Fundrise, Arrived, and Ark7. Minimums, liquidity, distribution frequency, and who each is best for.",
  keywords: [
    "best fractional real estate platforms",
    "best tokenized real estate platforms",
    "lofty vs realt vs fundrise",
    "fractional real estate investing 2026",
    "real estate crowdfunding comparison",
    "passive real estate income platforms",
    "fundrise vs arrived vs lofty",
    "tokenized real estate vs reit",
    "fractional property platforms ranking",
  ],
  openGraph: {
    title: "Best Fractional Real Estate Platforms 2026 — Side-by-Side | Brickwise",
    description:
      "Lofty, RealT, Fundrise, Arrived, and Ark7 compared. Minimums, liquidity, structure, and who each platform is best for.",
    type: "article",
    url: "https://brickwise.pro/compare/best-fractional-real-estate-platforms",
  },
  alternates: { canonical: "https://brickwise.pro/compare/best-fractional-real-estate-platforms" },
};

interface PlatformRow {
  name: string;
  type: "Tokenized" | "REIT-style" | "Hybrid (Securities)";
  minimum: string;
  distributions: string;
  liquidity: string;
  geo: string;
  bestFor: string;
  link?: string;
}

const platforms: PlatformRow[] = [
  {
    name: "Lofty",
    type: "Tokenized",
    minimum: "$50",
    distributions: "Daily (USDC)",
    liquidity: "Same-day via Proactive Market Maker",
    geo: "US single-family",
    bestFor: "Daily-income investors, low minimums, blockchain-native users",
    link: "/platform/lofty",
  },
  {
    name: "RealT",
    type: "Tokenized",
    minimum: "$50–100",
    distributions: "Weekly (USDC)",
    liquidity: "RealT marketplace + Uniswap secondary",
    geo: "US single-family",
    bestFor: "DeFi-comfortable investors, weekly cashflow, Ethereum/Gnosis users",
    link: "/platform/realt",
  },
  {
    name: "Fundrise",
    type: "REIT-style",
    minimum: "$10",
    distributions: "Quarterly",
    liquidity: "Limited — quarterly redemptions, fees apply early",
    geo: "US diversified (eREITs, eFunds)",
    bestFor: "Hands-off long-horizon investors, lowest minimum, regulated familiarity",
  },
  {
    name: "Arrived",
    type: "REIT-style",
    minimum: "$100",
    distributions: "Quarterly",
    liquidity: "Illiquid — typical 5–7 year hold",
    geo: "US single-family + vacation rentals",
    bestFor: "Long-hold rental investors, single-property exposure, hands-off model",
  },
  {
    name: "Ark7",
    type: "Hybrid (Securities)",
    minimum: "$20",
    distributions: "Monthly",
    liquidity: "Secondary market for resale (Reg A+)",
    geo: "US single-family",
    bestFor: "Monthly cashflow, low minimum, regulated single-property exposure",
  },
];

const faqs = [
  {
    q: "What's the difference between tokenized and REIT-style fractional real estate?",
    a: "Tokenized platforms (Lofty, RealT) issue blockchain tokens that represent direct ownership in a single LLC holding one property. REIT-style platforms (Fundrise, Arrived) issue shares in funds that hold pools of properties. Tokenized typically gives more granular control and faster distributions; REIT-style gives diversification and simpler tax handling.",
  },
  {
    q: "Which platform has the lowest minimum?",
    a: "Fundrise starts at $10. Ark7 starts at $20. Lofty and RealT typically start around $50. Arrived requires $100. Lower minimums help with portfolio diversification across many properties.",
  },
  {
    q: "Which platform pays out most frequently?",
    a: "Lofty pays daily in USDC. Ark7 pays monthly. RealT pays weekly. Fundrise and Arrived pay quarterly. More frequent distributions are useful for cashflow-focused investors but don't necessarily mean higher total returns.",
  },
  {
    q: "Are tokenized real estate platforms regulated?",
    a: "Yes. Lofty and RealT both operate using US LLC SPVs and securities exemptions (Reg D, Reg A+). Tokens are backed by legal LLC membership interests, not just blockchain entries. Investor accreditation requirements vary by platform and offering. Always verify the specific regulatory framework on each platform.",
  },
  {
    q: "Which platform offers the best liquidity?",
    a: "Lofty's Proactive Market Maker and RealT's combination of internal marketplace plus Uniswap give the fastest exit options — usually same-day at varying prices. Ark7 has a secondary market. Fundrise and Arrived are essentially long-hold (years) with limited early redemption.",
  },
  {
    q: "Can I invest in fractional real estate from outside the US?",
    a: "It depends. Lofty and RealT generally accept non-US investors. Fundrise, Arrived, and Ark7 are typically US-only or have stricter accreditation requirements for non-US users. Always check each platform's eligibility rules before signing up.",
  },
  {
    q: "Which platform should a beginner start with?",
    a: "If you want simplicity and the lowest minimum, Fundrise. If you want blockchain-native daily income at a low minimum, Lofty. If you want monthly cashflow without learning DeFi, Ark7. Beginners are usually better served by platforms that don't require crypto wallets.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Fractional Real Estate Platforms (2026): Honest Comparison",
  "description":
    "Editorial comparison of Lofty, RealT, Fundrise, Arrived, and Ark7 — covering minimums, liquidity, structure, and who each platform is best for.",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/best-fractional-real-estate-platforms",
  "about": platforms.map((p) => ({ "@type": "Organization", "name": p.name })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
    { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://brickwise.pro/compare" },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Best Fractional Real Estate Platforms",
      "item": "https://brickwise.pro/compare/best-fractional-real-estate-platforms",
    },
  ],
};

export default function BestFractionalPlatformsPage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "best-fractional-real-estate-platforms" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-10 max-w-[920px] mx-auto">
        <div className="flex items-center gap-2 mb-5 text-[12px]" style={{ color: "#a3a3a3" }}>
          <Link href="/" className="no-underline transition-opacity hover:opacity-70" style={{ color: "#a3a3a3" }}>
            Home
          </Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#737373" }}>Compare</span>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>Best fractional platforms</span>
        </div>

        <h1
          className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Best fractional real estate platforms (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-7 max-w-[640px]" style={{ color: "#525252" }}>
          An honest, editorial comparison of the five platforms most often considered for fractional
          real estate investing — Lofty, RealT, Fundrise, Arrived, and Ark7. We track Lofty and RealT
          live in our analyzer; Fundrise, Arrived, and Ark7 figures here are based on each platform's
          public documentation as of 2026.
        </p>

        {/* Comparison table */}
        <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #ebebeb" }}>
          <div
            className="grid grid-cols-[120px_120px_90px_140px_1fr] gap-0 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.6px]"
            style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", color: "#737373" }}
          >
            <div>Platform</div>
            <div>Type</div>
            <div>Minimum</div>
            <div>Distributions</div>
            <div>Liquidity</div>
          </div>
          {platforms.map((p, i) => (
            <div
              key={p.name}
              className="grid grid-cols-[120px_120px_90px_140px_1fr] gap-0 px-4 py-3.5 text-[13px] items-center"
              style={{
                background: "#fff",
                borderBottom: i < platforms.length - 1 ? "1px solid #f5f5f5" : undefined,
              }}
            >
              <div className="font-semibold" style={{ color: "#111" }}>
                {p.link ? (
                  <Link href={p.link} className="no-underline transition-opacity hover:opacity-70" style={{ color: "#111" }}>
                    {p.name} →
                  </Link>
                ) : (
                  p.name
                )}
              </div>
              <div style={{ color: "#525252" }}>{p.type}</div>
              <div style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}>{p.minimum}</div>
              <div style={{ color: "#525252" }}>{p.distributions}</div>
              <div style={{ color: "#525252" }}>{p.liquidity}</div>
            </div>
          ))}
        </div>

        {/* Best for */}
        <h2
          className="text-[22px] font-bold tracking-[-0.4px] mb-4"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Who each platform is best for
        </h2>
        <div className="space-y-3 mb-10">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="rounded-[10px] p-5"
              style={{ background: "#fff", border: "1px solid #ebebeb" }}
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="text-[15px] font-semibold" style={{ color: "#111" }}>
                  {p.name}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.6px] px-2 py-0.5 rounded"
                  style={{
                    background: p.type === "Tokenized" ? "#f0fdf4" : "#fafafa",
                    color: p.type === "Tokenized" ? "#16a34a" : "#737373",
                  }}
                >
                  {p.type}
                </span>
              </div>
              <p className="text-[13px] leading-[1.6]" style={{ color: "#525252" }}>
                <strong style={{ color: "#111" }}>Best for:</strong> {p.bestFor}
              </p>
              <p className="text-[12px] leading-[1.5] mt-1" style={{ color: "#a3a3a3" }}>
                Geography: {p.geo}
              </p>
            </div>
          ))}
        </div>

        {/* Tokenized vs REIT-style */}
        <h2
          className="text-[22px] font-bold tracking-[-0.4px] mb-3"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Tokenized vs REIT-style: the core trade-off
        </h2>
        <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "#404040" }}>
          The five platforms split into two camps. Lofty and RealT issue blockchain tokens that
          represent direct ownership in a single LLC holding a specific property. Fundrise and Arrived
          issue shares in funds that hold pools of properties. Ark7 sits in between: regulated
          securities for individual properties, with a secondary market for resale.
        </p>
        <p className="text-[14px] leading-[1.7] mb-8" style={{ color: "#404040" }}>
          Tokenized platforms give you faster distributions, granular control over which property you
          own, and tradeable secondary liquidity. REIT-style platforms give you diversification by
          default, simpler tax handling (no crypto wallet, no per-property accounting), and a more
          familiar regulatory wrapper. Neither is strictly better — they target different investor
          profiles.
        </p>

        {/* Internal links */}
        <div
          className="rounded-[12px] p-6 mb-10"
          style={{ background: "#fafafa", border: "1px solid #ebebeb" }}
        >
          <h3
            className="text-[16px] font-bold mb-3"
            style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
          >
            Deeper, data-backed comparisons
          </h3>
          <div className="space-y-2">
            <Link
              href="/compare/realt-vs-lofty"
              className="block text-[13px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#16a34a" }}
            >
              → RealT vs Lofty (live data on every property)
            </Link>
            <Link
              href="/compare/lofty-vs-arrived"
              className="block text-[13px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#16a34a" }}
            >
              → Lofty vs Arrived (token vs traditional rental fund)
            </Link>
            <Link
              href="/compare/realt-vs-fundrise"
              className="block text-[13px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#16a34a" }}
            >
              → RealT vs Fundrise (single properties vs eREIT pools)
            </Link>
            <Link
              href="/learn/lofty-review"
              className="block text-[13px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#16a34a" }}
            >
              → Lofty review
            </Link>
            <Link
              href="/learn/realt-review"
              className="block text-[13px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#16a34a" }}
            >
              → RealT review
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <h2
          className="text-[22px] font-bold tracking-[-0.4px] mb-4"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Frequently asked questions
        </h2>
        <div className="space-y-3 mb-10">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[14px] font-semibold mb-2" style={{ color: "#111" }}>
                {f.q}
              </h3>
              <p className="text-[13px] leading-[1.6]" style={{ color: "#525252" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-[12px] p-6 text-center"
          style={{ background: "linear-gradient(135deg, #f0fdf4, #fafafa)", border: "1px solid #d1fae5" }}
        >
          <h3
            className="text-[18px] font-bold mb-2"
            style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
          >
            Score every tokenized property on Lofty and RealT
          </h3>
          <p className="text-[13px] mb-4" style={{ color: "#525252" }}>
            Brickwise tracks live data on individual property tokens — yield, occupancy, fair value.
          </p>
          <Link
            href="/analyzer"
            className="inline-block px-6 py-2.5 rounded-[8px] text-[13px] font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "#111", color: "#fff" }}
          >
            Open the analyzer →
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
