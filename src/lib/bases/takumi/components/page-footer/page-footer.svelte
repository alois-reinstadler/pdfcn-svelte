<script lang="ts">
	import type { Snippet } from 'svelte';
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import { flattenTakumiStyle } from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps, Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';
	import { resolveColor } from '$lib/utils/resolve-color';

	export type PageFooterVariant = 'simple' | 'centered' | 'branded' | 'minimal' | 'three-column' | 'detailed';
	type FooterContent = string | Snippet;
	/** Footer row with layout variants, optional sticky or fixed positioning, and contact info support. */
	export interface PageFooterProps extends Omit<PDFComponentProps, 'children'> {
		leftText?: FooterContent; rightText?: FooterContent; centerText?: FooterContent;
		/** @default 'simple' */ variant?: PageFooterVariant;
		background?: string; textColor?: string; marginTop?: number; address?: string; phone?: string; email?: string; website?: string;
		/** Accepted for API parity; placement is controlled by Takumi's document renderer. */ fixed?: boolean;
		/** @default false */ sticky?: boolean;
		/** @default 0 */ pagePadding?: number;
		/** @default true */ noWrap?: boolean;
	}
	let { leftText, rightText, centerText, variant = 'simple', background, textColor, marginTop, address, phone, email, website, sticky = false, pagePadding = 0, noWrap = true, style }: PageFooterProps = $props();
	const theme = usePdfcnTheme();
	const createPageFooterStyles = (t: PdfcnTheme) => {
		const { spacing, fontWeights } = t.primitives; const c = t.colors; const { body } = t.typography;
		const textBase = { color: c.mutedForeground, fontFamily: body.fontFamily, fontSize: t.primitives.typography.xs, lineHeight: body.lineHeight };
		return {
			brandedContainer: { alignItems: 'center', backgroundColor: c.primary, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }, centeredContainer: { alignItems: 'center', borderTopColor: c.border, borderTopStyle: 'solid', borderTopWidth: spacing[0.5], display: 'flex', flexDirection: 'column', paddingTop: spacing[3] },
			companyBold: { ...textBase, color: c.foreground, fontWeight: fontWeights.bold }, companyName: { ...textBase, color: c.foreground, fontWeight: fontWeights.medium }, contactInfoCenter: { ...textBase, fontSize: t.primitives.typography.xs - 1, marginTop: spacing[0.5], textAlign: 'center' },
			detailedContainer: { borderTopColor: c.border, borderTopStyle: 'solid', borderTopWidth: spacing[1], display: 'flex', flexDirection: 'column', paddingTop: spacing[3] }, detailedLeft: { display: 'flex', flex: 1, flexDirection: 'column' }, detailedPageNumber: { ...textBase, borderTopColor: c.border, borderTopStyle: 'solid', borderTopWidth: spacing[0.5], paddingTop: spacing[2], textAlign: 'center' }, detailedRight: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }, detailedTopRow: { alignItems: 'flex-start', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[2] },
			minimalContainer: { alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: spacing[1], paddingTop: spacing[1] }, simpleContainer: { alignItems: 'center', borderTopColor: c.border, borderTopStyle: 'solid', borderTopWidth: spacing[0.5], display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing[3] },
			textBranded: { ...textBase, color: c.primaryForeground, fontWeight: fontWeights.medium }, textBrandedRight: { ...textBase, color: c.primaryForeground, textAlign: 'right' }, textCenter: { ...textBase, flex: 1, textAlign: 'center' }, textCenteredVariant: { ...textBase, marginBottom: spacing[1], textAlign: 'center' }, textLeft: { ...textBase, flex: 1 }, textRight: { ...textBase, textAlign: 'right' },
			threeColumnCenter: { alignItems: 'center', display: 'flex', flex: 1, flexDirection: 'column' }, threeColumnContainer: { alignItems: 'flex-start', borderTopColor: c.border, borderTopStyle: 'solid', borderTopWidth: spacing[0.5], display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing[3] }, threeColumnLeft: { display: 'flex', flex: 1, flexDirection: 'column' }, threeColumnRight: { alignItems: 'flex-end', display: 'flex', flex: 1, flexDirection: 'column' }
		};
	};
	const styles = $derived(createPageFooterStyles(theme));
	const resolvedTextColor = $derived(textColor ? resolveColor(textColor, theme.colors) : undefined);
	const colorize = (base: Style) => flattenTakumiStyle([base, resolvedTextColor ? { color: resolvedTextColor } : undefined]);
	const containerStyle = $derived.by(() => {
		const variantMap = { branded: styles.brandedContainer, centered: styles.centeredContainer, detailed: styles.detailedContainer, minimal: styles.minimalContainer, simple: styles.simpleContainer, 'three-column': styles.threeColumnContainer };
		const placement = sticky ? { bottom: pagePadding, left: pagePadding, position: 'absolute', right: pagePadding } : { paddingLeft: pagePadding, paddingRight: pagePadding };
		return flattenTakumiStyle([variantMap[variant], { marginTop: sticky ? 0 : (marginTop ?? theme.spacing.sectionGap) }, background ? { backgroundColor: resolveColor(background, theme.colors) } : undefined, style, placement]);
	});
</script>

{#snippet value(content: FooterContent)}{#if typeof content === 'function'}{@render content()}{:else}{content}{/if}{/snippet}
<View wrap={!noWrap} style={containerStyle}>
	{#if variant === 'branded'}
		{#if leftText}<PDFText style={colorize(styles.textBranded)}>{@render value(leftText)}</PDFText>{/if}{#if rightText}<PDFText style={colorize(styles.textBrandedRight)}>{@render value(rightText)}</PDFText>{/if}
	{:else if variant === 'centered'}
		{#if leftText}<PDFText style={colorize(styles.textCenteredVariant)}>{@render value(leftText)}</PDFText>{/if}
		{#if centerText}<PDFText style={colorize(styles.textCenteredVariant)}>{@render value(centerText)}</PDFText>{/if}
		{#if rightText}<PDFText style={colorize(styles.textCenteredVariant)}>{@render value(rightText)}</PDFText>{/if}
	{:else if variant === 'three-column'}
		<View style={styles.threeColumnLeft}>{#if leftText}<PDFText style={colorize(styles.companyName)}>{@render value(leftText)}</PDFText>{/if}{#if address}<PDFText style={colorize(styles.textLeft)}>{address}</PDFText>{/if}</View>
		<View style={styles.threeColumnCenter}>{#if centerText}<PDFText style={colorize(styles.textCenteredVariant)}>{@render value(centerText)}</PDFText>{/if}{#if phone}<PDFText style={colorize(styles.contactInfoCenter)}>{phone}</PDFText>{/if}{#if email}<PDFText style={colorize(styles.contactInfoCenter)}>{email}</PDFText>{/if}{#if website}<PDFText style={colorize(styles.contactInfoCenter)}>{website}</PDFText>{/if}</View>
		<View style={styles.threeColumnRight}>{#if rightText}<PDFText style={colorize(styles.textRight)}>{@render value(rightText)}</PDFText>{/if}</View>
	{:else if variant === 'detailed'}
		<View style={styles.detailedTopRow}><View style={styles.detailedLeft}>{#if leftText}<PDFText style={colorize(styles.companyBold)}>{@render value(leftText)}</PDFText>{/if}{#if address}<PDFText style={colorize(styles.textLeft)}>{address}</PDFText>{/if}</View><View style={styles.detailedRight}>{#if phone}<PDFText style={colorize(styles.textRight)}>Phone: {phone}</PDFText>{/if}{#if email}<PDFText style={colorize(styles.textRight)}>Email: {email}</PDFText>{/if}{#if website}<PDFText style={colorize(styles.textRight)}>Web: {website}</PDFText>{/if}</View></View>
		{#if rightText}<PDFText style={colorize(styles.detailedPageNumber)}>{@render value(rightText)}</PDFText>{/if}
	{:else}
		{#if leftText}<PDFText style={colorize(styles.textLeft)}>{@render value(leftText)}</PDFText>{/if}
		{#if variant === 'simple' && centerText}<PDFText style={colorize(styles.textCenter)}>{@render value(centerText)}</PDFText>{/if}
		{#if rightText}<PDFText style={colorize(styles.textRight)}>{@render value(rightText)}</PDFText>{/if}
	{/if}
</View>
