import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../config/brand";
import { PhoneDemoLayer } from "../components/PhoneDemoLayer";
import { HookOverlay } from "../components/HookOverlay";
import { CTACard } from "../components/CTACard";
import { ProgressBar } from "../components/ProgressBar";

// ─────────────────────────────────────────────────────────────────────────
// 32-second vertical phone-demo video.
//
// Structure (sequential audio, phone footage runs muted underneath):
//   0s …  3s   intro voice   + hook overlay
//   3s … 26s   main voice    + raw phone demo (subtitled)
//  26s … 32s   ending voice  + CTA card
//
// All assets live under public/assets/video/. Existing desktop-footage
// templates remain registered but unused by this composition.
// ─────────────────────────────────────────────────────────────────────────

const FPS = 30;
const DURATION_SEC = 32;
const TOTAL = FPS * DURATION_SEC; // 960

const INTRO_DURATION_SEC = 3;
const MAIN_END_SEC = 26;
const CTA_LEN_SEC = DURATION_SEC - MAIN_END_SEC; // 6s

export const PhoneDemo32sConfig = {
  id: "phone-demo-32s",
  title: "Brickwise 32-second phone demo",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL,
} as const;

export function PhoneDemo32s() {
  const { fps } = useVideoConfig();

  const introFrames = INTRO_DURATION_SEC * fps;
  const mainStart = introFrames;
  const mainFrames = MAIN_END_SEC * fps - introFrames;
  const ctaStart = MAIN_END_SEC * fps;
  const ctaFrames = CTA_LEN_SEC * fps;

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* Phone footage runs underneath the entire 32s, muted. */}
      <PhoneDemoLayer src="assets/video/footage/raw-phone-demo.mp4" muted />

      {/* ── Audio: sequential voice clips ─────────────────────────────── */}
      <Sequence from={0} durationInFrames={introFrames}>
        <Audio src={staticFile("assets/video/voice/intro-voice.mp3")} />
      </Sequence>
      <Sequence from={mainStart} durationInFrames={mainFrames}>
        <Audio src={staticFile("assets/video/voice/main-voice.mp4")} />
      </Sequence>
      <Sequence from={ctaStart} durationInFrames={ctaFrames}>
        <Audio src={staticFile("assets/video/voice/ending-voice.mp4")} />
      </Sequence>

      {/* ── Hook overlay during the intro voice ───────────────────────── */}
      <Sequence from={0} durationInFrames={introFrames}>
        <HookOverlay
          title="Brickwise"
          subtitle="Find local businesses with bad websites. Audit them in seconds."
          fadeOutAt={introFrames - 6}
        />
      </Sequence>

      {/* ── CTA card during the ending voice ──────────────────────────── */}
      <Sequence from={ctaStart} durationInFrames={ctaFrames}>
        <CTACard
          title="Try it free"
          subtitle="brickwise.pro — no credit card"
        />
      </Sequence>

      {/* Retention bar across the whole thing */}
      <ProgressBar />
    </AbsoluteFill>
  );
}
