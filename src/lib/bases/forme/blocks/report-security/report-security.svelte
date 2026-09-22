<script lang="ts">
	import PdfcnThemeProvider from '$lib/PdfcnThemeProvider.svelte';
	import type { PdfcnTheme } from '$lib/types/pdf-themes';

	import ReportLayout from './report-layout.svelte';
	import type { BaseReportData } from './report.types';

	const sampleSecurityData: BaseReportData = {
		status: { label: 'Security: Action Needed', tone: 'destructive' },
		author: 'Security Engineering',
		generatedAt: 'February 23, 2026',
		highlights: [
			'Critical vulnerabilities reduced through mandatory patch windows.',
			'Secrets rotation remains the highest-risk stream and needs additional staffing.',
			'External penetration test scheduled for next sprint to validate fixes.'
		],
		period: 'Sprint 05, 2026',
		rows: [
			{ label: 'Identity Hardening', owner: 'E. Brown', progress: 87, risk: 'Low', status: 'On Track' },
			{ label: 'Secrets Rotation', owner: 'P. Nair', progress: 58, risk: 'High', status: 'At Risk' },
			{ label: 'Dependency Scanning', owner: 'I. Shah', progress: 81, risk: 'Medium', status: 'On Track' },
			{ label: 'WAF Policy', owner: 'S. Reed', progress: 76, risk: 'Low', status: 'On Track' }
		],
		series: [
			{ label: 'High Risk', value: 14 }, { label: 'Medium Risk', value: 17 },
			{ label: 'Low Risk', value: 8 }, { label: 'Info', value: 4 }
		],
		subtitle: 'Vulnerability trends, control maturity, and remediation health',
		summary: [
			{ label: 'Critical Vulns', tone: 'success', trend: '-3 from last sprint', value: '2' },
			{ label: 'Patch SLA', tone: 'success', trend: '+5.3 pts', value: '92.0%' },
			{ label: 'Open Findings', tone: 'warning', trend: '+4', value: '41' },
			{ label: 'Control Score', tone: 'info', trend: '+2 pts', value: '84/100' }
		],
		title: 'Security Posture Report'
	};

	let { theme, data = sampleSecurityData }: { theme?: PdfcnTheme; data?: BaseReportData } = $props();
</script>

<PdfcnThemeProvider {theme}>
	<ReportLayout
		{data}
		titlePrefix="Security Report"
		statusLabel={data.status?.label ?? 'Status not supplied'}
		statusTone={data.status?.tone ?? 'info'}
		graphVariant="donut"
		graphTitle="Open risk distribution"
		graphSubtitle="High/Medium/Low workload share"
		graphLegend="right"
		graphShowValues
		graphColors={['#DC2626', '#F59E0B', '#16A34A', '#0EA5E9']}
	/>
</PdfcnThemeProvider>
