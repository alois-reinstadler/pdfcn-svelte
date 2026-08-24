import { blueprintTheme } from './blueprint.js';
import { corporateTheme } from './corporate.js';
import { elegantTheme } from './elegant.js';
import { executiveTheme } from './executive.js';
import { forestTheme } from './forest.js';
import { minimalTheme } from './minimal.js';
import { modernTheme } from './modern.js';
import { professionalTheme } from './professional.js';
import { vividTheme } from './vivid.js';

export { blueprintTheme } from './blueprint.js';
export { corporateTheme } from './corporate.js';
export { elegantTheme } from './elegant.js';
export { executiveTheme } from './executive.js';
export { forestTheme } from './forest.js';
export { minimalTheme } from './minimal.js';
export { modernTheme } from './modern.js';
export { defaultPrimitives } from './primitives.js';
export { professionalTheme } from './professional.js';
export { vividTheme } from './vivid.js';

/** Map of all built-in theme presets. */
export const themePresets = {
	blueprint: blueprintTheme,
	corporate: corporateTheme,
	elegant: elegantTheme,
	executive: executiveTheme,
	forest: forestTheme,
	minimal: minimalTheme,
	modern: modernTheme,
	professional: professionalTheme,
	vivid: vividTheme
} as const;

/** Name of a built-in theme preset. */
export type ThemePresetName = keyof typeof themePresets;

/** Built-in themes paired with stable registry metadata. */
export const THEMES = Object.entries(themePresets).map(([name, theme]) => ({
	name: name as ThemePresetName,
	theme,
	title: name.charAt(0).toUpperCase() + name.slice(1)
}));

export type RegistryTheme = (typeof THEMES)[number];
export type RegistryThemeName = RegistryTheme['name'];

export const THEME_NAMES = THEMES.map((theme) => theme.name) as [
	RegistryThemeName,
	...RegistryThemeName[]
];

/** Returns registry metadata for a built-in theme name. */
export const getTheme = (name: RegistryThemeName): RegistryTheme | undefined =>
	THEMES.find((theme) => theme.name === name);

export type {
	BorderRadiusScale,
	ColorTokens,
	FontWeights,
	LetterSpacingScale,
	LineHeights,
	PageTokens,
	PdfcnTheme,
	PrimitiveTokens,
	SpacingScale,
	SpacingTokens,
	TypographyScale,
	TypographyTokens
} from '../types/pdf-themes.js';
export type { PDFComponentProps, Style } from '../types/pdf-components.js';
