import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const resend = new Resend(process.env.RESEND_API_KEY);

function readJson(relPath) {
  var full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  try {
    return JSON.parse(fs.readFileSync(full, "utf-8"));
  } catch (e) {
    return null;
  }
}

function buildEmailHtml(u) {
  var topPropsHtml = u.topProperties
    .slice(0, 5)
    .map(function (p) {
      return (
        '<a href="https://brickwise.pro/property/' +
        p.id +
        '" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f9f9f9;border-radius:8px;margin-bottom:8px;text-decoration:none;border:1px solid #f0f0f0;">' +
        '<div>' +
        '<div style="font-size:13px;font-weight:600;color:#111;">' + p.name + '</div>' +
        '<div style="font-size:11px;color:#a3a3a3;margin-top:2px;">' + p.city + '</div>' +
        '</div>' +
        '<div style="font-size:16px;font-weight:800;color:#16a34a;font-family:monospace;">' + p.yield + '%</div>' +
        '</a>'
      );
    })
    .join("");

  var summaryHtml = u.summary
    .split("\n\n")
    .map(function (para) {
      return '<p style="font-size:14px;color:#404040;line-height:1.7;margin:0 0 14px;">' + para + "</p>";
    })
    .join("");

  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    u.title +
    '</title></head>' +
    '<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;">' +
    '<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">' +

    // Header
    '<div style="background:#0f0f0f;padding:22px 32px;display:flex;align-items:center;gap:10px;">' +
    '<div style="width:28px;height:28px;background:#16a34a;border-radius:6px;"></div>' +
    '<span style="color:#fff;font-size:17px;font-weight:700;letter-spacing:-0.3px;margin-left:4px;">Brickwise</span>' +
    '<span style="color:#555;font-size:12px;margin-left:10px;">Weekly Market Digest</span>' +
    '</div>' +

    // Body
    '<div style="padding:32px;">' +
    '<h1 style="font-size:20px;font-weight:700;color:#111;margin:0 0 20px;letter-spacing:-0.3px;">' + u.title + '</h1>' +

    // Stats
    '<div style="display:flex;gap:12px;margin-bottom:24px;">' +
    '<div style="flex:1;background:#f5f5f5;border-radius:8px;padding:14px;text-align:center;">' +
    '<div style="font-size:22px;font-weight:800;color:#111;font-family:monospace;">' + u.stats.totalListings + '</div>' +
    '<div style="font-size:11px;color:#737373;margin-top:3px;letter-spacing:0.5px;">LISTINGS</div>' +
    '</div>' +
    '<div style="flex:1;background:#f0fdf4;border-radius:8px;padding:14px;text-align:center;">' +
    '<div style="font-size:22px;font-weight:800;color:#16a34a;font-family:monospace;">' + u.stats.avgYield + '%</div>' +
    '<div style="font-size:11px;color:#737373;margin-top:3px;letter-spacing:0.5px;">AVG YIELD</div>' +
    '</div>' +
    '<div style="flex:1;background:#f5f5f5;border-radius:8px;padding:14px;text-align:center;">' +
    '<div style="font-size:22px;font-weight:800;color:#111;font-family:monospace;">' + u.stats.topYield + '%</div>' +
    '<div style="font-size:11px;color:#737373;margin-top:3px;letter-spacing:0.5px;">TOP YIELD</div>' +
    '</div>' +
    '</div>' +

    // Commentary
    summaryHtml +

    // Top properties
    '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#a3a3a3;margin:20px 0 10px;">Top Rated This Week</div>' +
    topPropsHtml +

    // CTA
    '<a href="https://brickwise.pro/market/' + u.slug + '" style="display:block;background:#111;color:#fff;text-align:center;padding:14px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-top:24px;">View full market report →</a>' +
    '</div>' +

    // Footer
    '<div style="padding:20px 32px;border-top:1px solid #f0f0f0;">' +
    '<p style="font-size:11px;color:#a3a3a3;margin:0;line-height:1.6;">' +
    'You\'re receiving this because you subscribed at brickwise.pro. ' +
    '<a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#a3a3a3;">Unsubscribe</a>' +
    '</p>' +
    '</div>' +

    '</div></body></html>'
  );
}

async function main() {
  var updates = readJson("lib/data/market-updates.json");
  if (!updates || updates.length === 0) {
    console.log("No market updates found — skipping digest");
    return;
  }

  var latest = updates[0];
  var segmentId = process.env.RESEND_SEGMENT_ID;

  if (!segmentId) {
    console.log("RESEND_SEGMENT_ID not set — skipping digest");
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — skipping digest");
    return;
  }

  console.log("Sending digest for:", latest.title);

  var html = buildEmailHtml(latest);

  var result = await resend.broadcasts.create({
    segmentId: segmentId,
    from: "Brickwise <digest@brickwise.pro>",
    subject: latest.title,
    html: html,
    send: true,
  });

  if (result.error) {
    console.error("Digest send failed:", result.error);
    process.exit(1);
  }

  console.log("Digest sent successfully. Broadcast ID:", result.data && result.data.id);
}

main().catch(function (err) {
  console.error("Digest script failed:", err.message);
  process.exit(1);
});
