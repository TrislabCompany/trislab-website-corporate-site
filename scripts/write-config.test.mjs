// Unit tests for the deploy-time settings, run by `pnpm test` with the Node test runner.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parseVars, publicSettings, withRobots } from "./write-config.mjs";

test("keeps only PLATFORM_* and PUBLIC_* settings, as strings", () => {
  const settings = publicSettings(
    { PUBLIC_CONTACT_EMAIL: "info@example.com", CLOUDFLARE_ACCOUNT_ID: "x", PUBLIC_FLAG: true },
    { PLATFORM_ENVIRONMENT: "dev", PATH: "/bin", PUBLIC_: "no name", PLATFORM_x: "y", "PUBLIC_A-B": "no" },
  );
  assert.deepEqual(settings, {
    PLATFORM_ENVIRONMENT: "dev",
    PLATFORM_x: "y",
    PUBLIC_CONTACT_EMAIL: "info@example.com",
    PUBLIC_FLAG: "true",
  });
});

test("a later source wins", () => {
  assert.deepEqual(publicSettings({ PUBLIC_A: "1" }, { PUBLIC_A: "2" }), { PUBLIC_A: "2" });
});

const base = "/*\n  X-Frame-Options: DENY\n\n/_astro/*\n  Cache-Control: immutable\n";

test("noindex goes into the rule /* that is there, never a second one", () => {
  const headers = withRobots(base, false);
  assert.equal(headers.match(/^\/\*$/gm).length, 1);
  assert.match(headers, /^\/\*\n {2}X-Robots-Tag: noindex, nofollow\n {2}X-Frame-Options: DENY$/m);
  assert.ok(headers.endsWith("/_astro/*\n  Cache-Control: immutable\n"));
});

test("noindex adds a rule /* when there is none", () => {
  assert.equal(withRobots("", false), "/*\n  X-Robots-Tag: noindex, nofollow\n");
  assert.equal(withRobots("/a\n  X: y", false), "/a\n  X: y\n\n/*\n  X-Robots-Tag: noindex, nofollow\n");
});

test("an indexable site is noindex only on its pages.dev address", () => {
  const headers = withRobots(base, true);
  assert.ok(headers.startsWith(base));
  assert.match(headers, /^https:\/\/:project\.pages\.dev\/\*\n {2}X-Robots-Tag: noindex, nofollow$/m);
  assert.equal(headers.match(/X-Robots-Tag/g).length, 1);
});

test("VARS_JSON must be an object", () => {
  assert.deepEqual(parseVars(undefined), {});
  assert.deepEqual(parseVars('{"PUBLIC_A":"1"}'), { PUBLIC_A: "1" });
  assert.throws(() => parseVars("[1]"), /object/);
  assert.throws(() => parseVars("null"), /object/);
});

test("writes config.json and adds noindex to _headers", () => {
  const dist = mkdtempSync(join(tmpdir(), "write-config-"));
  writeFileSync(join(dist, "_headers"), "/*\n  X-Frame-Options: DENY\n");
  execFileSync(process.execPath, [fileURLToPath(new URL("write-config.mjs", import.meta.url)), dist], {
    env: { PLATFORM_ENVIRONMENT: "staging", SECRET: "s", VARS_JSON: '{"PUBLIC_A":"1","ROBOTS_INDEX":"false"}' },
  });
  assert.deepEqual(JSON.parse(readFileSync(join(dist, "config.json"), "utf8")), {
    PLATFORM_ENVIRONMENT: "staging",
    PUBLIC_A: "1",
  });
  const headers = readFileSync(join(dist, "_headers"), "utf8");
  assert.equal(headers, "/*\n  X-Robots-Tag: noindex, nofollow\n  X-Frame-Options: DENY\n");
});
