<script lang="ts">
	import { normalizeTakumiSvgAttributes, type SvgElementProps } from './svg-utils';

	let { children, ...props }: SvgElementProps = $props();
	const attributes = $derived(normalizeTakumiSvgAttributes(props));
</script>

<g {...attributes}>{@render children?.()}</g>
