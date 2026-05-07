import type {
  AuditChecklist,
  AuditChecklistKey,
  AuditIssue,
  DimensionKeyMap,
  IssueSeverity,
  RichAuditData,
  RichAuditScores,
} from "./types";
import { ISSUE_CATALOG } from "./issues-catalog";

// ─────────────────────────────────────────────────────────────────────────
// Rich audit computation — deterministic. Same checklist always produces
// the same RichAuditData. Pure function over the AuditChecklist.
// ─────────────────────────────────────────────────────────────────────────

/** Map each non-overall dimension to the AuditChecklist keys that contribute. */
const DIMENSION_KEYS: DimensionKeyMap = {
  conversion: [
    "hasClearOffer",
    "lowContactFriction",
    "lowBookingFriction",
    "hasAboveFoldCTA",
    "hasMobileCTA",
    "hasLeadCapture",
    "hasClearCTA",
  ],
  mobile: ["isMobileFriendly", "hasMobileCTA"],
  speed: ["loadsFast"],
  trust: [
    "hasTrustSignals",
    "hasGoogleMapsLink",
    "hasGoogleBusinessProfile",
    "hasContactForm",
    "hasPhoneVisible",
  ],
  localSeo: [
    "hasLocalSEOTitle",
    "hasMetaDescription",
    "hasLocalKeywords",
    "hasCityLandingPage",
    "hasGoogleBusinessProfile",
    "hasSchemaMarkup",
  ],
  bookingFriction: [
    "lowBookingFriction",
    "hasBookingAutomation",
    "hasContactForm",
    "hasMobileCTA",
  ],
  copyClarity: ["hasClearOffer", "hasClearCTA", "hasH1", "hasMetaDescription"],
  designQuality: ["hasModernDesign", "isMobileFriendly", "hasHeadingStructure"],
};

/** Weights for the overall score. Sum to 1. */
const OVERALL_WEIGHTS: Record<keyof Omit<RichAuditScores, "overall">, number> = {
  conversion: 0.25,
  mobile: 0.18,
  speed: 0.10,
  trust: 0.14,
  localSeo: 0.15,
  bookingFriction: 0.06,
  copyClarity: 0.06,
  designQuality: 0.06,
};

function dimensionScore(checklist: AuditChecklist, keys: AuditChecklistKey[]): number {
  if (keys.length === 0) return 0;
  const passed = keys.filter((k) => checklist[k]).length;
  return Math.round((passed / keys.length) * 100);
}

function computeScores(checklist: AuditChecklist): RichAuditScores {
  const conversion = dimensionScore(checklist, DIMENSION_KEYS.conversion);
  const mobile = dimensionScore(checklist, DIMENSION_KEYS.mobile);
  const speed = dimensionScore(checklist, DIMENSION_KEYS.speed);
  const trust = dimensionScore(checklist, DIMENSION_KEYS.trust);
  const localSeo = dimensionScore(checklist, DIMENSION_KEYS.localSeo);
  const bookingFriction = dimensionScore(checklist, DIMENSION_KEYS.bookingFriction);
  const copyClarity = dimensionScore(checklist, DIMENSION_KEYS.copyClarity);
  const designQuality = dimensionScore(checklist, DIMENSION_KEYS.designQuality);

  const overall = Math.round(
    conversion * OVERALL_WEIGHTS.conversion +
      mobile * OVERALL_WEIGHTS.mobile +
      speed * OVERALL_WEIGHTS.speed +
      trust * OVERALL_WEIGHTS.trust +
      localSeo * OVERALL_WEIGHTS.localSeo +
      bookingFriction * OVERALL_WEIGHTS.bookingFriction +
      copyClarity * OVERALL_WEIGHTS.copyClarity +
      designQuality * OVERALL_WEIGHTS.designQuality,
  );

  return {
    overall,
    conversion,
    mobile,
    speed,
    trust,
    localSeo,
    bookingFriction,
    copyClarity,
    designQuality,
  };
}

const SEVERITY_RANK: Record<IssueSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function buildIssues(checklist: AuditChecklist): AuditIssue[] {
  const issues: AuditIssue[] = [];
  for (const k of Object.keys(ISSUE_CATALOG) as AuditChecklistKey[]) {
    if (checklist[k]) continue; // check passed → no issue
    const meta = ISSUE_CATALOG[k];
    issues.push({ key: k, ...meta });
  }
  // Sort by severity desc, then alpha by title for stable output.
  issues.sort((a, b) => {
    const s = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (s !== 0) return s;
    return a.title.localeCompare(b.title);
  });
  return issues;
}

function fingerprint(checklist: AuditChecklist): string {
  // Cheap deterministic hash — sorted key order, 1/0 string.
  const keys = (Object.keys(checklist) as AuditChecklistKey[]).sort();
  return keys.map((k) => (checklist[k] ? "1" : "0")).join("");
}

export function computeRichAudit(checklist: AuditChecklist): RichAuditData {
  const scores = computeScores(checklist);
  const issues = buildIssues(checklist);
  const topPriority = issues.slice(0, 3);
  return {
    scores,
    issues,
    topPriority,
    generatedAt: new Date().toISOString(),
    checklistFingerprint: fingerprint(checklist),
  };
}

export { DIMENSION_KEYS, OVERALL_WEIGHTS };
