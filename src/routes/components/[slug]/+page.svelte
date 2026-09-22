<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '../../../docs/components/CodeBlock.svelte';
	import { registryInstallCommand } from '../../../docs/site';
	import { components } from '../../../docs/catalog';
	import api from '../../../docs/component-api.json';
	import {
		exampleSources,
		exampleComponents,
		packageSource,
		componentNotes,
		pdfOnly
	} from '../../../docs/component-examples';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let renderer = $state<'takumi' | 'forme'>('takumi');
	const slug = $derived(data.component.slug);
	const source = $derived(
		packageSource(exampleSources[`./examples/${renderer}/${slug}.svelte`])
	);
	const Preview = $derived(
		exampleComponents[`./examples/takumi/${slug}.svelte`]
	);
	const reference = $derived(
		(
			api[renderer] as Record<
				string,
				{ declarations: string; defaults: string }
			>
		)[slug]
	);
	const related = $derived(
		components
			.filter((c) => c.category === data.component.category && c.slug !== slug)
			.slice(0, 4)
	);
</script>

<svelte:head
	><title>{data.component.name} — pdfcn / svelte</title><meta
		name="description"
		content={data.component.description}
	/></svelte:head
>

<main class="component-doc">
	<nav aria-label="Breadcrumb">
		<a href={`${base}/components`}>Components</a> /
		<span aria-current="page">{data.component.name}</span>
	</nav>
	<header>
		<p class="eyebrow">{data.component.category}</p>
		<h1>{data.component.name}</h1>
		<p class="lede">{data.component.description}</p>
	</header>
	<div class="renderer-switch" aria-label="Example renderer">
		<button
			type="button"
			aria-pressed={renderer === 'takumi'}
			onclick={() => (renderer = 'takumi')}>Takumi</button
		>
		<button
			type="button"
			aria-pressed={renderer === 'forme'}
			onclick={() => (renderer = 'forme')}>Forme</button
		>
	</div>
	<section aria-labelledby="usage">
		<h2 id="usage">Usage</h2>
		<p>
			Save this complete file as <code>src/lib/Example.svelte</code>. Follow
			<a href={`${base}/docs/getting-started`}>Getting started</a> to install this
			renderer and return its PDF from a server endpoint.
		</p>
		<CodeBlock code={source} label="src/lib/Example.svelte" />
	</section>
	<section aria-labelledby="output">
		<h2 id="output">Output</h2>
		<p>
			<a
				href={`${base}/previews/components/${renderer}/${slug}.pdf`}
				target="_blank"
				rel="noreferrer"
				>Open the generated {renderer === 'forme' ? 'Forme' : 'Takumi'} example PDF</a
			>. Generated from the exact example above.
		</p>
		{#if renderer === 'takumi' && !pdfOnly.has(slug)}
			<p class="preview-label">
				Live Takumi HTML preview — PDF pagination and font metrics may differ.
			</p>
			<div class="preview-scroll">
				<div class="preview-canvas"><Preview /></div>
			</div>
		{:else}
			<p class="note">
				Use the generated PDF to inspect physical pages and renderer-specific
				placement. This component is shown in its full document context.
			</p>
		{/if}
	</section>
	<section aria-labelledby="notes">
		<h2 id="notes">Behavior and renderer notes</h2>
		<p>
			{componentNotes[slug] ??
				'The example uses the Professional theme with a built-in renderer font fallback. Named colors resolve against theme tokens. style accepts renderer-native overrides; use the same base for every component in a document tree.'}
		</p>
		<p>
			Theme context is set when the document is created. Recreate the document
			to switch its theme. Numeric dimensions and spacing use points; browser
			CSS is converted to pixels by the Takumi wrappers.
		</p>
		<a href={`${base}/docs/renderers`}>Renderer tradeoffs and pagination</a>
	</section>
	<section aria-labelledby="api">
		<h2 id="api">Props and variants</h2>
		<p>
			These definitions come directly from the selected renderer source. A <code
				>?</code
			>
			marks an optional prop. <code>Snippet</code> is Svelte content;
			<code>Style</code>
			is a renderer-native style object. Internal props prefixed with
			<code>_</code> should usually be left to the component.
		</p>
		<CodeBlock
			label="Shared base types"
			code={'type Style = Record<string, unknown>;\ninterface PDFComponentProps { style?: Style; children?: Snippet; }'}
		/>
		<CodeBlock
			label={`${renderer} public types`}
			code={reference.declarations}
		/>
		<details>
			<summary>Runtime defaults</summary>
			<p>
				Defaults below are extracted from the actual props declaration. Props
				without an initializer defer to theme or variant styles, or remain
				unset. Renderer notes above identify accepted props that have no effect.
			</p>
			<CodeBlock label="Defaults from source" code={reference.defaults} />
		</details>
	</section>
	<section aria-labelledby="install">
		<h2 id="install">Copy the source</h2>
		<p>
			First <a href={`${base}/docs/registry`}>initialize components.json</a> in your
			SvelteKit project, then install this item. Copied source uses local imports
			rather than package names.
		</p>
		<CodeBlock label="terminal" code={registryInstallCommand(renderer, slug)} />
		<CodeBlock
			label="Local component import"
			code={`import Component from '$lib/bases/${renderer}/components/${slug}/${slug}.svelte';`}
		/>
	</section>
	<footer>
		<h2>Related components</h2>
		<nav aria-label="Related components">
			{#each related as item (item.slug)}<a
					href={`${base}/components/${item.slug}`}>{item.name}</a
				>{/each}<a href={`${base}/templates`}>Document templates</a>
		</nav>
	</footer>
</main>

<style>
	.component-doc {
		width: min(100% - 2rem, 64rem);
		margin: auto;
		padding: 2rem 0 6rem;
		min-width: 0;
	}
	header {
		padding: 3rem 0 2rem;
	}
	h1 {
		font-family: var(--font-display);
		font-size: clamp(3rem, 8vw, 6rem);
		letter-spacing: -0.065em;
		line-height: 1;
		margin: 0.5rem 0 1rem;
	}
	.eyebrow,
	.preview-label {
		color: var(--green-dark);
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}
	.lede {
		font-size: 1.1rem;
	}
	p {
		color: var(--copy);
		line-height: 1.7;
		max-width: 54rem;
	}
	a {
		color: var(--green-dark);
		text-underline-offset: 0.2em;
	}
	section {
		margin: 3rem 0;
		min-width: 0;
	}
	h2 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		letter-spacing: -0.03em;
	}
	code {
		overflow-wrap: anywhere;
	}
	.renderer-switch {
		display: flex;
		gap: 0.5rem;
	}
	button {
		padding: 0.7rem 1rem;
		border: 1px solid var(--line);
		border-radius: 0.4rem;
		color: var(--ink);
		background: var(--paper);
		cursor: pointer;
	}
	button[aria-pressed='true'] {
		background: var(--green);
		color: white;
	}
	:is(a, button, summary):focus-visible {
		outline: 3px solid var(--green);
		outline-offset: 4px;
	}
	.preview-scroll {
		overflow: auto;
		max-width: 100%;
		border: 1px solid var(--line);
		border-radius: 0.5rem;
		background: white;
	}
	.preview-canvas {
		padding: 24px;
		min-width: 640px;
		color: #111;
	}
	.note {
		padding: 1rem;
		background: var(--paper-deep);
		border-left: 3px solid var(--green);
	}
	summary {
		cursor: pointer;
		font-weight: 600;
	}
	footer {
		border-top: 1px solid var(--line);
		padding-top: 2rem;
	}
	footer nav {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
</style>
