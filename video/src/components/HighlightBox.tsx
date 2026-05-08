import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HighlightRect } from "../types";
import { BRAND, EASE } from "../config/brand";
import { DEMO_CARD } from "./DemoLayer";

interface HighlightBoxProps {
  rect: HighlightRect;
  /** Optional small badge text (e.g. "look here"). */
  label?: string;
}

/**
 * Animated rectangular highlight. Coordinates are 0..1 fractions of
 * the demo card — NOT the canvas — so templates reason about UI
 * positions in the same space the operator sees in the recording.
 */
export function HighlightBox({ rect, label }: HighlightBoxProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, durationInFrames: 14, config: EASE });
  const pulse = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
  const opacity = interpolate(intro, [0, 1], [0, 1]);
  const scale = interpolate(intro, [0, 1], [0.95, 1]) * pulse;

  const left = DEMO_CARD.x + rect.x * DEMO_CARD.w;
  const top = DEMO_CARD.y + rect.y * DEMO_CARD.h;
  const width = rect.w * DEMO_CARD.w;
  const height = rect.h * DEMO_CARD.h;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          border: `4px solid ${BRAND.accent}`,
          borderRadius: 14,
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
            left,
            top: top - 56,
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
