import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";

export const metadata: Metadata = {
  title: { absolute: "About Brickwise — Independent Real Estate Analytics" },
  description:
    "Brickwise is an independent analytics platform scoring tokenized real estate on Lofty and RealT. Curated by hand, no scrapers, no synthetic data.",
  alternates: { canonical: "https://brickwise.pro/about" },
  openGraph: {
    title: "About Brickwise — Independent Tokenized Real Estate Analytics",
    description:
      "An independent yield, risk and fair-value analytics platform for tokenized property tokens on Lofty and RealT.",
    type: "website",
    url: "https://brickwise.pro/about",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Brickwise",
  "url": "https://brickwise.pro/about",
  "mainEntity": { "@id": "https://brickwise.pro/#organization" },
};

export default function AboutPage() {
  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-12">
        <header className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            About Brickwise
          </div>
          <h1
            className="text-[34px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Independent analytics for tokenized real estate
          </h1>
        </header>

        <section className="space-y-5 text-[15px] leading-[1.75]" style={{ color: "rgba(242,237,230,0.78)" }}>
          <p>
            <strong style={{ color: "#F2EDE6" }}>Brickwise</strong> is an independent analytics platform that
            scores tokenized real estate tokens on Lofty and RealT. We track {PROPERTIES.length} properties manually,
            score each one for yield, risk, neighborhood quality and fair value, and publish a clear buy / hold /
            avoid signal updated daily.
          </p>
          <p>
            We are not a brokerage, exchange or token issuer. We don&apos;t custody assets and we don&apos;t take
            payment from the platforms we cover. Our coverage is curated by hand. No scrapers, no synthetic
            data, no platform partnerships that bias which properties surface in our rankings.
          </p>

          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Who runs this
          </h2>
          <p>
            Brickwise is built and maintained by one person from Amsterdam, not an agency or a team of analysts. Every property score is reviewed manually before it ships. Every change to the scoring methodology is logged. If you spot a mistake, the{" "}
            <Link href="/contact" style={{ color: "#F2EDE6", textDecoration: "underline" }}>contact page</Link>{" "}
            goes straight to me, not a support queue.
          </p>

          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            How we score
          </h2>
          <p>
            Every property gets a 0 to 100 overall score combining four dimensions: <strong>yield</strong>{" "}
            (net of property management, insurance and tax), <strong>risk</strong> (vacancy history, neighborhood
            grade, building age), <strong>fair value</strong> (token price relative to underlying property and
            comparable rentals), and <strong>confidence</strong> (how much underlying data we&apos;ve verified
            against primary sources). For the full weighting breakdown and each input, see the{" "}
            <Link href="/methodology" style={{ color: "#F2EDE6", textDecoration: "underline" }}>methodology page</Link>.
          </p>
          <p>
            The score drives a single action label: <strong>Buy</strong> when fundamentals justify entering at the
            current token price, <strong>Hold</strong> when the property is fine but not the best use of fresh
            capital, and <strong>Avoid</strong> when occupancy, yield, or fair value disqualify it.
          </p>

          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Editorial principles
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Methodology is published. Every score component is documented on the property page.</li>
            <li>Data is source-verified against platform listings, deed records, and rent comparables.</li>
            <li>We do not accept payment from platforms or token issuers in exchange for coverage or ranking.</li>
            <li>Mistakes get corrected with a visible change note on the affected property.</li>
          </ul>

          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Affiliate disclosure
          </h2>
          <p>
            Brickwise earns a referral fee when readers sign up to Lofty or RealT through our affiliate links on the platform pages. We disclose this on every comparison and platform review page. Affiliate revenue does not influence which properties surface in our rankings, which scores are assigned, or which platforms get covered. If a platform is bad, we will say so regardless of whether they pay referrals.
          </p>

          <h2
            className="text-[22px] font-normal mt-10 mb-3 leading-[1.2]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Not financial advice
          </h2>
          <p>
            Tokenized real estate carries property-level risk (vacancy, maintenance, value loss), platform
            operational risk, and liquidity risk. Brickwise scores are analytics, not recommendations to transact.
            Always verify the underlying property and platform terms before investing.
          </p>

          <div className="pt-6 mt-10" style={{ borderTop: "1px solid #242018" }}>
            <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.55)" }}>
              Questions, corrections, or press? See our{" "}
              <Link href="/contact" style={{ color: "#F2EDE6", textDecoration: "underline" }}>
                contact page
              </Link>
              .
            </p>
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
