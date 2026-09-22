<script lang="ts">
	import { professionalTheme } from '$lib/themes';
	import { SecurityReport, type BaseReportData } from '$lib/bases/takumi';
	// Built-in sans-serif fallback avoids a network font dependency in this example.
	const theme = {
		...professionalTheme,
		typography: {
			...professionalTheme.typography,
			body: { ...professionalTheme.typography.body, fontFamily: 'sans-serif' },
			heading: {
				...professionalTheme.typography.heading,
				fontFamily: 'sans-serif'
			}
		}
	};
	const data: BaseReportData = {
		title: 'September review',
		subtitle: 'Analytical Studio',
		generatedAt: '21 September 2026',
		period: 'September 2026',
		author: 'Alex Morgan',
		status: { label: 'Reviewed — no open actions', tone: 'success' },
		summary: [
			{
				label: 'Completed reviews',
				value: '12',
				trend: 'All scheduled reviews complete',
				tone: 'success'
			}
		],
		rows: [
			{
				label: 'Delivery review',
				owner: 'Alex',
				status: 'Complete',
				progress: 100,
				risk: 'Low'
			}
		],
		series: [
			{ label: 'July', value: 8 },
			{ label: 'August', value: 10 },
			{ label: 'September', value: 12 }
		],
		highlights: ['All scheduled reviews completed.']
	};
</script>

<SecurityReport {data} {theme} />
