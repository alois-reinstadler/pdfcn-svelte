<script lang="ts">
	import Callout from '../../../docs/components/Callout.svelte';
	import DocPage from '../../../docs/components/DocPage.svelte';
	import { components, templates } from '../../../docs/catalog';
</script>

<svelte:head>
	<title>Upstream parity — pdfcn / svelte</title>
	<meta name="description" content="The tested pdfcn-to-Svelte component, template, theme, and primitive parity contract." />
</svelte:head>

<DocPage title="Parity, stated precisely." description="The port tracks shadcn-labs/pdfcn at commit e7543753. Its complete component vocabulary exists for both renderer bases, with deliberate Svelte and renderer adaptations documented here.">
	<div class="summary">
		<div><strong>24 / 24</strong><span>component families per base</span></div>
		<div><strong>10 / 10</strong><span>document blocks per base</span></div>
		<div><strong>9 / 9</strong><span>theme presets</span></div>
		<div><strong>2 / 2</strong><span>real PDF pipelines</span></div>
	</div>

	<Callout title="What parity means"><p>Inventory, theme values, public component names, variants, and practical document behavior match the pinned reference. It does not mean React syntax was copied literally or that every output has been pixel-compared against upstream.</p></Callout>

	<h2>Component inventory</h2>
	<div class="inventory">
		{#each components as component}
			<div><strong>{component.name}</strong><span>Forme</span><span>Takumi</span></div>
		{/each}
	</div>

	<h2>Complete document blocks</h2>
	<p>All six invoices and four reports are implemented in both bases. Every renderer/template pair is rendered by the document contract and checked for valid PDF bytes and exact page count.</p>
	<div class="blocks">{#each templates as template}<code>{template.slug}</code>{/each}</div>

	<h2>Intentional Svelte adaptations</h2>
	<ul>
		<li>Svelte 5 snippets replace ReactNode children and callback renderers.</li>
		<li>Svelte context replaces the React theme provider and memo helpers.</li>
		<li>Takumi components produce inspectable HTML/CSS, then the server adapter passes that tree to <code>takumi-pdf</code>.</li>
		<li>Renderer-specific registry themes avoid installing the wrong primitive closure.</li>
		<li>Image request options that the Forme Svelte renderer cannot represent must be resolved to a URL or data URI before rendering.</li>
	</ul>

	<h2>How it is tested</h2>
	<ul>
		<li>An exact directory contract rejects missing or extra component and block families.</li>
		<li>Kitchen-sink fixtures instantiate all 24 families in both renderers and produce real PDFs.</li>
		<li>All 20 renderer/template combinations are rendered with identifying-content and exact-page assertions.</li>
		<li>Public exports compile in a fresh packed Svelte consumer.</li>
		<li>Registry artifacts are regenerated deterministically and checked in CI.</li>
	</ul>

	<Callout title="Remaining confidence boundary"><p>The suite verifies structure, APIs, representative behavior, PDF validity, page counts, fonts, and package installation. It does not yet maintain pixel-golden screenshots for every prop and variant combination, so the claim is tested functional parity—not universal pixel identity.</p></Callout>
</DocPage>

<style>
	.summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; }
	.summary div { display: grid; padding: 1rem; gap: 0.2rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.summary strong { color: var(--green-dark); font-family: var(--font-display); font-size: 1.35rem; letter-spacing: -0.05em; }
	.summary span { color: var(--muted); font-size: 0.6rem; }
	.inventory { display: grid; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--line); }
	.inventory div { display: grid; padding: 0.7rem 0; grid-template-columns: 1fr auto auto; align-items: center; gap: 0.45rem; border-bottom: 1px solid var(--line); }
	.inventory div:nth-child(odd) { padding-right: 1rem; }
	.inventory div:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--line); }
	.inventory strong { font-size: 0.69rem; }
	.inventory span { padding: 0.2rem 0.38rem; border-radius: 999px; background: var(--green-wash); color: var(--green-dark); font-family: var(--font-mono); font-size: 0.47rem; text-transform: uppercase; }
	.blocks { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.blocks code { padding: 0.35rem 0.48rem; border: 1px solid var(--line); border-radius: 0.3rem; background: var(--paper); font-size: 0.58rem; }
	@media (max-width: 680px) { .summary { grid-template-columns: 1fr 1fr; }.inventory { grid-template-columns: 1fr; }.inventory div:nth-child(odd), .inventory div:nth-child(even) { padding: 0.7rem 0; border-left: 0; } }
</style>
