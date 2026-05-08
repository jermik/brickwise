import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { BRAND } from "../config/brand";

// ─────────────────────────────────────────────────────────────────────────
// Faster-paced cut of the raw phone footage. No overlays, no captions,
// no voice, no music, no effects — just a uniform speed bump so the
// 46-second source feels more dynamic at ~33 seconds.
//
// Timing math:
//   SOURCE_DURATION_SEC = 46
//   PLAYBACK_RATE = 1.4
//   final length = 46 / 1.4 = 32.86 s
//   composition frames = round(32.86 * 30) = 986
//
// playbackRate is applied by OffthreadVideo — the same source plays
// 40% faster across the whole clip, no jarring cuts. Audio is muted
// because the spec said no voiceover / music.
// ─────────────────────────────────────────────────────────────────────────

const FPS = 30;
const SOURCE_DURATION_SEC = 46;
const PLAYBACK_RATE = 1.4;
const FINAL_SEC = SOURCE_DURATION_SEC / PLAYBACK_RATE; // ≈ 32.857
const TOTAL_FRAMES = Math.round(FINAL_SEC * FPS); // 986

export const FastCutFootageConfig = {
  id: "fast-cut-footage",
  title: "Phone footage — fast-paced cut",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL_FRAMES,
  playbackRate: PLAYBACK_RATE,
  finalSeconds: FINAL_SEC,
} as const;

export function FastCutFootage() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("assets/video/footage/raw-phone-demo.mp4")}
        playbackRate={PLAYBACK_RATE}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
}
