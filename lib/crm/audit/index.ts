export * from "./types";
export { ISSUE_CATALOG } from "./issues-catalog";
export { ISSUE_CATALOG_NL } from "./issues-catalog-nl";
export { computeRichAudit, DIMENSION_KEYS, OVERALL_WEIGHTS } from "./compute";

// ── Locale dispatch ───────────────────────────────────────────────────────
import { ISSUE_CATALOG } from "./issues-catalog";
import { ISSUE_CATALOG_NL } from "./issues-catalog-nl";
import type { IssueCatalog, AuditChecklist, AuditChecklistKey, AuditIssue } from "./types";

export type Locale = "en" | "nl";

export function getIssueCatalog(locale: Locale): IssueCatalog {
  return locale === "nl" ? ISSUE_CATALOG_NL : ISSUE_CATALOG;
}

const SEVERITY_RANK = { critical: 4, high: 3, medium: 2, low: 1 } as const;

/** Build the localized issue list directly from a checklist + locale. */
export function buildLocalizedIssues(
  checklist: AuditChecklist,
  locale: Locale,
): AuditIssue[] {
  const catalog = getIssueCatalog(locale);
  const issues: AuditIssue[] = [];
  for (const k of Object.keys(catalog) as AuditChecklistKey[]) {
    if (checklist[k]) continue;
    issues.push({ key: k, ...catalog[k] });
  }
  issues.sort((a, b) => {
    const s = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (s !== 0) return s;
    return a.title.localeCompare(b.title);
  });
  return issues;
}
