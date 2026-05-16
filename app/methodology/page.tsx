import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";

export const metadata: Metadata = {
  title: { absolute: "Methodology — How Brickwise Scores Tokenized Real Estate" },
  description:
    "How Brickwise scores tokenized rental properties on Lofty and RealT. Public weights, public inputs, no platform affiliation. 0 to 100 composite score.",
  alternates: { canonical: "https://brickwise.pro/methodology" },
  openGraph: {
    title: "Brickwise Scoring Methodology — Tokenized Real Estate",
    description:
      "Public scoring methodology for tokenized real estate. Composite 0 to 100 across yield, risk, neighborhood, and fair value. Updated daily.",
    type: "article",
    url: "https://brickwise.pro/methodology",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Brickwise Scores Tokenized Real Estate",
  "description":
    "Public scoring methodology for tokenized rental real estate on Lofty and RealT. Composite 0 to 100 across yield (30%), risk (25%), neighborhood (20%), and fair value (25%).",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": {
    "@type": "Organization",
    "name": "Brickwise",
    "url": "https://brickwise.pro",
    "logo": { "@type": "ImageObject", "url": "https://brickwise.pro/favicon.svg" },
  },
  "url": "https://brickwise.pro/methodology",
  "mainEntityOfPage": "https://brickwise.pro/methodology",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Brickwise score tokenized real estate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Brickwise scores every tokenized rental property on Lofty and RealT using a 0 to 100 composite. The weights are yield 30%, risk 25%, neighborhood quality 20%, and fair value 25%. Each input is computed from platform data and verified against primary sources where possible.",
      },
    },
    {
      "@type": "Question",
      "name": "What does a Buy, Hold, or Avoid label mean on Brickwise?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Buy means fundamentals justify entering at the current token price. Hold means the property is fine but not the best use of fresh capital. Avoid means occupancy, yield, fair value, or risk disqualifies the listing. Action labels are derived from the composite score and the underlying components, not assigned by hand.",
      },
    },
    {
      "@type": "Question",
      "name": "How often does Brickwise update scores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Property data is refreshed regularly. Scores are recomputed on every refresh. The methodology itself is audited monthly. Material changes to the methodology are logged publicly with a date.",
      },
    },
    {
      "@type": "Question",
      "name": "Does Brickwise take money from Lofty or RealT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Brickwise earns a referral fee when a reader signs up to Lofty or RealT through an affiliate link. Referral revenue does not influence scoring, ranking, or coverage decisions. If a platform deserves a negative call, we make it.",
      },
    },
    {
      "@type": "Question",
      "name": "What can the score not tell me?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The score does not predict future tenant behavior, macro housing market shifts, platform operational risk (regulatory or custody), tax outcomes in your jurisdiction, or secondary market liquidity at the time you choose to sell. It is a structured snapshot of fundamentals, not a guarantee.",
      },
    },
  ],
};

export default function MethodologyPage() {
  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-12">
        <header className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            Methodology
          </div>
          <h1
            className="text-[34px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            How we score tokenized real estate
          </h1>
          <p className="text-[14px] mt-3 leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>
            The public scoring rules behind every Brickwise rating. Read this before trusting any score on the site.
          </p>
        </header>

        <section className="space-y-5 text-[15px] leading-[1.75]" style={{ color: "rgba(242,237,230,0.78)" }}>
          <p>
            Brickwise scores every tokenized rental property on{" "}
            <a href="https://lofty.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#F2EDE6", textDecoration: "underline" }}>Lofty</a>{" "}
            and{" "}
            <a href="https://realt.co" target="_blank" rel="noopener noreferrer" style={{ color: "#F2EDE6", textDecoration: "underline" }}>RealT</a>{" "}
            on a 0 to 100 composite. {PROPERTIES.length} properties are currently scored. Data is refreshed regularly; scores recompute on every refresh.
          </p>

          {/* The composite */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            The composite score (0 to 100)
          </h2>
          <p>
            Every property gets a single overall score from a weighted blend of four components:
          </p>
          <div
            className="rounded-[10px] overflow-hidden my-4"
            style={{ border: "1px solid #2A2420", background: "#131109" }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
                  <th className="text-left px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                    Component
                  </th>
                  <th className="text-right px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { component: "Yield", weight: "30%" },
                  { component: "Risk", weight: "25%" },
                  { component: "Fair value", weight: "25%" },
                  { component: "Neighborhood quality", weight: "20%" },
                ].map((row, i) => (
                  <tr key={row.component} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #252018" }}>
                    <td className="px-5 py-3 text-[13px] font-medium" style={{ color: "#F2EDE6" }}>
                      {row.component}
                    </td>
                    <td
                      className="px-5 py-3 text-[13px] font-semibold text-right"
                      style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
                    >
                      {row.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Yield carries the most weight because it is the primary economic case for buying a token. Risk and fair value carry near-equal weight because either one can make a high-yield property a bad buy. Neighborhood quality is a smaller but persistent signal we have found does not show up cleanly in the other three.
          </p>

          {/* Yield */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Yield (30%)
          </h2>
          <p>
            Yield is reported as <strong>net</strong> annualized return, not gross. We deduct property management fees, insurance, and property tax from the gross rental income before computing the yield. This is the number that actually lands in your wallet, not the marketing number.
          </p>
          <p>
            We do not adjust for vacancy in this number. Vacancy risk shows up in the Risk component. A property that pays 14% gross yield but sits vacant 30% of the year is scored honestly in our composite, even though the platform listing may quote the gross figure.
          </p>

          {/* Risk */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Risk (25%)
          </h2>
          <p>
            Risk combines four sub-signals into a single 0 to 100 score:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Vacancy history.</strong> How often the property has been listed as vacant over the past 12 months.</li>
            <li><strong>Tenant turnover.</strong> Frequency of new leases relative to comparable properties in the same city.</li>
            <li><strong>Building age and condition.</strong> Older stock and properties flagged for major repairs score lower.</li>
            <li><strong>Distribution stability.</strong> Whether rent payouts have arrived on schedule and at the listed rate.</li>
          </ul>
          <p>
            Higher yields very often correlate with higher risk. Many of our lowest-rated properties have the highest gross yields. The composite is designed to surface this honestly rather than pump the yield number in isolation.
          </p>

          {/* Fair value */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Fair value (25%)
          </h2>
          <p>
            Fair value estimates whether the current token price is below, at, or above what the underlying property is worth on a per-token basis. We use a hedonic model trained on the platforms&apos; own historical price-per-rent relationships, cross-checked against comparable rentals in the same city.
          </p>
          <p>
            A property tagged <strong>undervalued</strong> has a token price below our fair-value estimate by 5% or more. <strong>Fairly priced</strong> is within plus or minus 5%. <strong>Overvalued</strong> is 5% or more above our estimate. Fair value is the single hardest component to estimate well, especially on illiquid listings, so we publish a confidence rating alongside it on every property page.
          </p>

          {/* Neighborhood */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Neighborhood quality (20%)
          </h2>
          <p>
            Neighborhood combines US Census tract data, local crime statistics, school ratings, and walkability into a 0 to 100 score per address. Two properties on the same street get the same neighborhood score. Two properties three blocks apart can differ significantly, because crime, school district lines, and zoning often shift across short distances in the Midwest cities where these platforms concentrate.
          </p>
          <p>
            Neighborhood is a smaller weight than yield or risk because it is, in practice, slow-moving. A neighborhood that scores well today is very likely to score well in 12 months. Yield, risk, and fair value all move faster.
          </p>

          {/* Action label */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            How Buy, Hold, and Avoid are decided
          </h2>
          <p>
            The composite score drives a single action label visible on every property and ranking page:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Buy</strong> is reserved for properties where the composite is 80 or higher AND no single component is critically low (typically below 50). A high overall score with one rotten dimension does not earn a Buy.</li>
            <li><strong>Hold</strong> covers the 65 to 79 range, or properties scoring 80+ but with one component below 50. These are fine investments to keep, but not the best use of fresh capital.</li>
            <li><strong>Avoid</strong> applies below 65, or where occupancy, fair value, or risk disqualify the listing regardless of the composite.</li>
          </ul>
          <p>
            The thresholds are conservative on purpose. The brand voice is anti-hype: a 30%-yield property that scores 78/100 will not get a Buy label even though it is theoretically attractive on the yield dimension alone.
          </p>

          {/* Confidence */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Confidence vs score
          </h2>
          <p>
            Score tells you how good a property looks. Confidence tells you how sure we are. They are different numbers and they are both displayed.
          </p>
          <p>
            A property with a score of 84 and a confidence of <strong>High</strong> is one we have verified against multiple primary sources (county records, comparable rentals, on-platform listing). A property with a score of 84 and a confidence of <strong>Medium</strong> may have one input we have not yet been able to verify outside the platform&apos;s own listing. Always check confidence before acting on a score.
          </p>

          {/* Data sources */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Data sources
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Platform listings.</strong> Lofty and RealT publish per-property data we ingest manually.</li>
            <li><strong>County records.</strong> Deed records, property tax records, and zoning lookups, where the county exposes them.</li>
            <li><strong>Comparable rentals.</strong> Public listings on Zillow, Redfin, and local MLS aggregators for matching units within a small radius.</li>
            <li><strong>US Census data.</strong> Tract-level income, demographics, and housing data via the American Community Survey.</li>
            <li><strong>Crime data.</strong> Where exposed by city or county open-data portals.</li>
            <li><strong>Manual verification.</strong> Source-verified listings carry a visible badge on the site.</li>
          </ul>
          <p>
            We do not use scrapers. We do not use synthetic data. We do not buy data from third-party aggregators that themselves scrape. If we cannot verify a number, it does not enter the score with full weight.
          </p>

          {/* Cadence */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Update cadence
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Daily.</strong> Platform-level data (token prices, occupancy flags, distribution status). Scores recompute on every refresh.</li>
            <li><strong>Weekly.</strong> Manual review of new listings. Inclusion of new properties in the dataset.</li>
            <li><strong>Monthly.</strong> Methodology audit. Any changes to weights, thresholds, or scoring components are logged here with a date.</li>
          </ul>

          {/* Independence */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Why we publish this
          </h2>
          <p>
            Neither Lofty nor RealT can publish independent third-party analysis of themselves. No commercial competitor has built one. Publishing our weights and inputs is the only way to make scoring trustworthy: anyone can audit how we got from raw data to a 0 to 100 number on a specific property.
          </p>
          <p>
            Brickwise earns a referral fee when readers sign up to Lofty or RealT via our affiliate links on the platform pages. Referral revenue does not influence scoring, ranking, or coverage decisions. The full affiliate disclosure lives on the{" "}
            <Link href="/about" style={{ color: "#F2EDE6", textDecoration: "underline" }}>About page</Link>.
          </p>

          {/* Limitations */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            What the score will not tell you
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Future tenant behavior. A great score today does not guarantee on-time rent next year.</li>
            <li>Macro housing market shifts. Property values move with rates, regional economy, and policy.</li>
            <li>Platform operational risk. Regulatory action, custody mistakes, or platform shutdown all sit outside the score.</li>
            <li>Liquidity at sell time. The secondary market for any specific token may be thin when you decide to exit.</li>
            <li>Tax outcomes. Tokenized rental income is taxed differently in different jurisdictions; the score does not account for this.</li>
          </ul>
          <p>
            The score is a structured snapshot of fundamentals at a point in time. It is not financial advice and it is not a substitute for reading the platform&apos;s own SPV documents before investing.
          </p>

          {/* Corrections */}
          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Corrections and disputes
          </h2>
          <p>
            If you spot a mistake on any property page, or you have data we should be using and are not, the{" "}
            <Link href="/contact" style={{ color: "#F2EDE6", textDecoration: "underline" }}>contact page</Link>{" "}
            goes straight to the maintainer. Material corrections appear on the affected property page with a visible change note and a date.
          </p>

          <div className="pt-6 mt-10" style={{ borderTop: "1px solid #242018" }}>
            <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.55)" }}>
              See also: the{" "}
              <Link href="/about" style={{ color: "#F2EDE6", textDecoration: "underline" }}>about page</Link>,
              the{" "}
              <Link href="/analyzer" style={{ color: "#F2EDE6", textDecoration: "underline" }}>property analyzer</Link>, and the{" "}
              <Link href="/" style={{ color: "#F2EDE6", textDecoration: "underline" }}>current buy and avoid signals</Link>.
            </p>
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
