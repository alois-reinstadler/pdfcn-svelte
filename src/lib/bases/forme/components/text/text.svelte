<script lang="ts">
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type TextVariant = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
	export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
	export type TextDecoration = 'underline' | 'line-through' | 'none';

	/**
	 * Body text with typography scale, alignment, and decoration options.
	 * Props - `variant` | `align` | `color` | `weight` | `italic` | `decoration` | `transform` | `noMargin` | `children` | `style`
	 */
	export interface TextProps extends PDFComponentProps {
		/** @default 'base' */
		variant?: TextVariant;
		/** @default 'left' */
		align?: 'left' | 'center' | 'right' | 'justify';
		color?: string;
		/** @default 'normal' */
		weight?: TextWeight;
		/** @default false */
		italic?: boolean;
		/** @default 'none' */
		decoration?: TextDecoration;
		transform?: 'uppercase' | 'lowercase' | 'capitalize';
		/** @default false */
		noMargin?: boolean;
	}

	let {
		variant,
		align,
		color,
		weight = 'normal',
		italic = false,
		decoration = 'none',
		transform,
		noMargin = false,
		children,
		style
	}: TextProps = $props();

	const theme = usePdfcnTheme();

	const createTextStyles = (t: PdfcnTheme) => {
		const { fontWeights, letterSpacing } = t.primitives;
		const base = {
			color: t.colors.foreground,
			fontFamily: t.typography.body.fontFamily,
			lineHeight: t.typography.body.lineHeight,
			marginBottom: t.spacing.paragraphGap,
			marginTop: 0
		};
		return {
			text: { ...base, fontSize: t.typography.body.fontSize },
			xs: { ...base, fontSize: t.primitives.typography.xs },
			sm: { ...base, fontSize: t.primitives.typography.sm },
			base: { ...base, fontSize: t.primitives.typography.base },
			lg: { ...base, fontSize: t.primitives.typography.lg },
			xl: { ...base, fontSize: t.primitives.typography.xl },
			'2xl': { ...base, fontSize: t.primitives.typography['2xl'] },
			'3xl': { ...base, fontSize: t.primitives.typography['3xl'] },
			weightNormal: { fontWeight: fontWeights.regular },
			weightMedium: { fontWeight: fontWeights.medium },
			weightSemibold: { fontWeight: fontWeights.semibold },
			weightBold: { fontWeight: fontWeights.bold },
			italic: { fontStyle: 'italic' },
			underline: { textDecoration: 'underline' },
			lineThrough: { textDecoration: 'line-through' },
			decorationNone: { textDecoration: 'none' },
			uppercase: {
				letterSpacing: letterSpacing.wider * 10,
				textTransform: 'uppercase'
			},
			lowercase: { textTransform: 'lowercase' },
			capitalize: { textTransform: 'capitalize' },
			noMargin: { marginBottom: 0, marginTop: 0 }
		};
	};

	const styles = $derived(createTextStyles(theme));

	const mergedStyle = $derived.by(() => {
		const weightStyles: Record<string, Record<string, unknown>> = {
			normal: styles.weightNormal,
			medium: styles.weightMedium,
			semibold: styles.weightSemibold,
			bold: styles.weightBold
		};
		const decorationStyles: Record<string, Record<string, unknown>> = {
			none: styles.decorationNone,
			underline: styles.underline,
			'line-through': styles.lineThrough
		};
		const transformStyles: Record<string, Record<string, unknown>> = {
			uppercase: styles.uppercase,
			lowercase: styles.lowercase,
			capitalize: styles.capitalize
		};
		return mergeFormeStyles(
			variant ? styles[variant] : styles.text,
			weight && weight in weightStyles ? weightStyles[weight] : undefined,
			italic ? styles.italic : undefined,
			decoration in decorationStyles ? decorationStyles[decoration] : undefined,
			transform && transform in transformStyles
				? transformStyles[transform]
				: undefined,
			noMargin ? styles.noMargin : undefined,
			align ? { textAlign: align } : undefined,
			color ? { color: resolveColor(color, theme.colors) } : undefined,
			style ?? undefined
		);
	});
</script>

<PDFText style={mergedStyle}>{@render children?.()}</PDFText>
