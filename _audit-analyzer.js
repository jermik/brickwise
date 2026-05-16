const fs = require("fs");
const path = require("path");

const tmpDir = process.env.TMP || process.env.TEMP || "/tmp";

const pages = [
  ["/", "audit-.html"],
  ["/audits/restaurant", "audit-audits_restaurant.html"],
  ["/audits/salon", "audit-audits_salon.html"],
  ["/audits/gym", "audit-audits_gym.html"],
  ["/audits/dentist", "audit-audits_dentist.html"],
  ["/audits/real-estate", "audit-audits_real-estate.html"],
  ["/about", "audit-about.html"],
  ["/privacy", "audit-privacy.html"],
  ["/terms", "audit-terms.html"]
];

const ext = (h, re) => { const m = h.match(re); return m ? m[1] : null; };
const cnt = (h, re) => [...h.matchAll(re)].length;

const results = [];
for (const [url, file] of pages) {
  const full = path.join(tmpDir, file);
  if (!fs.existsSync(full)) {
    console.log(url, "MISSING FILE", full);
    continue;
  }
  const h = fs.readFileSync(full, "utf8");

  const title = ext(h, /<title>([^<]+)<\/title>/);
  const desc = ext(h, /name="description"[^>]+content="([^"]+)"/);
  const canonical = ext(h, /rel="canonical"[^>]+href="([^"]+)"/);
  const ogImage = ext(h, /property="og:image"[^>]+content="([^"]+)"/);
  const twitterImage = ext(h, /name="twitter:image"[^>]+content="([^"]+)"/);
  const ogTitle = ext(h, /property="og:title"[^>]+content="([^"]+)"/);
  const ogDesc = ext(h, /property="og:description"[^>]+content="([^"]+)"/);
  const h1Count = cnt(h, /<h1[\s>]/g);
  const h2Count = cnt(h, /<h2[\s>]/g);
  const h3Count = cnt(h, /<h3[\s>]/g);
  const imgCount = cnt(h, /<img\s/g);
  const imgNoAlt = cnt(h, /<img(?![^>]*\salt=)[^>]*>/g);
  const noindexMeta = /name="robots"[^>]+content="[^"]*noindex/i.test(h);
  const viewport = !!ext(h, /name="viewport"/);
  const charset = ext(h, /<meta\s+charSet="([^"]+)"/i);
  const linkCount = cnt(h, /<a\s+[^>]*href="\//g);
  const externalLinks = cnt(h, /<a\s+[^>]*href="https?:\/\//g);
  const h1Text = ext(h, /<h1[^>]*>([\s\S]*?)<\/h1>/);

  const jsonldBlocks = [...h.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const jsonldTypes = [];
  for (const m of jsonldBlocks) {
    try {
      const j = JSON.parse(m[1]);
      if (j["@graph"]) jsonldTypes.push(...j["@graph"].map(x => x["@type"]));
      else if (j["@type"]) jsonldTypes.push(j["@type"]);
    } catch {}
  }

  // word count approximation
  const stripped = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  const wordCount = (stripped.match(/\b[A-Za-z]{2,}\b/g) || []).length;

  results.push({
    url,
    size: h.length,
    title,
    titleLen: title ? title.length : 0,
    desc: desc ? desc.slice(0, 100) : null,
    descLen: desc ? desc.length : 0,
    canonical,
    ogImage,
    ogTitle: !!ogTitle,
    ogDesc: !!ogDesc,
    twitterImage,
    h1: h1Count,
    h1Text: h1Text ? h1Text.replace(/<[^>]+>/g, "").trim().slice(0, 80) : null,
    h2: h2Count,
    h3: h3Count,
    imgCount,
    imgNoAlt,
    noindex: noindexMeta,
    viewport,
    charset,
    internalLinks: linkCount,
    externalLinks,
    jsonldBlocks: jsonldBlocks.length,
    jsonldTypes,
    wordCount
  });
}

console.log(JSON.stringify(results, null, 2));

// robots.txt + sitemap.xml
const robots = fs.readFileSync(path.join(tmpDir, "audit-robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(tmpDir, "audit-sitemap.xml"), "utf8");
console.log("\n=== ROBOTS ===");
console.log(robots);
console.log("\n=== SITEMAP URL count ===");
console.log([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].length);
