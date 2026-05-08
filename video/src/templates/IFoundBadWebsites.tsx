import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { VideoConfig } from "../types";
import { BRAND } from "../config/brand";
import { HookOverlay } from "../components/HookOverlay";
import { AnimatedCaptions } from "../components/AnimatedCaption";
import { CTACard } from "../components/CTACard";
import { ProgressBar } from "../components/ProgressBar";
import { SceneRenderer } from "../components/SceneRenderer";

const FPS = 30;
const SECONDS = 30;
const TOTAL = FPS * SECONDS; // 900

export const IFoundBadWebsitesConfig: VideoConfig = {
  id: "i-found-bad-websites",
  title: "I found 47 bad websites today",
  hookText: "I found 47 bad websites today",
  hookSubtext: "in Rotterdam alone",
  ctaText: "Want yours scanned?",
  ctaSubtext: "Free audit. No pitch. Just findings.",
  platform: "tiktok",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL,
  videoSrc: "demo/raw-demo.mp4",
  videoStartSec: 0,
  videoEndSec: 22, // we crop the source to 22s and overlay across 30s
  thumbnailFrame: 30,
  scenes: [
    // Hook — first ~5s, demo idles behind
    { startFrame: 0, endFrame: 5 * FPS, effect: "neutral" },
    // Discovery — show find-businesses search and results (medium zoom)
    {
      startFrame: 5 * FPS,
      endFrame: 14 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.36, scale: 1.18 },
      bigCaption: "Search by niche + city",
    },
    // Spotlight one card with star rating + website
    {
      startFrame: 14 * FPS,
      endFrame: 22 * FPS,
      effect: "highlight",
      highlight: { x: 0.06, y: 0.42, w: 0.88, h: 0.18 },
      bigCaption: "Spot the weak websites",
    },
    // Pre-CTA breath
    { startFrame: 22 * FPS, endFrame: 25 * FPS, effect: "neutral" },
  ],
  subtitles: [
    { startMs: 200, endMs: 4_500, text: "I found 47 bad websites today" },
    { startMs: 5_000, endMs: 8_500, text: "All in one Rotterdam search." },
    { startMs: 9_000, endMs: 13_000, text: "Each one a sales lead." },
    { startMs: 14_000, endMs: 18_500, text: "Brickwise scores them in seconds." },
    { startMs: 19_000, endMs: 22_500, text: "Then writes the outreach." },
  ],
};

interface Props {
  config?: VideoConfig;
}

export function IFoundBadWebsites({
  config = IFoundBadWebsitesConfig,
}: Props) {
  const { fps } = useVideoConfig();
  const ctaStart = 25 * fps;
  const ctaLen = 5 * fps;

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* Demo background — runs the whole video */}
      <Sequence from={0} durationInFrames={ctaStart}>
        <SceneRenderer config={config} />
      </Sequence>

      {/* Hook overlay (first 5s) */}
      <Sequence from={0} durationInFrames={5 * fps}>
        <HookOverlay
          title={config.hookText}
          subtitle={config.hookSubtext}
          fadeOutAt={5 * fps - 4}
        />
      </Sequence>

      {/* Captions — overlay across the demo portion only */}
      <Sequence from={0} durationInFrames={ctaStart}>
        <AnimatedCaptions subtitles={config.subtitles} position="bottom" />
      </Sequence>

      {/* CTA */}
      <Sequence from={ctaStart} durationInFrames={ctaLen}>
        <CTACard title={config.ctaText} subtitle={config.ctaSubtext} />
      </Sequence>

      {/* Progress bar — runs always */}
      <ProgressBar />
    </AbsoluteFill>
  );
}

