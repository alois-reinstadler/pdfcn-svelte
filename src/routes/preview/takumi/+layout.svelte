<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<style>
	:global(.site-header) { display: none; }
	:global(body) { overflow-x: hidden; background: #e9ebe8; }
	:global(main) { min-height: 0; }
</style>
