import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives";

/**
 * Forest theme preset.
 *
 * Character: Natural deep greens, Merriweather headings for gravitas, Inter
 * body for readability. Earthy and trustworthy.
 * Ideal for sustainability reports, environmental docs, and wellness brands.
 */
export const forestTheme: PdfcnTheme = {
  colors: {
    accent: "#16a34a",
    background: "#ffffff",
    border: "#bbf7d0",
    destructive: "#dc2626",
    foreground: "#14532d",
    info: "#0ea5e9",
    muted: "#f0fdf4",
    mutedForeground: "#4d7c5f",
    primary: "#15803d",
    primaryForeground: "#ffffff",
    success: "#15803d",
    warning: "#d97706",
  },
  name: "forest",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 14,
    page: {
      marginBottom: 56,
      marginLeft: 48,
      marginRight: 48,
      marginTop: 56,
    },
    paragraphGap: 10,
    sectionGap: 28,
  },
  typography: {
    body: {
      fontFamily: "Inter",
      fontSize: 11,
      lineHeight: 1.6,
    },
    heading: {
      fontFamily: "Merriweather",
      fontSize: {
        h1: 32,
        h2: 24,
        h3: 19,
        h4: 15,
        h5: 13,
        h6: 11,
      },
      fontWeight: 700,
      lineHeight: 1.25,
    },
  },
};
