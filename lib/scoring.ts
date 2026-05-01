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
  return map[status] ?? { bg: "#f5f5f5", text: "#737373", border: "#e5e5e5" };
}

export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    RealT: "#3b82f6",
    Lofty: "#f97316",
    EstateX: "#8b5cf6",
    Blocksquare: "#f59e0b",
    "LABS Group": "#ec4899",
    RealtyX: "#14b8a6",
  };
  return map[platform] ?? "#9ca3af";
}

export function calcPaybackYears(p: Property): number {
  const totalValue = p.tokenPrice * p.totalTokens;
  const annualIncome = p.monthlyRent * 12 * (p.occupancyRate / 100);
  if (annualIncome <= 0) return 99;
  return +(totalValue / annualIncome).toFixed(1);
}

export function calcCapRate(p: Property): number {
  const totalValue = p.tokenPrice * p.totalTokens;
  if (totalValue <= 0) return 0;
  const fees = p.fees ?? { propertyTax: 0, insurance: 0, management: 0 };
  const annualNOI = (p.monthlyRent - fees.propertyTax - fees.insurance - fees.management) * 12;
  return +((annualNOI / totalValue) * 100).toFixed(1);
}

export function calcFeeBurden(p: Property): number {
  if (!p.monthlyRent || p.monthlyRent <= 0) return 0;
  const fees = p.fees ?? { propertyTax: 0, insurance: 0, management: 0 };
  return +((( fees.propertyTax + fees.insurance + fees.management) / p.monthlyRent) * 100).toFixed(0);
}

export function calcMonthlyReturn(p: Property, amount: number): number {
  return +(amount * p.expectedYield / 1200).toFixed(2);
}

export function filterAndSort(
  properties: Property[],
  filters: {
    minYield: number;
    risk: string;
    valueStatus: string;
    country: string;
    platform?: string;
    propertyType?: string;
    minOccupancy?: number;
    maxPrice?: number | null;
  },
  sortKey: string
): Property[] {
  return properties
    .filter((p) => {
      if (p.expectedYield < filters.minYield) return false;
      if (filters.risk !== "All" && p.risk !== filters.risk) return false;
      if (filters.valueStatus !== "All" && p.fairValueStatus !== filters.valueStatus) return false;
      if (filters.country !== "All" && p.country !== filters.country) return false;
      if (filters.platform && filters.platform !== "All" && p.platform !== filters.platform) return false;
      if (filters.propertyType && filters.propertyType !== "All" && p.propertyType !== filters.propertyType) return false;
      if (filters.minOccupancy && p.occupancyRate < filters.minOccupancy) return false;
      if (filters.maxPrice && p.tokenPrice > filters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "yield": return b.expectedYield - a.expectedYield;
        case "price": return a.tokenPrice - b.tokenPrice;
        case "monthly": return b.monthlyRent - a.monthlyRent;
        case "payback": return calcPaybackYears(a) - calcPaybackYears(b);
        case "occupancy": return b.occupancyRate - a.occupancyRate;
        case "caprate": return calcCapRate(b) - calcCapRate(a);
        default: return b.overallScore - a.overallScore;
      }
    });
}
