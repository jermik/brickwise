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
import type { Subtitle } from "../types";

// ─────────────────────────────────────────────────────────────────────────
// GrowthOS — creator-style cut driven by the new voice-over MP3.
//
// Audio (audio crm mikey.mp3, probed at 30.91s) plays from 0..30.91s.
// Phone footage (raw 46s recording) is sped up to 1.49x so it fits
// the voice timing without surgical cuts. Subtle ken-burns push-in
// (1.0 → 1.08) runs the whole footage section. CTA card sits at the
// end (30.91 → 36.0s) so the voice has clean run-out, then the
// subtle "Want this system?" pill lands.
//
// Section-tag captions are placeholders — they're regular short
// labels that mark beats. Replace with real transcript-timed
// captions once the operator shares the script.
// ─────────────────────────────────────────────────────────────────────────

const FPS = 30;

const VOICE_DURATION_SEC = 30.91; // probed via mp3-duration
const SOURCE_DURATION_SEC = 46;
const PHONE_PLAYBACK_RATE = SOURCE_DURATION_SEC / VOICE_DURATION_SEC; // ≈ 1.488
const CTA_LEN_SEC = 5;
const TOTAL_SEC = VOICE_DURATION_SEC + CTA_LEN_SEC;
const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS); // 1077

export const GrowthOSCutConfig = {
  id: "growthos-cut",
  title: "GrowthOS — voiceover-driven cut",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL_FRAMES,
  voiceSec: VOICE_DURATION_SEC,
  phonePlaybackRate: PHONE_PLAYBACK_RATE,
} as const;

// Section-tag captions. Distributed evenly across the voice. Replace
// these with real transcript-timed lines once the script is available.
const SECTION_TAGS: Subtitle[] = [
  { startMs: 600,    endMs: 6_500,  text: "Find local businesses" },
  { startMs: 6_800,  endMs: 14_500, text: "Spot the weak websites" },
  { startMs: 14_800, endMs: 22_500, text: "Audit them in seconds" },
  { startMs: 22_800, endMs: 30_500, text: "Send the outreach" },
];

export function GrowthOSCut() {
  const { fps } = useVideoConfig();
  const voiceFrames = Math.round(VOICE_DURATION_SEC * fps);
  const ctaStart = voiceFrames;
  const ctaLen = Math.round(CTA_LEN_SEC * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* Phone footage with subtle ken-burns push-in, runs under the voice. */}
      <Sequence from={0} durationInFrames={voiceFrames}>
        <SubtleZoom fromScale={1} toScale={1.08}>
          <PhoneDemoLayer
            src="assets/video/footage/raw-phone-demo.mp4"
            playbackRate={PHONE_PLAYBACK_RATE}
            muted
          />
        </SubtleZoom>
      </Sequence>

      {/* Real voiceover — drives the entire timeline. */}
      <Sequence from={0} durationInFrames={voiceFrames}>
        <Audio src={staticFile("assets/video/voice/main-voiceover.mp3")} />
      </Sequence>

      {/* Section-tag captions — placeholder cadence until transcript is wired. */}
      <Sequence from={0} durationInFrames={voiceFrames}>
        <AnimatedCaptions subtitles={SECTION_TAGS} position="bottom" />
      </Sequence>

      {/* Subtle creator-style CTA. */}
      <Sequence from={ctaStart} durationInFrames={ctaLen}>
        <CreatorCTA
          question="Interested?"
          cta="DM me 'GrowthOS'"
          buildNote="Building this for agencies"
        />
      </Sequence>

      {/* Retention progress thread. */}
      <ProgressBar />
    </AbsoluteFill>
  );
}
