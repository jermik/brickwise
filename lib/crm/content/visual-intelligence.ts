// ─────────────────────────────────────────────────────────────────────────
// Visual scene intelligence — deterministic, template-driven assignment of
// visual metadata to every generated scene. No randomness, no LLM, no
// external APIs. Same inputs → same output, every time.
//
// Inputs:  template (ContentAngle), scene index, total scene count, raw
//          scene narrative, substitution vars (city / niche / etc.)
// Output:  fully populated SceneVisualConfig — visualType, role, animation
//          + transition hints, pacing metadata, overlay recommendations,
//          and source hints for the asset pipeline.
//
// The Remotion renderer consumes the config later to pick the right scene
// component, source the right footage, apply the right transforms.
// ─────────────────────────────────────────────────────────────────────────

import type {
  AnimationHint,
  ContentAngle,
  CtaOverlay,
  OverlayHeadline,
  PacingIntensity,
  SceneRole,
  SceneSourceHints,
  SceneVisualConfig,
  StatCallout,
  TransitionHint,
  VisualType,
} from "./types";

// ── Inputs to the assignment function ─────────────────────────────────────

export interface VisualAssignmentInput {
  angle: ContentAngle;
  sceneIndex: number;          // 0-based
  totalScenes: number;
  voiceover: string;
  onscreenText: string;
  vars: {
    city: string;
    niche: string;
    nichePlural: string;
    n: string;
  };
  ctaTargetUrl?: string;
}

// ── Role classification ───────────────────────────────────────────────────
//
// First scene = hook. Last scene = cta. Middle scenes follow the body
// pattern of the specific template. Hand-tuned per template based on the
// narrative beats already authored in templates.ts.

const TEMPLATE_BODY_ROLES: Record<ContentAngle, SceneRole[]> = {
  // discovery: setup → demo → audit → data
  discovery_leads: ["setup", "demo", "audit", "data"],
  // audit: walk through 3 problems, end with the offer recommendation
  audit_breakdown: ["audit", "audit", "audit", "demo"],
  // proposal: 3 demo steps, then a follow-up demo
  proposal_flow: ["demo", "demo", "demo", "demo"],
  // full workflow: discover → audit → propose → follow-up
  full_workflow: ["demo", "audit", "demo", "demo"],
  // education: setup, story, story, story
  freelancer_education: ["setup", "story", "story", "story"],
  // overview: what / does / not / who-for
  growthos_overview: ["story", "demo", "story", "story"],
};

export function classifySceneRole(
  angle: ContentAngle,
  sceneIndex: number,
  totalScenes: number,
): SceneRole {
  if (sceneIndex === 0) return "hook";
  if (sceneIndex === totalScenes - 1) return "cta";
  const bodyRoles = TEMPLATE_BODY_ROLES[angle] ?? [];
  // body scenes start at index 1
  return bodyRoles[sceneIndex - 1] ?? "demo";
}

// ── Default visual per role (fallback) ────────────────────────────────────

const ROLE_TO_VISUAL: Record<SceneRole, VisualType> = {
  hook: "title_card",
  setup: "browser_navigation",
  demo: "screen_recording",
  data: "analytics_overlay",
  audit: "website_audit",
  story: "text_only",
  transition: "text_only",
  cta: "cta",
};

// ── Per-template per-scene visual override map ────────────────────────────
//
// Index = scene index (0-based). Override only what diverges from the
// role-based default. Empty entry = use role default.

type SceneOverride = Partial<Pick<SceneVisualConfig,
  "visualType"
> & { animationHint: AnimationHint; transitionHint: TransitionHint }>;

const TEMPLATE_OVERRIDES: Record<ContentAngle, Record<number, SceneOverride>> = {
  discovery_leads: {
    0: { visualType: "title_card", animationHint: "zoom_in", transitionHint: "flash" },
    1: { visualType: "browser_navigation", animationHint: "cursor_focus", transitionHint: "hard_cut" },
    2: { visualType: "website_scroll", animationHint: "pan", transitionHint: "swipe" },
    3: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    4: { visualType: "analytics_overlay", animationHint: "zoom_in", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
  audit_breakdown: {
    0: { visualType: "mobile_recording", animationHint: "zoom_in", transitionHint: "flash" },
    1: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    2: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    3: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    4: { visualType: "split_screen", animationHint: "fast_cut", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
  proposal_flow: {
    0: { visualType: "title_card", animationHint: "zoom_in", transitionHint: "flash" },
    1: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "hard_cut" },
    2: { visualType: "browser_navigation", animationHint: "cursor_focus", transitionHint: "swipe" },
    3: { visualType: "screenshot", animationHint: "zoom_in", transitionHint: "swipe" },
    4: { visualType: "split_screen", animationHint: "fast_cut", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
  full_workflow: {
    0: { visualType: "title_card", animationHint: "zoom_in", transitionHint: "flash" },
    1: { visualType: "browser_navigation", animationHint: "cursor_focus", transitionHint: "swipe" },
    2: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    3: { visualType: "screenshot", animationHint: "zoom_in", transitionHint: "swipe" },
    4: { visualType: "analytics_overlay", animationHint: "fast_cut", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
  freelancer_education: {
    0: { visualType: "city_broll", animationHint: "pan", transitionHint: "blur" },
    1: { visualType: "google_maps", animationHint: "zoom_in", transitionHint: "swipe" },
    2: { visualType: "browser_navigation", animationHint: "cursor_focus", transitionHint: "hard_cut" },
    3: { visualType: "website_audit", animationHint: "highlight_circle", transitionHint: "swipe" },
    4: { visualType: "text_only", animationHint: "subtitle_pop", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
  growthos_overview: {
    0: { visualType: "title_card", animationHint: "zoom_in", transitionHint: "flash" },
    1: { visualType: "browser_navigation", animationHint: "cursor_focus", transitionHint: "hard_cut" },
    2: { visualType: "split_screen", animationHint: "fast_cut", transitionHint: "swipe" },
    3: { visualType: "text_only", animationHint: "subtitle_pop", transitionHint: "blur" },
    4: { visualType: "image_grid", animationHint: "fast_cut", transitionHint: "blur" },
    5: { visualType: "cta", animationHint: "subtitle_pop", transitionHint: "flash" },
  },
};

// ── Pacing per role ──────────────────────────────────────────────────────

const ROLE_PACING: Record<SceneRole, { intensity: PacingIntensity; retentionScore: number; patternInterrupt: boolean }> = {
  hook:       { intensity: "high",   retentionScore: 95, patternInterrupt: true  },
  setup:      { intensity: "medium", retentionScore: 70, patternInterrupt: false },
  demo:       { intensity: "medium", retentionScore: 75, patternInterrupt: false },
  data:       { intensity: "high",   retentionScore: 85, patternInterrupt: true  },
  audit:      { intensity: "medium", retentionScore: 78, patternInterrupt: false },
  story:      { intensity: "low",    retentionScore: 65, patternInterrupt: false },
  transition: { intensity: "low",    retentionScore: 55, patternInterrupt: false },
  cta:        { intensity: "high",   retentionScore: 90, patternInterrupt: true  },
};

// ── Stat extraction ───────────────────────────────────────────────────────
//
// Pulls "{n} {nichePlural}" and "{n} minutes/seconds" patterns out of the
// voiceover so callouts can be rendered as big numbers on screen.

const NUMBER_NEAR_NOUN = /(\d+)\s+([a-z][a-z\s/-]*?)(?=\s|[.,—!?]|$)/gi;
const TIME_PATTERNS = [
  { rx: /\b(\d+)\s*(minute|minutes|min)\b/i, label: "min" },
  { rx: /\b(\d+)\s*(second|seconds|sec)\b/i, label: "sec" },
  { rx: /\b(\d+)\s*(hour|hours|hr)\b/i, label: "hr" },
];

export function extractStatCallouts(
  voiceover: string,
  vars: VisualAssignmentInput["vars"],
): StatCallout[] {
  const out: StatCallout[] = [];
  const seen = new Set<string>();

  // Time patterns first (highest signal).
  for (const { rx, label } of TIME_PATTERNS) {
    const m = voiceover.match(rx);
    if (m) {
      const key = `${m[1]}|${label}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ label, value: m[1] });
      }
    }
  }

  // "N nichePlural" — e.g. "20 gyms"
  const nichePluralLower = vars.nichePlural.toLowerCase();
  const nicheRx = new RegExp(`\\b(\\d+)\\s+${nichePluralLower.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
  const nicheMatch = voiceover.match(nicheRx);
  if (nicheMatch) {
    const key = `${nicheMatch[1]}|${nichePluralLower}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ label: nichePluralLower, value: nicheMatch[1] });
    }
  }

  // Generic numeric callouts for /\d+ \w+/ pattern (capped at 2 extra)
  let extras = 0;
  for (const m of voiceover.matchAll(NUMBER_NEAR_NOUN)) {
    if (extras >= 2) break;
    const value = m[1];
    const label = m[2].trim().toLowerCase();
    const key = `${value}|${label}`;
    if (seen.has(key) || label.length > 24) continue;
    seen.add(key);
    out.push({ label, value });
    extras++;
  }

  return out;
}

// ── Source hints per visual type ──────────────────────────────────────────

function buildSourceHints(
  visualType: VisualType,
  vars: VisualAssignmentInput["vars"],
): SceneSourceHints | undefined {
  switch (visualType) {
    case "google_maps":
    case "city_broll":
      return { location: vars.city };
    case "website_scroll":
    case "website_audit":
    case "mobile_recording":
      return {}; // websiteUrl plumbed in per-lead at render time
    case "browser_navigation":
    case "screen_recording":
    case "product_demo":
    case "analytics_overlay":
      // routePath is set on RenderScene by the template; copy not required here
      return {};
    case "stock_footage":
      return { stockFootageQuery: `${vars.city} ${vars.nichePlural}` };
    default:
      return undefined;
  }
}

// ── Headline + CTA overlay derivation ─────────────────────────────────────

function buildHeadline(
  role: SceneRole,
  onscreenText: string,
): OverlayHeadline | undefined {
  if (!onscreenText) return undefined;
  if (role === "hook" || role === "cta") {
    return { text: onscreenText, position: "center", style: "bold" };
  }
  return { text: onscreenText, position: "top", style: "default" };
}

function buildCtaOverlay(
  role: SceneRole,
  ctaTargetUrl: string | undefined,
): CtaOverlay | undefined {
  if (role !== "cta") return undefined;
  return {
    text: "Link in bio",
    ctaType: "link_in_bio",
    emphasis: true,
  };
}

// ── Main assignment function ──────────────────────────────────────────────

export function assignVisualConfig(input: VisualAssignmentInput): SceneVisualConfig {
  const role = classifySceneRole(input.angle, input.sceneIndex, input.totalScenes);
  const override = TEMPLATE_OVERRIDES[input.angle]?.[input.sceneIndex] ?? {};

  const visualType: VisualType = override.visualType ?? ROLE_TO_VISUAL[role];
  const animationHint = override.animationHint;
  const transitionHint = input.sceneIndex === 0 ? undefined : override.transitionHint;

  const pacing = ROLE_PACING[role];

  const stats = extractStatCallouts(input.voiceover, input.vars);
  const headline = buildHeadline(role, input.onscreenText);
  const cta = buildCtaOverlay(role, input.ctaTargetUrl);

  return {
    visualType,
    role,
    animation: {
      hint: animationHint,
      durationMs: animationHint ? 600 : undefined,
    },
    transition: {
      hint: transitionHint,
      durationMs: transitionHint ? 250 : undefined,
    },
    pacing,
    overlays: {
      headline,
      statistics: stats.length > 0 ? stats : undefined,
      cta,
    },
    sourceHints: buildSourceHints(visualType, input.vars),
  };
}
