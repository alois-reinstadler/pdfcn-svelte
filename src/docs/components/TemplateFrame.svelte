<script lang="ts">
	import { base } from '$app/paths';

	let {
		slug,
		title,
		theme = 'professional',
		renderer = 'takumi',
		compact = false
	}: {
		slug: string;
		title: string;
		theme?: string;
		renderer?: 'forme' | 'takumi';
		compact?: boolean;
	} = $props();

	const previewUrl = $derived(`${base}/previews/${renderer}/${theme}/${slug}.pdf`);
</script>

<div class:compact class="frame">
	<iframe
		src={`${previewUrl}#view=FitH&toolbar=${compact ? 0 : 1}&navpanes=0`}
		title={`${title} ${renderer === 'forme' ? 'Forme' : 'Takumi'} PDF preview`}
		loading="lazy"
		aria-hidden={compact}
	></iframe>
	<noscript><a href={previewUrl}>Open the {title} PDF</a></noscript>
</div>

<style>
	.frame { position: relative; overflow: hidden; width: 100%; aspect-ratio: 210 / 297; border: 1px solid var(--line); border-radius: 0.6rem; background: #dfe3df; box-shadow: 0 1.2rem 3rem rgb(20 38 30 / 0.12); }
	iframe { width: 100%; height: 100%; border: 0; background: #e9ebe8; }
	.compact { border: 0; border-radius: 0.42rem; box-shadow: none; }
	.compact iframe { pointer-events: none; }
</style>
