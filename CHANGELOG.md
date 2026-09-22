# Changelog

## Unreleased

### Migration

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
  positioned text. The unsupported heading pagination option no longer crashes
  PDF rendering; its limitation is documented.
- Narrow layouts fit the viewport, invoice descriptions have more column space,
  and homepage previews show actual generated documents.

### Documentation and developer experience

- Added complete examples, generated PDFs, source-derived props and defaults,
  and renderer notes for all 24 component families.
- Added 68 executable component and template examples, complete first-PDF
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
