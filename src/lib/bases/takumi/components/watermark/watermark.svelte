<script lang="ts">
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type WatermarkPosition =
		| 'center'
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right';

	/**
	 * Diagonal watermark overlaid across the full page, repeated on every page.
	 * Props - `text` | `opacity` | `fontSize` | `color` | `angle` | `position` | `style`
	 */
	interface Props extends Omit<PDFComponentProps, 'children'> {
		text: string;
		opacity?: number;
		fontSize?: number;
		color?: string;
		angle?: number;
		position?: WatermarkPosition;
		children?: never;
	}

	let {
		text,
		opacity = 0.15,
		fontSize = 60,
		color = 'mutedForeground',
		angle = -45,
		position = 'center',
		style
	}: Props = $props();

	const theme = usePdfcnTheme();

	const createWatermarkStyles = (t: PdfcnTheme) => {
		const { fontWeights } = t.primitives;
		const { marginTop, marginBottom, marginLeft, marginRight } = t.spacing.page;
		return {
			container: {
				alignItems: 'center',
				bottom: 0,
				justifyContent: 'center',
				left: 0,
				pointerEvents: 'none',
				position: 'fixed',
				right: 0,
				top: 0,
				zIndex: -1
			},
			positionBottomLeft: {
				alignItems: 'flex-start',
				justifyContent: 'flex-end',
				paddingBottom: marginBottom,
				paddingLeft: marginLeft
			},
			positionBottomRight: {
				alignItems: 'flex-end',
				justifyContent: 'flex-end',
				paddingBottom: marginBottom,
				paddingRight: marginRight
			},
			positionCenter: { alignItems: 'center', justifyContent: 'center' },
			positionTopLeft: {
				alignItems: 'flex-start',
				justifyContent: 'flex-start',
				paddingLeft: marginLeft,
				paddingTop: marginTop
			},
			positionTopRight: {
				alignItems: 'flex-end',
				justifyContent: 'flex-start',
				paddingRight: marginRight,
				paddingTop: marginTop
			},
			text: {
				fontFamily: t.typography.heading.fontFamily,
				fontWeight: fontWeights.bold,
				letterSpacing: 4,
				textTransform: 'uppercase'
			}
		};
	};

	const styles = $derived(createWatermarkStyles(theme));

	const containerStyle = $derived.by(() => {
		const positionMap: Record<string, Record<string, unknown>> = {
			'bottom-left': styles.positionBottomLeft,
			'bottom-right': styles.positionBottomRight,
			center: styles.positionCenter,
			'top-left': styles.positionTopLeft,
			'top-right': styles.positionTopRight
		};
		return flattenTakumiStyle([styles.container, positionMap[position], style]);
	});

	const textStyle = $derived(
		flattenTakumiStyle([
			styles.text,
			{
				color: resolveColor(color, theme.colors),
				fontSize,
				opacity,
				transform: `rotate(${angle}deg)`
			}
		])
	);
</script>

<View style={containerStyle}>
	<PDFText style={textStyle}>{text}</PDFText>
</View>
