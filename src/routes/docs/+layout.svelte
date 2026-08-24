<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import DocsSidebar from '../../docs/components/DocsSidebar.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="docs-shell">
	<div class="sidebar"><DocsSidebar pathname={page.url.pathname} /></div>
	{@render children()}
</div>

<style>
	.docs-shell { display: grid; width: min(100% - 2rem, 76rem); margin: 0 auto; padding-top: 3.5rem; grid-template-columns: 12.5rem minmax(0, 1fr); gap: clamp(3rem, 8vw, 7rem); }
	@media (max-width: 800px) { .docs-shell { width: min(100% - 1.25rem, 76rem); padding-top: 1.5rem; grid-template-columns: 1fr; gap: 2rem; } }
</style>
