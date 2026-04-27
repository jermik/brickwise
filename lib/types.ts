export type RiskLevel = "Low" | "Medium" | "High";
export type ValueStatus = "undervalued" | "fair" | "overpriced";
export type Platform = "RealT" | "Lofty" | "EstateX" | "Blocksquare" | "LABS Group" | "RealtyX";
export type PropertyType = "Single Family" | "Multi Family" | "Condo" | "Commercial" | "Mixed Use";

export interface PropertyFees {
  propertyTax: number;  // monthly €
  insurance: number;    // monthly €
  management: number;   // monthly €
}

export interface Property {
  id: number;
  name: string;
  city: string;
  country: string;
  flag: string;
  image: string;
  // property details
  propertyType: PropertyType;
  squareFeet: number;
  yearBuilt: number;
  // financials
  tokenPrice: number;
  totalTokens: number;
  grossYield: number;
  expectedYield: number;
  monthlyRent: number;
  fees: PropertyFees;
  occupancyRate: number;
  // risk / value
  risk: RiskLevel;
  fairValueStatus: ValueStatus;
  // platform
  platform: Platform;
  sourceUrl: string;       // exact listing URL — empty string if unverified
  sourceVerified: boolean; // true only when sourceUrl points to a confirmed live listing
  source: string;
  lastUpdated: string;
  // content
  shortDescription: string;
  longDescription: string;
  attractiveNote: string;
  riskNote: string;
  tags: string[];
  // freshness
  isNew?: boolean;
  // scores (0–100)
  yieldScore: number;
  riskScore: number;
  neighborhoodScore: number;
  valueScore: number;
  overallScore: number;
}

export interface Holding {
  propertyId: number;
  tokens: number;
  currentValue: number;
}

export type SortKey = "score" | "yield" | "price" | "monthly";
export type ViewMode = "grid" | "list";

export interface FilterState {
  minYield: number;
  risk: RiskLevel | "All";
  valueStatus: ValueStatus | "All";
  country: string;
  maxPrice: number | null;
  platform: Platform | "All";
}
