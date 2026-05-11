import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Lofty vs Arrived (2026): Token vs Traditional Rental Comparison | Brickwise",
  description:
    "Lofty vs Arrived: tokenized real estate ($50 minimum, daily USDC payouts) versus traditional fractional rentals ($100 minimum, quarterly distributions). Honest editorial comparison.",
  keywords: [
    "lofty vs arrived",
    "arrived vs lofty",
    "lofty arrived comparison",
    "tokenized vs fractional rental platform",
    "lofty.ai vs arrived.com",
    "fractional real estate platform comparison",
    "best fractional rental platform",
    "single family rental investing platforms",
  ],
  openGraph: {
    title: "Lofty vs Arrived (2026): Which Fractional Rental Platform Wins? | Brickwise",
    description:
      "Tokenized daily-payout (Lofty) vs traditional quarterly fund (Arrived). Minimums, liquidity, distribution frequency, and best-fit investor profiles.",
    type: "article",
    url: "https://brickwise.pro/compare/lofty-vs-arrived",
  },
  alternates: { canonical: "https://brickwise.pro/compare/lofty-vs-arrived" },
};

const loftyProps = PROPERTIES.filter((p) => p.platform === "Lofty");
const loftyAvgYield = loftyProps.length
  ? +(loftyProps.reduce((s, p) => s + p.expectedYield, 0) / loftyProps.length).toFixed(1)
  : 0;
const loftyMaxYield = loftyProps.length
  ? +Math.max(...loftyProps.map((p) => p.expectedYield)).toFixed(1)
  : 0;

const matrix = [
  { row: "Structure", lofty: "Tokenized — direct LLC ownership", arrived: "Fund shares — pooled property fund" },
  { row: "Blockchain", lofty: "Algorand (USDC payouts)", arrived: "None (traditional securities)" },
  { row: "Minimum investment", lofty: "$50", arrived: "$100" },
  { row: "Distributions", lofty: "Daily (USDC)", arrived: "Quarterly (USD)" },
  { row: "Liquidity", lofty: "Same-day via Proactive Market Maker", arrived: "Illiquid — typical 5–7 year hold" },
  { row: "Property type", lofty: "US single-family rentals", arrived: "Single-family + vacation rentals" },
  { row: "Per-property exposure", lofty: "Yes — pick individual properties", arrived: "Yes — pick individual properties" },
  { row: "Self-direction", lofty: "Wallet-based, full control", arrived: "Brokerage-style account" },
  { row: "Regulatory model", lofty: "Reg D / Reg A+ (LLC SPV)", arrived: "Reg A+ (regulated securities)" },
  { row: "Investor eligibility", lofty: "Generally global (verify per offering)", arrived: "US residents (some restrictions)" },
  { row: "Started", lofty: "2021", arrived: "2019" },
];

const loftyPros = [
  "$50 minimum makes diversification across many properties practical",
  "Daily USDC payouts give predictable cashflow without waiting weeks or months",
  "Same-day liquidity through the on-chain Proactive Market Maker",
  "Open globally (subject to per-offering KYC) — usable from outside the US",
  "Token holders are legal LLC members, not just creditors",
];

const loftyCons = [
  "Requires comfort with crypto wallets and USDC",
  "Token prices can move on the secondary market — exit price ≠ fair value",
  "Smaller property catalog than traditional REITs",
  "Tax reporting can be more complex (LLC K-1, sometimes crypto basis)",
];

const arrivedPros = [
  "$100 minimum is still low; reachable for hobbyist investors",
  "No crypto required — works like a normal brokerage account",
  "Backing from notable investors (Bezos Expeditions, Marc Benioff) raises platform credibility",
  "Vacation-rental option diversifies away from pure long-term rentals",
  "Simple US tax handling — straightforward 1099/K-1 forms",
];

const arrivedCons = [
  "Quarterly distributions only — slow cashflow vs token-based platforms",
  "Effectively illiquid for 5–7 years; no easy secondary exit",
  "US residents only — non-US investors can't participate",
  "Higher floor ($100) means fewer positions per dollar than Fundrise's $10",
];

const faqs = [
  {
    q: "Which has higher yields, Lofty or Arrived?",
    a: `Brickwise tracks Lofty live across ${loftyProps.length} properties with an average expected net yield of ${loftyAvgYield}% (highest observed: ${loftyMaxYield}%). Arrived publishes target net yields generally in the 5–8% range for long-term rentals and higher for vacation rentals — but actual realized returns depend on property performance and quarterly distribution timing. Tokenized platforms tend to surface higher headline yields because investors take on more direct property risk.`,
  },
  {
    q: "Is Lofty riskier than Arrived?",
    a: "Different risk profiles. Lofty exposes you to single-property risk, secondary-market price volatility, and platform-as-marketplace risk. Arrived spreads single-property risk via fund structures but locks your capital for years. Both face the same underlying rental real estate risks (vacancy, maintenance, local market shifts).",
  },
  {
    q: "Can I sell my Lofty tokens any time?",
    a: "Practically yes — the Proactive Market Maker gives same-day liquidity at the prevailing on-chain price. The price you receive may be below or above your purchase price depending on market activity. Arrived shares are essentially locked until the fund's exit window.",
  },
  {
    q: "Do I get rental income from Arrived monthly like Lofty?",
    a: "No. Arrived distributes quarterly. If you want monthly or daily rental income, Lofty (daily) or Ark7 (monthly) are better fits. Quarterly distributions on Arrived are designed for buy-and-hold investors who don't need real-time cashflow.",
  },
  {
    q: "Is Arrived available outside the US?",
    a: "No, Arrived currently restricts participation to US residents. Lofty is generally open to non-US investors subject to KYC and per-offering restrictions. Always verify with the platform before signing up.",
  },
  {
    q: "Which platform is more beginner-friendly?",
    a: "Arrived is simpler if you've never used crypto: brokerage-style account, dollar deposits, quarterly statements. Lofty is simpler if you already have a crypto wallet and want daily cashflow with low minimums. Beginners without crypto experience usually start with Arrived; beginners comfortable with USDC wallets often prefer Lofty.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Lofty vs Arrived (2026): Token vs Traditional Rental Comparison",
  "description":
    "Editorial comparison of Lofty (tokenized, daily USDC payouts) and Arrived (traditional fractional rentals, quarterly distributions).",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/lofty-vs-arrived",
  "about": [
    { "@type": "Organization", "name": "Lofty", "url": "https://lofty.ai" },
    { "@type": "Organization", "name": "Arrived", "url": "https://arrived.com" },
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
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Lofty vs Arrived",
      "item": "https://brickwise.pro/compare/lofty-vs-arrived",
    },
  ],
};

export default function LoftyVsArrivedPage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "lofty-vs-arrived" }} />
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
          <span style={{ color: "#111" }}>Lofty vs Arrived</span>
        </div>

        <h1
          className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Lofty vs Arrived (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-3 max-w-[640px]" style={{ color: "#525252" }}>
          Two paths to fractional single-family rental exposure: Lofty's tokenized model with daily
          USDC payouts, and Arrived's traditional fund-style shares with quarterly distributions.
        </p>
        <p className="text-[13px] mb-8" style={{ color: "#a3a3a3" }}>
          Brickwise tracks Lofty live ({loftyProps.length} properties, {loftyAvgYield}% avg yield).
          Arrived figures are based on its public documentation as of 2026.
        </p>

        {/* Comparison matrix */}
        <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #ebebeb" }}>
          <div
            className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.6px]"
            style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", color: "#737373" }}
          >
            <div></div>
            <div>Lofty</div>
            <div>Arrived</div>
          </div>
          {matrix.map((row, i) => (
            <div
              key={row.row}
              className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[12.5px] items-start"
              style={{
                background: i % 2 === 0 ? "#fff" : "#fafafa",
                borderBottom: i < matrix.length - 1 ? "1px solid #f5f5f5" : undefined,
              }}
            >
              <div className="font-semibold" style={{ color: "#737373" }}>
                {row.row}
              </div>
              <div style={{ color: "#111" }}>{row.lofty}</div>
              <div style={{ color: "#111" }}>{row.arrived}</div>
            </div>
          ))}
        </div>

        {/* Pros/cons */}
        <h2
          className="text-[22px] font-bold tracking-[-0.4px] mb-4"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          Pros and cons
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { name: "Lofty", pros: loftyPros, cons: loftyCons },
            { name: "Arrived", pros: arrivedPros, cons: arrivedCons },
          ].map((p) => (
            <div key={p.name} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "#111" }}>
                {p.name}
              </h3>
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#16a34a" }}>
                Pros
              </div>
              <ul className="space-y-1.5 mb-4">
                {p.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-[12.5px]" style={{ color: "#404040" }}>
                    <span style={{ color: "#16a34a", marginTop: 1 }}>✓</span>
                    <span style={{ lineHeight: 1.5 }}>{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#dc2626" }}>
                Cons
              </div>
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
        <h2
          className="text-[22px] font-bold tracking-[-0.4px] mb-3"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          The bottom line
        </h2>
        <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "#404040" }}>
          Lofty wins on cashflow frequency, liquidity, and lower friction for investors comfortable
          with crypto. Arrived wins on simplicity, regulatory familiarity, and not needing a crypto
          wallet. Neither is dominant across the board — they target different investor profiles.
        </p>
        <p className="text-[14px] leading-[1.7] mb-8" style={{ color: "#404040" }}>
          If you're optimizing for daily income and willing to use a wallet: Lofty. If you want
          rentals as a hands-off long-term holding without thinking about blockchain: Arrived.
        </p>

        {/* Internal links */}
        <div className="rounded-[12px] p-6 mb-10" style={{ background: "#fafafa", border: "1px solid #ebebeb" }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
            Continue reading
          </h3>
          <div className="space-y-2">
            <Link href="/learn/lofty-review" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → Full Lofty review
            </Link>
            <Link href="/compare/realt-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → RealT vs Lofty (live data)
            </Link>
            <Link href="/compare/best-fractional-real-estate-platforms" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → All fractional real estate platforms compared
            </Link>
            <Link href="/analyzer" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → Analyze every Lofty property
            </Link>
          </div>
        </div>

        {/* Email capture */}
        <div className="mb-10">
          <EmailCaptureWidget source="compare_lofty_vs_arrived" />
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
      </div>
    </PublicShell>
  );
}
