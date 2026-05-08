#!/usr/bin/env node
// Sequentially renders every template registered in video/src/Root.tsx.
// One at a time keeps RAM bounded on a laptop.
//
// Each render also dumps a thumbnail still frame next to the MP4.

import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const COMPOSITIONS = [
  { id: "IFoundBadWebsites",   slug: "i-found-bad-websites",  thumb: 30  },
  { id: "LeadToOutreach90s",   slug: "lead-to-outreach-90s",  thumb: 90  },
  { id: "AISalesResearcher",   slug: "ai-sales-researcher",   thumb: 60  },
  { id: "PhoneDemo32s",        slug: "phone-demo-32s",        thumb: 90  },
  { id: "GrowthOSShort",       slug: "growthos-short",        thumb: 50  },
];

const ENTRY = "video/src/index.tsx";
const OUT_DIR = "out";
mkdirSync(OUT_DIR, { recursive: true });

function run(args) {
  const result = spawnSync("npx", ["remotion", ...args], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`\n[render-all] Failed: remotion ${args.join(" ")} -> exit ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

for (const c of COMPOSITIONS) {
  const mp4 = path.join(OUT_DIR, `${c.slug}.mp4`);
  const png = path.join(OUT_DIR, `${c.slug}.thumb.png`);
  console.log(`\n=== Rendering ${c.id} -> ${mp4} ===`);
  run(["render", ENTRY, c.id, mp4]);

  console.log(`=== Thumbnail ${c.id} @ frame ${c.thumb} -> ${png} ===`);
  run(["still", ENTRY, c.id, png, `--frame=${c.thumb}`]);
}

console.log(`\nAll done. Files in ${OUT_DIR}/`);
