import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { FireEvent } from "@/components/analytics/page-view-tracker";
import { EmailCaptureWidget } from "@/components/conversion/email-capture-widget";
import { AffiliateCta } from "@/components/conversion/affiliate-cta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best Real Estate Investing Apps (2026): Honest Editorial Ranking | Brickwise",
  description:
    "The best real estate investing apps for 2026 — Lofty, Fundrise, Arrived, Ark7, RealT — compared on minimum, distribution frequency, mobile experience, and best-fit investor.",
  keywords: [
    "best real estate investing apps",
    "real estate investing app",
    "best real estate apps 2026",
    "real estate apps compared",
    "fractional real estate apps",
    "fundrise app",
    "lofty app",
    "arrived homes app",
    "ark7 app",
    "real estate investing app for beginners",
  ],
  openGraph: {
    title: "Best Real Estate Investing Apps (2026) — Editorial Ranking | Brickwise",
    description:
      "Lofty, Fundrise, Arrived, Ark7, RealT compared. App experience, minimums, distribution frequency, regulatory model, and who each app is best for.",
    type: "article",
    url: "https://brickwise.pro/compare/best-real-estate-investing-apps",
  },
  alternates: { canonical: "https://brickwise.pro/compare/best-real-estate-investing-apps" },
};

interface AppEntry {
  name: string;
  rank: number;
  bestFor: string;
  minimum: string;
  distributions: string;
  ux: string;
  pros: string[];
  cons: string[];
  link?: string;
  affiliatePlatform?: "Lofty" | "RealT" | "Arrived" | "Fundrise" | "Ark7";
}

const apps: AppEntry[] = [
  {
    name: "Fundrise",
    rank: 1,
    bestFor: "Beginners and investors who want a hands-off, lowest-friction start",
    minimum: "$10",
    distributions: "Quarterly",
    ux: "Polished iOS and Android apps; brokerage-style. No crypto.",
    pros: [
      "$10 minimum — lowest in the category",
      "12+ year track record (started 2010)",
      "Excellent mobile experience",
      "Diversification by default via eREIT funds",
      "Tax handling is simple (single 1099)",
    ],
    cons: [
      "Quarterly distributions only — slow cashflow",
      "No per-property selection",
      "Early-redemption fee within five years",
      "Largely US-only",
    ],
    affiliatePlatform: "Fundrise",
  },
  {
    name: "Lofty",
    rank: 2,
    bestFor: "Daily-income seekers comfortable with crypto wallets",
    minimum: "$50",
    distributions: "Daily (USDC)",
    ux: "Web-first with mobile responsive; requires Algorand-compatible wallet (e.g., Pera).",
    pros: [
      "Daily USDC distributions",
      "Same-day liquidity via Proactive Market Maker",
      "Globally accessible",
      "Direct LLC ownership per property",
      "Open property catalog for picking individual homes",
    ],
    cons: [
      "Requires comfort with crypto wallets",
      "Token prices can drift on the secondary market",
      "Tax reporting more complex (LLC K-1, possibly crypto basis)",
      "Smaller catalog than traditional REITs",
    ],
    affiliatePlatform: "Lofty",
  },
  {
    name: "Arrived",
    rank: 3,
    bestFor: "Investors who want hand-picked homes including vacation rentals, no crypto",
    minimum: "$100",
    distributions: "Quarterly",
    ux: "Strong app experience; brokerage-style account.",
    pros: [
      "Pick individual properties + vacation rentals",
      "Notable backers (Bezos Expeditions, Marc Benioff)",
      "Simple US tax handling",
      "No crypto required",
    ],
    cons: [
      "$100 minimum",
      "Effectively illiquid for 5–7 years",
      "Quarterly distributions only",
      "US residents only",
    ],
    affiliatePlatform: "Arrived",
  },
  {
    name: "Ark7",
    rank: 4,
    bestFor: "Monthly cashflow investors who want low minimums without crypto",
    minimum: "$20",
    distributions: "Monthly",
    ux: "Mobile-first design; clean app for browsing single-property listings.",
    pros: [
      "$20 minimum — second-lowest barrier",
      "Monthly distributions in USD",
      "Reg A+ regulated securities (no crypto)",
      "Secondary market for resale",
    ],
    cons: [
      "US residents only",
      "Secondary market liquidity depends on user demand",
      "Smaller catalog than larger platforms",
    ],
    affiliatePlatform: "Ark7",
  },
  {
    name: "RealT",
    rank: 5,
    bestFor: "DeFi-comfortable investors who want weekly cashflow and globally accessible tokens",
    minimum: "$50–100",
    distributions: "Weekly (USDC)",
    ux: "Web-only; requires MetaMask or compatible Ethereum/Gnosis wallet.",
    pros: [
      "Weekly USDC distributions",
      "Tokens tradeable on Uniswap secondary",
      "Globally accessible",
      "Per-property direct LLC ownership",
      "12+ year track record (started 2019)",
    ],
    cons: [
      "Web-only — no native mobile app",
      "Requires more technical setup (wallet, gas, networks)",
      "Single-property risk concentration",
      "Tax handling can be complex",
    ],
    affiliatePlatform: "RealT",
  },
];

const faqs = [
  {
    q: "What's the best real estate investing app for beginners?",
    a: "Fundrise — $10 minimum, polished mobile app, no crypto, diversified portfolio by default. It's the lowest-friction starting point for someone new to real estate investing.",
  },
  {
    q: "Which app has the lowest minimum?",
    a: "Fundrise at $10. Ark7 at $20. Lofty and RealT at $50. Arrived at $100. Lower minimums help you spread money across multiple platforms or properties to reduce concentration risk.",
  },
  {
    q: "Which app pays out most frequently?",
    a: "Lofty pays daily in USDC. RealT pays weekly. Ark7 pays monthly. Fundrise and Arrived pay quarterly. More frequent distributions are useful for cashflow planning but don't necessarily mean higher total returns.",
  },
  {
    q: "Are real estate investing apps safe?",
    a: "All five apps in this list operate under US securities regulations (Reg A+, Reg D). They are not insured the way a bank deposit is, and you can lose money. Property risk (vacancy, maintenance, market shifts) and platform risk are both real. Always read the offering documents before investing.",
  },
  {
    q: "Can I use multiple apps?",
    a: "Yes, and many investors do. A common stack: Fundrise as the diversified base, plus one of Lofty/RealT/Arrived for selective higher-conviction bets on individual properties. The apps don't strictly compete — they cover different jobs.",
  },
  {
    q: "Do any of these apps work outside the US?",
    a: "Lofty and RealT generally accept non-US investors subject to per-offering KYC. Fundrise, Arrived, and Ark7 are largely US-only or have stricter international restrictions. Always verify with each app before signing up.",
  },
  {
    q: "Which app has the best mobile experience?",
    a: "Fundrise has the most polished native mobile app — it works like a brokerage account. Arrived's app is also excellent. Ark7 is mobile-first by design. Lofty is web-first but mobile-responsive. RealT is web-only with no native app, which is a real friction point if you want to manage on the go.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Real Estate Investing Apps (2026): Honest Editorial Ranking",
  "description":
    "Editorial ranking of the top real estate investing apps for 2026: Fundrise, Lofty, Arrived, Ark7, and RealT — minimums, distributions, app experience, and best-fit investor profiles.",
  "author": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "publisher": { "@type": "Organization", "name": "Brickwise", "url": "https://brickwise.pro" },
  "url": "https://brickwise.pro/compare/best-real-estate-investing-apps",
  "about": apps.map((a) => ({ "@type": "Organization", "name": a.name })),
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best Real Estate Investing Apps 2026",
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "itemListElement": apps.map((a) => ({
    "@type": "ListItem",
    "position": a.rank,
    "name": a.name,
    "description": a.bestFor,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
    { "@type": "ListItem", "position": 2, "name": "Compare", "item": "https://brickwise.pro/compare" },
    { "@type": "ListItem", "position": 3, "name": "Best Real Estate Investing Apps", "item": "https://brickwise.pro/compare/best-real-estate-investing-apps" },
  ],
};

export default function BestRealEstateAppsPage() {
  return (
    <PublicShell>
      <FireEvent name="compare_view" params={{ slug: "best-real-estate-investing-apps" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="px-6 lg:px-10 py-10 max-w-[920px] mx-auto">
        <div className="flex items-center gap-2 mb-5 text-[12px]" style={{ color: "#a3a3a3" }}>
          <Link href="/" className="no-underline transition-opacity hover:opacity-70" style={{ color: "#a3a3a3" }}>Home</Link>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#737373" }}>Compare</span>
          <span style={{ color: "#d4d4d4" }}>/</span>
          <span style={{ color: "#111" }}>Best apps</span>
        </div>

        <h1 className="text-[34px] font-bold tracking-[-0.8px] leading-[1.15] mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
          Best real estate investing apps (2026)
        </h1>
        <p className="text-[15px] leading-[1.6] mb-3 max-w-[640px]" style={{ color: "#525252" }}>
          An editorial ranking of the five real estate investing apps most worth your attention right now. Each entry covers minimum, distribution frequency, mobile/app experience, who it's built for, and the honest trade-offs. Lofty and RealT are tracked live in our analyzer; the others are based on each platform's public documentation as of 2026.
        </p>

        {/* Ranked list */}
        <div className="space-y-5 mb-10">
          {apps.map((app) => (
            <div key={app.name} className="rounded-[12px] p-6" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold"
                  style={{ background: "#111", color: "#fff" }}
                >
                  {app.rank}
                </div>
                <h2 className="text-[22px] font-bold tracking-[-0.4px]" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>
                  {app.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] px-2 py-0.5 rounded ml-auto" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  {app.minimum} min
                </span>
              </div>
              <p className="text-[13.5px] leading-[1.6] mb-4" style={{ color: "#404040" }}>
                <strong style={{ color: "#111" }}>Best for:</strong> {app.bestFor}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-[12.5px] mb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-1" style={{ color: "#737373" }}>Distributions</div>
                  <div style={{ color: "#111" }}>{app.distributions}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-1" style={{ color: "#737373" }}>App experience</div>
                  <div style={{ color: "#111" }}>{app.ux}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-1.5" style={{ color: "#16a34a" }}>Pros</div>
                  <ul className="space-y-1">
                    {app.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-[12px]" style={{ color: "#404040" }}>
                        <span style={{ color: "#16a34a", marginTop: 1 }}>✓</span>
                        <span style={{ lineHeight: 1.5 }}>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.6px] mb-1.5" style={{ color: "#dc2626" }}>Cons</div>
                  <ul className="space-y-1">
                    {app.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-[12px]" style={{ color: "#404040" }}>
                        <span style={{ color: "#dc2626", marginTop: 1 }}>−</span>
                        <span style={{ lineHeight: 1.5 }}>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {app.affiliatePlatform && (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f5f5f5" }}>
                  <AffiliateCta platform={app.affiliatePlatform} label={`Visit ${app.name} →`} variant="secondary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Internal links */}
        <div className="rounded-[12px] p-6 mb-10" style={{ background: "#fafafa", border: "1px solid #ebebeb" }}>
          <h3 className="text-[16px] font-bold mb-3" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Deeper comparisons</h3>
          <div className="space-y-2">
            <Link href="/compare/realt-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ RealT vs Lofty (live data)</Link>
            <Link href="/compare/lofty-vs-arrived" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Lofty vs Arrived</Link>
            <Link href="/compare/realt-vs-fundrise" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ RealT vs Fundrise</Link>
            <Link href="/compare/arrived-vs-fundrise" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Arrived vs Fundrise</Link>
            <Link href="/compare/ark7-vs-lofty" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Ark7 vs Lofty</Link>
            <Link href="/compare/best-fractional-real-estate-platforms" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Best fractional real estate platforms (overview)</Link>
            <Link href="/analyzer" className="block text-[13px] no-underline transition-opacity hover:opacity-70" style={{ color: "#16a34a" }}>→ Analyze every Lofty + RealT property</Link>
          </div>
        </div>

        {/* Email capture */}
        <div className="mb-10">
          <EmailCaptureWidget source="compare_best_apps" />
        </div>

        {/* FAQ */}
        <h2 className="text-[22px] font-bold tracking-[-0.4px] mb-4" style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}>Frequently asked questions</h2>
        <div className="space-y-3 mb-10">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-[10px] p-5" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
              <h3 className="text-[14px] font-semibold mb-2" style={{ color: "#111" }}>{f.q}</h3>
              <p className="text-[13px] leading-[1.6]" style={{ color: "#525252" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
