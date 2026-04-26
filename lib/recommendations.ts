import { Property, Holding } from "./types";

export type Action = "Buy" | "Hold" | "Avoid";

export interface Recommendation {
  action: Action;
  reason: string;
  label?: string;
}

export interface Confidence {
  level: "High" | "Medium" | "Low";
  reason: string;
}

export interface Comparison {
  yieldDelta: number | null;       // pp vs city peers (positive = above avg)
  cityAvgYield: number | null;
  scorePercentile: number;         // 0–100, higher is better
  betterThanPct: number;           // % of platform properties this beats
}

// ── Helpers ───────────────────────────────────────────────────────────

function cityPeers(city: string, all: Property[]): Property[] {
  return all.filter((p) => p.city === city);
}

function cityAvgYield(city: string, all: Property[]): number | null {
  const peers = cityPeers(city, all);
  if (peers.length < 3) return null;
  return +(peers.reduce((s, p) => s + p.expectedYield, 0) / peers.length).toFixed(1);
}

function scorePercentile(p: Property, all: Property[]): number {
  const below = all.filter((q) => q.overallScore < p.overallScore).length;
  return Math.round((below / all.length) * 100);
}

// ── Core recommendation ───────────────────────────────────────────────

export function getRecommendation(p: Property, allProperties?: Property[]): Recommendation {
  const avgYield = allProperties ? cityAvgYield(p.city, allProperties) : null;
  const yieldDelta = avgYield !== null ? +(p.expectedYield - avgYield).toFixed(1) : null;
  const deltaStr =
    yieldDelta !== null && yieldDelta > 0
      ? ` — +${yieldDelta}pp above ${p.city} avg`
      : yieldDelta !== null && yieldDelta < 0
      ? ` — ${yieldDelta}pp below ${p.city} avg`
      : "";

  // ── Avoid ──────────────────────────────────────────────────────────
  if (p.fairValueStatus === "overpriced" && p.expectedYield < 6.5) {
    return {
      action: "Avoid",
      reason: `Token overpriced vs fair value · ${p.expectedYield}% yield below 6.5% minimum`,
    };
  }
  if (p.overallScore < 72) {
    return {
      action: "Avoid",
      reason: `Score ${p.overallScore} — below 72-point investment threshold`,
    };
  }
  if (p.occupancyRate < 85) {
    return {
      action: "Avoid",
      reason: `${p.occupancyRate}% occupancy — persistent vacancy risk`,
    };
  }

  // ── Buy gate: score ≥ 78, not High risk, not overpriced ────────────
  if (
    p.overallScore >= 78 &&
    p.risk !== "High" &&
    p.fairValueStatus !== "overpriced"
  ) {
    const highYield = p.expectedYield >= 9.0;
    const undervaluedYield =
      p.fairValueStatus === "undervalued" && p.expectedYield >= 7.5;
    const topScore = p.overallScore >= 84;

    if (highYield || undervaluedYield || topScore) {
      let reason: string;

      if (topScore && p.fairValueStatus === "undervalued") {
        reason = `Score ${p.overallScore} · token undervalued · ${p.expectedYield}% yield${deltaStr} · ${p.occupancyRate}% occupied`;
      } else if (topScore) {
        reason = `Score ${p.overallScore} · ${p.expectedYield}% yield${deltaStr} · ${p.occupancyRate}% occupied`;
      } else if (highYield && p.fairValueStatus === "undervalued") {
        reason = `${p.expectedYield}% net yield${deltaStr} · token undervalued · ${p.occupancyRate}% occupied`;
      } else if (highYield) {
        reason = `${p.expectedYield}% net yield${deltaStr || " — above market avg"} · ${p.risk} risk`;
      } else {
        reason = `Token undervalued · ${p.expectedYield}% yield${deltaStr} · ${p.occupancyRate}% occupied`;
      }

      return {
        action: "Buy",
        reason,
        label: p.overallScore >= 84 ? "Best Buy" : undefined,
      };
    }
  }

  return {
    action: "Hold",
    reason: `Score ${p.overallScore} · ${p.expectedYield}% yield${deltaStr} — solid but no compelling entry signal`,
  };
}

// ── Confidence ────────────────────────────────────────────────────────

export function getConfidence(p: Property): Confidence {
  const minScore = Math.min(p.yieldScore, p.riskScore, p.neighborhoodScore, p.valueScore);

  if (
    p.occupancyRate >= 95 &&
    p.riskScore >= 85 &&
    p.overallScore >= 80 &&
    minScore >= 65
  ) {
    return {
      level: "High",
      reason: `${p.occupancyRate}% occupancy · risk score ${p.riskScore}/100 · consistent across all metrics`,
    };
  }
  if (p.occupancyRate >= 88 && p.riskScore >= 72 && p.overallScore >= 72) {
    return {
      level: "Medium",
      reason: `${p.occupancyRate}% occupancy · moderate consistency across metrics`,
    };
  }
  return {
    level: "Low",
    reason:
      p.occupancyRate < 88
        ? `${p.occupancyRate}% occupancy limits income reliability`
        : `Risk score ${p.riskScore} — higher prediction uncertainty`,
  };
}

// ── Market comparison ─────────────────────────────────────────────────

export function getComparison(p: Property, allProperties: Property[]): Comparison {
  const avg = cityAvgYield(p.city, allProperties);
  const delta = avg !== null ? +(p.expectedYield - avg).toFixed(1) : null;
  const pctile = scorePercentile(p, allProperties);
  const betterThan = Math.round(
    (allProperties.filter((q) => q.overallScore < p.overallScore).length /
      allProperties.length) *
      100
  );
  return {
    yieldDelta: delta,
    cityAvgYield: avg,
    scorePercentile: pctile,
    betterThanPct: betterThan,
  };
}

// ── Urgency signal ────────────────────────────────────────────────────

export function getUrgencySignal(p: Property, allProperties: Property[]): string | null {
  if (getRecommendation(p, allProperties).action !== "Buy") return null;

  // Rare: high yield + low risk (≤4 properties on platform)
  if (p.expectedYield >= 9.0 && p.risk === "Low") {
    const count = allProperties.filter(
      (q) => q.expectedYield >= 9.0 && q.risk === "Low"
    ).length;
    if (count <= 4) return "Rare: high yield + low risk";
  }

  // Top 10% by overall score
  const sorted = [...allProperties].sort((a, b) => b.overallScore - a.overallScore);
  const rank = sorted.findIndex((q) => q.id === p.id) + 1;
  if (rank <= Math.max(1, Math.round(allProperties.length * 0.1))) {
    return "Top 10% on platform";
  }

  // Near-zero vacancy record
  if (p.occupancyRate >= 98) return "Near-zero vacancy record";

  // Strong undervalued + high value score
  if (p.fairValueStatus === "undervalued" && p.valueScore >= 85) {
    return "Strong value play — underpriced entry";
  }

  return null;
}

// ── €1,000 calculator ─────────────────────────────────────────────────

export function getThousandEuroReturn(
  p: Property,
  allProperties: Property[]
): { monthly: number; annual: number; vsAvgMonthly: number } {
  const avg = cityAvgYield(p.city, allProperties) ?? p.expectedYield;
  const monthly = +(1000 * p.expectedYield / 1200).toFixed(2);
  const annual = +(monthly * 12).toFixed(0);
  const avgMonthly = +(1000 * avg / 1200).toFixed(2);
  return {
    monthly,
    annual: Number(annual),
    vsAvgMonthly: +(monthly - avgMonthly).toFixed(2),
  };
}

// ── Best single pick ──────────────────────────────────────────────────

export function getBestPick(properties: Property[]): Property | null {
  return (
    properties
      .filter((p) => getRecommendation(p, properties).action === "Buy")
      .sort((a, b) => {
        const score = (p: Property) =>
          p.overallScore +
          (p.fairValueStatus === "undervalued" ? 6 : 0) +
          (p.expectedYield >= 9 ? 4 : 0) +
          (p.risk === "Low" ? 3 : 0);
        return score(b) - score(a);
      })[0] ?? null
  );
}

// ── Behavioral mistake patterns ───────────────────────────────────────

export interface MistakeInsight {
  message: string;
  detail: string;
}

export function getAvoidMistakes(
  holdings: Holding[],
  properties: Property[]
): MistakeInsight[] {
  const insights: MistakeInsight[] = [];

  const held = holdings
    .map((h) => properties.find((p) => p.id === h.propertyId))
    .filter(Boolean) as Property[];

  if (held.length === 0) return [];

  const buyPool = properties.filter(
    (p) => getRecommendation(p, properties).action === "Buy"
  );

  // Pattern 1 — high-risk holdings with safer Buy alternatives
  const highRisk = held.filter((p) => p.risk === "High");
  const saferBuys = buyPool.filter((p) => p.risk !== "High");
  if (highRisk.length > 0 && saferBuys.length > 0) {
    const topSafer = saferBuys.sort((a, b) => b.expectedYield - a.expectedYield)[0];
    insights.push({
      message: `${highRisk.length === 1 ? "One holding" : `${highRisk.length} holdings`} rated High risk`,
      detail: `${saferBuys.length} safer Buy alternative${saferBuys.length > 1 ? "s" : ""} available — top option yields ${topSafer.expectedYield}% with Low risk`,
    });
  }

  // Pattern 2 — yield gap vs top available
  const avgHeld = +(held.reduce((s, p) => s + p.expectedYield, 0) / held.length).toFixed(1);
  const topYield = Math.max(...buyPool.map((p) => p.expectedYield));
  const topYieldProp = buyPool.find((p) => p.expectedYield === topYield)!;
  const gap = +(topYield - avgHeld).toFixed(1);
  if (gap >= 1.5) {
    const totalHeld = holdings.reduce((s, h) => s + h.currentValue, 0);
    const monthlyLost = Math.round((totalHeld * gap) / 1200);
    insights.push({
      message: `Holdings average ${avgHeld}% yield — ${gap}pp below best available`,
      detail: `Switching to ${topYieldProp.name} (${topYield}%) would add ~€${monthlyLost}/month across your portfolio`,
    });
  }

  // Pattern 3 — overpriced holdings with undervalued Buy alternatives
  const overpriced = held.filter((p) => p.fairValueStatus === "overpriced");
  const undervaluedBuys = buyPool.filter((p) => p.fairValueStatus === "undervalued");
  if (overpriced.length > 0 && undervaluedBuys.length > 0) {
    insights.push({
      message: `You hold ${overpriced.length} overpriced token${overpriced.length > 1 ? "s" : ""}`,
      detail: `${undervaluedBuys.length} undervalued entr${undervaluedBuys.length === 1 ? "y is" : "ies are"} rated Buy — same income at a better price`,
    });
  }

  return insights;
}

// ── Missed profit ─────────────────────────────────────────────────────

export interface MissedInsight {
  held: Property;
  better: Property;
  deltaMonthly: number;
  deltaAnnual: number;
  deltaYield: number;
  investmentAmount: number;
}

export function getMissedInsights(
  holdings: Holding[],
  properties: Property[]
): MissedInsight[] {
  const heldIds = new Set(holdings.map((h) => h.propertyId));
  const buyableNotHeld = properties.filter(
    (p) => getRecommendation(p, properties).action === "Buy" && !heldIds.has(p.id)
  );

  const insights: MissedInsight[] = [];

  for (const holding of holdings) {
    const heldProp = properties.find((p) => p.id === holding.propertyId);
    if (!heldProp) continue;

    const better = buyableNotHeld
      .filter((p) => p.expectedYield > heldProp.expectedYield + 0.5)
      .sort((a, b) => b.expectedYield - a.expectedYield)[0];

    if (!better) continue;

    const investmentAmount = holding.currentValue;
    const currentMonthly = (investmentAmount * heldProp.expectedYield) / 1200;
    const newMonthly = (investmentAmount * better.expectedYield) / 1200;
    const deltaMonthly = Math.round(newMonthly - currentMonthly);
    const deltaYield = +(better.expectedYield - heldProp.expectedYield).toFixed(1);
    const deltaAnnual = deltaMonthly * 12;

    if (deltaMonthly > 5) {
      insights.push({
        held: heldProp,
        better,
        deltaMonthly,
        deltaAnnual,
        deltaYield,
        investmentAmount,
      });
    }
  }

  return insights.sort((a, b) => b.deltaMonthly - a.deltaMonthly).slice(0, 2);
}

// ── Split note text into bullet points ───────────────────────────────

export function toPoints(text: string): string[] {
  return text
    .split(/\.\s+/)
    .map((s) => s.replace(/\.$/, "").trim())
    .filter((s) => s.length > 15)
    .slice(0, 3);
}
