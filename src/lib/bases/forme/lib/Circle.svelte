<script lang="ts">
	import { normalizeFormeSvgAttributes, type SvgElementProps } from './svg-utils';

	let { ...props }: SvgElementProps = $props();
	const attributes = $derived(normalizeFormeSvgAttributes(props));
</script>

<circle {...attributes}></circle>
