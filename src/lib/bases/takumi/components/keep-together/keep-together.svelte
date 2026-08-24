<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	export interface KeepTogetherProps {
		children?: PDFComponentProps['children'];
		minPresenceAhead?: number;
		style?: PDFComponentProps['style'];
	}

	let { children, style }: KeepTogetherProps = $props();
</script>

<View style={[{ breakInside: 'avoid' }, style]}>
	{@render children?.()}
</View>
