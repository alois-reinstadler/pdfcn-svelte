<script lang="ts">
	import View from '$lib/bases/forme/lib/View.svelte';
	import type { Snippet } from 'svelte';
	import type { Style } from '$lib/types/pdf-components';

	export interface KeepTogetherProps {
		children?: Snippet;
		minPresenceAhead?: number;
		style?: Style;
	}

	let { children, style }: KeepTogetherProps = $props();
</script>

<View wrap={false} style={style}>
	{@render children?.()}
</View>
