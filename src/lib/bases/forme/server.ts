import type { Component } from 'svelte';
import { serialize } from '@formepdf/svelte';
import {
 renderSerializedDocWithLayout,
 type ElementInfo,
 type RenderDocumentOptions as CoreRenderOptions,
 type RenderWithLayoutResult
} from '@formepdf/core';
import { validateImageSource } from '$lib/utils/image-source.js';

export type RenderDocumentOptions<Props extends Record<string, any> = Record<string, never>> =
 Omit<CoreRenderOptions, 'auditContent'> & { props?: Props; auditContent?: true };
export type RenderDocumentWithLayoutResult = Omit<RenderWithLayoutResult, 'pdf'> & { pdf: Uint8Array<ArrayBuffer> };
type SerializedDocument = Awaited<ReturnType<typeof serialize>>;
type SourceNode = SerializedDocument['children'][number];
type SourceLocation = NonNullable<SourceNode['sourceLocation']>;
interface SourceRecord {
 node: SourceNode;
 path: string;
 originalLocation?: SourceLocation;
 /** Only explicitly non-wrapping source nodes establish an atomic promise. */
 atomicAncestors: number[];
 fixed: boolean;
}
const AUDIT_SOURCE = 'pdfcn:layout-audit';
const EPSILON = 0.75;

/**
 * Render with the engine's content audit plus physical bounds and atomic-group checks.
 * A successful PDF must preserve content and every explicit KeepTogether/noWrap promise.
 */
export async function renderDocumentWithLayout<Props extends Record<string, any>>(
 template: Component<Props>, options: RenderDocumentOptions<Props> = {}
): Promise<RenderDocumentWithLayoutResult> {
 if (options.auditContent !== undefined && options.auditContent !== true) {
  throw new Error('[Forme] auditContent cannot be disabled. Fix the reported content/layout defect before returning the PDF.');
 }
 const { props, ...renderOptions } = options;
 const document = await serialize(template, { props });
 const records = new Map<number, SourceRecord>();
 let nextId = 0;
 const tag = (node: SourceNode, path: string, ancestors: number[], fixed: boolean): void => {
  const id = ++nextId;
  const insideFixed = fixed || node.kind.type === 'Fixed';
  const atomic = node.style.wrap === false;
  const atomicAncestors = atomic ? [...ancestors, id] : ancestors;
  records.set(id, { node, path, originalLocation: node.sourceLocation, atomicAncestors, fixed: insideFixed });
  node.sourceLocation = { file: AUDIT_SOURCE, line: id, column: 0 };
  if (node.kind.type === 'Image') node.kind.src = validateImageSource(node.kind.src);
  node.children.forEach((child, index) => tag(child, `${path}/${child.kind.type}[${index + 1}]`, atomicAncestors, insideFixed));
 };
 document.children.forEach((node, index) => tag(node, `${node.kind.type}[${index + 1}]`, [], false));
 const result = await renderSerializedDocWithLayout({ ...document }, { ...renderOptions, auditContent: true });
 const defects = result.warnings.filter(warning => /render defect:/i.test(warning));
 if (defects.length) throw new Error(`[Forme] PDF content audit failed: ${defects.join(' ')} Fix hidden, clipped, missing, or off-page content.`);
 const atomicPages = new Map<number, Set<number>>();
 for (const [index, page] of result.layout.pages.entries()) {
  const fixedBands: ElementInfo[] = [];
  const bodyPaint: ElementInfo[] = [];
  const visit = (node: ElementInfo, fixedParent = false): void => {
   const id = node.sourceLocation?.file === AUDIT_SOURCE ? node.sourceLocation.line : undefined;
   const source = id === undefined ? undefined : records.get(id);
   const insideFixed = fixedParent || source?.fixed === true || node.nodeType === 'FixedHeader' || node.nodeType === 'FixedFooter';
   if (node.nodeType === 'FixedHeader' || node.nodeType === 'FixedFooter') {
    fixedBands.push(node);
    if (node.x < -EPSILON || node.y < -EPSILON || node.x + node.width > page.width + EPSILON || node.y + node.height > page.height + EPSILON) throw new Error(`[Forme] Repeated header/footer extends beyond physical page ${index + 1}. Reduce its height or margins, and increase the page margin if necessary.`);
   }
   if (insideFixed && (node.nodeType === 'FixedHeader' || node.nodeType === 'FixedFooter') && node.height > page.height + EPSILON) throw new Error(`[Forme] Fixed content exceeds physical page ${index + 1}. Reduce the repeated header/footer height.`);
   if (source && !insideFixed) {
    for (const atomicId of source.atomicAncestors) {
     const pages = atomicPages.get(atomicId) ?? new Set<number>();
     pages.add(index + 1); atomicPages.set(atomicId, pages);
    }
    if (source.node.style.wrap === false && node.height > page.contentHeight + EPSILON) {
     throw new Error(`[Forme] Atomic content ${source.path} is ${node.height.toFixed(1)}pt tall but page ${index + 1} has only ${page.contentHeight.toFixed(1)}pt of body space. Reduce its content/dimensions, use a larger page, or remove KeepTogether/noWrap (set wrap=true) to allow splitting.`);
    }
   }
   // Flow containers can legitimately span pages; inspect painted leaves, not their aggregate rectangles.
   const paintsContent = node.nodeType === 'TextLine' || ['Image', 'Svg', 'QrCode', 'Barcode', 'Chart', 'FormField', 'Canvas'].includes(node.kind);
   if (paintsContent && !insideFixed) bodyPaint.push(node);
   if (paintsContent && node.width > EPSILON && node.height > EPSILON &&
    (node.x < -EPSILON || node.y < -EPSILON || node.x + node.width > page.width + EPSILON || node.y + node.height > page.height + EPSILON)) {
    throw new Error(`[Forme] ${node.nodeType} content extends beyond physical page ${index + 1}${source ? ` at ${source.path}` : ''}. Reduce the width/height or adjust positioning and page margins; clipping content is not supported.`);
   }
   if (id !== undefined) {
    if (source?.originalLocation) node.sourceLocation = source.originalLocation;
    else delete node.sourceLocation;
   }
   node.children.forEach(child => visit(child, insideFixed));
  };
  page.elements.forEach(node => visit(node));
  for (const band of fixedBands) for (const content of bodyPaint) {
   const overlapX = Math.min(band.x + band.width, content.x + content.width) - Math.max(band.x, content.x);
   const overlapY = Math.min(band.y + band.height, content.y + content.height) - Math.max(band.y, content.y);
   if (overlapX > EPSILON && overlapY > EPSILON) throw new Error(`[Forme] Body content overlaps the repeated ${band.nodeType === 'FixedHeader' ? 'header' : 'footer'} on physical page ${index + 1}. Reduce the fixed band, remove negative spacing/absolute positioning, or increase page margins.`);
  }
 }
 for (const [id, pages] of atomicPages) if (pages.size > 1) {
  throw new Error(`[Forme] Atomic content ${records.get(id)?.path} was split across physical pages ${[...pages].join(', ')}. Reduce the group or remove KeepTogether/noWrap (set wrap=true) to allow splitting.`);
 }
 return { ...result, pdf: result.pdf as Uint8Array<ArrayBuffer> };
}

/** Return PDF bytes only after the same mandatory checks used by renderDocumentWithLayout. */
export async function renderDocument<Props extends Record<string, any>>(
 template: Component<Props>, options?: RenderDocumentOptions<Props>
): Promise<Uint8Array<ArrayBuffer>> {
 return (await renderDocumentWithLayout(template, options)).pdf;
}
