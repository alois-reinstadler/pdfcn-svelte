<script lang="ts">
	import type { Style } from '$lib/types/pdf-components';
	import type { Snippet } from 'svelte';

	import { pointToCssPixel, styleToCss } from './pdf-primitives';
	import { normalizeTakumiSvgAttributes, type SvgElementProps } from './svg-utils';

	interface Props extends SvgElementProps {
		width?: string | number;
		height?: string | number;
		viewBox?: string;
		children?: Snippet;
	}

	let { children, style, width, height, viewBox, ...props }: Props = $props();

	const numericWidth = $derived(typeof width === 'number' ? width : undefined);
	const numericHeight = $derived(typeof height === 'number' ? height : undefined);
	const attributes = $derived.by(() => {
		const normalized = normalizeTakumiSvgAttributes(props);
		if (style && typeof style === 'object') {
			normalized.style = styleToCss(style as Style);
		} else if (typeof style === 'string') {
			normalized.style = style;
		}
		return normalized;
	});
	const resolvedWidth = $derived(
		numericWidth === undefined ? width : pointToCssPixel(numericWidth)
	);
	const resolvedHeight = $derived(
		numericHeight === undefined ? height : pointToCssPixel(numericHeight)
	);
	const resolvedViewBox = $derived(
		viewBox ??
			(numericWidth !== undefined && numericHeight !== undefined
				? `0 0 ${numericWidth} ${numericHeight}`
				: undefined)
	);
</script>

<svg
	{...attributes}
	width={resolvedWidth}
	height={resolvedHeight}
	viewBox={resolvedViewBox}
>
	{@render children?.()}
</svg>
