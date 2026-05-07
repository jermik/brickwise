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

export interface ScriptScene {
  scene: number;
  startSeconds: number;
  endSeconds: number;
  onscreenText: string;
  voiceover: string;
  bRoll: string;
}

export interface ContentPackage {
  title: string;
  hook: string;
  scriptScenes: ScriptScene[];
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
