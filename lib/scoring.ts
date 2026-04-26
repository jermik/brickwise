import { Property, RiskLevel, ValueStatus } from "./types";

export function scoreColor(score: number): string {
  if (score >= 85) return "#16a34a";
  if (score >= 70) return "#b45309";
  return "#dc2626";
}

export function scoreLabel(score: number): string {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Moderate";
  return "Weak";
}

export function riskColor(risk: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    Low: "#16a34a",
    Medium: "#b45309",
    High: "#dc2626",
  };
  return map[risk];
}

export function valueStatusLabel(status: ValueStatus): string {
  const map: Record<ValueStatus, string> = {
    undervalued: "Undervalued",
    fair: "Fair value",
    overpriced: "Overpriced",
  };
  return map[status];
}

export function valueStatusColors(status: ValueStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const map: Record<ValueStatus, { bg: string; text: string; border: string }> =
    {
      undervalued: {
        bg: "#f0fdf4",
        text: "#15803d",
        border: "#bbf7d0",
      },
      fair: {
        bg: "#f5f5f5",
        text: "#737373",
        border: "#e5e5e5",
      },
      overpriced: {
        bg: "#fef2f2",
        text: "#dc2626",
        border: "#fecaca",
      },
    };
  return map[status];
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    RealT: "#3b82f6",
    EstateX: "#8b5cf6",
    Blocksquare: "#f59e0b",
    "LABS Group": "#ec4899",
    RealtyX: "#14b8a6",
  };
  return map[platform] ?? "#9ca3af";
}

export function filterAndSort(
  properties: Property[],
  filters: {
    minYield: number;
    risk: string;
    valueStatus: string;
    country: string;
  },
  sortKey: string
): Property[] {
  return properties
    .filter((p) => {
      if (p.expectedYield < filters.minYield) return false;
      if (filters.risk !== "All" && p.risk !== filters.risk) return false;
      if (
        filters.valueStatus !== "All" &&
        p.fairValueStatus !== filters.valueStatus
      )
        return false;
      if (filters.country !== "All" && p.country !== filters.country)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "yield":
          return b.expectedYield - a.expectedYield;
        case "price":
          return a.tokenPrice - b.tokenPrice;
        case "monthly":
          return b.monthlyRent - a.monthlyRent;
        default:
          return b.overallScore - a.overallScore;
      }
    });
}
