<script lang="ts">
	import { Svg as FormeSvg } from '@formepdf/svelte';
	import type { Style } from '$lib/types/pdf-components';
	import { render } from 'svelte/server';
	import type { Component, Snippet } from 'svelte';

	import { mergeFormeStyles, type FormeStyleInput } from './pdf-primitives';
	import { cleanCapturedSvg } from './svg-utils';

	interface Props {
		width?: number;
		height?: number;
		viewBox?: string;
		style?: FormeStyleInput;
		href?: string;
		alt?: string;
		/** Raw inner SVG markup. When supplied, this takes precedence over children. */
		content?: string;
		children?: Snippet;
	}

	let { width, height, viewBox, style, href, alt, content, children }: Props = $props();

	const mergedStyle = $derived(mergeFormeStyles(style ?? undefined));
	const svgContent = $derived.by(() => {
		if (content !== undefined) return content;
		if (!children) return '';

		// Forme's Svelte adapter accepts inner SVG markup rather than component
		// children. A Svelte snippet has the same server render signature as a
		// component, so the public SSR renderer gives us safe, escaped markup.
		return cleanCapturedSvg(render(children as unknown as Component).body);
	});
</script>

<FormeSvg
	width={width as number}
	height={height as number}
	{viewBox}
	style={mergedStyle as Style}
	{href}
	{alt}
	content={svgContent}
/>
