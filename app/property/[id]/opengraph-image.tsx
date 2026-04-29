import { ImageResponse } from "next/og";
import { PROPERTIES } from "@/lib/data/properties";
import { getRecommendation } from "@/lib/recommendations";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = PROPERTIES.find((x) => x.id === Number(id));

  if (!p) return new ImageResponse(<div style={{ background: "#0f0f0f", width: "100%", height: "100%" }} />, { ...size });

  const rec = getRecommendation(p, PROPERTIES);
  const recColor = rec.action === "Buy" ? "#16a34a" : rec.action === "Avoid" ? "#dc2626" : "#92400e";
  const recBg = rec.action === "Buy" ? "#052e16" : rec.action === "Avoid" ? "#450a0a" : "#1c1007";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f0f0f",
          padding: "64px 80px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top: brand + recommendation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#737373", fontSize: 20, fontWeight: 600, letterSpacing: "0.5px" }}>
            BRICKWISE
          </span>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: 8,
              background: recBg,
              border: `1px solid ${recColor}40`,
            }}
          >
            <span style={{ color: recColor, fontSize: 18, fontWeight: 700 }}>{rec.action === "Buy" && rec.label ? rec.label : rec.action}</span>
          </div>
        </div>

        {/* Middle: property name + city */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "#fff", fontSize: 56, fontWeight: 800, letterSpacing: "-1.2px", lineHeight: 1.1 }}>
            {p.name}
          </div>
          <div style={{ color: "#737373", fontSize: 24 }}>
            {p.flag} {p.city}, {p.country} · {p.propertyType}
          </div>
        </div>

        {/* Bottom: key stats */}
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Net yield", value: `${p.expectedYield}%`, highlight: true },
            { label: "Token price", value: `€${p.tokenPrice.toFixed(2)}` },
            { label: "Monthly rent", value: `€${p.monthlyRent}` },
            { label: "Score", value: `${p.overallScore}/100` },
            { label: "Occupancy", value: `${p.occupancyRate}%` },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "16px 22px",
                background: "#1a1a1a",
                borderRadius: 10,
                border: s.highlight ? `1px solid ${recColor}50` : "1px solid #2a2a2a",
                flex: 1,
              }}
            >
              <span style={{ color: s.highlight ? recColor : "#fff", fontSize: 24, fontWeight: 700 }}>
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
