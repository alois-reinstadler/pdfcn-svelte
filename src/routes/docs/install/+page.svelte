<script lang="ts">
 import { base } from '$app/paths';
 import CodeBlock from '../../../docs/components/CodeBlock.svelte';
 import DocPage from '../../../docs/components/DocPage.svelte';
</script>
<svelte:head><title>Installation — pdfcn / svelte</title></svelte:head>
<DocPage title="Installation" description="Choose a package for stable imports, or copied source when you want to edit the implementation.">
 <h2>Local tarball: the current release path</h2>
 <p>Until a package release is published, build this checkout. These commands run in the pdfcn-svelte repository:</p>
 <CodeBlock label="pdfcn-svelte checkout" code={'pnpm install\npnpm run package\npnpm pack'} />
 <p>Then run this in your consuming Svelte 5.30+ application. Replace the path with the tarball produced above:</p>
 <CodeBlock label="Consuming application" code={'pnpm add /absolute/path/to/pdfcn-svelte-0.1.0.tgz'} />
 <h2>Install one renderer</h2>
 <CodeBlock label="Forme only" code="pnpm add @formepdf/svelte @formepdf/core" />
 <CodeBlock label="Or Takumi only" code="pnpm add takumi-pdf @takumi-rs/helpers" />
 <p>Forme uses version 0.11.x of its adapters. Takumi uses takumi-pdf 0.11.x and helpers 2.12.x. The unused renderer is optional. A server-capable SvelteKit deployment is needed for on-demand PDF endpoints; a static site can serve PDFs generated at build time.</p>
 <h2>Workspace alternative</h2>
 <p>Place the built library in your pnpm workspace and add <code>"pdfcn-svelte": "workspace:*"</code> to the consuming application's dependencies, then run <code>pnpm install</code> at the workspace root. Build the library with <code>pnpm run package</code> before using its exports. Workspace imports are identical to tarball imports.</p>
 <h2>Package imports</h2>
 <CodeBlock label="imports.ts" code={"import { PdfcnThemeProvider } from 'pdfcn-svelte';\nimport { professionalTheme } from 'pdfcn-svelte/themes';\nimport { Document, Page, Text } from 'pdfcn-svelte/bases/forme';\n// Takumi components: pdfcn-svelte/bases/takumi\n// Takumi renderer (server only): pdfcn-svelte/bases/takumi/server"} />
 <p>Continue with <a href={`${base}/docs/getting-started`}>your first complete PDF</a>. A package installation does not require components.json, Tailwind, or the shadcn-svelte CLI.</p>
 <h2>Copied source alternative</h2>
 <p>Follow the <a href={`${base}/docs/registry`}>source registry guide</a> to initialize components.json, install an item, and import its actual local files. Do not substitute package imports into copied-source instructions.</p>
</DocPage>
