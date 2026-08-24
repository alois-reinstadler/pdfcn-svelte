<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { themePresets, type ThemePresetName } from '$lib/themes';
	import { takumiTemplateAllowlist } from '../../../../docs/template-preview-allowlist';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let viewportWidth = $state(794);
	const requestedTheme = $derived(browser ? page.url.searchParams.get('theme') ?? 'professional' : 'professional');
	const themeName = $derived(
		Object.hasOwn(themePresets, requestedTheme) ? requestedTheme as ThemePresetName : 'professional'
	);
	const theme = $derived(themePresets[themeName]);
	const Preview = $derived(takumiTemplateAllowlist[data.slug]);
	const scale = $derived(Math.min(1, Math.max(0.22, (viewportWidth - 28) / 794)));
</script>

<svelte:head>
	<title>{data.slug} — Takumi live preview</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div
	class="viewport"
	bind:clientWidth={viewportWidth}
	style={`height: ${1123 * scale + 28}px; --preview-scale: ${scale}`}
>
	<div class="sheet"><Preview {theme} /></div>
</div>

<style>
	.viewport { position: relative; overflow: hidden; width: 100%; min-height: 20rem; padding-top: 14px; background: #e9ebe8; }
	.sheet { position: absolute; top: 14px; left: 50%; width: 794px; transform: translateX(-50%) scale(var(--preview-scale)); transform-origin: top center; filter: drop-shadow(0 12px 22px rgb(15 30 22 / 0.18)); }
	.sheet :global([data-pdf-page]) { overflow: hidden; background: white; }
	@media (prefers-reduced-motion: reduce) { .sheet { transition: none; } }
</style>
