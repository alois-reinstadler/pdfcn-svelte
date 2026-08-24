<script lang="ts">
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';
	export type HeadingTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';

	/**
	 * PDF heading mapped to h1–h6 font sizes from the theme.
	 * Props - `level` | `align` | `color` | `transform` | `weight` | `tracking` | `noMargin` | `keepWithNext` | `children` | `style`
	 * @see {@link HeadingProps}
	 */
	interface Props extends PDFComponentProps {
		/** @default 1 */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		/** @default 'left' */
		align?: 'left' | 'center' | 'right';
		color?: string;
		transform?: 'uppercase' | 'lowercase' | 'capitalize';
		/** @default 'bold' */
		weight?: HeadingWeight;
		/** @default 'normal' */
		tracking?: HeadingTracking;
		/** @default false */
		noMargin?: boolean;
		keepWithNext?: boolean;
	}

	let {
		level = 1,
		align,
		color,
		transform,
		weight,
		tracking,
		noMargin,
		keepWithNext: _keepWithNext,
		children,
		style
	}: Props = $props();

	const theme = usePdfcnTheme();

	const createHeadingStyles = (t: PdfcnTheme) => {
		const { heading } = t.typography;
		const { spacing, fontWeights, letterSpacing } = t.primitives;
		const { sectionGap, componentGap, paragraphGap } = t.spacing;
		const base = {
			color: t.colors.foreground,
			fontFamily: heading.fontFamily,
			fontWeight: fontWeights.bold,
			lineHeight: heading.lineHeight
		};
		return {
			capitalize: { textTransform: 'capitalize' },
			h1: {
				...base,
				fontSize: heading.fontSize.h1,
				marginBottom: paragraphGap,
				marginTop: spacing[0]
			},
			h2: {
				...base,
				fontSize: heading.fontSize.h2,
				marginBottom: paragraphGap,
				marginTop: sectionGap
			},
			h3: {
				...base,
				fontSize: heading.fontSize.h3,
				marginBottom: paragraphGap,
				marginTop: componentGap
			},
			h4: {
				...base,
				fontSize: heading.fontSize.h4,
				marginBottom: paragraphGap,
				marginTop: paragraphGap
			},
			h5: {
				...base,
				fontSize: heading.fontSize.h5,
				marginBottom: spacing[1],
				marginTop: paragraphGap
			},
			h6: {
				...base,
				fontSize: heading.fontSize.h6,
				marginBottom: spacing[1],
				marginTop: paragraphGap
			},
			lowercase: { textTransform: 'lowercase' },
			noMargin: { marginBottom: 0, marginTop: 0 },
			trackingNormal: { letterSpacing: letterSpacing.normal },
			trackingTight: { letterSpacing: letterSpacing.tight * 10 },
			trackingTighter: { letterSpacing: letterSpacing.tight * 15 },
			trackingWide: { letterSpacing: letterSpacing.wide * 10 },
			trackingWider: { letterSpacing: letterSpacing.wider * 10 },
			uppercase: {
				letterSpacing: letterSpacing.wider * 10,
				textTransform: 'uppercase'
			},
			weightBold: { fontWeight: fontWeights.bold },
			weightMedium: { fontWeight: fontWeights.medium },
			weightNormal: { fontWeight: fontWeights.regular },
			weightSemibold: { fontWeight: fontWeights.semibold }
		};
	};

	const styles = $derived(createHeadingStyles(theme));

	const mergedStyle = $derived.by(() => {
		const headingStyles: Record<number, Record<string, unknown>> = {
			1: styles.h1,
			2: styles.h2,
			3: styles.h3,
			4: styles.h4,
			5: styles.h5,
			6: styles.h6
		};
		const weightMap = {
			bold: styles.weightBold,
			medium: styles.weightMedium,
			normal: styles.weightNormal,
			semibold: styles.weightSemibold
		};
		const trackingMap = {
			normal: styles.trackingNormal,
			tight: styles.trackingTight,
			tighter: styles.trackingTighter,
			wide: styles.trackingWide,
			wider: styles.trackingWider
		};
		const transformMap = {
			capitalize: styles.capitalize,
			lowercase: styles.lowercase,
			uppercase: styles.uppercase
		};
		const safeLevel = Math.min(Math.max(Math.round(level), 1), 6);
		const styleArray: Record<string, unknown>[] = [headingStyles[safeLevel]];
		if (weight && weight in weightMap) {
			styleArray.push(weightMap[weight]);
		}
		if (tracking && tracking in trackingMap) {
			styleArray.push(trackingMap[tracking]);
		}
		if (transform && transform in transformMap) {
			styleArray.push(transformMap[transform]);
		}
		if (noMargin) {
			styleArray.push(styles.noMargin);
		}
		if (align || color) {
			const semantic: Record<string, unknown> = {};
			if (align) {
				semantic.textAlign = align;
			}
			if (color) {
				semantic.color = resolveColor(color, theme.colors);
			}
			styleArray.push(semantic);
		}
		return flattenTakumiStyle([...styleArray, style ?? undefined]);
	});
</script>

<PDFText style={mergedStyle}>
	{@render children?.()}
</PDFText>
