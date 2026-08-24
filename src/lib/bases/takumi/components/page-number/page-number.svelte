<script lang="ts">
	import PDFText from '$lib/bases/takumi/lib/Text.svelte';
	import View from '$lib/bases/takumi/lib/View.svelte';
	import {
		flattenTakumiStyle,
		TAKUMI_PAGE_PAGINATION_CONTEXT,
		type TakumiPagePagination
	} from '$lib/bases/takumi/lib/pdf-primitives';
	import { usePdfcnTheme } from '$lib/theme-provider.svelte';
	import type { PDFComponentProps } from '$lib/types/pdf-components';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';
	import { getContext } from 'svelte';

	export type PageNumberAlign = 'left' | 'center' | 'right';
	export type PageNumberSize = 'xs' | 'sm' | 'md';

	/**
	 * Auto page number rendered with a configurable format string at a or inline position.
	 * Props - `format` | `align` | `size` | `fixed` | `muted` | `style`
	 */
	export interface PageNumberProps extends Omit<PDFComponentProps, 'children'> {
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
	}: PageNumberProps = $props();

	const theme = usePdfcnTheme();
	const pagination = getContext<TakumiPagePagination | undefined>(
		TAKUMI_PAGE_PAGINATION_CONTEXT
	);

	const createPageNumberStyles = (t: PdfcnTheme) => {
		const { typography, colors, primitives } = t;
		return {
			alignCenter: { textAlign: 'center' },
			alignLeft: { textAlign: 'left' },
			alignRight: { textAlign: 'right' },
			colorForeground: { color: colors.foreground },
			colorMuted: { color: colors.mutedForeground },
			container: {
				display: 'flex',
				flexDirection: 'row',
				width: '100%'
			},
			justifyCenter: { justifyContent: 'center' },
			justifyLeft: { justifyContent: 'flex-start' },
			justifyRight: { justifyContent: 'flex-end' },
			sizeMd: { fontSize: primitives.typography.base },
			sizeSm: { fontSize: primitives.typography.sm },
			sizeXs: { fontSize: primitives.typography.xs },
			text: { fontFamily: typography.body.fontFamily }
		};
	};

	const styles = $derived(createPageNumberStyles(theme));

	const containerStyle = $derived.by(() => {
		const justifyMap: Record<string, Record<string, unknown>> = {
			center: styles.justifyCenter,
			left: styles.justifyLeft,
			right: styles.justifyRight
		};
		return flattenTakumiStyle([styles.container, justifyMap[align]]);
	});

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
		return flattenTakumiStyle([
			styles.text,
			alignMap[align],
			sizeMap[size],
			muted ? styles.colorMuted : styles.colorForeground,
			style
		]);
	});

	const parts = $derived(format.split(/(\{page\}|\{total\})/g).filter(Boolean));
</script>

<View style={containerStyle} {fixed}>
	<PDFText style={textStyle}>{#each parts as part}{#if part === '{page}'}<span class="pageNumber">{pagination?.pageNumber ?? 1}</span>{:else if part === '{total}'}<span class="totalPages">{pagination?.totalPages ?? 1}</span>{:else}{part}{/if}{/each}</PDFText>
</View>
