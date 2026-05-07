import type { Lead, LeadStatus } from "../types";
import type { RichAuditData, IssueSeverity } from "../audit/types";
import type { LeadScore, LeadScoreBreakdown, LeadScoreCategory } from "./types";
import { sanitizeCopyOutput } from "../copy/sanitize";

// ─────────────────────────────────────────────────────────────────────────
// Deterministic lead-quality scoring. Pure function over (Lead, RichAudit).
// Same inputs → same outputs. No randomness, no AI, no external lookups.
// ─────────────────────────────────────────────────────────────────────────

const PREMIUM_NICHES = [
  "dentist",
  "real estate agent",
  "accountant",
  "physiotherapist",
  "lawyer",
  "vet",
] as const;

const MEDIUM_NICHES = [
  "gym",
  "barber",
  "beauty salon",
  "photographer",
  "roofer",
] as const;

// Major cities have more competition → less opportunity per lead.
const MAJOR_CITY_KEYWORDS = [
  "amsterdam",
  "rotterdam",
  "berlin",
  "munich",
  "paris",
  "london",
  "madrid",
  "barcelona",
  "milan",
  "rome",
  "new york",
  "los angeles",
  "san francisco",
  "chicago",
  "toronto",
];

const SEVERITY_POINTS: Record<IssueSeverity, number> = {
  critical: 8,
  high: 5,
  medium: 3,
  low: 1,
};

const ENGAGEMENT_POINTS: Partial<Record<LeadStatus, number>> = {
  replied: 6,
  meeting_booked: 9,
  proposal_sent: 7,
  won: 10,
  contacted: 3,
  audit_ready: 2,
};

// ── Component scoring ─────────────────────────────────────────────────────

function scoreAuditOpportunity(audit: RichAuditData | undefined): number {
  if (!audit) return 12; // unknown → moderate default opportunity
  const issuePoints = audit.issues.reduce(
    (acc, issue) => acc + SEVERITY_POINTS[issue.severity],
    0,
  );
  return Math.min(40, issuePoints);
}

function scoreNicheValue(category: string): number {
  const lower = category.toLowerCase();
  if (PREMIUM_NICHES.some((n) => lower.includes(n))) return 15;
  if (MEDIUM_NICHES.some((n) => lower.includes(n))) return 10;
  return 6;
}

function scoreCityOpportunity(city: string): number {
  const lower = city.toLowerCase();
  if (MAJOR_CITY_KEYWORDS.some((c) => lower.includes(c))) return 5;
  return 9;
}

function scoreOutreachPotential(lead: Lead): number {
  let s = 0;
  if (lead.email) s += 6;
  if (lead.phone) s += 4;
  if (lead.website) s += 3;
  if (lead.contactPageUrl) s += 2;
  return Math.min(15, s);
}

function scoreContactCompleteness(lead: Lead): number {
  let s = 0;
  if (lead.businessName) s += 1;
  if (lead.city) s += 1;
  if (lead.category) s += 1;
  if (lead.email) s += 2;
  if (lead.phone) s += 2;
  if (lead.googleMapsUrl) s += 1;
  if (lead.notes && lead.notes.length > 10) s += 1;
  if (lead.province) s += 1;
  return Math.min(10, s);
}

function scoreEngagement(status: LeadStatus): number {
  return ENGAGEMENT_POINTS[status] ?? 0;
}

// ── Category mapping ──────────────────────────────────────────────────────

function categoriseScore(score: number): LeadScoreCategory {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  if (score >= 40) return "maybe";
  return "low";
}

// ── Reasons + outreach derivation ─────────────────────────────────────────

function buildContactReasons(
  lead: Lead,
  audit: RichAuditData | undefined,
  breakdown: LeadScoreBreakdown,
): string[] {
  const reasons: string[] = [];
  if (audit && audit.topPriority.length > 0) {
    reasons.push(`Audit shows ${audit.topPriority[0].title.toLowerCase()}.`);
    if (audit.topPriority.length > 1) {
      reasons.push(`Also: ${audit.topPriority[1].title.toLowerCase()}.`);
    }
  }
  if (breakdown.nicheValue >= 15) {
    reasons.push(`${lead.category} is a premium-value niche.`);
  }
  if (breakdown.cityOpportunity >= 9) {
    reasons.push(`${lead.city} is less saturated than major metros, easier to win.`);
  }
  if (breakdown.outreachPotential >= 12) {
    reasons.push("Has full contact info, direct outreach is straightforward.");
  }
  if (audit && audit.scores.overall < 50) {
    reasons.push(`Overall site health is ${audit.scores.overall}/100, clear room to add value.`);
  }
  return reasons.slice(0, 5);
}

function buildOutreachAngle(audit: RichAuditData | undefined): string {
  if (!audit || audit.topPriority.length === 0) {
    return "Lead with a short, helpful observation about their site. Avoid pitching upfront.";
  }
  const top = audit.topPriority[0];
  return top.outreachAngle;
}

function buildAuditHook(audit: RichAuditData | undefined, lead: Lead): string {
  if (!audit || audit.topPriority.length === 0) {
    return `I was looking at ${lead.businessName}'s website and noticed a couple of quick wins worth flagging.`;
  }
  const top = audit.topPriority[0];
  return `I was looking at ${lead.businessName}'s website and noticed: ${top.clientFriendlyExplanation}`;
}

function buildFirstMessageIdea(lead: Lead, audit: RichAuditData | undefined): string {
  const hook = buildAuditHook(audit, lead);
  return `${hook}\n\nWould you be open to a quick free audit? No pitch, just findings.\n\nIf this isn't relevant, no worries, I will not contact you again.`;
}

function suggestOfferFromAudit(audit: RichAuditData | undefined): string {
  if (!audit) return "growth";
  const s = audit.scores;
  if (s.overall < 35) return "starter";
  if (s.localSeo < 50 && s.overall >= 50) return "local_seo";
  if (s.bookingFriction < 50 && s.conversion >= 60) return "automation";
  if (s.overall < 55) return "growth_plus_automation";
  return "growth";
}

function recommendedContentIdea(lead: Lead, audit: RichAuditData | undefined): string {
  const niche = lead.category.toLowerCase();
  const city = lead.city;
  if (audit && audit.scores.overall < 45) {
    return `Audit breakdown video for a ${niche} in ${city}, show 3 visible website signals worth fixing. Keep it educational, no callout.`;
  }
  if (audit && audit.scores.localSeo < 50) {
    return `Local SEO 60-second walkthrough, what makes a ${niche} in ${city} rank locally.`;
  }
  return `"How I find local ${niche} clients in ${city}", soft education content, drives inbound rather than outbound.`;
}

// ── Public API ────────────────────────────────────────────────────────────

export function computeLeadScore(lead: Lead, audit?: RichAuditData): LeadScore {
  const breakdown: LeadScoreBreakdown = {
    auditOpportunity: scoreAuditOpportunity(audit),
    nicheValue: scoreNicheValue(lead.category),
    cityOpportunity: scoreCityOpportunity(lead.city),
    outreachPotential: scoreOutreachPotential(lead),
    contactCompleteness: scoreContactCompleteness(lead),
    engagementSignal: scoreEngagement(lead.status),
  };

  const score = Math.min(
    100,
    breakdown.auditOpportunity +
      breakdown.nicheValue +
      breakdown.cityOpportunity +
      breakdown.outreachPotential +
      breakdown.contactCompleteness +
      breakdown.engagementSignal,
  );

  const category = categoriseScore(score);

  return {
    score,
    category,
    breakdown,
    topContactReasons: buildContactReasons(lead, audit, breakdown).map(sanitizeCopyOutput),
    outreachAngle: sanitizeCopyOutput(buildOutreachAngle(audit)),
    suggestedOffer: suggestOfferFromAudit(audit),
    firstMessageIdea: sanitizeCopyOutput(buildFirstMessageIdea(lead, audit)),
    auditHook: sanitizeCopyOutput(buildAuditHook(audit, lead)),
    recommendedContentIdea: sanitizeCopyOutput(recommendedContentIdea(lead, audit)),
    generatedAt: new Date().toISOString(),
  };
}

export const LEAD_SCORE_CATEGORY_CONFIG: Record<
  LeadScoreCategory,
  { label: string; color: string; bg: string }
> = {
  hot: { label: "Hot", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  warm: { label: "Warm", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  maybe: { label: "Maybe", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  low: { label: "Low", color: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
};
