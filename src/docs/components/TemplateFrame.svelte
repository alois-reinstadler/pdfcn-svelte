<script lang="ts">
	let {
		slug,
		title,
		theme = 'professional',
		compact = false
	}: { slug: string; title: string; theme?: string; compact?: boolean } = $props();
</script>

<div class:compact class="frame">
	<iframe
		src={`/preview/takumi/${slug}?theme=${theme}`}
		title={`${title} live Takumi preview`}
		loading="lazy"
		aria-hidden={compact}
	></iframe>
</div>

<style>
	.frame { position: relative; overflow: hidden; width: 100%; aspect-ratio: 210 / 297; border: 1px solid var(--line); border-radius: 0.6rem; background: #dfe3df; box-shadow: 0 1.2rem 3rem rgb(20 38 30 / 0.12); }
	iframe { width: 100%; height: 100%; border: 0; background: #e9ebe8; }
	.compact { border: 0; border-radius: 0.42rem; box-shadow: none; }
	.compact iframe { pointer-events: none; }
</style>
