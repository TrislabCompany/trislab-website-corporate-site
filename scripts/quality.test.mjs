import assert from "node:assert/strict";
import { test } from "node:test";
import { findChrome, lighthouseConfig, pa11yConfig, rebase, sitemapLocs } from "./quality.mjs";

test("sitemapLocs reads every <loc>", () => {
  const xml = `<urlset><url><loc>https://trislab.com/en</loc><xhtml:link href="https://trislab.com/sl"/></url><url><loc> https://trislab.com/en/about </loc></url></urlset>`;
  assert.deepEqual(sitemapLocs(xml), ["https://trislab.com/en", "https://trislab.com/en/about"]);
});

test("rebase moves a URL to the local server and keeps the path", () => {
  assert.equal(rebase("https://trislab.com/en/about?x=1", "http://127.0.0.1:8788/"), "http://127.0.0.1:8788/en/about?x=1");
  assert.equal(rebase("/sl", "http://127.0.0.1:8788/"), "http://127.0.0.1:8788/sl");
});

test("pa11yConfig keeps the settings and adds the URLs", () => {
  const settings = { defaults: { standard: "WCAG2AA" } };
  assert.deepEqual(pa11yConfig(settings, ["http://a/"]), { defaults: { standard: "WCAG2AA" }, urls: ["http://a/"] });
});

test("lighthouseConfig resolves the pages and writes reports to the output folder", () => {
  const rc = { ci: { collect: { url: ["/en", "/en/contact"], numberOfRuns: 3 }, assert: { assertions: {} } } };
  const out = lighthouseConfig(rc, "http://127.0.0.1:8788/", ".quality/lighthouse");
  assert.deepEqual(out.ci.collect.url, ["http://127.0.0.1:8788/en", "http://127.0.0.1:8788/en/contact"]);
  assert.equal(out.ci.collect.numberOfRuns, 3);
  assert.deepEqual(out.ci.upload, { target: "filesystem", outputDir: ".quality/lighthouse" });
  assert.deepEqual(rc.ci.collect.url, ["/en", "/en/contact"], "the input is not changed");
});

test("findChrome prefers CHROME_PATH, then looks in the usual places", () => {
  assert.equal(findChrome({ CHROME_PATH: "/x/chrome" }, "linux", () => false), "/x/chrome");
  assert.equal(findChrome({}, "linux", (p) => p === "/usr/bin/chromium"), "/usr/bin/chromium");
  assert.equal(findChrome({}, "linux", () => false), undefined);
  assert.equal(findChrome({ PROGRAMFILES: "C:\\PF" }, "win32", (p) => p === "C:\\PF\\Google\\Chrome\\Application\\chrome.exe"), "C:\\PF\\Google\\Chrome\\Application\\chrome.exe");
});
