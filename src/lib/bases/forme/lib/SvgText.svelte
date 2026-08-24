<script lang="ts">
	import { normalizeFormeSvgAttributes, type SvgElementProps } from './svg-utils';

	let { children, ...props }: SvgElementProps = $props();
	const attributes = $derived.by(() => ({
		'font-family': 'sans-serif',
		...normalizeFormeSvgAttributes(props)
	}));
</script>

<text {...attributes}>{@render children?.()}</text>
