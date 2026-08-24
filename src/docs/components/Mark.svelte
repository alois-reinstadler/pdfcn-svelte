<script lang="ts">
	let { compact = false }: { compact?: boolean } = $props();
</script>

<span class:compact class="mark" aria-hidden="true">
	<span class="page"><span></span><span></span><span></span></span>
</span>

<style>
	.mark {
		display: inline-grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		border-radius: 0.58rem;
		background: var(--ink);
		box-shadow: 0 4px 12px rgb(16 24 20 / 0.16);
	}
	.mark.compact { width: 1.75rem; height: 1.75rem; border-radius: 0.48rem; }
	.page {
		display: flex;
		width: 0.86rem;
		height: 1.1rem;
		flex-direction: column;
		gap: 0.14rem;
		padding: 0.25rem 0.18rem;
		border-radius: 0.08rem;
		background: var(--paper);
		box-shadow: 3px 3px 0 var(--acid);
	}
	.page span { display: block; height: 1px; background: var(--ink); opacity: 0.72; }
	.page span:nth-child(2) { width: 70%; }
</style>
