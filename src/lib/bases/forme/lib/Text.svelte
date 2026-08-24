<script lang="ts">
	import { Text as FormeText } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		style?: FormeStyleInput;
		href?: string;
		bookmark?: string;
		children?: Snippet;
	}

	let { style, href, bookmark, children }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
</script>

<FormeText style={merged as never} {href} {bookmark}>
	{@render children?.()}
</FormeText>
