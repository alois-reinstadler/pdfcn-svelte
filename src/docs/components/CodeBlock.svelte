<script lang="ts">
	let { code, label = 'svelte' }: { code: string; label?: string } = $props();
</script>

<div class="code-block">
	<div class="code-head"><span>{label}</span><span class="dots">•••</span></div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.code-block { margin: 1.25rem 0 1.75rem; overflow: hidden; border: 1px solid #263c33; border-radius: 0.62rem; background: #12241d; box-shadow: 0 10px 30px rgb(15 34 27 / 0.1); }
	.code-head { display: flex; padding: 0.62rem 0.85rem; align-items: center; justify-content: space-between; border-bottom: 1px solid #294137; color: #89a397; font-family: var(--font-mono); font-size: 0.59rem; letter-spacing: 0.08em; text-transform: uppercase; }
	.dots { color: var(--acid); letter-spacing: 0.18em; }
	pre { margin: 0; padding: 1.1rem 1.2rem 1.25rem; overflow-x: auto; color: #d8e6de; font-family: var(--font-mono); font-size: 0.74rem; line-height: 1.7; tab-size: 2; }
</style>
