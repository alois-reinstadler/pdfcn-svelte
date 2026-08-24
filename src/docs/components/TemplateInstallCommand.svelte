<script lang="ts">
	let { slug, renderer = 'takumi' }: { slug: string; renderer?: 'forme' | 'takumi' } = $props();
	let copied = $state(false);
	const command = $derived(`pnpm dlx shadcn-svelte@latest add http://localhost:5173/r/${renderer}/${slug}.json`);

	async function copy() {
		if (!globalThis.navigator?.clipboard) return;
		await navigator.clipboard.writeText(command);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}
</script>

<div class="command">
	<div><span>$</span><code>{command}</code></div>
	<button type="button" onclick={copy} aria-label="Copy registry install command">{copied ? 'Copied' : 'Copy'}</button>
</div>

<style>
	.command { display: flex; min-width: 0; padding: 0.7rem; align-items: center; gap: 0.75rem; border: 1px solid #344b40; border-radius: 0.55rem; background: #15271f; color: #dcebe2; }
	.command > div { display: flex; min-width: 0; align-items: center; gap: 0.65rem; }
	.command span { color: var(--acid); font-family: var(--font-mono); }
	code { overflow-x: auto; font-family: var(--font-mono); font-size: 0.66rem; white-space: nowrap; scrollbar-width: thin; }
	button { margin-left: auto; padding: 0.42rem 0.58rem; border: 1px solid #456052; border-radius: 0.35rem; background: #263d32; color: white; cursor: pointer; font-size: 0.62rem; font-weight: 700; }
	button:hover { border-color: var(--acid); }
</style>
