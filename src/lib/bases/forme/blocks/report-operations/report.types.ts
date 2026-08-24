import type { PdfcnTheme } from '$lib/types/pdf-themes';

export type ReportTone = 'success' | 'warning' | 'destructive' | 'info';

export interface SummaryMetric {
	label: string;
	value: string;
	trend?: string;
	tone?: ReportTone;
}

export type ReportRow = Record<string, unknown> & {
	label: string;
	owner: string;
	status: string;
	progress: number;
	risk?: string;
};

export interface ReportSeriesPoint {
	label: string;
	value: number;
}

export interface BaseReportData {
	title: string;
	subtitle: string;
	generatedAt: string;
	period: string;
	author: string;
	summary: SummaryMetric[];
	rows: ReportRow[];
	series: ReportSeriesPoint[];
	highlights: string[];
}

export interface ReportTemplateProps {
	theme?: PdfcnTheme;
	data?: BaseReportData;
}
