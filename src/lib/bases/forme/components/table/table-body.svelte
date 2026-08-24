<script lang="ts">
	import View from '$lib/bases/forme/lib/View.svelte';

	import { provideTableSectionContext } from './table-context';
	import type { TableSectionProps } from './table.types';

	let { children, style }: TableSectionProps = $props();
	let rowIndex = 0;

	provideTableSectionContext({
		kind: 'body',
		registerRow: () => rowIndex++
	});
</script>

<View {style}>{@render children?.()}</View>
