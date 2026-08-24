<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type CardVariant = 'default' | 'bordered' | 'muted';

	/**
	 * Bordered content card with optional title and padding presets.
	 * Props - `title` | `children` | `variant` | `padding` | `wrap` | `style`
	 */
	interface Props extends Omit<PDFComponentProps, 'children'> {
		title?: string;
		children?: PDFComponentProps['children'];
		/** @default 'default' */
		variant?: CardVariant;
		/** @default 'md' */
		padding?: 'sm' | 'md' | 'lg';
		/**
		 * When false, the card will not split across PDF pages.
		 * @default false
		 */
		wrap?: boolean;
	}

	let {
		title,
		children,
		variant = 'default',
		padding = 'md',
		wrap = false,
		style
	}: Props = $props();

	const theme = usePdfcnTheme();

	const createCardStyles = (t: PdfcnTheme) => {
		const { spacing, borderRadius, fontWeights } = t.primitives;
		return {
			body: {
				color: t.colors.foreground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: t.typography.body.fontSize,
				lineHeight: t.typography.body.lineHeight
			},
			card: {
				backgroundColor: t.colors.background,
				borderColor: t.colors.border,
				borderRadius: borderRadius.sm,
				borderStyle: 'solid',
				borderWidth: 1,
				marginBottom: t.spacing.componentGap
			},
			cardBordered: { borderWidth: 2 },
			cardMuted: { backgroundColor: t.colors.muted },
			paddingLg: { padding: spacing[4] },
			paddingMd: { padding: spacing[3] },
			paddingSm: { padding: spacing[2] },
			title: {
				borderBottomColor: t.colors.border,
				borderBottomStyle: 'solid',
				borderBottomWidth: 1,
				color: t.colors.foreground,
				fontFamily: t.typography.heading.fontFamily,
				fontSize: t.primitives.typography.base,
				fontWeight: fontWeights.semibold,
				lineHeight: t.typography.heading.lineHeight,
				marginBottom: spacing[2],
				paddingBottom: spacing[1] + 2
			}
		};
	};

	const styles = $derived(createCardStyles(theme));

	const cardStyle = $derived.by(() => {
		const paddingMap: Record<string, Record<string, unknown>> = {
			lg: styles.paddingLg,
			md: styles.paddingMd,
			sm: styles.paddingSm
		};
		return [
			styles.card,
			variant === 'bordered' ? styles.cardBordered : undefined,
			variant === 'muted' ? styles.cardMuted : undefined,
			paddingMap[padding],
			style
		];
	});
</script>

<View wrap={wrap} style={cardStyle}>
	{#if title}
		<PDFText style={styles.title}>{title}</PDFText>
	{/if}
	{@render children?.()}
</View>
