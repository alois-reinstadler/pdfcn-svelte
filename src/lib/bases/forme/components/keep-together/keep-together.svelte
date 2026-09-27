<script lang="ts">
	import View from '$lib/bases/forme/lib/View.svelte';
	import type { Snippet } from 'svelte';
	import type { Style } from '$lib/types/pdf-components';

	export interface KeepTogetherProps {
		children?: Snippet;
		/** Unsupported by Forme. Include the following content inside KeepTogether instead. */
		minPresenceAhead?: never;
		style?: Style;
	}

	let { children, style, minPresenceAhead }: KeepTogetherProps = $props();
	const validatedStyle = $derived.by(() => {
		if (minPresenceAhead !== undefined) throw new Error("[KeepTogether] Forme does not support minPresenceAhead. Include the following content inside KeepTogether instead.");
		return style;
	});
</script>

<View wrap={false} style={validatedStyle}>
	{@render children?.()}
</View>
