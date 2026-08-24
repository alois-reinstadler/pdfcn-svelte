<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { Style } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type SignatureVariant = 'single' | 'double' | 'inline';
	export interface SignatureSigner { label?: string; name?: string; title?: string; date?: string }
	export interface PdfSignatureBlockProps {
		/** @default 'single' */ variant?: SignatureVariant;
		label?: string; name?: string; title?: string; date?: string;
		signers?: [SignatureSigner, SignatureSigner]; style?: Style;
	}
	let { variant = 'single', label = 'Signature', name, title, date, signers, style }: PdfSignatureBlockProps = $props();
	const theme = usePdfcnTheme();
	const createSignatureStyles = (t: PdfcnTheme) => {
		const { spacing, fontWeights, typography } = t.primitives;
		return {
			block: { flex: 1, minWidth: 140 }, container: { marginBottom: t.spacing.componentGap, marginTop: t.spacing.sectionGap },
			dateText: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: typography.xs, marginTop: 1 },
			doubleRow: { flexDirection: 'row', gap: spacing[8], justifyContent: 'space-between' },
			inlineLabel: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: typography.sm },
			inlineLine: { borderBottomColor: t.colors.foreground, borderBottomStyle: 'solid', borderBottomWidth: 1, height: spacing[5], minWidth: 120, paddingHorizontal: spacing[2] },
			inlineName: { color: t.colors.foreground, fontFamily: t.typography.body.fontFamily, fontSize: t.typography.body.fontSize },
			inlineRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
			label: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: typography.sm, marginBottom: spacing[1] },
			line: { borderBottomColor: t.colors.foreground, borderBottomStyle: 'solid', borderBottomWidth: 1, marginBottom: spacing[1], minHeight: spacing[6] },
			name: { color: t.colors.foreground, fontFamily: t.typography.body.fontFamily, fontSize: t.typography.body.fontSize, fontWeight: fontWeights.semibold },
			titleText: { color: t.colors.mutedForeground, fontFamily: t.typography.body.fontFamily, fontSize: typography.sm }
		};
	};
	const styles = $derived(createSignatureStyles(theme));
	const containerStyle = $derived(mergeFormeStyles(styles.container, style));
	const resolvedSigners = $derived(signers ?? [{ date: '', label: 'Authorized by', name: '', title: '' }, { date: '', label: 'Approved by', name: '', title: '' }] as [SignatureSigner, SignatureSigner]);
</script>

{#snippet signerBlock(signer: SignatureSigner)}
	<View style={styles.block}>
		{#if signer.label}<PDFText style={styles.label}>{signer.label}</PDFText>{/if}<View style={styles.line} />
		{#if signer.name}<PDFText style={styles.name}>{signer.name}</PDFText>{/if}
		{#if signer.title}<PDFText style={styles.titleText}>{signer.title}</PDFText>{/if}
		{#if signer.date}<PDFText style={styles.dateText}>{signer.date}</PDFText>{/if}
	</View>
{/snippet}

<View wrap={false} style={containerStyle}>
	{#if variant === 'inline'}
		<View style={styles.inlineRow}><PDFText style={styles.inlineLabel}>{label}:</PDFText><View style={styles.inlineLine} />{#if name}<PDFText style={styles.inlineName}>{name}</PDFText>{/if}</View>
	{:else if variant === 'double'}
		<View style={styles.doubleRow}>{@render signerBlock(resolvedSigners[0])}{@render signerBlock(resolvedSigners[1])}</View>
	{:else}
		{@render signerBlock({ date, label, name, title })}
	{/if}
</View>
