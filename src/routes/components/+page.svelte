<script lang="ts">
	import { componentCategories, components, type CatalogItem } from '../../docs/catalog';

	type Filter = 'All' | CatalogItem['category'];
	const filters: readonly Filter[] = ['All', ...componentCategories];
	let query = $state('');
	let filter = $state<Filter>('All');
	let visible = $derived(
		components.filter((component) =>
			(filter === 'All' || component.category === filter) &&
			(component.name.toLowerCase().includes(query.toLowerCase()) ||
				component.description.toLowerCase().includes(query.toLowerCase()))
		)
	);
</script>

<svelte:head>
	<title>Components — pdfcn / svelte</title>
	<meta name="description" content="Explore all 24 themed pdfcn-svelte document component families." />
</svelte:head>

<section class="catalog-head">
	<div class="head-inner">
		<p>Component library</p>
		<h1>Small pieces.<br /><em>Complete documents.</em></h1>
		<div class="intro"><p>Twenty-four themed component families, implemented for both Forme and Takumi. Compose them freely within one renderer base.</p><span><strong>24</strong> × 2 bases</span></div>
	</div>
</section>

<section class="catalog-wrap">
	<div class="toolbar">
		<label><span class="sr-only">Search components</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg><input bind:value={query} type="search" placeholder="Search components…" /></label>
		<div class="filters" aria-label="Filter by category">
			{#each filters as category}
				<button class:active={filter === category} onclick={() => (filter = category)}>{category}</button>
			{/each}
		</div>
	</div>

	<div class="result-line"><span>{visible.length.toString().padStart(2, '0')} components</span><i></i><span>Forme + Takumi</span></div>

	{#if visible.length}
		<div class="component-grid">
			{#each visible as component, index}
				<a href={`/components/${component.slug}`} class="component-card">
					<div class="preview type-{component.category.toLowerCase()}">
						{#if component.category === 'Content'}
							<div class="content-demo"><span></span><strong>{component.name}</strong><i></i><i></i></div>
						{:else if component.category === 'Layout'}
							<div class="layout-demo"><span></span><span></span><span></span></div>
						{:else if component.category === 'Data'}
							<div class="data-demo"><span></span><i></i><i></i><i></i><i></i><b></b><b></b><b></b><b></b></div>
						{:else}
							<div class="document-demo"><small>{index + 1}</small><span></span><span></span><span></span></div>
						{/if}
					</div>
					<div class="meta"><div><small>{component.category}</small><strong>{component.name}</strong><p>{component.description}</p></div><span>↗</span></div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="empty"><strong>No components found</strong><p>Try a different name or category.</p><button onclick={() => { query = ''; filter = 'All'; }}>Clear filters</button></div>
	{/if}
</section>

<footer><div><strong>Need a complete document?</strong><p>Start from one of ten invoice and report templates.</p></div><a href="/templates">Explore templates <span>→</span></a></footer>

<style>
	.catalog-head { padding: 6rem 0 4.5rem; border-bottom: 1px solid var(--line); background-image: radial-gradient(var(--line) 0.7px, transparent 0.7px); background-size: 18px 18px; }
	.head-inner, .catalog-wrap { width: min(100% - 2rem, 76rem); margin: 0 auto; }
	.head-inner > p { margin: 0 0 1rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.63rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
	h1 { margin: 0; font-family: var(--font-display); font-size: clamp(3.4rem, 8vw, 6.3rem); font-weight: 780; letter-spacing: -0.08em; line-height: 0.88; }
	h1 em { color: var(--green); font-family: Georgia, serif; font-weight: 400; }
	.intro { display: flex; max-width: 44rem; margin: 2.2rem 0 0 auto; align-items: end; justify-content: space-between; gap: 2rem; }
	.intro p { max-width: 30rem; margin: 0; color: var(--copy); font-size: 0.9rem; line-height: 1.7; }
	.intro > span { display: grid; color: var(--muted); font-family: var(--font-mono); font-size: 0.57rem; text-align: right; text-transform: uppercase; }
	.intro strong { color: var(--ink); font-family: var(--font-display); font-size: 1.8rem; letter-spacing: -0.05em; }
	.catalog-wrap { padding: 2.5rem 0 7rem; }
	.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.toolbar label { display: flex; width: 16rem; height: 2.4rem; padding: 0 0.7rem; align-items: center; gap: 0.5rem; border: 1px solid var(--line); border-radius: 0.42rem; background: var(--paper); }
	.toolbar svg { width: 0.9rem; fill: none; stroke: var(--faint); stroke-width: 1.5; }
	.toolbar input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 0.7rem; }
	.toolbar input::placeholder { color: var(--faint); }
	.filters { display: flex; gap: 0.25rem; }
	.filters button { padding: 0.55rem 0.72rem; border: 0; border-radius: 0.35rem; background: transparent; color: var(--muted); font-size: 0.66rem; font-weight: 650; cursor: pointer; }
	.filters button.active { background: var(--ink); color: white; }
	.result-line { display: flex; margin: 2rem 0 1rem; align-items: center; gap: 0.7rem; color: var(--faint); font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; }
	.result-line i { flex: 1; height: 1px; background: var(--line); }
	.component-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }
	.component-card { overflow: hidden; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--paper); color: var(--ink); text-decoration: none; transition: transform 160ms ease, box-shadow 160ms ease; }
	.component-card:hover { box-shadow: 0 15px 30px rgb(20 38 30 / 0.1); transform: translateY(-3px); }
	.preview { display: grid; height: 11rem; padding: 1.4rem; place-items: center; border-bottom: 1px solid var(--line); background: #eff1ec; }
	.content-demo { display: grid; width: 75%; padding: 1.1rem; gap: 0.45rem; border: 1px solid #b8cec1; border-radius: 0.45rem; background: white; box-shadow: 0 8px 18px rgb(20 38 30 / 0.08); }
	.content-demo span { width: 1.1rem; height: 0.25rem; border-radius: 9px; background: var(--green); }
	.content-demo strong { font-family: Georgia, serif; font-size: 0.68rem; }
	.content-demo i { height: 0.2rem; background: #d7ddd9; }.content-demo i:last-child { width: 65%; }
	.layout-demo { display: flex; width: 80%; height: 6.5rem; padding: 0.7rem; gap: 0.45rem; border: 1px solid #b8cec1; border-radius: 0.5rem; background: white; }
	.layout-demo span { flex: 1; border-radius: 0.25rem; background: #d9e8df; }.layout-demo span:nth-child(2) { background: #9bc6ad; }
	.data-demo { display: grid; width: 82%; grid-template-columns: 1fr 0.6fr; border: 1px solid #b8cec1; border-radius: 0.35rem; background: white; }
	.data-demo span { grid-column: 1 / -1; height: 1.35rem; background: var(--green); }
	.data-demo i, .data-demo b { height: 1.1rem; border-right: 1px solid #dfe4e1; border-bottom: 1px solid #dfe4e1; }.data-demo b { background: #f7f8f6; }
	.document-demo { position: relative; display: grid; width: 5.2rem; height: 7rem; padding: 1rem; align-content: start; gap: 0.45rem; background: white; box-shadow: 0 7px 18px rgb(20 38 30 / 0.12); }
	.document-demo small { position: absolute; right: 0.4rem; bottom: 0.3rem; color: var(--faint); font-family: var(--font-mono); font-size: 0.42rem; }
	.document-demo span { height: 0.18rem; background: #cbd5cf; }.document-demo span:first-of-type { width: 60%; height: 0.4rem; margin-bottom: 0.35rem; background: var(--green); }
	.meta { display: flex; min-height: 8.3rem; padding: 1rem; justify-content: space-between; }
	.meta > div { display: flex; flex-direction: column; align-items: flex-start; }
	.meta small { color: var(--green-dark); font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.09em; text-transform: uppercase; }
	.meta strong { margin-top: 0.38rem; font-size: 0.8rem; }
	.meta p { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.65rem; line-height: 1.45; }
	.meta > span { color: var(--green); }
	.empty { padding: 5rem 1rem; border: 1px dashed var(--line); text-align: center; }
	.empty p { color: var(--muted); font-size: 0.75rem; }.empty button { padding: 0.55rem 0.8rem; border: 0; border-radius: 0.35rem; background: var(--ink); color: white; font-size: 0.66rem; cursor: pointer; }
	footer { display: flex; padding: 4rem max(1rem, calc((100% - 76rem) / 2)); align-items: center; justify-content: space-between; background: var(--ink); color: white; }
	footer strong { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: -0.04em; }
	footer p { margin: 0.4rem 0 0; color: #96aaa0; font-size: 0.72rem; }
	footer a { padding-bottom: 0.35rem; border-bottom: 1px solid var(--acid); color: white; font-size: 0.72rem; font-weight: 700; text-decoration: none; }footer a span { margin-left: 1rem; color: var(--acid); }
	.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
	@media (max-width: 820px) { .component-grid { grid-template-columns: 1fr 1fr; }.toolbar { align-items: stretch; flex-direction: column; }.toolbar label { width: 100%; }.filters { overflow-x: auto; }.filters button { flex: 0 0 auto; } }
	@media (max-width: 560px) { .catalog-head { padding: 4rem 0 3rem; }.head-inner, .catalog-wrap { width: min(100% - 1.25rem, 76rem); }.intro { align-items: start; flex-direction: column; }.intro > span { text-align: left; }.component-grid { grid-template-columns: 1fr; }footer { align-items: flex-start; flex-direction: column; gap: 2rem; } }
</style>
