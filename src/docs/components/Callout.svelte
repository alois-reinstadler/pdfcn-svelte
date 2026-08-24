<script lang="ts">
	import type { Snippet } from 'svelte';
	let { title, tone = 'note', children }: { title: string; tone?: 'note' | 'warning'; children: Snippet } = $props();
</script>

<aside class:warning={tone === 'warning'}>
	<span aria-hidden="true">{tone === 'warning' ? '!' : 'i'}</span>
	<div><strong>{title}</strong><div class="body">{@render children()}</div></div>
</aside>

<style>
	aside { display: flex; margin: 1.5rem 0; padding: 1rem 1.1rem; gap: 0.8rem; border: 1px solid #b9d9c9; border-radius: 0.6rem; background: var(--green-wash); }
	aside > span { display: grid; flex: 0 0 auto; width: 1.25rem; height: 1.25rem; place-items: center; border-radius: 50%; background: var(--green); color: white; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 800; }
	strong { display: block; color: var(--ink); font-size: 0.8rem; }
	.body :global(p) { margin: 0.25rem 0 0; color: var(--copy); font-size: 0.78rem; line-height: 1.65; }
	aside.warning { border-color: #e2c893; background: #fff9e8; }
	aside.warning > span { background: #a76916; }
</style>
