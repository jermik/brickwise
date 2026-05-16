import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What Is Tokenized Real Estate? Complete Guide (2026) | Brickwise",
  description:
    "Tokenized real estate converts property ownership into blockchain tokens, letting investors buy fractional shares from $50. Learn how it works, typical yields (8–14%), risks, and how to get started.",
  keywords: [
    "what is tokenized real estate",
    "how does real estate tokenization work",
    "tokenized real estate explained",
    "how to invest in tokenized real estate",
    "tokenized real estate for beginners",
    "fractional real estate investing",
    "real estate tokens guide",
    "blockchain real estate investing",
    "tokenized real estate yield",
    "is tokenized real estate a good investment",
    "tokenized real estate vs REIT",
    "how does realt work",
    "how does lofty work",
  ],
  openGraph: {
    title: "What Is Tokenized Real Estate? Complete Beginner's Guide (2026) | Brickwise",
    description:
      "Everything you need to know about tokenized real estate , how it works, who the platforms are, what yields to expect, and whether it's right for you.",
    type: "article",
    url: "https://brickwise.pro/learn/what-is-tokenized-real-estate",
  },
  alternates: { canonical: "https://brickwise.pro/learn/what-is-tokenized-real-estate" },
};

const avgYield = +(PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / PROPERTIES.length).toFixed(1);
const maxYield = +Math.max(...PROPERTIES.map((p) => p.expectedYield)).toFixed(1);
const buyCount = PROPERTIES.filter((p) => {
  return p.overallScore >= 75;
}).length;

export default function WhatIsTokenizedRealEstatePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Tokenized Real Estate? Complete Guide (2026)",
    "description":
      "A beginner's guide to tokenized real estate , how blockchain tokens represent property ownership, how to invest from $50, expected yields, risks, and the top platforms.",
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "url": "https://brickwise.pro/learn/what-is-tokenized-real-estate",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Tokenized real estate is real property ownership that has been converted into digital tokens on a blockchain. Each token represents a fractional share of the property , including the right to receive rental income and a proportional claim on the asset's value. Platforms like RealT and Lofty issue these tokens, allowing investors to own fractions of rental properties for as little as $50.",
        },
      },
      {
        "@type": "Question",
        "name": "How does tokenized real estate work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "A platform like RealT or Lofty acquires a property through a Special Purpose Vehicle (SPV) , typically an LLC. They then issue tokens that represent ownership shares in that LLC. Investors buy tokens, gaining proportional ownership rights. Rental income from tenants is collected and distributed to token holders (usually in USDC stablecoin, daily or weekly). Token holders can also sell their tokens on the platform's secondary market.",
        },
      },
      {
        "@type": "Question",
        "name": "What yields can I expect from tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Tokenized real estate yields vary by property. Across ${PROPERTIES.length} properties tracked by Brickwise, the average net yield is ${avgYield}%, with individual properties ranging from below 5% to ${maxYield}%. Yields are stated net of property management, taxes, and insurance fees. Higher yields typically correspond to higher-risk cities or older properties.`,
        },
      },
      {
        "@type": "Question",
        "name": "Is tokenized real estate a good investment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Tokenized real estate can be a good investment for the right investor , one seeking passive rental income with fractional diversification across multiple properties. Yields of 8–14% are significantly higher than most traditional fixed-income assets. However, the investments are illiquid relative to stocks, carry real estate risk (vacancies, maintenance), and are tied to platform operational risk. It is not a replacement for a diversified portfolio.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the minimum investment for tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The minimum varies by platform. Lofty has a $50 minimum per property. On RealT, the minimum is one token, which ranges from roughly $15 to $200+ depending on the property. This low entry point allows investors to diversify across dozens of properties without large capital.",
        },
      },
      {
        "@type": "Question",
        "name": "How does tokenized real estate compare to REITs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Both give access to real estate income without direct property ownership. Key differences: Tokenized real estate offers direct ownership in specific properties (not a fund), daily/weekly income payouts, lower minimums, and more transparency. REITs trade on public stock exchanges (higher liquidity), are regulated as securities, and offer broader diversification but less control over property selection.",
        },
      },
      {
        "@type": "Question",
        "name": "What are the risks of tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Key risks include: (1) Vacancy risk , if tenants leave, rental income drops to zero. (2) Platform risk , if RealT or Lofty shut down, token holders would still legally own the underlying SPV but could face operational complexity. (3) Liquidity risk , unlike stocks, secondary market depth for individual property tokens varies. (4) Regulatory risk , the regulatory framework for tokenized securities is still evolving. (5) Property risk , unexpected maintenance, floods, or market value decline.",
        },
      },
      {
        "@type": "Question",
        "name": "Is tokenized real estate legal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. In the United States, platforms like RealT and Lofty operate under Regulation D exemptions (for accredited investors) or other exemptions. Each property is held through an LLC SPV, and token holders have legal ownership rights. Non-US investors can typically also participate. Always verify current regulations in your specific jurisdiction before investing.",
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
      {
        "@type": "ListItem",
        "position": 3,
        "name": "What Is Tokenized Real Estate?",
        "item": "https://brickwise.pro/learn/what-is-tokenized-real-estate",
      },
    ],
  };

  return (
    <PublicShell>
      <FireEvent name="learn_page_viewed" params={{ slug: "what-is-tokenized-real-estate" }} />
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
          <span style={{ color: "rgba(242,237,230,0.7)" }}>What Is Tokenized Real Estate?</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Beginner's Guide
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            What Is Tokenized Real Estate?
          </h1>
          <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.55)" }}>
            Tokenized real estate converts property ownership into blockchain tokens, letting anyone invest in rental properties from as little as $50 , no mortgage, no management headaches. Here's exactly how it works.
          </p>
        </div>

        {/* Quick stats */}
        <div
          className="grid grid-cols-3 rounded-[10px] overflow-hidden mb-8"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Avg net yield", value: `${avgYield}%`, sub: "across tracked properties" },
            { label: "Min investment", value: "$50", sub: "on Lofty platform" },
            { label: "Properties tracked", value: String(PROPERTIES.length), sub: "on Brickwise" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[18px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main article content */}
        <div className="prose-article space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              The Simple Definition
            </h2>
            <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "rgba(242,237,230,0.65)" }}>
              <strong style={{ color: "#F2EDE6" }}>Tokenized real estate</strong> is real property ownership that has been divided into digital tokens on a blockchain. Each token represents a fractional share of the property , including the right to receive rental income proportional to your ownership stake.
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.65)" }}>
              Think of it like buying a single share of a company on the stock market , except the "company" is a single rental property, and the "dividend" is monthly rent from real tenants.
            </p>
          </section>

          {/* Section 2: How it works */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              How Tokenized Real Estate Works
            </h2>
            <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(242,237,230,0.65)" }}>
              The process follows four steps:
            </p>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Platform acquires a property",
                  body: "RealT, Lofty, or another platform finds a rental property , typically a single-family or multi-family home in a US city. They acquire it through a Special Purpose Vehicle (SPV), usually a Delaware LLC.",
                },
                {
                  step: "2",
                  title: "Property is tokenized",
                  body: "The LLC issues digital tokens on a blockchain (ERC-20 tokens on Ethereum for RealT; tokens on Algorand for Lofty). Each token represents a fractional ownership share of the LLC, and therefore of the property.",
                },
                {
                  step: "3",
                  title: "Investors buy tokens",
                  body: "You buy tokens on the platform's marketplace , from as little as $50 on Lofty or one token (~$15–200+) on RealT. You now legally own a fraction of that property.",
                },
                {
                  step: "4",
                  title: "Rental income flows to token holders",
                  body: "Tenants pay rent. The property manager deducts fees, taxes, and insurance. The remaining income is distributed to all token holders in USDC stablecoin , daily on Lofty, weekly on RealT.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 rounded-[10px] px-5 py-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: "#22c55e", color: "#0A0907" }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold mb-1" style={{ color: "#F2EDE6" }}>{s.title}</div>
                    <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Yields */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              What Yields Can You Expect?
            </h2>
            <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "rgba(242,237,230,0.65)" }}>
              Yields vary significantly by property, city, and platform. Based on Brickwise's analysis of {PROPERTIES.length} properties:
            </p>
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Category</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Typical Yield</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Conservative / Low-risk", yield: "7–9%", note: "Newer builds, high occupancy cities" },
                    { cat: "Average (most properties)", yield: `${(avgYield - 1).toFixed(0)}–${(avgYield + 1).toFixed(0)}%`, note: "Majority of the market" },
                    { cat: "High-yield / Higher-risk", yield: "12–16%", note: "Older stock, higher vacancy areas" },
                    { cat: "Best available (Brickwise top picks)", yield: `${(maxYield - 2).toFixed(0)}–${maxYield}%`, note: `Top ${buyCount} scored Buy` },
                  ].map((row, i) => (
                    <tr key={row.cat} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.65)" }}>{row.cat}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-center" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{row.yield}</td>
                      <td className="px-4 py-3 text-[11px] text-center" style={{ color: "rgba(242,237,230,0.4)" }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
              These are <strong style={{ color: "rgba(242,237,230,0.7)" }}>net yields after fees</strong> (property management, insurance, property tax). Gross yields are typically 2–4% higher. Brickwise's analyzer lets you filter by minimum yield and see fee breakdowns for every property.
            </p>
          </section>

          {/* Section 4: Platforms */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              The Main Platforms: RealT and Lofty
            </h2>
            <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(242,237,230,0.65)" }}>
              Two platforms dominate the tokenized real estate space for individual investors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                {
                  name: "RealT",
                  url: "realt.co",
                  color: "#3b82f6",
                  desc: "The original tokenized real estate platform, founded 2019. Largest property catalog, Ethereum-based tokens, weekly USDC payouts. Strong DeFi integration.",
                  best: "Best for: Depth, DeFi, city diversity",
                },
                {
                  name: "Lofty",
                  url: "lofty.ai",
                  color: "#f97316",
                  desc: 'Self-described as "The NASDAQ for Real Estate." Algorand-based, $50 minimum, instant liquidity via Proactive Market Maker, daily USDC payouts.',
                  best: "Best for: Liquidity, small investments, onboarding",
                },
              ].map((pl) => (
                <div key={pl.name} className="rounded-[10px] p-5" style={{ background: "#131109", border: `1px solid ${pl.color}30` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: pl.color }} />
                    <span className="text-[15px] font-bold" style={{ color: "#F2EDE6" }}>{pl.name}</span>
                    <span className="text-[12px] ml-auto" style={{ color: pl.color }}>{pl.url}</span>
                  </div>
                  <p className="text-[12px] leading-[1.6] mb-2" style={{ color: "rgba(242,237,230,0.55)" }}>{pl.desc}</p>
                  <div className="text-[12px] font-semibold" style={{ color: pl.color }}>{pl.best}</div>
                </div>
              ))}
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
              See our full{" "}
              <Link href="/compare/realt-vs-lofty" className="no-underline hover:opacity-80 transition-opacity" style={{ color: "#22c55e", textDecoration: "underline" }}>
                RealT vs Lofty comparison
              </Link>{" "}
              for a detailed side-by-side breakdown including live yield data.
            </p>
          </section>

          {/* Section 5: Tokenized RE vs REIT */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Tokenized Real Estate vs REITs
            </h2>
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Feature</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#22c55e" }}>Tokenized RE</th>
                    <th className="text-center px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>REIT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Min investment", token: "$50", reit: "$1 (ETF)" },
                    { feature: "Liquidity", token: "Low–Medium", reit: "High (exchange)" },
                    { feature: "Specific property control", token: "✓ Yes", reit: "✗ No" },
                    { feature: "Yield transparency", token: "Per-property", reit: "Fund-level" },
                    { feature: "Payment frequency", token: "Daily / Weekly", reit: "Quarterly" },
                    { feature: "Regulated as security", token: "Varies", reit: "Yes (SEC)" },
                    { feature: "Typical yield", token: `${(avgYield - 2).toFixed(0)}–${(avgYield + 2).toFixed(0)}%`, reit: "3–5%" },
                    { feature: "Tax complexity", token: "Higher (crypto)", reit: "Standard" },
                  ].map((row, i) => (
                    <tr key={row.feature} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px]" style={{ color: "rgba(242,237,230,0.6)" }}>{row.feature}</td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-center" style={{ color: "#22c55e" }}>{row.token}</td>
                      <td className="px-4 py-3 text-[12px] text-center" style={{ color: "rgba(242,237,230,0.45)" }}>{row.reit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Risks */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              The Real Risks You Should Know
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  title: "Vacancy risk",
                  body: "If a tenant leaves and the property sits empty, your rental income drops to zero. Brickwise shows occupancy rates for every property , prioritize those above 90%.",
                },
                {
                  title: "Platform risk",
                  body: "If RealT or Lofty shut down, you'd still legally own the underlying SPV , but managing it would become complex. Both platforms are growing, but no startup is guaranteed.",
                },
                {
                  title: "Liquidity risk",
                  body: "Unlike stocks, you cannot always sell your tokens instantly. Secondary market depth varies by property. Lofty's PMM mitigates this; RealT's Uniswap liquidity varies.",
                },
                {
                  title: "Regulatory risk",
                  body: "Tokenized securities regulation is evolving in the US and globally. Regulatory changes could affect how these platforms operate.",
                },
                {
                  title: "Property risk",
                  body: "Unexpected maintenance (roofs, HVAC), flood damage, or property value decline are standard real estate risks that apply equally to tokenized investments.",
                },
              ].map((r) => (
                <div key={r.title} className="flex gap-3 rounded-[10px] px-4 py-3.5" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 12H1L7 1z" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M7 5v3" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="7" cy="10" r="0.7" fill="#d97706" />
                  </svg>
                  <div>
                    <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#fcd34d" }}>{r.title}</div>
                    <p className="text-[12px] leading-[1.5]" style={{ color: "#f59e0b", opacity: 0.75 }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: How to start */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              How to Start Investing in Tokenized Real Estate
            </h2>
            <div className="space-y-3">
              {[
                { n: "1", t: "Choose a platform", b: "Start with RealT or Lofty. Both are legitimate, regulated, and have thousands of investors. Lofty is easier to onboard for beginners." },
                { n: "2", t: "Complete KYC", b: "Both platforms require identity verification (passport, proof of address). This usually takes 1–48 hours." },
                { n: "3", t: "Fund your account", b: "Deposit USD or USDC. Most platforms accept bank transfers; some support crypto deposits directly." },
                { n: "4", t: "Research before you buy", b: `Use Brickwise to compare properties by yield, risk, fair value, and buy signal before committing. Our analyzer covers ${PROPERTIES.length} properties with independent scores.` },
                { n: "5", t: "Diversify from day one", b: "Spread across at least 5–10 properties and 2–3 cities. The low minimums make this easy even with $500–$1,000 total." },
                { n: "6", t: "Monitor your income", b: "Check payouts weekly or monthly. Track yield changes , if a property's yield drops below your threshold, Brickwise will flag it." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 rounded-[10px] px-5 py-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: "#22c55e", color: "#0A0907" }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>{s.t}</div>
                    <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>{s.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ section */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "What is tokenized real estate?",
                  a: "Tokenized real estate is real property ownership converted into digital tokens on a blockchain. Each token represents a fractional share , including the right to receive rental income and a proportional claim on the asset's value.",
                },
                {
                  q: "Is tokenized real estate a good investment?",
                  a: `It can be. Yields of ${(avgYield - 1).toFixed(0)}–${(avgYield + 2).toFixed(0)}% significantly beat most fixed-income alternatives. However, it's illiquid relative to stocks and carries vacancy, platform, and regulatory risks. Best suited for investors seeking passive income who can tolerate reduced liquidity.`,
                },
                {
                  q: "How does tokenized real estate compare to REITs?",
                  a: "Both give real estate exposure without direct ownership. Tokenized RE offers specific property control, higher yields, and more frequent payouts. REITs offer much higher liquidity (trade on exchanges), are SEC-regulated, and provide broader diversification in a single instrument.",
                },
                {
                  q: "What is the minimum investment for tokenized real estate?",
                  a: "On Lofty, the minimum is $50 per property. On RealT, it's one token (typically $15–$200+). Most platforms also let you hold partial tokens.",
                },
                {
                  q: "Is tokenized real estate legal in the US?",
                  a: "Yes. Platforms like RealT and Lofty operate under US securities exemptions (Regulation D). Each property is held in an LLC SPV with investors as legal LLC members. Non-US investors can typically participate as well.",
                },
                {
                  q: "What are the tax implications of tokenized real estate?",
                  a: "Rental income from tokenized properties is generally treated as ordinary income in the US. Token sales may trigger capital gains. The LLC structure typically means investors receive K-1 forms (US) or equivalent documentation. Consult a tax professional for your specific situation.",
                },
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
              { title: "RealT vs Lofty: Full Platform Comparison", href: "/compare/realt-vs-lofty", tag: "Comparison" },
              { title: "Analyze All Properties , Buy/Hold/Avoid", href: "/analyzer", tag: "Tool" },
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
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>Ready to find your first property?</div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              {PROPERTIES.length} properties scored and ranked. Filter by yield, risk, and buy signal , no signup required.
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
          This guide is for educational purposes only. Not financial advice. Always conduct your own research and consult a qualified financial advisor before investing.
        </p>
      </div>
    </PublicShell>
  );
}
