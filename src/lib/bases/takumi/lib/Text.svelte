<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		style?: StyleInput;
		fixed?: boolean;
		href?: string;
		src?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		style,
		fixed = false,
		href,
		src,
		class: className,
		children
	}: Props = $props();

	const css = $derived(
		styleToCss({
			...(fixed ? { position: 'fixed' } : undefined),
			...flattenTakumiStyle(style)
		})
	);
	const link = $derived(href ?? src);
</script>

{#if link}
	<a class={className} href={link} style={css}>{@render children?.()}</a>
{:else}
	<span class={className} style={css}>{@render children?.()}</span>
{/if}
