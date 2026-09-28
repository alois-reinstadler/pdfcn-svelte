# Public component prop audit

Audited against Forme 0.25.0 and Takumi 0.11.3. This is an implementation trace, not a claim that arbitrary renderer `style` keys are portable. All numeric component dimensions are PDF points; Takumi converts point lengths to CSS pixels at the primitive boundary. Caller business totals, statuses, dates, labels and chart values are never derived by component rendering.

For each family, the inventory includes declared interface fields (including nested data fields), runtime destructured props, and inherited style/children where declared. Source references identify the exact code that applies them. Types enumerate allowed visual variants; unsupported engine capabilities fail before serialization.

## alert

variant → icon/color maps; title/description/children all retained; showIcon/showBorder → conditional SVG and border. Alert is atomic.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `children`, `description`, `showBorder`, `showIcon`, `style`, `title`, `variant` | [alert.svelte](../../src/lib/bases/forme/components/alert/alert.svelte) |
| takumi | `children`, `description`, `showBorder`, `showIcon`, `style`, `title`, `variant` | [alert.svelte](../../src/lib/bases/takumi/components/alert/alert.svelte) |

## badge

variant/size → container and text maps; background/color resolve semantic theme keys; label takes precedence over children by explicit API design.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `background`, `children`, `color`, `label`, `size`, `style`, `variant` | [badge.svelte](../../src/lib/bases/forme/components/badge/badge.svelte) |
| takumi | `background`, `children`, `color`, `label`, `size`, `style`, `variant` | [badge.svelte](../../src/lib/bases/takumi/components/badge/badge.svelte) |

## card

variant/padding → cardStyle; title/text and children all render; wrap → renderer breakability (default false).

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `children`, `padding`, `style`, `text`, `title`, `variant`, `wrap` | [card.svelte](../../src/lib/bases/forme/components/card/card.svelte) |
| takumi | `children`, `padding`, `style`, `text`, `title`, `variant`, `wrap` | [card.svelte](../../src/lib/bases/takumi/components/card/card.svelte) |

## data-table

columns → ordered keyed TableCell instances; data → rows; column render/renderFooter snippets receive caller values; absent scalar values format as empty. footer remains caller-owned. variant/stripe/size/noWrap/style → Table and cells. Zero footer is retained.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `columns`, `data`, `footer`, `header`, `key`, `noWrap`, `render`, `renderFooter`, `size`, `stripe`, `style`, `variant`, `width` | [data-table.svelte](../../src/lib/bases/forme/components/data-table/data-table.svelte), [data-table.types.ts](../../src/lib/bases/forme/components/data-table/data-table.types.ts) |
| takumi | `align`, `columns`, `data`, `footer`, `header`, `key`, `noWrap`, `render`, `renderFooter`, `size`, `stripe`, `style`, `variant`, `width` | [data-table.svelte](../../src/lib/bases/takumi/components/data-table/data-table.svelte), [data-table.types.ts](../../src/lib/bases/takumi/components/data-table/data-table.types.ts) |

## divider

spacing/variant/thickness/color/width → line styles, label → centered text with two rules; all numeric lengths are points.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `color`, `label`, `spacing`, `style`, `thickness`, `variant`, `width` | [divider.svelte](../../src/lib/bases/forme/components/divider/divider.svelte) |
| takumi | `color`, `label`, `spacing`, `style`, `thickness`, `variant`, `width` | [divider.svelte](../../src/lib/bases/takumi/components/divider/divider.svelte) |

## form

PrintableForm is the primary name. groups/layout → one/two/three columns; field label/hint/height/width → printable blank area. Width now applied; height rejects nonpositive/nonfinite. No interactive fields. title/subtitle/variant/labelPosition/noWrap/style consumed.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `fields`, `groups`, `height`, `hint`, `label`, `labelPosition`, `layout`, `noWrap`, `style`, `subtitle`, `title`, `variant`, `width` | [form.svelte](../../src/lib/bases/forme/components/form/form.svelte), [form.types.ts](../../src/lib/bases/forme/components/form/form.types.ts) |
| takumi | `fields`, `groups`, `height`, `hint`, `label`, `labelPosition`, `layout`, `noWrap`, `style`, `subtitle`, `title`, `variant`, `width` | [form.svelte](../../src/lib/bases/takumi/components/form/form.svelte), [form.types.ts](../../src/lib/bases/takumi/components/form/form.types.ts) |

## graph

data normalized without invented missing values. Aligned finite series required; pie/donut/horizontal-bar reject multiple series, pie/donut reject negative values. Signed Cartesian bars start at zero. width/fullWidth are exclusive; padding requires fullWidth. dimensions, density, yTicks and colors validated. showValues/grid/dots/smooth map to geometry or labels; inappropriate centerLabel/axes/smooth combinations reject. Pie labels preserve zero/tiny slices; long labels retained below Cartesian plots; unbroken words over 40 chars reject. SVG text + PDF text overlays have distinct render paths. noWrap maps breakability. title/subtitle/style remain caller-owned.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `centerLabel`, `color`, `colors`, `containerPadding`, `data`, `fullWidth`, `height`, `label`, `legend`, `name`, `noWrap`, `pageWidth`, `showDots`, `showGrid`, `showValues`, `smooth`, `style`, `subtitle`, `title`, `value`, `variant`, `width`, `wrapperPadding`, `xLabel`, `yLabel`, `yTicks` | [graph.svelte](../../src/lib/bases/forme/components/graph/graph.svelte), [graph.types.ts](../../src/lib/bases/forme/components/graph/graph.types.ts) |
| takumi | `centerLabel`, `color`, `colors`, `containerPadding`, `data`, `fullWidth`, `height`, `label`, `legend`, `name`, `noWrap`, `pageWidth`, `showDots`, `showGrid`, `showValues`, `smooth`, `style`, `subtitle`, `title`, `value`, `variant`, `width`, `wrapperPadding`, `xLabel`, `yLabel`, `yTicks` | [graph.svelte](../../src/lib/bases/takumi/components/graph/graph.svelte), [graph.types.ts](../../src/lib/bases/takumi/components/graph/graph.types.ts) |

## heading

level/font/color/align/weight/tracking/transform/noMargin → text styles. Forme keepWithNext supports false only; true throws and recommends wrapping heading+following content in KeepTogether. Takumi behavior is owned by the physical pagination adapter and its separate regression fixtures.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `children`, `color`, `keepWithNext`, `level`, `noMargin`, `style`, `tracking`, `transform`, `weight` | [heading.svelte](../../src/lib/bases/forme/components/heading/heading.svelte) |
| takumi | `align`, `children`, `color`, `keepWithNext`, `level`, `noMargin`, `style`, `tracking`, `transform`, `weight` | [heading.svelte](../../src/lib/bases/takumi/components/heading/heading.svelte) |

## keep-together

children/style → unbreakable View. Forme minPresenceAhead is never and runtime rejects with instruction to include following content inside the group. Takumi adapter owns explicit minimum-space metadata and physical checks.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `children`, `minPresenceAhead`, `style` | [keep-together.svelte](../../src/lib/bases/forme/components/keep-together/keep-together.svelte) |
| takumi | `children`, `minPresenceAhead`, `style` | [keep-together.svelte](../../src/lib/bases/takumi/components/keep-together/keep-together.svelte) |

## key-value

items key/value/keyStyle/valueStyle/valueColor consumed. direction selects row/column; labelFlex sets horizontal label share. size/colors/boldValue style text. divided and custom divider color/thickness/margin work in both directions; explicit zero values now respected. noWrap maps breakability.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `boldValue`, `direction`, `divided`, `dividerColor`, `dividerMargin`, `dividerThickness`, `items`, `key`, `keyStyle`, `labelColor`, `labelFlex`, `noWrap`, `size`, `style`, `value`, `valueColor`, `valueStyle` | [key-value.svelte](../../src/lib/bases/forme/components/key-value/key-value.svelte) |
| takumi | `boldValue`, `direction`, `divided`, `dividerColor`, `dividerMargin`, `dividerThickness`, `items`, `key`, `keyStyle`, `labelColor`, `labelFlex`, `noWrap`, `size`, `style`, `value`, `valueColor`, `valueStyle` | [key-value.svelte](../../src/lib/bases/takumi/components/key-value/key-value.svelte) |

## link

href → actual link primitive; children → text; variant/underline/align/color/style → link text styles. External URI is caller-owned.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `children`, `color`, `href`, `style`, `underline`, `variant` | [link.svelte](../../src/lib/bases/forme/components/link/link.svelte) |
| takumi | `align`, `children`, `color`, `href`, `style`, `underline`, `variant` | [link.svelte](../../src/lib/bases/takumi/components/link/link.svelte) |

## list

variant controls marker; gap/_level → spacing/indentation. items text, description and recursive children retained in all variants. checked absent now means false instead of silently claiming completion. checked only controls checklist markers. noWrap maps breakability.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `_level`, `checked`, `children`, `description`, `gap`, `items`, `noWrap`, `style`, `text`, `variant` | [list.svelte](../../src/lib/bases/forme/components/list/list.svelte) |
| takumi | `_level`, `checked`, `children`, `description`, `gap`, `items`, `noWrap`, `style`, `text`, `variant` | [list.svelte](../../src/lib/bases/takumi/components/list/list.svelte) |

## page-break

No children. Forme style is never and runtime rejects because a break has no visual box; place spacing on following content. Takumi boundary behavior is tested in the pagination adapter.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `children`, `style` | [page-break.svelte](../../src/lib/bases/forme/components/page-break/page-break.svelte) |
| takumi | `children`, `style` | [page-break.svelte](../../src/lib/bases/takumi/components/page-break/page-break.svelte) |

## page-footer

variant → container/content; left/right/center text rendered or invalid variant rejected. Contacts require detailed/three-column; centerText requires simple/centered/three-column. Forme simple columns now flex to actual content width instead of 480pt. Forme fixed content must precede body content inside the library Page; late declarations fail. fixed/sticky → repeated footer; Forme pagePadding requires sticky; Takumi pagePadding adds an inset inside the repeated band. sticky conflicts with marginTop. textColor/background style overrides; noWrap protects block. Takumi adapter measures at the actual inset width and centers the repeated band inside Page margins.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `address`, `background`, `centerText`, `email`, `fixed`, `leftText`, `marginTop`, `noWrap`, `pagePadding`, `phone`, `rightText`, `sticky`, `style`, `textColor`, `variant`, `website` | [page-footer.svelte](../../src/lib/bases/forme/components/page-footer/page-footer.svelte) |
| takumi | `address`, `background`, `centerText`, `email`, `fixed`, `leftText`, `marginTop`, `noWrap`, `pagePadding`, `phone`, `rightText`, `sticky`, `style`, `textColor`, `variant`, `website` | [page-footer.svelte](../../src/lib/bases/takumi/components/page-footer/page-footer.svelte) |

## page-header

variant → container/content; contacts require two-column; logo requires logo-left/right; rightText/rightSubText require simple/minimal/logo-left/two-column. No provided content silently disappears under an incompatible visual variant. fixed → repeated header; noWrap protects block; marginBottom/background/titleColor/style → styles. Takumi adapter handles measured header reservation.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `address`, `background`, `email`, `fixed`, `logo`, `marginBottom`, `noWrap`, `phone`, `rightSubText`, `rightText`, `style`, `subtitle`, `title`, `titleColor`, `variant` | [page-header.svelte](../../src/lib/bases/forme/components/page-header/page-header.svelte) |
| takumi | `address`, `background`, `email`, `fixed`, `logo`, `marginBottom`, `noWrap`, `phone`, `rightSubText`, `rightText`, `style`, `subtitle`, `title`, `titleColor`, `variant` | [page-header.svelte](../../src/lib/bases/takumi/components/page-header/page-header.svelte) |

## page-number

format substitutions use physical PAGE_NUMBER/TOTAL_PAGES in Forme and adapter tokens in Takumi. align/size/muted/style → text; Forme fixed chooses a repeated footer. Takumi fixed on PageNumber alone is rejected; put the number in PageHeader/PageFooter. No children.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `children`, `fixed`, `format`, `muted`, `size`, `style` | [page-number.svelte](../../src/lib/bases/forme/components/page-number/page-number.svelte) |
| takumi | `align`, `children`, `fixed`, `format`, `muted`, `size`, `style` | [page-number.svelte](../../src/lib/bases/takumi/components/page-number/page-number.svelte) |

## pdf-image

src structured requests rejected; loadImage handles method/headers/body before rendering with HTTP failures surfaced. Forme requires validated PNG/JPEG data URI because native failed loads silently disappear; imageDataUri(bytes) handles local bytes. PNG chunk lengths/checksums/IHDR/IDAT/IEND and JPEG frame/scan/end checked. Forme fit supports fill only; position rejected. Single dimension preserves source ratio. aspectRatio requires positive numeric width and excludes explicit height; overrides variant height. Dimensions validated; variant/borderRadius/caption/noWrap/style map visual layout. Takumi browser URL accepted; renderer preflight is adapter-owned.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `aspectRatio`, `borderRadius`, `caption`, `fit`, `height`, `noWrap`, `position`, `src`, `style`, `variant`, `width` | [pdf-image.svelte](../../src/lib/bases/forme/components/pdf-image/pdf-image.svelte) |
| takumi | `aspectRatio`, `borderRadius`, `caption`, `fit`, `height`, `noWrap`, `position`, `src`, `style`, `variant`, `width` | [pdf-image.svelte](../../src/lib/bases/takumi/components/pdf-image/pdf-image.svelte) |

## qrcode

value/errorLevel → qrcode matrix; size/margin → module geometry and quiet zone; color/backgroundColor resolve tokens; caption/style render. Empty/oversized payload errors come from qrcode, not invented data.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `backgroundColor`, `caption`, `color`, `errorLevel`, `margin`, `size`, `style`, `value` | [qrcode.svelte](../../src/lib/bases/forme/components/qrcode/qrcode.svelte) |
| takumi | `backgroundColor`, `caption`, `color`, `errorLevel`, `margin`, `size`, `style`, `value`, `x`, `y` | [qrcode.svelte](../../src/lib/bases/takumi/components/qrcode/qrcode.svelte) |

## section

spacing/padding/background/border/variant/accentColor → section style map; noWrap → breakability; children render once.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `accentColor`, `background`, `border`, `children`, `noWrap`, `padding`, `spacing`, `style`, `variant` | [section.svelte](../../src/lib/bases/forme/components/section/section.svelte) |
| takumi | `accentColor`, `background`, `border`, `children`, `noWrap`, `padding`, `spacing`, `style`, `variant` | [section.svelte](../../src/lib/bases/takumi/components/section/section.svelte) |

## signature

PrintableSignature/PrintableSignatureProps primary names. single/inline consume label/name/title/date; inline now retains title/date. double consumes exactly two signers; signers in other variants and single-signer props in double reject. Draws handwritten signature lines only, not AcroForm widgets or cryptographic signing.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `date`, `label`, `name`, `signers`, `style`, `title`, `variant` | [signature.svelte](../../src/lib/bases/forme/components/signature/signature.svelte) |
| takumi | `date`, `label`, `name`, `signers`, `style`, `title`, `variant` | [signature.svelte](../../src/lib/bases/takumi/components/signature/signature.svelte) |

## stack

direction/gap/align/justify/wrap → flex layout; noWrap controls PDF splitting independently of flex wrapping; style/children forwarded. Omitted align retains renderer stretch; omitted justify retains flex-start.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `children`, `direction`, `gap`, `justify`, `noWrap`, `style`, `wrap` | [stack.svelte](../../src/lib/bases/forme/components/stack/stack.svelte) |
| takumi | `align`, `children`, `direction`, `gap`, `justify`, `noWrap`, `style`, `wrap` | [stack.svelte](../../src/lib/bases/takumi/components/stack/stack.svelte) |

## table

variant/zebraStripe/noWrap → table context/layout; sections set kind; rows inherit header/footer and variant, track stripe position; cells honor explicit header/footer ahead of context, align/width/text/children/style. text takes precedence over children. _last is deprecated legacy internal metadata only. Forme 0.25 fixes percent-width row inflation; keep physical regression instead of an obsolete workaround. Numeric widths use points; percentage widths refer to containing row.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `_last`, `align`, `children`, `footer`, `header`, `noWrap`, `stripe`, `style`, `text`, `variant`, `width`, `zebraStripe` | [table-body.svelte](../../src/lib/bases/forme/components/table/table-body.svelte), [table-cell.svelte](../../src/lib/bases/forme/components/table/table-cell.svelte), [table-footer.svelte](../../src/lib/bases/forme/components/table/table-footer.svelte), [table-header.svelte](../../src/lib/bases/forme/components/table/table-header.svelte), [table-row.svelte](../../src/lib/bases/forme/components/table/table-row.svelte), [table.svelte](../../src/lib/bases/forme/components/table/table.svelte), [table.types.ts](../../src/lib/bases/forme/components/table/table.types.ts) |
| takumi | `_last`, `align`, `children`, `footer`, `header`, `noWrap`, `stripe`, `style`, `text`, `variant`, `width`, `zebraStripe` | [table-body.svelte](../../src/lib/bases/takumi/components/table/table-body.svelte), [table-cell.svelte](../../src/lib/bases/takumi/components/table/table-cell.svelte), [table-footer.svelte](../../src/lib/bases/takumi/components/table/table-footer.svelte), [table-header.svelte](../../src/lib/bases/takumi/components/table/table-header.svelte), [table-row.svelte](../../src/lib/bases/takumi/components/table/table-row.svelte), [table.svelte](../../src/lib/bases/takumi/components/table/table.svelte), [table.types.ts](../../src/lib/bases/takumi/components/table/table.types.ts) |

## text

variant/weight/italic/decoration/transform/align/color/noMargin → text style maps; children forwarded. Omitted variant uses theme body size (not necessarily explicit variant=base).

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `align`, `children`, `color`, `decoration`, `italic`, `noMargin`, `style`, `transform`, `variant`, `weight` | [text.svelte](../../src/lib/bases/forme/components/text/text.svelte) |
| takumi | `align`, `children`, `color`, `decoration`, `italic`, `noMargin`, `style`, `transform`, `variant`, `weight` | [text.svelte](../../src/lib/bases/takumi/components/text/text.svelte) |

## watermark

Forme text/angle/fontSize/color/opacity → native repeated watermark. position is center only, fixed is true only; other requests throw with positioned-Text alternative. opacity finite 0..1. Takumi positioning/repetition is adapter-owned and must match its explicit supported contract.

| Renderer | Public and nested prop inventory | Implementation trace |
| --- | --- | --- |
| forme | `angle`, `children`, `color`, `fixed`, `fontSize`, `opacity`, `position`, `style`, `text` | [watermark.svelte](../../src/lib/bases/forme/components/watermark/watermark.svelte) |
| takumi | `angle`, `children`, `color`, `fontSize`, `opacity`, `position`, `style`, `text` | [watermark.svelte](../../src/lib/bases/takumi/components/watermark/watermark.svelte) |

## Engine and asset boundaries

Forme Document forwards metadata, registered fonts, tagged/PDF-A/PDF-UA/certification options to @formepdf/svelte. Missing explicitly registered font paths reject in the actual render regression; an unregistered family remains the documented engine fallback and does not magically install theme fonts. Actual font embedding is caller setup. Forme View/Text styles map through @formepdf/shared; these wrappers do not claim arbitrary CSS support. Page dimensions/margins/background fields forward to the renderer. Takumi document/page/primitive metadata and assets are validated by its separate server adapter.

## Reproducible evidence

`pnpm exec node scripts/api-regressions.mjs`: local HTTP server verifies request method/headers/body, negative cases, printable field serialization, full inline signature metadata, nested list preservation, chart category and value preservation, missing image/font rejection, corrupt image rejection, intrinsic image ratio, physical percent-column header/row/column positions, and 240/2400-character unbroken table text including multi-page content. `PDFCN_REGRESSION_ARTIFACTS=/tmp/pdfcn-api-artifacts` also writes raster/PDF artifacts. `pnpm run test:components` covers all 24 families and browser/PDF label uniqueness. `pnpm run test:primitives` covers primitive style/unit contracts.

Baseline Forme 0.11.1 with 55%/15%/15%/15% columns put the first body row 145pt below its header. Forme 0.25.0 puts it 26.2pt below, with identical horizontal column positions. The new assertion remains strict (<35pt). Raster inspection confirms readable header/body rows. No local percent-width workaround is retained.

## Checked Forme output

The supported Forme rendering entry is `pdfcn-svelte/bases/forme/server`. It enables the 0.25 engine content audit and verifies physical bounds, fixed-band collisions and atomic-group page membership. An oversized KeepTogether or non-wrapping table row now fails with instructions instead of silently splitting. The 240-character unbroken table regression still verifies full content and bounds; the inspected 2,400-character atomic row measured 923.3pt against 761.9pt body space and now must reject. This deliberate expectation change reflects an invalid atomic layout, not relaxed content preservation.

Enabling the audit also reproduced unpainted text borders in Card titles, consultant invoice party labels and detailed footer page numbers. Those borders now belong to enclosing View containers and remain covered by the checked full-document gate.

Takumi horizontal overflow regression: a 1,000pt right-aligned View previously returned a valid PDF with no extracted text (the label was beyond the 595pt paper edge). Explicit widths exceeding the known containing width and off-page absolute offsets now reject. The pagination suite includes both horizontal and vertical offset probes.

Takumi unbroken identifiers previously lost characters during native text layout. The adapter now applies `overflowWrap: anywhere` to text nodes and the browser Text/Link primitives use the same default. Unsafe wrap overrides and `whiteSpace: nowrap/pre` reject with a wrapping alternative. The 240- and 2,400-character full-width table probes preserve every character within the right boundary; a 10,000-character atomic row rejects with an oversized-content explanation.
