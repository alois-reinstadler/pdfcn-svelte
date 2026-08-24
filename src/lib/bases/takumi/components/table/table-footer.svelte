<script lang="ts">
	import View from '$lib/bases/takumi/lib/View.svelte';

	import { provideTableSectionContext } from './table-context';
	import type { TableSectionProps } from './table.types';

	let { children, style }: TableSectionProps = $props();
	let rowIndex = 0;

	provideTableSectionContext({
		kind: 'footer',
		registerRow: () => rowIndex++
	});
</script>

<View {style}>{@render children?.()}</View>
