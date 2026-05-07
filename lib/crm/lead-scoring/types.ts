// Deterministic lead-quality scoring. Higher score = higher OPPORTUNITY
// (a "hot" lead has the most room for value-add, not the most ready to
// buy in a sales-funnel sense).

export type LeadScoreCategory = "hot" | "warm" | "maybe" | "low";

export interface LeadScoreBreakdown {
  /** 0–40 — derived from how many audit issues are present + severity. */
  auditOpportunity: number;
  /** 0–15 — premium niches (dentist, real-estate, accountant) score higher. */
  nicheValue: number;
  /** 0–10 — major cities score lower (more competition). */
  cityOpportunity: number;
  /** 0–15 — outreach reachability (email + phone + valid website). */
  outreachPotential: number;
  /** 0–10 — completeness of contact info on the lead record. */
  contactCompleteness: number;
  /** 0–10 — engagement signals (replied, meeting booked, etc.). */
  engagementSignal: number;
}

export interface LeadScore {
  /** Total 0–100, sum of breakdown components. */
  score: number;
  category: LeadScoreCategory;
  breakdown: LeadScoreBreakdown;
  /** Human-readable reasons this lead matters now. Top 3–5. */
  topContactReasons: string[];
  /** Best opening angle for outreach. */
  outreachAngle: string;
  /** Recommended offer (matches OFFER_TEMPLATES ids). */
  suggestedOffer: string;
  /** A 1–2 sentence opener — copy-paste ready. */
  firstMessageIdea: string;
  /** Audit-driven hook line for the first message. */
  auditHook: string;
  /** Recommended content angle to cover this lead's vertical. */
  recommendedContentIdea: string;
  generatedAt: string;
}
