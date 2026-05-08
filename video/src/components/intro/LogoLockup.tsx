import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, FONT_DISPLAY } from "../../config/brand";

interface LogoLockupProps {
  text?: string;
  /** When the lockup should start fading out (frames into its <Sequence>). */
  fadeOutAt?: number;
}

/**
 * Big GROWTHOS wordmark that punches in letter-by-letter with a stiff
 * spring. Each letter has a 2-frame stagger and an orange neon glow.
 * Used inside the first ~1.2s of the intro.
 */
export function LogoLockup({ text = "GROWTHOS", fadeOutAt = 999_999 }: LogoLockupProps) {
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
        gap: 24,
        opacity: fade,
      }}
    >
      <h1
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 168,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          color: BRAND.text,
          margin: 0,
          display: "flex",
          gap: 6,
          textShadow: `0 0 24px ${BRAND.accent}, 0 0 64px rgba(245,158,11,0.35)`,
        }}
      >
        {text.split("").map((char, i) => {
          const local = frame - i * 2;
          const enter = spring({
            frame: local,
            fps,
            durationInFrames: 18,
            config: { damping: 200, stiffness: 360, mass: 0.5 },
          });
          const scale = interpolate(enter, [0, 1], [1.6, 1]);
          const blur = interpolate(enter, [0, 1], [10, 0]);
          return (
            <span
              key={`${char}-${i}`}
              style={{
                display: "inline-block",
                opacity: enter,
                transform: `scale(${scale})`,
                filter: `blur(${blur}px)`,
                willChange: "transform, opacity, filter",
              }}
            >
              {char}
            </span>
          );
        })}
      </h1>
    </AbsoluteFill>
  );
}
