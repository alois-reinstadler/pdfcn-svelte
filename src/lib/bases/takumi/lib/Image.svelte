<script lang="ts">
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		src: string | { uri: string };
		style?: StyleInput;
		alt?: string;
		class?: string;
	}

	let { src, style, alt = '', class: className }: Props = $props();

	const resolvedSrc = $derived(typeof src === 'string' ? src : src.uri);
	const css = $derived(styleToCss(flattenTakumiStyle(style) ?? {}));
</script>

<img class={className} src={resolvedSrc} style={css} {alt} />
