import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives.js";

/**
 * Modern theme preset.
 *
 * Character: All-Helvetica, slate-cool neutrals with subtle violet accent,
 * clean spacing. shadcn-inspired contemporary feel.
 * Ideal for startups, tech companies, and design-forward documents.
 */
export const modernTheme: PdfcnTheme = {
  colors: {
    accent: "#6366f1",
    background: "#ffffff",
    border: "#e2e8f0",
    destructive: "#ef4444",
    foreground: "#0f172a",
    info: "#3b82f6",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    primary: "#334155",
    primaryForeground: "#ffffff",
    success: "#22c55e",
    warning: "#f59e0b",
  },
  name: "modern",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 12,
    page: {
      marginBottom: 40,
      marginLeft: 40,
      marginRight: 40,
      marginTop: 40,
    },
    paragraphGap: 10,
    sectionGap: 24,
  },
  typography: {
    body: {
      fontFamily: "Helvetica",
      fontSize: 11,
      lineHeight: 1.6,
    },
    heading: {
      fontFamily: "Helvetica",
      fontSize: {
        h1: 28,
        h2: 22,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 12,
      },
      fontWeight: 600,
      lineHeight: 1.25,
    },
  },
};
