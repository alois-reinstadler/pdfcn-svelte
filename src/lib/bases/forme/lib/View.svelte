<script lang="ts">
	import { View as FormeView } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		style?: FormeStyleInput;
		wrap?: boolean;
		bookmark?: string;
		href?: string;
		children?: Snippet;
	}

	let { style, wrap, bookmark, href, children }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
</script>

<FormeView style={merged as never} {wrap} {bookmark} {href}>
	{@render children?.()}
</FormeView>
