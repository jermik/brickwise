import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { VideoConfig } from "../types";
import { BRAND } from "../config/brand";
import { HookOverlay } from "../components/HookOverlay";
import { AnimatedCaptions } from "../components/AnimatedCaption";
import { CTACard } from "../components/CTACard";
import { ProgressBar } from "../components/ProgressBar";
import { SceneRenderer } from "../components/SceneRenderer";

const FPS = 30;
const SECONDS = 45;
const TOTAL = FPS * SECONDS; // 1350

export const AISalesResearcherConfig: VideoConfig = {
  id: "ai-sales-researcher",
  title: "I built an AI sales researcher",
  hookText: "I built an AI sales researcher",
  hookSubtext: "It does the boring part for me.",
  ctaText: "Try it free",
  ctaSubtext: "brickwise.pro — no credit card",
  platform: "youtube_shorts",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL,
  videoSrc: "demo/raw-demo.mp4",
  videoStartSec: 0,
  videoEndSec: 38,
  thumbnailFrame: 60,
  // Coordinates below are 0..1 fractions of the desktop CARD (not canvas).
  scenes: [
    // Hook — first 4s
    { startFrame: 0, endFrame: 4 * FPS, effect: "neutral" },

    // Discovery search — zoom the top of the card
    {
      startFrame: 4 * FPS,
      endFrame: 14 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.18, scale: 1.14 },
      bigCaption: "Searches local businesses",
    },

    // Auto-audit running — highlight a results-row strip mid card
    {
      startFrame: 14 * FPS,
      endFrame: 24 * FPS,
      effect: "highlight",
      highlight: { x: 0.04, y: 0.4, w: 0.92, h: 0.2 },
      bigCaption: "Audits each website",
    },

    // Scores / proposal preview — zoom the lower half of the card
    {
      startFrame: 24 * FPS,
      endFrame: 34 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.7, scale: 1.16 },
      bigCaption: "Writes the outreach",
    },

    // Pre-CTA breath
    { startFrame: 34 * FPS, endFrame: 39 * FPS, effect: "neutral" },
  ],
  subtitles: [
    { startMs: 200, endMs: 4_000, text: "I built an AI sales researcher." },
    { startMs: 4_500, endMs: 8_500, text: "It searches local businesses by niche." },
    { startMs: 9_000, endMs: 13_500, text: "Pulls Google rating, website, phone." },
    { startMs: 14_000, endMs: 18_500, text: "Audits each homepage in 2 seconds." },
    { startMs: 19_000, endMs: 23_500, text: "Detects 27 signals from raw HTML." },
    { startMs: 24_000, endMs: 29_000, text: "Then writes the outreach email." },
    { startMs: 29_500, endMs: 34_000, text: "EN and NL. Calm and human." },
    { startMs: 34_500, endMs: 38_500, text: "I just review and send." },
  ],
};

interface Props {
  config?: VideoConfig;
}

export function AISalesResearcher({
  config = AISalesResearcherConfig,
}: Props) {
  const { fps } = useVideoConfig();
  const ctaStart = 39 * fps;
  const ctaLen = 6 * fps;

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={ctaStart}>
        <SceneRenderer config={config} />
      </Sequence>

      <Sequence from={0} durationInFrames={4 * fps}>
        <HookOverlay
          title={config.hookText}
          subtitle={config.hookSubtext}
          fadeOutAt={4 * fps - 4}
        />
      </Sequence>

      <Sequence from={0} durationInFrames={ctaStart}>
        <AnimatedCaptions subtitles={config.subtitles} position="bottom" />
      </Sequence>

      <Sequence from={ctaStart} durationInFrames={ctaLen}>
        <CTACard title={config.ctaText} subtitle={config.ctaSubtext} />
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
}
