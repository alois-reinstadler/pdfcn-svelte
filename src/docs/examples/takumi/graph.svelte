<script lang="ts">
	import { PdfcnThemeProvider } from '$lib/index';
	import { professionalTheme } from '$lib/themes';
	import {
		Document,
		Page,
		Graph,
		Stack,
		type GraphSeries
	} from '$lib/bases/takumi';
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
	const series: GraphSeries[] = [
		{
			name: 'Revenue',
			data: [
				{ label: 'Jan', value: 120 },
				{ label: 'Feb', value: 180 }
			]
		},
		{
			name: 'Costs',
			data: [
				{ label: 'Jan', value: 80 },
				{ label: 'Feb', value: 100 }
			]
		}
	];
</script>

<PdfcnThemeProvider {theme}>
	<Document title="Graph example">
		<Page flow size="A4" margin={48}>
			<Stack
				><Graph
					title="Revenue and costs"
					data={series}
					variant="bar"
					width={440}
					height={220}
					showValues
				/><Graph
					title="Revenue trend"
					data={series[0].data}
					variant="line"
					width={440}
					height={180}
				/></Stack
			>
		</Page>
	</Document>
</PdfcnThemeProvider>
