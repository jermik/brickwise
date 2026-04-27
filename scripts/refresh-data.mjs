/**
 * Brickwise property data refresh script
 * Scrapes RealT property pages + Lofty marketplace and updates properties-live.json
 * Run via GitHub Actions daily, or manually: node scripts/refresh-data.mjs
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIVE_PATH = join(__dirname, "../lib/data/properties-live.json");
const TODAY = new Date().toISOString().slice(0, 10);

// ── RealT properties to refresh ────────────────────────────────────────
const REALT_PROPERTIES = [
  { id: 5,  slug: "10700-whittier-ave-detroit-mi-48224" },
  { id: 7,  slug: "18900-mansfield-st-detroit-mi-48235" },
  { id: 9,  slug: "19218-houghton-st-detroit-mi-48219" },
  { id: 11, slug: "9165-kensington-ave-detroit-mi-48224" },
  { id: 12, slug: "15777-ardmore-st-detroit-mi-48227" },
  { id: 13, slug: "4380-beaconsfield-st-detroit-mi-48224" },
  { id: 14, slug: "9717-everts-st-detroit-mi-48224" },
  { id: 15, slug: "14319-rosemary-st-detroit-mi-48213" },
  { id: 16, slug: "19201-westphalia-st-detroit-mi-48205" },
];

function parseNum(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function pct(str) {
  if (!str) return null;
  return parseNum(str.replace("%", ""));
}

/** Extract key figures from a RealT product page */
async function scrapeRealtProperty(page, slug) {
  const url = `https://realt.co/product/${slug}/`;
  console.log(`  Fetching ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Try JSON-LD first
    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try { return JSON.parse(s.textContent); } catch { /* skip */ }
      }
      return null;
    });

    // Extract from page text using regex patterns
    const bodyText = await page.evaluate(() => document.body.innerText);

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

    console.log(`    tokenPrice=${tokenPrice} grossYield=${grossYield} netYield=${netYield} rent=${monthlyRent} occ=${occupancyRate}`);

    return { tokenPrice, grossYield, netYield, monthlyRent, occupancyRate };
  } catch (err) {
    console.warn(`    Failed to scrape ${slug}: ${err.message}`);
    return {};
  }
}

/** Scrape Lofty marketplace for current listings */
async function scrapeLoftyMarketplace(page) {
  console.log("  Fetching Lofty marketplace...");
  const results = {};

  try {
    await page.goto("https://www.lofty.ai/marketplace", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(3000);

    // Get all property cards
    const cards = await page.evaluate(() => {
      const items = [];
      // Try common card selectors
      const cardEls = document.querySelectorAll(
        '[class*="property-card"], [class*="PropertyCard"], [class*="listing-card"], [data-testid*="property"], article'
      );

      cardEls.forEach((card) => {
        const text = card.innerText || "";
        const link = card.querySelector("a")?.href || "";
        const address = card.querySelector("h2, h3, [class*='address'], [class*='title']")?.innerText?.trim() || "";

        // Extract numbers from the card text
        const priceMatch = text.match(/\$\s*([\d.]+)\s*(?:\/\s*token|per token)/i);
        const yieldMatch = text.match(/([\d.]+)\s*%\s*(?:yield|apy|annual)/i);
        const rentMatch = text.match(/\$\s*([\d,]+)\s*\/\s*(?:mo|month)/i);

        if (address || priceMatch || yieldMatch) {
          items.push({
            address,
            url: link,
            tokenPrice: priceMatch ? parseFloat(priceMatch[1]) : null,
            yield: yieldMatch ? parseFloat(yieldMatch[1]) : null,
            rent: rentMatch ? parseFloat(rentMatch[1].replace(",", "")) : null,
            text: text.slice(0, 200),
          });
        }
      });
      return items;
    });

    console.log(`    Found ${cards.length} Lofty cards`);

    // Match against our tracked cities
    const trackedCities = ["Indianapolis", "Memphis", "Atlanta", "Kansas City"];
    for (const card of cards) {
      const addrLower = (card.address + " " + card.text).toLowerCase();
      for (const city of trackedCities) {
        if (addrLower.includes(city.toLowerCase())) {
          console.log(`    Matched city "${city}": ${card.address}`);
          if (!results[city]) results[city] = card;
        }
      }
    }
  } catch (err) {
    console.warn(`    Lofty scrape failed: ${err.message}`);
  }

  return results;
}

async function main() {
  console.log("=== Brickwise data refresh ===");

  // Load current live data as baseline
  const current = JSON.parse(readFileSync(LIVE_PATH, "utf-8"));
  const updated = { ...current };
  let changed = false;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // ── RealT ──────────────────────────────────────────────────────────
  console.log("\n[RealT] Refreshing properties...");
  for (const prop of REALT_PROPERTIES) {
    const data = await scrapeRealtProperty(page, prop.slug);
    const key = String(prop.id);
    const prev = current[key] || {};

    const next = {
      ...prev,
      lastUpdated: TODAY,
      sourceVerified: true,
    };

    if (data.tokenPrice)    next.tokenPrice    = data.tokenPrice;
    if (data.grossYield)    next.grossYield    = data.grossYield;
    if (data.netYield)      next.expectedYield = data.netYield;
    if (data.monthlyRent)   next.monthlyRent   = data.monthlyRent;
    if (data.occupancyRate) next.occupancyRate = data.occupancyRate;

    // Check if anything meaningfully changed
    const hasChange = JSON.stringify(prev) !== JSON.stringify(next);
    if (hasChange) {
      updated[key] = next;
      changed = true;
      console.log(`  Updated property ${prop.id}`);
    }

    // Polite delay between requests
    await page.waitForTimeout(1500);
  }

  // ── Lofty ──────────────────────────────────────────────────────────
  console.log("\n[Lofty] Scraping marketplace...");
  const loftyMatches = await scrapeLoftyMarketplace(page);

  // Map our Lofty property IDs to cities
  const loftyCityMap = { Indianapolis: "17", Memphis: "18", Atlanta: "19", "Kansas City": "20" };

  for (const [city, card] of Object.entries(loftyMatches)) {
    const key = loftyCityMap[city];
    if (!key) continue;

    const prev = current[key] || {};
    const next = { ...prev, lastUpdated: TODAY };

    if (card.tokenPrice) next.tokenPrice = card.tokenPrice;
    if (card.yield)      next.expectedYield = card.yield;
    if (card.rent)       next.monthlyRent = card.rent;
    if (card.url)        next.sourceUrl = card.url;
    if (card.url)        next.sourceVerified = true;

    const hasChange = JSON.stringify(prev) !== JSON.stringify(next);
    if (hasChange) {
      updated[key] = next;
      changed = true;
      console.log(`  Updated Lofty ${city} (id ${key})`);
    }
  }

  await browser.close();

  // ── Write ──────────────────────────────────────────────────────────
  if (changed) {
    writeFileSync(LIVE_PATH, JSON.stringify(updated, null, 2) + "\n");
    console.log("\n✓ properties-live.json updated");
  } else {
    console.log("\n✓ No changes detected — data is current");
  }
}

main().catch((err) => {
  console.error("Refresh failed:", err);
  process.exit(1);
});
