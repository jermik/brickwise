import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { VideoConfig } from "../types";
import { BRAND } from "../config/brand";

/**
 * Where the desktop card sits inside the 1080×1920 canvas.
 * Source assumed 16:9, so a 1080-wide card is 1080×608.
 *
 * We bias slightly above true centre — leaves more bottom space for
 * captions (the loudest piece of UI on short-form), less top space
 * for the hook overlay (which is large but only on screen briefly).
 *
 * Highlight + zoom coordinates are interpreted as 0..1 fractions of
 * THIS rect, not the canvas. Templates therefore "reason in card
 * space" and don't need to know the geometry.
 */
export const DEMO_CARD = {
  x: 0,
  y: 480,
  w: 1080,
  h: 608,
} as const;

interface DemoLayerProps {
  config: VideoConfig;
}

/**
 * Two-layer composition:
 *   1. Blurred + dimmed full-canvas duplicate behind, slightly scaled
 *      and animated for life.
 *   2. Foreground "desktop card" with the entire 16:9 UI visible
 *      (object-fit: contain inside a fixed 16:9 rect — never crops).
 *
 * Renders the same video twice; OffthreadVideo handles concurrent
 * decode of the same source efficiently.
 */
export function DemoLayer({ config }: DemoLayerProps) {
  const { fps } = useVideoConfig();
  const startFrom = Math.round(config.videoStartSec * fps);
  const endAt = Math.round(config.videoEndSec * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* Background — heavily blurred + dimmed. Scaled up to hide blur edges. */}
      <OffthreadVideo
        src={staticFile(config.videoSrc)}
        startFrom={startFrom}
        endAt={endAt}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(48px) brightness(0.42) saturate(1.1)",
          transform: "scale(1.18)",
          transformOrigin: "center center",
        }}
      />

      {/* Subtle vignette so the card pops over the blur. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Foreground card — the entire desktop UI, never cropped. */}
      <div
        style={{
          position: "absolute",
          left: DEMO_CARD.x,
          top: DEMO_CARD.y,
          width: DEMO_CARD.w,
          height: DEMO_CARD.h,
          overflow: "hidden",
          borderRadius: 28,
          border: `1px solid ${BRAND.border}`,
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
          background: BRAND.surface,
        }}
      >
        <OffthreadVideo
          src={staticFile(config.videoSrc)}
          startFrom={startFrom}
          endAt={endAt}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            background: BRAND.bg,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
