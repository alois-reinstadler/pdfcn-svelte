import type { Component } from 'svelte';
import type { RenderOptions } from 'takumi-pdf';

/** Props for Svelte SSR plus the official takumi-pdf 0.11 render options. */
export type RenderTakumiDocumentOptions<Props extends Record<string, any>> = RenderOptions & {
	/** Props passed to the Svelte document template during server rendering. */
	props?: Props;
};

/** The official options accepted by takumi-pdf's binary renderer. */
export type TakumiPdfRenderOptions = RenderOptions;

/**
 * Server-render a Svelte document template to HTML and pass it to takumi-pdf.
 *
 * Both the component body and its SSR head are retained so component-scoped
 * styles continue to apply when Takumi parses the generated HTML.
 */
export async function renderTakumiDocument<Props extends Record<string, any>>(
	template: Component<Props>,
	options: RenderTakumiDocumentOptions<Props> = {}
): Promise<Uint8Array> {
	const { props, ...renderOptions } = options;
	const [{ render: renderSvelte }, { render: renderTakumi }] = await Promise.all([
		import('svelte/server'),
		import('takumi-pdf')
	]);
	const renderComponent = renderSvelte as unknown as (
		component: Component<Props>,
		options: { props?: Props }
	) => { body: string; head: string };
	const { body, head } = await renderComponent(template, { props });
	// HTML input otherwise receives Takumi's browser-like 8px body margin,
	// which makes an explicit full-page wrapper overflow onto a blank page.
	const html = `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style>${head}</head><body>${body}</body></html>`;

	return renderTakumi(html, renderOptions);
}

/** Short renderer-base-local alias matching Forme's one-call API name. */
export { renderTakumiDocument as renderDocument };
