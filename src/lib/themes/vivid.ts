import type { PdfcnTheme } from "$lib/types/pdf-themes";

import { defaultPrimitives } from "./primitives.js";

/**
 * Vivid theme preset.
 *
 * Character: Deep violet/purple palette, Nunito rounded sans-serif, playful
 * but still professional. High-energy creative accent.
 * Ideal for creative agencies, startups, marketing decks, and pitch docs.
 */
export const vividTheme: PdfcnTheme = {
  colors: {
    accent: "#8b5cf6",
    background: "#ffffff",
    border: "#ddd6fe",
    destructive: "#dc2626",
    foreground: "#1e1b4b",
    info: "#0ea5e9",
    muted: "#f5f3ff",
    mutedForeground: "#7c3aed",
    primary: "#6d28d9",
    primaryForeground: "#ffffff",
    success: "#16a34a",
    warning: "#d97706",
  },
  name: "vivid",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 14,
    page: {
      marginBottom: 48,
      marginLeft: 44,
      marginRight: 44,
      marginTop: 48,
    },
    paragraphGap: 10,
    sectionGap: 26,
  },
  typography: {
    body: {
      fontFamily: "Nunito",
      fontSize: 11,
      lineHeight: 1.6,
    },
    heading: {
      fontFamily: "Nunito",
      fontSize: {
        h1: 32,
        h2: 24,
        h3: 19,
        h4: 16,
        h5: 14,
        h6: 12,
      },
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },
};
