<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Svg } from '@formepdf/svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps, Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

	/**
	 * Alert box with severity variants for info, success, warning, and error states.
	 * Props - `variant` | `title` | `description` | `children` | `showIcon` | `showBorder` | `style`
	 * @see {@link PdfAlertProps}
	 */
	export interface PdfAlertProps extends Omit<PDFComponentProps, 'children'> {
		/** @default 'info' */
		variant?: AlertVariant;
		title?: string;
		/**
		 * Styled plain-text description. Use `children` for arbitrary component content.
		 */
		description?: string | number;
		children?: Snippet;
		/** @default true */
		showIcon?: boolean;
		/** @default true */
		showBorder?: boolean;
	}

	let {
		variant = 'info',
		title,
		description,
		children,
		showIcon = true,
		showBorder = true,
		style
	}: PdfAlertProps = $props();

	const theme = usePdfcnTheme();

	/** Stroke width for all alert SVG icons (SVG user units). */
	const ICON_STROKE_WIDTH = 1.5;

	const borderLeft = (color: string) => ({
		borderLeftColor: color,
		borderLeftWidth: 4
	});

	const createAlertStyles = (t: PdfcnTheme) => {
		const { typography, colors, primitives } = t;
		const variantColors = {
			error: colors.destructive ?? '#EF4444',
			info: colors.info ?? '#3B82F6',
			success: colors.success ?? '#22C55E',
			warning: colors.warning ?? '#F59E0B'
		} satisfies Record<AlertVariant, string>;
		const sheet = {
			bg: {
				backgroundColor: colors.muted
			},
			borderError: borderLeft(variantColors.error),
			borderInfo: borderLeft(variantColors.info),
			borderSuccess: borderLeft(variantColors.success),
			borderWarning: borderLeft(variantColors.warning),
			container: {
				borderRadius: 4,
				flexDirection: 'row',
				marginBottom: t.spacing.componentGap,
				padding: 12
			},
			contentContainer: { flex: 1 },
			description: {
				color: colors.mutedForeground,
				fontFamily: typography.body.fontFamily,
				fontSize: primitives.typography.sm,
				lineHeight: typography.body.lineHeight
			},
			iconContainer: {
				alignItems: 'center',
				justifyContent: 'flex-start',
				marginRight: 10,
				paddingTop: 2,
				width: 20
			},
			title: {
				color: colors.foreground,
				fontFamily: typography.heading.fontFamily,
				fontSize: primitives.typography.sm,
				fontWeight: primitives.fontWeights.semibold,
				marginBottom: 4
			}
		};
		return {
			...sheet,
			borderMap: {
				error: sheet.borderError,
				info: sheet.borderInfo,
				success: sheet.borderSuccess,
				warning: sheet.borderWarning
			} as Record<AlertVariant, Style>,
			/** Resolved hex colors for each variant — used to tint the SVG icons. */
			variantColors
		};
	};

	/** Inner SVG markup mirroring the reference icon output, one shape per line. */
	const createIconContent = (v: AlertVariant, color: string): string => {
		switch (v) {
			case 'error':
				return (
					`<circle cx="8" cy="8" r="7" fill="none" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" />` +
					`<line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" />` +
					`<line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" />`
				);
			case 'info':
				return (
					`<circle cx="8" cy="8" r="7" fill="none" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" />` +
					`<circle cx="8" cy="4.5" r="1" fill="${color}" />` +
					`<line x1="8" y1="7" x2="8" y2="11.5" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" />`
				);
			case 'success':
				return (
					`<circle cx="8" cy="8" r="7" fill="none" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" />` +
					`<path d="M5 8 L7 10 L11 6" fill="none" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" />`
				);
			case 'warning':
				return (
					`<path d="M8 1.5 L15 14.5 L1 14.5 Z" fill="none" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linejoin="round" />` +
					`<line x1="8" y1="6" x2="8" y2="10" stroke="${color}" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" />` +
					`<circle cx="8" cy="12.5" r="0.75" fill="${color}" />`
				);
		}
	};

	const styles = $derived(createAlertStyles(theme));

	const containerStyle = $derived.by(() => {
		const borderMap = styles.borderMap;
		return mergeFormeStyles(
			styles.container,
			styles.bg,
			showBorder ? borderMap[variant] : undefined,
			style ?? undefined
		);
	});
</script>

{#if title || description !== undefined || children}
	<View wrap={false} style={containerStyle}>
		{#if showIcon}
			<View style={styles.iconContainer}>
				<Svg
					width={16}
					height={16}
					viewBox="0 0 16 16"
					content={createIconContent(variant, styles.variantColors[variant])}
				/>
			</View>
		{/if}
		<View style={styles.contentContainer}>
			{#if title}
				<PDFText style={styles.title}>{title}</PDFText>
			{/if}
			{#if description !== undefined}
				<PDFText style={styles.description}>{description}</PDFText>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</View>
	</View>
{/if}
