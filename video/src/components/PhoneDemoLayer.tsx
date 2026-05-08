import { OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { BRAND } from "../config/brand";

/**
 * Phone-mode demo layer. The source recording is already 9:16 vertical
 * (iPhone screen capture), so we fill the canvas directly with a
 * cover-fit. No blurred backdrop, no card framing — those were for
 * letterboxing 16:9 desktop footage into a 9:16 frame.
 */
interface PhoneDemoLayerProps {
  /** staticFile path inside public/. */
  src: string;
  /** Crop the source clip — seconds from start. */
  startSec?: number;
  /** Crop the source clip — seconds from start. */
  endSec?: number;
  /** Whether the underlying video's audio should be muted (we play voice over). */
  muted?: boolean;
  /** OffthreadVideo playbackRate. 1.0 = real-time, >1 = sped up. */
  playbackRate?: number;
}

export function PhoneDemoLayer({
  src,
  startSec = 0,
  endSec,
  muted = true,
  playbackRate = 1,
}: PhoneDemoLayerProps) {
  const { fps } = useVideoConfig();
  const startFrom = Math.round(startSec * fps);
  const endAt = endSec != null ? Math.round(endSec * fps) : undefined;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: BRAND.bg,
        overflow: "hidden",
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        endAt={endAt}
        muted={muted}
        playbackRate={playbackRate}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
