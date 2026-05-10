import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — generated as PNG at build time via Next.js ImageResponse.
// Same 3x3 stair grid as the favicon and primary mark.
export default function AppleIcon() {
  const cellSize = 36;
  const gap = 4;
  const padding = (size.width - (cellSize * 3 + gap * 2)) / 2;

  const cell = (x: number, y: number, isAccent = false) => ({
    position: "absolute" as const,
    left: padding + x * (cellSize + gap),
    top: padding + y * (cellSize + gap),
    width: cellSize,
    height: cellSize,
    background: isAccent
      ? "linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)"
      : "linear-gradient(180deg, #FFFFFF 0%, #D6DBE6 100%)",
    borderRadius: 9,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0E0E16 0%, #05050B 100%)",
          borderRadius: 30,
          position: "relative",
        }}
      >
        {/* Accent (top-left) */}
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
    { ...size },
  );
}
