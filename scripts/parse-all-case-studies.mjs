#!/usr/bin/env node
// Runs parse-case-study.mjs over every .txt file in content/, including
// project subfolders (content/<project-id>/<slug>.txt — used to group a
// project's multiple case studies together) as well as flat top-level
// files (content/<slug>.txt — fine for a project with just one case
// study). Wired as a prebuild step so JSON always reflects the latest
// .txt content without needing to remember to run the parser manually
// after each edit.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const contentDir = path.join(process.cwd(), "content");
if (!fs.existsSync(contentDir)) {
  console.log("No content/ directory found, skipping case study parsing.");
  process.exit(0);
}

// Recursively collect every .txt file under `dir`, at any depth.
function collectTxtFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTxtFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      results.push(entryPath);
    }
  }
  return results;
}

const files = collectTxtFiles(contentDir);
if (files.length === 0) {
  console.log("No .txt case studies found in content/.");
  process.exit(0);
}

for (const filePath of files) {
  execFileSync("node", [path.join(process.cwd(), "scripts/parse-case-study.mjs"), filePath], {
    stdio: "inherit",
  });
}
