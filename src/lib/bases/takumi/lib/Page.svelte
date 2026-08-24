<script lang="ts">
	import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
	import {
		flattenTakumiStyle,
		styleToCss,
		TAKUMI_DOCUMENT_PAGINATION_CONTEXT,
		TAKUMI_PAGE_PAGINATION_CONTEXT,
		type StyleInput,
		type TakumiDocumentPagination,
		type TakumiPagePagination
	} from './pdf-primitives';
	import type { Style } from '$lib/types/pdf-components';

	interface Props {
		size?: string | { width: number; height: number };
		style?: StyleInput;
		children?: Snippet;
	}

	let { size, style, children }: Props = $props();

	const documentPagination = getContext<TakumiDocumentPagination | undefined>(
		TAKUMI_DOCUMENT_PAGINATION_CONTEXT
	);
	const pageId = Symbol('takumi-page');
	documentPagination?.register(pageId);
	onDestroy(() => documentPagination?.unregister(pageId));

	const pagePagination: TakumiPagePagination = {
		get pageNumber() {
			return documentPagination?.pageNumber(pageId) ?? 1;
		},
		get totalPages() {
			return documentPagination?.totalPages ?? 1;
		}
	};
	setContext(TAKUMI_PAGE_PAGINATION_CONTEXT, pagePagination);

	const pageSizes: Record<string, Style> = {
		A3: { height: 1190.55, width: 841.89 },
		A4: { height: 841.89, width: 595.28 },
		A5: { height: 595.28, width: 419.53 },
		Legal: { height: 1008, width: 612 },
		Letter: { height: 792, width: 612 },
		Tabloid: { height: 1224, width: 792 }
	};

	const sizeStyle = $derived.by((): Style | undefined => {
		if (!size) return undefined;
		if (typeof size === 'string') return pageSizes[size];
		return { height: size.height, width: size.width };
	});

	const css = $derived(
		styleToCss({
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			...sizeStyle,
			...flattenTakumiStyle(style)
		})
	);
</script>

<div data-pdf-page style={css}>{@render children?.()}</div>
