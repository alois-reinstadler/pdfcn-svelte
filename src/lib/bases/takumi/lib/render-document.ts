import type { Component } from 'svelte';
import type { ContainerNode, Node } from '@takumi-rs/helpers';
import type { RenderOptions, MeasureOptions } from 'takumi-pdf';
import { TAKUMI_PDF_RENDER_CONTEXT } from './render-context';

/** Props for Svelte SSR plus the official takumi-pdf render options (CSS pixels). */
export type RenderTakumiDocumentOptions<Props extends Record<string, any>> = RenderOptions & { props?: Props };
export type TakumiPdfRenderOptions = RenderOptions;

const childrenOf = (node: Node): Node[] => node.type === 'container' ? node.children ?? [] : [];
const has = (node: Node, key: string): boolean => node.attributes?.[key] !== undefined;
function find(node: Node, key: string): Node[] {
	return [...(has(node, key) ? [node] : []), ...childrenOf(node).flatMap(child => find(child, key))];
}
const column = (children: Node[], style: ContainerNode['style'] = {}): ContainerNode => ({ type: 'container', style: { display: 'flex', flexDirection: 'column', ...style }, children });
const px = (value: unknown): number => typeof value === 'number' ? value : typeof value === 'string' && /^\d+(\.\d+)?px$/.test(value) ? parseFloat(value) : 0;

/**
 * Render physical pages. Authored Pages share paper geometry; each begins a new
 * physical page. Flowing Pages may continue automatically. Repeated bands are
 * document-wide, and multiple band components stack in source order.
 */
export async function renderTakumiDocument<Props extends Record<string, any>>(
	template: Component<Props>, options: RenderTakumiDocumentOptions<Props> = {}
): Promise<Uint8Array> {
	const { props, ...renderOptions } = options;
	const [{ render: renderSvelte }, { render, measure }, { fromHtml }] = await Promise.all([
		import('svelte/server'), import('takumi-pdf'), import('@takumi-rs/helpers/html')
	]);
	const renderComponent = renderSvelte as unknown as (component: Component<Props>, options: { props?: Props; context: Map<symbol, boolean> }) => { body: string; head: string };
	const rendered = renderComponent(template, { props, context: new Map([[TAKUMI_PDF_RENDER_CONTEXT, true]]) });
	const html = `<!doctype html><html><head><style>html,body{margin:0;padding:0}</style>${rendered.head}</head><body>${rendered.body}</body></html>`.replace(/<!--[\s\S]*?-->/g, '');
	const { node, stylesheets } = fromHtml(html);
	let finalOptions: RenderOptions = { ...renderOptions, stylesheets: [...renderOptions.stylesheets ?? [], ...stylesheets] };
	// The engine does not fetch image URLs and can otherwise paint a blank box.
	const imageSources = Array.isArray(finalOptions.images) ? finalOptions.images : finalOptions.images?.sources ?? [];
	if (imageSources.some(source => typeof source.data === 'function')) finalOptions.images = await Promise.all(imageSources.map(async source => ({ ...source, data: typeof source.data === 'function' ? await source.data() : source.data })));
	async function validateImages(item: Node): Promise<void> {
		if (item.style?.position === 'fixed') throw new Error('Takumi position:fixed does not repeat content. Use PageHeader fixed or PageFooter fixed on a flowing Page.');
		if (item.type === 'image' && typeof item.src === 'string') {
			if (!item.src.startsWith('data:') && !/^\s*<svg[\s>]/i.test(item.src) && !imageSources.some(source => source.src === item.src)) throw new Error(`Takumi image "${item.src.slice(0, 120)}" has no bytes. Use await loadImage(urlOrRequest) as src, or supply matching render options.images data.`);
			if (item.src.startsWith('data:') && !/^data:image\/(?:png|jpeg|webp|gif|svg\+xml)[;,]/i.test(item.src)) throw new Error('Takumi image data URI must contain a supported image MIME type and valid image bytes.');
		}
		if (item.type === 'image') {
			const intrinsic = await measure({ type: 'image', src: item.src }, { images: finalOptions.images, viewport: { width: 100 } });
			if (!(intrinsic.width > 0 && intrinsic.height > 0)) throw new Error('Takumi could not decode an image. Supply valid PNG, JPEG, WebP, GIF or SVG bytes with nonzero dimensions; use loadImage for remote URLs.');
		}
		for (const child of childrenOf(item)) await validateImages(child);
	}
	await validateImages(node);
	const documentTitle = find(node, 'data-pdf-document')[0]?.attributes?.['data-pdf-document'];
	if (documentTitle) finalOptions = { ...finalOptions, metadata: { title: documentTitle, ...finalOptions.metadata } };
	const pages = find(node, 'data-pdf-page');
	const flowing = pages.filter(page => has(page, 'data-pdf-flow'));
	if (flowing.length) {
		if (flowing.length !== pages.length) throw new Error('Takumi cannot mix flowing and fixed-size Pages in one Document. Set flow on every Page and use PageBreak for explicit boundaries.');
		if (renderOptions.size !== undefined || renderOptions.margin !== undefined || renderOptions.landscape !== undefined) throw new Error('Flowing Pages define their own physical geometry. Set size, margin and landscape on Page; omit those render options.');
		if (renderOptions.viewport) throw new Error('A flowing Page cannot use a clipping viewport.');
		const geometries = flowing.map(page => JSON.parse(page.attributes!['data-pdf-flow']));
		if (geometries.some(geometry => JSON.stringify(geometry) !== JSON.stringify(geometries[0]))) throw new Error('Takumi Pages in one Document must use the same size, landscape and margins. Render different paper formats as separate documents.');
		finalOptions = { ...finalOptions, ...geometries[0] };
	} else {
		const sizes = pages.filter(page => has(page, 'data-pdf-size')).map(page => JSON.parse(page.attributes!['data-pdf-size']));
		if (sizes.some(size => JSON.stringify(size) !== JSON.stringify(sizes[0]))) throw new Error('Takumi Pages in one Document must use the same physical size. Render different paper formats as separate documents.');
		if (sizes.length && !finalOptions.viewport && !renderOptions.size) finalOptions = { ...finalOptions, size: sizes[0], margin: renderOptions.margin ?? 0 };
	}
	// Authored page boundaries must not depend on wrapper heights or rounding.
	pages.forEach((page, index) => {
		if (index) page.style = { ...page.style, breakBefore: 'page' };
	});
	const bands: Record<'header' | 'footer', Node[]> = { header: [], footer: [] };
	function extractBands(parent: Node, into = bands): void {
		if (parent.type !== 'container') return;
		parent.children = childrenOf(parent).filter(child => {
			for (const kind of ['header', 'footer'] as const) if (has(child, `data-pdf-flow-${kind}`)) {
				into[kind].push(...childrenOf(child));
				return false;
			}
			extractBands(child, into);
			return true;
		});
	}
	const bandSignature = (nodes: Node[]): string => JSON.stringify(nodes, (key, value) => {
		// Counter fallback text is for HTML preview only, not band identity.
		if (value && typeof value === 'object' && /(?:^|\s)(pageNumber|totalPages)(?:$|\s)/.test(value.className ?? '')) return { ...value, text: '' };
		return value;
	});
	for (const page of pages) {
		const local: typeof bands = { header: [], footer: [] };
		extractBands(page, local);
		for (const kind of ['header', 'footer'] as const) if (local[kind].length) {
			if (bands[kind].length && bandSignature(bands[kind]) !== bandSignature(local[kind])) throw new Error(`Takumi repeated ${kind}s must match across Pages. Declare the document-wide band once, or use fixed={false} for section-specific inline content.`);
			bands[kind] = local[kind];
		}
	}
	if (!pages.length) extractBands(node);
	for (const kind of ['header', 'footer'] as const) if (bands[kind].length) {
		if (renderOptions[kind]) throw new Error(`Choose either Page${kind === 'header' ? 'Header' : 'Footer'} fixed or the render ${kind} option, not both.`);
		if (finalOptions.viewport) throw new Error('Repeated page bands require paged output, not a viewport.');
		finalOptions = { ...finalOptions, [kind]: column(bands[kind]) };
	}
	const presets: Record<string, [number, number]> = { a3: [1122.52, 1587.4], a4: [793.7, 1122.52], a5: [559.37, 793.7], b4: [944.88, 1334.17], b5: [665.2, 944.88], 'jis-b4': [971.34, 1375.75], 'jis-b5': [687.87, 971.34], letter: [816, 1056], legal: [816, 1344], ledger: [1632, 1056] };
	const size = finalOptions.size ?? 'a4';
	let [paperWidth, paperHeight] = typeof size === 'string' ? presets[size.toLowerCase()] ?? presets.a4 : [size.width, size.height];
	if (finalOptions.landscape) [paperWidth, paperHeight] = [paperHeight, paperWidth];
	if (finalOptions.viewport) { paperWidth = finalOptions.viewport.width; paperHeight = finalOptions.viewport.height ?? Infinity; }
	const margins = finalOptions.viewport ? 0 : finalOptions.margin ?? 'auto';
	const sides = { top: 0, right: 0, bottom: 0, left: 0 };
	const resources = { fonts: finalOptions.fonts, images: finalOptions.images, stylesheets: finalOptions.stylesheets, fontFamilies: finalOptions.fontFamilies, lang: finalOptions.lang };
	for (const side of ['top', 'right', 'bottom', 'left'] as const) {
		const value = typeof margins === 'object' ? margins[side] ?? 'auto' : margins;
		sides[side] = value === 'auto' ? 37.8 : value;
		const band = side === 'top' ? finalOptions.header : side === 'bottom' ? finalOptions.footer : undefined;
		if (band) {
			const measured = await measure(band, { ...resources, viewport: { width: paperWidth } });
			if (value === 'auto') sides[side] = Math.max(sides[side], measured.height);
			else if (measured.height > sides[side] + 0.5) throw new Error(`Repeated ${side === 'top' ? 'header' : 'footer'} needs ${(measured.height * 0.75).toFixed(1)}pt but Page margin.${side} reserves ${(sides[side] * 0.75).toFixed(1)}pt. Increase that margin or reduce the band content.`);
		}
	}
	const contentWidth = paperWidth - sides.left - sides.right;
	const contentHeight = paperHeight - sides.top - sides.bottom;
	if (!(contentWidth > 0 && contentHeight > 0)) throw new Error('Page margins leave no printable content area. Reduce margins or use a larger Page size.');
	for (const page of pages.filter(page => !has(page, 'data-pdf-flow'))) {
		const authoredSize = page.attributes?.['data-pdf-size'];
		if (authoredSize) {
			const dimensions = JSON.parse(authoredSize);
			if (Math.abs(dimensions.width - paperWidth) > 1 || Math.abs(dimensions.height - paperHeight) > 1) throw new Error('Page size conflicts with render options. Set the physical dimensions on Page and omit render size/landscape.');
			if (sides.top + sides.right + sides.bottom + sides.left > 0) throw new Error('A fixed-size Page uses its own padding. Omit render margin (or set margin: 0), or use Page flow with its margin prop.');
		}
	}
	const measureAt = (item: Node, width: number) => measure(item, { ...resources, viewport: { width } } satisfies MeasureOptions);
	async function prepare(parent: Node, availableWidth: number): Promise<void> {
		if (parent.type !== 'container') return;
		const style = parent.style ?? {};
		const width = (px(style.width) || availableWidth) - px(style.paddingLeft ?? style.padding) - px(style.paddingRight ?? style.padding);
		const children = childrenOf(parent);
		for (const child of children) await prepare(child, width);
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			const keepNext = has(child, 'data-pdf-keep-next');
			const ahead = Number(child.attributes?.['data-pdf-min-ahead'] ?? 0) * 96 / 72;
			if (!keepNext && !ahead) continue;
			if (style.flexDirection === 'row' || style.display === 'grid') throw new Error('keepWithNext and minPresenceAhead require vertically stacked siblings. Use KeepTogether around the complete row instead.');
			let end = i + 1;
			let followingHeight = 0;
			let followingCount = 0;
			while (end < children.length && (followingCount === 0 || followingHeight < ahead || has(children[end - 1], 'data-pdf-keep-next'))) {
				if (children[end].style?.breakBefore === 'page') throw new Error('A keep-with-next/minPresenceAhead group crosses an explicit PageBreak. Move the break before the group.');
				if (!(children[end].type === 'text' && !(children[end] as { text: string }).text.trim())) {
					followingHeight += (await measureAt(children[end], width)).height;
					followingCount++;
				}
				end++;
			}
			if (ahead > 0 && followingHeight < ahead) throw new Error('minPresenceAhead exceeds the following sibling content. Lower it or wrap the complete section in KeepTogether; pagination hints cannot cross parent boundaries.');
			const grouped = column(children.slice(i, end), { breakInside: 'avoid', flexShrink: 0 });
			const measured = await measureAt(grouped, width);
			if (measured.height > contentHeight + 0.5) throw new Error('A keepWithNext/minPresenceAhead group is taller than the printable page. Reduce the requested presence, split the following content, or remove the pagination hint.');
			children.splice(i, end - i, grouped);
		}
		parent.children = children;
		if (style.breakInside === 'avoid') {
			const measured = await measureAt(parent, availableWidth);
			if (measured.height > contentHeight + 0.5) throw new Error('An unbreakable component is taller than the printable page. Split KeepTogether content, set noWrap={false}, or use a larger page.');
		}
	}
	await prepare(node, contentWidth);
	for (const page of pages.filter(page => !has(page, 'data-pdf-flow'))) {
		const style = { ...page.style };
		const height = px(style.height);
		if (!height) continue;
		const intrinsic: Node = { ...page, style: { ...style, height: undefined, minHeight: undefined, flexShrink: 0 } };
		const measured = await measureAt(intrinsic, contentWidth);
		if (measured.height > height + 0.5) throw new Error('Content overflows a fixed-size Page. Set Page flow and use its margin prop to preserve all content on continuation pages.');
	}
	if (finalOptions.viewport?.height && (await measureAt(node, contentWidth)).height > finalOptions.viewport.height + 0.5) throw new Error('Content overflows the requested viewport. Omit viewport.height for a content-sized receipt or use Page flow for pagination.');
	return render(node, finalOptions);
}

export { renderTakumiDocument as renderDocument };
