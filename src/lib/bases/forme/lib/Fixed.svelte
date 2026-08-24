<script lang="ts">
	import { Fixed as FormeFixed } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		position: 'header' | 'footer';
		style?: FormeStyleInput;
		bookmark?: string;
		children?: Snippet;
	}

	let { position, style, bookmark, children }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
</script>

<FormeFixed position={position} style={merged as never} {bookmark}>
	{@render children?.()}
</FormeFixed>
