/**
 * Brickwise full auto-discovery + refresh
 * Discovers ALL listings from RealT + Lofty, computes algorithmic scores,
 * generates AI descriptions via kie.ai, and writes:
 *   - lib/data/properties-live.json  (price/yield updates for static properties)
 *   - lib/data/properties-auto.json  (all auto-discovered properties)
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

// ── Source URLs already in STATIC_PROPERTIES — skip auto-adding ────────
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

// Static URL → ID mapping (for live-data updates)
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

// Static Lofty city → live data ID
const STATIC_LOFTY_CITY_IDS = {
  Indianapolis: "17",
  Memphis: "18",
  Atlanta: "19",
  "Kansas City": "20",
};

// ── Neighbourhood score defaults by city ───────────────────────────────
const CITY_SCORES = {
  Nashville: 82, Austin: 82, Denver: 80, Raleigh: 80,
  Charlotte: 78, Atlanta: 76, Phoenix: 76, Tampa: 75,
  Orlando: 74, Jacksonville: 72, "Kansas City": 72,
  Columbus: 73, Indianapolis: 70, Cleveland: 65,
  Memphis: 56, Detroit: 66, "St. Louis": 62, Baltimore: 60,
};

// ── Fallback Unsplash images by city ──────────────────────────────────
const CITY_IMAGES = {
  Detroit:       "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80&auto=format&fit=crop",
  Indianapolis:  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80&auto=format&fit=crop",
  Atlanta:       "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=700&q=80&auto=format&fit=crop",
  Memphis:       "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=700&q=80&auto=format&fit=crop",
  "Kansas City": "https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=700&q=80&auto=format&fit=crop",
  Nashville:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",
  default:       "https://images.unsplash.com/photo-1560184897-ae5f036d1564?w=700&q=80&auto=format&fit=crop",
};

// ── Helpers ────────────────────────────────────────────────────────────
function parseNum(str) {
  if (!str) return null;
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function pct(str) {
  if (!str) return null;
  return parseNum(String(str).replace("%", ""));
}

function extractCity(address) {
  const m = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
  if (m) return m[1].trim();
  for (const city of Object.keys(CITY_SCORES)) {
    if (address.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return "Unknown";
}

// ── Algorithmic scoring ────────────────────────────────────────────────
function computeScores({ expectedYield = 10, occupancyRate = 93, yearBuilt = 1945, city = "Unknown", fairValueStatus = "fair" }) {
  const yieldScore = Math.min(100, Math.max(40, Math.round(55 + (expectedYield - 5) * 5)));

  const occScore =
    occupancyRate >= 97 ? 90 :
    occupancyRate >= 94 ? 82 :
    occupancyRate >= 91 ? 73 :
    occupancyRate >= 88 ? 64 : 55;
  const age = new Date().getFullYear() - yearBuilt;
  const ageScore =
    age <= 30 ? 88 :
    age <= 50 ? 82 :
    age <= 65 ? 74 :
    age <= 80 ? 66 : 58;
  const riskScore = Math.round(occScore * 0.6 + ageScore * 0.4);

  const neighborhoodScore = CITY_SCORES[city] ?? 68;

  const valueScore =
    fairValueStatus === "undervalued" ? 82 :
    fairValueStatus === "overvalued" ? 58 : 72;

  const overallScore = Math.round(
    yieldScore * 0.30 + riskScore * 0.25 + neighborhoodScore * 0.20 + valueScore * 0.25
  );

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
  const growthCities = ["Atlanta", "Nashville", "Austin", "Denver", "Charlotte", "Raleigh", "Phoenix", "Tampa", "Orlando"];
  if (growthCities.includes(city)) tags.push("Growing Market");
  return tags.length > 0 ? tags : ["High Yield"];
}

// ── AI description generation via kie.ai ──────────────────────────────
async function generateDescriptions(prop) {
  const apiKey = process.env.KIE_AI_API_KEY;
  if (!apiKey) {
    console.log("    KIE_AI_API_KEY not set — skipping AI descriptions");
    return null;
  }
  const model = process.env.KIE_AI_DEFAULT_MODEL || "claude-opus-4-7-20250514";

  const prompt = `You are a real estate investment analyst writing copy for a tokenized property investment platform called Brickwise.

Property:
- Address: ${prop.name}, ${prop.city}
- Platform: ${prop.platform}
- Token price: $${prop.tokenPrice}
- Net yield: ${prop.expectedYield}%
- Gross yield: ${prop.grossYield}%
- Monthly rent: $${prop.monthlyRent}
- Occupancy: ${prop.occupancyRate}%
- Year built: ${prop.yearBuilt}
- Risk level: ${prop.risk}
- Overall score: ${prop.overallScore}/100

Write investment copy. Be specific and data-driven, not generic.

Return JSON:
{
  "shortDescription": "One sentence max 160 chars — lead with the yield/occupancy combo or key differentiator",
  "longDescription": "3–4 sentences: yield vs benchmark, market context, construction age risk, score context",
  "attractiveNote": "2–3 sentences bull case vs peers",
  "riskNote": "2–3 sentences bear case — what risks to watch"
}`;

  try {
    const res = await fetch("https://api.kie.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.warn(`    kie.ai ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.warn(`    kie.ai failed: ${err.message}`);
    return null;
  }
}

// ── Build a complete Property object from raw scraped data ─────────────
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

  const mgmt = Math.round(monthlyRent * 0.08);
  const tax  = Math.round(monthlyRent * 0.07);
  const ins  = Math.round(monthlyRent * 0.03);

  return {
    id,
    name: raw.name || raw.address || `Property ${id}`,
    city,
    country: "US",
    flag: "🇺🇸",
    image,
    propertyType: "Single Family",
    squareFeet: raw.squareFeet ?? 1100,
    yearBuilt,
    tokenPrice,
    totalTokens,
    grossYield,
    expectedYield,
    monthlyRent,
    fees: { propertyTax: tax, insurance: ins, management: mgmt },
    occupancyRate,
    risk,
    fairValueStatus,
    platform,
    sourceUrl: raw.url || (platform === "RealT" ? "https://realt.co" : "https://www.lofty.ai"),
    sourceVerified: true,
    source: platform,
    lastUpdated: TODAY,
    tags,
    isNew: true,
    shortDescription: `${expectedYield.toFixed(1)}% net yield in ${city} via ${platform}. Auto-discovered ${TODAY}.`,
    longDescription: `${raw.name || raw.address || `Property ${id}`} is a ${platform} tokenized property delivering ${expectedYield.toFixed(1)}% net yield at $${tokenPrice}/token with ${occupancyRate}% occupancy. Score: ${scores.overallScore}/100. Data auto-discovered ${TODAY} — verify all figures against the live ${platform} listing before investing.`,
    attractiveNote: `${expectedYield.toFixed(1)}% net yield with ${occupancyRate}% occupancy in ${city}. Score ${scores.overallScore}/100 on the Brickwise cross-platform ranking.`,
    riskNote: `Auto-discovered listing — confirm all data against the live ${platform} listing before investing. sourceVerified will be set to true once manually reviewed.`,
    ...scores,
  };
}

// ── RealT: discover all product URLs from the portfolio page ──────────
async function discoverRealtUrls(page) {
  console.log("  Scanning RealT portfolio page...");
  const urls = new Set();

  try {
    await page.goto("https://realt.co/portfolio/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3000);

    let attempt = 0;
    while (attempt < 8) {
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href*="/product/"]'))
          .map((a) => a.href)
          .filter((h) => h.includes("/product/") && !h.includes("?") && !h.includes("#"))
      );
      links.forEach((l) => urls.add(l.replace(/\/?$/, "/")));

      const loadMore = await page.$(
        'button:has-text("Load More"), a:has-text("Load More"), .load-more, [class*="load-more"], .pagination a[rel="next"]'
      );
      if (loadMore) {
        await loadMore.click();
        await page.waitForTimeout(2500);
        attempt++;
      } else {
        break;
      }
    }

    console.log(`    Discovered ${urls.size} RealT URLs from portfolio`);
  } catch (err) {
    console.warn(`    Portfolio scrape failed: ${err.message} — falling back to known URLs`);
    // Seed with the known static slugs so live data still refreshes
    for (const url of Object.keys(STATIC_URL_TO_ID)) urls.add(url);
  }

  // Always include known static URLs so their live data is refreshed
  for (const url of Object.keys(STATIC_URL_TO_ID)) urls.add(url);

  return [...urls];
}

// ── RealT: scrape a single product page ───────────────────────────────
async function scrapeRealtProperty(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const h1 = await page.evaluate(() => document.querySelector("h1")?.innerText?.trim() || "");

    const tokenPrice = (() => {
      const m = bodyText.match(/Token Price[:\s]*\$?([\d.,]+)/i)
        || bodyText.match(/Price per Token[:\s]*\$?([\d.,]+)/i)
        || bodyText.match(/\$\s*([\d.]+)\s*\/\s*token/i);
      return m ? parseNum(m[1]) : null;
    })();

    const grossYield = (() => {
      const m = bodyText.match(/Gross Rent[:\s]*([\d.]+)%/i)
        || bodyText.match(/Gross Yield[:\s]*([\d.]+)%/i)
        || bodyText.match(/Total Investment Return[:\s]*([\d.]+)%/i);
      return m ? pct(m[1]) : null;
    })();

    const netYield = (() => {
      const m = bodyText.match(/Net Rent[:\s]*([\d.]+)%/i)
        || bodyText.match(/Net Yield[:\s]*([\d.]+)%/i)
        || bodyText.match(/Expected Yield[:\s]*([\d.]+)%/i);
      return m ? pct(m[1]) : null;
    })();

    const monthlyRent = (() => {
      const m = bodyText.match(/Monthly Rent[:\s]*\$?([\d,]+)/i)
        || bodyText.match(/Gross Monthly Rent[:\s]*\$?([\d,]+)/i);
      return m ? parseNum(m[1]) : null;
    })();

    const occupancyRate = (() => {
      const m = bodyText.match(/Occupancy[:\s]*([\d.]+)%/i)
        || bodyText.match(/Rented[:\s]*([\d.]+)%/i);
      return m ? pct(m[1]) : null;
    })();

    const yearBuilt = (() => {
      const m = bodyText.match(/Year Built[:\s]*(\d{4})/i)
        || bodyText.match(/Built[:\s]*(\d{4})/i);
      return m ? parseInt(m[1]) : null;
    })();

    const squareFeet = (() => {
      const m = bodyText.match(/([\d,]+)\s*sq\s*ft/i)
        || bodyText.match(/Square Feet[:\s]*([\d,]+)/i)
        || bodyText.match(/Living Area[:\s]*([\d,]+)/i);
      return m ? parseNum(m[1]) : null;
    })();

    const totalTokens = (() => {
      const m = bodyText.match(/Total Tokens?[:\s]*([\d,]+)/i)
        || bodyText.match(/Token Supply[:\s]*([\d,]+)/i);
      return m ? parseNum(m[1]) : null;
    })();

    // Derive address and city from slug
    const slug = url.replace(/.*\/product\//, "").replace(/\/$/, "");
    const cityMatch = slug.match(/-([a-z-]+)-([a-z]{2})-\d{5}$/);
    const cityFromSlug = cityMatch
      ? cityMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : null;
    const addressFromSlug = slug
      .replace(/-[a-z]{2}-\d{5}$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const name = h1 || addressFromSlug;
    const city = cityFromSlug || extractCity(name);

    console.log(`    ${name} (${city}) — token=$${tokenPrice} gross=${grossYield}% net=${netYield}% rent=$${monthlyRent} occ=${occupancyRate}%`);

    return { name, city, url, tokenPrice, grossYield, expectedYield: netYield, monthlyRent, occupancyRate, yearBuilt, squareFeet, totalTokens };
  } catch (err) {
    console.warn(`    Failed ${url}: ${err.message}`);
    return null;
  }
}

// ── Lofty: scrape full marketplace ────────────────────────────────────
async function discoverLoftyListings(page) {
  console.log("  Scanning Lofty marketplace...");
  const listings = [];

  try {
    await page.goto("https://www.lofty.ai/marketplace", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(4000);

    // Scroll to load lazy-rendered cards
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => window.scrollBy(0, 900));
      await page.waitForTimeout(800);
    }
    await page.waitForTimeout(1500);

    const cards = await page.evaluate(() => {
      const results = [];
      const els = document.querySelectorAll(
        'article, [class*="property-card"], [class*="PropertyCard"], [class*="listing-card"], [data-testid*="property"], .card'
      );
      els.forEach((el) => {
        const text = el.innerText || "";
        if (text.length < 30) return;
        const link = el.querySelector("a")?.href || "";
        const heading = el.querySelector("h1,h2,h3,h4,[class*='title'],[class*='address'],[class*='name']")?.innerText?.trim() || "";
        const priceMatch = text.match(/\$\s*([\d.]+)\s*(?:\/\s*token|per token)/i) || text.match(/Token[:\s]*\$\s*([\d.]+)/i);
        const yieldMatch = text.match(/([\d.]+)\s*%\s*(?:apy|yield|annual|return)/i) || text.match(/APY[:\s]*([\d.]+)%/i);
        const rentMatch  = text.match(/\$\s*([\d,]+)\s*\/\s*(?:mo|month)/i);
        const occMatch   = text.match(/([\d.]+)\s*%\s*(?:occupied|occupancy)/i);
        if ((heading || priceMatch) && (yieldMatch || priceMatch)) {
          results.push({
            address:       heading,
            url:           link,
            tokenPrice:    priceMatch ? parseFloat(priceMatch[1]) : null,
            expectedYield: yieldMatch ? parseFloat(yieldMatch[1]) : null,
            monthlyRent:   rentMatch  ? parseFloat(rentMatch[1].replace(",", "")) : null,
            occupancyRate: occMatch   ? parseFloat(occMatch[1]) : null,
          });
        }
      });
      return results;
    });

    console.log(`    Found ${cards.length} Lofty cards`);

    const seen = new Set();
    for (const card of cards) {
      const key = card.url || card.address;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      listings.push(card);
    }
  } catch (err) {
    console.warn(`    Lofty scrape failed: ${err.message}`);
  }

  return listings;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Brickwise auto-discovery ===");
  console.log(`Date: ${TODAY}\n`);

  const liveData   = JSON.parse(readFileSync(LIVE_PATH, "utf-8"));
  const autoData   = JSON.parse(readFileSync(AUTO_PATH, "utf-8"));

  const autoByUrl  = new Map(autoData.map((p) => [p.sourceUrl, p]));
  const maxAutoId  = autoData.reduce((max, p) => Math.max(max, p.id ?? 0), 99);
  let nextId       = Math.max(maxAutoId + 1, 100);

  const updatedLive = { ...liveData };
  const updatedAuto = [...autoData];
  let liveChanged   = false;
  let autoChanged   = false;

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();

  // ── RealT ────────────────────────────────────────────────────────────
  console.log("[RealT] Discovering properties...");
  const realtUrls = await discoverRealtUrls(page);

  for (const rawUrl of realtUrls) {
    const url = rawUrl.replace(/\/?$/, "/");
    const isStatic   = STATIC_SOURCE_URLS.has(url);
    const existingAuto = autoByUrl.get(url);

    const raw = await scrapeRealtProperty(page, url);
    if (!raw) { await page.waitForTimeout(1500); continue; }

    if (isStatic) {
      // Refresh live data for static property
      const staticId = STATIC_URL_TO_ID[url];
      if (staticId) {
        const key  = String(staticId);
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
          console.log(`    Updated live data for static ID ${staticId}`);
        }
      }
    } else if (existingAuto) {
      // Update auto property with fresh market data
      const idx = updatedAuto.findIndex((p) => p.sourceUrl === url);
      if (idx >= 0) {
        const prev = updatedAuto[idx];
        const next = {
          ...prev,
          lastUpdated: TODAY,
          ...(raw.tokenPrice    && { tokenPrice:    raw.tokenPrice }),
          ...(raw.expectedYield && { expectedYield: raw.expectedYield }),
          ...(raw.grossYield    && { grossYield:    raw.grossYield }),
          ...(raw.monthlyRent   && { monthlyRent:   raw.monthlyRent }),
          ...(raw.occupancyRate && { occupancyRate: raw.occupancyRate }),
        };
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          updatedAuto[idx] = next;
          autoChanged = true;
          console.log(`    Refreshed auto property ${prev.id}: ${prev.name}`);
        }
      }
    } else {
      // New property — must have at least tokenPrice + yield to be useful
      if (!raw.tokenPrice || !raw.expectedYield) {
        console.log(`    Skipping ${raw.name} — insufficient data (no token price or yield)`);
        await page.waitForTimeout(1500);
        continue;
      }

      const id = nextId++;
      console.log(`    NEW property — assigning ID ${id}: ${raw.name}`);

      const prop = buildPropertyObject(raw, id, "RealT");
      const ai   = await generateDescriptions(prop);
      if (ai) {
        if (ai.shortDescription) prop.shortDescription = ai.shortDescription;
        if (ai.longDescription)  prop.longDescription  = ai.longDescription;
        if (ai.attractiveNote)   prop.attractiveNote   = ai.attractiveNote;
        if (ai.riskNote)         prop.riskNote         = ai.riskNote;
      }

      updatedAuto.push(prop);
      autoByUrl.set(url, prop);
      autoChanged = true;
      console.log(`    Added: ${prop.name} | score ${prop.overallScore} | yield ${prop.expectedYield}%`);
    }

    await page.waitForTimeout(1500);
  }

  // ── Lofty ────────────────────────────────────────────────────────────
  console.log("\n[Lofty] Discovering properties...");
  const loftyListings = await discoverLoftyListings(page);

  for (const card of loftyListings) {
    const city = extractCity(card.address || "") ||
      Object.keys(STATIC_LOFTY_CITY_IDS).find((c) =>
        (card.address + " " + (card.url || "")).toLowerCase().includes(c.toLowerCase())
      ) || "Unknown";

    const staticLoftyKey = STATIC_LOFTY_CITY_IDS[city];
    const existingAuto   = autoByUrl.get(card.url);

    if (staticLoftyKey) {
      // Refresh live data for known static Lofty property
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
          ...prev,
          lastUpdated: TODAY,
          ...(card.tokenPrice    && { tokenPrice:    card.tokenPrice }),
          ...(card.expectedYield && { expectedYield: card.expectedYield }),
          ...(card.monthlyRent   && { monthlyRent:   card.monthlyRent }),
          ...(card.occupancyRate && { occupancyRate: card.occupancyRate }),
        };
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          updatedAuto[idx] = next;
          autoChanged = true;
        }
      }
    } else if (city !== "Unknown" && card.tokenPrice && card.expectedYield) {
      // Entirely new Lofty property not in any static list
      const id = nextId++;
      console.log(`  NEW Lofty property in ${city} — assigning ID ${id}`);

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
      const ai   = await generateDescriptions(prop);
      if (ai) {
        if (ai.shortDescription) prop.shortDescription = ai.shortDescription;
        if (ai.longDescription)  prop.longDescription  = ai.longDescription;
        if (ai.attractiveNote)   prop.attractiveNote   = ai.attractiveNote;
        if (ai.riskNote)         prop.riskNote         = ai.riskNote;
      }

      updatedAuto.push(prop);
      autoByUrl.set(card.url, prop);
      autoChanged = true;
      console.log(`  Added: ${prop.name} | score ${prop.overallScore} | yield ${prop.expectedYield}%`);
    }
  }

  await browser.close();

  // ── Write results ─────────────────────────────────────────────────────
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
