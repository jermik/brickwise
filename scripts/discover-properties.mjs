/**
 * Brickwise full auto-discovery + refresh
 * RealT: tries community JSON API first, falls back to Playwright page scraping
 * Lofty: intercepts XHR/fetch responses to capture raw JSON before the DOM renders
 *
 * Run: node scripts/discover-properties.mjs
 * Triggered: GitHub Actions daily at 6 AM UTC
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIVE_PATH = join(__dirname, "../lib/data/properties-live.json");
const AUTO_PATH = join(__dirname, "../lib/data/properties-auto.json");
const TODAY = new Date().toISOString().slice(0, 10);

// Source URLs already in STATIC_PROPERTIES
const STATIC_SOURCE_URLS = new Set([
  "https://realt.co/product/10700-whittier-ave-detroit-mi-48224/",
  "https://realt.co/product/18900-mansfield-st-detroit-mi-48235/",
  "https://realt.co/product/19218-houghton-st-detroit-mi-48219/",
  "https://realt.co/product/9165-kensington-ave-detroit-mi-48224/",
  "https://realt.co/product/15777-ardmore-st-detroit-mi-48227/",
  "https://realt.co/product/4380-beaconsfield-st-detroit-mi-48224/",
  "https://realt.co/product/9717-everts-st-detroit-mi-48224/",
  "https://realt.co/product/14319-rosemary-st-detroit-mi-48213/",
  "https://realt.co/product/19201-westphalia-st-detroit-mi-48205/",
]);

const STATIC_URL_TO_ID = {
  "https://realt.co/product/10700-whittier-ave-detroit-mi-48224/": 5,
  "https://realt.co/product/18900-mansfield-st-detroit-mi-48235/": 7,
  "https://realt.co/product/19218-houghton-st-detroit-mi-48219/": 9,
  "https://realt.co/product/9165-kensington-ave-detroit-mi-48224/": 11,
  "https://realt.co/product/15777-ardmore-st-detroit-mi-48227/": 12,
  "https://realt.co/product/4380-beaconsfield-st-detroit-mi-48224/": 13,
  "https://realt.co/product/9717-everts-st-detroit-mi-48224/": 14,
  "https://realt.co/product/14319-rosemary-st-detroit-mi-48213/": 15,
  "https://realt.co/product/19201-westphalia-st-detroit-mi-48205/": 16,
};

const STATIC_LOFTY_CITY_IDS = {
  Indianapolis: "17", Memphis: "18", Atlanta: "19", "Kansas City": "20",
};

const CITY_SCORES = {
  Nashville: 82, Austin: 82, Denver: 80, Raleigh: 80, Charlotte: 78,
  Atlanta: 76, Phoenix: 76, Tampa: 75, Orlando: 74, Jacksonville: 72,
  "Kansas City": 72, Columbus: 73, Indianapolis: 70, Cleveland: 65,
  Memphis: 56, Detroit: 66, "St. Louis": 62, Baltimore: 60,
};

const CITY_IMAGES = {
  Detroit:       "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80&auto=format&fit=crop",
  Indianapolis:  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80&auto=format&fit=crop",
  Atlanta:       "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=700&q=80&auto=format&fit=crop",
  Memphis:       "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=700&q=80&auto=format&fit=crop",
  "Kansas City": "https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=700&q=80&auto=format&fit=crop",
  Nashville:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
  default:       "https://images.unsplash.com/photo-1560184897-ae5f036d1564?w=700&q=80&auto=format&fit=crop",
};

// ── Helpers ─────────────────────────────────────────────────────────────
function parseNum(str) {
  if (str == null) return null;
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function extractCity(address) {
  const m = String(address).match(/,\s*([^,]+),\s*[A-Z]{2}/);
  if (m) return m[1].trim();
  for (const city of Object.keys(CITY_SCORES)) {
    if (String(address).toLowerCase().includes(city.toLowerCase())) return city;
  }
  return "Unknown";
}

function computeScores({ expectedYield = 10, occupancyRate = 93, yearBuilt = 1945, city = "Unknown", fairValueStatus = "fair" }) {
  const yieldScore = Math.min(100, Math.max(40, Math.round(55 + (expectedYield - 5) * 5)));
  const occScore = occupancyRate >= 97 ? 90 : occupancyRate >= 94 ? 82 : occupancyRate >= 91 ? 73 : occupancyRate >= 88 ? 64 : 55;
  const age = new Date().getFullYear() - yearBuilt;
  const ageScore = age <= 30 ? 88 : age <= 50 ? 82 : age <= 65 ? 74 : age <= 80 ? 66 : 58;
  const riskScore = Math.round(occScore * 0.6 + ageScore * 0.4);
  const neighborhoodScore = CITY_SCORES[city] ?? 68;
  const valueScore = fairValueStatus === "undervalued" ? 82 : fairValueStatus === "overvalued" ? 58 : 72;
  const overallScore = Math.round(yieldScore * 0.30 + riskScore * 0.25 + neighborhoodScore * 0.20 + valueScore * 0.25);
  return { yieldScore, riskScore, neighborhoodScore, valueScore, overallScore };
}

function deriveRisk(scores) {
  if (scores.riskScore >= 80 && scores.neighborhoodScore >= 70) return "Low";
  if (scores.riskScore >= 65 && scores.neighborhoodScore >= 58) return "Medium";
  return "High";
}

function computeFairValueStatus(expectedYield) {
  if (expectedYield >= 12.5) return "undervalued";
  if (expectedYield < 9) return "overvalued";
  return "fair";
}

function deriveTags({ expectedYield, fairValueStatus, city }) {
  const tags = [];
  if (expectedYield >= 11) tags.push("High Yield");
  if (fairValueStatus === "undervalued") tags.push("Value Entry");
  if (["Atlanta","Nashville","Austin","Denver","Charlotte","Raleigh","Phoenix","Tampa","Orlando"].includes(city)) tags.push("Growing Market");
  return tags.length ? tags : ["High Yield"];
}

function buildPropertyObject(raw, id, platform) {
  const city = raw.city || extractCity(raw.address || raw.name || "");
  const expectedYield = raw.expectedYield ?? 10;
  const grossYield = raw.grossYield ?? Math.round((expectedYield + 5) * 10) / 10;
  const occupancyRate = raw.occupancyRate ?? 93;
  const yearBuilt = raw.yearBuilt ?? 1945;
  const tokenPrice = raw.tokenPrice ?? 50;
  const totalTokens = raw.totalTokens ?? 1200;
  const totalValue = tokenPrice * totalTokens;
  const monthlyRent = raw.monthlyRent ?? Math.round((totalValue * grossYield) / 100 / 12);
  const fairValueStatus = computeFairValueStatus(expectedYield);
  const scores = computeScores({ expectedYield, occupancyRate, yearBuilt, city, fairValueStatus });
  const risk = deriveRisk(scores);
  const tags = deriveTags({ expectedYield, fairValueStatus, city });
  const image = CITY_IMAGES[city] ?? CITY_IMAGES["default"];
  return {
    id, name: raw.name || raw.address || `Property ${id}`,
    city, country: "US", flag: "🇺🇸", image,
    propertyType: "Single Family", squareFeet: raw.squareFeet ?? 1100,
    yearBuilt, tokenPrice, totalTokens, grossYield, expectedYield, monthlyRent,
    fees: {
      propertyTax: Math.round(monthlyRent * 0.07),
      insurance: Math.round(monthlyRent * 0.03),
      management: Math.round(monthlyRent * 0.08),
    },
    occupancyRate, risk, fairValueStatus, platform,
    sourceUrl: raw.url || (platform === "RealT" ? "https://realt.co" : "https://www.lofty.ai"),
    sourceVerified: true, source: platform, lastUpdated: TODAY, tags, isNew: true,
    shortDescription: `${expectedYield.toFixed(1)}% net yield in ${city} via ${platform}. Auto-discovered ${TODAY}.`,
    longDescription: `${raw.name || `Property ${id}`} is a ${platform} tokenized property delivering ${expectedYield.toFixed(1)}% net yield at $${tokenPrice}/token with ${occupancyRate}% occupancy. Score: ${scores.overallScore}/100. Data auto-discovered ${TODAY}.`,
    attractiveNote: `${expectedYield.toFixed(1)}% net yield with ${occupancyRate}% occupancy in ${city}. Score ${scores.overallScore}/100 on the Brickwise cross-platform ranking.`,
    riskNote: `Auto-discovered listing — confirm all data against the live ${platform} listing before investing.`,
    ...scores,
  };
}

// ── AI descriptions ──────────────────────────────────────────────────────
async function generateDescriptions(prop) {
  const apiKey = process.env.KIE_AI_API_KEY;
  if (!apiKey) { console.log("    No KIE_AI_API_KEY — skipping AI descriptions"); return null; }
  const model = process.env.KIE_AI_DEFAULT_MODEL || "claude-opus-4-7-20250514";
  const prompt = `You are a real estate investment analyst for Brickwise, a tokenized property comparison platform.

Property:
- Address: ${prop.name}, ${prop.city}
- Platform: ${prop.platform}
- Token price: $${prop.tokenPrice}
- Net yield: ${prop.expectedYield}%
- Gross yield: ${prop.grossYield}%
- Monthly rent: $${prop.monthlyRent}
- Occupancy: ${prop.occupancyRate}%
- Year built: ${prop.yearBuilt}
- Risk: ${prop.risk}
- Score: ${prop.overallScore}/100

Return JSON with exactly these fields:
{
  "shortDescription": "One sentence max 160 chars — lead with yield/occupancy or key differentiator",
  "longDescription": "3-4 sentences: yield vs benchmark, market context, construction age risk, score",
  "attractiveNote": "2-3 sentences bull case vs peers",
  "riskNote": "2-3 sentences key risks"
}`;
  try {
    const res = await fetch("https://api.kie.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 700, response_format: { type: "json_object" } }),
    });
    if (!res.ok) { console.warn(`    kie.ai ${res.status}: ${(await res.text()).slice(0, 150)}`); return null; }
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn(`    kie.ai failed: ${err.message}`);
    return null;
  }
}

// ── RealT: community JSON API (no browser needed) ────────────────────────
async function fetchRealtApi() {
  const endpoints = [
    "https://api.realt.community/v1/properties",
    "https://ehpst.deno.dev/realt/api/properties",
  ];
  for (const url of endpoints) {
    try {
      console.log(`  Trying RealT API: ${url}`);
      const res = await fetch(url, {
        headers: { "Accept": "application/json", "User-Agent": "brickwise-bot/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) { console.log(`    HTTP ${res.status} — trying next`); continue; }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.data ?? data?.properties ?? [];
      if (arr.length > 0) {
        console.log(`    Got ${arr.length} properties from ${url}`);
        return arr;
      }
    } catch (err) {
      console.log(`    ${url} failed: ${err.message}`);
    }
  }
  return null;
}

// ── RealT: normalise one API property record ─────────────────────────────
function normaliseRealtApiRecord(rec) {
  // Field names vary across community API versions
  const tokenPrice =
    rec.tokenPrice ?? rec.token?.value ?? rec.tokenPriceCurrent ?? parseNum(rec.pricePerToken);
  const grossYield =
    rec.annualPercentageYield ?? rec.grossRentYield ?? rec.totalReturnYield ?? rec.grossYield;
  const netYield =
    rec.netRentYield ?? rec.netYield ?? rec.expectedYield ?? rec.annualReturn;
  const monthlyRent =
    rec.grossRentMonth ?? rec.monthlyRent ?? rec.rentalMonth ?? rec.grossMonthlyRent;
  const occupancyRate =
    rec.occupancy ?? rec.occupancyRate ?? rec.rented ?? rec.rentalStatus;
  const yearBuilt =
    rec.constructionYear ?? rec.yearBuilt ?? rec.built;
  const squareFeet =
    rec.squareFeet ?? rec.surface ?? rec.livingArea ?? rec.sqft;
  const totalTokens =
    rec.totalTokens ?? rec.tokenSupply ?? rec.totalToken;

  // Build canonical URL from fullName or shortName
  const slug = (rec.fullName ?? rec.shortName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const url = slug
    ? `https://realt.co/product/${slug}/`
    : rec.marketplaceLink ?? rec.realtUrl ?? null;

  // City from fullName: "123 Main St, Detroit, MI 48224" → "Detroit"
  const city = extractCity(rec.fullName ?? rec.shortName ?? "") ||
    rec.city ?? rec.propertyCity ?? "Unknown";

  const name = (rec.fullName ?? rec.shortName ?? "")
    .replace(/,.*/, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || `RealT ${rec.uuid?.slice(0, 6) ?? ""}`;

  return {
    name, city, url,
    tokenPrice:    tokenPrice ? parseNum(tokenPrice) : null,
    grossYield:    grossYield ? parseNum(grossYield) : null,
    expectedYield: netYield   ? parseNum(netYield)   : null,
    monthlyRent:   monthlyRent ? parseNum(monthlyRent) : null,
    occupancyRate: occupancyRate ? parseNum(occupancyRate) : null,
    yearBuilt:     yearBuilt ? parseInt(yearBuilt) : null,
    squareFeet:    squareFeet ? parseNum(squareFeet) : null,
    totalTokens:   totalTokens ? parseNum(totalTokens) : null,
  };
}

// ── RealT: Playwright fallback for a single product page ─────────────────
async function scrapeRealtPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });

    // Wait for price-looking content to appear
    await page.waitForFunction(
      () => document.body.innerText.length > 500,
      { timeout: 10000 }
    ).catch(() => {});

    const bodyText = await page.evaluate(() => document.body.innerText);

    // Aggressive multi-pattern extraction
    const find = (patterns) => {
      for (const re of patterns) {
        const m = bodyText.match(re);
        if (m) return parseNum(m[1]);
      }
      return null;
    };

    const tokenPrice = find([
      /Token\s*Price[^$\d]*\$?\s*([\d.,]+)/i,
      /Price\s*per\s*Token[^$\d]*\$?\s*([\d.,]+)/i,
      /\$\s*([\d.]+)\s*\/\s*[Tt]oken/,
      /Token\s*Value[^$\d]*\$?\s*([\d.,]+)/i,
    ]);
    const grossYield = find([
      /Gross\s*Rent[^%\d]*([\d.]+)\s*%/i,
      /Gross\s*Yield[^%\d]*([\d.]+)\s*%/i,
      /Total\s*(?:Investment\s*)?Return[^%\d]*([\d.]+)\s*%/i,
    ]);
    const netYield = find([
      /Net\s*Rent[^%\d]*([\d.]+)\s*%/i,
      /Net\s*Yield[^%\d]*([\d.]+)\s*%/i,
      /Expected\s*Yield[^%\d]*([\d.]+)\s*%/i,
      /Annual\s*Return[^%\d]*([\d.]+)\s*%/i,
    ]);
    const monthlyRent = find([
      /(?:Gross\s*)?Monthly\s*Rent[^$\d]*\$?\s*([\d,]+)/i,
      /Rent\s*per\s*Month[^$\d]*\$?\s*([\d,]+)/i,
    ]);
    const occupancyRate = find([
      /Occupancy[^%\d]*([\d.]+)\s*%/i,
      /Rented[^%\d]*([\d.]+)\s*%/i,
      /Occupied[^%\d]*([\d.]+)\s*%/i,
    ]);
    const yearBuilt = (() => {
      const m = bodyText.match(/(?:Year\s*Built|Construction\s*Year|Built\s*in)[:\s]*(\d{4})/i);
      return m ? parseInt(m[1]) : null;
    })();
    const squareFeet = find([/([\d,]+)\s*sq\.?\s*ft/i, /Living\s*Area[:\s]*([\d,]+)/i]);
    const totalTokens = find([/Total\s*Tokens?[:\s]*([\d,]+)/i, /Token\s*Supply[:\s]*([\d,]+)/i]);

    // Derive from slug
    const slug = url.replace(/.*\/product\//, "").replace(/\/$/, "");
    const cityMatch = slug.match(/-([a-z-]+)-([a-z]{2})-\d{5}$/);
    const city = cityMatch
      ? cityMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unknown";
    const addressSlug = slug.replace(/-[a-z]{2}-\d{5}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const h1 = await page.evaluate(() => document.querySelector("h1")?.innerText?.trim() || "");
    const name = h1 || addressSlug;

    console.log(`    ${name} (${city}) — token=$${tokenPrice} gross=${grossYield}% net=${netYield}% rent=$${monthlyRent} occ=${occupancyRate}%`);
    return { name, city, url, tokenPrice, grossYield, expectedYield: netYield, monthlyRent, occupancyRate, yearBuilt, squareFeet, totalTokens };
  } catch (err) {
    console.warn(`    Failed ${url}: ${err.message}`);
    return null;
  }
}

// ── Lofty: intercept API responses ──────────────────────────────────────
async function discoverLoftyListings(page) {
  console.log("  Scanning Lofty marketplace (network interception)...");
  const captured = [];

  // Intercept all JSON responses from Lofty's API
  page.on("response", async (response) => {
    const url = response.url();
    if (!url.includes("lofty") && !url.includes("api.")) return;
    const ct = response.headers()["content-type"] || "";
    if (!ct.includes("application/json")) return;
    try {
      const json = await response.json();
      captured.push({ url, json });
    } catch { /* skip */ }
  });

  try {
    await page.goto("https://www.lofty.ai/marketplace", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(5000);

    // Scroll to trigger lazy loading
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.waitForTimeout(700);
    }
    await page.waitForTimeout(2000);
  } catch (err) {
    console.warn(`    Lofty page load failed: ${err.message}`);
  }

  console.log(`    Captured ${captured.length} Lofty API responses`);

  // Try to parse listings from captured responses
  const listings = [];
  const seen = new Set();

  for (const { url, json } of captured) {
    console.log(`    Parsing response from: ${url}`);
    // Handle various response shapes
    const arr = Array.isArray(json) ? json
      : json?.data ? (Array.isArray(json.data) ? json.data : Object.values(json.data))
      : json?.properties ? json.properties
      : json?.listings ? json.listings
      : json?.results ? json.results
      : [];

    for (const item of arr) {
      if (!item || typeof item !== "object") continue;
      // Try to extract key fields from various possible shapes
      const address = item.address ?? item.propertyAddress ?? item.title ?? item.name ?? "";
      const tokenPrice = parseNum(item.tokenPrice ?? item.token_price ?? item.pricePerToken ?? item.price);
      const expectedYield = parseNum(item.apy ?? item.yield ?? item.annualYield ?? item.expectedYield ?? item.targetYield);
      const monthlyRent = parseNum(item.monthlyRent ?? item.rent ?? item.rentalIncome ?? item.grossMonthlyRent);
      const occupancyRate = parseNum(item.occupancy ?? item.occupancyRate ?? item.occupied);
      const city = item.city ?? extractCity(address);
      const itemUrl = item.url ?? item.link ?? item.propertyUrl ?? `https://www.lofty.ai/property/${item.id ?? item.slug ?? ""}`;

      const key = itemUrl || address;
      if (!key || seen.has(key)) continue;
      if (!tokenPrice && !expectedYield) continue;
      seen.add(key);

      listings.push({ address, url: itemUrl, tokenPrice, expectedYield, monthlyRent, occupancyRate, city });
    }
  }

  // Fallback: parse DOM cards if API interception found nothing
  if (listings.length === 0) {
    console.log("    No API data captured — attempting DOM parse...");
    try {
      const domCards = await page.evaluate(() => {
        const results = [];
        // Cast a wider net with every possible card-like element
        document.querySelectorAll("*").forEach((el) => {
          if (el.children.length === 0) return;
          const text = el.innerText || "";
          if (text.length < 40 || text.length > 2000) return;
          const priceM = text.match(/\$\s*([\d.]+)\s*(?:\/\s*token|per\s*token)/i);
          const yieldM = text.match(/([\d.]+)\s*%\s*(?:apy|yield|annual)/i);
          if (!priceM && !yieldM) return;
          const link = el.querySelector("a")?.href || "";
          const heading = el.querySelector("h1,h2,h3,h4")?.innerText?.trim() || "";
          if (!link && !heading) return;
          results.push({
            address: heading,
            url: link,
            tokenPrice: priceM ? parseFloat(priceM[1]) : null,
            expectedYield: yieldM ? parseFloat(yieldM[1]) : null,
            monthlyRent: null,
            occupancyRate: null,
          });
        });
        // Deduplicate
        const seen = new Set();
        return results.filter((r) => {
          const k = r.url || r.address;
          if (!k || seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      });
      listings.push(...domCards.slice(0, 50));
      console.log(`    DOM fallback found ${domCards.length} candidates`);
    } catch (err) {
      console.warn(`    DOM fallback failed: ${err.message}`);
    }
  }

  console.log(`    Total Lofty listings: ${listings.length}`);
  return listings;
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Brickwise auto-discovery ===");
  console.log(`Date: ${TODAY}\n`);

  const liveData = JSON.parse(readFileSync(LIVE_PATH, "utf-8"));
  const autoData = JSON.parse(readFileSync(AUTO_PATH, "utf-8"));
  const autoByUrl = new Map(autoData.map((p) => [p.sourceUrl, p]));
  const maxAutoId = autoData.reduce((max, p) => Math.max(max, p.id ?? 0), 99);
  let nextId = Math.max(maxAutoId + 1, 100);

  const updatedLive = { ...liveData };
  const updatedAuto = [...autoData];
  let liveChanged = false;
  let autoChanged = false;

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();

  // ── RealT ──────────────────────────────────────────────────────────────
  console.log("[RealT] Fetching data...");
  const apiRecords = await fetchRealtApi();

  let realtItems = [];
  if (apiRecords && apiRecords.length > 0) {
    realtItems = apiRecords.map(normaliseRealtApiRecord).filter((r) => r.tokenPrice || r.expectedYield);
    console.log(`  Using API data: ${realtItems.length} properties`);
  } else {
    // API unavailable — scrape individual known static pages via Playwright
    console.log("  API unavailable — scraping individual property pages...");
    for (const url of Object.keys(STATIC_URL_TO_ID)) {
      const raw = await scrapeRealtPage(page, url);
      if (raw) realtItems.push(raw);
      await page.waitForTimeout(1500);
    }
  }

  for (const raw of realtItems) {
    const url = (raw.url || "").replace(/\/?$/, "/");
    const isStatic = url && STATIC_SOURCE_URLS.has(url);
    const existingAuto = url && autoByUrl.get(url);

    if (isStatic) {
      const staticId = STATIC_URL_TO_ID[url];
      if (staticId && (raw.tokenPrice || raw.expectedYield)) {
        const key = String(staticId);
        const prev = liveData[key] || {};
        const next = { ...prev, lastUpdated: TODAY, sourceVerified: true };
        if (raw.tokenPrice)    next.tokenPrice    = raw.tokenPrice;
        if (raw.expectedYield) next.expectedYield = raw.expectedYield;
        if (raw.grossYield)    next.grossYield    = raw.grossYield;
        if (raw.monthlyRent)   next.monthlyRent   = raw.monthlyRent;
        if (raw.occupancyRate) next.occupancyRate = raw.occupancyRate;
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          updatedLive[key] = next;
          liveChanged = true;
          console.log(`  Updated live data for static ID ${staticId} (${raw.name})`);
        }
      }
    } else if (existingAuto) {
      const idx = updatedAuto.findIndex((p) => p.sourceUrl === url);
      if (idx >= 0) {
        const prev = updatedAuto[idx];
        const next = {
          ...prev, lastUpdated: TODAY,
          ...(raw.tokenPrice    && { tokenPrice: raw.tokenPrice }),
          ...(raw.expectedYield && { expectedYield: raw.expectedYield }),
          ...(raw.grossYield    && { grossYield: raw.grossYield }),
          ...(raw.monthlyRent   && { monthlyRent: raw.monthlyRent }),
          ...(raw.occupancyRate && { occupancyRate: raw.occupancyRate }),
        };
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          updatedAuto[idx] = next;
          autoChanged = true;
          console.log(`  Refreshed auto property ${prev.id}: ${prev.name}`);
        }
      }
    } else {
      // New property
      if (!raw.tokenPrice || !raw.expectedYield) {
        console.log(`  Skipping ${raw.name} — missing tokenPrice or yield`);
        continue;
      }
      const id = nextId++;
      console.log(`  NEW RealT property (ID ${id}): ${raw.name}, ${raw.city}`);
      const prop = buildPropertyObject(raw, id, "RealT");
      const ai = await generateDescriptions(prop);
      if (ai) {
        if (ai.shortDescription) prop.shortDescription = ai.shortDescription;
        if (ai.longDescription)  prop.longDescription  = ai.longDescription;
        if (ai.attractiveNote)   prop.attractiveNote   = ai.attractiveNote;
        if (ai.riskNote)         prop.riskNote         = ai.riskNote;
      }
      updatedAuto.push(prop);
      autoByUrl.set(url, prop);
      autoChanged = true;
      console.log(`  Added: ${prop.name} | score ${prop.overallScore} | ${prop.expectedYield}% yield`);
    }
  }

  // ── Lofty ──────────────────────────────────────────────────────────────
  console.log("\n[Lofty] Discovering properties...");
  const loftyListings = await discoverLoftyListings(page);

  for (const card of loftyListings) {
    const city = card.city && card.city !== "Unknown" ? card.city : extractCity(card.address || "");
    const staticLoftyKey = STATIC_LOFTY_CITY_IDS[city];
    const existingAuto = autoByUrl.get(card.url);

    if (staticLoftyKey) {
      const prev = liveData[staticLoftyKey] || {};
      const next = { ...prev, lastUpdated: TODAY };
      if (card.tokenPrice)    next.tokenPrice    = card.tokenPrice;
      if (card.expectedYield) next.expectedYield = card.expectedYield;
      if (card.monthlyRent)   next.monthlyRent   = card.monthlyRent;
      if (card.occupancyRate) next.occupancyRate = card.occupancyRate;
      if (card.url) { next.sourceUrl = card.url; next.sourceVerified = true; }
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        updatedLive[staticLoftyKey] = next;
        liveChanged = true;
        console.log(`  Updated live data for static Lofty ${city} (id ${staticLoftyKey})`);
      }
    } else if (existingAuto) {
      const idx = updatedAuto.findIndex((p) => p.sourceUrl === card.url);
      if (idx >= 0) {
        const prev = updatedAuto[idx];
        const next = {
          ...prev, lastUpdated: TODAY,
          ...(card.tokenPrice    && { tokenPrice: card.tokenPrice }),
          ...(card.expectedYield && { expectedYield: card.expectedYield }),
          ...(card.monthlyRent   && { monthlyRent: card.monthlyRent }),
          ...(card.occupancyRate && { occupancyRate: card.occupancyRate }),
        };
        if (JSON.stringify(prev) !== JSON.stringify(next)) { updatedAuto[idx] = next; autoChanged = true; }
      }
    } else if (city && city !== "Unknown" && card.tokenPrice && card.expectedYield) {
      const id = nextId++;
      console.log(`  NEW Lofty property (ID ${id}): ${card.address || city}`);
      const raw = {
        name: card.address || `Lofty ${city}`,
        address: card.address || "",
        city,
        url: card.url || "https://www.lofty.ai/marketplace",
        tokenPrice: card.tokenPrice,
        expectedYield: card.expectedYield,
        grossYield: card.expectedYield ? Math.round((card.expectedYield + 4) * 10) / 10 : null,
        monthlyRent: card.monthlyRent,
        occupancyRate: card.occupancyRate,
      };
      const prop = buildPropertyObject(raw, id, "Lofty");
      const ai = await generateDescriptions(prop);
      if (ai) {
        if (ai.shortDescription) prop.shortDescription = ai.shortDescription;
        if (ai.longDescription)  prop.longDescription  = ai.longDescription;
        if (ai.attractiveNote)   prop.attractiveNote   = ai.attractiveNote;
        if (ai.riskNote)         prop.riskNote         = ai.riskNote;
      }
      updatedAuto.push(prop);
      autoByUrl.set(card.url, prop);
      autoChanged = true;
      console.log(`  Added: ${prop.name} | score ${prop.overallScore} | ${prop.expectedYield}% yield`);
    }
  }

  await browser.close();

  // ── Write ───────────────────────────────────────────────────────────────
  if (liveChanged) {
    writeFileSync(LIVE_PATH, JSON.stringify(updatedLive, null, 2) + "\n");
    console.log("\n✓ properties-live.json updated");
  } else {
    console.log("\n✓ properties-live.json: no changes");
  }
  if (autoChanged) {
    writeFileSync(AUTO_PATH, JSON.stringify(updatedAuto, null, 2) + "\n");
    console.log("✓ properties-auto.json updated");
  } else {
    console.log("✓ properties-auto.json: no changes");
  }
  console.log(`\n=== Done: ${updatedAuto.length} auto properties | ${Object.keys(updatedLive).length} live entries ===`);
}

main().catch((err) => {
  console.error("Discovery failed:", err);
  process.exit(1);
});
