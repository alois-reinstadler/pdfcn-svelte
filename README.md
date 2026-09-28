# pdfcn-svelte

PDF-oriented components and document blocks for Svelte 5, ported from
[shadcn-labs/pdfcn](https://github.com/shadcn-labs/pdfcn) and adapted to
shadcn-svelte conventions.

The project supports two bases with the same themed component vocabulary:

| Base | Output in this repository | Use it when |
| --- | --- | --- |
| Forme | A Forme document tree that `@formepdf/svelte` can render to PDF bytes | You need server-side or local PDF generation |
| Takumi | An HTML/CSS-compatible Svelte tree rendered to PDF by `takumi-pdf` | You want live browser previews and an HTML-to-paged-PDF pipeline |

The Takumi base includes a server/build-time adapter that SSRs the Svelte tree
to HTML and passes it to the official `takumi-pdf` renderer.

[Documentation](https://alois-reinstadler.github.io/pdfcn-svelte/docs/getting-started)
· [Component reference](https://alois-reinstadler.github.io/pdfcn-svelte/components)
· [Changelog](./CHANGELOG.md)

## Requirements

Consumer workflows below are verified with Node `24.20.0` and pnpm `11.23.0`.

- Svelte `^5.30.0`
- `@formepdf/svelte` and `@formepdf/core` `^0.25.0` when using the Forme base
- `takumi-pdf` `^0.11.3` and `@takumi-rs/helpers` `^2.12.0` when rendering with Takumi
- A Svelte project configured for TypeScript and Svelte 5 snippets/runes

This repository is currently consumable as a local/workspace package or as
shadcn-style copied source. The generated registry is published with the docs
at `https://alois-reinstadler.github.io/pdfcn-svelte/r`.

## Package-style usage

Build the package from this checkout:

```sh
pnpm install
pnpm run package
pnpm pack
```

Install the generated tarball (or link the workspace) in a Svelte 5 project.
For Forme PDF rendering, install its renderer as well:

```sh
pnpm add @formepdf/svelte@^0.25.0 @formepdf/core@^0.25.0
# or, for Takumi
pnpm add takumi-pdf@^0.11.3 @takumi-rs/helpers@^2.12.0
```

Install the tarball in your consuming application (replace this absolute path):

```sh
pnpm add /absolute/path/to/pdfcn-svelte-0.1.0.tgz
```

For a pnpm workspace, use `"pdfcn-svelte": "workspace:*"` in the consuming
app and run `pnpm install` at the workspace root. Build the library first.
Only install the renderer dependencies for the base you choose.

### First PDF: Forme

In a TypeScript SvelteKit application with a server-capable adapter, save this
complete file as `src/lib/Example.svelte`. It uses built-in Helvetica, so no
font download is required.

```svelte
<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { professionalTheme } from 'pdfcn-svelte/themes';
	import { Document, Page, Text } from 'pdfcn-svelte/bases/forme';
	// Built-in Helvetica avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'Helvetica' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'Helvetica'
			}
		}
	};
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Text example">
		<Page size="A4" margin={48}>
			<Text variant="lg" weight="semibold">Payment received</Text><Text
				color="mutedForeground"
				italic>Your receipt is attached.</Text
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
```

Save `src/routes/example.pdf/+server.ts`:

```ts
import { renderDocument } from 'pdfcn-svelte/bases/forme/server';
import Example from '$lib/Example.svelte';

export async function GET() {
  const pdf = await renderDocument(Example);
  return new Response(new Uint8Array(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="example.pdf"'
    }
  });
}
```

Run your application's `pnpm dev` and open `/example.pdf` on its own origin.
A static-only deployment cannot execute this endpoint. For Takumi, use the
complete [Takumi example](./examples/takumi-document.svelte) and import the
renderer from `pdfcn-svelte/bases/takumi/server`; its component-only entry
is `pdfcn-svelte/bases/takumi`. The [Getting started guide](https://alois-reinstadler.github.io/pdfcn-svelte/docs/getting-started)
contains separate complete files for both choices.

## Fonts

Theme presets specify font-family names, but PDF renderers must be given the
matching font resources. Register Forme fonts with `Font.register()` from
`@formepdf/svelte`; pass Takumi fonts through `renderDocument` options (for
example, `fonts` from `googleFonts()` plus an explicit `fontFamilies` fallback
chain). The docs include complete examples for both renderers.

See [examples/forme-document.svelte](./examples/forme-document.svelte) and
[examples/takumi-document.svelte](./examples/takumi-document.svelte) for
complete component examples.

### Render a Forme template

A Forme template is an ordinary Svelte component. Pass that component to the
official renderer from a SvelteKit endpoint:

```ts
// src/routes/document.pdf/+server.ts
import { renderDocument } from 'pdfcn-svelte/bases/forme/server';
import FormeDocument from '$lib/FormeDocument.svelte';

export async function GET() {
	const pdf = await renderDocument(FormeDocument, {
		props: { customer: 'Ada Lovelace' }
	});

	return new Response(new Uint8Array(pdf), {
		headers: { 'content-type': 'application/pdf' }
	});
}
```

`@formepdf/core` is needed when producing PDF bytes. The Forme adapter can
serialize templates without it.

### Render a Takumi template

The Takumi example can be mounted like any other Svelte component or rendered
with Svelte's server APIs for a live HTML preview. To create PDF bytes, use the
base-local server adapter:

```ts
import { renderDocument } from 'pdfcn-svelte/bases/takumi/server';
import TakumiDocument from '$lib/TakumiDocument.svelte';

const pdf = await renderDocument(TakumiDocument, {
	props: { project: 'Apollo' }
});
```

The adapter lazily imports `svelte/server` and `takumi-pdf`, so ordinary
browser imports of Takumi components do not eagerly load the PDF renderer.

## shadcn-style source registry

The registry workflow copies readable Svelte source into a consumer project,
including the chosen base's primitives, theme context, types, and component
dependencies. It is separate from installing the package and is the best fit
when you want to own and edit the generated files.

In a TypeScript SvelteKit application with the standard `$lib` → `src/lib`
alias, follow the [shadcn-svelte prerequisites](https://www.shadcn-svelte.com/docs/installation/sveltekit)
and initialize `components.json` once:

```sh
pnpm dlx shadcn-svelte@1.7.0 init --preset b0
```

The verified CLI is `1.7.0`; `--preset b0` selects its default design system. Complete its prompts, select `src/routes/layout.css`, and accept CSS changes. The [registry guide](https://alois-reinstadler.github.io/pdfcn-svelte/docs/registry) includes the exact SvelteKit, Tailwind and Node-adapter scaffold command.

The CLI setup uses Tailwind configuration; PDF layouts themselves do not
require Tailwind. Existing shadcn projects can keep their configuration.
Then install directly from the GitHub Pages registry:

```sh
pnpm dlx shadcn-svelte@1.7.0 add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/alert.json
pnpm dlx shadcn-svelte@1.7.0 add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/invoice-modern.json
```

Replace `forme` with `takumi` to copy that base. Theme presets are registry
items too:

```sh
pnpm dlx shadcn-svelte@1.7.0 add https://alois-reinstadler.github.io/pdfcn-svelte/r/takumi/theme-modern.json
```

To inspect registry changes locally before pushing:

```sh
pnpm install
pnpm run registry:build
pnpm run docs:build
```

Registry-installed files are local source, so import them through the paths
created in your project instead of through the `pdfcn-svelte` package:

```ts
import Alert from '$lib/bases/forme/components/alert/alert.svelte';
// Takumi copied-source server renderer:
// import { renderDocument } from '$lib/bases/takumi/server';
import { modernTheme } from '$lib/themes/modern';
```

The generated manifest is `registry.json`; individual installable items are
written to `public/r/<base>/<item>.json`. Do not use a Forme and Takumi
component with the same role interchangeably inside one document tree—their
underlying primitives have different output semantics.

## Themes

`PdfcnThemeProvider` supplies a static theme through Svelte context. Without a
provider, components use `professionalTheme`. The included presets are:

- `blueprintTheme`
- `corporateTheme`
- `elegantTheme`
- `executiveTheme`
- `forestTheme`
- `minimalTheme`
- `modernTheme`
- `professionalTheme`
- `vividTheme`

```svelte
<script lang="ts">
	import { PdfcnThemeProvider } from 'pdfcn-svelte';
	import { forestTheme } from 'pdfcn-svelte/themes';
</script>

<PdfcnThemeProvider theme={forestTheme}>
	<!-- One renderer's document tree goes here. -->
</PdfcnThemeProvider>
```

The provider captures its theme during component initialization. If an
application must switch presets at runtime, recreate the provider subtree.

## Inventory

Both bases currently include these 24 component families:

- Alert, Badge, Card, Data Table, Divider, Printable Form, Graph
- Heading, Keep Together, Key Value, Link, List
- Page Break, Page Footer, Page Header, Page Number, PDF Image
- QR Code, Section, Printable Signature, Stack, Table, Text, Watermark

Both bases include Classic, Consultant, Corporate, Creative, Minimal, and
Modern invoice blocks, plus Financial, Marketing, Operations, and Security
report blocks.

The port is audited against `shadcn-labs/pdfcn` commit
`e7543753c872a173bb6e063819df52f8f83f7402`: 24/24 component families,
10/10 blocks, and 9/9 theme presets are present in both bases. The public APIs
use Svelte 5 props, snippets, and context rather than React conventions. Tests
cover inventory, package/API contracts, real PDF rendering, and exact document
page counts; they do not claim pixel-golden identity for every prop combination
or automatic parity with future upstream changes.

## Development

```sh
pnpm run check           # Svelte and TypeScript diagnostics
pnpm run package         # build the distributable library into dist/
pnpm run build           # build the docs site, then package the library
pnpm run registry:build  # regenerate registry.json and public/r/
pnpm run test:primitives # focused primitive and theme contracts
pnpm run test:components # render all 24 component families in both bases
pnpm run test:render     # real Forme and Takumi PDF smoke tests
pnpm run test:documents  # render all 20 renderer/template combinations
pnpm run test:release    # long invoices, page labels, formatting and report data
pnpm run test:consumer   # pack/install into a fresh Svelte 5 consumer
pnpm run docs:api        # regenerate the source-derived component reference
pnpm run test:docs-examples # check reference drift and render all 70 shown examples
pnpm run docs:build      # generate preview PDFs and prerender the docs site
pnpm run docs:check      # crawl the built docs and verify every showcase route
pnpm run validate:api    # package and type-check the public export surface
pnpm run validate:pack   # inspect the package tarball contents
pnpm run validate        # run the complete test, docs, and package gate
pnpm run dev             # run the local Vite development server
pnpm run preview         # preview a completed Vite build
```

The docs site includes an exact 24-component catalog and browser-native PDFs for
all ten document templates across both renderers and all nine themes. It also
includes renderer, theme, and font guides plus recipes for statements, proposals,
audit packs, certificates, product briefs, and inspection reports.

Component and template usage examples share their source with the generated
PDFs. Validation renders all 70 example files, typechecks their displayed package
imports in a fresh consumer, and executes the documented first-PDF endpoints
and representative copied-source invoices after production builds. Browser
consumer checks ensure Takumi components do not pull in server renderer assets.

When changing a shared component, keep the Forme and Takumi variants aligned
where their renderer semantics allow it, then run `pnpm run validate`.
Regenerate the registry after changing any source copied by registry items.

## 0.1 migration and renderer limits

Import Takumi's `renderDocument` / `renderTakumiDocument` from
`pdfcn-svelte/bases/takumi/server`; these functions are no longer exported by
`pdfcn-svelte/bases/takumi`. The component entry point is safe for browser builds.
Forme rendering remains server-only. Import its checked `renderDocument` from
`pdfcn-svelte/bases/forme/server` instead of `@formepdf/svelte`. This uses Forme
0.25 content/layout diagnostics and rejects overflow or oversized atomic groups
before returning PDF bytes.

Invoice data accepts `currency` (default `USD`), `locale` (default `en-US`, matching
samples), and `taxLabel` (default `Tax`). These format supplied amounts; callers
remain responsible for calculations. Report data accepts `status: { label, tone? }`.
Omitting it displays a neutral status; charts use the supplied `series`.

Takumi flowing documents support multiple authored sections with shared paper
size and margins. Each section starts a physical page. Repeated header/footer
bands are document-wide: declare them once, with sufficient top/bottom margin.
With Forme, declare fixed headers, footers and page numbers before all body content inside the library’s `Page`; late declarations throw because the engine otherwise omits them from earlier pages.

Use `PageHeader fixed` / `PageFooter fixed`; multiple bands stack and identical
bands are deduplicated. Mixed geometry, clipping viewports and overflowing
fixed-size pages raise actionable errors. Set geometry on Page; conflicting server size/margin options are rejected. Render mixed paper sizes separately.
See [Physical pages](https://alois-reinstadler.github.io/pdfcn-svelte/docs/pagination)
for a forty-row invoice with real continuation pages and final totals.

Takumi implements `Heading keepWithNext` and `KeepTogether minPresenceAhead`
through measured sibling grouping. Forme cannot implement those sibling
measurements and now rejects them. Replace Forme `keepWithNext=true` and
`minPresenceAhead` with a `KeepTogether` containing the heading and the following
short content. The group must fit on one page.

Forme 0.25 fixes the percentage table-width bug that inflated row heights. Numeric widths remain points. Keep the same column widths in every
row.

Use `PrintableForm` and `PrintableSignature` for handwritten completion.
`Form` / `PdfForm` and `Signature` / `PdfSignatureBlock` remain deprecated aliases.
These components expose printable decoration, without interactive PDF fields or
cryptographic signing.

Image `src` is a string. Resolve authenticated requests before rendering with
`await loadImage({ uri, headers, method, body })`, exported by either base, and
pass its PNG/JPEG data URI as `src`. For local files, pass `imageDataUri(await readFile(path))`; `readFile` comes from `node:fs/promises` in your server code. Forme requires resolved image data so failed file/URL loads cannot disappear silently. Invalid options and failed requests raise
errors. Forme supports `fit="fill"`; use one dimension for natural proportions,
or preprocess images for crop/contain behavior. Forme rejects unsupported fit
and position options. Its watermark supports centered repeated text only.

Reports preserve every supplied summary metric and chart series. Supply optional
`tableFooter` and `facts` for aggregates and conclusions, and `chartTitle` /
`chartSubtitle` for chart copy. The library no longer infers average progress,
open risks or completed work from labels. Progress values must be finite
percentages from 0 through 100. Invoice totals remain caller-owned; non-finite
amounts fail rather than printing `NaN` or infinity.

## License

[MIT](./LICENSE), matching the upstream project.
