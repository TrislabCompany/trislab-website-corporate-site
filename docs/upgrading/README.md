# Updates from the template

This repository was made from `tl-template-website`; `.template-version` records the release. It is the pilot for running website products on Cloudflare Pages, so for now it is ahead of the template, which still builds an nginx image for Container Apps.

Until the template moves to Cloudflare Pages:

- **Template releases are not taken automatically.** The `update-from-template` skill has been removed. Its platform files (the Container Apps workflows, `Dockerfile`, `nginx/`, `platform.yaml`) no longer apply here.
- **A template change that is still useful**, such as a fix in `src/` or in a check of `scripts/`, is copied by hand in an ordinary PR, which names the template release it comes from.
- **What this repository proves out** (the workflows, `public/_headers`, `scripts/write-config.mjs`, `scripts/version.mjs`, `scripts/status.mjs`, `build.format: "file"`, the quality checks `scripts/quality.mjs` with `.pa11yci.json` and `lighthouserc.json`, and the Renovate settings in `renovate.json`, which go to `tl-platform/renovate/default.json`) goes into `tl-template-website` once the whole cycle, dev to production, has worked here. After that template release, this repository takes template releases again and `.template-version` is bumped.
