<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow = 'Documentation',
		title,
		description,
		children
	}: { eyebrow?: string; title: string; description: string; children: Snippet } = $props();
</script>

<article class="doc-page">
	<header>
		<p class="eyebrow">{eyebrow}</p>
		<h1>{title}</h1>
		<p class="lede">{description}</p>
	</header>
	<div class="content">{@render children()}</div>
</article>

<style>
	.doc-page { min-width: 0; max-width: 48rem; padding-bottom: 6rem; }
	header { padding-bottom: 2.25rem; border-bottom: 1px solid var(--line); }
	.eyebrow { margin: 0 0 1rem; color: var(--green-dark); font-family: var(--font-mono); font-size: 0.66rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
	h1 { margin: 0; font-family: var(--font-display); font-size: clamp(2.35rem, 6vw, 4rem); font-weight: 760; letter-spacing: -0.065em; line-height: 0.98; }
	.lede { max-width: 42rem; margin: 1.2rem 0 0; color: var(--muted); font-size: 1.02rem; line-height: 1.72; }
	.content { padding-top: 2.2rem; }
	.content :global(h2) { margin: 3rem 0 0.8rem; scroll-margin-top: 6rem; font-family: var(--font-display); font-size: 1.6rem; letter-spacing: -0.035em; }
	.content :global(h2:first-child) { margin-top: 0; }
	.content :global(h3) { margin: 2rem 0 0.65rem; font-size: 1rem; }
	.content :global(p), .content :global(li) { color: var(--copy); font-size: 0.9rem; line-height: 1.75; }
	.content :global(a) { color: var(--green-dark); font-weight: 650; text-underline-offset: 0.2rem; }
	.content :global(ul), .content :global(ol) { padding-left: 1.3rem; }
	.content :global(hr) { margin: 2.5rem 0; border: 0; border-top: 1px solid var(--line); }
	.content :global(code:not(pre code)) { padding: 0.13rem 0.32rem; border: 1px solid var(--line); border-radius: 0.25rem; background: var(--paper-deep); color: var(--green-dark); font-family: var(--font-mono); font-size: 0.78em; }
</style>
