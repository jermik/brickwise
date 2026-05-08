import { OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import type { VideoConfig } from "../types";

interface DemoLayerProps {
  config: VideoConfig;
}

/**
 * Wraps <OffthreadVideo> for the raw screen recording. Crops with
 * startFrom/endAt so each template can pick a different slice from the
 * same source MP4. Cover-fits to the vertical 1080x1920 canvas.
 */
export function DemoLayer({ config }: DemoLayerProps) {
  const { fps } = useVideoConfig();
  return (
    <OffthreadVideo
      src={staticFile(config.videoSrc)}
      startFrom={Math.round(config.videoStartSec * fps)}
      endAt={Math.round(config.videoEndSec * fps)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      muted
    />
  );
}
