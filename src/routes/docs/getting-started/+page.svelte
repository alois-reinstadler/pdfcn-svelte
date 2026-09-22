<script lang="ts">
 import { base } from '$app/paths';
 import CodeBlock from '../../../docs/components/CodeBlock.svelte';
 import DocPage from '../../../docs/components/DocPage.svelte';
 import { exampleSources, packageSource } from '../../../docs/component-examples';
 import formeEndpoint from '../../../docs/examples/forme-endpoint.ts.txt?raw';
 import takumiEndpoint from '../../../docs/examples/takumi-endpoint.ts.txt?raw';
 let renderer = $state<'forme' | 'takumi'>('forme');
 const source = $derived(packageSource(exampleSources[`./examples/${renderer}/text.svelte`]));
</script>
<svelte:head><title>Getting started — pdfcn / svelte</title></svelte:head>
<DocPage title="Your first PDF" description="Create a complete Svelte document and serve it from a SvelteKit endpoint. Choose one renderer and follow its copyable path.">
 <h2>1. Prerequisites and installation</h2>
 <p>Start with a TypeScript SvelteKit app using Svelte 5.30 or newer and a server-capable adapter. A static-only deployment cannot execute this endpoint. The package is currently a preview release: first build and install its local tarball using <a href={`${base}/docs/install`}>Installation</a>. Copied source has a separate <a href={`${base}/docs/registry`}>registry guide</a>.</p>
 <div class="renderer-switch" aria-label="Renderer choice"><button type="button" aria-pressed={renderer === 'forme'} onclick={() => renderer = 'forme'}>Forme</button><button type="button" aria-pressed={renderer === 'takumi'} onclick={() => renderer = 'takumi'}>Takumi</button></div>
 <CodeBlock label="In your consuming application" code={renderer === 'forme' ? 'pnpm add @formepdf/svelte @formepdf/core' : 'pnpm add takumi-pdf @takumi-rs/helpers'} />
 <p>Forme produces native PDF document instructions. Takumi also supports an HTML preview, with PDF rendering isolated in its server entry. Install only the dependencies for your chosen renderer.</p>
 <h2>2. Save the entire document file</h2>
 <CodeBlock label="src/lib/Example.svelte" code={source} />
 <p>This example explicitly uses {renderer === 'forme' ? 'Forme’s built-in Helvetica' : 'Takumi’s bundled sans-serif fallback'} and requires no font downloads. Named theme fonts need matching resources; see <a href={`${base}/docs/fonts`}>Font registration</a>. Components outside a provider use the Professional theme. Create a fresh document to change theme context.</p>
 <h2>3. Add the server endpoint</h2>
 <CodeBlock label="src/routes/example.pdf/+server.ts" code={renderer === 'forme' ? formeEndpoint : takumiEndpoint} />
 <p>Run your application with <code>pnpm dev</code> and open <code>/example.pdf</code> on its own origin. The response is a PDF named <code>example.pdf</code>. Keep renderer imports inside server routes or build scripts; browser component imports use <code>pdfcn-svelte/bases/takumi</code>.</p>
 <h2>4. Replace the example</h2>
 <p><a href={`${base}/components/data-table`}>Build a typed data table</a>, <a href={`${base}/templates/invoice-modern`}>customize an invoice</a>, or <a href={`${base}/docs/renderers`}>learn page and footer behavior</a>. Each component page includes a complete file and a PDF produced from that file.</p>
</DocPage>
<style>.renderer-switch { display: flex; gap: .5rem; } button { padding: .6rem 1rem; background: var(--paper); border: 1px solid var(--line); border-radius: .4rem; cursor: pointer; } button[aria-pressed='true'] { background: var(--green); color: white; } button:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }</style>
