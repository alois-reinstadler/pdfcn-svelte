<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type DividerVariant = 'solid' | 'dashed' | 'dotted';
	export type DividerThickness = 'thin' | 'medium' | 'thick';
	export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

	/**
	 * Horizontal rule with optional label, style variants, and spacing presets.
	 * Props - `spacing` | `variant` | `color` | `thickness` | `label` | `width` | `style`
	 */
	export interface DividerProps extends Omit<PDFComponentProps, 'children'> {
		/** @default 'md' */
		spacing?: DividerSpacing;
		/** @default 'solid' */
		variant?: DividerVariant;
		color?: string;
		/** @default 'thin' */
		thickness?: DividerThickness;
		label?: string;
		width?: string | number;
	}

	let {
		spacing = 'md',
		variant = 'solid',
		color,
		thickness = 'thin',
		label,
		width,
		style
	}: DividerProps = $props();

	const theme = usePdfcnTheme();

	const createDividerStyles = (t: PdfcnTheme) => {
		const { spacing, fontWeights } = t.primitives;
		return {
			base: { borderBottomColor: t.colors.border, borderBottomStyle: 'solid' },
			dashed: { borderBottomStyle: 'dashed' },
			dotted: { borderBottomStyle: 'dotted' },
			labelContainer: { alignItems: 'center', flexDirection: 'row' },
			labelLine: {
				borderBottomColor: t.colors.border,
				borderBottomStyle: 'solid',
				flex: 1
			},
			labelText: {
				color: t.colors.mutedForeground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: t.primitives.typography.xs,
				fontWeight: fontWeights.medium,
				letterSpacing: t.primitives.letterSpacing.wider * 10,
				paddingHorizontal: spacing[3],
				textTransform: 'uppercase'
			},
			medium: { borderBottomWidth: spacing[1] },
			solid: { borderBottomStyle: 'solid' },
			spacingLg: { marginVertical: t.spacing.sectionGap },
			spacingMd: { marginVertical: t.spacing.componentGap },
			spacingNone: { marginVertical: spacing[0] },
			spacingSm: { marginVertical: t.spacing.paragraphGap },
			thick: { borderBottomWidth: spacing[2] },
			thin: { borderBottomWidth: spacing[0.5] }
		};
	};

	const styles = $derived(createDividerStyles(theme));

	const lineStyle = $derived.by(() => {
		const variantMap: Record<string, Record<string, unknown>> = {
			dashed: styles.dashed,
			dotted: styles.dotted,
			solid: styles.solid
		};
		const thicknessMap: Record<string, Record<string, unknown>> = {
			medium: styles.medium,
			thick: styles.thick,
			thin: styles.thin
		};
		return mergeFormeStyles(
			styles.labelLine,
			thicknessMap[thickness],
			variantMap[variant],
			color ? { borderBottomColor: resolveColor(color, theme.colors) } : undefined
		);
	});

	const containerStyle = $derived.by(() => {
		const spacingMap: Record<string, Record<string, unknown>> = {
			lg: styles.spacingLg,
			md: styles.spacingMd,
			none: styles.spacingNone,
			sm: styles.spacingSm
		};
		return mergeFormeStyles(
			styles.labelContainer,
			spacingMap[spacing],
			width !== undefined ? { width } : undefined,
			style
		);
	});

	const labelTextStyle = $derived(
		mergeFormeStyles(
			styles.labelText,
			color ? { color: resolveColor(color, theme.colors) } : undefined
		)
	);

	const mergedStyle = $derived.by(() => {
		const spacingMap: Record<string, Record<string, unknown>> = {
			lg: styles.spacingLg,
			md: styles.spacingMd,
			none: styles.spacingNone,
			sm: styles.spacingSm
		};
		const variantMap: Record<string, Record<string, unknown>> = {
			dashed: styles.dashed,
			dotted: styles.dotted,
			solid: styles.solid
		};
		const thicknessMap: Record<string, Record<string, unknown>> = {
			medium: styles.medium,
			thick: styles.thick,
			thin: styles.thin
		};
		return mergeFormeStyles(
			styles.base,
			spacingMap[spacing],
			variantMap[variant],
			thicknessMap[thickness],
			color ? { borderBottomColor: resolveColor(color, theme.colors) } : undefined,
			width !== undefined ? { width } : undefined,
			style
		);
	});
</script>

{#if label}
	<View style={containerStyle}>
		<View style={lineStyle} />
		<PDFText style={labelTextStyle}>{label}</PDFText>
		<View style={lineStyle} />
	</View>
{:else}
	<View style={mergedStyle} />
{/if}
