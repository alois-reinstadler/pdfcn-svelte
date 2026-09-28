# Verified release candidate

Starting point: clean `main`, commit `79103eb`. Verification completed 2026-09-28.
No package publication, push or deployment was performed.

## Release recommendation and blockers

The local candidate passes the complete release gate and independent consumer,
PDF raster and browser checks. Recommend it for review and an authorized deployment.
There are no known unresolved implementation blockers in the exercised workflows.
The public registry still serves the previous artifacts: **hosted installation is
not claimed fixed**. After deployment, the real CLI must pass against those exact
hosted artifacts before announcing the public release. This is the remaining
release gate, not a request to skip verification.

## Concrete changes

- Forme core/Svelte now use `^0.25.0`. Percentage-column table header/body spacing
  fell from 145pt to 26.2pt, with a strict <35pt regression and raster inspection.
- Takumi supports multiple authored flowing sections, repeated/stacked bands,
  physical page numbers, measured keep-with-next and minimum-space behavior.
  Asymmetric margins constrain both body and bands. Long unbroken identifiers
  wrap without disappearing; oversized rows and conflicting geometry raise
  actionable errors.
- Checked Forme server rendering rejects content-loss diagnostics, oversized or
  split atomic groups, off-page painting and collisions with fixed bands.
  Late fixed content raises an error instead of disappearing on earlier pages.
- All 24 component families have a prop inventory and implementation trace in
  [API-AUDIT.md](./API-AUDIT.md). Repaired lists, charts, printable fields,
  signatures and image requests have focused rendering/negative regressions.
- Reports retain all caller metrics and chart data. They no longer infer risk
  counts, checked highlights or average totals. Callers own business conclusions,
  statuses, tax rates and totals; the library validates renderable numeric data.
- Documentation shows actual physical PDF pages separately from HTML previews.
  All 70 complete displayed examples render in fresh consumer applications.
  Setup now includes scaffold, CLI initialization, font assets and production
  server prerequisites.

## Deliberate API migrations

See [README migration instructions](../../README.md#01-migration-and-renderer-limits)
and [CHANGELOG](../../CHANGELOG.md).

- Use `pdfcn-svelte/bases/forme/server` for checked Forme rendering and
  `pdfcn-svelte/bases/takumi/server` for Takumi rendering. Browser imports remain
  separate from server engines. Copied source includes matching server entries.
- Declare Forme fixed headers/footers/page numbers before body content in `Page`.
- Prefer `PrintableForm` and `PrintableSignature`; old names remain deprecated
  aliases. These are printable content, not interactive fields or digital signing.
- Resolve image requests with `loadImage`; use `imageDataUri` for file bytes.
  Forme image components require resolved PNG/JPEG data URIs. Unsupported fit,
  positioning and request combinations fail instead of being ignored.
- Forme sibling keep/minimum-space options are restricted. Use `KeepTogether`
  around a heading and its first content block. Takumi implements measured sibling
  behavior; incompatible geometry and overflowing atomic content fail explicitly.
- Supply optional report `facts`, `tableFooter`, `chartTitle` and `chartSubtitle`
  for caller-owned summaries. No values are inferred to replace absent conclusions.

## Reproducible verification

```sh
PDFCN_CONSUMER_PREVIEW_SLUG=pdfcn-svelte-review PDFCN_REGRESSION_ARTIFACTS=/tmp/pdfcn-release-final pnpm validate
PDFCN_BASE_PATH=/pdfcn-svelte pnpm exec vite build
PDFCN_BASE_PATH=/pdfcn-svelte pnpm docs:check
```

The preview variable selects an exclusively owned manager allocation; the artifact
variable retains PDFs/rasters for inspection. The base-path variable verifies the
actual deployment prefix. Use your own preview slug when reproducing concurrently.

All commands passed. Full gate log: `/tmp/pdfcn-release-gate.log`; deployment-path
build/crawl log: `/tmp/pdfcn-production-base.log`. The gate includes:

- Svelte check (zero errors/warnings), public types and all six package exports.
- Both renderer component suites, pagination, checked Forme output, 20 default
  templates, 60 adversarial invoice and 32 report scenarios.
- 180 renderer/theme/template PDFs, 70 source examples and 102 physical-page rasters;
  a crawler validates 58 production documentation pages and internal links.
- Real shadcn-svelte initialization, component/template/theme installation and
  dependency resolution in separate Forme/Takumi copied-source apps.
- Forme-only and Takumi-only package apps, dev/production first-PDF endpoints,
  all 70 displayed examples over production HTTP, and a fifth browser app with
  neither renderer installed. No checkout aliases or borrowed dependencies.

Final consumer commands, outputs, versions and PDFs:
`/tmp/pdfcn-release-consumers-mNVdSe/results.json` and neighboring numbered logs.
See [consumer-baseline.md](./consumer-baseline.md) for exact CLI commands, the
hosted baseline, omitted prerequisites and post-deployment rerun instructions.

## Independent visual and browser checks

Readable raster inspection covered compact table headers, chart labels, wrapped
continuation rows, final totals, the four-page EUR 7.200,00 invoice in both engines,
long reports, corrected Card/party-label borders and asymmetric repeated bands.
Artifacts are retained under `/tmp/pdfcn-release-final`; band inspection is also
at `/tmp/pdfcn-pagination-bands/bands-0-page-2.png`.

Shared Chrome checked the production site at `/pdfcn-svelte` at 1440x1000 and
390x844. Physical-page previous/next limits, renderer reset, PDF downloads,
copy feedback, template theme selection, mobile menus and Escape/focus restoration
passed. Getting started, component output, custom invoice and fonts routes had no
horizontal overflow or console/network errors. The browser-only consumer made
nine successful requests with no renderer assets or console errors. Screenshots:
`docs-desktop.png`, `docs-mobile.png`, `graph-browser.png`, `browser-only.png` in
`/tmp/pdfcn-release-final`. All owned browser tabs were closed.

The managed review preview remains at
http://100.64.0.2:4090/pdfcn-svelte/docs/pagination (tailnet only).
