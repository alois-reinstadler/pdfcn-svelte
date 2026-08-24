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

## Requirements

- Svelte `^5.30.0`
- `@formepdf/svelte` and `@formepdf/core` `^0.11.1` when using the Forme base
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
pnpm add @formepdf/svelte @formepdf/core
# or, for Takumi
pnpm add takumi-pdf @takumi-rs/helpers
```

Imports are split deliberately:

```ts
import { PdfcnThemeProvider } from 'pdfcn-svelte';
import { modernTheme } from 'pdfcn-svelte/themes';

// Choose one renderer base for a document tree.
import { Document, Page, Heading, Text } from 'pdfcn-svelte/bases/forme';
// import { Document, Page, Heading, Text } from 'pdfcn-svelte/bases/takumi';
```

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
import { renderDocument } from '@formepdf/svelte';
import FormeDocument from '$lib/FormeDocument.svelte';

export async function GET() {
	const pdf = await renderDocument(FormeDocument, {
		props: { customer: 'Ada Lovelace' }
	});

	return new Response(pdf, {
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
import { renderDocument } from 'pdfcn-svelte/bases/takumi';
import TakumiDocument from '$lib/TakumiDocument.svelte';

const pdf = await renderDocument(TakumiDocument, {
	props: { project: 'Apollo' },
	size: 'a4',
	margin: 0
});
```

The adapter lazily imports `svelte/server` and `takumi-pdf`, so ordinary
browser imports of Takumi components do not eagerly load the PDF renderer.

## shadcn-style source registry

The registry workflow copies readable Svelte source into a consumer project,
including the chosen base's primitives, theme context, types, and component
dependencies. It is separate from installing the package and is the best fit
when you want to own and edit the generated files.

Install directly from the GitHub Pages registry:

```sh
pnpm dlx shadcn-svelte@latest add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/alert.json
pnpm dlx shadcn-svelte@latest add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/invoice-modern.json
```

Replace `forme` with `takumi` to copy that base. Theme presets are registry
items too:

```sh
pnpm dlx shadcn-svelte@latest add https://alois-reinstadler.github.io/pdfcn-svelte/r/takumi/theme-modern.json
```

To inspect registry changes locally before pushing:

```sh
pnpm install
pnpm run registry:build
pnpm run dev -- --host 127.0.0.1
```

Registry-installed files are local source, so import them through the paths
created in your project instead of through the `pdfcn-svelte` package:

```ts
import Alert from '$lib/bases/forme/components/alert/alert.svelte';
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

- Alert, Badge, Card, Data Table, Divider, Form, Graph
- Heading, Keep Together, Key Value, Link, List
- Page Break, Page Footer, Page Header, Page Number, PDF Image
- QR Code, Section, Signature, Stack, Table, Text, Watermark

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
pnpm run test:consumer   # pack/install into a fresh Svelte 5 consumer
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

When changing a shared component, keep the Forme and Takumi variants aligned
where their renderer semantics allow it, then run `pnpm run validate`.
Regenerate the registry after changing any source copied by registry items.

## License

[MIT](./LICENSE), matching the upstream project.
