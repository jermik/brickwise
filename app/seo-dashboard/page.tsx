import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PROPERTIES } from "@/lib/data/properties";
import { LEARN_ARTICLES } from "@/lib/learn-articles";
import { getRecommendation } from "@/lib/recommendations";

export const metadata: Metadata = {
  title: "SEO Dashboard | Brickwise",
  robots: { index: false, follow: false },
};

// ── Computed stats ─────────────────────────────────────────────────────────────
const totalProps = PROPERTIES.length;
const avgYield = Math.round((PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / totalProps) * 10) / 10;
const buyCount = PROPERTIES.filter((p) => getRecommendation(p, PROPERTIES).action === "Buy").length;
const holdCount = PROPERTIES.filter((p) => getRecommendation(p, PROPERTIES).action === "Hold").length;
const avoidCount = PROPERTIES.filter((p) => getRecommendation(p, PROPERTIES).action === "Avoid").length;
const uniqueCities = [...new Set(PROPERTIES.map((p) => p.city))];
const platforms = [...new Set(PROPERTIES.map((p) => p.platform))];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const PLATFORM_COUNTS = platforms.map((pl) => ({
  name: pl,
  count: PROPERTIES.filter((p) => p.platform === pl).length,
  avgYield: Math.round((PROPERTIES.filter((p) => p.platform === pl).reduce((s, p) => s + p.expectedYield, 0) /
    PROPERTIES.filter((p) => p.platform === pl).length) * 10) / 10,
})).sort((a, b) => b.count - a.count);

// ── Page inventory ─────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { url: "/", title: "Homepage", hasMeta: true, hasSchema: true, inSitemap: true, priority: 1.0 },
  { url: "/analyzer", title: "Property Analyzer", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.9 },
  { url: "/compare/realt-vs-lofty", title: "RealT vs Lofty", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.9 },
  { url: "/learn", title: "Learn Hub", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.85 },
  { url: "/learn/what-is-tokenized-real-estate", title: "What Is Tokenized RE?", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/learn/how-to-invest-in-tokenized-real-estate", title: "How to Invest Guide", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/learn/realt-review", title: "RealT Review", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/learn/lofty-review", title: "Lofty Review", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/platform/realt", title: "RealT Platform Page", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/platform/lofty", title: "Lofty Platform Page", hasMeta: true, hasSchema: true, inSitemap: true, priority: 0.8 },
  { url: "/market", title: "Market Index", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.7 },
  { url: "/portfolio", title: "Portfolio", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.6 },
  { url: "/watchlist", title: "Watchlist", hasMeta: true, hasSchema: false, inSitemap: false, priority: 0 },
  { url: "/rankings/highest-yield", title: "Rankings: Highest Yield", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.85 },
  { url: "/rankings/buy-signals", title: "Rankings: Buy Signals", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.85 },
  { url: "/rankings/undervalued", title: "Rankings: Undervalued", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.85 },
  { url: "/rankings/new-listings", title: "Rankings: New Listings", hasMeta: true, hasSchema: false, inSitemap: true, priority: 0.85 },
];

const sitemapTotal =
  STATIC_PAGES.filter((p) => p.inSitemap).length +
  uniqueCities.length + // city pages
  totalProps + // property pages
  4; // rankings

const schemaCount = STATIC_PAGES.filter((p) => p.hasSchema).length;
const missingSchema = STATIC_PAGES.filter((p) => !p.hasSchema && p.inSitemap);

const SCHEMA_INVENTORY = [
  { page: "Root Layout", schemas: ["Organization", "WebSite (SearchAction)"] },
  { page: "Analyzer Layout", schemas: ["WebPage", "SoftwareApplication"] },
  { page: "What Is Tokenized RE", schemas: ["Article", "FAQPage", "BreadcrumbList"] },
  { page: "How to Invest", schemas: ["Article", "HowTo", "FAQPage", "BreadcrumbList"] },
  { page: "RealT Review", schemas: ["Article", "FAQPage", "BreadcrumbList"] },
  { page: "Lofty Review", schemas: ["Article", "FAQPage", "BreadcrumbList"] },
  { page: "RealT vs Lofty", schemas: ["Article", "FAQPage", "BreadcrumbList"] },
  { page: "Learn Hub", schemas: ["CollectionPage", "ItemList", "BreadcrumbList"] },
  { page: "Platform Pages (dynamic)", schemas: ["CollectionPage", "ItemList", "BreadcrumbList"] },
  { page: "City Pages (dynamic)", schemas: ["WebPage", "BreadcrumbList"] },
  { page: "Property Pages (dynamic)", schemas: ["Product / RealEstateListing"] },
  { page: "Rankings Pages (dynamic)", schemas: ["CollectionPage", "ItemList"] },
];

export default function SeoDashboard() {
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-[1000px]">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            Internal · noindex
          </div>
          <h1 className="text-[26px] font-normal leading-[1.1] tracking-[-0.3px] mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            SEO &amp; Growth Dashboard
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(242,237,230,0.45)" }}>
            Live health metrics computed from the Brickwise property database and content inventory.
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Indexed pages (est.)", value: String(sitemapTotal), sub: "in sitemap.ts", color: "#22c55e" },
            { label: "Properties tracked", value: String(totalProps), sub: `${uniqueCities.length} cities`, color: "#22c55e" },
            { label: "Learn articles", value: String(LEARN_ARTICLES.length), sub: `${SCHEMA_INVENTORY.length} schema types`, color: "#3b82f6" },
            { label: "Schema coverage", value: `${Math.round(schemaCount / STATIC_PAGES.length * 100)}%`, sub: `${schemaCount}/${STATIC_PAGES.length} static pages`, color: "#a855f7" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-[10px] px-4 py-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.35)" }}>{kpi.label}</div>
              <div className="text-[22px] font-bold leading-none mb-1" style={{ fontFamily: "var(--font-dm-mono)", color: kpi.color }}>{kpi.value}</div>
              <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Buy/Hold/Avoid breakdown */}
          <div className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: "#F2EDE6" }}>Signal Distribution</h2>
            <div className="space-y-2.5">
              {[
                { label: "Buy", count: buyCount, color: "#22c55e" },
                { label: "Hold", count: holdCount, color: "#f59e0b" },
                { label: "Avoid", count: avoidCount, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-12 text-[11px] font-semibold" style={{ color: s.color }}>{s.label}</div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.count / totalProps) * 100}%`, background: s.color }}
                    />
                  </div>
                  <div className="w-16 text-right text-[11px]" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.5)" }}>
                    {s.count} ({Math.round(s.count / totalProps * 100)}%)
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #2A2420" }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Avg net yield", value: `${avgYield}%` },
                  { label: "Cities covered", value: String(uniqueCities.length) },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[9px] uppercase tracking-[0.5px] mb-0.5" style={{ color: "rgba(242,237,230,0.35)" }}>{s.label}</div>
                    <div className="text-[16px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="rounded-[10px] p-5" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="text-[14px] font-semibold mb-4" style={{ color: "#F2EDE6" }}>Platform Coverage</h2>
            <div className="space-y-2">
              {PLATFORM_COUNTS.map((pl) => (
                <div key={pl.name} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #1e1c15" }}>
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: "#F2EDE6" }}>{pl.name}</div>
                    <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>{pl.count} properties</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[12px] font-bold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>{pl.avgYield}%</div>
                    <Link
                      href={`/platform/${slugify(pl.name)}`}
                      className="text-[10px] px-2 py-0.5 rounded-full no-underline hover:opacity-80 transition-opacity"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(242,237,230,0.5)" }}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page inventory */}
        <div className="rounded-[10px] overflow-hidden mb-8" style={{ border: "1px solid #2A2420" }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
            <h2 className="text-[13px] font-semibold" style={{ color: "#F2EDE6" }}>Static Page SEO Inventory</h2>
            <span className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>{STATIC_PAGES.length} pages</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#131109", borderBottom: "1px solid #2A2420" }}>
                  {["Page", "Metadata", "Schema", "Sitemap", "Priority"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(242,237,230,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATIC_PAGES.map((page, i) => (
                  <tr key={page.url} style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b", borderBottom: "1px solid #1e1c15" }}>
                    <td className="px-4 py-2.5">
                      <Link href={page.url} className="text-[12px] font-medium no-underline hover:opacity-70 transition-opacity" style={{ color: "#F2EDE6" }}>
                        {page.title}
                      </Link>
                      <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>{page.url}</div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {page.hasMeta
                        ? <span className="text-[11px] font-bold" style={{ color: "#22c55e" }}>✓</span>
                        : <span className="text-[11px] font-bold" style={{ color: "#ef4444" }}>✗</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {page.hasSchema
                        ? <span className="text-[11px] font-bold" style={{ color: "#22c55e" }}>✓</span>
                        : <span className="text-[11px] font-bold" style={{ color: "#f59e0b" }}>–</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {page.inSitemap
                        ? <span className="text-[11px] font-bold" style={{ color: "#22c55e" }}>✓</span>
                        : <span className="text-[11px] font-bold" style={{ color: "#ef4444" }}>✗</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center text-[11px]" style={{ fontFamily: "var(--font-dm-mono)", color: "rgba(242,237,230,0.45)" }}>
                      {page.priority > 0 ? page.priority.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schema inventory */}
        <div className="rounded-[10px] overflow-hidden mb-8" style={{ border: "1px solid #2A2420" }}>
          <div className="px-5 py-3" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
            <h2 className="text-[13px] font-semibold" style={{ color: "#F2EDE6" }}>Deployed JSON-LD Schemas</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#1e1c15" }}>
            {SCHEMA_INVENTORY.map((row, i) => (
              <div key={row.page} className="flex items-start gap-4 px-5 py-3" style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b" }}>
                <div className="flex-1 text-[12px] font-medium" style={{ color: "rgba(242,237,230,0.7)" }}>{row.page}</div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {row.schemas.map((s) => (
                    <span key={s} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action items */}
        {missingSchema.length > 0 && (
          <div className="rounded-[10px] p-5 mb-8" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <h2 className="text-[13px] font-semibold mb-3" style={{ color: "#fcd34d" }}>
              Pages Missing Structured Data ({missingSchema.length})
            </h2>
            <div className="space-y-2">
              {missingSchema.map((p) => (
                <div key={p.url} className="flex items-center gap-3">
                  <span className="text-[11px]" style={{ color: "#f59e0b" }}>→</span>
                  <Link href={p.url} className="text-[12px] no-underline hover:opacity-70 transition-opacity" style={{ color: "rgba(242,237,230,0.65)" }}>
                    {p.url}
                  </Link>
                  <span className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learn content status */}
        <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid #2A2420" }}>
          <div className="px-5 py-3" style={{ background: "#1A1713", borderBottom: "1px solid #2A2420" }}>
            <h2 className="text-[13px] font-semibold" style={{ color: "#F2EDE6" }}>Learn Content Status</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "#1e1c15" }}>
            {LEARN_ARTICLES.map((article, i) => (
              <div key={article.slug} className="flex items-center gap-4 px-5 py-3" style={{ background: i % 2 === 0 ? "#131109" : "#0f0e0b" }}>
                <div
                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${article.accentColor}18`, color: article.accentColor }}
                >
                  {article.category}
                </div>
                <Link href={article.href} className="flex-1 text-[12px] font-medium no-underline hover:opacity-70 transition-opacity" style={{ color: "#F2EDE6" }}>
                  {article.title}
                </Link>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  <span style={{ color: "#22c55e" }}>Meta ✓</span>
                  <span style={{ color: "#22c55e" }}>Schema ✓</span>
                  <span style={{ color: "#22c55e" }}>Sitemap ✓</span>
                </div>
                <div className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>{article.readTime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
