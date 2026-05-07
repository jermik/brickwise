// Content engine types — short-form video demo packages.
// Pure templating, no external API. Substitution via generator.ts.

export type ContentPlatform =
  | "tiktok"
  | "instagram_reels"
  | "youtube_shorts"
  | "linkedin"
  | "x";

export type ContentStatus =
  | "idea"
  | "scripted"
  | "recorded"
  | "edited"
  | "posted";

export type ContentAngle =
  | "discovery_leads"
  | "audit_breakdown"
  | "proposal_flow"
  | "full_workflow"
  | "freelancer_education"
  | "growthos_overview";

// ── Scene schema ───────────────────────────────────────────────────────────
//
// `ScriptScene` is the minimal narrative shape (6 fields). `RenderScene`
// extends it with Remotion-render-ready metadata: visual sources, animations,
// transitions, audio assets, CTA semantics. Every render field is optional
// so legacy rows still parse cleanly. New generations populate as much as
// the template specifies; assets get filled in later by the render pipeline.

export interface ScriptScene {
  scene: number;
  startSeconds: number;
  endSeconds: number;
  onscreenText: string;
  voiceover: string;
  bRoll: string;
}

export type VisualType =
  // ── Step 2 base set ────────────────────────────────────────────────────
  | "screen_recording"   // operator-recorded screen capture
  | "screenshot"          // static product image
  | "stock_footage"       // sourced from stock library
  | "talking_head"        // operator on camera
  | "text_card"           // pure text on solid/gradient background
  | "broll_montage"       // multi-clip mix
  | "product_demo"        // GrowthOS UI capture, tied to route
  | "image_grid"          // composed grid of images / cards
  // ── Step 3 visual intelligence variants ────────────────────────────────
  | "google_maps"         // map view of the city / business location
  | "website_scroll"      // scrolling capture of a prospect's site
  | "website_audit"       // audit panel with annotations / scores
  | "title_card"          // bold title slate (hook / chapter break)
  | "city_broll"          // generic city/locality footage
  | "analytics_overlay"   // numbers / charts / score rings overlay
  | "mobile_recording"    // mobile-frame capture of a site or app
  | "text_only"           // text-on-background composition
  | "cta"                 // dedicated CTA scene
  | "split_screen"        // two visuals side-by-side
  | "browser_navigation"; // cursor-driven UI walk-through

export type SceneTransition =
  | "cut"
  | "fade"
  | "slide_left"
  | "slide_right"
  | "slide_up"
  | "slide_down"
  | "zoom_in"
  | "zoom_out"
  | "whip_pan"
  | "glitch";

export type EntryAnimation =
  | "none"
  | "fade_in"
  | "slide_up"
  | "slide_down"
  | "slide_left"
  | "slide_right"
  | "scale_in"
  | "type_on"
  | "blur_in"
  | "spring_pop";

export type ExitAnimation =
  | "none"
  | "fade_out"
  | "slide_up"
  | "slide_down"
  | "scale_out"
  | "blur_out";

export type OverlayPosition =
  | "top"
  | "top_left"
  | "top_right"
  | "center"
  | "bottom"
  | "bottom_left"
  | "bottom_right"
  | "lower_third";

export type SubtitleStyle = "default" | "burned_in" | "karaoke" | "minimal";

export type CtaType =
  | "none"
  | "follow"
  | "comment"
  | "link_in_bio"
  | "save"
  | "share"
  | "dm"
  | "subscribe"
  | "connect";

// ── Camera direction ───────────────────────────────────────────────────────
//
// Maps to a CSS transform interpolation in Remotion. The scene component
// reads this and applies the corresponding `interpolate(useCurrentFrame(), ...)`
// driven transform on its visual element.

export type CameraDirection =
  | "static"
  | "zoom_in"
  | "zoom_out"
  | "pan_left"
  | "pan_right"
  | "dolly_in"
  | "dolly_out"
  | "ken_burns"
  | "parallax_left"
  | "parallax_right"
  | "shake";

// ── Animation type ─────────────────────────────────────────────────────────
//
// A scene-level motion *preset* — sits above the per-element entry/exit
// animations. The Remotion scene component picks an orchestration based on
// this value (e.g. `stagger_in` reveals text lines one at a time; `counter_up`
// drives a number animation; `highlight` paints a yellow marker behind
// `emphasisWords`).

export type AnimationType =
  | "none"
  | "stagger_in"
  | "ken_burns"
  | "counter_up"
  | "highlight"
  | "parallax"
  | "pulse"
  | "typewriter"
  | "spring_pop";

// ── Sound effect ───────────────────────────────────────────────────────────
//
// Short SFX cue layered over the voiceover at `soundEffectAtMs`. The
// rendering pipeline maps each enum to a static asset URL (sourced from a
// curated library; not user-supplied). `none` skips the layer entirely.

export type SoundEffect =
  | "none"
  | "whoosh"
  | "ding"
  | "pop"
  | "click"
  | "impact"
  | "transition"
  | "success"
  | "alert"
  | "ambient_drone";

// ── Visual intelligence (Step 3) ──────────────────────────────────────────
//
// `SceneVisualConfig` is a structured superset of the flat render fields on
// `RenderScene`. The generator computes it deterministically per (template,
// scene index, total scenes) — no randomness, no AI, fully reproducible.
// The legacy `visualType` / `transitionType` / `overlayText` fields on
// RenderScene are kept and mirrored from the config for ergonomic access.

/** Per-scene narrative role. Drives default visual assignment. */
export type SceneRole =
  | "hook"          // opening — pattern interrupt
  | "setup"         // context / step intro
  | "demo"          // product walkthrough
  | "data"          // numbers / scores / results
  | "audit"         // prospect-site critique
  | "story"         // narrative beat
  | "transition"    // bridge between sections
  | "cta";          // closing call-to-action

/** Pacing intensity — drives cut frequency + visual energy. */
export type PacingIntensity = "low" | "medium" | "high";

/** Animation suggestion for the scene's primary element. */
export type AnimationHint =
  | "zoom_in"
  | "fast_cut"
  | "pan"
  | "shake"
  | "subtitle_pop"
  | "highlight_circle"
  | "cursor_focus";

/** Transition suggestion between scenes (Step 3 short list). */
export type TransitionHint =
  | "hard_cut"
  | "blur"
  | "swipe"
  | "zoom_transition"
  | "flash";

export interface OverlayHeadline {
  text: string;
  position?: OverlayPosition;
  style?: "default" | "bold" | "outlined";
}

export interface StatCallout {
  label: string;             // e.g. "leads"
  value: string;             // e.g. "20"
  position?: OverlayPosition;
}

export interface CtaOverlay {
  text: string;              // e.g. "Link in bio"
  ctaType: CtaType;
  emphasis?: boolean;
}

export interface SceneSourceHints {
  stockFootageQuery?: string;
  screenshotPath?: string;
  routePath?: string;        // GrowthOS route to record (e.g. /crm/discovery)
  websiteUrl?: string;       // prospect site for audit/scroll/mobile
  location?: string;         // for google_maps / city_broll (e.g. "Rotterdam")
}

export interface SceneVisualConfig {
  visualType: VisualType;
  role: SceneRole;

  animation: { hint?: AnimationHint; durationMs?: number };
  transition: { hint?: TransitionHint; durationMs?: number };

  pacing: {
    intensity: PacingIntensity;
    retentionScore: number;        // 0–100
    patternInterrupt: boolean;
  };

  overlays: {
    headline?: OverlayHeadline;
    statistics?: StatCallout[];
    cta?: CtaOverlay;
  };

  sourceHints?: SceneSourceHints;
}

export interface SubtitleCue {
  startMs: number;
  endMs: number;
  text: string;
}

export interface RecordingTrim {
  startMs: number;
  endMs: number;
}

export interface RenderScene extends ScriptScene {
  // ── Identity ────────────────────────────────────────────────────────────
  // Stable, deterministic intra-idea identifier. Format: `scene_NNN`.
  // Used for diffing across regenerations and for joining to render-output
  // artifacts later (audio file URLs, recording captures, render logs).
  id: string;

  // Explicit zero-based... wait no, 1-based ordering. Same as `scene` but
  // named more clearly. Kept alongside `scene` (legacy) for back-compat.
  order: number;

  // Convenience (= endSeconds - startSeconds), denormalised for Remotion ergonomics.
  durationSeconds: number;

  // ── Audio ───────────────────────────────────────────────────────────────
  voiceoverAudioUrl?: string;          // mp3/wav after TTS render
  voiceoverVoiceId?: string;           // ElevenLabs / OpenAI TTS voice id
  voiceoverSpeed?: number;             // 0.85 – 1.2 typical
  voiceoverStartOffsetMs?: number;     // delay voiceover within the scene

  // ── Subtitles ───────────────────────────────────────────────────────────
  subtitleText?: string;               // word-perfect subtitle (defaults to voiceover)
  subtitleStyle?: SubtitleStyle;
  subtitleCueSplits?: SubtitleCue[];   // pre-split cues with ms timing

  // ── Overlay text (separate from subtitles) ─────────────────────────────
  overlayText?: string;                // big visible text on top of visual
  overlayPosition?: OverlayPosition;
  overlayEntry?: EntryAnimation;
  overlayExit?: ExitAnimation;
  overlayStartMs?: number;
  overlayDurationMs?: number;

  // ── Visual content ──────────────────────────────────────────────────────
  visualType?: VisualType;
  visualEntry?: EntryAnimation;
  visualExit?: ExitAnimation;

  // For visualType = stock_footage
  stockFootageQuery?: string;
  stockFootageUrl?: string;
  stockFootageProvider?: string;       // 'pexels' | 'pixabay' | 'storyblocks' …

  // For visualType = screen_recording | screenshot | product_demo
  screenshotUrl?: string;
  recordingUrl?: string;
  recordingTrim?: RecordingTrim;
  productRoutePath?: string;           // hint for what to record (e.g. "/crm/discovery")

  // ── Transition into this scene (from previous) ─────────────────────────
  // Default: "cut" between scenes (set by the generator). First scene's
  // value is `undefined` because there's no preceding scene to transition
  // from.
  transitionType?: SceneTransition;
  transitionDurationMs?: number;

  // ── CTA semantics (typically only on the final scene) ──────────────────
  ctaType?: CtaType;
  ctaTargetUrl?: string;

  // ── Camera + scene-level motion ────────────────────────────────────────
  cameraDirection?: CameraDirection;
  animationType?: AnimationType;

  // ── Voiceover styling hints ────────────────────────────────────────────
  // Words/phrases to emphasise in the subtitle/overlay rendering. Rendered
  // as bold or highlighted spans (paired with `animationType: "highlight"`
  // for the marker effect). Compared case-insensitively, whole-word match.
  emphasisWords?: string[];

  // ── Per-scene sound effect ─────────────────────────────────────────────
  soundEffect?: SoundEffect;
  soundEffectAtMs?: number;            // offset from scene start (default 0)

  // ── Pause after voiceover ──────────────────────────────────────────────
  // Held-frame time AT THE END of the scene, after the voiceover finishes
  // and before the outgoing transition begins. Expressed in seconds for
  // unit-consistency with `durationSeconds` (fractional values like 0.5
  // are fine). Counted WITHIN the scene's own duration — does NOT extend
  // `durationSeconds`. Use to give a beat for emphasis.
  pauseAfter?: number;

  // ── Escape hatch for future Remotion props ─────────────────────────────
  remotionProps?: Record<string, unknown>;

  // ── Visual intelligence (Step 3) ───────────────────────────────────────
  // Structured visual config — deterministically assigned by the generator
  // based on template + scene role. The flat fields above (`visualType`,
  // `transitionType`, `overlayText`, `cameraDirection`, `animationType`)
  // are mirrored from this config for ergonomic access by Remotion
  // components that don't need the full structure.
  visualConfig?: SceneVisualConfig;
}

// ─────────────────────────────────────────────────────────────────────────
// Helper functions — pure, no side effects, safe to import anywhere.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Coerce a scene from any historical shape into a fully-populated
 * `RenderScene`. Reads from `store.ts` use this to normalise legacy rows
 * (which lack `id`, `order`, `durationSeconds`) without a DB migration.
 */
export function coerceRenderScene(
  raw: Partial<RenderScene> & ScriptScene,
  fallbackOrder: number,
): RenderScene {
  const order = raw.order ?? raw.scene ?? fallbackOrder;
  const id = raw.id ?? `scene_${String(order).padStart(3, "0")}`;
  const duration =
    raw.durationSeconds ??
    Math.max(0, (raw.endSeconds ?? 0) - (raw.startSeconds ?? 0));
  return {
    ...raw,
    id,
    order,
    scene: raw.scene ?? order,
    durationSeconds: duration,
  };
}

/**
 * Total clip duration in milliseconds, including any held `pauseAfter`.
 * Use this when computing the parent `<Composition durationInFrames={...}>`
 * value once you wire Remotion in.
 */
export function getTotalRenderDurationMs(scenes: RenderScene[]): number {
  return scenes.reduce(
    (acc, s) => acc + s.durationSeconds * 1000 + (s.pauseAfter ?? 0) * 1000,
    0,
  );
}

/** Lookup by stable scene id. */
export function getSceneById(
  scenes: RenderScene[],
  id: string,
): RenderScene | undefined {
  return scenes.find((s) => s.id === id);
}

/**
 * Convert a scene's seconds-based timing into Remotion's frame-based
 * timing for the configured fps. Used by the eventual `<Sequence>` wrappers.
 */
export function sceneToRemotionTiming(
  scene: RenderScene,
  fps: number,
): {
  startFrame: number;
  durationFrames: number;
  transitionFrames: number;
  pauseFrames: number;
} {
  return {
    startFrame: Math.round(scene.startSeconds * fps),
    durationFrames: Math.round(scene.durationSeconds * fps),
    transitionFrames: Math.round(((scene.transitionDurationMs ?? 0) / 1000) * fps),
    pauseFrames: Math.round((scene.pauseAfter ?? 0) * fps),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Worked examples — these are real, type-checked instances of the schema.
// Importable for unit tests / fixtures / doc generation. Not consumed at
// runtime by app code.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Example single render-ready scene. Demonstrates every supported field.
 * Mirrors what `generateContent({ angle: "discovery_leads", ... })` would
 * produce for the hook scene of Template A.
 */
export const EXAMPLE_RENDER_SCENE: RenderScene = {
  // Identity + ordering
  id: "scene_001",
  order: 1,
  scene: 1,

  // Timing
  startSeconds: 0,
  endSeconds: 3,
  durationSeconds: 3,
  pauseAfter: 0.3,

  // Narrative
  onscreenText: "20 GYMS · ROTTERDAM · 2 MIN",
  voiceover:
    "I just found 20 gyms in Rotterdam whose websites could be losing them clients — and it took 2 minutes.",
  bRoll: "Screen recording: GrowthOS Discovery filter form opens",

  // Subtitles
  subtitleText:
    "I just found 20 gyms in Rotterdam whose websites could be losing them clients — and it took 2 minutes.",
  subtitleStyle: "burned_in",

  // Overlay
  overlayText: "20 GYMS\nROTTERDAM\n2 MIN",
  overlayPosition: "center",
  overlayEntry: "spring_pop",
  overlayExit: "fade_out",

  // Visual
  visualType: "screen_recording",
  visualEntry: "fade_in",
  productRoutePath: "/crm/discovery",

  // Camera + scene-level motion
  cameraDirection: "zoom_in",
  animationType: "spring_pop",
  emphasisWords: ["20", "Rotterdam", "2 minutes"],

  // Sound
  soundEffect: "impact",
  soundEffectAtMs: 0,

  // Transition (first scene → no incoming transition)
  transitionType: undefined,
  transitionDurationMs: undefined,

  // No CTA on the hook scene
  ctaType: undefined,
};

/**
 * Example fully-normalised content package — what the API returns from
 * `POST /api/content/generate` once it's wired up. Truncated to two
 * scenes for brevity; real packages have 4–6.
 */
export const EXAMPLE_CONTENT_PACKAGE: ContentPackage = {
  title: "I found 20 gyms in Rotterdam with bad websites — in 2 minutes",
  hook:
    "I just found 20 gyms in Rotterdam whose websites could be losing them clients — and it took me 2 minutes.",
  scriptScenes: [
    EXAMPLE_RENDER_SCENE,
    {
      id: "scene_002",
      order: 2,
      scene: 2,
      startSeconds: 3,
      endSeconds: 12,
      durationSeconds: 9,
      onscreenText: "1. Pick country + city + niche",
      voiceover: "I picked the country, the city Rotterdam, and the niche gym.",
      bRoll: "Discovery filter being filled in",
      overlayText: "1. Pick country + city + niche",
      overlayPosition: "top",
      overlayEntry: "slide_down",
      visualType: "product_demo",
      productRoutePath: "/crm/discovery",
      transitionType: "fade",
      transitionDurationMs: 250,
      cameraDirection: "static",
      animationType: "stagger_in",
    },
  ],
  voiceover:
    "I just found 20 gyms in Rotterdam whose websites could be losing them clients — and it took 2 minutes. I picked the country, the city Rotterdam, and the niche gym.",
  subtitlesSrt:
    "1\n00:00:00,000 --> 00:00:01,500\nI just found 20 gyms in Rotterdam whose websites could be losing\n\n2\n00:00:01,500 --> 00:00:03,000\nthem clients — and it took 2 minutes.\n",
  captionsPlain:
    "I just found 20 gyms in Rotterdam whose websites could be losing them clients — and it took 2 minutes.\n\nI picked the country, the city Rotterdam, and the niche gym.",
  caption:
    "20 local gyms in Rotterdam with website gaps — found in 2 minutes 🎯\n\nThis is what GrowthOS does: pulls local businesses from public data, audits their sites, and shows you who actually needs help.",
  hashtags:
    "#localbusiness #freelance #webdesign #localseo #agencylife #freelancer #agency #leadgen",
  cta: "Link in bio. Try GrowthOS for your city.",
  thumbnailText: "20 GYMS\nROTTERDAM",
  pinnedComment:
    "Q&A coming next — drop your city + niche below 👇 (this is for personalised outreach, not bulk spam)",
  durationSeconds: 60,
  retentionNotes:
    "Hook in first 3s names a number + place + time (pattern interrupt). Show real screen recording, not stock. Save the CTA for the last 5s.",
};

// ─────────────────────────────────────────────────────────────────────────
// Remotion compatibility map (informational — for the eventual renderer).
//
// Each RenderScene field maps to a concrete Remotion primitive:
//
//   id                       → Sequence/Component key
//   order, durationSeconds   → <Sequence from durationInFrames={fps * d}>
//   voiceoverAudioUrl        → <Audio src={...} startFrom={offsetFrames}>
//   subtitleCueSplits        → nested <Sequence> per cue + <SubtitleLayer>
//   subtitleText             → fallback single-cue subtitle
//   subtitleStyle            → CSS variant on <SubtitleLayer>
//   overlayText / *Position  → animated <Text> with interpolate driven by
//   overlayEntry / overlayExit  useCurrentFrame()
//   visualType               → switches between <Video>, <Img>,
//                              <ScreenRecording>, <TextCard> components
//   stockFootageUrl          → <Video src={...}> source
//   screenshotUrl            → <Img src={...}> source
//   recordingUrl             → <Video src={...}> source
//   transitionType +         → @remotion/transitions linearTiming +
//   transitionDurationMs        named preset (cut/fade/slide_*/zoom_*)
//   cameraDirection          → CSS transform interpolation
//                              (translate/scale) over the scene
//   animationType            → orchestration preset on the scene component
//                              (stagger_in / counter_up / highlight / etc.)
//   emphasisWords            → wraps matching tokens in styled <span>
//                              inside subtitle/overlay rendering
//   soundEffect +            → <Audio src={SFX_LIBRARY[soundEffect]}
//   soundEffectAtMs              startFrom={msToFrames(at)}>
//   pauseAfter               → padding frames before the next transition
//   ctaType                  → switch on type → <CtaCard variant={ctaType}>
//   ctaTargetUrl             → href on the CTA component (visual only —
//                              videos can't link, this is shown as text)
//   remotionProps            → spread into the scene component:
//                              <Scene {...remotionProps} />
//
// Frames-per-second (fps) lives at the parent <Composition> level, not
// per-scene — the Remotion convention. The schema stores all timing in
// seconds/ms so a single content package can render at 30/60/etc. fps
// without changes.
// ─────────────────────────────────────────────────────────────────────────

export interface ContentPackage {
  title: string;
  hook: string;
  scriptScenes: RenderScene[];
  voiceover: string;
  subtitlesSrt: string;
  captionsPlain: string;
  caption: string;
  hashtags: string;
  cta: string;
  thumbnailText: string;
  pinnedComment: string;
  durationSeconds: number;
  retentionNotes: string;
  /**
   * Voiceover track + per-scene timing metadata (Step 4). Deterministically
   * derived from `scriptScenes` at generation time. Until TTS is wired in,
   * `segments[].audioUrl` is undefined and segment durations are estimates.
   * See `lib/crm/content/voiceover.ts`.
   */
  voiceoverTrack?: import("./voiceover").VoiceoverTrack;
}

export interface ContentIdea extends ContentPackage {
  id: string;
  platform: ContentPlatform;
  audience: string;
  niche: string;
  city: string;
  angle: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateContentInput {
  platform: ContentPlatform;
  audience: string;
  niche: string;
  city: string;
  angle: ContentAngle;
}

// ── Constants for UI dropdowns ─────────────────────────────────────────────

export const CONTENT_PLATFORMS: {
  value: ContentPlatform;
  label: string;
  lengthHint: string;
  captionMaxChars: number;
  hashtagMax: number;
}[] = [
  { value: "tiktok", label: "TikTok", lengthHint: "21–60s", captionMaxChars: 300, hashtagMax: 8 },
  { value: "instagram_reels", label: "Instagram Reels", lengthHint: "30–60s", captionMaxChars: 2200, hashtagMax: 12 },
  { value: "youtube_shorts", label: "YouTube Shorts", lengthHint: "30–60s", captionMaxChars: 5000, hashtagMax: 6 },
  { value: "linkedin", label: "LinkedIn", lengthHint: "60–90s", captionMaxChars: 3000, hashtagMax: 5 },
  { value: "x", label: "X (Twitter)", lengthHint: "30–60s", captionMaxChars: 280, hashtagMax: 4 },
];

export const CONTENT_AUDIENCES = [
  "Freelancers",
  "Web designers",
  "SEO consultants",
  "Small agencies",
  "Local growth consultants",
] as const;

export const CONTENT_ANGLES: { value: ContentAngle; label: string; templateLabel: string }[] = [
  { value: "discovery_leads", label: "I found bad websites in {city}", templateLabel: "A — Discovery showcase" },
  { value: "audit_breakdown", label: "Website audit breakdown", templateLabel: "B — Audit demonstration" },
  { value: "proposal_flow", label: "From lead to proposal", templateLabel: "C — Proposal automation" },
  { value: "full_workflow", label: "AI agency workflow end-to-end", templateLabel: "D — Full GrowthOS demo" },
  { value: "freelancer_education", label: "How freelancers find local clients", templateLabel: "E — Education" },
  { value: "growthos_overview", label: "How GrowthOS works", templateLabel: "F — Product overview" },
];

export const CONTENT_STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  idea:      { label: "Idea",      color: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
  scripted:  { label: "Scripted",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  recorded:  { label: "Recorded",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  edited:    { label: "Edited",    color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  posted:    { label: "Posted",    color: "#10b981", bg: "rgba(16,185,129,0.15)" },
};

// Plural form per business category — used in copy.
export const NICHE_PLURALS: Record<string, string> = {
  "Restaurant": "restaurants",
  "Gym": "gyms",
  "Barber / Hair Salon": "barbershops",
  "Dentist": "dentists",
  "Real Estate Agent": "real estate agents",
  "Cleaner": "cleaning services",
  "Roofer": "roofers",
  "Beauty Salon": "beauty salons",
  "Car Detailer": "car detailers",
  "Accountant": "accountants",
  "Plumber": "plumbers",
  "Electrician": "electricians",
  "Landscaper": "landscapers",
  "Photographer": "photographers",
  "Physiotherapist": "physiotherapists",
  "Vet": "veterinary practices",
  "Other": "local businesses",
};
