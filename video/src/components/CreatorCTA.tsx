import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, EASE, FONT_DISPLAY, FONT_MONO } from "../config/brand";

interface CreatorCTAProps {
  /** Big bold question. */
  question?: string;
  /** Smaller call-to-action below the question. */
  cta?: string;
  /** Builder note at the bottom (small caps). */
  buildNote?: string;
}

/**
 * Creator-style end card. No corporate logo, no brand domain — just
 * a punchy question, a DM-me CTA, and a subtle builder credit. Springs
 * in over a dimmed full-screen panel; fades out at the end of its
 * own <Sequence>.
 */
export function CreatorCTA({
  question = "Want this system?",
  cta = "DM me 'GrowthOS'",
  buildNote = "Building this for agencies",
}: CreatorCTAProps) {
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
  const translateY = interpolate(enter, [0, 1], [22, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(10,9,7,0.94) 0%, rgba(10,9,7,0.98) 100%)",
        padding: 96,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        opacity,
        fontFamily: FONT_DISPLAY,
      }}
    >
      <h2
        style={{
          fontSize: 116,
          lineHeight: 1.05,
          letterSpacing: "-0.05em",
          fontWeight: 800,
          color: BRAND.text,
          margin: 0,
          textAlign: "center",
          maxWidth: "90%",
          transform: `translateY(${translateY}px)`,
        }}
      >
        {question}
      </h2>

      <div
        style={{
          padding: "20px 36px",
          background: BRAND.accentSoft,
          border: `2px solid ${BRAND.accentBorder}`,
          color: BRAND.accent,
          fontWeight: 700,
          fontSize: 52,
          borderRadius: 999,
          letterSpacing: "-0.02em",
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        {cta}
      </div>

      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: BRAND.textFaint,
          margin: 0,
          marginTop: 24,
          opacity: interpolate(enter, [0, 0.7, 1], [0, 0, 1]),
        }}
      >
        {buildNote}
      </p>
    </AbsoluteFill>
  );
}
