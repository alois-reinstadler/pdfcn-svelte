<script lang="ts">
	import DocPage from '../../docs/components/DocPage.svelte';
	import { components, templates } from '../../docs/catalog';
</script>

<svelte:head><title>Documentation — pdfcn / svelte</title></svelte:head>

<DocPage title="Build documents like interfaces." description="pdfcn-svelte is a Svelte 5 component library for invoices, reports, statements, and other structured documents. Compose a themed document tree, then choose the renderer base that matches your output pipeline.">
	<h2>What is included</h2>
	<div class="stat-grid">
		<div><strong>{components.length}</strong><span>Component families in each base</span></div>
		<div><strong>{templates.length}</strong><span>Complete document templates</span></div>
		<div><strong>9</strong><span>Semantic theme presets</span></div>
		<div><strong>2</strong><span>Renderer-specific namespaces</span></div>
	</div>

	<h2>Pick a path</h2>
	<div class="path-grid">
		<a href="/docs/getting-started"><span>01</span><strong>Build your first document</strong><p>Choose a base, add a provider, and compose a page.</p><b>Read the guide →</b></a>
		<a href="/templates"><span>02</span><strong>Start from a template</strong><p>Explore invoices and reports designed to adapt.</p><b>Browse templates →</b></a>
		<a href="/components"><span>03</span><strong>Explore the vocabulary</strong><p>See all 24 reusable component families.</p><b>View components →</b></a>
	</div>

	<h2>How it fits together</h2>
	<div class="flow" aria-label="Theme and data flow through components into a renderer and an output">
		<div><small>INPUT</small><strong>Theme + data</strong></div><span>→</span>
		<div><small>COMPOSE</small><strong>Svelte components</strong></div><span>→</span>
		<div><small>BASE</small><strong>Forme or Takumi</strong></div><span>→</span>
		<div><small>OUTPUT</small><strong>PDF or document tree</strong></div>
	</div>

	<p>The two bases expose closely matched component APIs, but their underlying primitives are not interchangeable. Choose one base for a document tree and import its components together.</p>
</DocPage>

<style>
	.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
	.stat-grid div { display: grid; padding: 1.2rem; gap: 0.2rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.stat-grid strong { color: var(--green-dark); font-family: var(--font-display); font-size: 2rem; letter-spacing: -0.06em; }
	.stat-grid span { color: var(--muted); font-size: 0.68rem; }
	.path-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
	.path-grid a { display: flex; min-height: 11rem; padding: 1rem; flex-direction: column; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); color: var(--ink); text-decoration: none; }
	.path-grid span { color: var(--green); font-family: var(--font-mono); font-size: 0.57rem; }
	.path-grid strong { margin-top: 1.2rem; font-size: 0.82rem; }
	.path-grid p { margin: 0.4rem 0 1rem; color: var(--muted); font-size: 0.67rem; line-height: 1.5; }
	.path-grid b { margin-top: auto; color: var(--green-dark); font-size: 0.62rem; }
	.flow { display: grid; padding: 1rem; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; gap: 0.55rem; border: 1px solid var(--line); border-radius: 0.6rem; background: var(--paper); }
	.flow div { display: grid; gap: 0.25rem; }
	.flow small { color: var(--faint); font-family: var(--font-mono); font-size: 0.49rem; letter-spacing: 0.08em; }
	.flow strong { font-size: 0.66rem; }
	.flow > span { color: var(--green); }
	@media (max-width: 620px) { .path-grid { grid-template-columns: 1fr; }.path-grid a { min-height: 8rem; }.flow { grid-template-columns: 1fr; }.flow > span { transform: rotate(90deg); justify-self: center; } }
</style>
