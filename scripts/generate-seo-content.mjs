import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function readJson(relPath) {
  var full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  try {
    return JSON.parse(fs.readFileSync(full, "utf-8"));
  } catch (e) {
    return null;
  }
}

function writeJson(relPath, data) {
  fs.writeFileSync(path.join(ROOT, relPath), JSON.stringify(data, null, 2) + "\n");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  var d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function callKieAI(prompt) {
  var apiKey = process.env.KIE_AI_API_KEY;
  var model = process.env.KIE_AI_DEFAULT_MODEL || "gpt-4o-mini";
  if (!apiKey) {
    console.log("No KIE_AI_API_KEY — using fallback commentary");
    return null;
  }
  try {
    var res = await fetch("https://api.kie.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });
    if (!res.ok) {
      console.log("kie.ai error:", res.status);
      return null;
    }
    var data = await res.json();
    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content.trim();
    }
    return null;
  } catch (e) {
    console.log("kie.ai fetch failed:", e.message);
    return null;
  }
}

async function main() {
  var date = today();
  console.log("Generating SEO market content for", date);

  var autoProps = readJson("lib/data/properties-auto.json") || [];

  if (autoProps.length === 0) {
    console.log("No auto properties found — skipping SEO content");
    return;
  }

  // Compute stats
  var yields = autoProps
    .map(function (p) { return p.expectedYield; })
    .filter(function (y) { return typeof y === "number" && y > 0; });

  var scores = autoProps
    .map(function (p) { return p.overallScore; })
    .filter(function (s) { return typeof s === "number" && s > 0; });

  var avgYield =
    yields.length > 0
      ? Math.round(
          (yields.reduce(function (a, b) { return a + b; }, 0) / yields.length) * 10
        ) / 10
      : 0;

  var avgScore =
    scores.length > 0
      ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length)
      : 0;

  var sorted = autoProps.slice().sort(function (a, b) {
    return b.expectedYield - a.expectedYield;
  });
  var topYieldProp = sorted[0] || null;

  var sortedByScore = autoProps.slice().sort(function (a, b) {
    return b.overallScore - a.overallScore;
  });

  // City distribution
  var cityCounts = {};
  autoProps.forEach(function (p) {
    var city = p.city || "Unknown";
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  var topCityEntry = Object.entries(cityCounts).sort(function (a, b) {
    return b[1] - a[1];
  })[0];
  var topCityName = topCityEntry ? topCityEntry[0] : "";
  var topCityCount = topCityEntry ? topCityEntry[1] : 0;

  // Top 5 by score
  var topProperties = sortedByScore.slice(0, 5).map(function (p) {
    return {
      id: p.id,
      name: p.name,
      yield: p.expectedYield,
      score: p.overallScore,
      city: p.city,
    };
  });

  var formattedDate = formatDate(date);

  // Platform breakdown
  var platformCounts = {};
  autoProps.forEach(function (p) {
    var platform = p.platform || "Unknown";
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  });
  var platformList = Object.entries(platformCounts)
    .map(function (e) { return e[1] + " on " + e[0]; })
    .join(", ");

  var aiPrompt = [
    "Write a 3-paragraph market commentary (around 200 words) for a tokenized real estate investment platform.",
    "Date: " + formattedDate + ".",
    "Data summary:",
    "- Total listings: " + autoProps.length + " (" + platformList + ")",
    "- Average net yield: " + avgYield + "%",
    "- Average Brickwise score: " + avgScore + "/100",
    "- Highest yield property: " +
      (topYieldProp
        ? topYieldProp.name + " in " + topYieldProp.city + " at " + topYieldProp.expectedYield + "%"
        : "n/a"),
    "- Top-scored property: " +
      (sortedByScore[0]
        ? sortedByScore[0].name + " in " + sortedByScore[0].city + " (" + sortedByScore[0].overallScore + "/100)"
        : "n/a"),
    "- Most active city: " + topCityName + " (" + topCityCount + " listings)",
    "",
    "Write for retail investors interested in fractional/tokenized property.",
    "Cover: current yield landscape, geographic distribution, platform diversity, what to watch.",
    "Tone: analytical, factual, no hype. Output plain text, two newlines between paragraphs.",
  ].join("\n");

  var commentary = await callKieAI(aiPrompt);

  // Fallback commentary if AI unavailable
  if (!commentary) {
    commentary = [
      "The tokenized real estate market continues to offer accessible entry points for retail investors seeking passive income. Across " +
        autoProps.length +
        " active listings on Lofty and RealT, the average net yield currently sits at " +
        avgYield +
        "%, reflecting a diverse range of residential properties primarily concentrated in US markets.",

      topYieldProp
        ? "Top performers this period include " +
          topYieldProp.name +
          " in " +
          topYieldProp.city +
          ", delivering " +
          topYieldProp.expectedYield +
          "% net yield. " +
          topCityName +
          " leads in listing volume with " +
          topCityCount +
          " available properties, offering investors meaningful diversification within a single metro area."
        : "Geographic diversification remains a core advantage of the tokenized model, with properties spread across multiple US cities and price points.",

      "Investors should review occupancy rates, fee structures, and platform-specific terms before committing capital. " +
        "Brickwise scores each property on yield, risk, neighborhood quality, and token fair value to help surface the most compelling opportunities at any given time.",
    ].join("\n\n");
  }

  var highlights = [
    autoProps.length + " tokenized properties tracked across Lofty and RealT",
    "Average net yield: " + avgYield + "% across all active listings",
    topYieldProp
      ? "Top yield: " + topYieldProp.expectedYield + "% — " + topYieldProp.name + ", " + topYieldProp.city
      : null,
    topCityName
      ? topCityName + " leads with " + topCityCount + " available listings"
      : null,
    "Average Brickwise score: " + avgScore + "/100",
  ].filter(Boolean);

  var entry = {
    date: date,
    slug: date,
    title: "Tokenized Real Estate Market Update — " + formattedDate,
    summary: commentary,
    highlights: highlights,
    stats: {
      totalListings: autoProps.length,
      avgYield: avgYield,
      avgScore: avgScore,
      topYield: topYieldProp ? topYieldProp.expectedYield : 0,
      topYieldCity: topYieldProp ? topYieldProp.city : "",
    },
    topProperties: topProperties,
  };

  // Prepend to market-updates.json, keep last 90 days
  var existing = readJson("lib/data/market-updates.json") || [];
  var filtered = existing.filter(function (u) { return u.date !== date; });
  var updated = [entry].concat(filtered).slice(0, 90);

  writeJson("lib/data/market-updates.json", updated);
  console.log(
    "SEO market content written for",
    date,
    "— total entries:",
    updated.length
  );
}

main().catch(function (err) {
  console.error("SEO generation failed:", err.message);
  process.exit(1);
});
