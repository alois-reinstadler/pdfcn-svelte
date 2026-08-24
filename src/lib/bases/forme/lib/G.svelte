<script lang="ts">
	import { normalizeFormeSvgAttributes, type SvgElementProps } from './svg-utils';

	let { children, ...props }: SvgElementProps = $props();
	const attributes = $derived(normalizeFormeSvgAttributes(props));
</script>

<g {...attributes}>{@render children?.()}</g>
