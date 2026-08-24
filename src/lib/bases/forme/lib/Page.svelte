<script lang="ts">
	import { Page as FormePage } from '@formepdf/svelte';
	import type { Edges } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import { mergeFormeStyles, type FormeStyleInput } from './pdf-primitives';

	interface Props {
		size?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid' | { width: number; height: number };
		margin?: number | string | number[] | Edges;
		style?: FormeStyleInput;
		backgroundImage?: string;
		backgroundOpacity?: number;
		backgroundSize?: 'fill' | 'cover' | 'contain';
		backgroundPosition?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		children?: Snippet;
	}

	let {
		size,
		margin,
		style,
		backgroundImage,
		backgroundOpacity,
		backgroundSize,
		backgroundPosition,
		children
	}: Props = $props();

	const merged = $derived(mergeFormeStyles(style));
</script>

<FormePage
	{size}
	{margin}
	style={merged as never}
	{backgroundImage}
	{backgroundOpacity}
	{backgroundSize}
	{backgroundPosition}
>
	{@render children?.()}
</FormePage>
