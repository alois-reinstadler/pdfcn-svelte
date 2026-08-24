// Components
export { default as Alert, default as PdfAlert } from './components/alert/alert.svelte';
export type { AlertVariant, PdfAlertProps } from './components/alert/alert.svelte';
export { default as Badge } from './components/badge/badge.svelte';
export type { BadgeProps, BadgeSize, BadgeVariant } from './components/badge/badge.svelte';
export { default as Card, default as PdfCard } from './components/card/card.svelte';
export type { CardVariant, PdfCardProps } from './components/card/card.svelte';
export { default as DataTable } from './components/data-table/data-table.svelte';
export type {
	DataTableColumn,
	DataTableProps,
	DataTableSize
} from './components/data-table/data-table.types.js';
export { default as Divider } from './components/divider/divider.svelte';
export type {
	DividerSpacing,
	DividerThickness,
	DividerVariant,
	DividerProps
} from './components/divider/divider.svelte';
export { default as Form, default as PdfForm } from './components/form/form.svelte';
export type {
	FormLabelPosition,
	FormLayout,
	PdfFormField,
	PdfFormGroup,
	PdfFormProps,
	PdfFormVariant
} from './components/form/form.types.js';
export { default as Graph, default as PdfGraph } from './components/graph/graph.svelte';
export type {
	ChartLayout,
	GraphDataPoint,
	GraphLegendPosition,
	GraphProps,
	GraphSeries,
	GraphVariant,
	GraphWidthOptions
} from './components/graph/graph.types.js';
export { default as Heading } from './components/heading/heading.svelte';
export type {
	HeadingProps,
	HeadingTracking,
	HeadingWeight
} from './components/heading/heading.svelte';
export { default as KeepTogether } from './components/keep-together/keep-together.svelte';
export type { KeepTogetherProps } from './components/keep-together/keep-together.svelte';
export { default as KeyValue } from './components/key-value/key-value.svelte';
export type {
	KeyValueDirection,
	KeyValueEntry,
	KeyValueProps,
	KeyValueSize
} from './components/key-value/key-value.svelte';
export { default as Link } from './components/link/link.svelte';
export type { LinkProps, LinkUnderline, LinkVariant } from './components/link/link.svelte';
export { default as List, default as PdfList } from './components/list/list.svelte';
export type {
	ListGap,
	ListItem,
	ListVariant,
	PdfListProps
} from './components/list/list.svelte';
export { default as PageBreak } from './components/page-break/page-break.svelte';
export type PageBreakProps = Omit<
	import('../../types/pdf-components.js').PDFComponentProps,
	'children'
> & { children?: never };
export { default as PageFooter } from './components/page-footer/page-footer.svelte';
export type {
	PageFooterProps,
	PageFooterVariant
} from './components/page-footer/page-footer.svelte';
export { default as PageHeader } from './components/page-header/page-header.svelte';
export type {
	PageHeaderProps,
	PageHeaderVariant
} from './components/page-header/page-header.svelte';
export { default as PageNumber } from './components/page-number/page-number.svelte';
export type {
	PageNumberAlign,
	PageNumberProps,
	PageNumberSize
} from './components/page-number/page-number.svelte';
export { default as PdfImage } from './components/pdf-image/pdf-image.svelte';
export type {
	PdfImageFit,
	PdfImageHTTPMethod,
	PdfImageProps,
	PdfImageSrc,
	PdfImageVariant
} from './components/pdf-image/pdf-image.svelte';
export { default as PdfQRCode, default as QRCode } from './components/qrcode/qrcode.svelte';
export type { PdfQRCodeProps, QRCodeErrorLevel } from './components/qrcode/qrcode.svelte';
export { default as Section } from './components/section/section.svelte';
export type {
	SectionPadding,
	SectionProps,
	SectionSpacing,
	SectionVariant
} from './components/section/section.svelte';
export {
	default as PdfSignatureBlock,
	default as Signature
} from './components/signature/signature.svelte';
export type {
	PdfSignatureBlockProps,
	SignatureSigner,
	SignatureVariant
} from './components/signature/signature.svelte';
export { default as Stack } from './components/stack/stack.svelte';
export type {
	StackAlign,
	StackDirection,
	StackGap,
	StackJustify,
	StackProps
} from './components/stack/stack.svelte';
export { default as Table } from './components/table/table.svelte';
export { default as TableBody } from './components/table/table-body.svelte';
export { default as TableCell } from './components/table/table-cell.svelte';
export { default as TableFooter } from './components/table/table-footer.svelte';
export { default as TableHeader } from './components/table/table-header.svelte';
export { default as TableRow } from './components/table/table-row.svelte';
export type {
	TableCellProps,
	TableProps,
	TableRowProps,
	TableSectionProps,
	TableVariant
} from './components/table/table.types.js';
export { default as Text } from './components/text/text.svelte';
export type {
	TextDecoration,
	TextProps,
	TextVariant,
	TextWeight
} from './components/text/text.svelte';
export {
	default as PdfWatermark,
	default as Watermark
} from './components/watermark/watermark.svelte';
export type {
	PdfWatermarkProps,
	WatermarkPosition
} from './components/watermark/watermark.svelte';

// Copy-ready document blocks
export {
	default as InvoiceClassic,
	default as InvoiceClassicDocument
} from './blocks/invoice-classic/invoice-classic.svelte';
export type { InvoiceClassicData } from './blocks/invoice-classic/invoice-classic.types.js';
export {
	default as InvoiceConsultant,
	default as InvoiceConsultantDocument
} from './blocks/invoice-consultant/invoice-consultant.svelte';
export type { InvoiceConsultantData } from './blocks/invoice-consultant/invoice-consultant.types.js';
export {
	default as InvoiceCorporate,
	default as InvoiceCorporateDocument
} from './blocks/invoice-corporate/invoice-corporate.svelte';
export type { InvoiceCorporateData } from './blocks/invoice-corporate/invoice-corporate.types.js';
export {
	default as InvoiceCreative,
	default as InvoiceCreativeDocument
} from './blocks/invoice-creative/invoice-creative.svelte';
export type { InvoiceCreativeData } from './blocks/invoice-creative/invoice-creative.types.js';
export {
	default as InvoiceMinimal,
	default as InvoiceMinimalDocument
} from './blocks/invoice-minimal/invoice-minimal.svelte';
export type { InvoiceMinimalData } from './blocks/invoice-minimal/invoice-minimal.types.js';
export {
	default as InvoiceModern,
	default as InvoiceModernDocument
} from './blocks/invoice-modern/invoice-modern.svelte';
export type { InvoiceModernData } from './blocks/invoice-modern/invoice-modern.types.js';
export {
	default as FinancialReport,
	default as FinancialReportDocument
} from './blocks/report-financial/report-financial.svelte';
export {
	default as MarketingReport,
	default as MarketingReportDocument
} from './blocks/report-marketing/report-marketing.svelte';
export {
	default as OperationsReport,
	default as OperationsReportDocument
} from './blocks/report-operations/report-operations.svelte';
export {
	default as SecurityReport,
	default as SecurityReportDocument
} from './blocks/report-security/report-security.svelte';
export type {
	BaseReportData,
	ReportRow,
	ReportSeriesPoint,
	ReportTemplateProps,
	ReportTone,
	SummaryMetric
} from './blocks/report-financial/report.types.js';

// Renderer primitives
export { default as Document } from './lib/Document.svelte';
export { default as Image } from './lib/Image.svelte';
export { default as PDFLink } from './lib/Link.svelte';
export { default as Page } from './lib/Page.svelte';
export { default as PDFText } from './lib/Text.svelte';
export { default as View } from './lib/View.svelte';
export {
	PDF_POINT_TO_CSS_PIXEL,
	StyleSheet,
	TAKUMI_DOCUMENT_PAGINATION_CONTEXT,
	TAKUMI_PAGE_PAGINATION_CONTEXT,
	flatten,
	flattenTakumiStyle,
	normalizeTakumiStyle,
	pointToCssPixel,
	styleToCss
} from './lib/pdf-primitives.js';
export type {
	Style,
	StyleInput,
	TakumiDocumentPagination,
	TakumiPagePagination
} from './lib/pdf-primitives.js';
export { renderDocument, renderTakumiDocument } from './lib/render-document.js';
export type {
	RenderTakumiDocumentOptions,
	TakumiPdfRenderOptions
} from './lib/render-document.js';
export { THEME_COLOR_KEYS } from '../../utils/resolve-color.js';

// SVG primitives
export { Circle, G, Line, Path, Rect, Svg, SvgText } from './lib/pdf-svg.js';
export type { SvgElementProps, SvgRootProps, SvgStyle, SvgValue } from './lib/pdf-svg.js';
export {
	normalizeTakumiSvgAttributes,
	svgAttributeName,
	svgStyleToCss
} from './lib/svg-utils.js';
