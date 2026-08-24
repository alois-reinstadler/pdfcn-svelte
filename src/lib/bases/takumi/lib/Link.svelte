<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		src: string;
		style?: StyleInput;
		children?: Snippet;
	}

	let { src, style, children }: Props = $props();

	const css = $derived(styleToCss(flattenTakumiStyle(style) ?? {}));
</script>

<a href={src} style={css}>{@render children?.()}</a>
