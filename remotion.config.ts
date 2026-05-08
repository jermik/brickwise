// Remotion config (lives at the repo root so the CLI auto-detects it).
//
// Notes:
//  - publicDir is set to "./public" so staticFile("demo/raw-demo.mp4")
//    resolves to the project's existing public/ folder instead of
//    Remotion's default "<entry>/public/".
//  - Concurrency is left at the default; render-all.mjs renders one
//    composition at a time to keep RAM bounded on a laptop.

import { Config } from "@remotion/cli/config";

Config.setPublicDir("./public");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
