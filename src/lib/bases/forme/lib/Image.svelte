<script lang="ts">
	import { markFormeBody } from './flow-context';
	markFormeBody();
	import { validateImageSource } from '$lib/utils/image-source';
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
	const validatedSrc = $derived(validateImageSource(src));
</script>

<FormeImage style={merged as never} src={validatedSrc} {width} {height} {href} {alt} />
