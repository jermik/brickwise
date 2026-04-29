import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmailCapture } from "@/components/ui/email-capture";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

export const metadata: Metadata = {
  title: "Tokenized Real Estate Market Reports | Brickwise",
  description:
    "Daily market updates and yield analysis for tokenized real estate investments on Lofty and RealT. Track returns, top properties, and emerging opportunities.",
  keywords: [
    "tokenized real estate market",
    "fractional property market report",
    "Lofty RealT market update",
    "real estate token yields",
    "fractional property investment analysis",
  ],
};

interface MarketUpdate {
  date: string;
  slug: string;
  title: string;
  highlights: string[];
  stats: {
    totalListings: number;
    avgYield: number;
    topYield: number;
    topYieldCity: string;
  };
}

const updates = marketUpdatesRaw as unknown as MarketUpdate[];

export default function MarketPage() {
  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-[720px]">
        <div className="mb-6">
          <h1
            className="text-[22px] font-bold tracking-[-0.5px] mb-1"
            style={{ color: "#111" }}
          >
            Market Reports
          </h1>
          <p className="text-[13px]" style={{ color: "#a3a3a3" }}>
            Daily analysis of tokenized real estate yields and listings across
            Lofty and RealT
          </p>
        </div>

        {updates.length === 0 ? (
          <div
            className="rounded-[10px] p-8 text-center"
            style={{ border: "1px solid #ebebeb" }}
          >
            <p className="text-[13px]" style={{ color: "#a3a3a3" }}>
              First report generates at 6am UTC on the next daily run
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {updates.map((u) => (
              <Link
                key={u.slug}
                href={`/market/${u.slug}`}
                className="block rounded-[10px] px-5 py-4 no-underline transition-opacity hover:opacity-80"
                style={{ border: "1px solid #ebebeb", background: "#fff" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div
                      className="text-[13px] font-semibold truncate"
                      style={{ color: "#111" }}
                    >
                      {u.title}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: "#a3a3a3" }}
                    >
                      {u.stats.totalListings} listings · avg {u.stats.avgYield}
                      % yield · top {u.stats.topYield}% in {u.stats.topYieldCity}
                    </div>
                  </div>
                  <div
                    className="text-[11px] flex-shrink-0 font-medium"
                    style={{
                      color: "#d4d4d4",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {u.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <EmailCapture
            source="market"
            heading="Get this report every Monday"
            subtext="Top properties, yield shifts, and market insights delivered to your inbox."
          />
        </div>
      </div>
    </AppShell>
  );
}
