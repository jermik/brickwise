/**
 * Brickwise full auto-discovery + refresh
 * RealT: tries community JSON API first, falls back to Playwright page scraping
 * Lofty: intercepts XHR/fetch responses to capture raw JSON before the DOM renders
 *
 * Run: node scripts/discover-properties.mjs
 * Triggered: GitHub Actions daily at 6 AM UTC
 *
 * NOTE: Written without ??, ?., ??= to maximise Node.js compatibility.
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIVE_PATH = join(__dirname, "../lib/data/properties-live.json");
const AUTO_PATH = join(__dirname, "../lib/data/properties-auto.json");
const TODAY = new Date().toISOString().slice(0, 10);

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

// ── Helpers ──────────────────────────────────────────────────────────────
function or(a, b) { return (a !== null && a !== undefined) ? a : b; }

function parseNum(str) {
  if (str === null || str === undefined) return null;
  var n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function extractCity(address) {
  var m = String(address).match(/,\s*([^,]+),\s*[A-Z]{2}/);
  if (m) return m[1].trim();
  var cities = Object.keys(CITY_SCORES);
  for (var i = 0; i < cities.length; i++) {
    if (String(address).toLowerCase().indexOf(cities[i].toLowerCase()) !== -1) return cities[i];
  }
  return "Unknown";
}

function computeScores(opts) {
  var expectedYield   = opts.expectedYield   || 10;
  var occupancyRate   = opts.occupancyRate   || 93;
  var yearBuilt       = opts.yearBuilt       || 1945;
  var city            = opts.city            || "Unknown";
  var fairValueStatus = opts.fairValueStatus || "fair";

  var yieldScore = Math.min(100, Math.max(40, Math.round(55 + (expectedYield - 5) * 5)));
  var occScore = occupancyRate >= 97 ? 90 : occupancyRate >= 94 ? 82 : occupancyRate >= 91 ? 73 : occupancyRate >= 88 ? 64 : 55;
  var age = new Date().getFullYear() - yearBuilt;
  var ageScore = age <= 30 ? 88 : age <= 50 ? 82 : age <= 65 ? 74 : age <= 80 ? 66 : 58;
  var riskScore = Math.round(occScore * 0.6 + ageScore * 0.4);
  var neighborhoodScore = CITY_SCORES[city] || 68;
  var valueScore = fairValueStatus === "undervalued" ? 82 : fairValueStatus === "overvalued" ? 58 : 72;
  var overallScore = Math.round(yieldScore * 0.30 + riskScore * 0.25 + neighborhoodScore * 0.20 + valueScore * 0.25);
  return { yieldScore: yieldScore, riskScore: riskScore, neighborhoodScore: neighborhoodScore, valueScore: valueScore, overallScore: overallScore };
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

function deriveTags(opts) {
  var tags = [];
  var growthCities = ["Atlanta", "Nashville", "Austin", "Denver", "Charlotte", "Raleigh", "Phoenix", "Tampa", "Orlando"];
  if (opts.expectedYield >= 11) tags.push("High Yield");
  if (opts.fairValueStatus === "undervalued") tags.push("Value Entry");
  if (growthCities.indexOf(opts.city) !== -1) tags.push("Growing Market");
  return tags.length ? tags : ["High Yield"];
}

function buildPropertyObject(raw, id, platform) {
  var city          = raw.city || extractCity(raw.address || raw.name || "");
  var expectedYield = raw.expectedYield || 10;
  var grossYield    = raw.grossYield    || Math.round((expectedYield + 5) * 10) / 10;
  var occupancyRate = raw.occupancyRate || 93;
  var yearBuilt     = raw.yearBuilt     || 1945;
  var tokenPrice    = raw.tokenPrice    || 50;
  var totalTokens   = raw.totalTokens   || 1200;
  var totalValue    = tokenPrice * totalTokens;
  var monthlyRent   = raw.monthlyRent   || Math.round((totalValue * grossYield) / 100 / 12);
  var fairValueStatus = computeFairValueStatus(expectedYield);
  var scores        = computeScores({ expectedYield: expectedYield, occupancyRate: occupancyRate, yearBuilt: yearBuilt, city: city, fairValueStatus: fairValueStatus });
  var risk          = deriveRisk(scores);
  var tags          = deriveTags({ expectedYield: expectedYield, fairValueStatus: fairValueStatus, city: city });
  var image         = CITY_IMAGES[city] || CITY_IMAGES["default"];
  var sourceUrl     = raw.url || (platform === "RealT" ? "https://realt.co" : "https://www.lofty.ai");

  return Object.assign({
    id: id,
    name: raw.name || raw.address || ("Property " + id),
    city: city, country: "US", flag: "🇺🇸",
    image: image, propertyType: "Single Family",
    squareFeet: raw.squareFeet || 1100,
    yearBuilt: yearBuilt, tokenPrice: tokenPrice, totalTokens: totalTokens,
    grossYield: grossYield, expectedYield: expectedYield, monthlyRent: monthlyRent,
    fees: {
      propertyTax: Math.round(monthlyRent * 0.07),
      insurance:   Math.round(monthlyRent * 0.03),
      management:  Math.round(monthlyRent * 0.08),
    },
    occupancyRate: occupancyRate, risk: risk, fairValueStatus: fairValueStatus,
    platform: platform, sourceUrl: sourceUrl, sourceVerified: true,
    source: platform, lastUpdated: TODAY, tags: tags, isNew: true,
    shortDescription: expectedYield.toFixed(1) + "% net yield in " + city + " via " + platform + ". Auto-discovered " + TODAY + ".",
    longDescription: (raw.name || ("Property " + id)) + " is a " + platform + " tokenized property delivering " + expectedYield.toFixed(1) + "% net yield at $" + tokenPrice + "/token with " + occupancyRate + "% occupancy. Score: " + scores.overallScore + "/100.",
    attractiveNote: expectedYield.toFixed(1) + "% net yield with " + occupancyRate + "% occupancy in " + city + ". Score " + scores.overallScore + "/100.",
    riskNote: "Auto-discovered listing — confirm all data against the live " + platform + " listing before investing.",
  }, scores);
}

// ── AI descriptions ──────────────────────────────────────────────────────
async function generateDescriptions(prop) {
  var apiKey = process.env.KIE_AI_API_KEY;
  if (!apiKey) { console.log("    No KIE_AI_API_KEY — skipping AI descriptions"); return null; }
  var model = process.env.KIE_AI_DEFAULT_MODEL || "claude-opus-4-7-20250514";
  var prompt = "You are a real estate investment analyst for Brickwise.\n\nProperty:\n- Address: " + prop.name + ", " + prop.city + "\n- Platform: " + prop.platform + "\n- Token price: $" + prop.tokenPrice + "\n- Net yield: " + prop.expectedYield + "%\n- Gross yield: " + prop.grossYield + "%\n- Monthly rent: $" + prop.monthlyRent + "\n- Occupancy: " + prop.occupancyRate + "%\n- Year built: " + prop.yearBuilt + "\n- Risk: " + prop.risk + "\n- Score: " + prop.overallScore + "/100\n\nReturn JSON:\n{\n  \"shortDescription\": \"One sentence max 160 chars\",\n  \"longDescription\": \"3-4 sentences\",\n  \"attractiveNote\": \"2-3 sentences bull case\",\n  \"riskNote\": \"2-3 sentences risks\"\n}";
  try {
    var res = await fetch("https://api.kie.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], max_tokens: 700, response_format: { type: "json_object" } }),
    });
    if (!res.ok) { console.warn("    kie.ai " + res.status); return null; }
    var json = await res.json();
    var text = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn("    kie.ai failed: " + err.message);
    return null;
  }
}

// ── RealT: community JSON API ─────────────────────────────────────────────
async function fetchRealtApi() {
  var endpoints = [
    "https://api.realt.community/v1/properties",
    "https://ehpst.deno.dev/realt/api/properties",
    "https://realt.co/wp-json/wc/store/v1/products?per_page=100",
    "https://realt.co/wp-json/wp/v2/product?per_page=100&_fields=id,slug,title,meta",
  ];
  for (var i = 0; i < endpoints.length; i++) {
    var url = endpoints[i];
    try {
      console.log("  Trying RealT API: " + url);
      var controller = new AbortController();
      var timer = setTimeout(function() { controller.abort(); }, 12000);
      var res = await fetch(url, {
        headers: { "Accept": "application/json", "User-Agent": "brickwise-bot/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) { console.log("    HTTP " + res.status + " — trying next"); continue; }
      var data = await res.json();
      var arr = Array.isArray(data) ? data : (data.data ? (Array.isArray(data.data) ? data.data : Object.values(data.data)) : (data.properties || data.listings || data.results || []));
      if (arr.length > 0) { console.log("    Got " + arr.length + " records from " + url); return arr; }
      console.log("    Empty response from " + url);
    } catch (err) {
      console.log("    " + url + " failed: " + err.message);
    }
  }
  return null;
}

function normaliseRealtApiRecord(rec) {
  var tokenPrice    = parseNum(rec.tokenPrice    || (rec.token && rec.token.value) || rec.tokenPriceCurrent || rec.pricePerToken);
  var grossYield    = parseNum(rec.annualPercentageYield || rec.grossRentYield || rec.totalReturnYield || rec.grossYield);
  var netYield      = parseNum(rec.netRentYield  || rec.netYield  || rec.expectedYield || rec.annualReturn);
  var monthlyRent   = parseNum(rec.grossRentMonth || rec.monthlyRent || rec.rentalMonth || rec.grossMonthlyRent);
  var occupancyRate = parseNum(rec.occupancy     || rec.occupancyRate || rec.rented);
  var yearBuilt     = rec.constructionYear || rec.yearBuilt || rec.built;
  var squareFeet    = parseNum(rec.squareFeet    || rec.surface  || rec.livingArea || rec.sqft);
  var totalTokens   = parseNum(rec.totalTokens   || rec.tokenSupply || rec.totalToken);
  var fullName      = rec.fullName || rec.shortName || "";
  var slug          = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  var url           = slug ? ("https://realt.co/product/" + slug + "/") : (rec.marketplaceLink || rec.realtUrl || null);
  var city          = extractCity(fullName) || rec.city || rec.propertyCity || "Unknown";
  var name          = fullName.replace(/,.*/, "").trim().replace(/\b\w/g, function(c) { return c.toUpperCase(); }) || ("RealT " + (rec.uuid || "").slice(0, 6));
  return { name: name, city: city, url: url, tokenPrice: tokenPrice, grossYield: grossYield, expectedYield: netYield, monthlyRent: monthlyRent, occupancyRate: occupancyRate, yearBuilt: yearBuilt ? parseInt(yearBuilt) : null, squareFeet: squareFeet, totalTokens: totalTokens };
}

// ── RealT: Playwright fallback ────────────────────────────────────────────
async function scrapeRealtPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });
    await page.waitForTimeout(2000);
    var bodyText = await page.evaluate(function() { return document.body.innerText; });
    function find(patterns) {
      for (var i = 0; i < patterns.length; i++) {
        var m = bodyText.match(patterns[i]);
        if (m) return parseNum(m[1]);
      }
      return null;
    }
    var tokenPrice    = find([/Token\s*Price[^$\d]*\$?\s*([\d.,]+)/i, /Price\s*per\s*Token[^$\d]*\$?\s*([\d.,]+)/i, /\$\s*([\d.]+)\s*\/\s*[Tt]oken/]);
    var grossYield    = find([/Gross\s*Rent[^%\d]*([\d.]+)\s*%/i, /Gross\s*Yield[^%\d]*([\d.]+)\s*%/i]);
    var netYield      = find([/Net\s*Rent[^%\d]*([\d.]+)\s*%/i, /Net\s*Yield[^%\d]*([\d.]+)\s*%/i, /Expected\s*Yield[^%\d]*([\d.]+)\s*%/i]);
    var monthlyRent   = find([/(?:Gross\s*)?Monthly\s*Rent[^$\d]*\$?\s*([\d,]+)/i]);
    var occupancyRate = find([/Occupancy[^%\d]*([\d.]+)\s*%/i, /Rented[^%\d]*([\d.]+)\s*%/i]);
    var yearBuiltM    = bodyText.match(/(?:Year\s*Built|Construction\s*Year)[:\s]*(\d{4})/i);
    var yearBuilt     = yearBuiltM ? parseInt(yearBuiltM[1]) : null;
    var squareFeet    = find([/([\d,]+)\s*sq\.?\s*ft/i]);
    var totalTokens   = find([/Total\s*Tokens?[:\s]*([\d,]+)/i]);
    var slug          = url.replace(/.*\/product\//, "").replace(/\/$/, "");
    var cityMatch     = slug.match(/-([a-z-]+)-([a-z]{2})-\d{5}$/);
    var city          = cityMatch ? cityMatch[1].replace(/-/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); }) : "Unknown";
    var addressSlug   = slug.replace(/-[a-z]{2}-\d{5}$/, "").replace(/-/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    var h1            = await page.evaluate(function() { var el = document.querySelector("h1"); return el ? el.innerText.trim() : ""; });
    var name          = h1 || addressSlug;
    console.log("    " + name + " (" + city + ") token=$" + tokenPrice + " net=" + netYield + "% rent=$" + monthlyRent);
    return { name: name, city: city, url: url, tokenPrice: tokenPrice, grossYield: grossYield, expectedYield: netYield, monthlyRent: monthlyRent, occupancyRate: occupancyRate, yearBuilt: yearBuilt, squareFeet: squareFeet, totalTokens: totalTokens };
  } catch (err) {
    console.warn("    Failed " + url + ": " + err.message);
    return null;
  }
}

// ── Lofty: intercept API responses ────────────────────────────────────────
async function discoverLoftyListings(page) {
  console.log("  Scanning Lofty marketplace (network interception)...");
  var captured = [];

  page.on("response", async function(response) {
    var url = response.url();
    // Skip static assets
    if (url.match(/\.(js|css|png|jpg|svg|ico|woff|woff2|ttf)(\?|$)/)) return;
    var ct = response.headers()["content-type"] || "";
    if (ct.indexOf("application/json") === -1 && ct.indexOf("text/plain") === -1) return;
    try {
      var text = await response.text();
      if (text.length < 20) return;
      var json = JSON.parse(text);
      captured.push({ url: url, json: json });
      console.log("    [capture] " + url.slice(0, 120) + " (" + text.length + " bytes)");
    } catch (e) { /* skip */ }
  });

  try {
    await page.goto("https://www.lofty.ai/marketplace", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(5000);
    for (var i = 0; i < 8; i++) {
      await page.evaluate(function() { window.scrollBy(0, 600); });
      await page.waitForTimeout(700);
    }
    await page.waitForTimeout(2000);
  } catch (err) {
    console.warn("    Lofty page load: " + err.message);
  }

  console.log("    Captured " + captured.length + " Lofty API responses");

  var listings = [];
  var seen = new Set();

  for (var ci = 0; ci < captured.length; ci++) {
    var item = captured[ci];
    var json = item.json;
    // Recursively find any array with 3+ items that looks like property records
    function extractArrays(obj, depth) {
      if (depth > 4) return [];
      if (Array.isArray(obj) && obj.length >= 3) return [obj];
      if (obj && typeof obj === "object") {
        var found = [];
        var keys = Object.keys(obj);
        for (var k = 0; k < keys.length; k++) {
          var sub = extractArrays(obj[keys[k]], depth + 1);
          for (var s = 0; s < sub.length; s++) found.push(sub[s]);
        }
        return found;
      }
      return [];
    }
    var candidates = extractArrays(json, 0);
    var arr = [];
    for (var ca = 0; ca < candidates.length; ca++) {
      // Pick the array that looks most like property records
      var cand = candidates[ca];
      if (cand[0] && typeof cand[0] === "object" && (cand[0].address || cand[0].tokenPrice || cand[0].apy || cand[0].token_price || cand[0].name || cand[0].title)) {
        arr = cand;
        console.log("    Found candidate array (" + arr.length + " items) in " + item.url.slice(0, 80));
        break;
      }
    }

    for (var ai = 0; ai < arr.length; ai++) {
      var rec = arr[ai];
      if (!rec || typeof rec !== "object") continue;
      var address      = rec.address || rec.propertyAddress || rec.title || rec.name || "";
      var tokenPrice   = parseNum(rec.tokenPrice || rec.token_price || rec.pricePerToken || rec.price);
      var expectedYield = parseNum(rec.apy || rec.yield || rec.annualYield || rec.expectedYield || rec.targetYield);
      var monthlyRent  = parseNum(rec.monthlyRent || rec.rent || rec.rentalIncome);
      var occupancyRate = parseNum(rec.occupancy || rec.occupancyRate || rec.occupied);
      var city         = rec.city || extractCity(address);
      var itemUrl      = rec.url || rec.link || rec.propertyUrl || ("https://www.lofty.ai/property/" + (rec.id || rec.slug || ""));
      var key          = itemUrl || address;
      if (!key || seen.has(key)) continue;
      if (!tokenPrice && !expectedYield) continue;
      seen.add(key);
      listings.push({ address: address, url: itemUrl, tokenPrice: tokenPrice, expectedYield: expectedYield, monthlyRent: monthlyRent, occupancyRate: occupancyRate, city: city });
    }
  }

  // DOM fallback
  if (listings.length === 0) {
    console.log("    No API data — trying DOM parse...");
    try {
      var domCards = await page.evaluate(function() {
        var results = [];
        var all = document.querySelectorAll("*");
        for (var i = 0; i < all.length; i++) {
          var el = all[i];
          if (el.children.length === 0) continue;
          var text = el.innerText || "";
          if (text.length < 40 || text.length > 2000) continue;
          var priceM = text.match(/\$\s*([\d.]+)\s*(?:\/\s*token|per\s*token)/i);
          var yieldM = text.match(/([\d.]+)\s*%\s*(?:apy|yield|annual)/i);
          if (!priceM && !yieldM) continue;
          var link = el.querySelector("a") ? el.querySelector("a").href : "";
          var headingEl = el.querySelector("h1,h2,h3,h4");
          var heading = headingEl ? headingEl.innerText.trim() : "";
          if (!link && !heading) continue;
          results.push({ address: heading, url: link, tokenPrice: priceM ? parseFloat(priceM[1]) : null, expectedYield: yieldM ? parseFloat(yieldM[1]) : null, monthlyRent: null, occupancyRate: null });
        }
        var seen2 = {};
        return results.filter(function(r) {
          var k = r.url || r.address;
          if (!k || seen2[k]) return false;
          seen2[k] = true;
          return true;
        }).slice(0, 50);
      });
      for (var di = 0; di < domCards.length; di++) listings.push(domCards[di]);
      console.log("    DOM fallback: " + domCards.length + " candidates");
    } catch (err) {
      console.warn("    DOM fallback failed: " + err.message);
    }
  }

  console.log("    Total Lofty listings: " + listings.length);
  return listings;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Brickwise auto-discovery ===");
  console.log("Date: " + TODAY + "\n");

  var liveData  = JSON.parse(readFileSync(LIVE_PATH, "utf-8"));
  var autoData  = JSON.parse(readFileSync(AUTO_PATH, "utf-8"));
  var autoByUrl = new Map(autoData.map(function(p) { return [p.sourceUrl, p]; }));
  var maxAutoId = autoData.reduce(function(max, p) { return Math.max(max, p.id || 0); }, 99);
  var nextId    = Math.max(maxAutoId + 1, 100);

  var updatedLive = Object.assign({}, liveData);
  var updatedAuto = autoData.slice();
  var liveChanged = false;
  var autoChanged = false;

  var browser = await chromium.launch({ headless: true });
  var ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  var page = await ctx.newPage();

  // ── RealT ────────────────────────────────────────────────────────────────
  console.log("[RealT] Fetching data...");
  var apiRecords = await fetchRealtApi();
  var realtItems = [];

  if (apiRecords && apiRecords.length > 0) {
    for (var ri = 0; ri < apiRecords.length; ri++) {
      var norm = normaliseRealtApiRecord(apiRecords[ri]);
      if (norm.tokenPrice || norm.expectedYield) realtItems.push(norm);
    }
    console.log("  API: " + realtItems.length + " usable records");
  } else {
    console.log("  API unavailable — scraping static property pages...");
    var staticUrls = Object.keys(STATIC_URL_TO_ID);
    for (var si = 0; si < staticUrls.length; si++) {
      var scraped = await scrapeRealtPage(page, staticUrls[si]);
      if (scraped) realtItems.push(scraped);
      await page.waitForTimeout(1500);
    }
  }

  for (var ii = 0; ii < realtItems.length; ii++) {
    var raw = realtItems[ii];
    var url = raw.url ? raw.url.replace(/\/?$/, "/") : "";
    var isStatic    = url && STATIC_SOURCE_URLS.has(url);
    var existingAuto = url && autoByUrl.get(url);

    if (isStatic) {
      var staticId = STATIC_URL_TO_ID[url];
      if (staticId && (raw.tokenPrice || raw.expectedYield)) {
        var key  = String(staticId);
        var prev = liveData[key] || {};
        var next = Object.assign({}, prev, { lastUpdated: TODAY, sourceVerified: true });
        if (raw.tokenPrice)    next.tokenPrice    = raw.tokenPrice;
        if (raw.expectedYield) next.expectedYield = raw.expectedYield;
        if (raw.grossYield)    next.grossYield    = raw.grossYield;
        if (raw.monthlyRent)   next.monthlyRent   = raw.monthlyRent;
        if (raw.occupancyRate) next.occupancyRate = raw.occupancyRate;
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          updatedLive[key] = next;
          liveChanged = true;
          console.log("  Updated static ID " + staticId + ": " + raw.name);
        }
      }
    } else if (existingAuto) {
      var idx = updatedAuto.findIndex(function(p) { return p.sourceUrl === url; });
      if (idx >= 0) {
        var prevAuto = updatedAuto[idx];
        var nextAuto = Object.assign({}, prevAuto, { lastUpdated: TODAY });
        if (raw.tokenPrice)    nextAuto.tokenPrice    = raw.tokenPrice;
        if (raw.expectedYield) nextAuto.expectedYield = raw.expectedYield;
        if (raw.grossYield)    nextAuto.grossYield    = raw.grossYield;
        if (raw.monthlyRent)   nextAuto.monthlyRent   = raw.monthlyRent;
        if (raw.occupancyRate) nextAuto.occupancyRate = raw.occupancyRate;
        if (JSON.stringify(prevAuto) !== JSON.stringify(nextAuto)) {
          updatedAuto[idx] = nextAuto;
          autoChanged = true;
          console.log("  Refreshed auto property " + prevAuto.id + ": " + prevAuto.name);
        }
      }
    } else {
      if (!raw.tokenPrice || !raw.expectedYield) {
        console.log("  Skipping " + raw.name + " — missing data");
        continue;
      }
      var newId = nextId++;
      console.log("  NEW RealT property (ID " + newId + "): " + raw.name + ", " + raw.city);
      var prop = buildPropertyObject(raw, newId, "RealT");
      var ai = await generateDescriptions(prop);
      if (ai) {
        if (ai.shortDescription) prop.shortDescription = ai.shortDescription;
        if (ai.longDescription)  prop.longDescription  = ai.longDescription;
        if (ai.attractiveNote)   prop.attractiveNote   = ai.attractiveNote;
        if (ai.riskNote)         prop.riskNote         = ai.riskNote;
      }
      updatedAuto.push(prop);
      autoByUrl.set(url, prop);
      autoChanged = true;
      console.log("  Added: " + prop.name + " | score " + prop.overallScore + " | " + prop.expectedYield + "% yield");
    }
  }

  // ── Lofty ────────────────────────────────────────────────────────────────
  console.log("\n[Lofty] Discovering properties...");
  var loftyListings = await discoverLoftyListings(page);

  for (var li = 0; li < loftyListings.length; li++) {
    var card = loftyListings[li];
    var city = (card.city && card.city !== "Unknown") ? card.city : extractCity(card.address || "");
    var staticLoftyKey = STATIC_LOFTY_CITY_IDS[city];
    var loftyExistingAuto = autoByUrl.get(card.url);

    if (staticLoftyKey) {
      var lprev = liveData[staticLoftyKey] || {};
      var lnext = Object.assign({}, lprev, { lastUpdated: TODAY });
      if (card.tokenPrice)    lnext.tokenPrice    = card.tokenPrice;
      if (card.expectedYield) lnext.expectedYield = card.expectedYield;
      if (card.monthlyRent)   lnext.monthlyRent   = card.monthlyRent;
      if (card.occupancyRate) lnext.occupancyRate = card.occupancyRate;
      if (card.url) { lnext.sourceUrl = card.url; lnext.sourceVerified = true; }
      if (JSON.stringify(lprev) !== JSON.stringify(lnext)) {
        updatedLive[staticLoftyKey] = lnext;
        liveChanged = true;
        console.log("  Updated static Lofty " + city + " (id " + staticLoftyKey + ")");
      }
    } else if (loftyExistingAuto) {
      var lidx = updatedAuto.findIndex(function(p) { return p.sourceUrl === card.url; });
      if (lidx >= 0) {
        var lpa = updatedAuto[lidx];
        var lna = Object.assign({}, lpa, { lastUpdated: TODAY });
        if (card.tokenPrice)    lna.tokenPrice    = card.tokenPrice;
        if (card.expectedYield) lna.expectedYield = card.expectedYield;
        if (card.monthlyRent)   lna.monthlyRent   = card.monthlyRent;
        if (card.occupancyRate) lna.occupancyRate = card.occupancyRate;
        if (JSON.stringify(lpa) !== JSON.stringify(lna)) { updatedAuto[lidx] = lna; autoChanged = true; }
      }
    } else if (city && city !== "Unknown" && card.tokenPrice && card.expectedYield) {
      var lnewId = nextId++;
      console.log("  NEW Lofty (ID " + lnewId + "): " + (card.address || city));
      var lraw = { name: card.address || ("Lofty " + city), address: card.address || "", city: city, url: card.url || "https://www.lofty.ai/marketplace", tokenPrice: card.tokenPrice, expectedYield: card.expectedYield, grossYield: card.expectedYield ? Math.round((card.expectedYield + 4) * 10) / 10 : null, monthlyRent: card.monthlyRent, occupancyRate: card.occupancyRate };
      var lprop = buildPropertyObject(lraw, lnewId, "Lofty");
      var lai = await generateDescriptions(lprop);
      if (lai) {
        if (lai.shortDescription) lprop.shortDescription = lai.shortDescription;
        if (lai.longDescription)  lprop.longDescription  = lai.longDescription;
        if (lai.attractiveNote)   lprop.attractiveNote   = lai.attractiveNote;
        if (lai.riskNote)         lprop.riskNote         = lai.riskNote;
      }
      updatedAuto.push(lprop);
      autoByUrl.set(card.url, lprop);
      autoChanged = true;
      console.log("  Added: " + lprop.name + " | score " + lprop.overallScore + " | " + lprop.expectedYield + "% yield");
    }
  }

  await browser.close();

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
  console.log("\n=== Done: " + updatedAuto.length + " auto properties | " + Object.keys(updatedLive).length + " live entries ===");
}

main().catch(function(err) {
  console.error("Discovery failed:", err);
  process.exit(1);
});
