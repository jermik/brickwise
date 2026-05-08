import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../config/brand";
import { IntroSequence } from "../components/intro/IntroSequence";
import { PhoneDemoLayer } from "../components/PhoneDemoLayer";
import { CreatorCTA } from "../components/CreatorCTA";
import { ProgressBar } from "../components/ProgressBar";

// ─────────────────────────────────────────────────────────────────────────
// GrowthOS short — 38s vertical short-form video.
//
// Beat map @ 30 FPS (1140 frames total):
//
//   0.0s  →  6.0s      INTRO motion graphics (no real footage)
//                       intro-voice plays over 0.0s → 3.0s
//   6.0s  →  32.0s     Real phone footage, intro-voice tail bridge
//                       (3.0–6.0s of intro-voice carried under intro
//                        for emotional anchor; main-voice plays from
//                        6.0s onward)
//   32.0s →  38.0s     Creator-style CTA + ending-voice
//
// Phone footage runs muted underneath the main section. ProgressBar
// runs the whole 38s.
// ─────────────────────────────────────────────────────────────────────────

const FPS = 30;
const DURATION_SEC = 38;
const TOTAL = FPS * DURATION_SEC; // 1140

const INTRO_END_SEC = 6;
const MAIN_END_SEC = 32;
const CTA_LEN_SEC = DURATION_SEC - MAIN_END_SEC; // 6

export const GrowthOSShortConfig = {
  id: "growthos-short",
  title: "GrowthOS — short-form 38s",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL,
} as const;

export function GrowthOSShort() {
  const { fps } = useVideoConfig();

  const introEnd = INTRO_END_SEC * fps;
  const mainEnd = MAIN_END_SEC * fps;
  const mainLen = mainEnd - introEnd;
  const ctaStart = mainEnd;
  const ctaLen = CTA_LEN_SEC * fps;

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* ── 0–6s · INTRO motion graphics ─────────────────────────────── */}
      <Sequence from={0} durationInFrames={introEnd}>
        <IntroSequence />
      </Sequence>

      {/* ── 6–32s · Real phone footage (muted) ───────────────────────── */}
      <Sequence from={introEnd} durationInFrames={mainLen}>
        <PhoneDemoLayer
          src="assets/video/footage/raw-phone-demo.mp4"
          startSec={0}
          endSec={MAIN_END_SEC - INTRO_END_SEC}
          muted
        />
      </Sequence>

      {/* ── Audio track 1 · intro-voice (0–3s, anchors the hook) ─────── */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <Audio src={staticFile("assets/video/voice/intro-voice.mp3")} />
      </Sequence>

      {/* ── Audio track 2 · main-voice (6–32s) ──────────────────────── */}
      <Sequence from={introEnd} durationInFrames={mainLen}>
        <Audio src={staticFile("assets/video/voice/main-voice.mp4")} />
      </Sequence>

      {/* ── 32–38s · Creator CTA + ending-voice ──────────────────────── */}
      <Sequence from={ctaStart} durationInFrames={ctaLen}>
        <CreatorCTA
          question="Want this system?"
          cta="DM me 'GrowthOS'"
          buildNote="Building this for agencies"
        />
        <Audio src={staticFile("assets/video/voice/ending-voice.mp4")} />
      </Sequence>

      {/* Retention bar across the whole 38s */}
      <ProgressBar />
    </AbsoluteFill>
  );
}
