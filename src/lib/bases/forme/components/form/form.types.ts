import type { Style } from '$lib/types/pdf-components';

/** Visual style variant for the printable form. */
export type PdfFormVariant = 'underline' | 'box' | 'outlined' | 'ghost';

/** Column layout for a form section. */
export type FormLayout = 'single' | 'two-column' | 'three-column';

/** Label position relative to the field. */
export type FormLabelPosition = 'above' | 'left';

/** A single printable blank field definition. */
export interface PdfFormField {
	label: string;
	hint?: string;
	/** Height of the blank field area in points. @default 18 */
	height?: number;
	width?: number | string;
}

/** A logical group of fields with an optional section title. */
export interface PdfFormGroup {
	title?: string;
	fields: PdfFormField[];
	/** @default 'single' */
	layout?: FormLayout;
}

/** Printable visual form (not interactive PDF AcroForm fields) with grouped fields, layout variants, and label positioning options. */
export interface PdfFormProps {
	title?: string;
	subtitle?: string;
	groups: PdfFormGroup[];
	/** @default 'underline' */
	variant?: PdfFormVariant;
	/** @default 'above' */
	labelPosition?: FormLabelPosition;
	noWrap?: boolean;
	style?: Style;
}

/** Printable blank fields, not interactive AcroForm widgets. */
export type PrintableFormProps = PdfFormProps;
