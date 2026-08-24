import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives";

/**
 * Blueprint theme preset.
 *
 * Character: Dark slate palette with cyan accent, JetBrains Mono headings,
 * Source Code Pro body — a technical, precision-first aesthetic.
 * Ideal for API docs, engineering specs, and developer-focused reports.
 */
export const blueprintTheme: PdfcnTheme = {
  colors: {
    accent: "#0891b2",
    background: "#ffffff",
    border: "#cbd5e1",
    destructive: "#e11d48",
    foreground: "#0f172a",
    info: "#0284c7",
    muted: "#f1f5f9",
    mutedForeground: "#475569",
    primary: "#0f172a",
    primaryForeground: "#f0f9ff",
    success: "#059669",
    warning: "#d97706",
  },
  name: "blueprint",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 14,
    page: {
      marginBottom: 52,
      marginLeft: 48,
      marginRight: 48,
      marginTop: 52,
    },
    paragraphGap: 10,
    sectionGap: 26,
  },
  typography: {
    body: {
      fontFamily: "Source Code Pro",
      fontSize: 10,
      lineHeight: 1.75,
    },
    heading: {
      fontFamily: "JetBrains Mono",
      fontSize: {
        h1: 28,
        h2: 21,
        h3: 17,
        h4: 14,
        h5: 12,
        h6: 10,
      },
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },
};
