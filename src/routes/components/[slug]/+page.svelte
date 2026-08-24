<script lang="ts">
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const exportNames: Record<string, string> = {
		'pdf-image': 'PdfImage',
		qrcode: 'QRCode'
	};

	const categoryGuidance = {
		Content: 'Use it wherever the document needs a clear piece of readable or visual content.',
		Layout: 'Compose it with other layout components to establish spacing, grouping, and hierarchy.',
		Data: 'Feed it structured application data and let the active theme handle its presentation.',
		Document: 'Place it near the page or document boundary where pagination behavior is explicit.'
	} as const;

	const exportName = $derived(
		exportNames[data.component.slug] ?? data.component.name.replaceAll(' ', '')
	);
	const packageImport = $derived(
		`import { ${exportName} } from 'pdfcn-svelte/bases/forme';\nimport { ${exportName} as Takumi${exportName} } from 'pdfcn-svelte/bases/takumi';`
	);
	const formeRegistry = $derived(
		`pnpm dlx shadcn-svelte@latest add http://127.0.0.1:5173/r/forme/${data.component.slug}.json`
	);
	const takumiRegistry = $derived(
		`pnpm dlx shadcn-svelte@latest add http://127.0.0.1:5173/r/takumi/${data.component.slug}.json`
	);
</script>

<svelte:head>
	<title>{data.component.name} — pdfcn / svelte</title>
	<meta name="description" content={`${data.component.description} Available for the Forme and Takumi PDF renderer bases.`} />
</svelte:head>

<div class="page-shell">
	<nav aria-label="Breadcrumb">
		<a href="/components">Components</a><span>/</span><span>{data.component.name}</span>
	</nav>

	<header>
		<div class="title-wrap">
			<p>{data.component.category} component</p>
			<h1>{data.component.name}</h1>
			<div class="lede">{data.component.description}</div>
		</div>
		<div class="availability" aria-label="Renderer availability">
			<small>Available for</small>
			{#each data.component.renderers as renderer}
				<span><i></i>{renderer}</span>
			{/each}
		</div>
	</header>

	<section class="summary-grid" aria-label="Component overview">
		<div><small>01 / ROLE</small><h2>{data.component.category}</h2><p>{categoryGuidance[data.component.category]}</p></div>
		<div><small>02 / THEMING</small><h2>Token-aware</h2><p>It resolves the same pdfcn theme tokens in both renderer implementations.</p></div>
		<div><small>03 / DELIVERY</small><h2>Package or source</h2><p>Import the library API, or copy its readable Svelte source through the registry.</p></div>
	</section>

	<main>
		<section class="section-copy">
			<p class="kicker">Package API</p>
			<h2>One name, two renderer bases.</h2>
			<p>Choose one renderer for a document tree and import this component from that base. Forme creates Forme-native document instructions; Takumi creates inspectable HTML/CSS markup that the server adapter passes to <code>takumi-pdf</code>.</p>
			<CodeBlock code={packageImport} label="imports.ts" />
			<div class="note"><strong>Keep renderer trees separate.</strong><span>Components share an API vocabulary, but a Forme component should not be nested inside a Takumi document, or vice versa.</span></div>
		</section>

		<section class="install-section">
			<div class="section-copy">
				<p class="kicker">Source registry</p>
				<h2>Bring the component into your project.</h2>
				<p>The local shadcn-svelte registry resolves this item and its source dependencies. Run the registry-enabled docs server, then choose the renderer command that matches your document.</p>
			</div>
			<div class="commands">
				<div><span><b>F</b> Forme</span><CodeBlock code={formeRegistry} label="terminal" /></div>
				<div><span><b>T</b> Takumi</span><CodeBlock code={takumiRegistry} label="terminal" /></div>
			</div>
		</section>

		<section class="renderer-section">
			<p class="kicker">Renderer notes</p>
			<h2>Same document vocabulary. Different output trees.</h2>
			<div class="renderer-grid">
				<article><span class="renderer-mark">F</span><div><h3>Forme</h3><p>Use <code>@formepdf/svelte</code> and <code>@formepdf/core</code> to serialize the Svelte document tree and produce PDF bytes with native pagination semantics.</p><a href="/docs/renderers#forme">Forme details <span>→</span></a></div></article>
				<article><span class="renderer-mark takumi">T</span><div><h3>Takumi</h3><p>Use <code>renderTakumiDocument</code> on the server to SSR the component tree and render real PDF bytes through <code>takumi-pdf</code>.</p><a href="/docs/renderers#takumi">Takumi details <span>→</span></a></div></article>
			</div>
		</section>
	</main>

	<footer>
		<div><small>KEEP EXPLORING</small><h2>Build the rest of the document.</h2></div>
		<div class="footer-links"><a href="/components">All components <span>→</span></a><a href="/templates">Document templates <span>→</span></a></div>
	</footer>
</div>

<style>
	.page-shell { width: min(100% - 2rem, 76rem); margin: 0 auto; padding: 1.6rem 0 6rem; }
	nav { display: flex; align-items: center; gap: 0.55rem; color: var(--faint); font-family: var(--font-mono); font-size: 0.59rem; letter-spacing: 0.04em; }
	nav a { color: var(--green-dark); font-weight: 700; text-decoration: none; }
	header { display: grid; padding: clamp(4rem, 9vw, 7.5rem) 0 3.5rem; align-items: end; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; }
	.title-wrap > p, .kicker { margin: 0 0 0.9rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
	h1 { margin: 0; font-family: var(--font-display); font-size: clamp(4rem, 10vw, 7.6rem); font-weight: 780; letter-spacing: -0.085em; line-height: 0.85; }
	.lede { max-width: 42rem; margin-top: 1.75rem; color: var(--copy); font-family: Georgia, serif; font-size: clamp(1.05rem, 2vw, 1.35rem); font-style: italic; line-height: 1.55; }
	.availability { display: grid; min-width: 10rem; padding: 1rem; gap: 0.65rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.availability small { color: var(--faint); font-family: var(--font-mono); font-size: 0.52rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
	.availability span { display: flex; align-items: center; gap: 0.45rem; font-size: 0.68rem; font-weight: 700; text-transform: capitalize; }
	.availability i { width: 0.42rem; height: 0.42rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-wash); }
	.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.summary-grid > div { min-height: 10.5rem; padding: 1.2rem; border-right: 1px solid var(--line); }
	.summary-grid > div:last-child { border: 0; }
	.summary-grid small { color: var(--green-dark); font-family: var(--font-mono); font-size: 0.5rem; font-weight: 700; letter-spacing: 0.1em; }
	.summary-grid h2 { margin: 2rem 0 0.4rem; font-size: 0.83rem; }
	.summary-grid p { max-width: 19rem; margin: 0; color: var(--muted); font-size: 0.68rem; line-height: 1.55; }
	main { display: grid; padding: clamp(4rem, 8vw, 7rem) 0; gap: clamp(4.5rem, 9vw, 8rem); }
	.section-copy { max-width: 48rem; }
	.section-copy h2, .renderer-section > h2, footer h2 { margin: 0; font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.06em; line-height: 1; }
	.section-copy > p:not(.kicker) { max-width: 43rem; margin: 1.25rem 0 0; color: var(--copy); font-size: 0.87rem; line-height: 1.75; }
	.section-copy :global(.code-block) { margin-top: 1.8rem; }
	.note { display: grid; margin-top: -0.6rem; padding: 1rem 1.1rem; grid-template-columns: 10rem minmax(0, 1fr); gap: 1rem; border-left: 3px solid var(--acid); background: var(--paper-deep); }
	.note strong, .note span { font-size: 0.68rem; line-height: 1.5; }
	.note span { color: var(--muted); }
	.install-section { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(28rem, 1.2fr); gap: clamp(2rem, 6vw, 6rem); }
	.commands { display: grid; gap: 0.85rem; }
	.commands > div { min-width: 0; }
	.commands > div > span { display: flex; margin-bottom: 0.45rem; align-items: center; gap: 0.5rem; color: var(--muted); font-size: 0.65rem; font-weight: 700; }
	.commands b { display: grid; width: 1.4rem; height: 1.4rem; place-items: center; border-radius: 0.3rem; background: var(--green-wash); color: var(--green-dark); font-family: Georgia, serif; font-style: italic; }
	.commands :global(.code-block) { margin: 0; }
	.renderer-section > h2 { max-width: 42rem; }
	.renderer-grid { display: grid; margin-top: 2rem; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
	.renderer-grid article { display: flex; min-height: 14rem; padding: 1.4rem; gap: 1rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.renderer-mark { display: grid; width: 2.65rem; height: 2.65rem; flex: 0 0 auto; place-items: center; border-radius: 0.48rem; background: var(--green); color: white; font-family: Georgia, serif; font-size: 1.1rem; font-style: italic; }
	.renderer-mark.takumi { background: var(--acid); color: var(--ink); }
	.renderer-grid article > div { display: flex; flex-direction: column; align-items: flex-start; }
	.renderer-grid h3 { margin: 0.15rem 0 0.5rem; font-size: 0.92rem; }
	.renderer-grid p { margin: 0; color: var(--muted); font-size: 0.72rem; line-height: 1.65; }
	.renderer-grid a { margin-top: auto; padding-top: 1.2rem; color: var(--green-dark); font-size: 0.65rem; font-weight: 700; text-decoration: none; }
	.renderer-grid a span, .footer-links span { margin-left: 0.5rem; }
	footer { display: flex; padding: 3rem; align-items: center; justify-content: space-between; gap: 2rem; border-radius: 0.8rem; background: var(--ink); color: white; }
	footer small { color: var(--acid); font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.12em; }
	footer h2 { margin-top: 0.6rem; font-size: clamp(1.6rem, 4vw, 2.5rem); }
	.footer-links { display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem; }
	.footer-links a { padding-bottom: 0.25rem; border-bottom: 1px solid #486057; color: white; font-size: 0.68rem; font-weight: 700; text-decoration: none; }
	@media (max-width: 800px) {
		header { align-items: start; grid-template-columns: 1fr; }
		.availability { width: 100%; grid-template-columns: auto 1fr 1fr; align-items: center; }
		.install-section { grid-template-columns: 1fr; }
		.summary-grid { grid-template-columns: 1fr; }
		.summary-grid > div { min-height: 0; border-right: 0; border-bottom: 1px solid var(--line); }
		.summary-grid h2 { margin-top: 1.2rem; }
	}
	@media (max-width: 600px) {
		.page-shell { width: min(100% - 1.25rem, 76rem); }
		header { padding-top: 3.5rem; }
		.availability { grid-template-columns: 1fr; }
		.renderer-grid { grid-template-columns: 1fr; }
		.note { grid-template-columns: 1fr; }
		footer { padding: 2rem 1.4rem; align-items: flex-start; flex-direction: column; }
		.footer-links { align-items: flex-start; }
	}
</style>
