import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ZoomFocus } from "../types";
import { EASE } from "../config/brand";

interface ZoomBoxProps {
  focus: ZoomFocus;
  /** Frame the zoom should reach full scale at, relative to the parent <Sequence>. */
  reachAtFrame?: number;
  children: React.ReactNode;
}

/**
 * Smoothly zooms its children toward `focus`. Mounted inside a <Sequence>
 * so its `useCurrentFrame()` is local to the scene, not the whole video.
 */
export function ZoomBox({ focus, reachAtFrame = 18, children }: ZoomBoxProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame,
    fps,
    durationInFrames: reachAtFrame,
    config: EASE,
  });
  const scale = interpolate(progress, [0, 1], [1, focus.scale]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
