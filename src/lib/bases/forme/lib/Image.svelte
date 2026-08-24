<script lang="ts">
	import { Image as FormeImage } from '@formepdf/svelte';
	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		src: string;
		width?: number;
		height?: number;
		style?: FormeStyleInput;
		href?: string;
		alt?: string;
	}

	let { src, width, height, style, href, alt }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
	const validatedSrc = $derived.by(() => {
		if (typeof src !== 'string') {
			throw new TypeError(
				'[Image] The Forme Svelte renderer accepts only string URLs, file paths, or data URIs.'
			);
		}
		return src;
	});
</script>

<FormeImage style={merged as never} src={validatedSrc} {width} {height} {href} {alt} />
