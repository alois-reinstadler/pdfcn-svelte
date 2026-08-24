<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	interface PageBreakProps extends Omit<PDFComponentProps, 'children'> {
		children?: never;
	}

	export type { PageBreakProps };

	let { style }: PageBreakProps = $props();
</script>

<View style={[{ breakBefore: 'page' }, style]} />
