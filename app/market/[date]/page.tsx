import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

interface MarketUpdate {
  date: string;
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
  stats: {
    totalListings: number;
    avgYield: number;
    avgScore: number;
    topYield: number;
    topYieldCity: string;
  };
  topProperties: {
    id: number;
    name: string;
    yield: number;
    score: number;
    city: string;
  }[];
}

const updates = marketUpdatesRaw as unknown as MarketUpdate[];

export function generateStaticParams() {
  return updates.map((u) => ({ date: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const u = updates.find((u) => u.slug === date);
  if (!u) return { title: "Report not found" };

  const monthYear = new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return {
    title: `${u.title} | Brickwise`,
    description:
      u.highlights.join(". ") +
      ". Tokenized real estate investment analysis on Lofty and RealT.",
    keywords: [
      `tokenized real estate ${date}`,
      `fractional property investment ${monthYear}`,
      "Lofty RealT market update",
      `real estate token yield ${u.stats.avgYield}%`,
      "tokenized property market analysis",
    ],
    openGraph: {
      title: u.title,
      description: u.highlights[0] || u.summary.slice(0, 150),
      type: "article",
    },
  };
}

export default async function MarketDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const u = updates.find((u) => u.slug === date);
  if (!u) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": u.title,
    "description": u.highlights[0] || "",
    "datePublished": u.date,
    "dateModified": u.date,
    "author": {
      "@type": "Organization",
      "name": "Brickwise",
      "url": "https://brickwise.pro",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Brickwise",
      "url": "https://brickwise.pro",
    },
    "url": `https://brickwise.pro/market/${u.slug}`,
    "keywords":
      "tokenized real estate, fractional property investment, Lofty, RealT, real estate yields",
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="px-6 lg:px-10 py-8 max-w-[720px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[12px]">
          <Link
            href="/market"
            className="no-underline transition-opacity hover:opacity-70"
            style={{ color: "#a3a3a3" }}
          >
            Market Reports
          </Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>{u.date}</span>
        </div>

        <h1
          className="text-[22px] font-bold tracking-[-0.5px] mb-5"
          style={{ color: "#111" }}
        >
          {u.title}
        </h1>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Listings tracked", value: String(u.stats.totalListings) },
            { label: "Avg net yield", value: `${u.stats.avgYield}%` },
            { label: "Avg score", value: `${u.stats.avgScore}/100` },
            {
              label: "Top yield",
              value: `${u.stats.topYield}% · ${u.stats.topYieldCity}`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[10px] p-4"
              style={{ border: "1px solid #ebebeb", background: "#fff" }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-1"
                style={{ color: "#a3a3a3" }}
              >
                {label}
              </div>
              <div
                className="text-[15px] font-bold"
                style={{
                  color: "#111",
                  fontFamily: "var(--font-dm-mono)",
                  wordBreak: "break-all",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div
          className="rounded-[10px] p-5 mb-4"
          style={{ border: "1px solid #ebebeb", background: "#f8fafc" }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-3"
            style={{ color: "#64748b" }}
          >
            Key highlights
          </div>
          <ul className="space-y-2">
            {u.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
                  style={{ background: "#16a34a" }}
                />
                <span
                  className="text-[13px] leading-[1.6]"
                  style={{ color: "#404040" }}
                >
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Commentary */}
        <div
          className="rounded-[10px] p-5 mb-6"
          style={{ border: "1px solid #ebebeb", background: "#fff" }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-3"
            style={{ color: "#a3a3a3" }}
          >
            Market commentary
          </div>
          {u.summary.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-[13px] leading-[1.8] mb-3 last:mb-0"
              style={{ color: "#404040" }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Top properties */}
        {u.topProperties.length > 0 && (
          <div className="mb-8">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.6px] mb-3"
              style={{ color: "#a3a3a3" }}
            >
              Top rated properties
            </div>
            <div className="space-y-2">
              {u.topProperties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/property/${prop.id}`}
                  className="flex items-center justify-between rounded-[10px] px-5 py-3.5 no-underline transition-opacity hover:opacity-80"
                  style={{ border: "1px solid #ebebeb", background: "#fff" }}
                >
                  <div>
                    <div
                      className="text-[13px] font-medium"
                      style={{ color: "#111" }}
                    >
                      {prop.name}
                    </div>
                    <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                      {prop.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[13px] font-bold"
                      style={{
                        color: "#16a34a",
                        fontFamily: "var(--font-dm-mono)",
                      }}
                    >
                      {prop.yield}%
                    </div>
                    <div className="text-[10px]" style={{ color: "#a3a3a3" }}>
                      Score {prop.score}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href="/market"
            className="text-[12px] no-underline"
            style={{ color: "#a3a3a3" }}
          >
            ← All market reports
          </Link>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Tokenized real estate market update — ${u.date}\n\n${u.stats.totalListings} listings · avg ${u.stats.avgYield}% yield · top ${u.stats.topYield}% in ${u.stats.topYieldCity}`)}&url=${encodeURIComponent(`https://brickwise.pro/market/${u.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] font-medium no-underline transition-opacity hover:opacity-80 px-3 py-2 rounded-[7px]"
            style={{ background: "#000", color: "#fff" }}
          >
            <svg width="11" height="11" viewBox="0 0 1200 1227" fill="none">
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284Z" fill="white" />
            </svg>
            Share
          </a>
        </div>
      </div>
    </PublicShell>
  );
}
