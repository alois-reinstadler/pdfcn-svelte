<script lang="ts">
	import type { Snippet } from 'svelte';

	import Fixed from '$lib/bases/forme/lib/Fixed.svelte';
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';
	import { resolveColor } from '$lib/utils/resolve-color';

	export type PageHeaderVariant =
		| 'simple'
		| 'centered'
		| 'minimal'
		| 'branded'
		| 'logo-left'
		| 'logo-right'
		| 'two-column';

	/** Header row with layout variants, logo support, and optional fixed positioning. */
	interface Props extends Omit<PDFComponentProps, 'children'> {
		title: string;
		subtitle?: string;
		rightText?: string;
		rightSubText?: string;
		/** @default 'simple' */
		variant?: PageHeaderVariant;
		background?: string;
		titleColor?: string;
		marginBottom?: number;
		address?: string;
		phone?: string;
		email?: string;
		logo?: Snippet;
		/** @default false */
		fixed?: boolean;
		/** @default true */
		noWrap?: boolean;
	}

	let {
		title,
		subtitle,
		rightText,
		rightSubText,
		variant = 'simple',
		background,
		titleColor,
		marginBottom,
		address,
		phone,
		email,
		logo,
		fixed = false,
		noWrap = true,
		style
	}: Props = $props();

	const theme = usePdfcnTheme();

	const createPageHeaderStyles = (t: PdfcnTheme) => {
		const { spacing, borderRadius, fontWeights } = t.primitives;
		const c = t.colors;
		const { heading, body } = t.typography;
		return {
			brandedContainer: {
				alignItems: 'center', backgroundColor: c.primary, borderRadius: borderRadius.sm,
				display: 'flex', flexDirection: 'column', padding: spacing[6]
			},
			centeredContainer: {
				alignItems: 'center', borderBottomColor: c.border, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5], display: 'flex', flexDirection: 'column', paddingBottom: spacing[4]
			},
			contactInfo: {
				color: c.mutedForeground, fontFamily: body.fontFamily, fontSize: t.primitives.typography.xs,
				marginTop: spacing[0.5], textAlign: 'right'
			},
			logoContainer: { flexShrink: 0, height: 48, marginRight: spacing[4], width: 48 },
			logoContent: { display: 'flex', flex: 1, flexDirection: 'column', paddingLeft: spacing[4] },
			logoLeftContainer: {
				alignItems: 'center', borderBottomColor: c.border, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5], display: 'flex', flexDirection: 'row', paddingBottom: spacing[4]
			},
			logoRightContainer: {
				alignItems: 'center', borderBottomColor: c.border, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5], display: 'flex', flexDirection: 'row',
				justifyContent: 'space-between', paddingBottom: spacing[4]
			},
			logoRightContent: { display: 'flex', flex: 1, flexDirection: 'column' },
			logoRightLogoContainer: { flexShrink: 0, height: 48, marginLeft: spacing[4], width: 48 },
			minimalContainer: {
				alignItems: 'center', borderBottomColor: c.primary, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[1], display: 'flex', flexDirection: 'row',
				justifyContent: 'space-between', paddingBottom: spacing[3]
			},
			minimalLeft: { flex: 1 },
			minimalRight: { alignItems: 'flex-end' },
			rightSubText: {
				color: c.mutedForeground, fontFamily: body.fontFamily, fontSize: t.primitives.typography.xs,
				marginTop: spacing[1], textAlign: 'right'
			},
			rightText: {
				color: c.foreground, fontFamily: body.fontFamily, fontSize: body.fontSize,
				fontWeight: fontWeights.medium, textAlign: 'right'
			},
			simpleContainer: {
				alignItems: 'flex-start', borderBottomColor: c.border, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5], display: 'flex', flexDirection: 'row',
				justifyContent: 'space-between', paddingBottom: spacing[4]
			},
			simpleLeft: { display: 'flex', flex: 1, flexDirection: 'column' },
			simpleRight: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column' },
			subtitle: {
				color: c.mutedForeground, fontFamily: body.fontFamily, fontSize: body.fontSize,
				lineHeight: body.lineHeight, marginTop: spacing[1]
			},
			subtitleBranded: { color: c.primaryForeground, marginTop: spacing[1] },
			subtitleCentered: { textAlign: 'center' },
			title: {
				color: c.foreground, fontFamily: heading.fontFamily, fontSize: heading.fontSize.h3,
				fontWeight: fontWeights.bold, lineHeight: heading.lineHeight, marginBottom: 0
			},
			titleBranded: { color: c.primaryForeground },
			titleCentered: { textAlign: 'center' },
			titleMinimal: { fontSize: heading.fontSize.h3, fontWeight: fontWeights.bold },
			twoColumnContainer: {
				alignItems: 'flex-start', borderBottomColor: c.border, borderBottomStyle: 'solid',
				borderBottomWidth: spacing[0.5], display: 'flex', flexDirection: 'row',
				justifyContent: 'space-between', paddingBottom: spacing[4]
			},
			twoColumnLeft: { display: 'flex', flex: 1, flexDirection: 'column' },
			twoColumnRight: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }
		};
	};

	const styles = $derived(createPageHeaderStyles(theme));
	const containerStyle = $derived.by(() => {
		const variantMap = {
			branded: styles.brandedContainer,
			centered: styles.centeredContainer,
			'logo-left': styles.logoLeftContainer,
			'logo-right': styles.logoRightContainer,
			minimal: styles.minimalContainer,
			simple: styles.simpleContainer,
			'two-column': styles.twoColumnContainer
		};
		return mergeFormeStyles(
			variantMap[variant],
			{ marginBottom: marginBottom ?? theme.spacing.sectionGap },
			background ? { backgroundColor: resolveColor(background, theme.colors) } : undefined,
			style
		);
	});
	const titleStyle = $derived.by(() =>
		mergeFormeStyles(
			styles.title,
			variant === 'branded' ? styles.titleBranded : undefined,
			variant === 'branded' || variant === 'centered' ? styles.titleCentered : undefined,
			variant === 'minimal' ? styles.titleMinimal : undefined,
			titleColor ? { color: resolveColor(titleColor, theme.colors) } : undefined
		)
	);
</script>

{#snippet content()}
	<View wrap={!noWrap} style={containerStyle}>
		{#if variant === 'branded' || variant === 'centered'}
			<PDFText style={titleStyle}>{title}</PDFText>
			{#if subtitle}
				<PDFText style={[styles.subtitle, variant === 'branded' ? styles.subtitleBranded : styles.subtitleCentered]}>{subtitle}</PDFText>
			{/if}
		{:else if variant === 'logo-right'}
			<View style={styles.logoRightContent}>
				<PDFText style={titleStyle}>{title}</PDFText>
				{#if subtitle}<PDFText style={styles.subtitle}>{subtitle}</PDFText>{/if}
			</View>
			{#if logo}<View style={styles.logoRightLogoContainer}>{@render logo()}</View>{/if}
		{:else if variant === 'logo-left'}
			{#if logo}<View style={styles.logoContainer}>{@render logo()}</View>{/if}
			<View style={styles.logoContent}>
				<PDFText style={titleStyle}>{title}</PDFText>
				{#if subtitle}<PDFText style={styles.subtitle}>{subtitle}</PDFText>{/if}
			</View>
			{#if rightText || rightSubText}
				<View style={styles.simpleRight}>
					{#if rightText}<PDFText style={styles.rightText}>{rightText}</PDFText>{/if}
					{#if rightSubText}<PDFText style={styles.rightSubText}>{rightSubText}</PDFText>{/if}
				</View>
			{/if}
		{:else if variant === 'two-column'}
			<View style={styles.twoColumnLeft}>
				<PDFText style={titleStyle}>{title}</PDFText>
				{#if subtitle}<PDFText style={styles.subtitle}>{subtitle}</PDFText>{/if}
			</View>
			{#if address || phone || email}
				<View style={styles.twoColumnRight}>
					{#if address}<PDFText style={styles.contactInfo}>{address}</PDFText>{/if}
					{#if phone}<PDFText style={styles.contactInfo}>{phone}</PDFText>{/if}
					{#if email}<PDFText style={styles.contactInfo}>{email}</PDFText>{/if}
				</View>
			{/if}
		{:else}
			<View style={variant === 'minimal' ? styles.minimalLeft : styles.simpleLeft}>
				<PDFText style={titleStyle}>{title}</PDFText>
				{#if subtitle}<PDFText style={styles.subtitle}>{subtitle}</PDFText>{/if}
			</View>
			{#if rightText || rightSubText}
				<View style={variant === 'minimal' ? styles.minimalRight : styles.simpleRight}>
					{#if rightText}<PDFText style={styles.rightText}>{rightText}</PDFText>{/if}
					{#if rightSubText}<PDFText style={styles.rightSubText}>{rightSubText}</PDFText>{/if}
				</View>
			{/if}
		{/if}
	</View>
{/snippet}

{#if fixed}
	<Fixed position="header">{@render content()}</Fixed>
{:else}
	{@render content()}
{/if}
