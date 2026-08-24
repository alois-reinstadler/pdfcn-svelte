<script lang="ts">
	import type { Snippet } from 'svelte';

	import Fixed from './Fixed.svelte';
	import View from './View.svelte';
	import type { FormeStyleInput } from './pdf-primitives';

	export interface MaybeFixedProps {
		fixed?: boolean;
		position: 'header' | 'footer';
		wrap?: boolean;
		style?: FormeStyleInput;
		children?: Snippet;
	}

	let {
		fixed = false,
		position,
		wrap,
		style,
		children
	}: MaybeFixedProps = $props();
</script>

{#if fixed}
	<Fixed {position}>
		<View {wrap} {style}>{@render children?.()}</View>
	</Fixed>
{:else}
	<View {wrap} {style}>{@render children?.()}</View>
{/if}
