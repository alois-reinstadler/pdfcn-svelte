<script lang="ts">
	import QRCode from 'qrcode';
	import { Svg } from '@formepdf/svelte';

	import View from '$lib/bases/forme/lib/View.svelte';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';
	import { resolveColor } from '$lib/utils/resolve-color';

	export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H';

	/**
	 * QR code rendered as an SVG grid for use in PDF documents.
	 * Props - `value` | `size` | `color` | `backgroundColor` | `errorLevel` | `margin` | `caption` | `style`
	 */
	export interface PdfQRCodeProps extends Omit<PDFComponentProps, 'children'> {
		value: string;
		/** @default 100 */
		size?: number;
		/** @default '#000000' */
		color?: string;
		/** @default '#ffffff' */
		backgroundColor?: string;
		/** @default 'M' */
		errorLevel?: QRCodeErrorLevel;
		/** Number of quiet-zone modules. @default 2 */
		margin?: number;
		caption?: string;
	}

	let {
		value,
		size = 100,
		color = '#000000',
		backgroundColor = '#ffffff',
		errorLevel = 'M',
		margin = 2,
		caption,
		style
	}: PdfQRCodeProps = $props();

	const theme = usePdfcnTheme();

	const createQRCodeStyles = (t: PdfcnTheme) => ({
		caption: {
			color: t.colors.mutedForeground,
			fontFamily: t.typography.body.fontFamily,
			fontSize: t.primitives.typography.xs,
			marginTop: t.primitives.spacing[1],
			textAlign: 'center'
		},
		container: { alignItems: 'center' }
	});

	const generateQRMatrix = (
		input: string,
		level: QRCodeErrorLevel,
		quietZone: number
	): boolean[][] => {
		const qr = QRCode.create(input, { errorCorrectionLevel: level });
		const { size: moduleCount, data } = qr.modules;
		const totalSize = moduleCount + quietZone * 2;
		const matrix: boolean[][] = [];
		for (let row = 0; row < totalSize; row += 1) {
			const rowData: boolean[] = [];
			for (let col = 0; col < totalSize; col += 1) {
				const isInMargin =
					row < quietZone ||
					row >= moduleCount + quietZone ||
					col < quietZone ||
					col >= moduleCount + quietZone;
				rowData.push(
					!isInMargin &&
						data[(row - quietZone) * moduleCount + (col - quietZone)] === 1
				);
			}
			matrix.push(rowData);
		}
		return matrix;
	};

	const escapeSvgAttribute = (input: string): string =>
		input
			.replaceAll('&', '&amp;')
			.replaceAll('"', '&quot;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;');

	const styles = $derived(createQRCodeStyles(theme));
	const matrix = $derived(generateQRMatrix(value, errorLevel, margin));
	const moduleSize = $derived(size / matrix.length);
	const resolvedColor = $derived(resolveColor(color, theme.colors));
	const resolvedBackgroundColor = $derived(
		backgroundColor === 'transparent'
			? undefined
			: resolveColor(backgroundColor, theme.colors)
	);
	const containerStyle = $derived(mergeFormeStyles(styles.container, style ?? undefined));
	const svgContent = $derived.by(() => {
		const content: string[] = [];
		if (resolvedBackgroundColor !== undefined) {
			content.push(
				`<rect x="0" y="0" width="${size}" height="${size}" fill="${escapeSvgAttribute(resolvedBackgroundColor)}" />`
			);
		}
		for (let y = 0; y < matrix.length; y += 1) {
			for (let x = 0; x < matrix[y].length; x += 1) {
				if (matrix[y][x]) {
					content.push(
						`<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${escapeSvgAttribute(resolvedColor)}" />`
					);
				}
			}
		}
		return content.join('');
	});
</script>

<View style={containerStyle}>
	<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} content={svgContent} />
	{#if caption}
		<PDFText style={styles.caption}>{caption}</PDFText>
	{/if}
</View>
