<script lang="ts">
	import { Image as FormeImage } from '@formepdf/svelte';
	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		src: string | { uri: string };
		width?: number;
		height?: number;
		style?: FormeStyleInput;
		href?: string;
		alt?: string;
	}

	let { src, width, height, style, href, alt }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
	const resolvedSrc = $derived(typeof src === 'string' ? src : src.uri);
</script>

<FormeImage style={merged as never} src={resolvedSrc} {width} {height} {href} {alt} />
