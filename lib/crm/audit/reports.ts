// Client-friendly audit reports, 4 formats. Pure functions over the
// existing audit + lead score data. No DB writes, no auto-send. Just
// copy-ready text for the operator's clipboard.

import type { Lead } from "../types";
import type { RichAuditData } from "./types";
import type { LeadScore } from "../lead-scoring/types";
import { sanitizeCopyOutput } from "../copy/sanitize";

export type ReportFormat = "dm" | "email" | "full" | "content_idea";

const OPT_OUT_LINE =
  `If this isn't relevant, no worries, just reply "no thanks" and I won't contact you again.`;

function getTopThree(audit: RichAuditData | undefined) {
  return audit?.topPriority.slice(0, 3) ?? [];
}

// ── 1. DM version (≤ 280 chars, casual) ──────────────────────────────────

export function generateDmReport(lead: Lead, audit: RichAuditData | undefined): string {
  const top = audit?.topPriority[0];
  const observation = top
    ? top.outreachAngle
    : "I noticed a couple of quick-win opportunities on the site";
  return `Hey, I was looking at ${lead.businessName}'s site and ${observation.toLowerCase()}. Happy to send a short free audit if useful, no pitch, just findings. Reply "no thanks" if not relevant.`.slice(0, 480);
}

// ── 2. Email version (paragraph form, professional) ───────────────────────

export function generateEmailReport(
  lead: Lead,
  audit: RichAuditData | undefined,
  score?: LeadScore,
): string {
  const top = getTopThree(audit);
  const issuesBlock = top.length > 0
    ? top
        .map((issue, i) => `${i + 1}. ${issue.title}, ${issue.clientFriendlyExplanation}`)
        .join("\n\n")
    : "A short audit covers the main visible signals worth addressing.";

  const offer = score?.suggestedOffer ?? "a focused improvement plan";

  return [
    `Subject: Quick website note for ${lead.businessName}`,
    "",
    `Hi,`,
    "",
    `I was looking at ${lead.businessName}'s site and wanted to share a couple of things I noticed. Based on visible website signals, there are a few areas that could help local search visibility and conversion.`,
    "",
    `Top observations:`,
    "",
    issuesBlock,
    "",
    `Each of these is fixable. Some are small (under an hour), some are larger projects. Happy to write up a short free audit with the full picture and a recommended starting point, typically aligned with our ${offer.replace(/_/g, " ")} package.`,
    "",
    `Would that be useful? No obligation, and you can decide where to take it from there.`,
    "",
    `Best,`,
    `[Your Name]`,
    `[Your Agency]`,
    "",
    OPT_OUT_LINE,
  ].join("\n");
}

// ── 3. Full audit report (structured, every issue) ────────────────────────

export function generateFullAuditReport(
  lead: Lead,
  audit: RichAuditData | undefined,
  score?: LeadScore,
): string {
  if (!audit) {
    return `# ${lead.businessName}, audit report\n\nNo audit data yet. Run the website audit to populate this report.`;
  }

  const s = audit.scores;
  const headerStats = [
    `Overall:        ${s.overall}/100`,
    `Conversion:     ${s.conversion}/100`,
    `Mobile:         ${s.mobile}/100`,
    `Speed:          ${s.speed}/100`,
    `Trust:          ${s.trust}/100`,
    `Local SEO:      ${s.localSeo}/100`,
    `Booking ease:   ${s.bookingFriction}/100`,
    `Copy clarity:   ${s.copyClarity}/100`,
    `Design quality: ${s.designQuality}/100`,
  ].join("\n");

  const issueLines = audit.issues.map((issue) => {
    const sev = issue.severity.toUpperCase();
    const hours = `${issue.implementation.minHours}–${issue.implementation.maxHours}h`;
    return [
      `## ${issue.title}  [${sev} · ${issue.dimension} · ${hours}]`,
      ``,
      `**Why it matters:** ${issue.whyItMatters}`,
      ``,
      `**Likely impact:** ${issue.likelyImpact}`,
      ``,
      `**Suggested fix:** ${issue.suggestedFix}`,
      ``,
      `**For the client:** ${issue.clientFriendlyExplanation}`,
    ].join("\n");
  });

  const offerLine = score?.suggestedOffer
    ? `\n\n**Recommended starting package:** ${score.suggestedOffer.replace(/_/g, " ")}`
    : "";

  return [
    `# ${lead.businessName}, Website audit`,
    `${lead.category} · ${lead.city}`,
    ``,
    `## Scores`,
    ``,
    headerStats,
    ``,
    `## Top priority`,
    ``,
    audit.topPriority.length > 0
      ? audit.topPriority.map((p, i) => `${i + 1}. ${p.title}, ${p.severity} severity`).join("\n")
      : "No critical issues, site is in reasonable shape.",
    ``,
    `## All findings (${audit.issues.length})`,
    ``,
    ...(issueLines.length > 0 ? [issueLines.join("\n\n")] : ["No issues detected."]),
    offerLine,
    ``,
    `---`,
    ``,
    `Generated: ${audit.generatedAt}. Based on visible website signals.`,
    `${OPT_OUT_LINE}`,
  ].join("\n");
}

// ── 4. Content idea (a video script angle for them) ───────────────────────

export function generateContentIdeaReport(
  lead: Lead,
  audit: RichAuditData | undefined,
  score?: LeadScore,
): string {
  const top = audit?.topPriority[0];
  const angle = score?.recommendedContentIdea ??
    `Educational angle on local visibility for ${lead.category.toLowerCase()}s in ${lead.city}.`;

  const hookLine = top
    ? `"Most ${lead.category.toLowerCase()}s in ${lead.city} have one thing in common, and it's costing them clients."`
    : `"Here's how local ${lead.category.toLowerCase()}s in ${lead.city} can stand out in 2026."`;

  const beats = top
    ? [
        `1. Hook, ${hookLine}`,
        `2. Setup, what to look for: ${top.title.toLowerCase()}`,
        `3. Demo, show the issue on screen + the fix`,
        `4. CTA, "If you want a free audit of your own site, link in bio"`,
      ]
    : [
        `1. Hook, ${hookLine}`,
        `2. Setup, 3 things every local ${lead.category.toLowerCase()} needs in 2026`,
        `3. Demo, quick walkthrough of the most-missed item`,
        `4. CTA, "Free audit at the link in bio"`,
      ];

  return [
    `# Content idea for ${lead.businessName}`,
    `Niche: ${lead.category} · City: ${lead.city}`,
    ``,
    `## Angle`,
    angle,
    ``,
    `## Beats`,
    beats.join("\n"),
    ``,
    `## Suggested hashtags`,
    `#localbusiness #${lead.city.toLowerCase().replace(/\s+/g, "")} #${lead.category.toLowerCase().replace(/[^a-z]/g, "")} #localseo #freelance`,
    ``,
    `## Compliance reminder`,
    `Use cautious wording: "could help", "based on visible website signals". No guaranteed-result claims.`,
  ].join("\n");
}

// ── Dispatcher ────────────────────────────────────────────────────────────

export function generateAuditReport(
  format: ReportFormat,
  lead: Lead,
  audit: RichAuditData | undefined,
  score?: LeadScore,
): string {
  switch (format) {
    case "dm": return sanitizeCopyOutput(generateDmReport(lead, audit));
    case "email": return sanitizeCopyOutput(generateEmailReport(lead, audit, score));
    case "full": return sanitizeCopyOutput(generateFullAuditReport(lead, audit, score));
    case "content_idea": return sanitizeCopyOutput(generateContentIdeaReport(lead, audit, score));
  }
}

export const REPORT_FORMATS: { id: ReportFormat; label: string; description: string }[] = [
  { id: "dm", label: "DM", description: "Short DM, Instagram / X / LinkedIn" },
  { id: "email", label: "Email", description: "Personalised email draft" },
  { id: "full", label: "Full audit", description: "Structured client-ready report" },
  { id: "content_idea", label: "Content idea", description: "Video / post angle for this lead's niche" },
];
