// ─────────────────────────────────────────────────────────────────────────
// Voiceover + timing architecture
//
// Deterministic preparation layer for TTS rendering. No external APIs, no
// MP3 generation, no randomness. Given a content package's RenderScene[],
// produces a complete VoiceoverTrack with per-segment timing estimates,
// pre/post pauses, emphasis weighting, and platform-tuned pacing.
//
// Future TTS providers (OpenAI, ElevenLabs) plug in by:
//   1. Reading track.segments[].text and track.voiceStyle / voiceProvider
//   2. Generating audio per segment (or one combined file with timestamps)
//   3. Writing segment.audioUrl back onto the track
//   4. If the provider returns actual word/segment timings (ElevenLabs
//      does), overwriting `estimatedDurationMs` with `actualDurationMs`
//      so subtitles re-align to the real render
// ─────────────────────────────────────────────────────────────────────────

import type {
  ContentPlatform,
  RenderScene,
  SceneRole,
} from "./types";

// ── Voice style + provider ────────────────────────────────────────────────

export type VoiceStyle =
  | "energetic"        // high-energy, hook-friendly, sells urgency
  | "documentary"      // measured, authoritative, even cadence
  | "direct_response"  // punchy, sales-driven, marketing tone
  | "calm_authority";  // slow, confident, premium feel

export type VoiceProvider = "openai" | "elevenlabs" | "none";

// ── Pacing primitives ─────────────────────────────────────────────────────

export interface PlatformPacingPreset {
  /** Base words-per-minute for the *platform default* style. */
  wordsPerMinute: number;
  /** Per-punctuation silences (ms). */
  commaPauseMs: number;
  periodPauseMs: number;
  ellipsisPauseMs: number;
  dashPauseMs: number;
  /** Sentence-boundary buffer added between consecutive segments. */
  pauseBetweenSentencesMs: number;
  /** Default voice style assigned to a track when not overridden. */
  defaultVoiceStyle: VoiceStyle;
}

export const PACING_PRESETS: Record<ContentPlatform, PlatformPacingPreset> = {
  // TikTok rewards a fast, energetic hook + sustained pace.
  tiktok: {
    wordsPerMinute: 190,
    commaPauseMs: 130,
    periodPauseMs: 320,
    ellipsisPauseMs: 550,
    dashPauseMs: 220,
    pauseBetweenSentencesMs: 80,
    defaultVoiceStyle: "energetic",
  },
  // Reels: slightly more variety than TikTok, cinematic moments OK.
  instagram_reels: {
    wordsPerMinute: 170,
    commaPauseMs: 150,
    periodPauseMs: 360,
    ellipsisPauseMs: 580,
    dashPauseMs: 240,
    pauseBetweenSentencesMs: 120,
    defaultVoiceStyle: "energetic",
  },
  // Shorts: closer to YouTube long-form pacing.
  youtube_shorts: {
    wordsPerMinute: 165,
    commaPauseMs: 160,
    periodPauseMs: 380,
    ellipsisPauseMs: 600,
    dashPauseMs: 250,
    pauseBetweenSentencesMs: 140,
    defaultVoiceStyle: "documentary",
  },
  // LinkedIn: professional, calmer cadence — viewers value clarity.
  linkedin: {
    wordsPerMinute: 145,
    commaPauseMs: 180,
    periodPauseMs: 450,
    ellipsisPauseMs: 700,
    dashPauseMs: 300,
    pauseBetweenSentencesMs: 200,
    defaultVoiceStyle: "calm_authority",
  },
  // X: snappy, almost conversational.
  x: {
    wordsPerMinute: 180,
    commaPauseMs: 140,
    periodPauseMs: 340,
    ellipsisPauseMs: 560,
    dashPauseMs: 230,
    pauseBetweenSentencesMs: 100,
    defaultVoiceStyle: "direct_response",
  },
};

// Per-role speed multiplier (1.0 = normal, <1 = slower, >1 = faster).
// Slower delivery on data + audit + cta scenes for emphasis and clarity.
const ROLE_SPEED_MULTIPLIER: Record<SceneRole, number> = {
  hook: 1.0,
  setup: 1.0,
  demo: 1.0,
  story: 1.0,
  transition: 1.05,
  audit: 0.95,
  data: 0.95,
  cta: 0.9,
};

// Voice style override per role — softens the platform default where
// useful (e.g. CTA always lands better with calm_authority regardless
// of platform).
const ROLE_VOICE_STYLE: Partial<Record<SceneRole, VoiceStyle>> = {
  cta: "direct_response",
};

// ── Segment / track / timing types ────────────────────────────────────────

export interface VoiceoverSegment {
  id: string;                    // `${sceneId}_seg${order}`
  sceneId: string;               // owning scene's RenderScene.id
  sceneOrder: number;            // 1-based
  order: number;                 // 1-based within the scene
  text: string;                  // exact spoken text
  emphasisWords: string[];       // subset of scene.emphasisWords appearing here
  speedMultiplier: number;       // playback speed vs. platform base
  preDelayMs: number;            // silence BEFORE this segment
  postDelayMs: number;           // silence AFTER this segment
  estimatedDurationMs: number;   // text duration alone (excludes pre/post)
  /** Cumulative offset from the START of the track at which this segment
   *  begins speaking. Updated when the track is assembled. */
  trackOffsetMs: number;
  /** Filled in by the TTS render step later. Until then = estimate. */
  actualDurationMs?: number;
  /** TTS asset URL, set after rendering audio. */
  audioUrl?: string;
  voiceStyle: VoiceStyle;
  voiceProvider: VoiceProvider;
}

export interface SceneTiming {
  sceneId: string;
  sceneOrder: number;
  /** Voiceover start offset relative to the SCENE's local time. */
  voiceoverStartMs: number;
  /** Voiceover end offset relative to the SCENE's local time. */
  voiceoverEndMs: number;
  /** Held silence at the end of the scene (after voiceover). */
  pauseAfterMs: number;
  /** Subtitle cues already aligned to the segments — drop these straight
   *  into a Remotion subtitle layer or convert to SRT. */
  subtitleCues: { startMs: number; endMs: number; text: string }[];
}

export interface VoiceoverTrack {
  platform: ContentPlatform;
  voiceStyle: VoiceStyle;
  voiceProvider: VoiceProvider;
  pacing: PlatformPacingPreset;
  segments: VoiceoverSegment[];
  /** Total length of the voiceover audio (sum of segment durations + pauses). */
  totalDurationMs: number;
  /** Per-scene timing — same length and order as the source RenderScene[]. */
  sceneTimings: SceneTiming[];
}

// ── Helpers ───────────────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/** Split a voiceover text into sentence-shaped segments. Keeps trailing
 *  punctuation; merges very short fragments back into the previous one
 *  so we don't end up with 1-word "Yes." segments unless intentional. */
function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Split on sentence-end punctuation, keeping the punctuation attached.
  const raw = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [trimmed];
  const out: string[] = [];
  for (const piece of raw) {
    const cleaned = piece.trim();
    if (!cleaned) continue;
    if (cleaned.split(/\s+/).length < 3 && out.length > 0) {
      out[out.length - 1] = `${out[out.length - 1]} ${cleaned}`;
    } else {
      out.push(cleaned);
    }
  }
  return out;
}

export interface EstimateOptions {
  pacing: PlatformPacingPreset;
  speedMultiplier?: number;
  emphasisWords?: string[];
  /** Multiplier applied to base word duration for each emphasised
   *  occurrence. Default 1.3 (30 % longer). */
  emphasisDurationMultiplier?: number;
}

/**
 * Deterministic duration estimate for spoken text. Counts words, applies
 * platform pacing (WPM + punctuation pauses), then layers in emphasis
 * weighting. Returns whole milliseconds.
 */
export function estimateVoiceDuration(
  text: string,
  opts: EstimateOptions,
): number {
  if (!text.trim()) return 0;
  const speed = opts.speedMultiplier ?? 1;
  const wpm = opts.pacing.wordsPerMinute * speed;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const baseMs = (words.length / wpm) * 60000;

  const commas = (text.match(/,/g) ?? []).length;
  const periods = (text.match(/[.!?]/g) ?? []).length;
  const ellipses = (text.match(/\.{3}|…/g) ?? []).length;
  const dashes = (text.match(/—|--/g) ?? []).length;
  const pauseMs =
    commas * opts.pacing.commaPauseMs +
    periods * opts.pacing.periodPauseMs +
    ellipses * opts.pacing.ellipsisPauseMs +
    dashes * opts.pacing.dashPauseMs;

  const emphMul = opts.emphasisDurationMultiplier ?? 1.3;
  const emphasisCount = (opts.emphasisWords ?? []).reduce((acc, word) => {
    if (!word) return acc;
    const rx = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
    return acc + ((text.match(rx) ?? []).length);
  }, 0);
  const wordMs = 60000 / wpm;
  const emphasisMs = emphasisCount * wordMs * (emphMul - 1);

  return Math.round(baseMs + pauseMs + emphasisMs);
}

export interface SplitOptions {
  pacing: PlatformPacingPreset;
  voiceStyle: VoiceStyle;
  voiceProvider: VoiceProvider;
}

/**
 * Split a single scene's voiceover into one or more `VoiceoverSegment`s.
 * Each sentence becomes a segment; emphasis words from the scene are
 * filtered down to those that actually appear in each segment. Pre- and
 * post-segment silences default to the platform's `pauseBetweenSentencesMs`
 * (with the FIRST segment having `preDelayMs = 0` and the LAST carrying
 * the scene's `pauseAfter` as post-delay).
 */
export function splitVoiceoverSegments(
  scene: RenderScene,
  opts: SplitOptions,
): VoiceoverSegment[] {
  const role: SceneRole = scene.visualConfig?.role ?? "demo";
  const speedMultiplier = ROLE_SPEED_MULTIPLIER[role] ?? 1.0;
  const voiceStyle = ROLE_VOICE_STYLE[role] ?? opts.voiceStyle;

  const sentences = splitIntoSentences(scene.voiceover);
  const sceneEmphasis = scene.emphasisWords ?? [];

  return sentences.map((text, i): VoiceoverSegment => {
    const order = i + 1;
    const segmentEmphasis = sceneEmphasis.filter((w) => {
      if (!w) return false;
      const rx = new RegExp(`\\b${escapeRegex(w)}\\b`, "i");
      return rx.test(text);
    });

    const estimatedDurationMs = estimateVoiceDuration(text, {
      pacing: opts.pacing,
      speedMultiplier,
      emphasisWords: segmentEmphasis,
    });

    const isFirst = i === 0;
    const isLast = i === sentences.length - 1;
    const preDelayMs = isFirst ? 0 : opts.pacing.pauseBetweenSentencesMs;
    const postDelayMs = isLast
      ? Math.round((scene.pauseAfter ?? 0) * 1000)
      : 0;

    return {
      id: `${scene.id}_seg${String(order).padStart(2, "0")}`,
      sceneId: scene.id,
      sceneOrder: scene.order,
      order,
      text,
      emphasisWords: segmentEmphasis,
      speedMultiplier,
      preDelayMs,
      postDelayMs,
      estimatedDurationMs,
      trackOffsetMs: 0, // filled in by buildVoiceoverTrack
      voiceStyle,
      voiceProvider: opts.voiceProvider,
    };
  });
}

/**
 * Compute scene-local timing metadata from its assembled segments. Returns
 * absolute-within-scene timestamps (ms) plus pre-aligned subtitle cues
 * that any subtitle layer (Remotion, SRT export, etc.) can consume directly.
 */
export function calculateSceneTiming(
  scene: RenderScene,
  segments: VoiceoverSegment[],
): SceneTiming {
  // Voiceover starts at scene-local time 0 by default. Each segment's
  // start/end is relative to the scene start.
  let cursorMs = 0;
  const cues: SceneTiming["subtitleCues"] = [];

  for (const seg of segments) {
    cursorMs += seg.preDelayMs;
    const startMs = cursorMs;
    cursorMs += seg.estimatedDurationMs;
    const endMs = cursorMs;
    cues.push({ startMs, endMs, text: seg.text });
    cursorMs += seg.postDelayMs;
  }

  const voiceoverStartMs = segments.length > 0 ? segments[0].preDelayMs : 0;
  const voiceoverEndMs =
    segments.length > 0
      ? cursorMs - (segments[segments.length - 1].postDelayMs ?? 0)
      : 0;
  const pauseAfterMs = segments.length > 0
    ? segments[segments.length - 1].postDelayMs
    : 0;

  return {
    sceneId: scene.id,
    sceneOrder: scene.order,
    voiceoverStartMs,
    voiceoverEndMs,
    pauseAfterMs,
    subtitleCues: cues,
  };
}

export interface BuildTrackOptions {
  platform: ContentPlatform;
  voiceStyle?: VoiceStyle;
  voiceProvider?: VoiceProvider;
}

/**
 * Top-level entry point: produce a complete VoiceoverTrack for an entire
 * RenderScene[]. Walks the scenes in order, splits each into segments,
 * assigns track-level offsets, and computes per-scene timing metadata.
 */
export function buildVoiceoverTrack(
  scenes: RenderScene[],
  opts: BuildTrackOptions,
): VoiceoverTrack {
  const pacing = PACING_PRESETS[opts.platform];
  const voiceStyle = opts.voiceStyle ?? pacing.defaultVoiceStyle;
  const voiceProvider: VoiceProvider = opts.voiceProvider ?? "none";

  const allSegments: VoiceoverSegment[] = [];
  const sceneTimings: SceneTiming[] = [];
  let trackCursorMs = 0;

  for (const scene of scenes) {
    const sceneSegments = splitVoiceoverSegments(scene, {
      pacing,
      voiceStyle,
      voiceProvider,
    });

    // Assign track-level cumulative offsets to each segment.
    for (const seg of sceneSegments) {
      trackCursorMs += seg.preDelayMs;
      seg.trackOffsetMs = trackCursorMs;
      trackCursorMs += seg.estimatedDurationMs + seg.postDelayMs;
      allSegments.push(seg);
    }

    sceneTimings.push(calculateSceneTiming(scene, sceneSegments));
  }

  return {
    platform: opts.platform,
    voiceStyle,
    voiceProvider,
    pacing,
    segments: allSegments,
    totalDurationMs: trackCursorMs,
    sceneTimings,
  };
}
