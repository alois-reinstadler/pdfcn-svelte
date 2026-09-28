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
	/** Caller-authored conclusion. Omit for a neutral, unassessed status. */
	status?: { label: string; tone?: ReportTone };
	title: string;
	subtitle: string;
	generatedAt: string;
	period: string;
	author: string;
	summary: SummaryMetric[];
	rows: ReportRow[];
	series: ReportSeriesPoint[];
	highlights: string[];
	/** Optional caller-authored chart copy. */
	chartTitle?: string;
	chartSubtitle?: string;
	/** Optional supplied footer; no aggregate is calculated by the library. */
	tableFooter?: { label?: string; owner?: string; status?: string; progress?: number; risk?: string };
	/** Caller-authored facts; risk counts and conclusions are never inferred. */
	facts?: { key: string; value: string }[];
}

export interface ReportTemplateProps {
	theme?: PdfcnTheme;
	data?: BaseReportData;
}
