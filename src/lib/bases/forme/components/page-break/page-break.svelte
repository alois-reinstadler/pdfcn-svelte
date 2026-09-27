<script lang="ts">
	import { PageBreak } from '$lib/bases/forme/lib/pdf-primitives';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	interface PageBreakProps extends Omit<PDFComponentProps, 'children' | 'style'> {
		children?: never;
		style?: never;
	}

	export type { PageBreakProps };
	let { style }: PageBreakProps = $props();
	const valid = $derived.by(() => { if (style !== undefined) throw new Error('[PageBreak] A page break has no visual style. Apply spacing to the following content.'); return true; });
</script>

{#if valid}<PageBreak />{/if}
