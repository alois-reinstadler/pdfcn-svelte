<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		title?: string;
		style?: StyleInput;
		children?: Snippet;
	}

	let { title: _title, style, children }: Props = $props();

	const css = $derived(
		styleToCss({
			display: 'flex',
			flexDirection: 'column',
			...flattenTakumiStyle(style)
		})
	);
</script>

<div data-pdf-document style={css}>{@render children?.()}</div>
