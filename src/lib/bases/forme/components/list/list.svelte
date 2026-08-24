<script lang="ts">
	import View from '$lib/bases/forme/lib/View.svelte';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import {
		mergeFormeStyles,
		type Style
	} from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	/** List visual style variant. */
	export type ListVariant =
		| 'bullet'
		| 'numbered'
		| 'checklist'
		| 'icon'
		| 'multi-level'
		| 'descriptive';

	export type ListGap = 'xs' | 'sm' | 'md';

	/** A single list item, optionally with nested children. */
	export interface ListItem {
		text: string;
		description?: string;
		checked?: boolean;
		children?: ListItem[];
	}

	/**
	 * List of items with bullet, numbered, checklist, icon, multi-level, and descriptive variants.
	 * Props - `items` | `variant` | `gap` | `style` | `_level` | `noWrap`
	 */
	export interface PdfListProps extends Omit<PDFComponentProps, 'children'> {
		items: ListItem[];
		/** @default 'bullet' */
		variant?: ListVariant;
		/** @default 'sm' */
		gap?: ListGap;
		/** Internal starting indentation level for nested lists. @default 0 */
		_level?: number;
		/** Prevent the list from splitting across PDF pages. @default false */
		noWrap?: boolean;
	}

	let {
		items,
		variant = 'bullet',
		gap = 'sm',
		style,
		_level = 0,
		noWrap = false
	}: PdfListProps = $props();

	const theme = usePdfcnTheme();

	const createListStyles = (t: PdfcnTheme) => {
		const { borderRadius, spacing, fontWeights, typography } = t.primitives;
		return {
			checkBox: {
				alignItems: 'center',
				backgroundColor: t.colors.background,
				borderColor: t.colors.border,
				borderRadius: 3,
				borderStyle: 'solid',
				borderWidth: 1.5,
				height: spacing[4],
				justifyContent: 'center',
				marginRight: spacing[2],
				width: spacing[4]
			},
			checkBoxChecked: {
				backgroundColor: t.colors.success,
				borderColor: t.colors.success
			},
			childrenContainer: {
				display: 'flex',
				flexDirection: 'column',
				marginLeft: spacing[5],
				marginTop: spacing[1]
			},
			container: {
				display: 'flex',
				flexDirection: 'column',
				marginBottom: t.spacing.componentGap,
				width: '100%'
			},
			descriptiveAccent: {
				backgroundColor: t.colors.primary,
				borderRadius: borderRadius.sm,
				marginRight: spacing[3],
				minHeight: spacing[4],
				width: 3
			},
			descriptiveContent: { flex: 1 },
			descriptiveDesc: {
				color: t.colors.mutedForeground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: typography.sm,
				lineHeight: t.typography.body.lineHeight,
				marginTop: 1
			},
			descriptiveTitle: {
				color: t.colors.foreground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: t.typography.body.fontSize,
				fontWeight: fontWeights.semibold,
				lineHeight: t.typography.body.lineHeight
			},
			iconBox: {
				alignItems: 'center',
				backgroundColor: t.colors.primary,
				borderRadius: borderRadius.md,
				height: spacing[5],
				justifyContent: 'center',
				marginRight: spacing[2],
				width: spacing[5]
			},
			iconMark: {
				color: t.colors.primaryForeground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: 9,
				fontWeight: fontWeights.bold
			},
			itemRow: { alignItems: 'flex-start', flexDirection: 'row' },
			itemRowCenter: { alignItems: 'center', flexDirection: 'row' },
			itemRowGapMd: { marginBottom: spacing[3] },
			itemRowGapSm: { marginBottom: spacing[2] },
			itemRowGapXs: { marginBottom: spacing[1] },
			itemText: {
				color: t.colors.foreground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: t.typography.body.fontSize,
				lineHeight: t.typography.body.lineHeight
			},
			itemTextBold: { fontWeight: fontWeights.semibold },
			itemTextSub: {
				color: t.colors.mutedForeground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: t.typography.body.fontSize - 0.5,
				lineHeight: t.typography.body.lineHeight
			},
			itemTextWrap: { flex: 1 },
			markerBulletDot: {
				backgroundColor: t.colors.primary,
				borderRadius: 3,
				height: 5,
				width: 5
			},
			markerBulletSubDot: {
				backgroundColor: 'transparent',
				borderColor: t.colors.mutedForeground,
				borderRadius: 2,
				borderStyle: 'solid',
				borderWidth: 1,
				height: 4,
				width: 4
			},
			markerBulletSubWrap: {
				alignItems: 'center',
				justifyContent: 'flex-start',
				marginTop: spacing[1],
				width: spacing[4]
			},
			markerBulletWrap: {
				alignItems: 'center',
				justifyContent: 'flex-start',
				marginTop: spacing[1],
				width: spacing[4]
			},
			markerNumberBadge: {
				alignItems: 'center',
				backgroundColor: t.colors.primary,
				borderRadius: spacing[5],
				height: spacing[5],
				justifyContent: 'center',
				marginRight: spacing[2],
				width: spacing[5]
			},
			markerNumberText: {
				color: t.colors.primaryForeground,
				fontFamily: t.typography.body.fontFamily,
				fontSize: typography.xs,
				fontWeight: fontWeights.bold
			}
		};
	};

	const styles = $derived(createListStyles(theme));

	const getGapStyle = (): Style => {
		if (gap === 'xs') return styles.itemRowGapXs;
		if (gap === 'md') return styles.itemRowGapMd;
		return styles.itemRowGapSm;
	};

	const getRowStyle = (
		index: number,
		total: number,
		align: 'start' | 'center' = 'start'
	): Style =>
		mergeFormeStyles(
			align === 'center' ? styles.itemRowCenter : styles.itemRow,
			index !== total - 1 ? getGapStyle() : undefined
		) ?? {};

	const containerStyle = $derived(
		mergeFormeStyles(
			styles.container,
			_level > 0 ? styles.childrenContainer : undefined,
			style ?? undefined
		)
	);
</script>

{#snippet marker(level: number)}
	{#if level === 0}
		<View style={styles.markerBulletWrap}>
			<View style={styles.markerBulletDot} />
		</View>
	{:else}
		<View style={styles.markerBulletSubWrap}>
			<View style={styles.markerBulletSubDot} />
		</View>
	{/if}
{/snippet}

{#snippet renderItems(currentItems: ListItem[], level: number)}
	{#each currentItems as item, index (index)}
		{#if variant === 'bullet' || variant === 'multi-level'}
			<View>
				<View style={getRowStyle(index, currentItems.length)}>
					{@render marker(level)}
					<View style={styles.itemTextWrap}>
						<PDFText
							style={mergeFormeStyles(
								level === 0 || variant === 'bullet' ? styles.itemText : styles.itemTextSub,
								variant === 'multi-level' && level === 0 ? styles.itemTextBold : undefined
							)}
						>
							{item.text}
						</PDFText>
					</View>
				</View>
				{#if item.children?.length}
					<View style={styles.childrenContainer}>
						{@render renderItems(item.children, level + 1)}
					</View>
				{/if}
			</View>
		{:else if variant === 'numbered'}
			<View style={getRowStyle(index, currentItems.length, 'center')}>
				<View style={styles.markerNumberBadge}>
					<PDFText style={styles.markerNumberText}>{index + 1}</PDFText>
				</View>
				<View style={styles.itemTextWrap}>
					<PDFText style={styles.itemText}>{item.text}</PDFText>
				</View>
			</View>
		{:else if variant === 'checklist'}
			<View style={getRowStyle(index, currentItems.length, 'center')}>
				<View
					style={mergeFormeStyles(
						styles.checkBox,
						(item.checked ?? true) ? styles.checkBoxChecked : undefined
					)}
				/>
				<View style={styles.itemTextWrap}>
					<PDFText style={styles.itemText}>{item.text}</PDFText>
				</View>
			</View>
		{:else if variant === 'icon'}
			<View style={getRowStyle(index, currentItems.length, 'center')}>
				<View style={styles.iconBox}>
					<PDFText style={styles.iconMark}>★</PDFText>
				</View>
				<View style={styles.itemTextWrap}>
					<PDFText style={styles.itemText}>{item.text}</PDFText>
				</View>
			</View>
		{:else if variant === 'descriptive'}
			<View style={getRowStyle(index, currentItems.length)}>
				<View style={styles.descriptiveAccent} />
				<View style={styles.descriptiveContent}>
					<PDFText style={styles.descriptiveTitle}>{item.text}</PDFText>
					{#if item.description}
						<PDFText style={styles.descriptiveDesc}>{item.description}</PDFText>
					{/if}
				</View>
			</View>
		{/if}
	{/each}
{/snippet}

<View wrap={!noWrap} style={containerStyle}>
	{@render renderItems(items, _level)}
</View>
