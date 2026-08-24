<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import {
		flattenTakumiStyle,
		styleToCss,
		TAKUMI_DOCUMENT_PAGINATION_CONTEXT,
		type StyleInput,
		type TakumiDocumentPagination
	} from './pdf-primitives';

	interface Props {
		title?: string;
		style?: StyleInput;
		children?: Snippet;
	}

	let { title, style, children }: Props = $props();

	let pages = $state<symbol[]>([]);
	const pagination: TakumiDocumentPagination = {
		register(page) {
			if (!pages.includes(page)) pages.push(page);
		},
		unregister(page) {
			const index = pages.indexOf(page);
			if (index !== -1) pages.splice(index, 1);
		},
		pageNumber(page) {
			const index = pages.indexOf(page);
			return index === -1 ? 1 : index + 1;
		},
		get totalPages() {
			return Math.max(pages.length, 1);
		}
	};

	setContext(TAKUMI_DOCUMENT_PAGINATION_CONTEXT, pagination);

	const css = $derived(
		styleToCss({
			display: 'flex',
			flexDirection: 'column',
			...flattenTakumiStyle(style)
		})
	);
</script>

<div data-pdf-document={title ?? ''} {title} style={css}>{@render children?.()}</div>
