import type { Component } from 'svelte';
import type { RenderOptions } from 'takumi-pdf';
import { TAKUMI_PDF_RENDER_CONTEXT } from './render-context';

/** Props for Svelte SSR plus the official takumi-pdf 0.11 render options. */
export type RenderTakumiDocumentOptions<Props extends Record<string, any>> = RenderOptions & {
	/** Props passed to the Svelte document template during server rendering. */
	props?: Props;
};

/** The official options accepted by takumi-pdf's binary renderer. */
export type TakumiPdfRenderOptions = RenderOptions;

/**
 * Svelte's SSR output contains hydration boundary comments around dynamic text.
 * They are useful to a hydrating browser, but takumi-pdf treats text separated
 * by those markers as empty. HTML comments have no visual PDF semantics, so
 * remove them before handing the document to the PDF parser.
 */
function stripSvelteSsrMarkers(html: string): string {
	return html.replace(/<!--[\s\S]*?-->/g, '');
}

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
		options: { props?: Props; context: Map<symbol, boolean> }
	) => { body: string; head: string };
	const { body, head } = await renderComponent(template, {
		props,
		context: new Map([[TAKUMI_PDF_RENDER_CONTEXT, true]])
	});
	let pdfBody = stripSvelteSsrMarkers(body);
	let flowOptions: RenderOptions | undefined;
	const pdfHead = stripSvelteSsrMarkers(head);
	const flow = pdfBody.match(/data-pdf-flow="([^"]+)"/);
	if (flow) {
		if ((pdfBody.match(/data-pdf-page(?:[\s=>])/g) ?? []).length !== 1) {
			throw new Error('A flowing Page must be the only Page in its Document.');
		}
		if (renderOptions.viewport) throw new Error('A flowing Page cannot use a clipping viewport.');
		const geometry = JSON.parse(flow[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&'));
		let footer: string | undefined;
		pdfBody = pdfBody.replace(/<template data-pdf-flow-footer[^>]*>([\s\S]*?)<\/template>/g, (_, content) => {
			if (footer !== undefined) throw new Error('A flowing Page supports one repeated footer.');
			footer = `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style>${pdfHead}</head><body>${content}</body></html>`;
			return '';
		});
		flowOptions = { ...renderOptions, ...geometry, ...(footer ? { footer } : {}) };
	}
	// HTML input otherwise receives Takumi's browser-like 8px body margin,
	// which makes an explicit full-page wrapper overflow onto a blank page.
	const html = `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style>${pdfHead}</head><body>${pdfBody}</body></html>`;

	return renderTakumi(html, flowOptions ?? renderOptions);
}

/** Short renderer-base-local alias matching Forme's one-call API name. */
export { renderTakumiDocument as renderDocument };
