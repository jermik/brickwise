#!/usr/bin/env node
// Transcribe a video file (Instagram reel, TikTok, etc.) via OpenAI Whisper.
// Usage: node scripts/reel-to-text.mjs <path-to-video>
// If no path given, picks the most recent video in ~/Downloads.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.mkv', '.m4v', '.avi', '.mp3', '.m4a', '.wav', '.mpga', '.mpeg']);

function findLatestVideo() {
  const dl = path.join(os.homedir(), 'Downloads');
  const files = fs.readdirSync(dl)
    .map(name => path.join(dl, name))
    .filter(p => {
      try { return fs.statSync(p).isFile() && VIDEO_EXT.has(path.extname(p).toLowerCase()); }
      catch { return false; }
    })
    .map(p => ({ p, m: fs.statSync(p).mtimeMs }))
    .sort((a, b) => b.m - a.m);
  return files[0]?.p;
}

const videoPath = process.argv[2] || findLatestVideo();
if (!videoPath || !fs.existsSync(videoPath)) {
  console.error('No video file found. Pass a path or drop a video in ~/Downloads.');
  process.exit(1);
}

const stat = fs.statSync(videoPath);
const sizeMB = stat.size / (1024 * 1024);
console.log(`File: ${videoPath}`);
console.log(`Size: ${sizeMB.toFixed(2)} MB`);
if (sizeMB > 25) {
  console.error('File exceeds Whisper 25MB limit. Strip audio first with ffmpeg.');
  process.exit(1);
}

const form = new FormData();
form.append('file', new Blob([fs.readFileSync(videoPath)]), path.basename(videoPath));
form.append('model', 'whisper-1');
form.append('response_format', 'verbose_json');

console.log('Transcribing via Whisper...');
const t0 = Date.now();
const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: form,
});

if (!res.ok) {
  console.error(`Whisper API ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
const dt = ((Date.now() - t0) / 1000).toFixed(1);

const outDir = path.resolve(process.cwd(), 'content', 'reels');
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const base = path.basename(videoPath, path.extname(videoPath)).replace(/[^a-z0-9_-]/gi, '_').slice(0, 40);
const outPath = path.join(outDir, `${stamp}_${base}.md`);

const body = [
  `# Reel transcript`,
  ``,
  `- Source: \`${videoPath}\``,
  `- Duration: ${data.duration?.toFixed(1) ?? '?'}s`,
  `- Language: ${data.language ?? '?'}`,
  `- Transcribed: ${stamp} (in ${dt}s)`,
  ``,
  `## Transcript`,
  ``,
  data.text.trim(),
  ``,
].join('\n');

fs.writeFileSync(outPath, body);
console.log(`Wrote ${outPath} (${dt}s)`);
console.log('---');
console.log(data.text.trim());
