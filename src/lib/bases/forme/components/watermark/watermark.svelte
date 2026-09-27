<script lang="ts">
	import { Watermark } from '$lib/bases/forme/lib/pdf-primitives';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';

	export type WatermarkPosition =
		| 'center'
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right';

	/**
	 * Diagonal watermark overlaid across the full page using absolute positioning.
	 * Props - `text` | `opacity` | `fontSize` | `color` | `angle` | `position` | `fixed` | `style`
	 */
	export interface PdfWatermarkProps extends Omit<PDFComponentProps, 'children'> {
		text: string;
		opacity?: number;
		fontSize?: number;
		color?: string;
		angle?: number;
		position?: 'center';
		/** @default true */
		fixed?: true;
		children?: never;
	}

	let {
		text,
		opacity = 0.15,
		fontSize = 60,
		color = 'mutedForeground',
		angle = -45,
		position = 'center',
		fixed = true,
		style
	}: PdfWatermarkProps = $props();

	const theme = usePdfcnTheme();

	const withOpacity = (value: string, alpha: number): string => {
		const match = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
		if (!match) {
			return value;
		}

		const [, red, green, blue] = match;
		return `rgba(${Number.parseInt(red, 16)}, ${Number.parseInt(green, 16)}, ${Number.parseInt(blue, 16)}, ${alpha})`;
	};

	const resolvedColor = $derived(resolveColor(color, theme.colors));

	const mergedStyle = $derived.by(() => {
		if (position !== "center" || fixed !== true) throw new Error("[Watermark] Forme supports only centered, repeated watermarks. Use positioned Text for a single authored mark.");
		if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) throw new Error("[Watermark] opacity must be between 0 and 1.");
		return mergeFormeStyles(style);
	});
</script>

<Watermark
	{text}
	{angle}
	color={withOpacity(resolvedColor, opacity)}
	{fontSize}
	style={mergedStyle}
/>
