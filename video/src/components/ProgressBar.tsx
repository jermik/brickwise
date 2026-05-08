import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../config/brand";

/**
 * Thin orange progress bar pinned to the bottom of the canvas. Shows
 * how far through the composition we are — gives the viewer a
 * "you're almost there" cue that lifts retention on Reels / Shorts.
 */
export function ProgressBar() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 6,
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 6,
          width: `${pct * 100}%`,
          background: BRAND.accent,
          boxShadow: `0 -2px 14px ${BRAND.accent}`,
        }}
      />
    </AbsoluteFill>
  );
}
