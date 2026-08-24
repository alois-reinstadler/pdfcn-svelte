<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'style'> {
		style?: StyleInput;
		wrap?: boolean;
		fixed?: boolean;
		break?: boolean;
		minPresenceAhead?: number;
		class?: HTMLAttributes<HTMLDivElement>['class'];
		/** React-compatible alias used by upstream pdfcn examples. */
		className?: string;
		children?: Snippet;
	}

	let {
		style,
		wrap,
		fixed,
		break: pageBreak,
		minPresenceAhead: _minPresenceAhead,
		class: classValue,
		className,
		children,
		...rest
	}: Props = $props();

	const css = $derived.by(() => {
		const merged: Record<string, unknown> = {
			display: 'flex',
			flexDirection: 'column',
			...flattenTakumiStyle(style)
		};
		if (pageBreak) {
			merged.breakBefore = 'page';
		}
		if (wrap === false) {
			merged.breakInside = 'avoid';
		}
		if (fixed) {
			merged.position = 'fixed';
		}
		return styleToCss(merged);
	});
</script>

<div {...rest} class={classValue ?? className} style={css}>{@render children?.()}</div>
