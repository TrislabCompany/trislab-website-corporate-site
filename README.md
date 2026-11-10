# trislab-website-corporate-site

Trislab's corporate site, trislab.com, built from `tl-template-website`. Read this first; the detail is in [`docs/`](docs/).

## What it is

An [Astro](https://astro.build) site built into static files, served by Cloudflare Pages. It presents what Trislab offers and lets visitors contact sales by e-mail. It has no forms, no analytics, no cookies and loads no outside service.

| Page | Address | Content from |
| --- | --- | --- |
| Home | `/<lang>/` | `src/i18n/ui/<lang>.ts`, and the services and products |
| Services, one page each | `/<lang>/services`, `/<lang>/services/<name>` | `src/content/services/<lang>/` |
| Products, one page each | `/<lang>/products`, `/<lang>/products/<name>` | `src/content/products/<lang>/`: the platform, the four Netwrix pillars and NIS2 |
| Partners | `/<lang>/partners` | `src/i18n/ui/<lang>.ts`; only confirmed partners (Netwrix) |
| About | `/<lang>/about` | `src/i18n/ui/<lang>.ts` |
| Contact | `/<lang>/contact` | `src/site.config.ts` |
| Imprint, privacy policy, accessibility statement | `/<lang>/imprint`, `/privacy`, `/accessibility` | `src/site.config.ts`, `src/content/legal/<lang>/` |

**Languages:** English (the default and the source), Slovenian, Croatian, Serbian (Latin script) and Italian, each under its own URL. The other languages are drafts from English and are reviewed by a native speaker before production.

**Brand:** the dark slate background, light text and orange accent of the current site, its logo (`public/favicon.svg`, `src/components/Logo.astro`) and Inter, self-hosted from `@fontsource-variable/inter` (`src/styles/global.css`).

**Before production:**

- Replace the draft legal texts in `src/content/legal/` with the texts from Trislab's shared legal pack, reviewed by a lawyer. Each file says so at the top.
- Add the Netwrix logo to the partners page once the file is received.
- Have a native speaker review the Slovenian, Croatian, Serbian and Italian texts.

**Hosting:** the pilot of website products on Cloudflare Pages, ahead of the template ([docs/upgrading/README.md](docs/upgrading/README.md)). dev, staging and production, and how a change moves between them, are in [docs/deployment.md](docs/deployment.md).

The rest of this README is the template's guide, adapted to Cloudflare Pages.

## When to use it

Use it for a site that shows content, such as pages, articles, a company or a documentation site, with no API, no database and no users of its own.

| Your product… | Choose |
| --- | --- |
| Shows content, with no backend of its own | `tl-template-website`, this template |
| Lets people work with data, such as forms, lists or a workflow, for one organisation, with its own API and database | `tl-template-webapp` |
| Serves many customers from one deployment, each a tenant with its own users, plans and data | `tl-template-saas` |

## How to use it

You don't create a repository from this template yourself. The platform creates it when your product is onboarded: the onboarding PR in `tl-cloud-infrastructure` adds the repository to `catalog/repos.yaml`, named `<customer>-website-<product>` (for example `trislab-website-corporate-site`), and the pipeline creates it from this template with its team, rules and `dev` Environment. Don't use GitHub's "Use this template" button.

The new repository gets a copy of these files and never syncs with the template again. From then on the code, this README and `docs/` are your team's.

## Features included

What works on the first deploy, with no change:

- The sample site, ready to replace with your own pages and content.
- Several languages, each under its own URL (`/en/`, `/sl/`), with `hreflang`, `x-default`, a canonical link and a language switch on every page. A one-language site has no prefix.
- A contact page, an imprint, a privacy policy and an accessibility statement, filled from `src/site.config.ts` and Markdown, and linked from the footer.
- A sitemap of every page in every language, and a `robots.txt` that names it.
- The company as structured data (JSON-LD, `Organization` or `LocalBusiness`) on every page.
- `/.well-known/security.txt`, with its expiry date checked in `ci`.
- A page-weight budget: `ci` fails when a page or its JavaScript is over the limit.
- `/config.json`, written at deploy from the `PLATFORM_*` and `PUBLIC_*` settings, so one build runs in every Environment.
- Security headers on every answer, including a strict Content-Security-Policy, and long caching of hashed assets.
- The check `ci / ci` on every PR and every push to `main`: `astro check`, the linter, the unit tests, the build, and the page-weight and `security.txt` checks.
- Deploy to dev on every merge, a release workflow that tags and builds a version, and deploys to staging and production of exactly that build.

## Technologies

| Technology | Version |
| --- | --- |
| Astro | 5.18.2 |
| Node.js | 22 (build only) |
| pnpm | 10.34.9 |
| TypeScript | 5.9.3 |
| ESLint | 10.13.0, with `typescript-eslint` 8.72.1 and `eslint-plugin-astro` 3.2.1 |
| Wrangler | 4.152.0, to deploy to Cloudflare Pages and to serve `dist/` locally |
| pa11y-ci | 5.0.0, the accessibility check |
| Lighthouse CI | 0.16.0, the performance and Core Web Vitals check |

Renovate proposes updates every Monday, and Dependabot raises security fixes as soon as they are published ([dependencies.md](docs/dependencies.md)). Every update passes the same checks as any other change ([quality-checks.md](docs/quality-checks.md)).

## Repository layout

| Path | Holds |
| --- | --- |
| `src/site.config.ts` | The site's facts: languages, company, contact, legal pages, structured data, `security.txt` |
| `src/` | The site: `pages/[...lang]/`, `layouts/`, `components/`, `content/<collection>/<language>/`, `i18n/` and `lib/` |
| `public/` | Files copied as they are: the favicon and `_headers`, the security headers and caching |
| `scripts/`, `page-weight.config.json` | The checks `pnpm test` runs on the built site, the page-weight limits, and the scripts the workflows use: `write-config.mjs`, `version.mjs`, `status.mjs` |
| `.github/` | The workflows (ci, deploy, release, promote), the PR template and the code owners |
| `docs/` | The detail behind this README |

## First steps

1. **Set the site's facts:** languages, company, contact and legal pages in `src/site.config.ts` ([site-settings.md](docs/site-settings.md)).
2. **Run it locally:** `pnpm install`, then `pnpm dev`, and open <http://localhost:4321>. Run `pnpm test` and `pnpm test:a11y` before you push. [getting-started.md](docs/getting-started.md) also runs it as Cloudflare Pages serves it.
3. **Open your first PR:** change a page in `src/pages/[...lang]/`, push a branch and open a PR. `ci / ci` must pass and a code owner must approve.
4. **Deploy, release and promote:** a merge to `main` deploys to dev, *Release new version* tags a version and deploys it to staging, and *Promote to production* moves it to production after a reviewer approves. `pnpm status` shows what runs where; [deployment.md](docs/deployment.md) explains how it works.

## More

- [Getting started](docs/getting-started.md): run the site with the dev server and as Cloudflare Pages serves it, and run the tests.
- [Architecture](docs/architecture.md): the build, Cloudflare Pages, the headers and the request path.
- [Site settings](docs/site-settings.md): languages, contact and legal pages, structured data, `security.txt` and the page-weight budget.
- [Configuration](docs/configuration.md): the settings, `/config.json`, and how to add a `PUBLIC_` setting.
- [Deployment](docs/deployment.md): Environments, deploy, release and promote, rollback, and how the site is set up and torn down.
