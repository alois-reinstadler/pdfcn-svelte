import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives.js";

/**
 * Corporate theme preset.
 *
 * Character: Blue-gray palette, Lato sans-serif throughout, structured and
 * dependable. Sky-blue accent adds clarity without distraction.
 * Ideal for business proposals, project plans, and client-facing reports.
 */
export const corporateTheme: PdfcnTheme = {
  colors: {
    accent: "#0ea5e9",
    background: "#ffffff",
    border: "#e2e8f0",
    destructive: "#ef4444",
    foreground: "#1e293b",
    info: "#3b82f6",
    muted: "#f8fafc",
    mutedForeground: "#64748b",
    primary: "#0f4c81",
    primaryForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e0b",
  },
  name: "corporate",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 13,
    page: {
      marginBottom: 52,
      marginLeft: 44,
      marginRight: 44,
      marginTop: 52,
    },
    paragraphGap: 9,
    sectionGap: 24,
  },
  typography: {
    body: {
      fontFamily: "Lato",
      fontSize: 11,
      lineHeight: 1.55,
    },
    heading: {
      fontFamily: "Lato",
      fontSize: {
        h1: 30,
        h2: 22,
        h3: 18,
        h4: 15,
        h5: 13,
        h6: 11,
      },
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },
};
