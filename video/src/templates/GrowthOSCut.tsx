import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { BRAND } from "../config/brand";
import { PhoneDemoLayer } from "../components/PhoneDemoLayer";
import { SubtleZoom } from "../components/SubtleZoom";
import { CreatorCTA } from "../components/CreatorCTA";
import { ProgressBar } from "../components/ProgressBar";
import { AnimatedCaptions } from "../components/AnimatedCaption";
import { HookSequence } from "../components/intro/HookSequence";
import type { Subtitle } from "../types";

// ─────────────────────────────────────────────────────────────────────────
// GrowthOS — voiceover-driven creator cut, 41.91s total.
//
// Beat map (30 FPS, 1257 frames):
//
//   0.00 →  6.00 s   HookSequence (kinetic typography, no real footage)
//                     intro-voice.mp3 plays 0.00 → 3.00 s under the hook
//   6.00 → 36.91 s   Phone footage at 1.488× + main voiceover + captions
//                     (raw 46s recording → 30.91s to fit voice)
//  36.91 → 41.91 s   Subtle creator CTA — "Interested? · DM me 'GrowthOS'"
//
// Target audience: web design agencies / freelancers. The hook
// emotionally communicates "agencies waste hours; this tool does it
// automatically." GrowthOS branding only.
// ─────────────────────────────────────────────────────────────────────────

const FPS = 30;

const HOOK_SEC = 6;
const VOICE_DURATION_SEC = 30.91; // probed via mp3-duration on audio crm mikey.mp3
const SOURCE_DURATION_SEC = 46;
const PHONE_PLAYBACK_RATE = SOURCE_DURATION_SEC / VOICE_DURATION_SEC; // ≈ 1.488
const CTA_LEN_SEC = 5;
const TOTAL_SEC = HOOK_SEC + VOICE_DURATION_SEC + CTA_LEN_SEC;
const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS); // 1257

export const GrowthOSCutConfig = {
  id: "growthos-cut",
  title: "GrowthOS — voiceover-driven cut with 6s hook",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL_FRAMES,
  hookSec: HOOK_SEC,
  voiceSec: VOICE_DURATION_SEC,
  phonePlaybackRate: PHONE_PLAYBACK_RATE,
} as const;

// Section-tag captions for the main section (relative to that section's
// 0 = composition's 6.0 s). Replace with real transcript-timed lines
// when the script is shared.
const SECTION_TAGS: Subtitle[] = [
  { startMs: 600,    endMs: 6_500,  text: "Find local businesses" },
  { startMs: 6_800,  endMs: 14_500, text: "Spot the weak websites" },
  { startMs: 14_800, endMs: 22_500, text: "Audit them in seconds" },
  { startMs: 22_800, endMs: 30_500, text: "Send the outreach" },
];

export function GrowthOSCut() {
  const { fps } = useVideoConfig();
  const hookFrames = Math.round(HOOK_SEC * fps);
  const voiceFrames = Math.round(VOICE_DURATION_SEC * fps);
  const mainStart = hookFrames;
  const ctaStart = hookFrames + voiceFrames;
  const ctaLen = Math.round(CTA_LEN_SEC * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* ── 0–6 s · Aggressive SaaS-TikTok hook ─────────────────────── */}
      <Sequence from={0} durationInFrames={hookFrames}>
        <HookSequence />
      </Sequence>

      {/* Hook audio — intro-voice anchors emotional first half of the hook */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <Audio src={staticFile("assets/video/voice/intro-voice.mp3")} />
      </Sequence>

      {/* ── 6 s onwards · Phone footage with subtle ken-burns ───────── */}
      <Sequence from={mainStart} durationInFrames={voiceFrames}>
        <SubtleZoom fromScale={1} toScale={1.08}>
          <PhoneDemoLayer
            src="assets/video/footage/raw-phone-demo.mp4"
            playbackRate={PHONE_PLAYBACK_RATE}
            muted
          />
        </SubtleZoom>
      </Sequence>

      {/* Main voiceover — drives the timing of the footage section. */}
      <Sequence from={mainStart} durationInFrames={voiceFrames}>
        <Audio src={staticFile("assets/video/voice/main-voiceover.mp3")} />
      </Sequence>

      {/* Section-tag captions — placeholder until transcript is wired. */}
      <Sequence from={mainStart} durationInFrames={voiceFrames}>
        <AnimatedCaptions subtitles={SECTION_TAGS} position="bottom" />
      </Sequence>

      {/* ── End · Subtle creator CTA ────────────────────────────────── */}
      <Sequence from={ctaStart} durationInFrames={ctaLen}>
        <CreatorCTA
          question="Interested?"
          cta="DM me 'GrowthOS'"
          buildNote="Building this for agencies"
        />
      </Sequence>

      {/* Retention progress thread across the whole 41.9 s. */}
      <ProgressBar />
    </AbsoluteFill>
  );
}
