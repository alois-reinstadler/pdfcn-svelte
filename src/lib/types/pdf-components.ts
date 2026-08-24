import type { Snippet } from 'svelte';

/** CSS-like style object compatible with both Takumi and Forme */
export type Style = Record<string, unknown>;

/**
 * Base props shared by all pdfcn-svelte PDF components.
 */
export interface PDFComponentProps {
	style?: Style;
	children?: Snippet;
}
