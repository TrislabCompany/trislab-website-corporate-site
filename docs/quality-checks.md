# Quality checks

Every commit pushed to a PR, and every push to `main`, runs the required check `ci / ci` (`.github/workflows/checks.yml`). The PR cannot merge unless all three steps pass:

| Step | Where it runs | What it checks |
| --- | --- | --- |
| `pnpm test` | GitHub and locally | Types and content (`astro check`), lint, the unit tests of `scripts/`, `astro build`, then the page-weight budget and `security.txt` on `dist/` ([getting-started.md](getting-started.md)) |
| Accessibility, `pnpm test:a11y` | GitHub and locally | pa11y-ci on every page |
| Lighthouse CI | **GitHub only** | Lighthouse scores and Core Web Vitals |

Both checks run once `dist/` is built, even if the other one fails, so one CI run reports everything. `scripts/quality.mjs` runs both of them. It copies `dist/` to `.quality/site`, sets the copy up as production with `scripts/write-config.mjs` (`/config.json`, the robots header), and serves it with `wrangler pages dev` on port 8788. So `public/_headers` applies, the Content-Security-Policy among them, as on Cloudflare Pages.

## Accessibility: pa11y-ci

- **Pages:** every URL in `dist/sitemap-*.xml`, so every page in every language.
- **Rules:** WCAG 2 AA, with two engines, axe-core and HTML_CodeSniffer. Only errors fail the check; warnings and notices don't.
- **Settings:** `.pa11yci.json`. `concurrency` stays at 1 because pa11y-ci 5 fails pages at random when it checks several at once.

pa11y-ci is a machine check. It finds missing alt text, low contrast, missing labels, a wrong heading order or a missing `lang`. It doesn't replace a person with a keyboard and a screen reader. The accessibility statement (`src/content/legal/*/accessibility.md`) still needs that manual review once a year.

## Performance and Core Web Vitals: Lighthouse CI

**Lighthouse CI (LHCI)** runs on the GitHub runner only. Lighthouse timings depend on the machine, so the limits are set for the runner and are checked only there. On a busy laptop the same page scores lower, which would make local results misleading.

**Pages:** the list in `lighthouserc.json` (`ci.collect.url`): home in English and Slovenian, about, services, one service, contact and sustainability. Each page runs 3 times, and the limits apply to the median run. Lighthouse uses its mobile defaults: a mid-range phone on a slow 4G connection, simulated.

| Limit | Value | Why |
| --- | --- | --- |
| Performance score | ≥ 90 | |
| Accessibility score | ≥ 95 | A second view next to pa11y-ci. It includes the WCAG 2.2 target size of 24 × 24 px |
| Best practices score | ≥ 95 | Includes errors in the browser console, such as a resource blocked by the Content-Security-Policy |
| SEO score | ≥ 95 | |
| Largest Contentful Paint | ≤ 2.5 s | Core Web Vital, "good" |
| Cumulative Layout Shift | ≤ 0.1 | Core Web Vital, "good". The fallback font in `global.css` is sized like Inter, so text doesn't move when Inter loads |
| Total Blocking Time | ≤ 200 ms | A lab measure standing in for Interaction to Next Paint, which only real visitors can measure |
| First Contentful Paint | ≤ 1.8 s | |

These limits are the defaults for every Trislab website. A site may tighten them. Loosening one needs a reason in the site's README, the same rule as the page-weight limits ([site-settings.md](site-settings.md)).

The reports stay in the CI run. Nothing goes to Lighthouse's public storage.

## Run the accessibility check locally

```sh
pnpm test        # builds dist/
pnpm test:a11y   # pa11y-ci on every page
```

You need Chrome (or Edge) installed. The script finds it in the usual places, or you can set `CHROME_PATH`. Puppeteer doesn't download a browser.

Lighthouse doesn't run locally: `node scripts/quality.mjs lighthouse` stops with a note. To look into a Lighthouse failure on your machine, use the reports from CI (below), or Chrome DevTools → Lighthouse on `pnpm exec wrangler pages dev dist`. As a last resort, `LHCI_LOCAL=1 node scripts/quality.mjs lighthouse` runs it here, but the numbers won't match the runner's.

## Read a failure

- **In the CI log:** pa11y-ci prints each failing page with the rule, the element and the fix it suggests. Lighthouse CI prints each limit that failed, with its value.
- **On the PR:** a comment with the Lighthouse table, each score and Core Web Vital per page marked ✅ or ❌ against its limit. The job `ci / lighthouse-comment` updates the same comment on every commit, so the PR shows the latest one. It isn't a required check, and it skips PRs from forks, whose token can't write.
- **In the job summary:** a table of failing pages and the same Lighthouse table.
- **In the artifact `quality-reports`**, kept for 14 days: `pa11y.json`, plus the full Lighthouse HTML reports (`lighthouse/*.html`). Open a report in a browser to see what slowed a page down or what moved.

Lighthouse timings change a little from run to run. If a limit fails by a hair and the PR didn't touch that page, run the job again once. If it fails again, it's real.
