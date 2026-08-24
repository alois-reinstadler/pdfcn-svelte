<script lang="ts">
	import { base } from '$app/paths';
	import TemplateFrame from '../../docs/components/TemplateFrame.svelte';
	import { documentRecipes, documentTemplates } from '../../docs/template-showcase';

	type Filter = 'All' | 'Invoice' | 'Report';
	let filter = $state<Filter>('All');
	const visibleTemplates = $derived(
		filter === 'All' ? documentTemplates : documentTemplates.filter((item) => item.kind === filter)
	);
</script>

<svelte:head>
	<title>Document templates — pdfcn / svelte</title>
	<meta name="description" content="Explore ten live Svelte document templates for invoices, financial reports, marketing reports, operations, and security." />
</svelte:head>

<section class="intro">
	<div class="intro-inner">
		<div>
			<p class="eyebrow">Document gallery</p>
			<h1>Start from something<br /><em>worth shipping.</em></h1>
		</div>
		<div class="intro-copy">
			<p>Ten complete documents, built from the same composable primitives available in the registry. Open any template to inspect its ingredients, change its theme, or install the source.</p>
			<div class="legend"><span><i class="live"></i> Browser-native PDF previews</span><span>Forme + Takumi source</span></div>
		</div>
	</div>
</section>

<section class="gallery-wrap" aria-labelledby="gallery-title">
	<div class="gallery-top">
		<div><p class="eyebrow">The collection</p><h2 id="gallery-title">10 production-ready foundations</h2></div>
		<div class="filters" aria-label="Filter templates">
			{#each ['All', 'Invoice', 'Report'] as option}
				<button class:active={filter === option} type="button" onclick={() => (filter = option as Filter)}>{option}</button>
			{/each}
		</div>
	</div>

	<div class="template-grid">
		{#each visibleTemplates as template}
			<a class="template-card" href={`${base}/templates/${template.slug}`}>
				<div class="preview"><TemplateFrame slug={template.slug} title={template.name} theme={template.theme} compact /></div>
				<div class="card-copy">
					<div class="card-label"><span>{template.kind}</span><i></i><span>{template.tone}</span></div>
					<h3>{template.name}<span aria-hidden="true">↗</span></h3>
					<p>{template.description}</p>
					<div class="tags"><span>{template.theme}</span><span>{template.components.length} components</span></div>
				</div>
			</a>
		{/each}
	</div>
</section>

<section class="possibilities" aria-labelledby="possibilities-title">
	<div class="possibilities-inner">
		<div class="possibilities-heading">
			<p class="eyebrow inverse">Go beyond templates</p>
			<h2 id="possibilities-title">A document system,<br />not an invoice kit.</h2>
			<p>Use the primitives as a vocabulary. These are a few natural next documents—not locked templates.</p>
			<a href={`${base}/components`}>Browse all components <span>→</span></a>
		</div>
		<div class="recipe-list">
			{#each documentRecipes as recipe, index}
				<article>
					<span class="number">{String(index + 1).padStart(2, '0')}</span>
					<div><h3>{recipe.name}</h3><p>{recipe.description}</p><div>{#each recipe.components as component}<code>{component}</code>{/each}</div></div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.intro { border-bottom: 1px solid var(--line); background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 52px 52px; }
	.intro-inner { display: grid; width: min(100% - 2rem, 76rem); min-height: 28rem; margin: 0 auto; padding: 5.5rem 0; grid-template-columns: 1.25fr 0.75fr; align-items: end; gap: 7vw; }
	.eyebrow { margin: 0 0 1rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
	h1 { margin: 0; font-family: var(--font-display); font-size: clamp(3.5rem, 7vw, 6.4rem); font-weight: 780; letter-spacing: -0.08em; line-height: 0.87; }
	h1 em { color: var(--green); font-family: Georgia, serif; font-weight: 400; }
	.intro-copy > p { margin: 0; color: var(--copy); font-family: Georgia, serif; font-size: 1.08rem; line-height: 1.7; }
	.legend { display: flex; margin-top: 1.5rem; flex-wrap: wrap; gap: 1rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.56rem; letter-spacing: 0.04em; text-transform: uppercase; }
	.legend span { display: flex; align-items: center; gap: 0.4rem; }
	.live { display: block; width: 0.42rem; height: 0.42rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px var(--green-wash); }
	.gallery-wrap { width: min(100% - 2rem, 76rem); margin: 0 auto; padding: 6rem 0 8rem; }
	.gallery-top { display: flex; margin-bottom: 2rem; align-items: end; justify-content: space-between; gap: 2rem; }
	.gallery-top .eyebrow { margin-bottom: 0.6rem; }
	h2 { margin: 0; font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.5rem); letter-spacing: -0.06em; line-height: 1; }
	.filters { display: flex; padding: 0.25rem; border: 1px solid var(--line); border-radius: 0.55rem; background: var(--paper); }
	.filters button { padding: 0.5rem 0.75rem; border: 0; border-radius: 0.36rem; background: transparent; color: var(--muted); cursor: pointer; font-size: 0.68rem; font-weight: 700; }
	.filters button.active { background: var(--ink); color: white; }
	.template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
	.template-card { display: block; min-width: 0; padding: 0.7rem; border: 1px solid var(--line); border-radius: 0.75rem; background: var(--paper); color: var(--ink); text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease; }
	.template-card:hover { border-color: #b7c8bd; box-shadow: 0 1.4rem 3rem rgb(20 38 30 / 0.11); transform: translateY(-4px); }
	.template-card:focus-visible { outline: 3px solid var(--acid); outline-offset: 3px; }
	.preview { overflow: hidden; max-height: 25rem; border-radius: 0.45rem; background: #e3e7e3; }
	.card-copy { padding: 1rem 0.55rem 0.55rem; }
	.card-label { display: flex; align-items: center; gap: 0.5rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.53rem; font-weight: 750; letter-spacing: 0.08em; text-transform: uppercase; }
	.card-label i { width: 2px; height: 2px; border-radius: 50%; background: var(--faint); }
	.card-copy h3 { display: flex; margin: 0.65rem 0 0.4rem; align-items: center; justify-content: space-between; font-size: 1.02rem; letter-spacing: -0.025em; }
	.card-copy h3 span { color: var(--faint); font-size: 0.8rem; font-weight: 400; }
	.card-copy p { min-height: 2.5rem; margin: 0; color: var(--muted); font-size: 0.7rem; line-height: 1.55; }
	.tags { display: flex; margin-top: 0.9rem; flex-wrap: wrap; gap: 0.35rem; }
	.tags span { padding: 0.3rem 0.42rem; border-radius: 999px; background: var(--paper-deep); color: var(--muted); font-family: var(--font-mono); font-size: 0.49rem; text-transform: capitalize; }
	.possibilities { background: var(--ink); color: white; }
	.possibilities-inner { display: grid; width: min(100% - 2rem, 76rem); margin: 0 auto; padding: 7rem 0; grid-template-columns: 0.72fr 1.28fr; gap: 8vw; }
	.inverse { color: var(--acid); }
	.possibilities-heading { position: sticky; top: 7rem; height: fit-content; }
	.possibilities-heading h2 { font-size: clamp(2.5rem, 5vw, 4.5rem); }
	.possibilities-heading > p:last-of-type { max-width: 26rem; margin: 1.5rem 0; color: #aebdb5; font-family: Georgia, serif; line-height: 1.65; }
	.possibilities-heading a { display: inline-flex; padding-bottom: 0.35rem; gap: 1rem; border-bottom: 1px solid var(--acid); color: white; font-size: 0.72rem; font-weight: 750; text-decoration: none; }
	.possibilities-heading a span { color: var(--acid); }
	.recipe-list { border-top: 1px solid #405249; }
	.recipe-list article { display: grid; padding: 1.5rem 0; grid-template-columns: 2.5rem 1fr; border-bottom: 1px solid #405249; }
	.number { color: var(--acid); font-family: var(--font-mono); font-size: 0.56rem; }
	.recipe-list h3 { margin: 0; font-family: var(--font-display); font-size: 1.25rem; letter-spacing: -0.03em; }
	.recipe-list p { margin: 0.35rem 0 0.85rem; color: #aebdb5; font-size: 0.73rem; line-height: 1.55; }
	.recipe-list article div div { display: flex; flex-wrap: wrap; gap: 0.35rem; }
	.recipe-list code { padding: 0.25rem 0.38rem; border: 1px solid #405249; border-radius: 0.25rem; color: #dbe6df; font-family: var(--font-mono); font-size: 0.5rem; }
	@media (max-width: 900px) { .template-grid { grid-template-columns: repeat(2, 1fr); } .intro-inner { grid-template-columns: 1fr; align-content: end; } .intro-copy { max-width: 36rem; } .possibilities-inner { grid-template-columns: 1fr; } .possibilities-heading { position: static; } }
	@media (max-width: 580px) { .intro-inner { min-height: 30rem; padding: 4rem 0; } .gallery-top { align-items: start; flex-direction: column; } .template-grid { grid-template-columns: 1fr; } .preview { max-height: none; } .possibilities-inner { padding: 5rem 0; } }
</style>
