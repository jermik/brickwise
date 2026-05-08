import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HighlightRect } from "../types";
import { BRAND, EASE } from "../config/brand";

interface HighlightBoxProps {
  rect: HighlightRect;
  /** Optional small badge text (e.g. "look here"). */
  label?: string;
}

/**
 * Animated rectangular highlight. Springs in around frame 0, pulses,
 * then sticks. Coordinates are 0..1 fractions of the canvas so it
 * scales with composition size.
 */
export function HighlightBox({ rect, label }: HighlightBoxProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const intro = spring({ frame, fps, durationInFrames: 14, config: EASE });
  // Subtle 1.0 → 1.04 → 1.0 pulse on a 30-frame loop
  const pulse = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const scale = interpolate(intro, [0, 1], [0.95, 1]) * pulse;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: rect.x * width,
          top: rect.y * height,
          width: rect.w * width,
          height: rect.h * height,
          border: `4px solid ${BRAND.accent}`,
          borderRadius: 16,
          boxShadow: `0 0 0 8px ${BRAND.accentSoft}, 0 16px 40px rgba(0,0,0,0.45)`,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: rect.x * width,
            top: rect.y * height - 56,
            padding: "6px 14px",
            background: BRAND.accent,
            color: "#0A0907",
            fontFamily:
              "'Geist Sans', system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 28,
            borderRadius: 999,
            opacity,
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
}
