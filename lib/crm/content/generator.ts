import {
  CONTENT_PLATFORMS,
  NICHE_PLURALS,
  type ContentPackage,
  type ContentPlatform,
  type GenerateContentInput,
  type ScriptScene,
} from "./types";
import { CONTENT_TEMPLATES, type ContentTemplate, type RawScene } from "./templates";

// ── Variable substitution ──────────────────────────────────────────────────

function buildVars(input: GenerateContentInput, n = 20): Record<string, string> {
  const niche = input.niche;
  const nicheLower = niche.toLowerCase();
  const nichePlural = NICHE_PLURALS[niche] ?? `${nicheLower}s`;
  const audience = input.audience;
  return {
    city: input.city,
    city_upper: input.city.toUpperCase(),
    city_lower: input.city.toLowerCase(),
    niche,
    niche_lower: nicheLower,
    niche_plural: nichePlural,
    niche_upper: nichePlural.toUpperCase(),
    audience,
    audience_lower: audience.toLowerCase(),
    audience_upper: audience.toUpperCase(),
    n: String(n),
  };
}

function substitute(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

// ── SRT subtitle builder ───────────────────────────────────────────────────

function formatSrtTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const ms = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

// Split a long voiceover into sub-cues capped at ~12 words each so subtitles
// don't sit on screen for the full scene.
function splitForSubtitles(voiceover: string, maxWords = 12): string[] {
  const words = voiceover.trim().split(/\s+/);
  if (words.length <= maxWords) return [voiceover.trim()];
  const cues: string[] = [];
  for (let i = 0; i < words.length; i += maxWords) {
    cues.push(words.slice(i, i + maxWords).join(" "));
  }
  return cues;
}

function buildSrt(scenes: ScriptScene[]): string {
  const cues: string[] = [];
  let cueIndex = 1;
  for (const scene of scenes) {
    const sub = splitForSubtitles(scene.voiceover, 12);
    const span = scene.endSeconds - scene.startSeconds;
    const slice = span / sub.length;
    for (let i = 0; i < sub.length; i++) {
      const start = scene.startSeconds + i * slice;
      const end = scene.startSeconds + (i + 1) * slice;
      cues.push(
        `${cueIndex}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${sub[i]}\n`,
      );
      cueIndex++;
    }
  }
  return cues.join("\n");
}

function buildPlainCaptions(scenes: ScriptScene[]): string {
  return scenes.map((s) => s.voiceover).join("\n\n");
}

// ── Platform-specific tailoring ────────────────────────────────────────────

function tailorCaption(base: string, platform: ContentPlatform): string {
  const meta = CONTENT_PLATFORMS.find((p) => p.value === platform);
  if (!meta) return base;
  if (base.length <= meta.captionMaxChars) return base;
  // Smart truncate at sentence boundary.
  const slice = base.slice(0, meta.captionMaxChars - 3);
  const lastBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("\n\n"));
  return (lastBreak > 50 ? slice.slice(0, lastBreak + 1) : slice) + "...";
}

function tailorHashtags(base: string[], cityLower: string, platform: ContentPlatform): string {
  const meta = CONTENT_PLATFORMS.find((p) => p.value === platform);
  const max = meta?.hashtagMax ?? 8;
  const cityTag = cityLower.replace(/\s+/g, "").replace(/[^a-z0-9]/gi, "");
  const tags = Array.from(new Set([...base, cityTag].filter(Boolean))).slice(0, max);
  return tags.map((t) => `#${t}`).join(" ");
}

function recommendedDurationSeconds(platform: ContentPlatform): number {
  switch (platform) {
    case "tiktok":
    case "instagram_reels":
    case "youtube_shorts":
    case "x":
      return 60;
    case "linkedin":
      return 90;
  }
}

// ── Scene timing ──────────────────────────────────────────────────────────

function buildScenes(rawScenes: RawScene[], vars: Record<string, string>): ScriptScene[] {
  let cursor = 0;
  return rawScenes.map((raw, i) => {
    const start = cursor;
    cursor += raw.durationSeconds;
    return {
      scene: i + 1,
      startSeconds: start,
      endSeconds: cursor,
      onscreenText: substitute(raw.onscreen, vars),
      voiceover: substitute(raw.voiceover, vars),
      bRoll: substitute(raw.bRoll, vars),
    };
  });
}

// ── Main entrypoint ────────────────────────────────────────────────────────

export function generateContent(input: GenerateContentInput): ContentPackage {
  const template: ContentTemplate = CONTENT_TEMPLATES[input.angle];
  const vars = buildVars(input);

  const scenes = buildScenes(template.scenes, vars);
  const totalSeconds = scenes.reduce((acc, s) => acc + (s.endSeconds - s.startSeconds), 0);
  const platformRecommended = recommendedDurationSeconds(input.platform);

  const voiceover = scenes.map((s) => s.voiceover).join(" ");
  const subtitlesSrt = buildSrt(scenes);
  const captionsPlain = buildPlainCaptions(scenes);

  const captionRaw = substitute(template.captionTemplate, vars);
  const caption = tailorCaption(captionRaw, input.platform);
  const hashtags = tailorHashtags(template.hashtagsBase, vars.city_lower, input.platform);

  return {
    title: substitute(template.titleTemplate, vars),
    hook: substitute(template.hookTemplate, vars),
    scriptScenes: scenes,
    voiceover,
    subtitlesSrt,
    captionsPlain,
    caption,
    hashtags,
    cta: substitute(template.cta, vars),
    thumbnailText: substitute(template.thumbnailTemplate, vars),
    pinnedComment: substitute(template.pinnedComment, vars),
    durationSeconds: Math.min(totalSeconds, platformRecommended),
    retentionNotes: template.retentionNotes,
  };
}

export { CONTENT_TEMPLATES };
