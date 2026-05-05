import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";

export const revalidate = 3600;

const slugify = (city: string) => city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export async function generateStaticParams() {
  const cities = [...new Set(PROPERTIES.map((p) => p.city))];
  return cities.map((city) => ({ city: slugify(city) }));
}

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cityName = PROPERTIES.find((p) => slugify(p.city) === citySlug)?.city;
  if (!cityName) return {};

  const cityProps = PROPERTIES.filter((p) => p.city === cityName);
  const avgYield = +(cityProps.reduce((s, p) => s + p.expectedYield, 0) / cityProps.length).toFixed(1);
  const buyCount = cityProps.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
  const platforms = [...new Set(cityProps.map((p) => p.platform))];

  return {
    title: `${cityName} Tokenized Real Estate — ${cityProps.length} Properties Ranked by Yield | Brickwise`,
    description: `${cityProps.length} tokenized real estate properties in ${cityName} across ${platforms.join(" and ")}. Average yield ${avgYield}%. ${buyCount} active buy signals. Ranked by score, risk-rated, and fair-value flagged.`,
    keywords: [
      `tokenized real estate ${cityName.toLowerCase()}`,
      `${cityName.toLowerCase()} real estate tokens`,
      `realt ${cityName.toLowerCase()} properties`,
      `fractional real estate ${cityName.toLowerCase()}`,
      `${cityName.toLowerCase()} rental income tokens`,
      `best tokenized properties ${cityName.toLowerCase()}`,
      `${cityName.toLowerCase()} real estate yield`,
      "tokenized real estate",
    ],
    openGraph: {
      title: `${cityName} Tokenized Real Estate: ${cityProps.length} Properties Ranked | Brickwise`,
      description: `All ${cityProps.length} tokenized real estate properties in ${cityName}. Average ${avgYield}% yield. ${buyCount} active buy signals. Updated regularly.`,
      type: "website",
      url: `https://brickwise.pro/city/${citySlug}`,
    },
    alternates: { canonical: `https://brickwise.pro/city/${citySlug}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const cityName = PROPERTIES.find((p) => slugify(p.city) === citySlug)?.city;
  if (!cityName) notFound();

  const cityProps = PROPERTIES.filter((p) => p.city === cityName);
  if (cityProps.length === 0) notFound();

  const sorted = [...cityProps].sort((a, b) => b.overallScore - a.overallScore);

  const avgYield = +(cityProps.reduce((s, p) => s + p.expectedYield, 0) / cityProps.length).toFixed(1);
  const maxYield = +Math.max(...cityProps.map((p) => p.expectedYield)).toFixed(1);
  const avgScore = Math.round(cityProps.reduce((s, p) => s + p.overallScore, 0) / cityProps.length);
  const buyCount = cityProps.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
  const lowRiskCount = cityProps.filter((p) => p.risk === "Low").length;
  const undervaluedCount = cityProps.filter((p) => p.fairValueStatus === "undervalued").length;
  const platforms = [...new Set(cityProps.map((p) => p.platform))];
  const platformCounts = Object.fromEntries(platforms.map((pl) => [pl, cityProps.filter((p) => p.platform === pl).length]));

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Tokenized Real Estate Properties in ${cityName}`,
    "description": `Analytics and yield data for all ${cityProps.length} tokenized real estate properties listed in ${cityName} across ${platforms.join(" and ")} platforms.`,
    "url": `https://brickwise.pro/city/${citySlug}`,
    "creator": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
    "variableMeasured": ["yield", "token price", "occupancy rate", "fair value score", "overall score"],
    "numberOfItems": cityProps.length,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Cities", "item": "https://brickwise.pro/city" },
      { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://brickwise.pro/city/${citySlug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How many tokenized real estate properties are available in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Brickwise currently tracks ${cityProps.length} tokenized real estate properties in ${cityName} across ${platforms.join(" and ")}. ${buyCount} of these currently have an active buy signal based on yield, score, and fair-value analysis.`,
        },
      },
      {
        "@type": "Question",
        "name": `What is the average yield for tokenized real estate in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The average net yield across all ${cityProps.length} tracked properties in ${cityName} is ${avgYield}%, with the highest individual property yield at ${maxYield}%. ${lowRiskCount} properties are rated Low risk.`,
        },
      },
      {
        "@type": "Question",
        "name": `Which platform has the most properties in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": platforms.map((pl) => `${pl} has ${platformCounts[pl]} properties`).join(". ") + ` in ${cityName}.`,
        },
      },
    ],
  };

  return (
    <AppShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[1100px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.4)" }}>Cities</span>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            City Analysis
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-normal leading-[1.1] tracking-[-0.4px] mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            {cityName} Tokenized Real Estate
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.5)" }}>
            {cityProps.length} properties across {platforms.join(" and ")} — ranked by overall score
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 rounded-[12px] overflow-hidden mb-6"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Properties", value: String(cityProps.length) },
            { label: "Avg yield", value: `${avgYield}%`, green: true },
            { label: "Max yield", value: `${maxYield}%` },
            { label: "Avg score", value: `${avgScore}/100` },
            { label: "Buy signals", value: String(buyCount), accent: true },
            { label: "Low risk", value: `${lowRiskCount} (${Math.round((lowRiskCount / cityProps.length) * 100)}%)` },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div
                className="text-[15px] font-semibold leading-none"
                style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : s.accent ? "#3b82f6" : "#F2EDE6" }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Platform distribution */}
        {platforms.length > 1 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            {platforms.map((pl) => {
              const count = platformCounts[pl];
              const color = pl === "RealT" ? "#3b82f6" : "#f97316";
              return (
                <div key={pl} className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-[6px]" style={{ background: "#131109", border: `1px solid ${color}30` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span style={{ color: "#F2EDE6" }}>{pl}</span>
                  <span style={{ color: "rgba(242,237,230,0.4)" }}>{count} properties</span>
                </div>
              );
            })}
            {undervaluedCount > 0 && (
              <div className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-[6px]" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                <span style={{ color: "#4ade80" }}>{undervaluedCount} undervalued</span>
              </div>
            )}
          </div>
        )}

        {/* Property list */}
        <div className="rounded-[12px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
          {/* Table header */}
          <div className="grid gap-0 px-5 py-2.5" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px" }}>
            {["Property", "Yield", "Score", "Risk", "Status", "Signal"].map((h) => (
              <div key={h} className="text-[9px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.35)" }}>{h}</div>
            ))}
          </div>

          {sorted.map((p, i) => {
            const rec = getRecommendation(p, PROPERTIES);
            const recColor = rec.action === "Buy" ? "#22c55e" : rec.action === "Avoid" ? "#ef4444" : "#f59e0b";
            const platformColor = p.platform === "RealT" ? "#3b82f6" : "#f97316";

            return (
              <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                <div
                  className="grid gap-0 px-5 py-3.5 hover:bg-[#1a1611] transition-colors"
                  style={{
                    background: i % 2 === 0 ? "#131109" : "#0f0e0b",
                    borderBottom: "1px solid #252018",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
                    alignItems: "center",
                  }}
                >
                  {/* Name */}
                  <div className="min-w-0 pr-3">
                    <div className="text-[12px] font-semibold truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px]" style={{ color: platformColor }}>● {p.platform}</span>
                      {p.isNew && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>New</span>
                      )}
                    </div>
                  </div>

                  {/* Yield */}
                  <div>
                    <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{p.expectedYield}%</div>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(242,237,230,0.3)" }}>€{p.tokenPrice.toFixed(0)}/token</div>
                  </div>

                  {/* Score */}
                  <div>
                    <div className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: p.overallScore >= 80 ? "#22c55e" : p.overallScore >= 65 ? "#F2EDE6" : "#f59e0b" }}>
                      {p.overallScore}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(242,237,230,0.3)" }}>/ 100</div>
                  </div>

                  {/* Risk */}
                  <div>
                    <div
                      className="text-[10px] font-semibold inline-block px-1.5 py-0.5 rounded-[3px]"
                      style={{
                        background: p.risk === "Low" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                        color: p.risk === "Low" ? "#22c55e" : "#f59e0b",
                      }}
                    >
                      {p.risk}
                    </div>
                  </div>

                  {/* Fair value */}
                  <div>
                    <div
                      className="text-[10px] font-semibold"
                      style={{
                        color: p.fairValueStatus === "undervalued" ? "#22c55e" : p.fairValueStatus === "overpriced" ? "#ef4444" : "rgba(242,237,230,0.45)",
                      }}
                    >
                      {p.fairValueStatus === "undervalued" ? "Undervalued" : p.fairValueStatus === "overpriced" ? "Overpriced" : "Fair value"}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <div
                      className="text-[10px] font-bold px-2 py-1 rounded-[4px] text-center"
                      style={{ background: `${recColor}15`, color: recColor, border: `1px solid ${recColor}30` }}
                    >
                      {rec.action}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-8 mb-6">
          <h2 className="text-[18px] font-normal mb-4" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            About Tokenized Real Estate in {cityName}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: `How many tokenized real estate properties are available in ${cityName}?`,
                a: `Brickwise currently tracks ${cityProps.length} tokenized real estate properties in ${cityName} across ${platforms.join(" and ")}. ${buyCount} of these currently have an active buy signal.`,
              },
              {
                q: `What is the average yield for tokenized real estate in ${cityName}?`,
                a: `The average net yield across all tracked properties in ${cityName} is ${avgYield}%, with the highest individual yield at ${maxYield}%. ${lowRiskCount} of the ${cityProps.length} properties are rated Low risk.`,
              },
              {
                q: `Which platform has the most properties in ${cityName}?`,
                a: platforms.map((pl) => `${pl} has ${platformCounts[pl]} ${platformCounts[pl] === 1 ? "property" : "properties"}`).join(", ") + ` in ${cityName}.`,
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                <h3 className="text-[13px] font-semibold mb-2" style={{ color: "#F2EDE6" }}>{faq.q}</h3>
                <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.55)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related cities */}
        <div className="mb-6">
          <div className="text-[11px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>Other cities</div>
          <div className="flex flex-wrap gap-2">
            {[...new Set(PROPERTIES.map((p) => p.city))]
              .filter((c) => c !== cityName)
              .slice(0, 12)
              .map((c) => (
                <Link key={c} href={`/city/${slugify(c)}`} className="no-underline">
                  <span
                    className="inline-flex text-[11px] px-3 py-1.5 rounded-[6px] hover:opacity-80 transition-opacity"
                    style={{ background: "#131109", color: "rgba(242,237,230,0.55)", border: "1px solid #2A2420" }}
                  >
                    {c}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
              Compare with the full analyzer
            </div>
            <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Filter by city, platform, yield, and risk across all {PROPERTIES.length} properties.
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              href="/analyzer"
              className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85"
              style={{ background: "#22c55e", color: "#0A0907" }}
            >
              Open Analyzer →
            </Link>
            <Link
              href="/compare/realt-vs-lofty"
              className="text-[13px] font-medium px-4 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(242,237,230,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              RealT vs Lofty
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
