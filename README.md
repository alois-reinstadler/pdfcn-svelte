# pdfcn-svelte

PDF-oriented components and document blocks for Svelte 5, ported from
[shadcn-labs/pdfcn](https://github.com/shadcn-labs/pdfcn) and adapted to
shadcn-svelte conventions.

The project supports two bases with the same themed component vocabulary:

| Base | Output in this repository | Use it when |
| --- | --- | --- |
| Forme | A Forme document tree that `@formepdf/svelte` can render to PDF bytes | You need server-side or local PDF generation |
| Takumi | An HTML/CSS-compatible Svelte document tree | You need the Takumi-style primitives in a browser or another compatible pipeline |

The Takumi base does **not** expose a Takumi binary renderer. Rendering its
component tree to PDF requires an integration outside this package.

## Requirements

- Svelte `^5.30.0`
- `@formepdf/svelte` and `@formepdf/core` `^0.11.1` when using the Forme base
- A Svelte project configured for TypeScript and Svelte 5 snippets/runes

This repository is currently consumable as a local/workspace package or as
shadcn-style copied source. No published npm release or hosted registry is
assumed by this documentation.

## Package-style usage

Build the package from this checkout:

```sh
npm install
npm run package
npm pack
```

Install the generated tarball (or link the workspace) in a Svelte 5 project.
For Forme PDF rendering, install its renderer as well:

```sh
npm install @formepdf/svelte @formepdf/core
```

Imports are split deliberately:

```ts
import { PdfcnThemeProvider } from 'pdfcn-svelte';
import { modernTheme } from 'pdfcn-svelte/themes';

// Choose one renderer base for a document tree.
import { Document, Page, Heading, Text } from 'pdfcn-svelte/bases/forme';
// import { Document, Page, Heading, Text } from 'pdfcn-svelte/bases/takumi';
```

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

### Render the Takumi component tree

The Takumi example can be mounted like any other Svelte component or rendered
with Svelte's server APIs. It produces document/page containers and CSS from
the PDF-style point-based values. This is useful for previewing or handing the
tree to a compatible integration; it is not, by itself, a PDF-byte API.

## shadcn-style source registry

The registry workflow copies readable Svelte source into a consumer project,
including the chosen base's primitives, theme context, types, and component
dependencies. It is separate from installing the package and is the best fit
when you want to own and edit the generated files.

Build and serve the registry locally from this checkout:

```sh
npm install
npm run registry:build
npm run dev -- --host 127.0.0.1
```

Then, from a Svelte project that has a valid `components.json`, add an item by
its local registry URL:

```sh
npx shadcn-svelte@latest add http://127.0.0.1:5173/r/forme/alert.json
npx shadcn-svelte@latest add http://127.0.0.1:5173/r/forme/invoice-modern.json
```

Replace `forme` with `takumi` to copy that base. Theme presets are registry
items too:

```sh
npx shadcn-svelte@latest add http://127.0.0.1:5173/r/takumi/theme-modern.json
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

The repository's checked-in component and block inventory is the parity
contract for this port. The public APIs use Svelte 5 props, snippets, and
context rather than React conventions, and the project does not claim
automatic parity with future upstream pdfcn changes.

## Development

```sh
npm run check          # Svelte and TypeScript diagnostics
npm run package        # build the distributable library into dist/
npm run build          # Vite build followed by library packaging
npm run registry:build # regenerate registry.json and public/r/
npm run validate:api   # package and type-check the public export surface
npm run validate:pack  # inspect the files that an npm tarball would contain
npm run validate       # run checks plus both package validations
npm run dev            # run the local Vite development server
npm run preview        # preview a completed Vite build
```

When changing a shared component, keep the Forme and Takumi variants aligned
where their renderer semantics allow it, then run `npm run validate`.
Regenerate the registry after changing any source copied by registry items.

## License

[MIT](./LICENSE), matching the upstream project.
