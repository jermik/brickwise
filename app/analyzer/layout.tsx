import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Analyzer — Brickwise",
  description: "Filter, sort, and compare tokenised real estate properties by yield, risk, and score.",
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
