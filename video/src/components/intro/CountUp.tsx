import { interpolate, useCurrentFrame } from "remotion";

interface CountUpProps {
  /** Final value to count to. */
  to: number;
  /** Frames to reach the final value. */
  durationInFrames?: number;
  /** Optional suffix (e.g. " sites"). */
  suffix?: string;
  /** Optional prefix (e.g. "$" or "€"). */
  prefix?: string;
  /** Starting frame offset for the count. Use to delay. */
  startFrame?: number;
}

/**
 * Visible counter that ticks rapidly from 0 to `to` over the configured
 * frame window, then holds. Used on the FakeDashboard "47 sites
 * scanned" beat so the dashboard reveal feels kinetic rather than static.
 */
export function CountUp({
  to,
  durationInFrames = 18,
  suffix = "",
  prefix = "",
  startFrame = 0,
}: CountUpProps) {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const value = Math.round(
    interpolate(local, [0, durationInFrames], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <>
      {prefix}
      {value}
      {suffix}
    </>
  );
}
