# This repository

> Trislab's corporate site, trislab.com: an Astro site built into static files and served by Cloudflare Pages. Start with [README.md](README.md); the detail is in [docs/](docs/).

This file is the guide for every AI coding tool (Claude Code, Cursor, Codex, …). `CLAUDE.md` only imports it: edit conventions here.

## Repository map

| Path | What |
| --- | --- |
| `src/site.config.ts` | The site's facts: languages, company, contact, legal pages, structured data, `security.txt` ([docs/site-settings.md](docs/site-settings.md)) |
| `src/` | The site: `pages/[...lang]/`, `layouts/`, `components/`, `content/<collection>/<language>/`, `i18n/`, `lib/` |
| `public/_headers` | The security headers and caching Cloudflare Pages sends ([docs/architecture.md](docs/architecture.md)) |
| `scripts/` | The checks `pnpm test` runs, the accessibility and Lighthouse checks (`quality.mjs`), the deploy-time settings (`write-config.mjs`), the release versions (`version.mjs`), `pnpm status`, the yearly CO₂ estimate |
| `.github/workflows/` | ci, Deploy to dev, Release new version, Deploy to staging, Promote to production ([docs/deployment.md](docs/deployment.md)) |
| `.template-version` | The `tl-template-website` release this repository was made from. This repository runs on Cloudflare Pages ahead of the template, which still targets Container Apps |

## Rules

- **Run `pnpm test` and `pnpm test:a11y` before every push.** The required check `ci / ci` runs them, then Lighthouse CI, which runs on GitHub only ([docs/quality-checks.md](docs/quality-checks.md)).
- **Dependencies stay pinned and current** ([docs/dependencies.md](docs/dependencies.md)). Renovate proposes updates weekly and Dependabot raises security fixes. Add a package only with a reason in the PR, pin it exactly, and never take a release younger than 3 days.
- **Every change is a PR** to `main`, merged after `ci / ci` passes and a code owner approves. Every merge deploys to dev.
- **Release, deploy and promote only with the workflows** ([docs/deployment.md](docs/deployment.md)): *Release new version*, *Deploy to staging*, *Promote to production*. Never tag by hand, never move or delete a tag, never deploy with `wrangler` from a laptop or through the Cloudflare dashboard.
- **No secrets** in the repository, the build or `/config.json`. The Cloudflare token lives only in the GitHub Environments. Settings reach the site only as `PLATFORM_*` and `PUBLIC_*` ([docs/configuration.md](docs/configuration.md)).
- **Hostnames, DNS, Access and the Pages project** belong to `tl-cloud-infrastructure`, not to this repository ([docs/deployment.md](docs/deployment.md#set-up-and-tear-down)).
- **The repository is public.** No personal data, client contracts, prices or internal addresses in code, docs, PRs or commits.

## Skills

None. Deploying and releasing are workflows, and `pnpm status` shows what runs where. To act for a person, an agent runs the workflows with `gh workflow run` and watches them with `gh run watch`, as [docs/deployment.md](docs/deployment.md) describes.
