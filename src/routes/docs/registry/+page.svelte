<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';

	const commands = [
		'pnpm run registry:build',
		'pnpm run dev -- --host 127.0.0.1',
		'',
		'# In a configured Svelte project:',
		'pnpm dlx shadcn-svelte@latest add http://127.0.0.1:5173/r/forme/table.json'
	].join('\n');
</script>

<svelte:head><title>Registry — pdfcn / svelte</title></svelte:head>

<DocPage title="Own the component source" description="The source registry is the shadcn-style distribution path: choose a renderer and item, resolve its dependencies, and copy readable Svelte files into your application.">
	<h2>Why use the registry?</h2>
	<div class="reasons"><div><span>01</span><strong>Local ownership</strong><p>Edit layout behavior without waiting on a package release.</p></div><div><span>02</span><strong>Resolved dependencies</strong><p>Components bring the renderer primitives and shared theme files they use.</p></div><div><span>03</span><strong>Explicit base</strong><p>The URL makes Forme or Takumi an intentional installation choice.</p></div></div>

	<h2>Build and install locally</h2>
	<CodeBlock code={commands} label="terminal" />
	<p>Your consuming project must already have a valid shadcn-svelte <code>components.json</code>. Change <code>forme</code> to <code>takumi</code>, and change the last path segment to the item slug you need.</p>
	<Callout title="No hosted registry is assumed"><p>The checked-in manifest and generated files can be served by this project locally. These docs do not promise that the example URL is publicly hosted.</p></Callout>

	<h2>Installable item types</h2>
	<ul><li>24 component families for each renderer base</li><li>10 complete templates for each renderer base</li><li>9 renderer-neutral theme presets</li><li>Required context, types, utilities, and low-level primitives</li></ul>

	<h2>After installation</h2>
	<p>Registry-installed files are source in your project, so import them from the paths created under your own <code>$lib</code> tree. They are not package imports. Review the generated files and commit them like application code.</p>
</DocPage>

<style>
	.reasons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
	.reasons div { padding: 1rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.reasons span { color: var(--green); font-family: var(--font-mono); font-size: 0.55rem; }
	.reasons strong { display: block; margin-top: 1rem; font-size: 0.75rem; }
	.reasons p { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.66rem; line-height: 1.5; }
	@media (max-width: 580px) { .reasons { grid-template-columns: 1fr; } }
</style>
