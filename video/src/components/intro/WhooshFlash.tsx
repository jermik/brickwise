import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND } from "../../config/brand";

interface WhooshFlashProps {
  /** Tint of the flash. Defaults to brand orange. */
  color?: string;
  /** How many frames the flash lasts inside its <Sequence>. */
  durationFrames?: number;
}

/**
 * Brief orange flash + chromatic shift used as the transition out of
 * the kinetic intro into the real footage. Drop into a short
 * <Sequence>; the flash peaks at frame 4–6 and fades to nothing by
 * the end.
 */
export function WhooshFlash({
  color = BRAND.accent,
  durationFrames = 12,
}: WhooshFlashProps) {
  const frame = useCurrentFrame();
  const peakAt = Math.round(durationFrames * 0.4);
  const opacity = interpolate(
    frame,
    [0, peakAt, durationFrames],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scale = interpolate(
    frame,
    [0, durationFrames],
    [1, 1.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        background: color,
        mixBlendMode: "screen",
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    />
  );
}
