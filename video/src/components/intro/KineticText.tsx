import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, FONT_DISPLAY } from "../../config/brand";

interface KineticTextProps {
  /** Lines printed top-to-bottom. Each gets its own slam-in. */
  lines: string[];
  /** Frames between each line. Lower = snappier. */
  staggerFrames?: number;
  /** Frame at which the whole block starts fading out. */
  fadeOutAt?: number;
  /** Apply orange accent to a line (by index). */
  accentIndex?: number;
}

/**
 * A short stack of huge headlines that slam-in with scale + blur.
 * Used for "BAD WEBSITES." / "AUTOMATICALLY." style punch beats.
 */
export function KineticText({
  lines,
  staggerFrames = 6,
  fadeOutAt = 999_999,
  accentIndex,
}: KineticTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(
    frame,
    [fadeOutAt - 6, fadeOutAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        padding: 48,
        opacity: fade,
      }}
    >
      {lines.map((line, i) => {
        const local = frame - i * staggerFrames;
        const enter = spring({
          frame: local,
          fps,
          durationInFrames: 16,
          config: { damping: 200, stiffness: 380, mass: 0.45 },
        });
        const scale = interpolate(enter, [0, 1], [1.4, 1]);
        const blur = interpolate(enter, [0, 1], [14, 0]);
        const isAccent = i === accentIndex;
        return (
          <h2
            key={`${line}-${i}`}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 196,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
              color: isAccent ? BRAND.accent : BRAND.text,
              margin: 0,
              opacity: enter,
              transform: `scale(${scale})`,
              filter: `blur(${blur}px)`,
              textAlign: "center",
              willChange: "transform, opacity, filter",
              textShadow: isAccent
                ? `0 0 32px ${BRAND.accent}, 0 0 80px rgba(245,158,11,0.45)`
                : "0 0 16px rgba(0,0,0,0.6)",
            }}
          >
            {line}
          </h2>
        );
      })}
    </AbsoluteFill>
  );
}
