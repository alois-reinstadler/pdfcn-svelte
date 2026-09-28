<script lang="ts">
	import type { Snippet } from 'svelte';
	import SiteHeader from '../docs/components/SiteHeader.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>pdfcn / svelte — composable PDF documents</title>
	<meta name="description" content="A Svelte 5 document component library with 24 components, 10 templates, themes, and two PDF renderer bases." />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<SiteHeader />
<main id="main-content" tabindex="-1">{@render children()}</main>

<style>
	.skip-link { position: fixed; z-index: 100; top: -5rem; left: 1rem; padding: 0.8rem 1rem; background: var(--ink); color: white; border-radius: 0.3rem; }
	.skip-link:focus { top: 0.5rem; }
	:global(*) { box-sizing: border-box; }
	:global(:root) {
		--canvas: #f5f4ee;
		--paper: #fffefa;
		--paper-deep: #eeece3;
		--ink: #14261e;
		--copy: #34473e;
		--muted: #63736b;
		--faint: #89958f;
		--line: #dcded7;
		--green: #237f55;
		--green-dark: #176340;
		--green-wash: #e7f2eb;
		--acid: #c8ed45;
		--font-display: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		--font-body: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		--font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
		font-family: var(--font-body);
		color: var(--ink);
		background: var(--canvas);
		font-synthesis: none;
	}
	:global(html) { scroll-behavior: smooth; }
	:global(body) { min-width: 320px; margin: 0; background: var(--canvas); }
	:global(button), :global(input) { font: inherit; }
	:global(::selection) { background: var(--acid); color: var(--ink); }
	main { min-height: calc(100vh - 4.25rem); }
</style>
