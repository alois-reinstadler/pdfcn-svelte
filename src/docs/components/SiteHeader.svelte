<script lang="ts">
	import { base } from '$app/paths';
	import { repositoryUrl } from '../site';
	import Mark from './Mark.svelte';

	let open = $state(false);
</script>

<header class="site-header">
	<div class="header-inner">
		<a class="brand" href={`${base}/`} aria-label="pdfcn Svelte home">
			<Mark compact />
			<span>pdfcn<span class="brand-separator">/</span>svelte</span>
			<span class="version">v0.1</span>
		</a>

		<nav class="desktop-nav" aria-label="Main navigation">
			<a href={`${base}/docs`}>Docs</a>
			<a href={`${base}/components`}>Components</a>
			<a href={`${base}/templates`}>Templates</a>
		</nav>

		<div class="header-actions">
			<a class="github" href={repositoryUrl} aria-label="View pdfcn-svelte on GitHub">
				<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
			</a>
			<a class="start" href={`${base}/docs/getting-started`}>Get started <span>→</span></a>
			<button class="menu" aria-label="Toggle menu" aria-expanded={open} onclick={() => (open = !open)}>
				<span></span><span></span>
			</button>
		</div>
	</div>

	{#if open}
		<nav class="mobile-nav" aria-label="Mobile navigation">
			<a href={`${base}/docs`} onclick={() => (open = false)}>Docs</a>
			<a href={`${base}/components`} onclick={() => (open = false)}>Components</a>
			<a href={`${base}/templates`} onclick={() => (open = false)}>Templates</a>
			<a href={`${base}/docs/getting-started`} onclick={() => (open = false)}>Get started</a>
		</nav>
	{/if}
</header>

<style>
	.site-header { position: sticky; z-index: 50; top: 0; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--canvas) 92%, transparent); backdrop-filter: blur(16px); }
	.header-inner { display: flex; width: min(100% - 2rem, 82rem); height: 4.25rem; margin: 0 auto; align-items: center; }
	.brand { display: flex; align-items: center; gap: 0.7rem; color: var(--ink); font-family: var(--font-display); font-size: 1.02rem; font-weight: 800; letter-spacing: -0.04em; text-decoration: none; }
	.brand-separator { margin: 0 0.12rem; color: var(--green); }
	.version { padding: 0.2rem 0.38rem; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-family: var(--font-mono); font-size: 0.58rem; font-weight: 600; letter-spacing: 0; }
	.desktop-nav { display: flex; margin-left: 3.5rem; gap: 2rem; }
	.desktop-nav a { color: var(--muted); font-size: 0.82rem; font-weight: 650; text-decoration: none; }
	.desktop-nav a:hover { color: var(--ink); }
	.header-actions { display: flex; margin-left: auto; align-items: center; gap: 0.65rem; }
	.github { display: grid; width: 2.15rem; height: 2.15rem; place-items: center; color: var(--ink); }
	.github svg { width: 1.15rem; fill: currentColor; }
	.start { display: flex; align-items: center; gap: 0.5rem; padding: 0.67rem 0.9rem; border-radius: 0.45rem; background: var(--ink); color: white; font-size: 0.74rem; font-weight: 700; text-decoration: none; }
	.start span { color: var(--acid); }
	.menu { display: none; width: 2.5rem; height: 2.5rem; border: 0; background: none; }
	.menu span { display: block; width: 1.25rem; height: 1px; margin: 0.3rem auto; background: var(--ink); }
	.mobile-nav { display: none; }
	@media (max-width: 720px) {
		.header-inner { width: min(100% - 1.25rem, 82rem); }
		.desktop-nav, .github, .start { display: none; }
		.menu { display: block; }
		.mobile-nav { display: grid; padding: 0.5rem 1rem 1.1rem; border-top: 1px solid var(--line); background: var(--canvas); }
		.mobile-nav a { padding: 0.7rem 0.25rem; color: var(--ink); font-size: 0.9rem; font-weight: 650; text-decoration: none; }
	}
</style>
