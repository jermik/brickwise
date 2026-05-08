import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Subtitle } from "../types";
import { BRAND, EASE, FONT_DISPLAY } from "../config/brand";

interface AnimatedCaptionsProps {
  subtitles: Subtitle[];
  /** Where on the canvas to anchor the caption stack. */
  position?: "bottom" | "centre";
}

/**
 * Creator-style caption track. One <Sequence> per subtitle, each fades
 * + slides in. ms-based timings let the operator paste straight from
 * the subtitle data Brickwise's content engine already produces.
 */
export function AnimatedCaptions({
  subtitles,
  position = "bottom",
}: AnimatedCaptionsProps) {
  const { fps } = useVideoConfig();
  return (
    <>
      {subtitles.map((s, i) => {
        const startFrame = Math.round((s.startMs / 1000) * fps);
        const durationFrames = Math.max(
          1,
          Math.round(((s.endMs - s.startMs) / 1000) * fps),
        );
        return (
          <Sequence
            key={`${s.startMs}-${i}`}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <CaptionLine text={s.text} position={position} />
          </Sequence>
        );
      })}
    </>
  );
}

function CaptionLine({
  text,
  position,
}: {
  text: string;
  position: "bottom" | "centre";
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, durationInFrames: 8, config: EASE });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translate = interpolate(enter, [0, 1], [22, 0]);

  return (
    <AbsoluteFill
      style={{
        padding: 64,
        display: "flex",
        flexDirection: "column",
        justifyContent: position === "bottom" ? "flex-end" : "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 64,
          lineHeight: 1.1,
          fontWeight: 800,
          color: BRAND.text,
          background: "rgba(10, 9, 7, 0.78)",
          border: `1px solid ${BRAND.border}`,
          padding: "18px 28px",
          borderRadius: 18,
          maxWidth: "92%",
          textAlign: "center",
          letterSpacing: "-0.02em",
          opacity,
          transform: `translateY(${translate}px)`,
          textShadow: "0 4px 18px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}
