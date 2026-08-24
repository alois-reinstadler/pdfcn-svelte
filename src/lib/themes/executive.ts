import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives.js";

/**
 * Executive theme preset.
 *
 * Character: Deep navy palette, Merriweather serif headings, Open Sans body.
 * Generous margins, high contrast, premium boardroom aesthetic.
 * Ideal for board reports, executive briefs, and investor documents.
 */
export const executiveTheme: PdfcnTheme = {
  colors: {
    accent: "#1e40af",
    background: "#ffffff",
    border: "#cbd5e1",
    destructive: "#dc2626",
    foreground: "#0f172a",
    info: "#0369a1",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    primary: "#1e3a5f",
    primaryForeground: "#ffffff",
    success: "#15803d",
    warning: "#b45309",
  },
  name: "executive",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 16,
    page: {
      marginBottom: 64,
      marginLeft: 56,
      marginRight: 56,
      marginTop: 64,
    },
    paragraphGap: 10,
    sectionGap: 32,
  },
  typography: {
    body: {
      fontFamily: "Open Sans",
      fontSize: 11,
      lineHeight: 1.65,
    },
    heading: {
      fontFamily: "Merriweather",
      fontSize: {
        h1: 34,
        h2: 26,
        h3: 20,
        h4: 16,
        h5: 14,
        h6: 12,
      },
      fontWeight: 700,
      lineHeight: 1.25,
    },
  },
};
