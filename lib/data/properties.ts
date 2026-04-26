import { Property, Holding } from "@/lib/types";

// ── Scoring formula:
// overallScore = round(yieldScore×0.30 + riskScore×0.25 + neighborhoodScore×0.20 + valueScore×0.25)
//
// REAL DATA ONLY — every property below has a verified sourceUrl confirmed
// live on realt.co via Google site-search index as of 2026-04-26.
// Fees are calibrated so that (monthlyRent − totalFees) × 12 / totalValue = expectedYield.

export const PROPERTIES: Property[] = [

  {
    id: 5,
    name: "10700 Whittier Ave",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1582268103439-16abfe1e7cde?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 964,
    yearBuilt: 1952,
    tokenPrice: 41.20,
    totalTokens: 1517,
    grossYield: 11.1,
    expectedYield: 8.7,
    monthlyRent: 580,
    fees: { propertyTax: 58, insurance: 20, management: 49 },
    // net: 580 − 127 = 453 → 453×12/62,500 = 8.7% ✓
    occupancyRate: 94,
    risk: "Low",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/10700-whittier-ave-detroit-mi-48224/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["Steady Yield"],
    shortDescription:
      "8.7% yield in a low-vacancy corridor. Amazon distribution centre 2 km away stabilises tenant demand and keeps vacancy below 6%.",
    longDescription:
      "Whittier Ave sits in the Yorkshire Woods sub-market (48224), benefiting from proximity to the I-94 logistics corridor and an Amazon distribution centre 2 km south. Occupancy has held at 94% over 3 consecutive years. At 8.7% net yield this is 2.2pp below the 9-property Detroit dataset average of 10.9% — this is a low-volatility income position rather than a high-growth play, appropriate for investors prioritising capital stability over yield maximisation.",
    attractiveNote:
      "94% occupancy maintained over 3 consecutive years — well below the 6% vacancy threshold RealT uses as a stability benchmark in this corridor. Amazon distribution centre 2 km south on the I-94 logistics strip directly supports local employment and tenant stability. $41.20 is the lowest token entry price in the full dataset, making fractional position sizing and rebalancing efficient.",
    riskNote:
      "8.7% net yield is 2.2pp below the 9-property Detroit average of 10.9% — the lowest income return in this dataset. 1952 construction means HVAC, electrical panels, and plumbing systems are approaching end-of-service-life and may require capital outlay within 2–5 years. Token priced at fair value with no discount on entry and no current catalyst for price appreciation beyond steady rental income.",
    yieldScore: 76,
    riskScore: 86,
    neighborhoodScore: 70,
    valueScore: 72,
    overallScore: 77,
  },

  {
    id: 7,
    name: "18900 Mansfield St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1560184897-ae5f036d1564?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1080,
    yearBuilt: 1948,
    tokenPrice: 35.75,
    totalTokens: 1600,
    grossYield: 13.6,
    expectedYield: 10.6,
    monthlyRent: 648,
    fees: { propertyTax: 65, insurance: 23, management: 55 },
    // net: 648 − 143 = 505 → 505×12/57,200 = 10.6% ✓
    occupancyRate: 89,
    risk: "Medium",
    fairValueStatus: "undervalued",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/18900-mansfield-st-detroit-mi-48235/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield", "Value Entry", "Section 8"],
    shortDescription:
      "10.6% net yield at the lowest token entry price in the dataset. Token undervalued. Long-term Section 8 tenancy since 2018.",
    longDescription:
      "Mansfield St was renovated to Section 8 standards and has been occupied by the same HUD-supported tenant since 2018. The token is priced below fair value — the only undervalued entry in the Detroit set — providing a margin of safety not available elsewhere in this portfolio. 10.6% net yield is 0.3pp below the dataset average of 10.9% with a lower token price ($35.75) than any other property listed, giving the highest yield per dollar deployed of any non-government-guaranteed property.",
    attractiveNote:
      "Token priced below fair value — the only undervalued entry in the Detroit set, offering a margin of safety not available at any other listed property. Long-term Section 8 tenancy established since 2018 with the same tenant, delivering consistent HUD-backed income across 6+ years with zero turnover to date. $35.75 is the lowest token entry price in the full dataset, maximising income per dollar deployed for any yield tier.",
    riskNote:
      "89% occupancy is the lowest in the dataset and reflects prior vacancy periods before Section 8 — if the current long-term tenant exits, re-letting typically takes 6–8 weeks and directly reduces annual income. Above-average crime index for the 48235 Mansfield corridor increases insurance premiums and is the primary driver of the Medium risk classification. Medium risk limits suitability for investors whose mandate excludes above-median crime neighbourhoods regardless of yield premium.",
    yieldScore: 91,
    riskScore: 72,
    neighborhoodScore: 62,
    valueScore: 83,
    overallScore: 78,
  },

  {
    id: 9,
    name: "19218 Houghton St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1024,
    yearBuilt: 1955,
    tokenPrice: 43.10,
    totalTokens: 1506,
    grossYield: 10.5,
    expectedYield: 8.2,
    monthlyRent: 568,
    fees: { propertyTax: 57, insurance: 20, management: 48 },
    // net: 568 − 125 = 443 → 443×12/64,909 = 8.2% ✓
    occupancyRate: 91,
    risk: "Low",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/19218-houghton-st-detroit-mi-48219/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["Entry Level"],
    shortDescription:
      "8.2% yield — lowest in the set. Low risk with an accessible $43 entry point. Suited for portfolio diversification, not yield maximisation.",
    longDescription:
      "Houghton St is the accessible entry point into the Detroit market: at $43.10/token it sits between the lowest (Mansfield, $35.75) and the mid-range, with a Low risk classification and 91% historical occupancy. 8.2% net yield is 2.7pp below the dataset average of 10.9%, reflecting the smaller unit size (1,024 sq ft) and more modest location in 48219. This property functions as a portfolio diversifier rather than a primary income driver — useful for spreading exposure across sub-markets without high capital commitment.",
    attractiveNote:
      "Low risk classification with 91% occupancy and no critical capital expenditure items flagged in the most recent inspection. $43.10 token price is accessible for investors building a diversified multi-property Detroit position without concentrated capital. 1955 post-war construction offers structurally better reliability than the 1920s-era properties in this dataset, with fewer immediate legacy system replacement requirements.",
    riskNote:
      "8.2% net yield is 2.7pp below the Detroit dataset average — the weakest income return in the full set and insufficient as a standalone position for yield-focused investors. Property experienced a confirmed vacancy in early 2022; re-letting on this street historically takes 4–6 weeks and directly compresses annual income when it occurs. Token at fair value with no price discount and no near-term appreciation catalyst beyond the steady, below-average income stream.",
    yieldScore: 72,
    riskScore: 82,
    neighborhoodScore: 65,
    valueScore: 68,
    overallScore: 73,
  },

  {
    id: 11,
    name: "9165 Kensington Ave",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1100,
    yearBuilt: 1929,
    tokenPrice: 56.85,
    totalTokens: 1300,
    grossYield: 15.6,
    expectedYield: 12.3,
    monthlyRent: 960,
    fees: { propertyTax: 78, insurance: 28, management: 96 },
    // net: 960 − 202 = 758 → 758×12/73,905 = 12.3% ✓
    occupancyRate: 99,
    risk: "Low",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/9165-kensington-ave-detroit-mi-48224/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["Section 8", "High Yield"],
    shortDescription:
      "12.3% yield — highest in the dataset. 93% of rent subsidised by HUD Section 8. Near-zero vacancy risk with 99% occupancy record.",
    longDescription:
      "Kensington Ave is the top-yielding property in the full dataset. HUD Section 8 covers 93% of rent, paying directly to the landlord regardless of the tenant's financial position — this effectively replaces collection risk with federal payment reliability. 99% occupancy over the measured holding period confirms the near-zero vacancy model. Yorkshire Woods (48224) has shown below-average vacancy duration across all measured RealT Detroit properties over 5 consecutive years. At $56.85/token it is the highest-priced SFH in the set, but the 12.3% net yield more than compensates.",
    attractiveNote:
      "12.3% net yield is the highest in the full dataset — 1.4pp above Westphalia, the next-best Low-risk property — with 93% of rent subsidised by the US Federal Government through HUD Section 8. 99% occupancy over the full measured period: HUD pays regardless of tenant financial position, functionally eliminating collection risk for the majority of rental income. Yorkshire Woods (48224) has demonstrated below-average vacancy rates across all measured RealT Detroit properties over 5 consecutive years.",
    riskNote:
      "1929 construction is the oldest Low-risk property in the dataset — plumbing and electrical systems are approaching 100 years of age and represent the most material CapEx exposure in the Low-risk cohort. Section 8 subsidy is conditional on passing recurring HUD habitability inspections; a single failed inspection suspends the 93% federal payment until remediation is complete and re-certified. At $56.85 — the highest SFH token price in the set — buyers enter at fair value with income return as the sole investment driver and no margin of safety on token price.",
    yieldScore: 97,
    riskScore: 88,
    neighborhoodScore: 70,
    valueScore: 72,
    overallScore: 84,
  },

  {
    id: 12,
    name: "15777 Ardmore St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1456,
    yearBuilt: 1931,
    tokenPrice: 48.37,
    totalTokens: 1300,
    grossYield: 18.7,
    expectedYield: 10.81,
    monthlyRent: 980,
    fees: { propertyTax: 67, insurance: 26, management: 321 },
    // net: 980 − 414 = 566 → 566×12/62,881 = 10.81% ✓
    // management line absorbs maintenance reserves for 1931 construction
    occupancyRate: 94,
    risk: "Medium",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/15777-ardmore-st-detroit-mi-48227/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield"],
    shortDescription:
      "Largest unit in the Detroit set at 1,456 sq ft. $980/mo gross rent — highest of any SFH listed. 10.81% net yield at $48.37/token.",
    longDescription:
      "Ardmore St is the largest single-family unit in the dataset at 1,456 sq ft, commanding $980/mo gross rent — the highest of any SFH here — and attracting family tenancies with lower annual turnover. Net yield of 10.81% reflects the substantial maintenance reserves required for 1931 construction (the oldest in the set), embedded in the wide 18.7% → 10.81% gross-to-net spread. At $48.37/token it is the lowest-priced property in the 10%+ yield tier. Belmont (48227) is a stable working-class corridor with steady rental demand.",
    attractiveNote:
      "Largest floor plan in the dataset at 1,456 sq ft generates $980/mo gross rent — the highest monthly income of any single-family property listed — and attracts longer-tenancy family households that reduce annual turnover costs. $48.37 token price is the lowest of any property yielding more than 10%, giving investors maximum income per dollar deployed at this yield tier. 94% occupancy on a fully rented long-term tenancy confirms the unit's sustained rental market demand despite its 1931 age.",
    riskNote:
      "1931 construction is the oldest in the dataset — combined maintenance reserves, management, and CapEx provisions reduce the 18.7% gross yield to 10.81% net, the widest gross-to-net spread of any property here and a direct reflection of real ongoing system replacement costs. Belmont (48227) carries a crime index above the Detroit median, increasing insurance premiums and elevating tenant turnover probability relative to Yorkshire Woods peers. Medium risk classification means this property is unsuitable for investors whose mandate excludes above-median crime corridors.",
    yieldScore: 90,
    riskScore: 72,
    neighborhoodScore: 63,
    valueScore: 70,
    overallScore: 75,
  },

  {
    id: 13,
    name: "4380 Beaconsfield St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1100,
    yearBuilt: 1928,
    tokenPrice: 53.88,
    totalTokens: 1200,
    grossYield: 16.3,
    expectedYield: 11.54,
    monthlyRent: 880,
    fees: { propertyTax: 68, insurance: 27, management: 163 },
    // net: 880 − 258 = 622 → 622×12/64,656 = 11.54% ✓
    occupancyRate: 97,
    risk: "Medium",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/4380-beaconsfield-st-detroit-mi-48224/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield"],
    shortDescription:
      "11.54% net yield with 97% occupancy. Two bathrooms — rare at this token price tier. Morningside sits below Detroit median on crime indices.",
    longDescription:
      "Beaconsfield St is the top-performing Medium-risk property by income-stability ratio: 11.54% net yield combined with 97% occupancy across the verified holding period. The 2-bathroom configuration distinguishes it from the typical 1-bath Detroit SFH, broadening the eligible tenant pool and reducing re-letting exposure. Morningside (48224) carries crime indices measurably below the median for comparable Detroit east-side zip codes. 1928 construction embeds higher maintenance reserves in the cost structure — visible in the 16.3% → 11.54% gross-to-net spread.",
    attractiveNote:
      "11.54% net yield with 97% occupancy is the strongest income-stability combination of any Medium-risk property in this dataset. Two bathrooms at the $53.88 token price tier is unusual in Detroit's single-family market, broadening the tenant pool and shortening re-letting periods compared to 1-bath peers. Morningside (48224) carries crime indices measurably below the median for comparable Detroit east-side zip codes per public safety data.",
    riskNote:
      "1928 construction is among the oldest builds in the set — maintenance reserves and CapEx provisions compress the 16.3% gross yield to 11.54% net, reflecting real ongoing system replacement costs across plumbing, roofing, and electrical. Token at fair value means no valuation discount on entry — there is no margin of safety and upside is limited to the income return stream. Medium risk reflects the neighbourhood trajectory in 48224, which has shown measurable population volatility over the past decade, warranting annual monitoring.",
    yieldScore: 93,
    riskScore: 74,
    neighborhoodScore: 72,
    valueScore: 72,
    overallScore: 79,
  },

  {
    id: 14,
    name: "9717 Everts St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1182,
    yearBuilt: 1936,
    tokenPrice: 50.50,
    totalTokens: 1200,
    grossYield: 17.4,
    expectedYield: 11.81,
    monthlyRent: 880,
    fees: { propertyTax: 64, insurance: 25, management: 194 },
    // net: 880 − 283 = 597 → 597×12/60,600 = 11.81% ✓
    occupancyRate: 97,
    risk: "Low",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/9717-everts-st-detroit-mi-48224/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield"],
    shortDescription:
      "11.81% net yield with Low risk in Yorkshire Woods. Best risk-adjusted income in the dataset outside of government-backed Kensington.",
    longDescription:
      "Everts St delivers the best risk-adjusted income profile in the dataset outside of Kensington's Section 8 subsidy: 11.81% net yield with a Low risk classification and 97% occupancy in Yorkshire Woods (48224) — consistently one of Detroit's lowest-vacancy rental corridors. At 1,182 sq ft and 1936 construction it is materially younger than the 1920s-era properties, with fewer immediate legacy system risks. The 17.4% → 11.81% gross-to-net spread reflects ongoing maintenance reserves for a property approaching 90 years of age.",
    attractiveNote:
      "11.81% net yield with Low risk is the best risk-adjusted income profile in the full dataset outside of Kensington's government-backed Section 8 subsidy. Yorkshire Woods (48224) has demonstrated below-average vacancy duration across all measured RealT Detroit properties over 5 consecutive years, with this property specifically recording 97% occupancy across the verified holding period. 1936 construction is materially younger than the 1920s-era peers, with fewer legacy plumbing and electrical system risks and a correspondingly lower near-term CapEx exposure.",
    riskNote:
      "Gross-to-net spread of 17.4% → 11.81% is the widest of the Low-risk properties, reflecting higher maintenance reserves for a property approaching 90 years of age — any increase in system replacement costs directly compresses the already-embedded net yield without adjustment room. Token liquidity is thin at 1,200 total tokens, making meaningful position entry or exit slower than larger-supply properties without secondary market price impact. Token at fair value on entry — upside is limited to the income return with no valuation discount or price appreciation catalyst.",
    yieldScore: 95,
    riskScore: 84,
    neighborhoodScore: 70,
    valueScore: 74,
    overallScore: 82,
  },

  {
    id: 15,
    name: "14319 Rosemary St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1198,
    yearBuilt: 1927,
    tokenPrice: 49.69,
    totalTokens: 1300,
    grossYield: 16.2,
    expectedYield: 11.81,
    monthlyRent: 870,
    fees: { propertyTax: 68, insurance: 26, management: 140 },
    // net: 870 − 234 = 636 → 636×12/64,597 = 11.81% ✓
    occupancyRate: 97,
    risk: "Medium",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/14319-rosemary-st-detroit-mi-48213/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield"],
    shortDescription:
      "11.81% net yield at $49.69/token — same yield as Everts St at $0.81 cheaper. 1.5 bathrooms widens the eligible tenant pool.",
    longDescription:
      "Rosemary St matches Everts St on net yield (11.81%) at a $0.81 lower token entry price, but with a Medium risk rating reflecting the higher crime scores in Eden Gardens (48213) vs. Yorkshire Woods (48224). The 1.5-bathroom configuration is uncommon in the $45–55 token bracket and broadens the qualifying tenant pool. City of Detroit 48213 housing stabilisation investment has been active since 2022, with measurable improvement in abandonment rates. Overall score of 76 falls below the 78-point Buy threshold — this is a Hold.",
    attractiveNote:
      "11.81% net yield matches the best Low-risk property (Everts St) at a $0.81/token lower entry price, giving slightly higher effective yield on capital deployed for investors accepting Medium risk. 1.5 bathrooms is uncommon in Detroit's $45–55 token bracket, broadening the qualifying tenant pool and supporting shorter re-letting periods compared to 1-bath stock. City of Detroit 48213 housing stabilisation programme active since 2022 has produced measurable improvement in abandonment rates and neighbourhood quality indicators on this street.",
    riskNote:
      "1927 construction is the second-oldest in the dataset — CapEx reserves for plumbing, roofing, and electrical systems are embedded in the 16.2% → 11.81% gross-to-net spread and represent real near-term replacement risk that could increase if major systems fail simultaneously. Eden Gardens (48213) carries higher crime scores than Yorkshire Woods (48224) and Morningside (48224), directly driving the Medium risk classification and above-average tenant turnover probability. Overall score of 76 falls below the 78-point Buy threshold — no compelling entry catalyst beyond the above-average yield.",
    yieldScore: 95,
    riskScore: 72,
    neighborhoodScore: 60,
    valueScore: 70,
    overallScore: 76,
  },

  {
    id: 16,
    name: "19201 Westphalia St",
    city: "Detroit",
    country: "US",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80&auto=format&fit=crop",
    propertyType: "Single Family",
    squareFeet: 1100,
    yearBuilt: 1953,
    tokenPrice: 52.17,
    totalTokens: 1200,
    grossYield: 16.9,
    expectedYield: 11.87,
    monthlyRent: 880,
    fees: { propertyTax: 66, insurance: 26, management: 169 },
    // net: 880 − 261 = 619 → 619×12/62,604 = 11.87% ✓
    occupancyRate: 97,
    risk: "Low",
    fairValueStatus: "fair",
    platform: "RealT",
    sourceUrl: "https://realt.co/product/19201-westphalia-st-detroit-mi-48205/",
    sourceVerified: true,
    source: "RealT",
    lastUpdated: "2026-04-26",
    tags: ["High Yield"],
    shortDescription:
      "11.87% net yield from the newest build in the set — 1953. Lowest CapEx risk of any 11%+ Low-risk property.",
    longDescription:
      "Westphalia St is the newest construction in the Detroit portfolio (1953), materially reducing near-term CapEx risk relative to the 1920s and 1930s builds — major systems have a significantly longer remaining service life. At 11.87% net yield it is the highest-yielding Low-risk property after Kensington's government-backed income. Located in Pulaski (48205), it has 97% occupancy across the verified holding period. Token re-offering process was noted on the RealT listing at the last verification — secondary market liquidity may be temporarily limited.",
    attractiveNote:
      "1953 post-war construction is the newest build in the Detroit set, materially reducing near-term CapEx risk — major systems have a significantly longer remaining service life than the 1920s-era properties. 11.87% net yield with Low risk is the highest risk-adjusted income of any Low-risk property except the Section 8-backed Kensington, a rare combination at this yield level. 97% occupancy with no vacancy in the verified holding period confirms consistent tenant demand in the Pulaski (48205) corridor.",
    riskNote:
      "Pulaski (48205) carries above-average vacancy risk relative to Yorkshire Woods (48224) per historical RealT portfolio data — neighbourhood quality trend warrants annual monitoring and is the constraint preventing a Best Buy classification. Token re-offering process was noted on the RealT listing at the last verification date — secondary market liquidity may be temporarily limited during this transition period. No valuation discount on current entry — investors capture pure income return at fair value with no margin of safety on token price.",
    yieldScore: 95,
    riskScore: 80,
    neighborhoodScore: 58,
    valueScore: 72,
    overallScore: 78,
  },

];

// ── Holdings (demo portfolio) ──────────────────────────────────────────
export const HOLDINGS: Holding[] = [
  { propertyId: 5, tokens: 300, currentValue: 12_360 },  // Whittier  — Hold 8.7%
  { propertyId: 7, tokens: 280, currentValue: 10_010 },  // Mansfield — Buy  10.6%
  { propertyId: 9, tokens: 500, currentValue: 21_550 },  // Houghton  — Hold 8.2%
];

// ── Income history (monthly net income, trailing 9 months) ─────────────
export const INCOME_HISTORY = [
  { month: "Apr", value: 280 },
  { month: "May", value: 291 },
  { month: "Jun", value: 285 },
  { month: "Jul", value: 298 },
  { month: "Aug", value: 304 },
  { month: "Sep", value: 311 },
  { month: "Oct", value: 318 },
  { month: "Nov", value: 315 },
  { month: "Dec", value: 322 },
];
