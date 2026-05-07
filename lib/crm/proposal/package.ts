// ─────────────────────────────────────────────────────────────────────────
// Proposal Package — MVP "Make Proposal" feature.
//
// Pure deterministic derivation from the existing Lead + RichAudit +
// LeadScore. No new DB columns; no LLM; same inputs always produce the
// same output. The page that renders this is `/crm/leads/[id]/proposal-package`.
// ─────────────────────────────────────────────────────────────────────────

import type { Lead } from "../types";
import type { AuditIssue, IssueSeverity, RichAuditData } from "../audit/types";
import type { LeadScore } from "../lead-scoring/types";
import { OFFER_TEMPLATES, getOffer } from "../types";

// ── Types ─────────────────────────────────────────────────────────────────

export interface PriorityProblem {
  title: string;
  severity: IssueSeverity;
  whyItMatters: string;
  potentialImpact: string;
  howToImprove: string;
}

export interface RecommendedUpgrade {
  title: string;
  shortExplanation: string;
  expectedBenefit: string;
  difficulty: "easy" | "medium" | "hard";
  priority: 1 | 2 | 3;        // 1 = highest
  estimatedHours: { min: number; max: number };
  relatedOfferId?: string;     // OFFER_TEMPLATES.id, if applicable
  relatedOfferName?: string;
  relatedOfferPrice?: string;
}

export interface OutreachEmail {
  subject: string;
  body: string;
  recipient?: string;          // pre-filled from lead.email
}

export interface ProposalPackage {
  generatedAt: string;
  lead: { id: string; businessName: string; city: string; category: string };

  executiveSummary: string;
  priorityProblems: PriorityProblem[];
  recommendedUpgrades: RecommendedUpgrade[];

  outreachEmail: OutreachEmail;
  followUpEmail: OutreachEmail;

  /** Single combined plain-text version for "copy entire proposal". */
  fullProposalText: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function ratingPhrase(score: number): string {
  if (score >= 80) return "in good shape";
  if (score >= 60) return "reasonable but with clear room for improvement";
  if (score >= 40) return "underperforming in several visible areas";
  return "showing significant room for improvement";
}

function dimensionPhrase(label: string, score: number): string {
  if (score >= 70) return `${label} is solid`;
  if (score >= 40) return `${label} has room to improve`;
  return `${label} is a clear opportunity`;
}

function severityToPriority(s: IssueSeverity): 1 | 2 | 3 {
  if (s === "critical" || s === "high") return 1;
  if (s === "medium") return 2;
  return 3;
}

function difficultyOf(issue: AuditIssue): "easy" | "medium" | "hard" {
  return issue.difficulty;
}

// ── Section 1 — Executive summary ────────────────────────────────────────

function buildExecutiveSummary(
  lead: Lead,
  audit: RichAuditData,
): string {
  const overall = audit.scores.overall;
  const phrase = ratingPhrase(overall);

  // Identify the two weakest dimensions for the summary call-out.
  const dims: [string, number][] = [
    ["mobile usability", audit.scores.mobile],
    ["conversion flow", audit.scores.conversion],
    ["local visibility", audit.scores.localSeo],
    ["page speed", audit.scores.speed],
    ["trust signals", audit.scores.trust],
    ["copy clarity", audit.scores.copyClarity],
  ];
  const weakest = dims.sort((a, b) => a[1] - b[1]).slice(0, 2);
  const callOut = weakest.map(([label]) => label).join(" and ");

  return [
    `After reviewing ${lead.businessName}'s website, the site appears ${phrase} (${overall}/100 overall, based on visible website signals).`,
    ``,
    `The most prominent opportunities are around ${callOut}. ` +
      `${dimensionPhrase("Mobile experience", audit.scores.mobile)}, ` +
      `${dimensionPhrase("conversion flow", audit.scores.conversion)}, and ` +
      `${dimensionPhrase("local SEO", audit.scores.localSeo)}.`,
    ``,
    `These observations are based on visible website signals only — no internal analytics or private data. ` +
      `Each finding below comes with a short explanation of why it matters and a suggested fix.`,
  ].join("\n");
}

// ── Section 2 — Priority problems ────────────────────────────────────────

function buildPriorityProblems(audit: RichAuditData): PriorityProblem[] {
  // Take top 5 from the already-ranked audit.issues list.
  return audit.issues.slice(0, 5).map((issue) => ({
    title: issue.title,
    severity: issue.severity,
    whyItMatters: issue.whyItMatters,
    potentialImpact: issue.likelyImpact,
    howToImprove: issue.suggestedFix,
  }));
}

// ── Section 3 — Recommended upgrades ─────────────────────────────────────
//
// Map weak audit dimensions to concrete agency offers. Priority is
// derived from how weak each dimension is — weaker = higher priority.

interface UpgradeRule {
  threshold: number;            // include only if dimension score < threshold
  title: string;
  shortExplanation: string;
  expectedBenefit: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: { min: number; max: number };
  relatedOfferId?: string;
}

function ruleFromDimension(
  dim: keyof RichAuditData["scores"],
  score: number,
): UpgradeRule | null {
  switch (dim) {
    case "mobile":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Mobile optimisation",
        shortExplanation: "Rebuild the responsive layout, fix tap targets, and simplify mobile navigation.",
        expectedBenefit: "Most local searches happen on phones — fixing mobile could meaningfully improve enquiries.",
        difficulty: "medium",
        estimatedHours: { min: 6, max: 16 },
        relatedOfferId: "growth",
      };
    case "conversion":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "CTA + conversion restructuring",
        shortExplanation: "Add a clear primary CTA above the fold, simplify the contact path, and add a sticky mobile CTA.",
        expectedBenefit: "Visitors who currently bounce will have a defined next step — the highest-leverage UX fix.",
        difficulty: "easy",
        estimatedHours: { min: 4, max: 10 },
        relatedOfferId: "growth",
      };
    case "speed":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Speed optimisation",
        shortExplanation: "Compress images (WebP/AVIF), defer non-critical scripts, enable caching, switch to faster hosting if needed.",
        expectedBenefit: "Page speed affects both bounce rate and Google ranking. Each second matters.",
        difficulty: "easy",
        estimatedHours: { min: 3, max: 8 },
        relatedOfferId: "local_seo",
      };
    case "trust":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Trust signal redesign",
        shortExplanation: "Embed Google reviews, surface customer testimonials, ensure address + phone + Google Business profile are prominent.",
        expectedBenefit: "Reviews are the strongest persuasion lever for local services — could meaningfully shift the conversion rate.",
        difficulty: "easy",
        estimatedHours: { min: 3, max: 8 },
        relatedOfferId: "growth",
      };
    case "localSeo":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Local SEO sprint",
        shortExplanation: "Fix title tags, add city/region landing pages, complete Google Business Profile, add LocalBusiness schema markup.",
        expectedBenefit: "Local SEO is the single biggest lever for visibility on '[service] in [city]' searches.",
        difficulty: "medium",
        estimatedHours: { min: 8, max: 20 },
        relatedOfferId: "local_seo",
      };
    case "bookingFriction":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Booking flow implementation",
        shortExplanation: "Add an online booking widget, auto-acknowledgement emails, and a quote request form.",
        expectedBenefit: "Captures bookings outside business hours and reduces back-and-forth admin.",
        difficulty: "medium",
        estimatedHours: { min: 4, max: 12 },
        relatedOfferId: "automation",
      };
    case "copyClarity":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Hero + copy refresh",
        shortExplanation: "Rewrite the hero so service + audience + value are clear within 5 seconds.",
        expectedBenefit: "Visitors who currently leave without understanding the offer will engage instead.",
        difficulty: "medium",
        estimatedHours: { min: 4, max: 10 },
        relatedOfferId: "growth",
      };
    case "designQuality":
      if (score >= 70) return null;
      return {
        threshold: 70,
        title: "Homepage redesign",
        shortExplanation: "Refresh visual design — modern typography, spacing, colour palette, and layout.",
        expectedBenefit: "Stronger first impression. Builds trust before visitors read a single word.",
        difficulty: "hard",
        estimatedHours: { min: 16, max: 40 },
        relatedOfferId: "growth",
      };
    default:
      return null;
  }
}

function buildRecommendedUpgrades(audit: RichAuditData): RecommendedUpgrade[] {
  const rules: UpgradeRule[] = [];

  for (const dim of [
    "conversion",
    "mobile",
    "localSeo",
    "trust",
    "bookingFriction",
    "speed",
    "copyClarity",
    "designQuality",
  ] as const) {
    const score = audit.scores[dim];
    const rule = ruleFromDimension(dim, score);
    if (rule) rules.push(rule);
  }

  // Always include analytics setup if hasAnalytics check failed and the list is short
  if (rules.length < 3 && audit.issues.some((i) => i.key === "hasAnalytics")) {
    rules.push({
      threshold: 100,
      title: "Analytics setup",
      shortExplanation: "Install GA4 + Search Console + key event tracking on CTAs.",
      expectedBenefit: "Without analytics, every marketing decision is guesswork. This is the foundation everything else builds on.",
      difficulty: "easy",
      estimatedHours: { min: 1, max: 3 },
      relatedOfferId: "local_seo",
    });
  }

  // Rank by priority: priority 1 = mobile/conversion/local-SEO when present;
  // priority 2 = speed/trust/booking; priority 3 = copy/design tweaks.
  const PRIORITY_OF: Record<string, 1 | 2 | 3> = {
    "Mobile optimisation": 1,
    "CTA + conversion restructuring": 1,
    "Local SEO sprint": 1,
    "Speed optimisation": 2,
    "Trust signal redesign": 2,
    "Booking flow implementation": 2,
    "Hero + copy refresh": 3,
    "Homepage redesign": 3,
    "Analytics setup": 2,
  };

  const sorted = rules.sort(
    (a, b) => (PRIORITY_OF[a.title] ?? 3) - (PRIORITY_OF[b.title] ?? 3),
  );

  return sorted.slice(0, 5).map((r): RecommendedUpgrade => {
    const offer = getOffer(r.relatedOfferId);
    return {
      title: r.title,
      shortExplanation: r.shortExplanation,
      expectedBenefit: r.expectedBenefit,
      difficulty: r.difficulty,
      priority: PRIORITY_OF[r.title] ?? 3,
      estimatedHours: r.estimatedHours,
      relatedOfferId: r.relatedOfferId,
      relatedOfferName: offer?.name,
      relatedOfferPrice: offer?.price,
    };
  });
}

// ── Section 4 — Outreach email ───────────────────────────────────────────

function buildSubject(lead: Lead, audit: RichAuditData): string {
  const top = audit.topPriority[0];
  if (!top) return `Quick website note for ${lead.businessName}`;
  // Subject lines that read like a personal observation, not a pitch.
  const variants = [
    `Quick note about ${lead.businessName}'s website`,
    `${lead.businessName} — a couple of observations worth sharing`,
    `Found a few things worth flagging on the ${lead.businessName} site`,
  ];
  // Deterministic selection — same lead always gets the same subject.
  const hash = lead.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return variants[hash % variants.length];
}

function buildOutreachBody(
  lead: Lead,
  audit: RichAuditData,
  upgrades: RecommendedUpgrade[],
): string {
  const obs1 = audit.topPriority[0];
  const obs2 = audit.topPriority[1];

  const observation1 = obs1
    ? obs1.clientFriendlyExplanation
    : "There appear to be a couple of areas where the site could be working harder.";
  const observation2 = obs2
    ? obs2.clientFriendlyExplanation
    : "These look like quick wins that don't require a full rebuild.";

  const topUpgrade = upgrades[0]?.title.toLowerCase() ?? "a focused improvement plan";

  return [
    `Hi,`,
    ``,
    `I was looking at ${lead.businessName}'s website and noticed a few areas worth flagging.`,
    ``,
    `Two specific observations, based on visible website signals:`,
    ``,
    `1. ${observation1}`,
    ``,
    `2. ${observation2}`,
    ``,
    `Both look fixable. The most impactful starting point for the site appears to be ${topUpgrade}.`,
    ``,
    `Would it be useful if I sent over a short free audit with the full picture and a couple of specific suggestions? No obligation — just findings you can use.`,
    ``,
    `Best,`,
    `[Your Name]`,
    ``,
    `If this isn't relevant, no worries — just reply "no thanks" and I won't contact you again.`,
  ].join("\n");
}

function buildFollowUpBody(lead: Lead): string {
  return [
    `Hi,`,
    ``,
    `Just following up on the note I sent earlier about ${lead.businessName}'s website.`,
    ``,
    `If a short free audit would be useful, I'm happy to send it over — and if not, no worries at all, I won't follow up further.`,
    ``,
    `Best,`,
    `[Your Name]`,
    ``,
    `If this isn't relevant, no worries — just reply "no thanks" and I won't contact you again.`,
  ].join("\n");
}

// ── Combined plain-text export ───────────────────────────────────────────

function buildFullProposalText(pkg: ProposalPackage): string {
  const lines: string[] = [];
  lines.push(`# Website improvement proposal — ${pkg.lead.businessName}`);
  lines.push(`${pkg.lead.category} · ${pkg.lead.city}`);
  lines.push("");
  lines.push("## Executive summary");
  lines.push("");
  lines.push(pkg.executiveSummary);
  lines.push("");
  lines.push("## Priority issues");
  lines.push("");
  pkg.priorityProblems.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.title}  [${p.severity.toUpperCase()}]`);
    lines.push(`**Why it matters:** ${p.whyItMatters}`);
    lines.push(`**Potential impact:** ${p.potentialImpact}`);
    lines.push(`**How to improve:** ${p.howToImprove}`);
    lines.push("");
  });
  lines.push("## Recommended upgrades");
  lines.push("");
  pkg.recommendedUpgrades.forEach((u) => {
    const offer = u.relatedOfferName ? ` — fits within "${u.relatedOfferName}" (${u.relatedOfferPrice ?? ""})` : "";
    lines.push(`### ${u.title}  [Priority ${u.priority} · ${u.difficulty}]${offer}`);
    lines.push(`${u.shortExplanation}`);
    lines.push(`*Expected benefit:* ${u.expectedBenefit}`);
    lines.push(`*Estimated work:* ${u.estimatedHours.min}–${u.estimatedHours.max} hours`);
    lines.push("");
  });
  lines.push("---");
  lines.push("");
  lines.push("Based on visible website signals only. Generated by Brickwise.");
  return lines.join("\n");
}

// ── Main entrypoint ──────────────────────────────────────────────────────

export function generateProposalPackage(
  lead: Lead,
  audit: RichAuditData | undefined,
  _score?: LeadScore,
): ProposalPackage | null {
  if (!audit) return null;

  const priorityProblems = buildPriorityProblems(audit);
  const recommendedUpgrades = buildRecommendedUpgrades(audit);
  const executiveSummary = buildExecutiveSummary(lead, audit);

  const subject = buildSubject(lead, audit);
  const outreachBody = buildOutreachBody(lead, audit, recommendedUpgrades);
  const followUpBody = buildFollowUpBody(lead);

  const pkg: ProposalPackage = {
    generatedAt: new Date().toISOString(),
    lead: {
      id: lead.id,
      businessName: lead.businessName,
      city: lead.city,
      category: lead.category,
    },
    executiveSummary,
    priorityProblems,
    recommendedUpgrades,
    outreachEmail: {
      subject,
      body: outreachBody,
      recipient: lead.email,
    },
    followUpEmail: {
      subject: `Re: ${subject}`,
      body: followUpBody,
      recipient: lead.email,
    },
    fullProposalText: "",
  };
  pkg.fullProposalText = buildFullProposalText(pkg);
  return pkg;
}

export { OFFER_TEMPLATES };
