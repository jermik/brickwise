// Rich audit types — structured issue catalog + multi-dimension scoring
// derived deterministically from the existing AuditChecklist.

import type { AuditChecklist, AuditChecklistKey, AuditDimension } from "../types";

export type IssueSeverity = "low" | "medium" | "high" | "critical";
export type IssueDifficulty = "easy" | "medium" | "hard";

export interface ImplementationEstimate {
  minHours: number;
  maxHours: number;
}

export interface AuditIssue {
  /** Links back to the AuditChecklist boolean key. */
  key: AuditChecklistKey;
  title: string;
  severity: IssueSeverity;
  dimension: AuditDimension;
  whyItMatters: string;
  likelyImpact: string;
  suggestedFix: string;
  difficulty: IssueDifficulty;
  implementation: ImplementationEstimate;
  outreachAngle: string;
  clientFriendlyExplanation: string;
}

/** All nine dimension scores, each 0–100. Higher = better. */
export interface RichAuditScores {
  overall: number;
  conversion: number;
  mobile: number;
  speed: number;
  trust: number;
  localSeo: number;
  bookingFriction: number;
  copyClarity: number;
  designQuality: number;
}

export interface RichAuditData {
  scores: RichAuditScores;
  /** All present issues (i.e. checks that failed), ranked highest-impact first. */
  issues: AuditIssue[];
  /** Top 3 issues — the priority talking points for outreach. */
  topPriority: AuditIssue[];
  /** ISO timestamp of when this rich audit was computed. */
  generatedAt: string;
  /** Hash of the source AuditChecklist for caching/comparison. */
  checklistFingerprint: string;
}

export type IssueCatalogEntry = Omit<AuditIssue, "key">;
export type IssueCatalog = Record<AuditChecklistKey, IssueCatalogEntry>;

export type DimensionWeights = Record<keyof RichAuditScores, number>;

/** Map each dimension to the AuditChecklist keys that contribute to it. */
export type DimensionKeyMap = Record<keyof Omit<RichAuditScores, "overall">, AuditChecklistKey[]>;

// Re-exports for convenience
export type { AuditChecklist, AuditChecklistKey, AuditDimension };
