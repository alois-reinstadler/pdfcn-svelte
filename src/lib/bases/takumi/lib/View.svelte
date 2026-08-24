<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flattenTakumiStyle, styleToCss, type StyleInput } from './pdf-primitives';

	interface Props {
		style?: StyleInput;
		wrap?: boolean;
		fixed?: boolean;
		break?: boolean;
		minPresenceAhead?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		style,
		wrap,
		fixed,
		break: pageBreak,
		minPresenceAhead: _minPresenceAhead,
		class: className,
		children
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

<div class={className} style={css}>{@render children?.()}</div>
