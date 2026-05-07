// Best-effort enrichment of a discovered business by looking at its
// homepage. Called only at IMPORT time, never during search, so it adds
// at most one HTTP fetch per imported lead. Failures are silent.
//
// What we extract:
//   - email (mailto: link)
//   - socials (instagram / facebook / linkedin / x/twitter / tiktok / youtube)
//   - cmsHint (wordpress / wix / squarespace / shopify / webflow), best effort
//
// Hard limits keep this lightweight:
//   - 4s timeout
//   - 200 KB response body cap
//   - GET only, no JS execution

const TIMEOUT_MS = 4_000;
const MAX_BYTES = 200 * 1024;
const USER_AGENT = "BrickwiseEnrich/1.0 (+https://brickwise.pro)";

export interface WebsiteEnrichment {
  email?: string;
  socials: string[];
  cmsHint?: string;
}

const EMAIL_RX = /mailto:([^"'>\s?]+)/i;
const SOCIAL_PATTERNS: Array<{ host: string; rx: RegExp }> = [
  { host: "instagram.com", rx: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?/g },
  { host: "facebook.com", rx: /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9.\-_/]+\/?/g },
  { host: "linkedin.com", rx: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in|school)\/[A-Za-z0-9.\-_]+\/?/g },
  { host: "twitter.com", rx: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+\/?/g },
  { host: "tiktok.com", rx: /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9._-]+\/?/g },
  { host: "youtube.com", rx: /https?:\/\/(?:www\.)?youtube\.com\/(?:c|channel|user|@)[A-Za-z0-9._\-/]+\/?/g },
];

function detectCms(html: string): string | undefined {
  const h = html.toLowerCase();
  if (h.includes("wp-content/") || h.includes("wp-includes/")) return "wordpress";
  if (h.includes("static.wixstatic.com") || h.includes("x-wix-")) return "wix";
  if (h.includes("squarespace") || h.includes("static1.squarespace.com")) return "squarespace";
  if (h.includes("cdn.shopify.com") || h.includes("shopify")) return "shopify";
  if (h.includes("assets.website-files.com") || h.includes("webflow")) return "webflow";
  return undefined;
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*;q=0.5" },
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok || !res.body) return null;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < MAX_BYTES) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      chunks.push(value);
      total += value.byteLength;
      if (total >= MAX_BYTES) break;
    }
    try {
      reader.cancel();
    } catch {
      /* ignore */
    }
    const buf = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      buf.set(c, offset);
      offset += c.byteLength;
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function enrichFromWebsite(
  websiteUri: string,
): Promise<WebsiteEnrichment> {
  const empty: WebsiteEnrichment = { socials: [] };
  if (!websiteUri) return empty;

  const html = await fetchHtml(websiteUri);
  if (!html) {
    console.log("[discovery.enrich] fetch.failed", { websiteUri });
    return empty;
  }

  // Email
  let email: string | undefined;
  const m = html.match(EMAIL_RX);
  if (m && m[1]) {
    const candidate = m[1].split("?")[0].trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) email = candidate;
  }

  // Socials (de-duplicated by hostname-prefix to avoid 10x instagram links)
  const found = new Map<string, string>();
  for (const { host, rx } of SOCIAL_PATTERNS) {
    const matches = html.match(rx) ?? [];
    for (const url of matches) {
      const cleaned = url.replace(/[)>"'].*$/, "").replace(/\/$/, "");
      if (!found.has(host)) found.set(host, cleaned);
    }
  }
  const socials = Array.from(found.values());

  const cmsHint = detectCms(html);

  console.log("[discovery.enrich] done", {
    websiteUri,
    foundEmail: !!email,
    socials: socials.length,
    cmsHint,
  });

  return { email, socials, cmsHint };
}
