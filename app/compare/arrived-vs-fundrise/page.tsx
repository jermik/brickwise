import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";
import { AffiliateCta } from "@/components/conversion/affiliate-cta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Arrived vs Fundrise (2026): Single-Property vs eREIT Comparison | Brickwise",
  description:
    "Arrived vs Fundrise: pick individual rental properties ($100 minimum) or invest in diversified eREIT pools ($10 minimum). Honest editorial comparison covering minimums, liquidity, and best-fit investors.",
  keywords: [
    "arrived vs fundrise",
    "fundrise vs arrived",
    "arrived homes vs fundrise",
    "arrived.com vs fundrise",
    "single family rental vs ereit",
    "fractional real estate platform comparison",
    "best real estate crowdfunding platform",
    "rental property crowdfunding vs reit",
  ],
  openGraph: {
    title: "Arrived vs Fundrise (2026): Which Real Estate Platform Wins? | Brickwise",
    description:
      "Single-property exposure (Arrived) vs diversified fund shares (Fundrise). Minimums, liquidity, and best-fit investors compared.",
    type: "article",
    url: "https://brickwise.pro/compare/arrived-vs-fundrise",
  },
  alternates: { canonical: "https://brickwise.pro/compare/arrived-vs-fundrise" },
};

const matrix = [
  { row: "Structure", arrived: "Single-property fund (one LLC per property)", fundrise: "Diversified eREIT / eFund pools" },
  { row: "Blockchain", arrived: "None (traditional securities)", fundrise: "None (traditional securities)" },
  { row: "Minimum investment", arrived: "$100", fundrise: "$10" },
  { row: "Distributions", arrived: "Quarterly (USD)", fundrise: "Quarterly (USD)" },
  { row: "Liquidity", arrived: "Illiquid — typical 5–7 year hold", fundrise: "Quarterly redemption windows; early-redemption fee" },
  { row: "Property type", arrived: "Single-family rentals + vacation rentals", fundrise: "Diversified — residential, commercial, industrial" },
  { row: "Per-property exposure", arrived: "Yes — pick exact properties", fundrise: "No — exposure to fund holdings as a basket" },
  { row: "Self-direction", arrived: "Brokerage-style account", fundrise: "Brokerage-style account" },
  { row: "Regulatory model", arrived: "Reg A+ (regulated securities)", fundrise: "Reg A+ (registered eREITs)" },
  { row: "Investor eligibility", arrived: "US residents (some restrictions)", fundrise: "US residents (limited international)" },
  { row: "Started", arrived: "2019", fundrise: "2010" },
  { row: "Notable backers", arrived: "Bezos Expeditions, Marc Benioff", fundrise: "Renaissance Capital, Silverlake Partners" },
];

const arrivedPros = [
  "Pick the exact property you want exposure to — full transparency on each home",
  "Vacation rental option diversifies away from pure long-term rentals",
  "Notable backing (Bezos Expeditions, Marc Benioff) raises platform credibility",
  "Simple US tax handling — straightforward 1099/K-1 forms",
  "Fund-by-fund accounting means clear performance attribution",
];

const arrivedCons = [
  "$100 minimum is 10x Fundrise's $10",
  "Effectively illiquid for 5–7 years; no easy secondary exit",
  "Quarterly distributions only — slow cashflow",
  "US residents only",
  "Single-property concentration risk if you don't diversify across many funds",
];

const fundrisePros = [
  "$10 minimum — lowest barrier in the category",
  "Diversification by default — fund shares spread across many properties",
  "12+ year operating history — most established platform in this category",
  "Quarterly redemption windows give some early-exit flexibility (with fee)",
  "Simple tax handling (single 1099)",
];

const fundriseCons = [
  "No per-property selection — you can't pick which property to own",
  "Returns reported at the fund level, not transparent per-property",
  "Early redemption fee (1–3%) within five years",
  "Largely US-only; non-US investors face strict limitations",
  "Has had quarters of negative returns historically",
];

const faqs = [
  {
    q: "Which has the lower minimum, Arrived or Fundrise?",
    a: "Fundrise starts at $10. Arrived starts at $100. If lowest barrier to entry matters most, Fundrise wins. If $100 is no obstacle and you want per-property control, Arrived gives you that picking power Fundrise doesn't.",
  },
  {
    q: "Can I sell my position if I need cash?",
    a: "Fundrise has quarterly redemption windows — you can request to exit, but with an early-redemption fee (1–3%) if within five years, and redemptions can be paused if too many investors request at once. Arrived is essentially illiquid for the typical 5–7 year hold; there's no easy way out before the fund's exit window.",
  },
  {
    q: "Which has historically had higher returns?",
    a: "It depends on the period and on which Arrived properties or Fundrise funds you compare. Fundrise has reported annualized returns generally in the 5–10% range across its eREITs. Arrived's individual property returns vary materially — vacation rentals often target higher gross yields than long-term rentals. Past performance does not guarantee future results, and both platforms have had negative-return quarters.",
  },
  {
    q: "Are Arrived and Fundrise similar in regulation?",
    a: "Yes — both operate under SEC Reg A+ (Tier 2) qualified offerings. Investors are share/unit holders in regulated entities. Neither is a blockchain-based platform; both use traditional brokerage-style account structures.",
  },
  {
    q: "Should I use both Arrived and Fundrise?",
    a: "Many investors do. Fundrise gives you the diversified base (low minimum, broad real estate exposure, easier liquidity). Arrived gives you concentrated exposure to specific homes you want to own a piece of. They cover different jobs and aren't strictly substitutes.",
  },
  {
    q: "Which is better for passive income?",
    a: "Both pay quarterly. If you want monthly or weekly cashflow, neither is ideal — look at Ark7 (monthly) or Lofty (daily) instead. For straight quarterly real estate income with the lowest barrier, Fundrise. For quarterly income tied to specific properties you handpick, Arrived.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Arrived vs Fundrise (2026): Single-Property vs eREIT Comparison",
  "description":
    "Editorial comparison of Arrived (single-family rental funds, $100 minimum) and Fundrise (diversified eREITs, $10 minimum) — minimums, liquidity, structure, and best-fit investors.",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/arrived-vs-fundrise",
  "about": [
    { "@type": "Organization", "name": "Arrived", "url": "https://arrived.com" },
    { "@type": "Organization", "name": "Fundrise", "url": "https://fundrise.com" },
  ],
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
    { "@type": "ListItem", "position": 3, "name": "Arrived vs Fundrise", "item": "https://brickwise.pro/compare/arrived-vs-fundrise" },
  ],
};

export default function ArrivedVsFundrisePage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "arrived-vs-fundrise" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-10 max-w-[920px] mx-auto">
        <div className="flex items-center gap-2 mb-5 text-[12px]" style={{ color: "#a3a3a3" }}>
          <Link href="/" className="no-underline transition-opacity hover:opacity-70" style={{ color: "#a3a3a3" }}>Home</Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#737373" }}>Compare</span>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>Arrived vs Fundrise</span>
        </div>

        <h1 className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
          Arrived vs Fundrise (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-3 max-w-[640px]" style={{ color: "#525252" }}>
          Two REIT-style fractional real estate platforms with very different angles. Arrived lets you pick individual rental homes and vacation properties. Fundrise sells diversified fund shares (eREITs) at the lowest minimum on the market.
        </p>
        <p className="text-[13px] mb-8" style={{ color: "#a3a3a3" }}>
          This is editorial research based on each platform's public documentation as of 2026. Brickwise tracks Lofty and RealT live in the analyzer; Arrived and Fundrise are not currently in the dataset.
        </p>

        {/* Comparison matrix */}
        <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #ebebeb" }}>
          <div className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.6px]" style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", color: "#737373" }}>
            <div></div>
            <div>Arrived</div>
            <div>Fundrise</div>
          </div>
          {matrix.map((row, i) => (
            <div key={row.row} className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[12.5px] items-start" style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < matrix.length - 1 ? "1px solid #f5f5f5" : undefined }}>
              <div className="font-semibold" style={{ color: "#737373" }}>{row.row}</div>
              <div style={{ color: "#111" }}>{row.arrived}</div>
              <div style={{ color: "#111" }}>{row.fundrise}</div>
            </div>
          ))}
        </div>

        {/* Pros/cons */}
        <h2 className="text-[22px] font-bold tracking-[-0.4px] mb-4" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Pros and cons</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { name: "Arrived", pros: arrivedPros, cons: arrivedCons },
            { name: "Fundrise", pros: fundrisePros, cons: fundriseCons },
          ].map((p) => (
            <div key={p.name} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "#111" }}>{p.name}</h3>
              <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#16a34a" }}>Pros</div>
              <ul className="space-y-1.5 mb-4">
                {p.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-[12.5px]" style={{ color: "#404040" }}>
                    <span style={{ color: "#16a34a", marginTop: 1 }}>✓</span>
                    <span style={{ lineHeight: 1.5 }}>{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#dc2626" }}>Cons</div>
              <ul className="space-y-1.5">
                {p.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-[12.5px]" style={{ color: "#404040" }}>
                    <span style={{ color: "#dc2626", marginTop: 1 }}>−</span>
                    <span style={{ lineHeight: 1.5 }}>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <h2 className="text-[22px] font-bold tracking-[-0.4px] mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>The bottom line</h2>
        <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "#404040" }}>
          Fundrise wins on accessibility — $10 minimum, diversification by default, longest track record. Arrived wins on selectivity — pick the home you want exposure to, including vacation rentals. Neither is dominant; they target different investor goals within the same broad category.
        </p>
        <p className="text-[14px] leading-[1.7] mb-8" style={{ color: "#404040" }}>
          For first-dollar real estate exposure with minimum friction: Fundrise. For curated single-property bets where you care which home you own a slice of: Arrived. Many investors hold both.
        </p>

        {/* Affiliate-ready CTA slots */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <AffiliateCta platform="Arrived" label="Visit Arrived →" />
          <AffiliateCta platform="Fundrise" label="Visit Fundrise →" variant="secondary" />
        </div>

        {/* Internal links */}
        <div className="rounded-[12px] p-6 mb-10" style={{ background: "#fafafa", border: "1px solid #ebebeb" }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Continue reading</h3>
          <div className="space-y-2">
            <Link href="/compare/best-fractional-real-estate-platforms" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ All fractional real estate platforms compared</Link>
            <Link href="/compare/lofty-vs-arrived" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Lofty vs Arrived</Link>
            <Link href="/compare/realt-vs-fundrise" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ RealT vs Fundrise</Link>
            <Link href="/compare/realt-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ RealT vs Lofty (live data)</Link>
          </div>
        </div>

        {/* Email capture */}
        <div className="mb-10">
          <EmailCaptureWidget source="compare_arrived_vs_fundrise" />
        </div>

        {/* FAQ */}
        <h2 className="text-[22px] font-bold tracking-[-0.4px] mb-4" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Frequently asked questions</h2>
        <div className="space-y-3 mb-10">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[14px] font-semibold mb-2" style={{ color: "#111" }}>{f.q}</h3>
              <p className="text-[13px] leading-[1.6]" style={{ color: "#525252" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
