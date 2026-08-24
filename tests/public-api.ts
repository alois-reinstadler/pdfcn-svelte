import {
	PdfcnThemeProvider,
	blueprintTheme,
	cn,
	corporateTheme,
	defaultPrimitives,
	elegantTheme,
	executiveTheme,
	forestTheme,
	minimalTheme,
	modernTheme,
	professionalTheme,
	providePdfcnTheme,
	resolveColor,
	usePdfcnTheme,
	vividTheme
} from 'pdfcn-svelte';
import type { PDFComponentProps, PdfcnTheme, Style } from 'pdfcn-svelte';
import * as Forme from 'pdfcn-svelte/bases/forme';
import * as Takumi from 'pdfcn-svelte/bases/takumi';
import * as Themes from 'pdfcn-svelte/themes';

const sharedValues = [
	PdfcnThemeProvider,
	blueprintTheme,
	cn,
	corporateTheme,
	defaultPrimitives,
	elegantTheme,
	executiveTheme,
	forestTheme,
	minimalTheme,
	modernTheme,
	professionalTheme,
	providePdfcnTheme,
	resolveColor,
	usePdfcnTheme,
	vividTheme,
	Themes.blueprintTheme,
	Themes.vividTheme
];

const componentNames = [
	'Alert',
	'Badge',
	'Card',
	'DataTable',
	'Divider',
	'Form',
	'Graph',
	'Heading',
	'KeepTogether',
	'KeyValue',
	'Link',
	'List',
	'PageBreak',
	'PageFooter',
	'PageHeader',
	'PageNumber',
	'PdfImage',
	'QRCode',
	'Section',
	'Signature',
	'Stack',
	'Table',
	'Text',
	'Watermark'
] as const;
const upstreamComponentNames = [
	'PdfAlert',
	'PdfCard',
	'PdfForm',
	'PdfGraph',
	'PdfList',
	'PdfQRCode',
	'PdfSignatureBlock',
	'PdfWatermark'
] as const;

const tablePartNames = ['TableBody', 'TableCell', 'TableFooter', 'TableHeader', 'TableRow'] as const;
const blockNames = [
	'InvoiceClassicDocument',
	'InvoiceConsultantDocument',
	'InvoiceCorporateDocument',
	'InvoiceCreativeDocument',
	'InvoiceMinimalDocument',
	'InvoiceModernDocument',
	'FinancialReportDocument',
	'MarketingReportDocument',
	'OperationsReportDocument',
	'SecurityReportDocument'
] as const;
const rendererNames = ['Document', 'Image', 'PDFLink', 'Page', 'PDFText', 'View'] as const;
const svgNames = ['Circle', 'G', 'Line', 'Path', 'Rect', 'Svg', 'SvgText'] as const;

const assertRuntimeSurface = <T extends Record<string, unknown>>(
	api: T,
	names: readonly (keyof T)[]
): void => {
	for (const name of names) void api[name];
};

assertRuntimeSurface(Forme, componentNames);
assertRuntimeSurface(Forme, upstreamComponentNames);
assertRuntimeSurface(Forme, tablePartNames);
assertRuntimeSurface(Forme, blockNames);
assertRuntimeSurface(Forme, rendererNames);
assertRuntimeSurface(Forme, svgNames);
assertRuntimeSurface(Takumi, componentNames);
assertRuntimeSurface(Takumi, upstreamComponentNames);
assertRuntimeSurface(Takumi, tablePartNames);
assertRuntimeSurface(Takumi, blockNames);
assertRuntimeSurface(Takumi, rendererNames);
assertRuntimeSurface(Takumi, svgNames);

void Forme.Fixed;
void Forme.MaybeFixed;
void Forme.StyleSheet;
void Forme.THEME_COLOR_KEYS;
void Forme.mergeFormeStyles;
void Takumi.StyleSheet;
void Takumi.THEME_COLOR_KEYS;
void Takumi.flatten;
void Takumi.flattenTakumiStyle;
void Takumi.normalizeTakumiStyle;
void Takumi.pointToCssPixel;
void Takumi.renderDocument;
void Takumi.renderTakumiDocument;
void Takumi.styleToCss;
void Themes.THEMES;
void Themes.THEME_NAMES;
void Themes.themePresets;
void Themes.getTheme;

type SharedTypes = [PDFComponentProps, PdfcnTheme, Style];
type FormeTypes = [
	Forme.AlertVariant,
	Forme.BadgeSize,
	Forme.CardVariant,
	Forme.DataTableColumn,
	Forme.DividerVariant,
	Forme.FormLayout,
	Forme.GraphProps,
	Forme.KeepTogetherProps,
	Forme.ListItem,
	Forme.PageBreakProps,
	Forme.PdfImageSrc,
	Forme.PdfQRCodeProps,
	Forme.SignatureSigner,
	Forme.TableProps,
	Forme.BaseReportData,
	Forme.InvoiceClassicData,
	Forme.Style,
	Forme.FormeStyleInput,
	Forme.SvgRootProps
];
type TakumiTypes = [
	Takumi.AlertVariant,
	Takumi.BadgeSize,
	Takumi.CardVariant,
	Takumi.DataTableColumn,
	Takumi.DividerVariant,
	Takumi.FormLayout,
	Takumi.GraphProps,
	Takumi.KeepTogetherProps,
	Takumi.ListItem,
	Takumi.PageBreakProps,
	Takumi.PdfImageSrc,
	Takumi.PdfQRCodeProps,
	Takumi.SignatureSigner,
	Takumi.TableProps,
	Takumi.BaseReportData,
	Takumi.InvoiceClassicData,
	Takumi.Style,
	Takumi.StyleInput,
	Takumi.SvgRootProps,
	Takumi.TakumiDocumentPagination,
	Takumi.TakumiPdfRenderOptions,
	Takumi.RenderTakumiDocumentOptions<Record<string, never>>
];

void (sharedValues satisfies unknown[]);
void (null as unknown as SharedTypes);
void (null as unknown as FormeTypes);
void (null as unknown as TakumiTypes);
