import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import {
  ALGORAND_PROJECTS,
  ALGORAND_TOTAL_COUNT,
  getAlgorandCategories,
  getFeaturedProjects,
} from "@/lib/algorand";
import { ProjectList } from "@/components/algorand/project-list";
import { ProjectLogo } from "@/components/algorand/project-logo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Algorand Ecosystem (${ALGORAND_TOTAL_COUNT}+ Projects) — DeFi, NFTs, Wallets, RWA | Brickwise`,
  description: `Discover ${ALGORAND_TOTAL_COUNT}+ projects across the Algorand ecosystem — wallets, DEXs, DeFi, NFT marketplaces, infrastructure, and developer tooling. Curated and updated by Brickwise.`,
  keywords: [
    "Algorand ecosystem",
    "Algorand projects",
    "Algorand DeFi",
    "Algorand NFT",
    "Algorand wallets",
    "Algorand infrastructure",
    "Algorand AI",
    "Algorand DEX",
    "Algorand RWA",
    "Algorand AVM",
    "Algorand developer tools",
  ],
  openGraph: {
    title: `Algorand Ecosystem — ${ALGORAND_TOTAL_COUNT}+ Projects Tracked | Brickwise`,
    description: `Wallets, DEXs, DeFi, NFT marketplaces, infrastructure, and tooling across the Algorand ecosystem.`,
    type: "website",
    url: "https://brickwise.pro/algorand",
  },
  alternates: { canonical: "https://brickwise.pro/algorand" },
};

const ecosystemSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Algorand Ecosystem",
  url: "https://brickwise.pro/algorand",
  description:
    "Curated directory of Algorand ecosystem projects — wallets, DeFi, NFTs, infrastructure, and tooling.",
  inLanguage: "en",
  hasPart: ALGORAND_PROJECTS.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.name,
    url: `https://brickwise.pro/algorand/${p.slug}`,
    applicationCategory: p.category,
    operatingSystem: "Web",
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://brickwise.pro" },
    { "@type": "ListItem", position: 2, name: "Algorand Ecosystem", item: "https://brickwise.pro/algorand" },
  ],
};

export default function AlgorandEcosystemPage() {
  const featured = getFeaturedProjects(6);
  const categories = getAlgorandCategories();

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ecosystemSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14" style={{ color: "rgba(255,255,255,0.9)" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Link href="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.85)" }}>Algorand Ecosystem</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.7px] px-2.5 py-1 rounded-[6px] mb-4"
            style={{ background: "rgba(59, 130, 246, 0.12)", color: "#60A5FA" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA" }} />
            Algorand · {ALGORAND_TOTAL_COUNT} projects
          </span>
          <h1
            className="text-[40px] sm:text-[52px] font-bold tracking-[-1.5px] leading-[1.05] mb-4"
            style={{ color: "#FFFFFF", fontFamily: "var(--font-dm-serif)" }}
          >
            The Algorand <span style={{ color: "#60A5FA" }}>ecosystem,</span> indexed.
          </h1>
          <p className="text-[16px] leading-[1.6] max-w-[640px]" style={{ color: "rgba(255,255,255,0.65)" }}>
            Wallets, DEXs, DeFi protocols, NFT marketplaces, oracle networks, dev tooling, and real-world-asset platforms — curated and updated by Brickwise. No paid placements, no fluff.
          </p>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Featured
              </h2>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Curated by Brickwise
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/algorand/${p.slug}`}
                  className="rounded-[12px] p-5 no-underline flex flex-col gap-3 transition-colors"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ProjectLogo name={p.name} logoUrl={p.logoUrl} size={48} rounded={12} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold truncate" style={{ color: "#FFFFFF" }}>{p.name}</div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.5px]" style={{ color: "rgba(96, 165, 250, 0.9)" }}>
                        {p.category}
                      </div>
                    </div>
                  </div>
                  <p className="text-[12.5px] leading-[1.55] line-clamp-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {p.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Full list with filters */}
        <div>
          <h2 className="text-[14px] font-semibold uppercase tracking-[0.6px] mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            All projects
          </h2>
          <ProjectList projects={ALGORAND_PROJECTS} categories={categories} />
        </div>

        {/* Submission CTA */}
        <div
          className="mt-12 rounded-[12px] p-6 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-[16px] font-semibold mb-1" style={{ color: "#FFFFFF" }}>
            Building on Algorand?
          </h3>
          <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            We&apos;re adding projects continuously. Reach out on X to get yours listed.
          </p>
          <a
            href="https://twitter.com/BrickwisePro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-semibold no-underline transition-opacity hover:opacity-90"
            style={{ background: "#FFFFFF", color: "#0A0A0F" }}
          >
            Reach out on X →
          </a>
        </div>
      </div>
    </PublicShell>
  );
}
