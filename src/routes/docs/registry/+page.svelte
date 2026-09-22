<script lang="ts">
	import { base } from '$app/paths';
 import copiedExample from '../../../docs/copied-invoice.svelte.txt?raw';
 import copiedEndpoint from '../../../docs/copied-endpoint.ts.txt?raw';
 import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';
	import { registryBaseUrl, registryInstallCommand } from '../../../docs/site';

	const commands = [
		registryInstallCommand('forme', 'table'),
		registryInstallCommand('takumi', 'invoice-modern')
	].join('\n');
</script>

<svelte:head><title>Registry — pdfcn / svelte</title></svelte:head>

<DocPage title="Own the component source" description="The source registry is the shadcn-style distribution path: choose a renderer and item, resolve its dependencies, and copy readable Svelte files into your application.">
	<h2>Why use the registry?</h2>
	<div class="reasons"><div><span>01</span><strong>Local ownership</strong><p>Edit layout behavior without waiting on a package release.</p></div><div><span>02</span><strong>Resolved dependencies</strong><p>Components bring the renderer primitives and shared theme files they use.</p></div><div><span>03</span><strong>Explicit base</strong><p>The URL makes Forme or Takumi an intentional installation choice.</p></div></div>

	<h2>1. Initialize the consuming application</h2>
 <p>Start with a TypeScript SvelteKit project whose <code>$lib</code> alias points to <code>src/lib</code>. The shadcn-svelte CLI expects its normal project configuration; follow the <a href="https://www.shadcn-svelte.com/docs/installation/sveltekit">official SvelteKit prerequisites</a>, including Tailwind for CLI initialization. pdfcn document layouts themselves do not rely on Tailwind.</p>
 <CodeBlock label="In your consuming application" code="pnpm dlx shadcn-svelte@latest init" />
 <p>Review the generated <code>components.json</code>. The <a href="https://shadcn-svelte.com/docs/components-json">official components.json reference</a> describes its paths. Existing shadcn projects can keep their configuration.</p>
 <h2>2. Install from the hosted registry</h2>
	<CodeBlock code={commands} label="terminal" />
	<p>Your consuming project must already have a valid shadcn-svelte <code>components.json</code>. Change <code>forme</code> to <code>takumi</code>, and change the last path segment to the item slug you need.</p>
	<Callout title="Hosted on GitHub Pages"><p>Every command resolves generated JSON from <code>{registryBaseUrl}</code>. The deployment workflow republishes the docs and registry from <code>main</code>.</p></Callout>

	<h2>Installable item types</h2>
	<ul><li>24 component families for each renderer base</li><li>10 complete templates for each renderer base</li><li>9 theme presets packaged for each renderer base</li><li>Required context, types, utilities, and low-level primitives</li></ul>

	<h2>3. Render copied source</h2>
	<p>Registry-installed files are source in your project, so import them from the paths created under your own <code>$lib</code> tree. They are not package imports. Review the generated files and commit them like application code.</p>
<p>For a concrete first document, install the Takumi modern invoice from the command above, then save these complete files:</p>
 <CodeBlock code={copiedExample} label="src/lib/Example.svelte" />
 <CodeBlock code={copiedEndpoint} label="src/routes/example.pdf/+server.ts" />
 <p>Run your application and open <code>/example.pdf</code>. The registry installs the renderer dependencies and all referenced source files under <code>src/lib</code>; root-relative targets deliberately preserve internal <code>$lib</code> imports. It does not install a top-level package barrel. To customize data, use the full <a href={`${base}/templates/invoice-modern`}>invoice example</a> and import its type from <code>$lib/bases/takumi/blocks/invoice-modern/invoice-modern.types</code>.</p>
 <p>Generated registry source graphs are compiled and rendered in a fresh consumer during validation. This checks local item contents and imports; it does not assert the hosted deployment already contains uncommitted changes or test every interactive CLI prompt.</p>
</DocPage>

<style>
	.reasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
	.reasons div { padding: 1rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.reasons span { color: var(--green); font-family: var(--font-mono); font-size: 0.55rem; }
	.reasons strong { display: block; margin-top: 1rem; font-size: 0.75rem; }
	.reasons p { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.66rem; line-height: 1.5; }
	@media (max-width: 580px) { .reasons { grid-template-columns: 1fr; } }
</style>
