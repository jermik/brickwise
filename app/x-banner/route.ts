import { ImageResponse } from "next/og";

// Live PNG at https://brickwise.pro/x-banner — 1500×500, X's banner size.
// Right-click → Save image as → uploads as brickwise-x-banner.png.
//
// Composition keeps the bottom-left ~250×250 region empty so the X avatar
// overlay doesn't collide with the brand mark.

export const dynamic = "force-static";

export async function GET() {
  const W = 1500;
  const H = 500;

  // Mini brick-grid mark (scaled to fit a 64×64 visual block)
  const markBlock = (x: number, y: number, isAccent: boolean) => ({
    position: "absolute" as const,
    left: x,
    top: y,
    width: 18,
    height: 18,
    background: isAccent
      ? "linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)"
      : "linear-gradient(180deg, #FFFFFF 0%, #D6DBE6 100%)",
    borderRadius: 4,
    display: "flex",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0E0E16 0%, #05050B 60%, #0A0A18 100%)",
          padding: "70px 100px",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Subtle electric blue radial glow top-right */}
        <div
          style={{
            position: "absolute",
            right: -200,
            top: -200,
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0) 60%)",
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Top row: mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* The mark itself — 3×3 stair built from blocks */}
          <div
            style={{
              position: "relative",
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #0E0E16 0%, #05050B 100%)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
            }}
          >
            {/* Top-left accent */}
            <div style={markBlock(7, 7, true)} />
            {/* Middle row */}
            <div style={markBlock(7, 29, false)} />
            <div style={markBlock(29, 29, false)} />
            {/* Bottom row */}
            <div style={markBlock(7, 51 - 7, false)} />
            <div style={markBlock(29, 51 - 7, false)} />
            <div style={markBlock(51 - 7, 51 - 7, false)} />
          </div>

          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-1.2px",
              color: "#FFFFFF",
            }}
          >
            Brickwise
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Headline + subhead — right side, leaving bottom-left for avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-2.5px",
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
          >
            <span>What to buy, hold,</span>
            <span style={{ color: "#60A5FA" }}>or avoid.</span>
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.3px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Tokenized real estate, scored across Lofty &amp; RealT.
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "content-disposition": 'inline; filename="brickwise-x-banner.png"',
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
