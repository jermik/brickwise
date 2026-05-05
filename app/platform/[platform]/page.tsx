import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";
import type { Platform } from "@/lib/types";

export const revalidate = 3600;

const PLATFORM_META: Record<
  string,
  { name: Platform; color: string; description: string; founded: string; blockchain: string; minInvestment: string; payoutFreq: string }
> = {
  realt: {
    name: "RealT",
    color: "#3b82f6",
    description: "The original tokenized real estate platform, founded in 2019. Largest property catalog on the Ethereum blockchain. Weekly USDC payouts with strong DeFi integrations.",
    founded: "2019",
    blockchain: "Ethereum (ERC-20)",
    minInvestment: "~$50–200+ / token",
    payoutFreq: "Weekly",
  },
  lofty: {
    name: "Lofty",
    color: "#f97316",
    description: "Self-described as the NASDAQ for Real Estate. Algorand-based with a $50 minimum, daily USDC payouts, and a Proactive Market Maker for near-instant liquidity.",
    founded: "2021",
    blockchain: "Algorand",
    minInvestment: "$50 flat",
    payoutFreq: "Daily",
  },
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export async function generateStaticParams() {
  const platforms = [...new Set(PROPERTIES.map((p) => slugify(p.platform)))];
  return platforms.map((platform) => ({ platform }));
}

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform: slug } = await params;
  const meta = PLATFORM_META[slug];
  const platformName = meta?.name ?? PROPERTIES.find((p) => slugify(p.platform) === slug)?.platform;
  if (!platformName) return {};

  const props = PROPERTIES.filter((p) => p.platform === platformName);
  const avgYield = props.length
    ? +(props.reduce((s, p) => s + p.expectedYield, 0) / props.length).toFixed(1)
    : 0;
  const buyCount = props.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;

  return {
    title: `${platformName} Properties — ${props.length} Tokenized Real Estate Investments | Brickwise`,
    description: `${props.length} ${platformName} tokenized real estate properties analyzed. Average net yield ${avgYield}%. ${buyCount} active Buy signals. Ranked by score, risk-rated, fair-value flagged.`,
    keywords: [
      `${platformName.toLowerCase()} properties`,
      `${platformName.toLowerCase()} tokenized real estate`,
      `${platformName.toLowerCase()} yield analysis`,
      `${platformName.toLowerCase()} investment review`,
      `best ${platformName.toLowerCase()} properties`,
      `${platformName.toLowerCase()} buy signal`,
      "tokenized real estate",
      "fractional real estate investing",
    ],
    openGraph: {
      title: `${platformName}: ${props.length} Tokenized Properties Ranked | Brickwise`,
      description: `All ${props.length} ${platformName} properties analyzed. Avg ${avgYield}% net yield, ${buyCount} Buy signals. Updated hourly.`,
      type: "website",
      url: `https://brickwise.pro/platform/${slug}`,
    },
    alternates: { canonical: `https://brickwise.pro/platform/${slug}` },
  };
}

export default async function PlatformPage({ params }: Props) {
  const { platform: slug } = await params;
  const meta = PLATFORM_META[slug];
  const platformName = meta?.name ?? (PROPERTIES.find((p) => slugify(p.platform) === slug)?.platform as Platform | undefined);
  if (!platformName) notFound();

  const props = PROPERTIES.filter((p) => p.platform === platformName);
  if (props.length === 0) notFound();

  const avgYield = +(props.reduce((s, p) => s + p.expectedYield, 0) / props.length).toFixed(1);
  const maxYield = +Math.max(...props.map((p) => p.expectedYield)).toFixed(1);
  const avgScore = Math.round(props.reduce((s, p) => s + p.overallScore, 0) / props.length);
  const buyCount = props.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
  const accentColor = meta?.color ?? "#22c55e";

  const topProps = [...props]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://brickwise.pro/platform/${slug}#webpage`,
    "name": `${platformName} Tokenized Real Estate Properties`,
    "url": `https://brickwise.pro/platform/${slug}`,
    "description": `${props.length} ${platformName} tokenized real estate properties analyzed for yield, risk, and fair value on Brickwise.`,
    "isPartOf": { "@id": "https://brickwise.pro/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
        { "@type": "ListItem", "position": 2, "name": "Platforms", "item": "https://brickwise.pro/analyzer" },
        { "@type": "ListItem", "position": 3, "name": platformName, "item": `https://brickwise.pro/platform/${slug}` },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": topProps.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://brickwise.pro/property/${p.id}`,
        "name": p.name,
      })),
    },
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="px-6 lg:px-10 py-8 max-w-[860px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px]" aria-label="Breadcrumb">
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Home</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <Link href="/analyzer" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.4)" }}>Analyzer</Link>
          <span style={{ color: "rgba(242,237,230,0.2)" }}>/</span>
          <span style={{ color: "rgba(242,237,230,0.7)" }}>{platformName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
            {platformName}
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-normal leading-[1.1] tracking-[-0.4px] mb-3" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            {platformName} Tokenized Real Estate Properties
          </h1>
          <p className="text-[14px] leading-[1.7] max-w-[560px]" style={{ color: "rgba(242,237,230,0.55)" }}>
            {meta?.description ?? `All ${props.length} ${platformName} properties analyzed for yield, risk, and fair value on Brickwise.`}
          </p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 rounded-[10px] overflow-hidden mb-8"
          style={{ border: "1px solid #2A2420", gap: 1, background: "#2A2420" }}
        >
          {[
            { label: "Properties", value: String(props.length) },
            { label: "Avg net yield", value: `${avgYield}%` },
            { label: "Top yield", value: `${maxYield}%` },
            { label: "Buy signals", value: String(buyCount) },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3" style={{ background: "#131109" }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
              <div className="text-[18px] font-bold leading-none" style={{ fontFamily: "var(--font-dm-mono)", color: accentColor }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Platform details */}
        {meta && (
          <div className="rounded-[10px] overflow-hidden mb-8" style={{ border: "1px solid #2A2420" }}>
            {[
              { label: "Founded", value: meta.founded },
              { label: "Blockchain", value: meta.blockchain },
              { label: "Min investment", value: meta.minInvestment },
              { label: "Payout frequency", value: meta.payoutFreq },
              { label: "Avg Brickwise score", value: `${avgScore} / 100` },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: i < 4 ? "1px solid #252018" : "none" }}
              >
                <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.5)" }}>{row.label}</span>
                <span className="text-[12px] font-semibold" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-mono)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top properties */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-normal" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
              Top {topProps.length} {platformName} Properties by Score
            </h2>
            <Link
              href={`/analyzer?platform=${platformName}`}
              className="text-[11px] font-medium no-underline hover:opacity-70 transition-opacity"
              style={{ color: accentColor }}
            >
              View all {props.length} →
            </Link>
          </div>
          <div className="space-y-2">
            {topProps.map((p, i) => {
              const rec = getRecommendation(p, PROPERTIES);
              const recColor = rec.action === "Buy" ? "#22c55e" : rec.action === "Hold" ? "#f59e0b" : "#ef4444";
              return (
                <Link key={p.id} href={`/property/${p.id}`} className="no-underline block">
                  <div
                    className="flex items-center gap-4 rounded-[10px] px-4 py-3.5 hover:bg-[#1a1611] transition-colors"
                    style={{ background: "#131109", border: "1px solid #2A2420" }}
                  >
                    <div className="text-[11px] font-bold w-5 text-center" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.3)" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate" style={{ color: "#F2EDE6" }}>{p.name}</div>
                      <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>{p.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: accentColor }}>
                        {p.expectedYield.toFixed(1)}%
                      </div>
                      <div className="text-[9px]" style={{ color: "rgba(242,237,230,0.35)" }}>net yield</div>
                    </div>
                    <div
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full min-w-[42px] text-center"
                      style={{ background: `${recColor}18`, color: recColor }}
                    >
                      {rec.action}
                    </div>
                    <div className="text-[12px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.5)" }}>
                      {p.overallScore}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Learn links */}
        {(slug === "realt" || slug === "lofty") && (
          <div className="mb-8">
            <div className="text-[11px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>Learn more about {platformName}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slug === "realt" && (
                <Link href="/learn/realt-review" className="no-underline block">
                  <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: accentColor }}>Review</div>
                    <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>RealT Review: Yields, Fees & Verdict →</div>
                  </div>
                </Link>
              )}
              {slug === "lofty" && (
                <Link href="/learn/lofty-review" className="no-underline block">
                  <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: accentColor }}>Review</div>
                    <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>Lofty Review: Yields, Fees & Verdict →</div>
                  </div>
                </Link>
              )}
              <Link href="/compare/realt-vs-lofty" className="no-underline block">
                <div className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors" style={{ background: "#131109", border: "1px solid #2A2420" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5" style={{ color: "rgba(242,237,230,0.4)" }}>Comparison</div>
                  <div className="text-[13px] font-medium" style={{ color: "#F2EDE6" }}>RealT vs Lofty: Full Comparison →</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className="rounded-[12px] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "#131109", border: "1px solid #2A2420" }}
        >
          <div>
            <div className="text-[14px] font-semibold mb-0.5" style={{ color: "#F2EDE6" }}>
              Filter all {props.length} {platformName} properties
            </div>
            <div className="text-[12px]" style={{ color: "rgba(242,237,230,0.45)" }}>
              Sort by yield, risk, fair value, and city. No signup required.
            </div>
          </div>
          <Link
            href="/analyzer"
            className="text-[13px] font-semibold px-5 py-2.5 rounded-[8px] no-underline transition-opacity hover:opacity-85 flex-shrink-0"
            style={{ background: accentColor, color: slug === "lofty" ? "#fff" : "#fff" }}
          >
            Open Analyzer →
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
