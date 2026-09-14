#!/usr/bin/env node
// Runs parse-case-study.mjs over every .txt file in content/. Wired as a
// prebuild step so JSON always reflects the latest .txt content without
// needing to remember to run the parser manually after each edit.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const contentDir = path.join(process.cwd(), "content");
if (!fs.existsSync(contentDir)) {
  console.log("No content/ directory found, skipping case study parsing.");
  process.exit(0);
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".txt"));
if (files.length === 0) {
  console.log("No .txt case studies found in content/.");
  process.exit(0);
}

for (const file of files) {
  const filePath = path.join(contentDir, file);
  execFileSync("node", [path.join(process.cwd(), "scripts/parse-case-study.mjs"), filePath], {
    stdio: "inherit",
  });
}
