// Types for the Algorand ecosystem database.
// Phase 1: JSON-driven, SSG. Phase 2 (later) can migrate to Postgres without
// changing this type contract — the AlgorandProject shape stays stable.

export type AlgorandCategory =
  | "Wallet"
  | "DEX"
  | "DeFi"
  | "NFT"
  | "Infrastructure"
  | "Tooling"
  | "Stablecoin"
  | "RWA"
  | "Gaming"
  | "Analytics"
  | "Bridge"
  | "Governance"
  | "Identity"
  | "AI";

export interface AlgorandProjectSocials {
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  medium?: string;
  docs?: string;
}

export interface AlgorandProject {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: AlgorandCategory;
  subcategories?: AlgorandCategory[];
  website: string;
  socials?: AlgorandProjectSocials;
  tokenTicker?: string;
  tokenAsaId?: number;
  chain: "Algorand";
  logoUrl?: string;      // remote URL OR /public path. Falls back to letter avatar.
  coverImageUrl?: string;
  featured?: boolean;
  verified?: boolean;    // Brickwise-verified info
  launchYear?: number;
  ecosystemTags: string[];
  aiSummary?: string;
}
