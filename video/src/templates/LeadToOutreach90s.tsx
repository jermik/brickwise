import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { VideoConfig } from "../types";
import { BRAND } from "../config/brand";
import { HookOverlay } from "../components/HookOverlay";
import { AnimatedCaptions } from "../components/AnimatedCaption";
import { CTACard } from "../components/CTACard";
import { ProgressBar } from "../components/ProgressBar";
import { SceneRenderer } from "../components/SceneRenderer";

const FPS = 30;
const SECONDS = 90;
const TOTAL = FPS * SECONDS; // 2700

export const LeadToOutreach90sConfig: VideoConfig = {
  id: "lead-to-outreach-90s",
  title: "Lead to outreach in 90 seconds",
  hookText: "Lead. Audit. Email.",
  hookSubtext: "All in 90 seconds, with proof.",
  ctaText: "Watch how it works",
  ctaSubtext: "brickwise.pro",
  platform: "instagram_reels",
  fps: FPS,
  width: 1080,
  height: 1920,
  durationFrames: TOTAL,
  videoSrc: "demo/raw-demo.mp4",
  videoStartSec: 0,
  videoEndSec: 78,
  thumbnailFrame: 90,
  scenes: [
    // Hook — first 6s, demo barely visible behind
    { startFrame: 0, endFrame: 6 * FPS, effect: "neutral" },

    // Phase 1 — Discovery (search results)
    {
      startFrame: 6 * FPS,
      endFrame: 22 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.34, scale: 1.16 },
      bigCaption: "1. Find local businesses",
    },

    // Phase 2 — Auto-audit running
    {
      startFrame: 22 * FPS,
      endFrame: 40 * FPS,
      effect: "highlight",
      highlight: { x: 0.06, y: 0.18, w: 0.88, h: 0.34 },
      bigCaption: "2. Auto-audit the website",
    },

    // Phase 3 — Audit results / scoring
    {
      startFrame: 40 * FPS,
      endFrame: 58 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.55, scale: 1.22 },
      bigCaption: "3. Score every signal",
    },

    // Phase 4 — Proposal package
    {
      startFrame: 58 * FPS,
      endFrame: 72 * FPS,
      effect: "highlight",
      highlight: { x: 0.04, y: 0.12, w: 0.92, h: 0.7 },
      bigCaption: "4. Generate the proposal",
    },

    // Phase 5 — Send email
    {
      startFrame: 72 * FPS,
      endFrame: 84 * FPS,
      effect: "zoom",
      zoom: { x: 0.5, y: 0.68, scale: 1.2 },
      bigCaption: "5. Send the email",
    },
  ],
  subtitles: [
    { startMs: 200, endMs: 5_500, text: "Lead to outreach in 90 seconds." },
    { startMs: 6_200, endMs: 12_000, text: "Step 1. Find businesses by niche + city." },
    { startMs: 12_500, endMs: 21_000, text: "Google rating, website, phone — already there." },
    { startMs: 22_000, endMs: 30_000, text: "Step 2. The auto-audit fetches the site." },
    { startMs: 30_500, endMs: 39_000, text: "It detects 27 signals in under 2 seconds." },
    { startMs: 40_000, endMs: 48_000, text: "Step 3. Every signal gets scored." },
    { startMs: 48_500, endMs: 57_000, text: "Mobile, conversion, local SEO, trust." },
    { startMs: 58_000, endMs: 66_000, text: "Step 4. Proposal package writes itself." },
    { startMs: 66_500, endMs: 71_000, text: "EN and NL, no AI dashes." },
    { startMs: 72_000, endMs: 78_500, text: "Step 5. Send the email — one click." },
    { startMs: 79_000, endMs: 83_500, text: "Manual review. No bulk send." },
  ],
};

interface Props {
  config?: VideoConfig;
}

export function LeadToOutreach90s({
  config = LeadToOutreach90sConfig,
}: Props) {
  const { fps } = useVideoConfig();
  const ctaStart = 84 * fps;
  const ctaLen = 6 * fps;

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={ctaStart}>
        <SceneRenderer config={config} />
      </Sequence>

      <Sequence from={0} durationInFrames={6 * fps}>
        <HookOverlay
          title={config.hookText}
          subtitle={config.hookSubtext}
          fadeOutAt={6 * fps - 4}
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
