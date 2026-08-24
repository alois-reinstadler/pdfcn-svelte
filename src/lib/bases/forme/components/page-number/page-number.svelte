<script lang="ts">
	import PDFText from '$lib/bases/forme/lib/Text.svelte';
	import Fixed from '$lib/bases/forme/lib/Fixed.svelte';
	import View from '$lib/bases/forme/lib/View.svelte';
	import { PAGE_NUMBER, TOTAL_PAGES, mergeFormeStyles } from '$lib/bases/forme/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	export type PageNumberAlign = 'left' | 'center' | 'right';
	export type PageNumberSize = 'xs' | 'sm' | 'md';

	/**
	 * Auto page number rendered with a configurable format string at a or inline position.
	 * Props - `format` | `align` | `size` | `fixed` | `muted` | `style`
	 */
	interface Props extends Omit<PDFComponentProps, 'children'> {
		/**
		 * Format string — use `{page}` for current page and `{total}` for total page count.
		 * @default 'Page {page} of {total}'
		 */
		format?: string;
		/** @default 'center' */
		align?: PageNumberAlign;
		/** @default 'sm' */
		size?: PageNumberSize;
		/** @default false */
		fixed?: boolean;
		/** @default true */
		muted?: boolean;
		children?: never;
	}

	let {
		format = 'Page {page} of {total}',
		align = 'center',
		size = 'sm',
		fixed = false,
		muted = true,
		style
	}: Props = $props();

	const theme = usePdfcnTheme();

	const createPageNumberStyles = (t: PdfcnTheme) => {
		const { typography, colors, primitives } = t;
		return {
			alignCenter: { textAlign: 'center' },
			alignLeft: { textAlign: 'left' },
			alignRight: { textAlign: 'right' },
			colorForeground: { color: colors.foreground },
			colorMuted: { color: colors.mutedForeground },
			container: { width: '100%' },
			sizeMd: { fontSize: primitives.typography.base },
			sizeSm: { fontSize: primitives.typography.sm },
			sizeXs: { fontSize: primitives.typography.xs },
			text: { fontFamily: typography.body.fontFamily }
		};
	};

	const styles = $derived(createPageNumberStyles(theme));

	const content = $derived(
		format.replaceAll('{page}', PAGE_NUMBER).replaceAll('{total}', TOTAL_PAGES)
	);

	const textStyle = $derived.by(() => {
		const alignMap: Record<string, Record<string, unknown>> = {
			center: styles.alignCenter,
			left: styles.alignLeft,
			right: styles.alignRight
		};
		const sizeMap: Record<string, Record<string, unknown>> = {
			md: styles.sizeMd,
			sm: styles.sizeSm,
			xs: styles.sizeXs
		};
		return mergeFormeStyles(
			styles.text,
			alignMap[align],
			sizeMap[size],
			muted ? styles.colorMuted : styles.colorForeground,
			style
		);
	});
</script>

{#snippet number()}
	<PDFText style={textStyle}>{content}</PDFText>
{/snippet}

{#if fixed}
	<Fixed position="footer" style={styles.container}>{@render number()}</Fixed>
{:else}
	<View style={styles.container}>{@render number()}</View>
{/if}
