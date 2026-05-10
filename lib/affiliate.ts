// Central affiliate URL registry. When you receive a referral link from a
// platform, paste it into AFFILIATE_URLS below. Components automatically:
//   - swap the destination URL for the affiliate URL
//   - add rel="sponsored" (FTC-compliant disclosure for paid links)
//
// Until then, links resolve to the platform's public homepage with a
// standard rel="noopener noreferrer".
//
// To activate an affiliate program for a platform:
//   1. Sign up for the platform's referral/affiliate program
//   2. Paste the URL below (e.g. "https://lofty.ai/?ref=brickwise")
//   3. Ship — every CTA across the site flips automatically.

export type Platform = "Lofty" | "RealT" | "Arrived" | "Fundrise" | "Ark7";

const AFFILIATE_URLS: Record<Platform, string> = {
  Lofty: "https://www.lofty.ai/refer?utm_source=growsurf&utm_medium=referrals&utm_campaign=referral-program&grsf=f929p2",
  RealT: "",
  Arrived: "",
  Fundrise: "",
  Ark7: "",
};

const PLATFORM_HOMEPAGES: Record<Platform, string> = {
  Lofty: "https://lofty.ai",
  RealT: "https://realt.co",
  Arrived: "https://arrived.com",
  Fundrise: "https://fundrise.com",
  Ark7: "https://ark7.com",
};

const KNOWN_PLATFORMS: Platform[] = ["Lofty", "RealT", "Arrived", "Fundrise", "Ark7"];

function isKnownPlatform(p: string): p is Platform {
  return (KNOWN_PLATFORMS as string[]).includes(p);
}

// Returns the best URL for a platform CTA.
// Priority:
//   1. explicit per-listing sourceUrl (from properties-live.json) — wins always
//   2. configured affiliate URL for the platform
//   3. platform homepage
export function getPlatformUrl(platform: string, sourceUrl?: string): string {
  if (sourceUrl) return sourceUrl;
  if (!isKnownPlatform(platform)) return "#";
  return AFFILIATE_URLS[platform] || PLATFORM_HOMEPAGES[platform];
}

// Whether an affiliate URL is currently configured for a platform.
// Used to set rel="sponsored" for FTC-compliant disclosure.
export function isAffiliateActive(platform: string): boolean {
  if (!isKnownPlatform(platform)) return false;
  return Boolean(AFFILIATE_URLS[platform]);
}

// Convenience: rel attribute for an outbound platform link.
export function platformLinkRel(platform: string, sourceUrl?: string): string {
  // Per-property sourceUrl is treated as a regular outbound link unless
  // we're also running the affiliate program for that platform.
  const usingAffiliate = !sourceUrl && isAffiliateActive(platform);
  return usingAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer";
}
