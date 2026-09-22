<script lang="ts">
	import { base } from '$app/paths';
	import { components, templates } from '../docs/catalog';

	const featured = templates.filter((item) => ['invoice-modern', 'report-financial', 'report-security'].includes(item.slug));
</script>

<svelte:head>
	<title>pdfcn / svelte — documents, composed</title>
</svelte:head>

<section class="hero">
	<div class="hero-grid">
		<div class="hero-copy">
			<div class="status"><span></span> Svelte 5 · preview release</div>
			<h1>Documents,<br /><em>composed.</em></h1>
			<p>Build polished invoices, reports, and data-rich PDFs from a small vocabulary of Svelte components you can actually own.</p>
			<div class="hero-actions">
				<a class="primary" href={`${base}/docs/getting-started`}>Start building <span>→</span></a>
				<a class="secondary" href={`${base}/templates`}>Explore templates</a>
			</div>
			<p class="package-note">Preview release · use a packed or workspace-linked build. <a href={`${base}/docs/install`}>Installation instructions →</a></p>
		</div>

		<a class="studio" href={`${base}/templates/invoice-modern`} aria-label="Explore the generated Modern Invoice PDF">
			<div class="studio-top"><span><i></i><i></i><i></i></span><small>Modern Invoice · generated PDF</small><b>Takumi</b></div>
			<div class="desk"><img src={`${base}/previews/gallery/invoice-modern.webp`} alt="First page of the generated Modern Invoice, showing sample line items and totals" width="804" height="1137" /></div>
		</a>
	</div>
</section>

<section class="signal">
	<div><strong>{components.length}</strong><span>Document components</span></div>
	<div><strong>{templates.length}</strong><span>Document templates</span></div>
	<div><strong>09</strong><span>Curated themes</span></div>
	<div><strong>02</strong><span>Renderer bases</span></div>
</section>

<section class="manifesto section-wrap">
	<div class="section-label">A better document layer</div>
	<div class="manifesto-grid">
		<h2>Not another PDF<br />black box.</h2>
		<div>
			<p>Use composable primitives instead of pixel coordinates and one-off templates. pdfcn-svelte gives your documents the same care as the rest of your product.</p>
			<div class="principles">
				<div><span>01</span><strong>Copy-ready</strong><p>Install as a package or bring readable source into your project through the registry.</p></div>
				<div><span>02</span><strong>Renderer-aware</strong><p>Render real PDF bytes with Forme or Takumi, then inspect either output in the browser-native PDF viewer.</p></div>
				<div><span>03</span><strong>Theme-native</strong><p>Change document character with semantic color, type, spacing, and radius tokens.</p></div>
				<div><span>04</span><strong>Svelte-first</strong><p>Built around Svelte 5 props, snippets, context, and renderer-specific composition.</p></div>
			</div>
		</div>
	</div>
</section>

<section class="templates section-wrap">
	<div class="templates-head">
		<div><div class="section-label">Rendered examples</div><h2>Start with a complete document.</h2></div>
		<a href={`${base}/templates`}>View all ten templates <span>→</span></a>
	</div>
	<div class="template-grid">
		{#each featured as item (item.slug)}
			<a class="template-card" href={`${base}/templates/${item.slug}`}>
				<div class="paper-preview"><img src={`${base}/previews/gallery/${item.slug}.webp`} alt={`First page of the generated ${item.name}`} loading="lazy" width="804" height="1137" /></div>
				<div class="card-meta"><div><small>{item.kind}</small><strong>{item.name}</strong></div><span>↗</span></div>
			</a>
		{/each}
	</div>
</section>

<section class="renderer-section">
	<div class="section-wrap renderer-inner">
		<div><div class="section-label light">Choose your output</div><h2>One vocabulary.<br />Two foundations.</h2></div>
		<div class="renderer-cards">
			<a href={`${base}/docs/renderers#forme`}><span class="renderer-icon">F</span><div><small>PDF OUTPUT</small><strong>Forme</strong><p>Build a Forme document tree and render real PDF bytes with the official Svelte adapter.</p></div><b>→</b></a>
			<a href={`${base}/docs/renderers#takumi`}><span class="renderer-icon acid">T</span><div><small>PDF + LIVE PREVIEW</small><strong>Takumi</strong><p>SSR the Svelte tree to HTML, then render paged PDF bytes through the official takumi-pdf engine.</p></div><b>→</b></a>
		</div>
	</div>
</section>

<footer>
	<div class="footer-inner"><strong>pdfcn<span>/</span>svelte</strong><p>Composable documents for Svelte 5.</p><nav><a href={`${base}/docs`}>Docs</a><a href={`${base}/components`}>Components</a><a href={`${base}/templates`}>Templates</a></nav></div>
</footer>

<style>
	.hero { border-bottom: 1px solid var(--line); background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 48px 48px; }
	.hero-grid { display: grid; width: min(100% - 2rem, 82rem); min-height: 41rem; margin: 0 auto; grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr); align-items: center; gap: 5vw; }
	.hero-copy { min-width: 0; position: relative; z-index: 2; padding: 6rem 0; }
	.status { display: inline-flex; padding: 0.38rem 0.58rem; align-items: center; gap: 0.45rem; border: 1px solid var(--line); border-radius: 99px; background: color-mix(in srgb, var(--canvas) 80%, transparent); color: var(--muted); font-family: var(--font-mono); font-size: 0.61rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
	.status span { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-wash); }
	h1 { margin: 1.4rem 0; font-family: var(--font-display); font-size: clamp(4rem, 7.4vw, 7rem); font-weight: 780; letter-spacing: -0.085em; line-height: 0.78; }
	h1 em { color: var(--green); font-family: Georgia, serif; font-weight: 400; }
	.hero-copy > p { max-width: 32rem; margin: 2rem 0; color: var(--copy); font-size: 1.02rem; line-height: 1.75; }
	.hero-actions { display: flex; gap: 0.75rem; }
	.hero-actions a { padding: 0.85rem 1.1rem; border-radius: 0.45rem; font-size: 0.78rem; font-weight: 750; text-decoration: none; }
	.primary { background: var(--green); color: white; box-shadow: 0 7px 18px rgb(35 127 85 / 0.18); }
	.primary span { margin-left: 0.6rem; color: var(--acid); }
	.secondary { border: 1px solid var(--line); background: var(--paper); color: var(--ink); }
	.studio { display: block; min-width: 0; width: 100%; max-width: 37rem; justify-self: center; border: 1px solid #2d4038; border-radius: 0.75rem; background: #172920; overflow: hidden; box-shadow: 0 35px 70px rgb(20 38 30 / 0.2); }
	.studio-top { display: flex; height: 2.4rem; padding: 0 0.8rem; align-items: center; border-bottom: 1px solid #34463f; color: #8fa098; font-family: var(--font-mono); font-size: 0.56rem; }
	.studio-top > span { display: flex; gap: 0.3rem; }
	.studio-top i { width: 0.48rem; height: 0.48rem; border-radius: 50%; background: #41544b; }
	.studio-top small { margin: auto; }
	.studio-top b { font-weight: 500; }
	.desk { padding: 1.4rem; background: #dfe8e1; }
	.desk img { display: block; width: 100%; height: auto; box-shadow: 0 8px 24px rgb(0 0 0 / 0.15); }
	.package-note { max-width: 28rem; font-size: 0.8rem; color: var(--muted); }
	.package-note a { color: var(--green-dark); text-underline-offset: .2em; }
	.signal { display: grid; width: min(100% - 2rem, 82rem); margin: 0 auto; grid-template-columns: repeat(4, 1fr); border-right: 1px solid var(--line); border-left: 1px solid var(--line); }
	.signal div { display: grid; padding: 1.8rem 2rem; gap: 0.25rem; border-right: 1px solid var(--line); }
	.signal div:last-child { border: 0; }
	.signal strong { font-family: var(--font-display); font-size: 1.7rem; letter-spacing: -0.06em; }
	.signal span { color: var(--muted); font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.06em; text-transform: uppercase; }
	.section-wrap { width: min(100% - 2rem, 76rem); margin: 0 auto; }
	.manifesto { padding-top: 8rem; padding-bottom: 9rem; }
	.section-label { margin-bottom: 2rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.64rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
	.manifesto-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 8vw; }
	h2 { margin: 0; font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4.7rem); letter-spacing: -0.07em; line-height: 0.96; }
	.manifesto-grid > div > p { margin: 0 0 3rem; color: var(--copy); font-family: Georgia, serif; font-size: 1.25rem; line-height: 1.6; }
	.principles { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
	.principles div { display: grid; grid-template-columns: auto 1fr; column-gap: 0.8rem; }
	.principles span { grid-row: span 2; color: var(--green); font-family: var(--font-mono); font-size: 0.6rem; }
	.principles strong { font-size: 0.85rem; }
	.principles p { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.73rem; line-height: 1.6; }
	.templates { padding-bottom: 9rem; }
	.templates-head { display: flex; margin-bottom: 2.2rem; align-items: end; justify-content: space-between; }
	.templates-head .section-label { margin-bottom: 0.8rem; }
	.templates-head h2 { max-width: 40rem; font-size: clamp(2.2rem, 4.5vw, 4rem); }
	.templates-head a { padding-bottom: 0.4rem; border-bottom: 1px solid var(--green); color: var(--green-dark); font-size: 0.72rem; font-weight: 750; text-decoration: none; }
	.templates-head a span { margin-left: 1rem; }
	.template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
	.template-card { padding: 0.7rem; border: 1px solid var(--line); border-radius: 0.7rem; background: var(--paper); color: var(--ink); text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
	.template-card:hover { box-shadow: 0 18px 35px rgb(26 50 39 / 0.1); transform: translateY(-4px); }
	.paper-preview { height: 22rem; overflow: hidden; padding: 1rem; border-radius: 0.42rem; background: #e8eee9; }
	.paper-preview img { display: block; width: 100%; height: auto; }
	.paper-preview::before { content: ''; position: absolute; }
	.card-meta { display: flex; padding: 1rem 0.4rem 0.4rem; align-items: center; justify-content: space-between; }
	.card-meta div { display: grid; gap: 0.2rem; }
	.card-meta small { color: var(--faint); font-family: var(--font-mono); font-size: 0.54rem; letter-spacing: 0.1em; text-transform: uppercase; }
	.card-meta strong { font-size: 0.82rem; }
	.card-meta > span { display: grid; width: 2rem; height: 2rem; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--green); }
	.renderer-section { padding: 7rem 0; background: var(--ink); color: white; }
	.renderer-inner { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 7vw; }
	.section-label.light { color: var(--acid); }
	.renderer-inner h2 { font-size: clamp(2.5rem, 4.5vw, 4.3rem); }
	.renderer-cards { display: grid; gap: 0.8rem; }
	.renderer-cards a { display: grid; padding: 1.4rem; grid-template-columns: auto 1fr auto; align-items: center; gap: 1.2rem; border: 1px solid #385046; border-radius: 0.65rem; color: white; text-decoration: none; }
	.renderer-cards a:hover { border-color: #668073; background: #1a3026; }
	.renderer-icon { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: 0.55rem; background: var(--green); font-family: Georgia, serif; font-size: 1.3rem; font-style: italic; }
	.renderer-icon.acid { background: var(--acid); color: var(--ink); }
	.renderer-cards div { display: grid; gap: 0.2rem; }
	.renderer-cards small { color: #8ba096; font-family: var(--font-mono); font-size: 0.51rem; letter-spacing: 0.1em; }
	.renderer-cards strong { font-size: 1rem; }
	.renderer-cards p { margin: 0.3rem 0 0; color: #a9bbb2; font-size: 0.7rem; line-height: 1.55; }
	.renderer-cards b { color: var(--acid); }
	footer { background: #0d1c16; color: white; }
	.footer-inner { display: flex; width: min(100% - 2rem, 76rem); padding: 2.6rem 0; margin: 0 auto; align-items: center; }
	.footer-inner strong { font-size: 1rem; }.footer-inner strong span { color: var(--acid); }
	.footer-inner p { margin-left: 1.2rem; color: #789087; font-size: 0.68rem; }
	.footer-inner nav { display: flex; margin-left: auto; gap: 1.5rem; }
	.footer-inner a { color: #9eb0a8; font-size: 0.68rem; text-decoration: none; }
	@media (max-width: 960px) {
		.hero-grid { min-height: auto; grid-template-columns: minmax(0, 1fr); }
		.hero-copy { padding: 5rem 0 2rem; }
		h1 { font-size: clamp(4.5rem, 14vw, 7rem); }
		.studio { width: 100%; margin: 0 auto; }
		.signal { margin-top: 8rem; }
		.manifesto-grid, .renderer-inner { grid-template-columns: 1fr; gap: 3rem; }
	}
	@media (max-width: 720px) {
		.hero-grid, .signal, .section-wrap { width: min(100% - 1.25rem, 82rem); }
		.hero-copy { padding-top: 3.5rem; }
		h1 { font-size: clamp(3.7rem, 19vw, 5.5rem); }
		.hero-copy > p { font-size: 0.9rem; }
		h1 { font-size: clamp(2.8rem, 10vw, 4.8rem); }
		.studio { width: 100%; margin: 0 auto; }
		.signal { margin-top: 2rem; grid-template-columns: 1fr 1fr; }
		.signal div:nth-child(2) { border-right: 0; }.signal div:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
		.signal div { padding: 1.25rem; }
		.manifesto { padding-top: 5rem; padding-bottom: 6rem; }
		.manifesto-grid { gap: 2.5rem; }
		.principles { grid-template-columns: 1fr; }
		.templates { padding-bottom: 6rem; }
		.templates-head { align-items: start; flex-direction: column; gap: 1.5rem; }
		.template-grid { grid-template-columns: 1fr; }
		.paper-preview { height: 18rem; }
		.renderer-section { padding: 5rem 0; }
		.footer-inner { align-items: flex-start; flex-direction: column; gap: 0.6rem; }
		.footer-inner p { margin: 0; }.footer-inner nav { margin: 1rem 0 0; }
	}
</style>
