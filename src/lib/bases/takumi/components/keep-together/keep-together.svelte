<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	export interface KeepTogetherProps {
		children?: PDFComponentProps['children'];
		/** Minimum following sibling content to keep with this group, in points. */
		minPresenceAhead?: number;
		style?: PDFComponentProps['style'];
	}

	let { children, style, minPresenceAhead }: KeepTogetherProps = $props();
</script>

<View wrap={false} {minPresenceAhead} {style}>
	{@render children?.()}
</View>
