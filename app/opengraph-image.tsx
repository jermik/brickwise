import { ImageResponse } from "next/og";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const count = PROPERTIES.length;
  const avgYield = (
    PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / count
  ).toFixed(1);
  const buyCount = PROPERTIES.filter(
    (p) => getRecommendation(p, PROPERTIES).action === "Buy"
  ).length;

  const stats = [
    { value: String(count), label: "Properties tracked" },
    { value: `${avgYield}%`, label: "Avg net yield" },
    { value: `${buyCount} Buy signals`, label: "Right now" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0f0f0f",
          padding: "72px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#16a34a",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, background: "#fff", borderRadius: 3, display: "flex" }} />
          </div>
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Brickwise
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 62,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-1.5px",
              lineHeight: 1.08,
            }}
          >
            <span>What to buy, hold,</span>
            <span style={{ color: "#16a34a" }}>or avoid.</span>
          </div>
          <div style={{ fontSize: 24, color: "#a3a3a3", fontWeight: 400, letterSpacing: "-0.3px" }}>
            Tokenised real estate analytics for RealT investors.
          </div>
        </div>

        {/* Bottom: live stats */}
        <div style={{ display: "flex", gap: 24 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "16px 28px",
                background: "#1a1a1a",
                borderRadius: 10,
                border: "1px solid #2a2a2a",
              }}
            >
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.3px" }}>
                {s.value}
              </span>
              <span style={{ color: "#737373", fontSize: 13 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
