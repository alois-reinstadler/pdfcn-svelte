<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		size?: string | { width: number; height: number };
		style?: StyleInput;
		children?: Snippet;
	}

	let { size: _size, style, children }: Props = $props();

	const css = $derived(
		styleToCss({
			display: 'flex',
			flexDirection: 'column',
			...flattenTakumiStyle(style)
		})
	);
</script>

<div data-pdf-page style={css}>{@render children?.()}</div>
