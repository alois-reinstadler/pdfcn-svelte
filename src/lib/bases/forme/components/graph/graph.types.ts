import type { Style } from '$lib/types/pdf-components';

export interface GraphWidthOptions {
	containerPadding?: number;
	wrapperPadding?: number;
	pageWidth?: number;
}

export type GraphVariant = 'bar' | 'horizontal-bar' | 'line' | 'area' | 'pie' | 'donut';
export type GraphLegendPosition = 'bottom' | 'right' | 'none';

export interface GraphDataPoint {
	label: string;
	value: number;
	color?: string;
}

export interface GraphSeries {
	name: string;
	data: GraphDataPoint[];
	color?: string;
}

export interface GraphProps {
	variant?: GraphVariant;
	data: GraphDataPoint[] | GraphSeries[];
	title?: string;
	subtitle?: string;
	xLabel?: string;
	yLabel?: string;
	width?: number;
	height?: number;
	fullWidth?: boolean;
	containerPadding?: number;
	wrapperPadding?: number;
	colors?: string[];
	showValues?: boolean;
	showGrid?: boolean;
	legend?: GraphLegendPosition;
	centerLabel?: string;
	showDots?: boolean;
	smooth?: boolean;
	yTicks?: number;
	noWrap?: boolean;
	style?: Style;
}

export interface ChartLayout {
	svgW: number;
	svgH: number;
	chartX: number;
	chartY: number;
	chartW: number;
	chartH: number;
	yMin: number;
	yMax: number;
	yTicks: number[];
	xLabels: string[];
}
