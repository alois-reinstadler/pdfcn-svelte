<script lang="ts">
	import { providePdfcnTheme } from '$lib/theme-provider.svelte';
	import { professionalTheme } from '$lib/themes/professional';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';
	import type { Snippet } from 'svelte';

	let {
		theme = professionalTheme,
		children
	}: {
		theme?: PdfcnTheme;
		children?: Snippet;
	} = $props();

	// The theme is captured once at initialisation — context is intentionally static.
	// svelte-ignore state_referenced_locally
	providePdfcnTheme(theme);
</script>

{@render children?.()}
