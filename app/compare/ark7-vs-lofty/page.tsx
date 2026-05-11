import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";
import { AffiliateCta } from "@/components/conversion/affiliate-cta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Ark7 vs Lofty (2026): Regulated Securities vs Tokenized Real Estate | Brickwise",
  description:
    "Ark7 vs Lofty: monthly cashflow regulated securities ($20 min) versus daily USDC payouts on blockchain tokens ($50 min). Honest comparison of structure, liquidity, and best-fit investors.",
  keywords: [
    "ark7 vs lofty",
    "lofty vs ark7",
    "ark7 vs lofty.ai",
    "tokenized real estate vs single family rental",
    "best fractional rental platform",
    "monthly distribution real estate platform",
    "blockchain real estate vs reg a+",
    "fractional rental investing comparison",
  ],
  openGraph: {
    title: "Ark7 vs Lofty (2026): Regulated Securities vs Tokens | Brickwise",
    description:
      "Ark7's monthly distributions and regulated single-property shares vs Lofty's daily USDC payouts and blockchain tokens. Side-by-side editorial comparison.",
    type: "article",
    url: "https://brickwise.pro/compare/ark7-vs-lofty",
  },
  alternates: { canonical: "https://brickwise.pro/compare/ark7-vs-lofty" },
};

const loftyProps = PROPERTIES.filter((p) => p.platform === "Lofty");
const loftyAvgYield = loftyProps.length
  ? +(loftyProps.reduce((s, p) => s + p.expectedYield, 0) / loftyProps.length).toFixed(1)
  : 0;
const loftyMaxYield = loftyProps.length
  ? +Math.max(...loftyProps.map((p) => p.expectedYield)).toFixed(1)
  : 0;

const matrix = [
  { row: "Structure", ark7: "Regulated Reg A+ securities (single-property funds)", lofty: "Tokenized — direct LLC ownership per property" },
  { row: "Blockchain", ark7: "None (traditional securities)", lofty: "Algorand (USDC payouts)" },
  { row: "Minimum investment", ark7: "$20", lofty: "$50" },
  { row: "Distributions", ark7: "Monthly (USD)", lofty: "Daily (USDC)" },
  { row: "Liquidity", ark7: "Secondary market for resale (Reg A+)", lofty: "Same-day via Proactive Market Maker (on-chain)" },
  { row: "Property type", ark7: "US single-family rentals", lofty: "US single-family rentals" },
  { row: "Per-property exposure", ark7: "Yes — pick exact properties", lofty: "Yes — pick exact properties" },
  { row: "Self-direction", ark7: "Brokerage-style account", lofty: "Wallet-based, full control" },
  { row: "Regulatory model", ark7: "Reg A+ (US-registered securities)", lofty: "Reg D / Reg A+ (LLC SPV)" },
  { row: "Investor eligibility", ark7: "US residents (KYC required)", lofty: "Generally global (verify per offering)" },
  { row: "Started", ark7: "2019", lofty: "2021" },
];

const ark7Pros = [
  "$20 minimum is one of the lowest for single-property exposure",
  "Monthly distributions — faster than quarterly REITs, simpler than daily USDC",
  "Reg A+ regulated securities — familiar legal framework, no crypto required",
  "Has a secondary market for early exits without waiting years",
  "Brokerage-style account avoids any DeFi learning curve",
];

const ark7Cons = [
  "US residents only — non-US investors can't participate",
  "Secondary market liquidity depends on other Ark7 users wanting to buy your share",
  "No blockchain self-custody — Ark7 holds your shares on your behalf",
  "Smaller catalog than Lofty or RealT",
  "Distribution lag of a few weeks vs Lofty's instant payouts",
];

const loftyPros = [
  `Daily USDC distributions — fastest cashflow in the category`,
  `Same-day liquidity through the on-chain Proactive Market Maker`,
  `Open globally (subject to per-offering KYC) — usable from outside the US`,
  `Token holders are legal LLC members; tokens are tradeable on-chain`,
  `${loftyProps.length} properties tracked live in Brickwise's analyzer with avg ${loftyAvgYield}% yield (max ${loftyMaxYield}%)`,
];

const loftyCons = [
  "Requires comfort with crypto wallets and USDC",
  "Token prices can move on the secondary market — exit price may differ from fair value",
  "$50 minimum is 2.5x Ark7's $20",
  "Tax reporting can be more complex (LLC K-1, sometimes crypto basis)",
];

const faqs = [
  {
    q: "Which has lower minimums, Ark7 or Lofty?",
    a: "Ark7 starts at $20. Lofty starts at $50. If absolute minimum is the deciding factor, Ark7 wins. If you can comfortably commit $50, Lofty's daily distributions and same-day liquidity may be worth more than the $30 difference.",
  },
  {
    q: "Which pays out more frequently?",
    a: "Lofty pays daily in USDC stablecoin. Ark7 pays monthly in USD. Both are faster than Fundrise/Arrived (quarterly). Pick by what your cashflow planning needs: daily compounding vs monthly statement-style income.",
  },
  {
    q: "Is Ark7 safer than Lofty because it's not on a blockchain?",
    a: "Different risk profiles, not strictly safer. Ark7 reduces blockchain-specific risks (smart contract bugs, wallet security, secondary-market price volatility). Lofty reduces custody risk (you self-custody tokens; no platform holds your shares) and gives you USDC stablecoin distributions you can move freely. Both face the same underlying real estate risks (vacancy, maintenance, local market).",
  },
  {
    q: "Can I sell my position on either platform?",
    a: "Lofty's Proactive Market Maker offers same-day liquidity at on-chain prices. Ark7 has a secondary market for resale, but liquidity depends on whether other users want to buy your share at your asking price. Both are more liquid than traditional REIT-style platforms (Fundrise, Arrived) but Lofty is generally faster.",
  },
  {
    q: "Do I need a crypto wallet for Ark7?",
    a: "No. Ark7 works like a brokerage — you connect a bank account, deposit dollars, receive monthly USD distributions. Lofty requires a crypto wallet (typically Algorand-compatible) and you receive USDC stablecoin distributions you control directly.",
  },
  {
    q: "Can I invest from outside the US?",
    a: "Lofty generally accepts non-US investors subject to per-offering KYC. Ark7 currently restricts participation to US residents. Always verify with the platform before signing up.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Ark7 vs Lofty (2026): Regulated Securities vs Tokenized Real Estate",
  "description":
    "Editorial comparison of Ark7 (regulated single-property Reg A+ securities, monthly distributions) and Lofty (tokenized LLC ownership, daily USDC payouts).",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/ark7-vs-lofty",
  "about": [
    { "@type": "Organization", "name": "Ark7", "url": "https://ark7.com" },
    { "@type": "Organization", "name": "Lofty", "url": "https://lofty.ai" },
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
    { "@type": "ListItem", "position": 3, "name": "Ark7 vs Lofty", "item": "https://brickwise.pro/compare/ark7-vs-lofty" },
  ],
};

export default function Ark7VsLoftyPage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "ark7-vs-lofty" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-10 max-w-[920px] mx-auto">
        <div className="flex items-center gap-2 mb-5 text-[12px]" style={{ color: "#a3a3a3" }}>
          <Link href="/" className="no-underline transition-opacity hover:opacity-70" style={{ color: "#a3a3a3" }}>Home</Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#737373" }}>Compare</span>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>Ark7 vs Lofty</span>
        </div>

        <h1 className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
          Ark7 vs Lofty (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-3 max-w-[640px]" style={{ color: "#525252" }}>
          Both platforms let you buy fractional shares of single-family rental properties starting at small dollar amounts. Ark7 uses traditional Reg A+ regulated securities with monthly distributions. Lofty uses blockchain tokens with daily USDC payouts. The same destination — different roads.
        </p>
        <p className="text-[13px] mb-8" style={{ color: "#a3a3a3" }}>
          Brickwise tracks Lofty live ({loftyProps.length} properties, {loftyAvgYield}% avg yield). Ark7 figures here are based on its public documentation as of 2026.
        </p>

        {/* Comparison matrix */}
        <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #ebebeb" }}>
          <div className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.6px]" style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", color: "#737373" }}>
            <div></div>
            <div>Ark7</div>
            <div>Lofty</div>
          </div>
          {matrix.map((row, i) => (
            <div key={row.row} className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[12.5px] items-start" style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < matrix.length - 1 ? "1px solid #f5f5f5" : undefined }}>
              <div className="font-semibold" style={{ color: "#737373" }}>{row.row}</div>
              <div style={{ color: "#111" }}>{row.ark7}</div>
              <div style={{ color: "#111" }}>{row.lofty}</div>
            </div>
          ))}
        </div>

        {/* Pros/cons */}
        <h2 className="text-[22px] font-bold tracking-[-0.4px] mb-4" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Pros and cons</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { name: "Ark7", pros: ark7Pros, cons: ark7Cons },
            { name: "Lofty", pros: loftyPros, cons: loftyCons },
          ].map((p) => (
            <div key={p.name} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "#111" }}>{p.name}</h3>
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#16a34a" }}>Pros</div>
              <ul className="space-y-1.5 mb-4">
                {p.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-[12.5px]" style={{ color: "#404040" }}>
                    <span style={{ color: "#16a34a", marginTop: 1 }}>✓</span>
                    <span style={{ lineHeight: 1.5 }}>{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[12px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#dc2626" }}>Cons</div>
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
          Ark7 is the safer-feeling option for US investors who don't want to learn about crypto wallets — regulated securities, monthly USD distributions, brokerage-style account. Lofty is the better option for investors who want daily cashflow, same-day liquidity, and global access — at the cost of needing to use a crypto wallet.
        </p>
        <p className="text-[14px] leading-[1.7] mb-8" style={{ color: "#404040" }}>
          The headline trade-off: regulatory familiarity (Ark7) vs cashflow speed and global access (Lofty). Both are legitimate single-family rental fractional platforms; you're picking based on what you optimize for.
        </p>

        {/* Affiliate-ready CTA slots */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <AffiliateCta platform="Ark7" label="Visit Ark7 →" />
          <AffiliateCta platform="Lofty" label="Visit Lofty →" variant="secondary" />
        </div>

        {/* Internal links */}
        <div className="rounded-[12px] p-6 mb-10" style={{ background: "#fafafa", border: "1px solid #ebebeb" }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Continue reading</h3>
          <div className="space-y-2">
            <Link href="/learn/lofty-review" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Full Lofty review</Link>
            <Link href="/compare/lofty-vs-arrived" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Lofty vs Arrived</Link>
            <Link href="/compare/realt-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ RealT vs Lofty (live data)</Link>
            <Link href="/compare/best-fractional-real-estate-platforms" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ All fractional real estate platforms compared</Link>
            <Link href="/analyzer" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Analyze every Lofty property</Link>
          </div>
        </div>

        {/* Email capture */}
        <div className="mb-10">
          <EmailCaptureWidget source="compare_ark7_vs_lofty" />
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
