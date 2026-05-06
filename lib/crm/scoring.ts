import type { AuditChecklist, AuditDimension, AuditFieldMeta, OfferId } from "./types";
import { AUDIT_FIELDS, AUDIT_FIELDS_BY_DIMENSION } from "./types";

// ── Per-dimension score (0-100) ─────────────────────────────────────────────

function dimensionScore(checklist: AuditChecklist, dimension: AuditDimension): number {
  const fields = AUDIT_FIELDS_BY_DIMENSION[dimension];
  if (fields.length === 0) return 0;
  let weighted = 0;
  let totalWeight = 0;
  for (const f of fields) {
    totalWeight += f.impact;
    if (checklist[f.key]) weighted += f.impact;
  }
  return Math.round((weighted / totalWeight) * 100);
}

export function computeWebsiteScore(c: AuditChecklist): number {
  return dimensionScore(c, "website");
}

export function computeSEOScore(c: AuditChecklist): number {
  return dimensionScore(c, "seo");
}

export function computeConversionScore(c: AuditChecklist): number {
  return dimensionScore(c, "conversion");
}

export function computeAutomationScore(c: AuditChecklist): number {
  return dimensionScore(c, "automation");
}

export function computeAllScores(c: AuditChecklist) {
  return {
    websiteScore: computeWebsiteScore(c),
    seoScore: computeSEOScore(c),
    conversionScore: computeConversionScore(c),
    automationScore: computeAutomationScore(c),
  };
}

// ── Top-3 problems / top-3 improvements ─────────────────────────────────────

function unchecked(checklist: AuditChecklist): AuditFieldMeta[] {
  return AUDIT_FIELDS.filter((f) => !checklist[f.key]);
}

function rankByImpact(fields: AuditFieldMeta[]): AuditFieldMeta[] {
  return [...fields].sort((a, b) => b.impact - a.impact);
}

export function computeTopProblems(checklist: AuditChecklist, n = 3): string[] {
  return rankByImpact(unchecked(checklist))
    .slice(0, n)
    .map((f) => f.problem);
}

export function computeTopImprovements(checklist: AuditChecklist, n = 3): string[] {
  return rankByImpact(unchecked(checklist))
    .slice(0, n)
    .map((f) => f.improvement);
}

// ── Suggested offer ─────────────────────────────────────────────────────────

export function suggestOffer(c: AuditChecklist): OfferId {
  const w = computeWebsiteScore(c);
  const s = computeSEOScore(c);
  const a = computeAutomationScore(c);

  // Very weak website → start with a Starter
  if (w < 35) return "starter";

  // Decent site but invisible in search → Local SEO Sprint
  if (w >= 50 && s < 50) return "local_seo";

  // Solid site, manual ops → Automation Add-on
  if (w >= 60 && a < 50) return "automation";

  // Multi-axis weakness with potential → Growth + Automation
  if (w < 55 && a < 55) return "growth_plus_automation";

  // Default upgrade path: Growth Website
  return "growth";
}

// ── Audit summary ───────────────────────────────────────────────────────────

export function generateAuditSummary(
  checklist: AuditChecklist,
  businessName: string,
  category: string,
): string {
  const scores = computeAllScores(checklist);
  const dimensions: [string, number][] = [
    ["website basics", scores.websiteScore],
    ["local SEO", scores.seoScore],
    ["conversion", scores.conversionScore],
    ["automation", scores.automationScore],
  ];
  const weakest = dimensions.sort((a, b) => a[1] - b[1])[0];

  const overall = Math.round(
    (scores.websiteScore + scores.seoScore + scores.conversionScore + scores.automationScore) / 4,
  );

  if (overall >= 80) {
    return `${businessName} is in good shape overall (${overall}/100). The biggest remaining opportunity is in ${weakest[0]}.`;
  }
  if (overall >= 55) {
    return `${businessName} (${category}) has a working site but real upside in ${weakest[0]} (${weakest[1]}/100).`;
  }
  return `${businessName} (${category}) has clear improvement opportunities, especially in ${weakest[0]} (${weakest[1]}/100). Several quick wins available.`;
}
