// Prepares a built site (dist/) for one Environment, at deploy time, before
// `wrangler pages deploy`. The same build runs in every Environment; only these
// two things differ:
//
// 1. dist/config.json: every setting whose name starts with PLATFORM_ or
//    PUBLIC_, and nothing else, so no secret reaches the browser. The site
//    reads it in src/lib/config.ts. Settings come from the environment of the
//    process, and from the JSON object in VARS_JSON: the workflows pass the
//    GitHub Environment's variables as VARS_JSON: ${{ toJSON(vars) }}.
// 2. dist/_headers: X-Robots-Tag: noindex, nofollow on every path, unless
//    the setting ROBOTS_INDEX is "true". Only production sets it, once the site
//    is public at its own address; then only the *.pages.dev address is noindex.
//
// Usage: node scripts/write-config.mjs [dist folder]

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const NAME = /^(PLATFORM|PUBLIC)_[A-Za-z0-9_]+$/;

/** Every PLATFORM_* and PUBLIC_* setting, as strings, sorted by name. */
export function publicSettings(...sources) {
  const settings = {};
  for (const source of sources) {
    for (const [name, value] of Object.entries(source ?? {})) {
      if (NAME.test(name) && value !== undefined && value !== null) settings[name] = String(value);
    }
  }
  return Object.fromEntries(Object.entries(settings).sort(([a], [b]) => a.localeCompare(b)));
}

const ROBOTS = "  X-Robots-Tag: noindex, nofollow";

/**
 * _headers with the robots header added. Cloudflare Pages keeps only the last
 * rule of a path, so the header goes into the rule /* that is already there,
 * not into a second one. When the site may be indexed, only the *.pages.dev
 * address gets it, in a rule of its own.
 */
export function withRobots(headers, index) {
  const text = headers.replace(/\r\n/g, "\n");
  const ending = text.replace(/\n*$/, "\n");
  if (index) {
    return `${ending}\n# Added at deploy by scripts/write-config.mjs.\nhttps://:project.pages.dev/*\n${ROBOTS}\n`;
  }
  const lines = text.split("\n");
  const all = lines.indexOf("/*");
  if (all < 0) return `${text ? `${ending}\n` : ""}/*\n${ROBOTS}\n`;
  lines.splice(all + 1, 0, ROBOTS);
  return lines.join("\n");
}

export function parseVars(json) {
  if (!json) return {};
  const vars = JSON.parse(json);
  if (typeof vars !== "object" || vars === null || Array.isArray(vars)) {
    throw new Error("VARS_JSON must be a JSON object");
  }
  return vars;
}

async function main() {
  const dist = process.argv[2] ?? "dist";
  const vars = parseVars(process.env.VARS_JSON);
  const settings = publicSettings(vars, process.env);
  const index = (vars.ROBOTS_INDEX ?? process.env.ROBOTS_INDEX) === "true";

  await writeFile(join(dist, "config.json"), `${JSON.stringify(settings)}\n`);
  const headersFile = join(dist, "_headers");
  const headers = await readFile(headersFile, "utf8").catch(() => "");
  await writeFile(headersFile, withRobots(headers, index));

  console.log(`wrote ${join(dist, "config.json")}: ${Object.keys(settings).join(", ") || "(empty)"}`);
  console.log(`search engines: ${index ? "may index the site's own address" : "noindex everywhere"}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
