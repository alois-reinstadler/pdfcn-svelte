<script lang="ts">
	import { PageBreak } from '$lib/bases/forme/lib/pdf-primitives';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	interface PageBreakProps extends Omit<PDFComponentProps, 'children'> {
		children?: never;
	}

	export type { PageBreakProps };
</script>

<PageBreak />
