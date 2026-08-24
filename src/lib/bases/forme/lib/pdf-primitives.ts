import type { Style } from '$lib/types/pdf-components';

export {
	Document,
	Page,
	PageBreak,
	Watermark,
	StyleSheet,
	PAGE_NUMBER,
	TOTAL_PAGES
} from '@formepdf/svelte';

export type FormeStyleInput = Style | false | null | undefined | readonly FormeStyleInput[];

const mergeStyleInput = (target: Style, input: FormeStyleInput): void => {
	if (Array.isArray(input)) {
		for (const item of input) {
			mergeStyleInput(target, item);
		}
	} else if (input) {
		Object.assign(target, input);
	}
};

/** Flattens nested/conditional style inputs into a single Forme style object. */
export const mergeFormeStyles = (...inputs: FormeStyleInput[]): Style => {
	const merged: Style = {};
	for (const input of inputs) {
		mergeStyleInput(merged, input);
	}
	return merged;
};
