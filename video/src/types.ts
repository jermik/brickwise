// Reusable video config types. Each template exports one of these via
// calculateMetadata or as a constant; the Root composes them into
// Remotion <Composition> registrations.

export type Platform = "tiktok" | "instagram_reels" | "youtube_shorts" | "linkedin";

export interface Subtitle {
  /** Inclusive start, milliseconds from video start. */
  startMs: number;
  /** Exclusive end, milliseconds from video start. */
  endMs: number;
  text: string;
}

export interface ZoomFocus {
  /** 0..1 — fraction of width where the zoom is centred. */
  x: number;
  /** 0..1 — fraction of height where the zoom is centred. */
  y: number;
  /** Final zoom factor (1 = no zoom, 1.4 = 40% closer). */
  scale: number;
}

export interface HighlightRect {
  /** 0..1 fractions of the 1080x1920 canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export type SceneEffect = "neutral" | "zoom" | "highlight";

export interface SceneConfig {
  /** Frame the scene starts (relative to composition start). */
  startFrame: number;
  /** Frame the scene ends (exclusive). */
  endFrame: number;
  effect?: SceneEffect;
  zoom?: ZoomFocus;
  highlight?: HighlightRect;
  /** Optional bold caption shown above the demo for this scene only. */
  bigCaption?: string;
}

export interface VideoConfig {
  id: string;
  title: string;
  hookText: string;
  hookSubtext?: string;
  ctaText: string;
  ctaSubtext?: string;
  platform: Platform;
  fps: number;
  width: number;
  height: number;
  durationFrames: number;

  /** Path passed to staticFile(). Defaults to demo/raw-demo.mp4. */
  videoSrc: string;
  /** Crop the source clip — seconds from start of the source MP4. */
  videoStartSec: number;
  /** Crop the source clip — seconds from start of the source MP4. */
  videoEndSec: number;

  scenes: SceneConfig[];
  subtitles: Subtitle[];

  /** Frame to use as the social-share thumbnail. */
  thumbnailFrame?: number;
}
