import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { StickyLearnCta } from "@/components/conversion/sticky-learn-cta";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "RealT Review 2026: Yields, Fees, Risks & Is It Worth It? | Brickwise",
  description:
    "In-depth RealT review based on live data from hundreds of tokenized properties. We analyze actual yields, management fees, vacancy rates, and how RealT compares to Lofty.",
  keywords: [
    "RealT review 2026",
    "is RealT legit",
    "RealT yield review",
    "RealT fees analysis",
    "RealT tokenized real estate review",
    "RealT vs Lofty",
    "RealT investment review",
    "RealT properties analysis",
    "real estate token platform review",
    "RealT rental income",
  ],
  openGraph: {
    title: "RealT Review 2026: Real Yields, Fees & Risks | Brickwise",
    description:
      "Data-driven RealT review covering actual net yields, fee structure, vacancy trends, and an honest verdict on who should invest.",
    type: "article",
    url: "https://brickwise.pro/learn/realt-review",
  },
  alternates: { canonical: "https://brickwise.pro/learn/realt-review" },
};

const realtProps = PROPERTIES.filter((p) => p.platform === "RealT");
const count = realtProps.length;
const avgYield =
  count > 0
    ? Math.round((realtProps.reduce((s, p) => s + p.expectedYield, 0) / count) * 10) / 10
    : 0;
const maxYield = count > 0 ? Math.round(Math.max(...realtProps.map((p) => p.expectedYield)) * 10) / 10 : 0;
const buyCount = realtProps.filter((p) => p.overallScore >= 75).length;
const avgScore =
  count > 0
    ? Math.round(realtProps.reduce((s, p) => s + p.overallScore, 0) / count)
    : 0;

export default function RealtReviewPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "RealT Review 2026: Yields, Fees, Risks & Is It Worth It?",
    "description":
      "In-depth review of RealT tokenized real estate platform based on live yield and fee data across hundreds of properties.",
    "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "url": "https://brickwise.pro/learn/realt-review",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is RealT a legitimate investment platform?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. RealT is a legitimate US-based company that has been operating since 2019. They tokenize real properties on the Ethereum blockchain through LLCs, giving investors legal fractional ownership. They are one of the most established tokenized real estate platforms globally.",
        },
      },
      {
        "@type": "Question",
        "name": "What yields does RealT offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `RealT net yields vary by property. Based on Brickwise data tracking ${count} RealT properties, the average net yield is ${avgYield}%, with individual properties ranging from under 6% to ${maxYield}%. Yields are after management fees, property taxes, and insurance.`,
        },
      },
      {
        "@type": "Question",
        "name": "What fees does RealT charge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "RealT charges a property management fee typically ranging from 8–12% of gross rent, plus property tax and insurance which are deducted before payouts. There is no platform fee for holding tokens. Buying tokens on the secondary market (RealT Marketplace or Uniswap) may incur gas fees.",
        },
      },
      {
        "@type": "Question",
        "name": "How does RealT pay investors?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "RealT distributes rental income to token holders weekly in USDC stablecoin, directly to the Ethereum wallet associated with your account. Payments are proportional to your token ownership share.",
        },
      },
      {
        "@type": "Question",
        "name": "How liquid are RealT tokens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "RealT tokens can be sold on the RealT secondary marketplace or on Uniswap (via USDC liquidity pools). Liquidity varies significantly by property — popular properties have deeper liquidity. Expect some slippage on smaller properties. Lofty's PMM mechanism generally offers better immediate liquidity.",
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
      { "@type": "ListItem", "position": 3, "name": "RealT Review", "item": "https://brickwise.pro/learn/realt-review" },
    ],
  };

  return (
    <AppShell>
      <FireEvent name="learn_page_viewed" params={{ slug: "realt-review" }} />
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
          <span style={{ color: "rgba(242,237,230,0.7)" }}>RealT Review</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Platform Review · Updated {new Date().getFullYear()}
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            RealT Review {new Date().getFullYear()}
          </h1>
          <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.55)" }}>
            An honest, data-driven review of RealT based on live yield and fee data across {count} tokenized properties tracked on Brickwise. We cover actual returns, fee structure, platform risks, and who should invest.
          </p>
        </div>

        {/* Quick stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 rounded-[10px] overflow-hidden mb-8"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Properties tracked", value: String(count), sub: "on Brickwise" },
            { label: "Avg net yield", value: `${avgYield}%`, sub: "after all fees" },
            { label: "Top yield", value: `${maxYield}%`, sub: "best RealT property" },
            { label: "Buy signals", value: String(buyCount), sub: "score ≥ 75/100" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[18px] font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6" }}>{s.value}</div>
              <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.35)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="space-y-8">

          {/* Overview */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              What Is RealT?
            </h2>
            <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "rgba(242,237,230,0.65)" }}>
              <strong style={{ color: "#F2EDE6" }}>RealT</strong> is a US-based tokenized real estate platform founded in 2019. It was one of the first companies to bring fractional property ownership to the blockchain, and remains the largest by total property count.
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.65)" }}>
              Each property is held through a Delaware LLC. RealT issues ERC-20 tokens on the Ethereum blockchain representing fractional LLC membership interests. Token holders receive weekly USDC payouts proportional to their ownership share.
            </p>
          </section>

          {/* Yields */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              RealT Yields: What the Data Shows
            </h2>
            <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(242,237,230,0.65)" }}>
              Based on Brickwise's analysis of {count} RealT properties, here is how yields distribute:
            </p>
            <div className="rounded-[10px] overflow-hidden mb-4" style={{ border: "1px solid #2A2420" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                    <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Category</th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Net Yield</th>
                    <th className="text-center px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Conservative properties", yield: "6–8%", note: "Newer builds, high-occupancy cities" },
                    { cat: "Average RealT property", yield: `~${avgYield}%`, note: "Platform average on Brickwise" },
                    { cat: "High-yield properties", yield: "11–15%", note: "Older stock, higher vacancy risk" },
                    { cat: "Platform best", yield: `up to ${maxYield}%`, note: `${buyCount} properties score Buy` },
                  ].map((row, i) => (
                    <tr key={row.cat} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                      <td className="px-5 py-3 text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.65)" }}>{row.cat}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-center" style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6" }}>{row.yield}</td>
                      <td className="px-4 py-3 text-[11px] text-center" style={{ color: "rgba(242,237,230,0.4)" }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
              All yields are <strong style={{ color: "rgba(242,237,230,0.7)" }}>net of fees</strong> (property management ~8–12%, insurance, property tax). Gross yields are typically 3–5% higher than net yields stated by RealT.
            </p>
          </section>

          {/* Fee structure */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              RealT Fee Structure
            </h2>
            <div className="space-y-2.5">
              {[
                { fee: "Property management fee", amount: "8–12% of gross rent", note: "Charged monthly, deducted before payouts" },
                { fee: "Property tax", amount: "Varies by city", note: "Deducted from gross rent — shown in property details" },
                { fee: "Insurance", amount: "Varies by property", note: "Landlord insurance, included in fee breakdown" },
                { fee: "Platform purchase fee", amount: "0%", note: "No fee to buy tokens on primary market" },
                { fee: "Secondary market / gas", amount: "Variable", note: "Ethereum gas fees when trading on Uniswap" },
                { fee: "Holding fee", amount: "0%", note: "No ongoing platform fee for holding tokens" },
              ].map((row, i) => (
                <div key={row.fee} className="flex items-start gap-4 rounded-[10px] px-5 py-3.5" style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", border: "1px solid #2A2420" }}>
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>{row.fee}</div>
                    <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>{row.note}</div>
                  </div>
                  <div className="text-[12px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6" }}>{row.amount}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Pros & cons */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              RealT Pros and Cons
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-[10px] p-5" style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-3" style={{ color: "#22c55e" }}>Pros</div>
                <div className="space-y-2.5">
                  {[
                    "Largest tokenized RE platform by property count",
                    "ERC-20 tokens — DeFi integrations (Aave, Uniswap)",
                    "Weekly USDC payouts — predictable income",
                    "Operating since 2019 — established track record",
                    "Strong transparency — detailed property financials",
                    "Broad geographic diversity (40+ US cities)",
                  ].map((p) => (
                    <div key={p} className="flex items-start gap-2">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[12px] leading-[1.5]" style={{ color: "rgba(242,237,230,0.6)" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[10px] p-5" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-3" style={{ color: "#f59e0b" }}>Cons</div>
                <div className="space-y-2.5">
                  {[
                    "Lower liquidity vs Lofty — no PMM mechanism",
                    "Ethereum gas fees when trading tokens",
                    "Higher minimum investment (~$50–200+ per token)",
                    "Limited non-US investor access on some properties",
                    "No daily payouts (Lofty pays daily)",
                    "Property vacancies can drop income to $0",
                  ].map((c) => (
                    <div key={c} className="flex items-start gap-2">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M3 3l6 6M9 3l-6 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[12px] leading-[1.5]" style={{ color: "rgba(242,237,230,0.6)" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Verdict */}
          <section>
            <h2 className="text-[20px] font-normal mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Verdict: Who Should Invest on RealT?
            </h2>
            <p className="text-[14px] leading-[1.7] mb-3" style={{ color: "rgba(242,237,230,0.65)" }}>
              RealT is best suited for investors who want <strong style={{ color: "#F2EDE6" }}>broad geographic diversification</strong> across many US cities, are comfortable with Ethereum and DeFi, and want to integrate their real estate holdings into a broader crypto portfolio (using tokens as Aave collateral, for example).
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(242,237,230,0.65)" }}>
              If you prioritize liquidity, smaller minimums, or daily income, consider also looking at Lofty. Many investors hold both platforms to balance the tradeoffs.
            </p>
            <div className="mt-4 rounded-[10px] px-5 py-4 flex items-center gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div className="text-[28px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#3b82f6" }}>{avgScore}</div>
              <div>
                <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>Average Brickwise Score</div>
                <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>Across all {count} RealT properties · 0–100 scale</div>
              </div>
            </div>
          </section>

          {/* Email capture */}
          <EmailCaptureWidget source="realt_review" />

          {/* FAQ */}
          <section>
            <h2 className="text-[20px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                { q: "Is RealT a legitimate investment platform?", a: "Yes. RealT has been operating since 2019 and holds properties through Delaware LLCs, giving investors legal ownership. It is one of the most established tokenized real estate platforms." },
                { q: "What yields does RealT offer?", a: `Based on Brickwise data tracking ${count} RealT properties, the average net yield is ${avgYield}%, with top properties reaching ${maxYield}%. Yields are after management fees, property tax, and insurance.` },
                { q: "How does RealT pay investors?", a: "Weekly USDC payouts to your connected Ethereum wallet, proportional to your token ownership." },
                { q: "How liquid are RealT tokens?", a: "Tokens can be sold on the RealT Marketplace or on Uniswap. Liquidity varies by property. Lofty's PMM mechanism generally offers better short-term liquidity." },
                { q: "What fees does RealT charge?", a: "Property management ~8–12% of gross rent, plus property tax and insurance. No platform holding fee. Gas fees may apply when trading on Ethereum." },
              ].map((faq, i) => (
                <div key={i} className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <h3 className="text-[13px] font-semibold mb-2" style={{ color: "#F2EDE6" }}>{faq.q}</h3>
                  <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Related */}
        <div className="mt-8 mb-6">
          <div className="text-[11px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>Continue reading</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "RealT vs Lofty: Full Platform Comparison", href: "/compare/realt-vs-lofty", tag: "Comparison" },
              { title: "Browse All RealT Properties — Filter by Yield", href: "/analyzer", tag: "Tool" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="no-underline block">
                <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: "#3b82f6" }}>{link.tag}</div>
                  <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>{link.title} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>Analyze all {count} RealT properties</div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Filter by yield, risk score, city, and buy signal. No signup required.
            </div>
          </div>
          <Link
            href="/analyzer"
            className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85 flex-shrink-0"
            style={{ background: "#3b82f6", color: "#fff" }}
          >
            Browse RealT Properties →
          </Link>
        </div>

        <p className="mt-6 text-[10px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.25)" }}>
          This review is for educational purposes only. Not financial advice. Yield data is sourced from Brickwise's live property database and may not reflect current figures. Always conduct your own research.
        </p>
      </div>
      <StickyLearnCta label="sticky-cta-realt-review" />
    </AppShell>
  );
}
