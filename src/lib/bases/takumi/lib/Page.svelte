<script lang="ts">
	import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
	import {
		flattenTakumiStyle,
		styleToCss,
		TAKUMI_DOCUMENT_PAGINATION_CONTEXT,
		TAKUMI_FLOW_PAGE_CONTEXT,
		TAKUMI_PAGE_PAGINATION_CONTEXT,
		type StyleInput,
		type TakumiDocumentPagination,
		type TakumiPagePagination,
		pointToCssPixel
	} from './pdf-primitives';
	import type { Style } from '$lib/types/pdf-components';

	interface Props {
		/** Let content continue onto physical pages; the server adapter reserves margins and repeats the footer. */
		flow?: boolean;
		/** Physical-page margins in points, used only with flow. Bottom reserves the repeated footer. */
		margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
		size?: string | { width: number; height: number };
		style?: StyleInput;
		children?: Snippet;
	}

	let { size, style, children, flow = false, margin = 48 }: Props = $props();

	setContext(TAKUMI_FLOW_PAGE_CONTEXT, { get flow() { return flow; } });
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
	// Takumi quantizes paged layout to whole CSS pixels. Keep explicit page
	// wrappers just inside the paper edge so fractional metric sizes never
	// round onto a trailing blank page. 0.4pt is only 0.53 CSS px.
	const PAGE_EDGE_INSET = 0.4;
	const insetPageDimension = (dimension: number) =>
		Math.max(dimension - PAGE_EDGE_INSET, 0);

	const sizeStyle = $derived.by((): Style | undefined => {
		if (!size) return undefined;
		const dimensions = typeof size === 'string' ? pageSizes[size] : size;
		if (!dimensions || typeof dimensions.height !== 'number' || typeof dimensions.width !== 'number') {
			return undefined;
		}
		return {
			height: insetPageDimension(dimensions.height),
			width: insetPageDimension(dimensions.width)
		};
	});

	const flowGeometry = $derived.by(() => {
		if (!flow) return undefined;
		const dimensions = typeof size === 'string' ? pageSizes[size] : size;
		if (size && !dimensions) throw new Error(`Unsupported flowing page size: ${size}`);
		const sides = typeof margin === 'number'
			? { top: margin, right: margin, bottom: margin, left: margin }
			: { top: 0, right: 0, bottom: 0, left: 0, ...margin };
		for (const value of Object.values(sides)) {
			if (!Number.isFinite(value) || value < 0) throw new Error('Flow margins must be finite non-negative numbers in points.');
		}
		if (dimensions && (!Number.isFinite(dimensions.width) || !Number.isFinite(dimensions.height)
			|| Number(dimensions.width) <= 0 || Number(dimensions.height) <= 0)) {
			throw new Error('Flow page dimensions must be finite positive numbers in points.');
		}
		return JSON.stringify({
			size: typeof size === 'string' ? size.toLowerCase() : dimensions
				? { width: pointToCssPixel(Number(dimensions.width)), height: pointToCssPixel(Number(dimensions.height)) } : 'a4',
			margin: Object.fromEntries(Object.entries(sides).map(([side, value]) => [side, pointToCssPixel(value)]))
		});
	});

	const css = $derived(
		styleToCss({
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			...sizeStyle,
			...flattenTakumiStyle(style),
			...(flow ? { height: undefined, minHeight: undefined, width: undefined, padding: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 } : {})
		})
	);
</script>

<div data-pdf-page data-pdf-flow={flowGeometry} style={css}>{@render children?.()}</div>
