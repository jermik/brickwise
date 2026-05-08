import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ZoomFocus } from "../types";
import { EASE } from "../config/brand";
import { DEMO_CARD } from "./DemoLayer";

interface ZoomBoxProps {
  focus: ZoomFocus;
  /** Frame the zoom should reach full scale at, relative to the parent <Sequence>. */
  reachAtFrame?: number;
  children: React.ReactNode;
}

/**
 * Smoothly zooms its children toward `focus`. `focus.x` and `focus.y`
 * are interpreted as 0..1 fractions of the demo CARD region (not the
 * canvas) so the operator can reason in card space — the wrapper
 * translates back to canvas-relative transform-origin.
 */
export function ZoomBox({ focus, reachAtFrame = 18, children }: ZoomBoxProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const progress = spring({
    frame,
    fps,
    durationInFrames: reachAtFrame,
    config: EASE,
  });
  const scale = interpolate(progress, [0, 1], [1, focus.scale]);

  // Card-relative focus → canvas pixel → canvas percent for transform-origin.
  const originXpx = DEMO_CARD.x + focus.x * DEMO_CARD.w;
  const originYpx = DEMO_CARD.y + focus.y * DEMO_CARD.h;
  const originXpct = (originXpx / width) * 100;
  const originYpct = (originYpx / height) * 100;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: `${originXpct}% ${originYpct}%`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
