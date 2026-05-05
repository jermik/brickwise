import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { StickyLearnCta } from "@/components/conversion/sticky-learn-cta";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How to Invest in Tokenized Real Estate: Step-by-Step Guide (2026) | Brickwise",
  description:
    "Complete beginner's guide to investing in tokenized real estate. Learn how to choose a platform, complete KYC, buy your first token, and start earning daily rental income from $50.",
  keywords: [
    "how to invest in tokenized real estate",
    "tokenized real estate for beginners",
    "how to buy real estate tokens",
    "getting started tokenized real estate",
    "how to start investing RealT",
    "how to start investing Lofty",
    "buy real estate tokens step by step",
    "fractional real estate investing guide",
    "tokenized real estate beginner",
    "real estate token investing 2026",
  ],
  openGraph: {
    title: "How to Invest in Tokenized Real Estate: Complete Beginner's Guide | Brickwise",
    description:
      "Step-by-step guide to buying your first tokenized real estate token — platform selection, KYC, funding, and property analysis.",
    type: "article",
    url: "https://brickwise.pro/learn/how-to-invest-in-tokenized-real-estate",
  },
  alternates: { canonical: "https://brickwise.pro/learn/how-to-invest-in-tokenized-real-estate" },
};

const count = PROPERTIES.length;
const avgYield =
  Math.round((PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / count) * 10) / 10;
const buyCount = PROPERTIES.filter((p) => p.overallScore >= 75).length;

const steps = [
  {
    n: "1",
    title: "Choose your platform",
    body: `Start with RealT or Lofty — both are legitimate, established platforms with hundreds of properties. Lofty is easier to onboard (lower minimum, cleaner UI, faster KYC). RealT has more properties and deeper DeFi integrations. Most serious investors use both.`,
  },
  {
    n: "2",
    title: "Create an account and complete KYC",
    body: "Both platforms require identity verification — passport or ID, proof of address, and sometimes a selfie. This typically takes 1–24 hours. Non-US investors can usually participate, though some properties are US-accredited-investor only.",
  },
  {
    n: "3",
    title: "Fund your account",
    body: "Deposit USD via bank transfer (ACH or wire) or USDC stablecoin directly. Both platforms accept fiat. Minimum effective deposit is around $50–100 to cover a single token position. There is no minimum portfolio size.",
  },
  {
    n: "4",
    title: "Research properties before buying",
    body: `Use Brickwise to compare all ${count} tracked properties by net yield, risk score, occupancy rate, and fair value. Filter to yield ≥ 8%, risk ≤ medium, and look for a Buy signal (score ≥ 75). Currently ${buyCount} properties qualify.`,
  },
  {
    n: "5",
    title: "Buy your first tokens",
    body: "On Lofty, select a property, choose your investment amount (minimum $50), and confirm. On RealT, browse available properties and buy at the listed price. For existing properties, check the secondary market on the platform or Uniswap.",
  },
  {
    n: "6",
    title: "Receive your first rental payout",
    body: "Lofty pays daily in USDC; RealT pays weekly. Your first payout will arrive proportional to your ownership share and the days held. You can reinvest payouts into new properties to compound your yield.",
  },
  {
    n: "7",
    title: "Diversify across properties and cities",
    body: `Don't concentrate in one property or city. Spread across 5–10 properties minimum, ideally in 3+ cities. The low minimums make this easy — $500 can cover 5–10 diverse positions. Vacancy in one property hurts much less when you're diversified.`,
  },
  {
    n: "8",
    title: "Monitor and rebalance",
    body: "Check your portfolio monthly. If a property's yield drops significantly or occupancy falls below 80%, consider selling. Use Brickwise to track which properties have moved from Buy to Hold or Avoid since you purchased.",
  },
];

export default function HowToInvestPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Invest in Tokenized Real Estate: Step-by-Step Guide (2026)",
    "description":
      "Complete beginner's guide to investing in tokenized real estate — platform selection, KYC, funding, buying tokens, and earning rental income.",
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "url": "https://brickwise.pro/learn/how-to-invest-in-tokenized-real-estate",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Invest in Tokenized Real Estate",
    "description":
      "A step-by-step guide for beginners to start investing in tokenized real estate on platforms like RealT and Lofty.",
    "totalTime": "P1D",
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "50" },
    "step": steps.map((s) => ({
      "@type": "HowToStep",
      "name": s.title,
      "text": s.body,
      "position": parseInt(s.n),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much money do I need to start investing in tokenized real estate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "You can start with as little as $50 on Lofty, or one token on RealT (typically $15–$200+). To meaningfully diversify across multiple properties, plan for $500–$1,000. There is no maximum.",
        },
      },
      {
        "@type": "Question",
        "name": "How do I choose between RealT and Lofty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Choose Lofty if you're a beginner (simpler onboarding, $50 minimum, daily payouts, better liquidity). Choose RealT if you want more property diversity, DeFi integration, or higher total exposure. Most experienced investors use both.",
        },
      },
      {
        "@type": "Question",
        "name": "When do I start receiving rental income?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Lofty pays daily in USDC — you'll see your first payout within 24 hours of purchase. RealT pays weekly — your first payout comes at the next weekly distribution after purchase.",
        },
      },
      {
        "@type": "Question",
        "name": "How do I sell my tokens when I want to exit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "On Lofty, you can sell tokens through the platform's Proactive Market Maker for near-instant liquidity. On RealT, list tokens on the RealT secondary marketplace or sell on Uniswap. Lofty generally offers better immediate liquidity.",
        },
      },
      {
        "@type": "Question",
        "name": "Is tokenized real estate a good investment for beginners?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Tokenized real estate can be a good investment for beginners comfortable with crypto wallets and passive income investing. Average yields across ${count} tracked properties are ${avgYield}% net — significantly better than savings accounts or REITs. However, it's less liquid than stocks and has vacancy risk. Start small and diversify.`,
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
        "name": "How to Invest in Tokenized Real Estate",
        "item": "https://brickwise.pro/learn/how-to-invest-in-tokenized-real-estate",
      },
    ],
  };

  return (
    <AppShell>
      <FireEvent name="learn_page_viewed" params={{ slug: "how-to-invest-in-tokenized-real-estate" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[800px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.4)" }}>Learn</span>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>How to Invest</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Beginner's Guide · 8 Steps
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            How to Invest in Tokenized Real Estate
          </h1>
          <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.55)" }}>
            A practical, step-by-step guide for beginners — from opening an account to earning your first daily rental payout. Start with as little as $50.
          </p>
        </div>

        {/* Quick stats */}
        <div
          className="grid grid-cols-3 rounded-[10px] overflow-hidden mb-8"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Min to start", value: "$50", sub: "on Lofty" },
            { label: "Platform avg yield", value: `${avgYield}%`, sub: "net after fees" },
            { label: "Properties tracked", value: String(count), sub: "on Brickwise" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[18px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{s.value}</div>
              <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="space-y-8">

          {/* Steps */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              8 Steps to Your First Tokenized Property
            </h2>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-4 rounded-[10px] px-5 py-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: "#22c55e", color: "#0A0907" }}
                  >
                    {step.n}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold mb-1" style={{ color: "#F2EDE6" }}>{step.title}</div>
                    <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform comparison */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              RealT vs Lofty: Which Should You Start With?
            </h2>
            <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Factor</th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#3b82f6" }}>RealT</th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#f97316" }}>Lofty</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: "Minimum investment", r: "~$50–200+ / token", l: "$50 flat" },
                    { f: "Payout frequency", r: "Weekly", l: "Daily" },
                    { f: "Blockchain", r: "Ethereum (ERC-20)", l: "Algorand" },
                    { f: "Liquidity", r: "Secondary market + Uniswap", l: "Proactive Market Maker" },
                    { f: "Onboarding ease", r: "Moderate", l: "Easiest" },
                    { f: "DeFi integrations", r: "Aave, Uniswap, RMM", l: "Limited" },
                    { f: "Best for", r: "Diversity, DeFi users", l: "Beginners, liquidity" },
                  ].map((row, i) => (
                    <tr key={row.f} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px]" style={{ color: "rgba(242,237,230,0.6)" }}>{row.f}</td>
                      <td className="px-4 py-3 text-[11px] text-center" style={{ color: "#93c5fd" }}>{row.r}</td>
                      <td className="px-4 py-3 text-[11px] text-center" style={{ color: "#fb923c" }}>{row.l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Common mistakes */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Common Beginner Mistakes to Avoid
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  title: "Concentrating in one or two properties",
                  body: "If that property goes vacant, your income drops to zero. Spread across at least 5–10 properties from day one.",
                },
                {
                  title: "Chasing the highest yield without checking risk",
                  body: "A 16% yield on a Detroit property with 60% occupancy is not better than a 9% yield on a property with 97% occupancy. Use Brickwise's risk scores.",
                },
                {
                  title: "Ignoring the fee breakdown",
                  body: "Net yields are what matter. A property advertising 12% gross yield might only deliver 8% net after 10% management fee, taxes, and insurance.",
                },
                {
                  title: "Expecting stock-level liquidity",
                  body: "These are real properties in LLCs. The secondary market is real but thinner than equities. Only invest money you won't need urgently.",
                },
                {
                  title: "Not tracking your income",
                  body: "Rental income from tokenized real estate is taxable in most jurisdictions. Keep records of payouts from day one.",
                },
              ].map((m) => (
                <div key={m.title} className="flex gap-3 rounded-[10px] px-4 py-3.5" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L13 12H1L7 1z" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M7 5v3" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="7" cy="10" r="0.7" fill="#d97706" />
                  </svg>
                  <div>
                    <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#fcd34d" }}>{m.title}</div>
                    <p className="text-[12px] leading-[1.5]" style={{ color: "#f59e0b", opacity: 0.75 }}>{m.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Email capture */}
          <EmailCaptureWidget source="how_to_invest" />

          {/* FAQ */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: "How much money do I need to start?", a: "As little as $50 on Lofty, or one token on RealT (~$15–$200+). For meaningful diversification, $500–$1,000 is a practical starting point." },
                { q: "When do I start receiving rental income?", a: "Lofty pays daily in USDC — first payout within 24 hours. RealT pays weekly at the next distribution date after purchase." },
                { q: "How do I sell when I want to exit?", a: "Lofty: instant via Proactive Market Maker. RealT: list on the secondary marketplace or sell on Uniswap. Expect some price slippage on illiquid properties." },
                { q: "Is tokenized real estate good for beginners?", a: `Average net yield across ${count} tracked properties is ${avgYield}% — strong passive income. The main barrier for beginners is crypto literacy (wallets, USDC). Lofty has simplified this significantly.` },
                { q: "Do I need to be accredited to invest?", a: "Some properties on RealT are restricted to US-accredited investors. Most Lofty properties are open to all qualified investors. Non-US investors can usually participate on both platforms for most properties." },
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
              { title: "What Is Tokenized Real Estate? The Basics", href: "/learn/what-is-tokenized-real-estate", tag: "Guide" },
              { title: "RealT vs Lofty: Which Platform Is Better?", href: "/compare/realt-vs-lofty", tag: "Comparison" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="no-underline block">
                <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: "#22c55e" }}>{link.tag}</div>
                  <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>{link.title} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>Find your first property with Brickwise</div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              {count} properties scored and ranked. Filter by yield, risk, and platform — free.
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

        <p className="mt-6 text-[10px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.25)" }}>
          This guide is for educational purposes only. Not financial advice. Always conduct your own research and consult a qualified financial advisor before investing.
        </p>
      </div>
      <StickyLearnCta label="sticky-cta-how-to-invest" />
    </AppShell>
  );
}
