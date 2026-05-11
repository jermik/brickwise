import type { Metadata } from "next";
import { PROPERTIES } from "@/lib/data/properties";

const count = PROPERTIES.length;
const avgYield =
  Math.round(
    (PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / count) * 10
  ) / 10;

export const metadata: Metadata = {
  title: { absolute: `Browse ${count} Tokenized Properties — Brickwise` },
  description: `Filter ${count} tokenized properties on Lofty & RealT by yield (avg ${avgYield}%), risk, city. Find the best fractional property for your goals.`,
  keywords: [
    `best Lofty properties ${new Date().getFullYear()}`,
    `best RealT properties ${new Date().getFullYear()}`,
    "fractional real estate high yield",
    "tokenized real estate comparison",
    "Lofty vs RealT investment",
    "passive income real estate tokens",
    "tokenized property yield filter",
    "real estate token buy",
    "fractional property investment list",
    "tokenized rental property",
  ],
  openGraph: {
    title: `${count} Tokenized Properties — Filter by Yield & Risk | Brickwise`,
    description: `Browse and filter ${count} tokenized real estate investments. Platform avg ${avgYield}% net yield. Lofty and RealT with full analysis.`,
    type: "website",
    url: "https://brickwise.pro/analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse ${count} Tokenized Properties | Brickwise`,
    description: `Filter by yield, risk, and platform. Avg ${avgYield}% net yield across Lofty and RealT.`,
  },
  alternates: {
    canonical: "https://brickwise.pro/analyzer",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://brickwise.pro/analyzer#webpage",
  "name": `Browse ${count} Tokenized Properties — Filter by Yield, Risk & Platform`,
  "url": "https://brickwise.pro/analyzer",
  "description": `Compare ${count} tokenized real estate investments on Lofty and RealT. Filter by yield, risk, city, and platform. Find the best fractional property for your goals.`,
  "isPartOf": { "@id": "https://brickwise.pro/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://brickwise.pro" },
      { "@type": "ListItem", "position": 2, "name": "Property Analyzer", "item": "https://brickwise.pro/analyzer" },
    ],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Brickwise Property Analyzer",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": "https://brickwise.pro/analyzer",
  "description": `Free tool to filter and score ${count} tokenized real estate properties by yield, risk, city, and platform. Generates Buy/Hold/Avoid signals using a proprietary scoring model.`,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
  },
  "featureList": [
    "Filter by yield, risk, city, and platform",
    "Buy / Hold / Avoid signals",
    "Fair value estimation",
    "Monthly return calculator",
    "Side-by-side property comparison",
    "Covers RealT and Lofty",
  ],
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {children}
    </>
  );
}
