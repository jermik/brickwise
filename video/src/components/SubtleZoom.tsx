import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface SubtleZoomProps {
  /** Starting scale (default 1). */
  fromScale?: number;
  /** End scale (default 1.08 — barely perceptible push-in). */
  toScale?: number;
  /** 0..1 fraction of canvas width where the zoom is anchored. */
  originX?: number;
  /** 0..1 fraction of canvas height where the zoom is anchored. */
  originY?: number;
  children: React.ReactNode;
}

/**
 * Slow ken-burns wrapper. Scales children linearly from `fromScale` to
 * `toScale` across the entire parent <Sequence>. Designed to be
 * visually subtle — adds creator-style motion without competing with
 * the underlying footage.
 */
export function SubtleZoom({
  fromScale = 1,
  toScale = 1.08,
  originX = 0.5,
  originY = 0.5,
  children,
}: SubtleZoomProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [fromScale, toScale],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: `${originX * 100}% ${originY * 100}%`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
