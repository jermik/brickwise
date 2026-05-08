import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, EASE, FONT_DISPLAY } from "../config/brand";

interface CTACardProps {
  title: string;
  subtitle?: string;
  /** Domain or handle shown beneath the title. Defaults to brickwise.pro. */
  brand?: string;
}

/**
 * End-card. Springs in over a dimmed full-screen panel, holds, fades
 * out at the end of its <Sequence>. Drop it inside a <Sequence
 * from={ctaStart} durationInFrames={ctaLen}> to control timing.
 */
export function CTACard({
  title,
  subtitle,
  brand = "brickwise.pro",
}: CTACardProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, durationInFrames: 22, config: EASE });
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = enter * exit;
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const translateY = interpolate(enter, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(10,9,7,0.92) 0%, rgba(10,9,7,0.96) 60%, rgba(10,9,7,1) 100%)",
        padding: 72,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity,
        fontFamily: FONT_DISPLAY,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          background: BRAND.accent,
          color: "#0A0907",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          boxShadow: "0 12px 48px rgba(245,158,11,0.4)",
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        B
      </div>
      <h2
        style={{
          fontSize: 96,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          fontWeight: 800,
          color: BRAND.text,
          margin: 0,
          textAlign: "center",
          maxWidth: "90%",
          transform: `translateY(${translateY}px)`,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 40,
            lineHeight: 1.3,
            color: BRAND.textMuted,
            margin: 0,
            textAlign: "center",
            maxWidth: "82%",
            transform: `translateY(${translateY}px)`,
          }}
        >
          {subtitle}
        </p>
      )}
      <div
        style={{
          marginTop: 18,
          padding: "14px 28px",
          background: BRAND.accentSoft,
          border: `2px solid ${BRAND.accentBorder}`,
          color: BRAND.accent,
          fontWeight: 700,
          fontSize: 36,
          borderRadius: 999,
          letterSpacing: "-0.02em",
          transform: `translateY(${translateY}px)`,
        }}
      >
        {brand}
      </div>
    </AbsoluteFill>
  );
}
