<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import TemplateFrame from '../../../docs/components/TemplateFrame.svelte';
	import TemplateInstallCommand from '../../../docs/components/TemplateInstallCommand.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let renderer = $state<'takumi' | 'forme'>('takumi');
	const themes = ['professional', 'modern', 'corporate', 'minimal', 'elegant', 'executive', 'blueprint', 'forest', 'vivid'] as const;
	const requestedTheme = $derived(browser ? page.url.searchParams.get('theme') : null);
	const activeTheme = $derived(themes.includes(requestedTheme as (typeof themes)[number]) ? requestedTheme! : data.template.theme);
	const pdfUrl = $derived(`${base}/previews/${renderer}/${activeTheme}/${data.template.slug}.pdf`);
</script>

<svelte:head>
	<title>{data.template.name} template — pdfcn / svelte</title>
	<meta name="description" content={data.template.description} />
</svelte:head>

<nav class="crumbs" aria-label="Breadcrumb">
	<a href={`${base}/templates`}>Templates</a><span aria-hidden="true">/</span><span>{data.template.name}</span>
</nav>

<section class="template-hero">
	<div class="hero-copy">
		<div class="label"><span>{data.template.kind}</span><i></i><span>{data.template.tone}</span></div>
		<h1>{data.template.name}</h1>
		<p class="lede">{data.template.longDescription}</p>
		<div class="hero-actions">
			<a class="primary" href={pdfUrl} target="_blank" rel="noreferrer">Open {renderer === 'forme' ? 'Forme' : 'Takumi'} PDF <span>↗</span></a>
			<a class="secondary" href={pdfUrl} download>Download PDF <span>↓</span></a>
		</div>
		<p class="artifact-note">The preview is a generated PDF artifact rendered with the selected engine and theme.</p>
		<div class="best-for">
			<small>BEST FOR</small>
			<ul>{#each data.template.bestFor as use}<li>{use}</li>{/each}</ul>
		</div>
	</div>

	<div class="preview-studio">
		<div class="studio-bar">
			<span class="window-dots"><i></i><i></i><i></i></span>
			<div class="preview-renderers" aria-label="PDF preview renderer">
				<button class:active={renderer === 'takumi'} type="button" onclick={() => (renderer = 'takumi')}>Takumi</button>
				<button class:active={renderer === 'forme'} type="button" onclick={() => (renderer = 'forme')}>Forme</button>
			</div>
			<a href={pdfUrl} target="_blank" rel="noreferrer">Open PDF ↗</a>
		</div>
		<TemplateFrame slug={data.template.slug} title={data.template.name} theme={activeTheme} {renderer} />
	</div>
</section>

<section class="theme-strip" aria-labelledby="theme-title">
	<div><small id="theme-title">Preview theme</small><strong>{activeTheme}</strong></div>
	<nav aria-label="Preview themes">
		{#each themes as theme}
			<a href={`?theme=${theme}`} aria-current={activeTheme === theme ? 'true' : undefined} title={`${theme} theme`}><span class={`theme-${theme}`}></span><b>{theme}</b></a>
		{/each}
	</nav>
</section>

<section class="detail-grid">
	<div class="main-column">
		<div class="section-label">Two renderers</div>
		<h2>Choose the pipeline that fits.</h2>
		<div class="renderers">
			<article><span class="renderer-mark">F</span><div><small>FORME</small><h3>PDF-native tree</h3><p>Render PDF bytes through <code>@formepdf/svelte</code> and <code>@formepdf/core</code>. Strong pagination semantics make this the direct PDF pipeline.</p><ul><li>Server-side PDF output</li><li>Native document primitives</li><li>Download preview above</li></ul></div></article>
			<article><span class="renderer-mark alt">T</span><div><small>TAKUMI</small><h3>Inspectable + PDF-ready</h3><p>The Takumi preview above is a real PDF rendered from the same SSR-compatible component tree through <code>takumi-pdf</code>.</p><ul><li>HTML/CSS document source</li><li>SSR-compatible markup</li><li>Official PDF-byte renderer</li></ul></div></article>
		</div>

		<div class="section-label ingredients-label">Document anatomy</div>
		<h2>Composed from primitives.</h2>
		<p class="section-lede">Each template is readable Svelte source. Replace its sample data, reorder sections, or pull out the smaller components for a completely different document.</p>
		<div class="ingredients">
			{#each data.template.components as component, index}
				<a href={`${base}/components`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{component}</strong><b>↗</b></a>
			{/each}
		</div>
	</div>

	<aside>
		<div class="aside-card install-card">
			<small>ADD TO YOUR PROJECT</small><h3>Own the source</h3><p>Choose a renderer and install this template plus its dependencies from the hosted GitHub registry.</p>
			<div class="renderer-toggle" aria-label="Registry renderer">
				<button class:active={renderer === 'takumi'} type="button" onclick={() => (renderer = 'takumi')}>Takumi</button>
				<button class:active={renderer === 'forme'} type="button" onclick={() => (renderer = 'forme')}>Forme</button>
			</div>
			<TemplateInstallCommand slug={data.template.slug} {renderer} />
			<p class="local-note"><a href={`${base}/r/${renderer}/${data.template.slug}.json`}>Inspect this registry item ↗</a></p>
		</div>
		<div class="aside-card metadata">
			<small>TEMPLATE METADATA</small>
			<dl><div><dt>Type</dt><dd>{data.template.kind}</dd></div><div><dt>Default theme</dt><dd>{data.template.theme}</dd></div><div><dt>Renderers</dt><dd>Forme, Takumi</dd></div><div><dt>Source format</dt><dd>Svelte 5</dd></div><div><dt>Registry item</dt><dd>{data.template.slug}</dd></div></dl>
		</div>
		<a class="next-card" href={`${base}/templates`}><small>EXPLORE THE COLLECTION</small><strong>All ten templates <span>→</span></strong></a>
	</aside>
</section>

<style>
	.crumbs { display: flex; width: min(100% - 2rem, 76rem); margin: 0 auto; padding: 1.2rem 0; gap: 0.55rem; color: var(--faint); font-family: var(--font-mono); font-size: 0.58rem; }
	.crumbs a { color: var(--green-dark); text-decoration: none; }
	.template-hero { display: grid; width: min(100% - 2rem, 76rem); margin: 0 auto; padding: 3.5rem 0 6rem; grid-template-columns: 0.72fr 1.28fr; align-items: center; gap: 7vw; }
	.label { display: flex; align-items: center; gap: 0.5rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.58rem; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
	.label i { width: 3px; height: 3px; border-radius: 50%; background: var(--green); }
	h1 { margin: 1rem 0 1.35rem; font-family: var(--font-display); font-size: clamp(3.5rem, 6vw, 6.2rem); letter-spacing: -0.08em; line-height: 0.88; }
	.lede { color: var(--copy); font-family: Georgia, serif; font-size: 1.1rem; line-height: 1.7; }
	.hero-actions { display: flex; margin-top: 1.8rem; flex-wrap: wrap; gap: 0.65rem; }
	.hero-actions a { padding: 0.78rem 0.9rem; border-radius: 0.42rem; font-size: 0.7rem; font-weight: 750; text-decoration: none; }
	.primary { background: var(--green); color: white; }
	.primary span { margin-left: 0.55rem; color: var(--acid); }
	.secondary { border: 1px solid var(--line); background: var(--paper); color: var(--ink); }
	.artifact-note { margin: 0.6rem 0 0; color: var(--faint); font-size: 0.58rem; line-height: 1.45; }
	.best-for { margin-top: 2.5rem; padding-top: 1.2rem; border-top: 1px solid var(--line); }
	.best-for small, .aside-card > small, .section-label { color: var(--green-dark); font-family: var(--font-mono); font-size: 0.55rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
	.best-for ul { display: flex; margin: 0.65rem 0 0; padding: 0; flex-wrap: wrap; gap: 0.4rem; list-style: none; }
	.best-for li { padding: 0.35rem 0.5rem; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 0.6rem; }
	.preview-studio { min-width: 0; padding: 0.7rem; border-radius: 0.8rem; background: #182b22; box-shadow: 0 2rem 4rem rgb(20 38 30 / 0.2); }
	.studio-bar { display: flex; height: 2.6rem; padding: 0 0.35rem; align-items: center; gap: 0.7rem; color: #9baba3; font-family: var(--font-mono); font-size: 0.52rem; letter-spacing: 0.08em; text-transform: uppercase; }
	.window-dots { display: flex; gap: 0.3rem; }
	.studio-bar i { width: 0.43rem; height: 0.43rem; border-radius: 50%; background: #41564b; }
	.preview-renderers { display: flex; margin: auto; padding: 0.16rem; border: 1px solid #41564b; border-radius: 0.35rem; }
	.preview-renderers button { padding: 0.3rem 0.52rem; border: 0; border-radius: 0.22rem; background: transparent; color: #9baba3; cursor: pointer; font: inherit; letter-spacing: inherit; text-transform: uppercase; }
	.preview-renderers button.active { background: var(--acid); color: #182b22; }
	.studio-bar > a { color: #dbe6df; font-size: 0.48rem; text-decoration: none; }
	.theme-strip { display: flex; width: min(100% - 2rem, 76rem); margin: 0 auto 7rem; padding: 1rem; align-items: center; gap: 2rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.theme-strip > div { display: grid; min-width: 8rem; gap: 0.2rem; }
	.theme-strip small { color: var(--faint); font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; }
	.theme-strip strong { font-size: 0.72rem; text-transform: capitalize; }
	.theme-strip nav { display: grid; width: 100%; grid-template-columns: repeat(9, 1fr); gap: 0.45rem; }
	.theme-strip a { display: grid; min-width: 0; padding: 0.4rem; gap: 0.35rem; border: 1px solid transparent; border-radius: 0.35rem; color: var(--muted); text-decoration: none; }
	.theme-strip a[aria-current='true'] { border-color: var(--green); background: var(--green-wash); color: var(--ink); }
	.theme-strip a span { height: 0.55rem; border-radius: 0.18rem; background: #334155; }.theme-strip a b { overflow: hidden; font-family: var(--font-mono); font-size: 0.43rem; font-weight: 550; text-overflow: ellipsis; text-transform: capitalize; }
	.theme-modern { background: #2563eb !important; }.theme-corporate { background: #1e3a5f !important; }.theme-minimal { background: #18181b !important; }.theme-elegant { background: #7c3f58 !important; }.theme-executive { background: #695228 !important; }.theme-blueprint { background: #075985 !important; }.theme-forest { background: #286145 !important; }.theme-vivid { background: #9333ea !important; }
	.detail-grid { display: grid; width: min(100% - 2rem, 76rem); margin: 0 auto; padding-bottom: 8rem; grid-template-columns: 1fr 20rem; gap: 5rem; }
	.main-column h2 { max-width: 42rem; margin: 0.75rem 0 1.6rem; font-family: var(--font-display); font-size: clamp(2.2rem, 4vw, 3.5rem); letter-spacing: -0.06em; line-height: 1; }
	.renderers { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
	.renderers article { display: grid; padding: 1.25rem; grid-template-columns: auto 1fr; gap: 0.9rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.renderer-mark { display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border-radius: 0.45rem; background: var(--green); color: white; font-family: Georgia, serif; font-style: italic; }.renderer-mark.alt { background: var(--acid); color: var(--ink); }
	.renderers small { color: var(--faint); font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.1em; }.renderers h3 { margin: 0.3rem 0 0.5rem; font-size: 0.85rem; }.renderers p, .renderers li { color: var(--muted); font-size: 0.64rem; line-height: 1.55; }.renderers ul { padding-left: 1rem; }
	.ingredients-label { margin-top: 5rem; }
	.section-lede { max-width: 42rem; color: var(--muted); font-size: 0.78rem; line-height: 1.7; }
	.ingredients { display: grid; margin-top: 1.5rem; grid-template-columns: repeat(2, 1fr); border-top: 1px solid var(--line); }
	.ingredients a { display: grid; padding: 0.85rem 0; grid-template-columns: 2rem 1fr auto; border-bottom: 1px solid var(--line); color: var(--ink); text-decoration: none; }.ingredients a:nth-child(odd) { padding-right: 1rem; }.ingredients a:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--line); }
	.ingredients span { color: var(--green); font-family: var(--font-mono); font-size: 0.5rem; }.ingredients strong { font-size: 0.72rem; }.ingredients b { color: var(--faint); font-size: 0.65rem; }
	aside { display: grid; align-content: start; gap: 0.8rem; }
	.aside-card { padding: 1.2rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); }
	.aside-card h3 { margin: 0.6rem 0; font-size: 1rem; }.aside-card > p { color: var(--muted); font-size: 0.66rem; line-height: 1.55; }
	.renderer-toggle { display: flex; width: fit-content; margin: 1rem 0 0.55rem; padding: 0.2rem; border: 1px solid var(--line); border-radius: 0.4rem; }
	.renderer-toggle button { padding: 0.38rem 0.55rem; border: 0; border-radius: 0.25rem; background: transparent; color: var(--muted); cursor: pointer; font-size: 0.58rem; font-weight: 700; }.renderer-toggle button.active { background: var(--ink); color: white; }
	.install-card .local-note { margin-bottom: 0; color: var(--faint); font-size: 0.53rem; }
	.install-card .local-note a { color: var(--green-dark); }
	dl { margin: 0.7rem 0 0; }dl div { display: flex; padding: 0.6rem 0; justify-content: space-between; border-bottom: 1px solid var(--line); font-size: 0.62rem;}dl div:last-child { border: 0; }dt { color: var(--muted); }dd { margin: 0; font-family: var(--font-mono); font-size: 0.55rem; text-transform: capitalize; }
	.next-card { display: grid; padding: 1.2rem; gap: 0.55rem; border-radius: 0.65rem; background: var(--ink); color: white; text-decoration: none; }.next-card small { color: var(--acid); font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.1em; }.next-card strong { display: flex; justify-content: space-between; font-size: 0.75rem; }
	@media (max-width: 980px) { .template-hero { grid-template-columns: 0.85fr 1.15fr; gap: 3vw; } .detail-grid { grid-template-columns: 1fr; } aside { grid-template-columns: 1fr 1fr; } .next-card { grid-column: 1 / -1; } }
	@media (max-width: 720px) { .template-hero { padding-top: 2rem; grid-template-columns: 1fr; } .preview-studio { margin-top: 1rem; } .theme-strip { align-items: start; flex-direction: column; gap: 0.75rem; } .theme-strip nav { grid-template-columns: repeat(3, 1fr); } .renderers { grid-template-columns: 1fr; } }
	@media (max-width: 520px) { .hero-actions { flex-direction: column; }.hero-actions a { text-align: center; } .ingredients { grid-template-columns: 1fr; }.ingredients a:nth-child(odd), .ingredients a:nth-child(even) { padding: 0.85rem 0; border-left: 0; } aside { grid-template-columns: 1fr; } .next-card { grid-column: auto; } }
</style>
