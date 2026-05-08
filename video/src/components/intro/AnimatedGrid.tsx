import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { BRAND } from "../../config/brand";

interface AnimatedGridProps {
  /** How fast the grid scrolls. Lower = slower. */
  scrollSpeed?: number;
  /** Cell size in px. */
  cell?: number;
  /** 0..1 line opacity. */
  intensity?: number;
}

/**
 * Subtle moving-grid background. CSS `background-image` linear-
 * gradient stripes scrolled by `background-position` — pure GPU,
 * cheap to render. Sits behind the kinetic text to keep the eye
 * stimulated even on long beats. Designed to be perceptible but
 * never compete with the foreground.
 */
export function AnimatedGrid({
  scrollSpeed = 0.8,
  cell = 80,
  intensity = 0.06,
}: AnimatedGridProps) {
  const frame = useCurrentFrame();
  const offset = (frame * scrollSpeed) % cell;

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(245, 158, 11, ${intensity}) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(245, 158, 11, ${intensity}) 1px,
            transparent 1px
          )
        `,
        backgroundSize: `${cell}px ${cell}px`,
        backgroundPosition: `${offset}px ${offset * 0.6}px`,
        pointerEvents: "none",
      }}
    >
      {/* Vignette so the grid fades at edges and doesn't compete with text */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(10,9,7,0) 30%, rgba(10,9,7,0.85) 100%)",
          opacity: interpolate(frame, [0, 30], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
}
