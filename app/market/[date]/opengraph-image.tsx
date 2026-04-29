import { ImageResponse } from "next/og";
import marketUpdatesRaw from "@/lib/data/market-updates.json";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface MarketUpdate {
  date: string;
  slug: string;
  title: string;
  stats: {
    totalListings: number;
    avgYield: number;
    avgScore: number;
    topYield: number;
    topYieldCity: string;
  };
  highlights: string[];
}

const updates = marketUpdatesRaw as unknown as MarketUpdate[];

export default async function MarketOG({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const u = updates.find((u) => u.slug === date);

  if (!u) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: "#0c0c0c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ color: "#555", fontSize: 32 }}>Report not found</span>
        </div>
      ),
      { ...size }
    );
  }

  const formattedDate = new Date(u.date + "T12:00:00Z").toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0c0c0c",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                background: "#16a34a",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              BRICKWISE
            </span>
          </div>
          <div
            style={{
              background: "#161616",
              border: "1px solid #262626",
              borderRadius: 8,
              padding: "6px 16px",
            }}
          >
            <span style={{ color: "#555", fontSize: 13, fontWeight: 600 }}>
              MARKET REPORT
            </span>
          </div>
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ color: "#555", fontSize: 18, letterSpacing: 1 }}>
            {formattedDate}
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Tokenized Real Estate
          </div>
          <div
            style={{
              color: "#16a34a",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Market Update
          </div>
          {u.highlights[0] && (
            <div
              style={{
                color: "#555",
                fontSize: 19,
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {u.highlights[0]}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Listings", value: String(u.stats.totalListings) },
            { label: "Avg Yield", value: `${u.stats.avgYield}%` },
            { label: "Top Yield", value: `${u.stats.topYield}%` },
            { label: "Top City", value: u.stats.topYieldCity },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                background: "#161616",
                border: "1px solid #262626",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                style={{
                  color: "#16a34a",
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span style={{ color: "#444", fontSize: 13 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
