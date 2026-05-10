import { ImageResponse } from "next/og";

// Live PNG at https://brickwise.pro/x-avatar
// Right-click → Save image as → uploads as brickwise-x-avatar.png. No conversion needed.
// Same 3x3 stair grid as the favicon and primary mark, sized 400x400
// with cells sized to fit inside X's 200px-radius circular crop.

export const dynamic = "force-static";

export async function GET() {
  const SIZE = 400;
  const cellSize = 80;
  const gap = 8;
  const padding = (SIZE - (cellSize * 3 + gap * 2)) / 2; // 72

  const cell = (x: number, y: number, isAccent = false) => ({
    position: "absolute" as const,
    left: padding + x * (cellSize + gap),
    top: padding + y * (cellSize + gap),
    width: cellSize,
    height: cellSize,
    background: isAccent
      ? "linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)"
      : "linear-gradient(180deg, #FFFFFF 0%, #D6DBE6 100%)",
    borderRadius: 16,
    display: "flex",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0E0E16 0%, #05050B 100%)",
          position: "relative",
        }}
      >
        {/* Top-left accent (electric blue) */}
        <div style={cell(0, 0, true)} />
        {/* Middle row */}
        <div style={cell(0, 1)} />
        <div style={cell(1, 1)} />
        {/* Bottom row */}
        <div style={cell(0, 2)} />
        <div style={cell(1, 2)} />
        <div style={cell(2, 2)} />
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        "content-disposition": 'inline; filename="brickwise-x-avatar.png"',
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
