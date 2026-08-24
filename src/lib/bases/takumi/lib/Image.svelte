<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props extends Omit<HTMLImgAttributes, 'alt' | 'class' | 'height' | 'src' | 'style' | 'width'> {
		src: string | { uri: string };
		width?: number;
		height?: number;
		style?: StyleInput;
		alt?: string;
		class?: HTMLImgAttributes['class'];
		/** React-compatible alias used by upstream pdfcn examples. */
		className?: string;
	}

	let {
		src,
		width,
		height,
		style,
		alt = '',
		class: classValue,
		className,
		...rest
	}: Props = $props();

	const resolvedSrc = $derived(typeof src === 'string' ? src : src.uri);
	const css = $derived(
		styleToCss({
			...(width !== undefined ? { width } : undefined),
			...(height !== undefined ? { height } : undefined),
			...flattenTakumiStyle(style)
		})
	);
</script>

<img {...rest} class={classValue ?? className} src={resolvedSrc} style={css} {alt} />
