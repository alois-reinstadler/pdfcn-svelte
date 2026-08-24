<script lang="ts">
	import { components, templates } from '../docs/catalog';

	const featured = templates.filter((item) => ['invoice-modern', 'report-financial', 'report-security'].includes(item.slug));
</script>

<svelte:head>
	<title>pdfcn / svelte — documents, composed</title>
</svelte:head>

<section class="hero">
	<div class="hero-grid">
		<div class="hero-copy">
			<div class="status"><span></span> Svelte 5 · renderer-ready</div>
			<h1>Documents,<br /><em>composed.</em></h1>
			<p>Build polished invoices, reports, and data-rich PDFs from a small vocabulary of Svelte components you can actually own.</p>
			<div class="hero-actions">
				<a class="primary" href="/docs/getting-started">Start building <span>→</span></a>
				<a class="secondary" href="/templates">Explore templates</a>
			</div>
			<div class="install"><code>pnpm add pdfcn-svelte</code><span aria-hidden="true">⌘</span></div>
		</div>

		<div class="studio" aria-label="Illustration of an invoice document in the studio">
			<div class="studio-top"><span><i></i><i></i><i></i></span><small>invoice-modern.svelte</small><b>92%</b></div>
			<div class="studio-body">
				<div class="rail"><span class="active">A</span><span>□</span><span>≡</span><span>⌁</span></div>
				<div class="desk">
					<div class="invoice-page">
						<div class="invoice-head"><div class="mini-mark">P</div><div><small>INVOICE</small><strong>#2026-084</strong></div></div>
						<div class="meta"><div><small>BILLED TO</small><b>Northstar Labs</b><span>47 Market Street<br />Portland, OR</span></div><div><small>ISSUED</small><b>Aug 24, 2026</b><small>DUE</small><b>Sep 07, 2026</b></div></div>
						<div class="invoice-table"><div class="tr head"><span>DESCRIPTION</span><span>QTY</span><span>AMOUNT</span></div><div class="tr"><b>Product strategy</b><span>1</span><span>$4,800</span></div><div class="tr"><b>Design system</b><span>1</span><span>$3,200</span></div><div class="tr"><b>Implementation</b><span>2</span><span>$6,400</span></div></div>
						<div class="total"><small>TOTAL DUE</small><strong>$14,400</strong></div>
						<div class="invoice-foot"><span>Thank you for your business.</span><span>northstar.dev</span></div>
					</div>
					<div class="float-card"><small>THEME</small><strong><i></i> Modern</strong><span>9 presets included</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="signal">
	<div><strong>{components.length}</strong><span>Document components</span></div>
	<div><strong>{templates.length}</strong><span>Ready-made templates</span></div>
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
				<div><span>02</span><strong>Renderer-aware</strong><p>Render real PDF bytes with Forme or Takumi while keeping a browser-visible Takumi preview.</p></div>
				<div><span>03</span><strong>Theme-native</strong><p>Change document character with semantic color, type, spacing, and radius tokens.</p></div>
				<div><span>04</span><strong>Svelte-first</strong><p>Built around Svelte 5 props, snippets, context, and renderer-specific composition.</p></div>
			</div>
		</div>
	</div>
</section>

<section class="templates section-wrap">
	<div class="templates-head">
		<div><div class="section-label">Made to ship</div><h2>Start with a complete document.</h2></div>
		<a href="/templates">View all ten templates <span>→</span></a>
	</div>
	<div class="template-grid">
		{#each featured as item, index}
			<a class="template-card" href={`/templates/${item.slug}`}>
				<div class="paper-preview variant-{index}">
					<div class="paper-title"><i></i><span></span></div>
					<div class="paper-lines"><b></b><b></b><b></b></div>
					<div class="paper-chart"><span></span><span></span><span></span><span></span><span></span></div>
					<div class="paper-blocks"><i></i><i></i><i></i></div>
				</div>
				<div class="card-meta"><div><small>{item.kind}</small><strong>{item.name}</strong></div><span>↗</span></div>
			</a>
		{/each}
	</div>
</section>

<section class="renderer-section">
	<div class="section-wrap renderer-inner">
		<div><div class="section-label light">Choose your output</div><h2>One vocabulary.<br />Two foundations.</h2></div>
		<div class="renderer-cards">
			<a href="/docs/renderers#forme"><span class="renderer-icon">F</span><div><small>PDF OUTPUT</small><strong>Forme</strong><p>Build a Forme document tree and render real PDF bytes with the official Svelte adapter.</p></div><b>→</b></a>
			<a href="/docs/renderers#takumi"><span class="renderer-icon acid">T</span><div><small>PDF + LIVE PREVIEW</small><strong>Takumi</strong><p>SSR the Svelte tree to HTML, then render paged PDF bytes through the official takumi-pdf engine.</p></div><b>→</b></a>
		</div>
	</div>
</section>

<footer>
	<div class="footer-inner"><strong>pdfcn<span>/</span>svelte</strong><p>Composable documents for Svelte 5.</p><nav><a href="/docs">Docs</a><a href="/components">Components</a><a href="/templates">Templates</a></nav></div>
</footer>

<style>
	.hero { overflow: hidden; border-bottom: 1px solid var(--line); background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 48px 48px; }
	.hero-grid { display: grid; width: min(100% - 2rem, 82rem); min-height: 41rem; margin: 0 auto; grid-template-columns: 0.88fr 1.12fr; align-items: center; gap: 5vw; }
	.hero-copy { position: relative; z-index: 2; padding: 6rem 0; }
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
	.install { display: inline-flex; margin-top: 1.15rem; padding: 0.55rem 0.7rem; gap: 2rem; border: 1px solid var(--line); border-radius: 0.4rem; background: var(--paper); color: var(--muted); }
	.install code { font-family: var(--font-mono); font-size: 0.67rem; }
	.install span { color: var(--faint); }
	.studio { position: relative; min-width: 45rem; border: 1px solid #2d4038; border-radius: 0.75rem; background: #172920; box-shadow: 0 35px 70px rgb(20 38 30 / 0.25); transform: rotate(1.2deg) translateX(1rem); }
	.studio-top { display: flex; height: 2.4rem; padding: 0 0.8rem; align-items: center; border-bottom: 1px solid #34463f; color: #8fa098; font-family: var(--font-mono); font-size: 0.56rem; }
	.studio-top > span { display: flex; gap: 0.3rem; }
	.studio-top i { width: 0.48rem; height: 0.48rem; border-radius: 50%; background: #41544b; }
	.studio-top small { margin: auto; }
	.studio-top b { font-weight: 500; }
	.studio-body { display: grid; height: 35rem; grid-template-columns: 2.8rem 1fr; }
	.rail { display: flex; padding: 1rem 0; flex-direction: column; align-items: center; gap: 0.75rem; border-right: 1px solid #34463f; color: #81928a; font-family: var(--font-mono); font-size: 0.7rem; }
	.rail span { display: grid; width: 1.7rem; height: 1.7rem; place-items: center; border-radius: 0.35rem; }
	.rail .active { background: #2d493c; color: var(--acid); }
	.desk { position: relative; display: grid; overflow: hidden; place-items: center; background-image: radial-gradient(#53655d 0.7px, transparent 0.7px); background-size: 18px 18px; }
	.invoice-page { width: 23.2rem; min-height: 29.5rem; padding: 2.2rem; background: #fffefa; color: #14261e; box-shadow: 0 18px 45px rgb(0 0 0 / 0.3); transform: rotate(-1.2deg); }
	.invoice-head { display: flex; align-items: center; justify-content: space-between; }
	.mini-mark { display: grid; width: 2rem; height: 2rem; place-items: center; border-radius: 0.35rem; background: var(--green); color: white; font-size: 0.8rem; font-weight: 900; }
	.invoice-head > div:last-child { display: grid; text-align: right; }
	.invoice-head small, .meta small, .total small { color: #89958f; font-family: var(--font-mono); font-size: 0.43rem; letter-spacing: 0.1em; }
	.invoice-head strong { margin-top: 0.15rem; font-size: 0.9rem; }
	.meta { display: grid; margin: 2rem 0 1.5rem; grid-template-columns: 1fr 0.65fr; }
	.meta div { display: grid; align-content: start; gap: 0.25rem; }
	.meta b { font-size: 0.54rem; }
	.meta span { color: #65776e; font-size: 0.45rem; line-height: 1.5; }
	.meta div:last-child { grid-template-columns: 1fr; gap: 0.15rem; }
	.meta div:last-child small:nth-of-type(2) { margin-top: 0.35rem; }
	.invoice-table { border-top: 1px solid #ccd4ce; }
	.tr { display: grid; padding: 0.62rem 0; grid-template-columns: 1fr 2rem 4rem; border-bottom: 1px solid #e5e8e5; color: #5c6e64; font-size: 0.47rem; text-align: right; }
	.tr > :first-child { text-align: left; }
	.tr.head { padding: 0.45rem 0; color: #89958f; font-family: var(--font-mono); font-size: 0.39rem; letter-spacing: 0.08em; }
	.tr b { color: #24382f; font-weight: 650; }
	.total { display: flex; margin-top: 1rem; padding: 0.8rem 1rem; align-items: center; justify-content: flex-end; gap: 2rem; background: #eaf3ed; }
	.total strong { font-family: Georgia, serif; font-size: 1.1rem; }
	.invoice-foot { display: flex; margin-top: 2.5rem; justify-content: space-between; color: #89958f; font-size: 0.4rem; }
	.float-card { position: absolute; right: 1.5rem; bottom: 2.2rem; display: grid; width: 8rem; padding: 0.8rem; border: 1px solid #d7ded8; border-radius: 0.45rem; background: #fff; box-shadow: 0 12px 24px rgb(0 0 0 / 0.16); }
	.float-card small { color: #89958f; font-family: var(--font-mono); font-size: 0.4rem; letter-spacing: 0.1em; }
	.float-card strong { display: flex; margin: 0.35rem 0 0.12rem; align-items: center; gap: 0.4rem; color: #14261e; font-size: 0.6rem; }
	.float-card i { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--green); }
	.float-card span { color: #89958f; font-size: 0.42rem; }
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
	.paper-preview { display: grid; height: 22rem; padding: 3rem 3.2rem; align-content: start; border-radius: 0.42rem; background: #e8eee9; }
	.paper-preview::before { content: ''; position: absolute; }
	.paper-title { display: flex; margin-bottom: 2.5rem; align-items: center; justify-content: space-between; }
	.paper-title i { width: 2rem; height: 2rem; border-radius: 50%; background: var(--green); }
	.paper-title span { width: 4rem; height: 0.45rem; background: #8ea096; }
	.paper-lines { display: grid; gap: 0.55rem; }
	.paper-lines b { height: 0.27rem; background: #aebbb4; }
	.paper-lines b:nth-child(2) { width: 72%; }
	.paper-lines b:nth-child(3) { width: 88%; }
	.paper-chart { display: flex; height: 5rem; margin-top: 2.2rem; align-items: end; gap: 0.45rem; border-bottom: 1px solid #8fa299; }
	.paper-chart span { flex: 1; background: #4d8e6e; }
	.paper-chart span:nth-child(1) { height: 35%; }.paper-chart span:nth-child(2) { height: 60%; }.paper-chart span:nth-child(3) { height: 50%; }.paper-chart span:nth-child(4) { height: 85%; }.paper-chart span:nth-child(5) { height: 70%; }
	.paper-blocks { display: flex; margin-top: 1.5rem; gap: 0.5rem; }
	.paper-blocks i { flex: 1; height: 2rem; background: #d3dcd7; }
	.variant-1 { background: #f1ece4; }.variant-1 .paper-title i, .variant-1 .paper-chart span { background: #9b5e43; }
	.variant-2 { background: #e6e9ec; }.variant-2 .paper-title i, .variant-2 .paper-chart span { background: #344b5d; }
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
		.hero-grid { min-height: auto; grid-template-columns: 1fr; }
		.hero-copy { padding: 5rem 0 2rem; }
		h1 { font-size: clamp(4.5rem, 14vw, 7rem); }
		.studio { width: 46rem; margin: 0 auto -8rem; transform: scale(0.85); transform-origin: top center; }
		.signal { margin-top: 8rem; }
		.manifesto-grid, .renderer-inner { grid-template-columns: 1fr; gap: 3rem; }
	}
	@media (max-width: 720px) {
		.hero-grid, .signal, .section-wrap { width: min(100% - 1.25rem, 82rem); }
		.hero-copy { padding-top: 3.5rem; }
		h1 { font-size: clamp(3.7rem, 19vw, 5.5rem); }
		.hero-copy > p { font-size: 0.9rem; }
		.studio { min-width: 43rem; margin-left: 50%; transform: translateX(-50%) scale(0.66); transform-origin: top center; }
		.signal { margin-top: -2rem; grid-template-columns: 1fr 1fr; }
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
