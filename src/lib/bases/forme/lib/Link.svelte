<script lang="ts">
	import { Link as FormeLink } from '@formepdf/svelte';
	import type { Snippet } from 'svelte';

	import {
		mergeFormeStyles,
		type FormeStyleInput
	} from './pdf-primitives';

	interface Props {
		href: string;
		style?: FormeStyleInput;
		children?: Snippet;
	}

	let { href, style, children }: Props = $props();

	const merged = $derived(mergeFormeStyles(style ?? undefined));
</script>

<FormeLink style={merged as never} {href}>
	{@render children?.()}
</FormeLink>
