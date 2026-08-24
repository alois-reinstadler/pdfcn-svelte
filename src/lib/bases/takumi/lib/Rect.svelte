<script lang="ts">
	import { normalizeTakumiSvgAttributes, type SvgElementProps } from './svg-utils';

	let { ...props }: SvgElementProps = $props();
	const attributes = $derived(normalizeTakumiSvgAttributes(props));
</script>

<rect {...attributes}></rect>
