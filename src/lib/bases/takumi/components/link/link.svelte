<script lang="ts">
	import PDFLink from '$lib/bases/takumi/lib/Link.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import { resolveColor } from '$lib/utils/resolve-color';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type LinkVariant = 'default' | 'muted' | 'primary';
	export type LinkUnderline = 'always' | 'none';

	/**
	 * Clickable hyperlink for PDF documents.
	 * Props - `href` | `children` | `align` | `color` | `variant` | `underline` | `style`
	 * @see {@link LinkProps}
	 */
	export interface LinkProps extends PDFComponentProps {
		href: string;
		/** @default 'left' */
		align?: 'left' | 'center' | 'right';
		color?: string;
		/** @default 'default' */
		variant?: LinkVariant;
		/** @default 'always' */
		underline?: LinkUnderline;
	}

	let { href, align, color, variant = 'default', underline, children, style }: LinkProps = $props();

	const theme = usePdfcnTheme();

	const createLinkStyles = (t: PdfcnTheme) => {
		const { fontWeights } = t.primitives;
		const base = {
			fontFamily: t.typography.body.fontFamily,
			fontSize: t.typography.body.fontSize,
			lineHeight: t.typography.body.lineHeight,
			marginBottom: t.spacing.paragraphGap
		};
		return {
			default: {
				...base,
				color: t.colors.accent,
				fontWeight: fontWeights.medium,
				textDecoration: 'underline'
			},
			muted: {
				...base,
				color: t.colors.mutedForeground,
				fontWeight: fontWeights.regular,
				textDecoration: 'underline'
			},
			primary: {
				...base,
				color: t.colors.primary,
				fontWeight: fontWeights.semibold,
				textDecoration: 'underline'
			},
			underlineAlways: { textDecoration: 'underline' },
			underlineNone: { textDecoration: 'none' }
		};
	};

	const styles = $derived(createLinkStyles(theme));

	const mergedStyle = $derived.by(() => {
		const variantMap = {
			default: styles.default,
			muted: styles.muted,
			primary: styles.primary
		};
		const underlineMap = {
			always: styles.underlineAlways,
			none: styles.underlineNone
		};
		const styleArray: Record<string, unknown>[] = [variantMap[variant]];
		if (underline && underline in underlineMap) {
			styleArray.push(underlineMap[underline]);
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

<PDFLink src={href} style={mergedStyle}>
	{@render children?.()}
</PDFLink>
