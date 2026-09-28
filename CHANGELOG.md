# Changelog

## Unreleased

### Release engineering update

- Upgrade Forme core and Svelte adapters to `^0.25.0`; upstream fixes the
  percentage-width table row inflation. The registry uses the same tested
  dependency ranges as the package.
- Add a real shadcn-svelte CLI and renderer-isolated consumer gate, covering
  development/production endpoints and browser dependency boundaries.
- Implement Takumi repeated headers, stacked repeated bands, multiple authored
  sections with shared geometry, and measured keep-with-next/minimum space.
  Reject clipping, oversized explicit widths, off-page absolute positioning,
  conflicting geometry and invalid images before rendering.
- Wrap long unbroken Takumi text instead of losing characters; reject unsafe
  no-wrap overrides and rows too tall to fit on a physical page.
- Expose `PrintableForm` and `PrintableSignature`; older names are deprecated.
  Unsupported Forme layout/image options now fail with supported alternatives.
- Preserve every report metric and caller chart value. Remove inferred risk
  counts, checked highlights and average totals; use caller-authored `facts`,
  `tableFooter`, `chartTitle` and `chartSubtitle` instead.
- Add physical-page image previews from actual PDFs, including a forty-line
  invoice, and layout assertions for defects text-only tests missed.

### Migration

- Render Forme components with `renderDocument` from `pdfcn-svelte/bases/forme/server`. The checked adapter rejects content-loss diagnostics and overflowing atomic groups before returning PDF bytes.

- Forme fixed content must be declared before body content inside the library’s `Page`. Late headers, footers and page numbers now throw instead of disappearing from earlier pages.

- Import Takumi's `renderDocument` and `renderTakumiDocument` from
  `pdfcn-svelte/bases/takumi/server`. They are no longer exported by the
  browser-facing `pdfcn-svelte/bases/takumi` entry.
- Invoice data accepts optional `currency`, `locale`, and `taxLabel` fields.
  Defaults are `USD`, `en-US`, and `Tax`. Callers supply calculated totals.
- Report data accepts optional `status: { label, tone? }`. An omitted status
  displays a neutral label, and charts use the caller's `series` data.

### Fixed

- Long invoices preserve rows, wrapped descriptions, totals, and physical page
  numbering in both renderers. Takumi invoices use native flowing pagination
  and repeated footers.
- Removed fixed tax percentages and sample conclusions from caller-data paths.
- Direct theme URLs, embedded template PDFs, and download links stay aligned.
- Browser Takumi imports exclude server-only dependencies and renderer WASM.
- Takumi chart previews display one label layer while PDF output retains its
  positioned text. Heading pagination is measured for Takumi; Forme rejects unsupported sibling options and provides KeepTogether as the alternative.
- Narrow layouts fit the viewport, invoice descriptions have more column space,
  and homepage previews show actual generated documents.

### Documentation and developer experience

- Added complete examples, generated PDFs, source-derived props and defaults,
  and renderer notes for all 24 component families.
- Added 70 executable component and template examples, complete first-PDF
  endpoints, and separate package and copied-source installation instructions.
- Template pages include typed custom-data examples and direct component links.
- Copy controls report success or failure; filters and renderer controls expose
  selected states and keyboard focus.
- Added long-document regressions, reference drift checks, and fresh-consumer
  checks for displayed examples, production endpoints, copied-source imports,
  and browser/server separation.

This update does not publish a new package version. See the
[README](./README.md#01-migration-and-renderer-limits) for migration details and
known renderer limitations.
