import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, EASE, FONT_DISPLAY } from "../config/brand";

interface HookOverlayProps {
  /** Big bold hook line. */
  title: string;
  /** Smaller, supporting line beneath. */
  subtitle?: string;
  /** When the hook should fade out (frames into the parent <Sequence>). */
  fadeOutAt?: number;
}

/**
 * The opening hook — full-screen dimmed gradient + huge title that
 * springs in, holds, then fades. Drop inside a <Sequence> so its frame
 * counter is local to the hook scene.
 */
export function HookOverlay({
  title,
  subtitle,
  fadeOutAt = 999_999,
}: HookOverlayProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introTitle = spring({
    frame,
    fps,
    durationInFrames: 18,
    config: EASE,
  });
  const introSub = spring({
    frame: frame - 6,
    fps,
    durationInFrames: 18,
    config: EASE,
  });
  const fade = interpolate(
    frame,
    [fadeOutAt - 12, fadeOutAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.55) 60%, rgba(10,9,7,0.85) 100%)",
        opacity: fade,
        padding: 64,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 18,
        fontFamily: FONT_DISPLAY,
      }}
    >
      <div
        style={{
          fontSize: 18,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: BRAND.accent,
          opacity: introSub,
          transform: `translateY(${interpolate(introSub, [0, 1], [16, 0])}px)`,
        }}
      >
        Brickwise
      </div>
      <h1
        style={{
          fontSize: 132,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          fontWeight: 800,
          color: BRAND.text,
          margin: 0,
          opacity: introTitle,
          transform: `translateY(${interpolate(introTitle, [0, 1], [40, 0])}px)`,
          textShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 44,
            lineHeight: 1.25,
            color: BRAND.textMuted,
            margin: 0,
            maxWidth: "80%",
            opacity: introSub,
            transform: `translateY(${interpolate(introSub, [0, 1], [24, 0])}px)`,
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
}
