<script lang="ts">
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		src: string | { uri: string };
		width?: number;
		height?: number;
		style?: StyleInput;
		alt?: string;
		class?: string;
	}

	let { src, width, height, style, alt = '', class: className }: Props = $props();

	const resolvedSrc = $derived(typeof src === 'string' ? src : src.uri);
	const css = $derived(
		styleToCss({
			...(width !== undefined ? { width } : undefined),
			...(height !== undefined ? { height } : undefined),
			...flattenTakumiStyle(style)
		})
	);
</script>

<img class={className} src={resolvedSrc} style={css} {alt} />
