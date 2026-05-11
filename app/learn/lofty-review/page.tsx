import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Lofty Review 2026: Yield, Fees, Risks & How It Works | Brickwise",
  description:
    "Honest Lofty review: $50 minimum, daily USDC payouts, Algorand-based tokens. We analyze real yields, fees, liquidity, and who it's best for. Data from 100+ properties.",
  keywords: [
    "lofty review",
    "lofty.ai review",
    "lofty real estate review",
    "lofty tokenized real estate",
    "lofty yield",
    "lofty fees",
    "lofty vs realt",
    "lofty real estate platform",
    "lofty investment review 2026",
    "is lofty legit",
    "lofty proactive market maker",
    "lofty algorand",
  ],
  openGraph: {
    title: "Lofty Review 2026: Real Yields, Fees & Risks Analyzed | Brickwise",
    description:
      "Everything you need to know before investing on Lofty — yields, liquidity, fees, risks, and how it compares to RealT. Data-backed, no fluff.",
    type: "article",
    url: "https://brickwise.pro/learn/lofty-review",
  },
  alternates: { canonical: "https://brickwise.pro/learn/lofty-review" },
};

const loftyProps = PROPERTIES.filter((p) => p.platform?.toLowerCase() === "lofty");
const avgLoftyYield = loftyProps.length
  ? +(loftyProps.reduce((s, p) => s + p.expectedYield, 0) / loftyProps.length).toFixed(1)
  : 9.2;
const maxLoftyYield = loftyProps.length
  ? +Math.max(...loftyProps.map((p) => p.expectedYield)).toFixed(1)
  : 16.4;
const loftyBuyCount = loftyProps.filter((p) => p.overallScore >= 75).length;

export default function LoftyReviewPage() {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": "Lofty",
      "applicationCategory": "FinanceApplication",
      "url": "https://lofty.ai",
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.2",
      "bestRating": "5",
      "worstRating": "1",
    },
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "reviewBody":
      "Lofty is a legitimate, beginner-friendly tokenized real estate platform with a $50 minimum investment, daily USDC payouts, and an Algorand-based Proactive Market Maker for liquidity. Yields average 8–14%. Best for investors who want low minimums and daily income.",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Lofty Review 2026: Yield, Fees, Risks & How It Works",
    "description":
      "A data-backed review of the Lofty real estate investment platform — covering yields, fees, liquidity, onboarding, and how it compares to RealT.",
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "url": "https://brickwise.pro/learn/lofty-review",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Lofty legit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. Lofty is a legitimate platform operating under US securities regulations. Each property is held in a Delaware LLC SPV, and token holders are legal LLC members. The platform has processed millions of dollars in investments and has a track record since 2021.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the minimum investment on Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The minimum investment on Lofty is $50 per property. This is one of the lowest minimums in tokenized real estate, allowing investors to diversify across many properties with small amounts.",
        },
      },
      {
        "@type": "Question",
        "name": "How does Lofty pay out rental income?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty pays rental income daily in USDC stablecoin directly to your connected wallet. This daily payout cadence is one of Lofty's key differentiators versus RealT which pays weekly.",
        },
      },
      {
        "@type": "Question",
        "name": "What blockchain does Lofty use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty uses the Algorand blockchain for its property tokens. Algorand was chosen for its low transaction fees and fast settlement times. This means you'll need an Algorand-compatible wallet (like Pera or MyAlgo) to hold Lofty tokens.",
        },
      },
      {
        "@type": "Question",
        "name": "How liquid are Lofty investments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty has a Proactive Market Maker (PMM) that provides baseline liquidity for all properties, meaning you can typically sell tokens without needing a direct buyer. However, liquidity depth varies — for large positions, selling may take time or require accepting a slight discount.",
        },
      },
      {
        "@type": "Question",
        "name": "What fees does Lofty charge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty charges no platform fee to buy tokens. Fees are built into the property structure: property management fees (typically 8–12%), property taxes, and insurance are all deducted before the net yield is paid to token holders. The yields displayed are net of these costs.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://brickwise.pro/learn" },
      { "@type": "ListItem", "position": 3, "name": "Lofty Review", "item": "https://brickwise.pro/learn/lofty-review" },
    ],
  };

  return (
    <PublicShell>
      <FireEvent name="learn_page_viewed" params={{ slug: "lofty-review" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[800px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.4)" }}>Learn</span>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>Lofty Review</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Platform Review · 2026
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Lofty Review: Yields, Fees & Is It Worth It?
          </h1>
          <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.55)" }}>
            Lofty lets you invest in rental properties from $50, receive daily income in USDC, and exit via its built-in market maker — all on Algorand. Here's what the data actually shows.
          </p>
        </div>

        {/* Quick verdict */}
        <div className="rounded-[12px] px-6 py-5 mb-8" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "#f97316" }}>Brickwise Verdict</div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[22px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#f97316" }}>4.2 / 5</span>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#f97316"><path d="M7 1l1.5 3.5 3.5.3-2.6 2.4.9 3.5L7 9 3.7 10.7l.9-3.5L2 4.8l3.5-.3z"/></svg>
              ))}
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l1.5 3.5 3.5.3-2.6 2.4.9 3.5L7 9 3.7 10.7l.9-3.5L2 4.8l3.5-.3z" fill="none" stroke="#f97316" strokeWidth="1"/></svg>
            </div>
          </div>
          <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.6)" }}>
            Strong choice for beginner and intermediate investors. Low minimums, daily payouts, and solid liquidity make it accessible. Limited to US properties; Algorand wallet requirement adds friction.
          </p>
        </div>

        {/* Key stats */}
        <div
          className="grid grid-cols-3 rounded-[10px] overflow-hidden mb-8"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Avg net yield (Lofty)", value: `${avgLoftyYield}%`, sub: "net of all fees" },
            { label: "Min investment", value: "$50", sub: "per property" },
            { label: "Payout frequency", value: "Daily", sub: "in USDC stablecoin" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[18px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "#f97316" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="prose-article space-y-8">

          {/* How Lofty works */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              How Lofty Works
            </h2>
            <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "rgba(242,237,230,0.65)" }}>
              Lofty acquires rental properties — primarily single-family and small multi-family homes across US cities — through individual Delaware LLCs. Each property is tokenized on the Algorand blockchain, with tokens representing fractional ownership in the LLC.
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.65)" }}>
              Tenants pay rent. After deducting property management, taxes, and insurance, the net income is distributed to all token holders in USDC — every single day. Lofty's Proactive Market Maker (PMM) provides a built-in secondary market so you can buy or sell tokens without needing a counterparty.
            </p>
          </section>

          {/* Pros and cons */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Pros & Cons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[10px] p-5" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-3" style={{ color: "#22c55e" }}>Strengths</div>
                <div className="space-y-2">
                  {[
                    "$50 minimum — lowest in the market",
                    "Daily USDC payouts to your wallet",
                    "Built-in PMM liquidity (no waiting for a buyer)",
                    "Simple onboarding, no crypto knowledge required",
                    "Transparent fee structure — all deducted before yield display",
                    "Active community and support",
                  ].map((p) => (
                    <div key={p} className="flex items-start gap-2 text-[12px]" style={{ color: "rgba(242,237,230,0.65)" }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }}>✓</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[10px] p-5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-3" style={{ color: "#ef4444" }}>Weaknesses</div>
                <div className="space-y-2">
                  {[
                    "Algorand wallet required — extra setup step",
                    "US properties only (no international diversification)",
                    "PMM liquidity has depth limits for large positions",
                    "Fewer properties than RealT",
                    "Algorand ecosystem less mature than Ethereum DeFi",
                    "KYC/AML required — not fully anonymous",
                  ].map((c) => (
                    <div key={c} className="flex items-start gap-2 text-[12px]" style={{ color: "rgba(242,237,230,0.65)" }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }}>✗</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Yields */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Real Yield Data
            </h2>
            <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(242,237,230,0.65)" }}>
              Based on Brickwise's analysis of {loftyProps.length || "tracked"} Lofty properties, here's what yields actually look like:
            </p>
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Yield tier</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Range</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Typical profile</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: "Conservative", range: "6–8%", profile: "High-occupancy, newer builds" },
                    { tier: "Average", range: `${(avgLoftyYield - 1).toFixed(0)}–${(avgLoftyYield + 1).toFixed(0)}%`, profile: "Most Lofty listings" },
                    { tier: "High yield", range: "12–16%", profile: "Higher vacancy risk markets" },
                    { tier: "Peak (top picks)", range: `up to ${maxLoftyYield}%`, profile: `${loftyBuyCount} Brickwise Buy signals` },
                  ].map((row, i) => (
                    <tr key={row.tier} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.65)" }}>{row.tier}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-center" style={{ fontFamily: "var(--font-dm-mono)", color: "#f97316" }}>{row.range}</td>
                      <td className="px-4 py-3 text-[11px] text-center" style={{ color: "rgba(242,237,230,0.4)" }}>{row.profile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
              All yields are <strong style={{ color: "rgba(242,237,230,0.7)" }}>net of property management, insurance, and property taxes</strong>. Gross yields run 2–4% higher.
            </p>
          </section>

          {/* Fees breakdown */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Fee Structure
            </h2>
            <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(242,237,230,0.65)" }}>
              Lofty's fee model is straightforward: no platform fee to buy. All costs are embedded in the property structure.
            </p>
            <div className="space-y-2.5">
              {[
                { fee: "Token purchase fee", amount: "0%", note: "No fee to buy property tokens" },
                { fee: "Property management", amount: "8–12%", note: "Of gross rent, deducted before your payout" },
                { fee: "Marketplace listing fee", amount: "0%", note: "Free to list tokens for sale" },
                { fee: "PMM spread", amount: "~0.3–1%", note: "Implicit in buy/sell price on the market maker" },
                { fee: "Algorand gas fees", amount: "<$0.01", note: "Negligible; Algorand is extremely cheap" },
              ].map((row, i) => (
                <div key={row.fee} className="flex items-center justify-between rounded-[8px] px-4 py-3" style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", border: "1px solid #2A2420" }}>
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.75)" }}>{row.fee}</div>
                    <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.35)" }}>{row.note}</div>
                  </div>
                  <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: row.amount === "0%" ? "#22c55e" : "#f97316" }}>{row.amount}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Lofty vs RealT */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Lofty vs RealT: Key Differences
            </h2>
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Feature</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#f97316" }}>Lofty</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#3b82f6" }}>RealT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feat: "Minimum investment", lofty: "$50", realt: "~$15–200+" },
                    { feat: "Blockchain", lofty: "Algorand", realt: "Ethereum" },
                    { feat: "Payout frequency", lofty: "Daily", realt: "Weekly" },
                    { feat: "Liquidity mechanism", lofty: "Built-in PMM", realt: "Uniswap / Secondary" },
                    { feat: "Property catalog", lofty: "Smaller", realt: "Larger" },
                    { feat: "DeFi integration", lofty: "Limited", realt: "Extensive" },
                    { feat: "Onboarding ease", lofty: "Easier", realt: "Moderate" },
                    { feat: "KYC required", lofty: "Yes", realt: "Yes" },
                  ].map((row, i) => (
                    <tr key={row.feat} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px]" style={{ color: "rgba(242,237,230,0.6)" }}>{row.feat}</td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-center" style={{ color: "#f97316" }}>{row.lofty}</td>
                      <td className="px-4 py-3 text-[12px] text-center" style={{ color: "rgba(242,237,230,0.45)" }}>{row.realt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
              See the{" "}
              <Link href="/compare/realt-vs-lofty" className="no-underline hover:opacity-80 transition-opacity" style={{ color: "#22c55e", textDecoration: "underline" }}>
                full RealT vs Lofty comparison
              </Link>{" "}
              with live yield data from all tracked properties.
            </p>
          </section>

          {/* Who should use Lofty */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Who Is Lofty Best For?
            </h2>
            <div className="space-y-2.5">
              {[
                { icon: "✓", label: "Beginners", body: "The $50 minimum and simple onboarding make it the best starting point for first-time tokenized RE investors.", good: true },
                { icon: "✓", label: "Small capital investors", body: "Build a diversified portfolio across 10+ properties with as little as $500.", good: true },
                { icon: "✓", label: "Income-focused investors", body: "Daily USDC payouts hit your wallet automatically — no action required.", good: true },
                { icon: "✗", label: "DeFi power users", body: "RealT's Ethereum integration with Uniswap liquidity pools is more suited to DeFi strategies.", good: false },
                { icon: "✗", label: "Large-capital investors", body: "PMM liquidity depth limits make it harder to deploy or exit $50k+ efficiently.", good: false },
              ].map((row) => (
                <div key={row.label} className="flex gap-3 rounded-[10px] px-4 py-3.5" style={{ background: "#131109", border: `1px solid ${row.good ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)"}` }}>
                  <span className="flex-shrink-0 text-[13px]" style={{ color: row.good ? "#22c55e" : "#ef4444" }}>{row.icon}</span>
                  <div>
                    <span className="text-[12px] font-semibold" style={{ color: "#F2EDE6" }}>{row.label}: </span>
                    <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.55)" }}>{row.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: "Is Lofty legit?", a: "Yes. Lofty is a legitimate, regulated platform. Properties are held in Delaware LLCs, token holders are legal LLC members, and the platform has a multi-year track record with thousands of active investors." },
                { q: "What is the minimum investment on Lofty?", a: "$50 per property — one of the lowest minimums in tokenized real estate. You can spread $500 across 10 different properties." },
                { q: "How does Lofty pay out rental income?", a: "Daily in USDC stablecoin, directly to your connected Algorand wallet. No action needed from your side — income accumulates automatically." },
                { q: "What blockchain does Lofty use?", a: "Algorand. You'll need an Algorand-compatible wallet (Pera Wallet is the recommended option) to hold and receive Lofty tokens." },
                { q: "How liquid are Lofty investments?", a: "More liquid than most tokenized real estate. The Proactive Market Maker provides baseline liquidity for all properties. Large positions (>$10k) may require more patience when exiting." },
                { q: "What fees does Lofty charge?", a: "No token purchase fee. Costs are embedded in the property (management ~8–12%, taxes, insurance) and deducted before your yield is calculated. The yield you see is net of all costs." },
              ].map((faq, i) => (
                <div key={i} className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <h3 className="text-[13px] font-semibold mb-2" style={{ color: "#F2EDE6" }}>{faq.q}</h3>
                  <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Related content */}
        <div className="mt-8 mb-6">
          <div className="text-[11px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>Continue reading</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "RealT Review: Yields, Fees & How It Works", href: "/learn/realt-review", tag: "Review" },
              { title: "RealT vs Lofty: Full Platform Comparison", href: "/compare/realt-vs-lofty", tag: "Comparison" },
              { title: "What Is Tokenized Real Estate?", href: "/learn/what-is-tokenized-real-estate", tag: "Guide" },
              { title: "Browse All Lofty Properties", href: "/analyzer", tag: "Tool" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="no-underline block">
                <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: "#22c55e" }}>{link.tag}</div>
                  <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>{link.title} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>See which Lofty properties score Buy</div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Brickwise scores every property by yield, risk, and fair value. Filter to Lofty only.
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

        <p className="mt-6 text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.25)" }}>
          This review is for educational purposes only. Not financial advice. Always conduct your own research and consult a qualified financial advisor before investing.
        </p>
      </div>
    </PublicShell>
  );
}
