<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props extends Omit<HTMLAnchorAttributes, 'children' | 'class' | 'href' | 'style'> {
		src: string;
		style?: StyleInput;
		class?: HTMLAnchorAttributes['class'];
		/** React-compatible alias used by upstream pdfcn examples. */
		className?: string;
		children?: Snippet;
	}

	let {
		src,
		style,
		class: classValue,
		className,
		children,
		...rest
	}: Props = $props();

	const css = $derived(styleToCss(flattenTakumiStyle(style) ?? {}));
</script>

<a {...rest} class={classValue ?? className} href={src} style={css}>{@render children?.()}</a>
