import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "RealT vs Fundrise (2026): Tokenized Properties vs eREIT Pools | Brickwise",
  description:
    "RealT vs Fundrise: tokenized direct ownership of single properties versus diversified eREIT fund shares. Editorial comparison of structure, minimums, liquidity, and best-fit investors.",
  keywords: [
    "realt vs fundrise",
    "fundrise vs realt",
    "tokenized real estate vs reit",
    "realt review",
    "fundrise review",
    "ereit vs tokenized real estate",
    "fundrise vs tokenized property",
    "best real estate investing platform 2026",
  ],
  openGraph: {
    title: "RealT vs Fundrise (2026): Token vs eREIT Comparison | Brickwise",
    description:
      "Direct tokenized property ownership (RealT) vs diversified fund shares (Fundrise). Structure, liquidity, distributions, and who each wins for.",
    type: "article",
    url: "https://brickwise.pro/compare/realt-vs-fundrise",
  },
  alternates: { canonical: "https://brickwise.pro/compare/realt-vs-fundrise" },
};

const realtProps = PROPERTIES.filter((p) => p.platform === "RealT");
const realtAvgYield = realtProps.length
  ? +(realtProps.reduce((s, p) => s + p.expectedYield, 0) / realtProps.length).toFixed(1)
  : 0;
const realtMaxYield = realtProps.length
  ? +Math.max(...realtProps.map((p) => p.expectedYield)).toFixed(1)
  : 0;

const matrix = [
  { row: "Structure", realt: "Tokenized — direct LLC ownership per property", fundrise: "Fund shares — diversified eREIT / eFund pools" },
  { row: "Blockchain", realt: "Ethereum + Gnosis Chain (xDai)", fundrise: "None (traditional securities)" },
  { row: "Minimum investment", realt: "$50–100", fundrise: "$10" },
  { row: "Distributions", realt: "Weekly (USDC)", fundrise: "Quarterly (USD)" },
  { row: "Liquidity", realt: "RealT marketplace + Uniswap secondary", fundrise: "Quarterly redemption windows; early-redemption fee" },
  { row: "Property type", realt: "US single-family rentals", fundrise: "Diversified — residential + commercial + industrial pools" },
  { row: "Per-property exposure", realt: "Yes — pick exact properties", fundrise: "No — exposure to fund holdings as a basket" },
  { row: "Self-direction", realt: "Wallet-based on-chain", fundrise: "Brokerage-style account" },
  { row: "Regulatory model", realt: "Reg D / Reg A+ (LLC SPV)", fundrise: "Reg A+ (registered eREITs)" },
  { row: "Investor eligibility", realt: "Generally global (verify per offering)", fundrise: "US residents (with limited international)" },
  { row: "Started", realt: "2019", fundrise: "2010" },
];

const realtPros = [
  "Direct ownership — token holders are LLC members in a specific property",
  "Weekly USDC payouts give faster cashflow than quarterly REIT distributions",
  "DeFi-friendly: tokens tradeable on Uniswap secondary market",
  "Globally accessible — non-US investors can usually participate",
  "Per-property transparency: see the exact address, photos, and operating numbers",
];

const realtCons = [
  "Single-property risk — if one property underperforms, it directly hits your tokens",
  "Requires crypto wallet, USDC, and comfort with Ethereum/Gnosis Chain",
  "Secondary-market price can drift from fair value",
  "More complex tax handling than a traditional fund",
];

const fundrisePros = [
  "$10 minimum is the lowest of any major platform",
  "Diversification by default — fund shares spread across many properties",
  "12+ year operating history (started 2010) — most established platform in this category",
  "No crypto required — works like a normal brokerage account",
  "Tax handling is straightforward (single 1099)",
];

const fundriseCons = [
  "Quarterly distributions only — slow cashflow vs weekly RealT or daily Lofty",
  "Limited liquidity: redemption windows are quarterly with fees if you exit early",
  "No per-property selection — you can't choose which property you want exposure to",
  "Largely US-only; non-US investors face strict limitations",
  "Returns reported at the fund level, not transparent per-property",
];

const faqs = [
  {
    q: "Is RealT or Fundrise better for beginners?",
    a: "Fundrise is friendlier for true beginners: $10 minimum, no crypto, no per-property analysis required. RealT is better if you already understand crypto wallets and want direct exposure to specific properties. Beginners without crypto experience usually start with Fundrise.",
  },
  {
    q: "Which has higher yields?",
    a: `Brickwise tracks RealT live across ${realtProps.length} properties with an average expected net yield of ${realtAvgYield}% (highest observed: ${realtMaxYield}%). Fundrise reports historical net annual returns generally in the 5–10% range across its eREITs, though performance varies materially by fund. Tokenized single-property platforms tend to surface higher headline yields because investors take on direct property risk; diversified funds smooth this out.`,
  },
  {
    q: "Can I lose money with either platform?",
    a: "Yes, with both. RealT exposes you to single-property risks (vacancy, maintenance, local market shifts) plus secondary-market price volatility. Fundrise exposes you to fund-level performance, redemption timing, and broader real estate cycles. Neither is a guaranteed return, and Fundrise has had quarters of negative returns historically.",
  },
  {
    q: "Is Fundrise more secure than RealT?",
    a: "They're regulated differently but both are legitimate. Fundrise's eREITs are SEC-registered. RealT operates under SEC exemptions (Reg D, Reg A+) with each property held in a US LLC. The custody models differ: Fundrise holds shares for you in a brokerage-style account, RealT issues tokens to your own crypto wallet (you self-custody).",
  },
  {
    q: "Can I get my money out quickly with either?",
    a: "RealT is faster — you can sell tokens on RealT's marketplace or Uniswap, often same-day at varying prices. Fundrise has quarterly redemption windows; if you exit within five years, you pay a 1–3% early-redemption fee and your request can be limited or paused if too many investors redeem at once.",
  },
  {
    q: "Do I need a crypto wallet for RealT but not Fundrise?",
    a: "Yes. RealT requires a crypto wallet to hold tokens (typically MetaMask) and you receive USDC distributions. Fundrise is brokerage-style — you connect a bank account, deposit dollars, and receive distributions in dollars. No crypto knowledge needed for Fundrise.",
  },
  {
    q: "Is RealT available outside the US?",
    a: "Generally yes, RealT accepts non-US investors subject to KYC and per-offering eligibility. Fundrise is largely US-only with limited international access. Always verify with each platform before signing up.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "RealT vs Fundrise (2026): Tokenized Properties vs eREIT Pools",
  "description":
    "Editorial comparison of RealT (tokenized direct property ownership, weekly USDC) and Fundrise (diversified eREIT shares, quarterly distributions).",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/realt-vs-fundrise",
  "about": [
    { "@type": "Organization", "name": "RealT", "url": "https://realt.co" },
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
    {
      "@type": "ListItem",
      "position": 3,
      "name": "RealT vs Fundrise",
      "item": "https://brickwise.pro/compare/realt-vs-fundrise",
    },
  ],
};

export default function RealtVsFundrisePage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "realt-vs-fundrise" }} />
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
          <span style={{ color: "#111" }}>RealT vs Fundrise</span>
        </div>

        <h1
          className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3"
          style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
        >
          RealT vs Fundrise (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-3 max-w-[640px]" style={{ color: "#525252" }}>
          Two opposite approaches to fractional real estate. RealT issues blockchain tokens for direct
          ownership in individual properties. Fundrise sells diversified fund shares (eREITs) that
          hold many properties at once. Both are legitimate; they target very different investors.
        </p>
        <p className="text-[13px] mb-8" style={{ color: "#a3a3a3" }}>
          Brickwise tracks RealT live ({realtProps.length} properties, {realtAvgYield}% avg yield).
          Fundrise figures are based on its public reporting as of 2026.
        </p>

        {/* Comparison matrix */}
        <div className="rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #ebebeb" }}>
          <div
            className="grid grid-cols-[180px_1fr_1fr] gap-0 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.6px]"
            style={{ background: "#fafafa", borderBottom: "1px solid #ebebeb", color: "#737373" }}
          >
            <div></div>
            <div>RealT</div>
            <div>Fundrise</div>
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
              <div style={{ color: "#111" }}>{row.realt}</div>
              <div style={{ color: "#111" }}>{row.fundrise}</div>
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
            { name: "RealT", pros: realtPros, cons: realtCons },
            { name: "Fundrise", pros: fundrisePros, cons: fundriseCons },
          ].map((p) => (
            <div key={p.name} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[15px] font-bold mb-3" style={{ color: "#111" }}>
                {p.name}
              </h3>
              <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#16a34a" }}>
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
              <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-2" style={{ color: "#dc2626" }}>
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
          RealT is for investors who want hand-picked, single-property exposure with weekly cashflow
          and are comfortable with crypto wallets and DeFi. Fundrise is for investors who want
          institutional diversification, the lowest minimum, and zero crypto learning curve.
        </p>
        <p className="text-[14px] leading-[1.7] mb-8" style={{ color: "#404040" }}>
          The two aren't strictly competing — many investors use Fundrise for the diversified base
          and RealT for selective higher-yield bets. They cover different jobs.
        </p>

        {/* Internal links */}
        <div className="rounded-[12px] p-6 mb-10" style={{ background: "#fafafa", border: "1px solid #ebebeb" }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
            Continue reading
          </h3>
          <div className="space-y-2">
            <Link href="/learn/realt-review" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → Full RealT review
            </Link>
            <Link href="/compare/realt-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → RealT vs Lofty (live data)
            </Link>
            <Link href="/compare/best-fractional-real-estate-platforms" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → All fractional real estate platforms compared
            </Link>
            <Link href="/analyzer" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>
              → Analyze every RealT property
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
      </div>
    </PublicShell>
  );
}
