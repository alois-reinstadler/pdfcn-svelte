# Forme repeated-content ordering

Forme 0.25.0 consumes Fixed nodes in traversal order. A footer placed after a PageBreak does not appear on already emitted physical pages. The Svelte serializer preserves source order, and a leaf component cannot hoist its node after upstream serialization.

The Forme Page wrapper now owns a flow context. Body primitives and both public PageBreak exports mark content traversal. Fixed (including fixed/sticky PageFooter, fixed PageHeader, and fixed PageNumber) must appear before body content; late declarations throw an actionable error. Fixed descendants do not start body flow. Nested Fixed and Fixed outside pdfcn's Page are rejected. This applies when using the pdfcn primitives; directly mixing upstream @formepdf/svelte primitives bypasses this library's contract and is not the supported composition path.

Migration: place every repeated header/footer/page-number block at the start of Page, before Heading, Text, View, tables, images, or page breaks. Their physical placement remains determined by position="header"/"footer", not their declaration order. Use Page from pdfcn-svelte/bases/forme.

`pnpm run test:api-components` checks late declarations fail for all four entry points and validates repetition on every physical page with both explicit breaks and automatic flow. It also verifies raw PDFPageBreak cannot bypass ordering detection.

Graph point colors now color actual line/area SVG dots. Continuous strokes remain series-colored; per-point color with showDots=false throws and recommends series.color. SVG serialization/browser-tree regressions inspect the actual circle fill.
