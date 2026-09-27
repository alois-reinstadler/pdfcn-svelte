import { getContext, setContext } from 'svelte';

const PAGE_FLOW = Symbol('pdfcn-forme-page-flow');
const INSIDE_FIXED = Symbol('pdfcn-forme-inside-fixed');
interface PageFlow { bodyStarted: boolean }

/** Forme collects fixed nodes in traversal order; late declarations miss earlier pages. */
export function provideFormePageFlow(): void {
 setContext<PageFlow>(PAGE_FLOW, { bodyStarted: false });
 setContext(INSIDE_FIXED, false);
}

/** Called by physical content primitives, never by decorative watermark/SVG children. */
export function markFormeBody(): void {
 const flow = getContext<PageFlow | undefined>(PAGE_FLOW);
 if (flow && !getContext<boolean>(INSIDE_FIXED)) flow.bodyStarted = true;
}

/** Fail before rendering instead of producing a PDF with missing repeated content. */
export function enterFormeFixed(): void {
 const flow = getContext<PageFlow | undefined>(PAGE_FLOW);
 if (!flow) throw new Error('[Fixed] Use Page from pdfcn-svelte/bases/forme so repeated-content ordering can be validated.');
 if (getContext<boolean>(INSIDE_FIXED)) throw new Error('[Fixed] Repeated headers/footers cannot be nested. Place each fixed block directly under Page.');
 if (flow.bodyStarted) throw new Error('[Fixed] Declare fixed headers, footers, and page numbers before all body content inside Page. Forme otherwise omits them from earlier pages. Move this fixed block to the beginning of Page.');
 setContext(INSIDE_FIXED, true);
}
