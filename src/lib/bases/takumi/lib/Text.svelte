<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import {
		flattenTakumiStyle,
		styleToCss,
		type StyleInput
	} from './pdf-primitives';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children' | 'class' | 'style'> & {
		style?: StyleInput;
		fixed?: boolean;
		href?: string;
		src?: string;
		class?: HTMLAttributes<HTMLElement>['class'];
		/** React-compatible alias used by upstream pdfcn examples. */
		className?: string;
		download?: HTMLAnchorAttributes['download'];
		hreflang?: HTMLAnchorAttributes['hreflang'];
		media?: HTMLAnchorAttributes['media'];
		ping?: HTMLAnchorAttributes['ping'];
		referrerpolicy?: HTMLAnchorAttributes['referrerpolicy'];
		rel?: HTMLAnchorAttributes['rel'];
		target?: HTMLAnchorAttributes['target'];
		type?: HTMLAnchorAttributes['type'];
		children?: Snippet;
	};

	let {
		style,
		fixed = false,
		href,
		src,
		class: classValue,
		className,
		download,
		hreflang,
		media,
		ping,
		referrerpolicy,
		rel,
		target,
		type,
		children,
		...rest
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
	<a
		{...rest}
		class={classValue ?? className}
		href={link}
		style={css}
		{download}
		{hreflang}
		{media}
		{ping}
		{referrerpolicy}
		{rel}
		{target}
		{type}
	>
		{@render children?.()}
	</a>
{:else}
	<span {...rest} class={classValue ?? className} style={css}>{@render children?.()}</span>
{/if}
