# Consumer installation baseline and release regression

Baseline date: 2026-09-27. Starting source: `79103eb`.
No package was published, registry deployed, or branch pushed during this test.

## Hosted baseline (before local fixes)

Independent applications were scaffolded at `/tmp/pdfcn-hosted-forme` and
`/tmp/pdfcn-hosted-takumi`, outside every repository and workspace. They used no
checkout aliases, linked dependencies, or copied node_modules.

Tools: Node `24.20.0`, pnpm `11.23.0`, `sv 0.17.1`,
`shadcn-svelte 1.7.0`. The scaffold resolved Svelte `5.56.1`,
SvelteKit `2.63.0`, Vite `8.0.16`, TypeScript `6.0.3`,
Tailwind `4.3.0`, and adapter-node `5.5.4`.

Exact scaffold (repeat with `takumi`):

```sh
pnpm dlx sv@0.17.1 create /tmp/pdfcn-hosted-forme --template minimal --types ts --add tailwindcss=plugins:none sveltekit-adapter=adapter:node --install pnpm
```

`--template minimal` selects the empty app; `--types ts` enables TypeScript;
`--add` configures Tailwind and a production Node server adapter; `--install pnpm`
selects the installer. The scaffold did not set `packageManager`, so the test
added `"packageManager": "pnpm@11.23.0"` immediately afterward. Without that pin,
shadcn's install subprocess selected pnpm `12.6.0` from the environment.

Initialization:

```sh
pnpm dlx shadcn-svelte@1.7.0 init --base-color neutral --css src/routes/layout.css --components-alias '$lib/components' --lib-alias '$lib' --utils-alias '$lib/utils' --hooks-alias '$lib/hooks' --ui-alias '$lib/components/ui' --cwd /tmp/pdfcn-hosted-forme
```

The options specify the color, actual scaffold CSS file, standard SvelteKit
aliases, and application directory. Forme selected the offered Vega preset;
Takumi selected Nova. Both confirmed the CSS update. For reproducible new
applications, `--preset b0` selects the default Nova/Inter preset explicitly.
The CLI still asks to confirm its stylesheet update; the regression answers
only that prompt inside its new disposable app. Running `init` with closed
stdin can exit **0** while leaving initialization incomplete, so the regression
asserts the generated CSS and installed dependencies rather than trusting exit
status alone. `--preset default` is invalid in CLI 1.7.0.

For each base, installation used the actual hosted URLs (Forme shown):

```sh
pnpm dlx shadcn-svelte@1.7.0 add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/alert.json --yes --overwrite --cwd /tmp/pdfcn-hosted-forme
pnpm dlx shadcn-svelte@1.7.0 add https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/invoice-modern.json https://alois-reinstadler.github.io/pdfcn-svelte/r/forme/theme-modern.json --yes --overwrite --cwd /tmp/pdfcn-hosted-forme
```

`--yes` accepts the selected items; `--overwrite` allows their shared utility
files to be replaced in the disposable app; `--cwd` selects that app.
The Takumi app used the same three `takumi/` URLs in one `add` invocation.

Both installations completed and `pnpm check` reported zero errors/warnings.
The CLI reports logical install locations such as `src/lib/components/ui/forme/alert`,
but the explicit item targets correctly create `src/lib/bases/forme/...`.
Theme installation creates `src/lib/themes/modern.ts`; it does not overwrite
`layout.css` even though the CLI's summary mentions that CSS destination.

**Reproduced defect:** registry dependency names had no version ranges. Forme
therefore installed core/svelte `0.25.0`, and Takumi installed `takumi-pdf 0.15.0`
and helpers `2.14.0`, outside the package's supported `^0.11.1` and `^0.11.3`
engine lines. The local registry builder now derives versions from package.json
and fails if an imported package has no declared supported range.

Hosted smoke rendering nevertheless succeeded for the tested short invoices:

| Hosted source consumer | Development PDF | Production PDF |
| --- | ---: | ---: |
| Forme modern invoice, documented custom data | 18,937 bytes | 18,937 bytes |
| Takumi copied invoice, documented default data | 20,825 bytes | 20,825 bytes |

Forme used the full displayed `template-examples/forme/invoice-modern.svelte`
with its imports changed to the installed source paths. Takumi used the exact
`src/docs/copied-invoice.svelte.txt` and `copied-endpoint.ts.txt`. Requests were
real HTTP `/example.pdf` responses, status 200 and `application/pdf`, through
Vite development and adapter-node production servers. Production builds ran
with `pnpm build`; production processes ran with `node build`.

All servers used the existing, exclusively borrowed `pdfcn-svelte-review`
manager allocation at `http://127.0.0.1:4090`, bound by the manager to
`0.0.0.0` inside the container. Each server was stopped before the next began.
The public tailnet URL was never used for tool requests. PDFs remain at
`/tmp/pdfcn-hosted-{forme,takumi}-{dev,production}.pdf` for independent inspection.
This smoke baseline does not establish compatibility of the newer engine lines.

## Reproducible corrected-artifact release gate

```sh
PDFCN_CONSUMER_PREVIEW_SLUG=pdfcn-svelte-review pnpm test:consumer-release
```

The environment variable selects an allocated preview slug owned by the caller;
without it the script requests `pdfcn-consumer-release`. Only use a slug whose
preview you own. Local HTTP servers always use `dev-preview`. CI environments
without that container tool use OS-assigned, loopback-only ephemeral ports.
The script fails rather than selecting arbitrary local ports.

The test retains a unique `/tmp/pdfcn-release-consumers-*` directory and prints
its location. It contains every exact command, command output, resolved package
versions in `results.json`, development/production PDFs, and all displayed-source
PDFs. A failure leaves the evidence intact and stops owned servers.

The regression:

- Scaffolds independent TypeScript SvelteKit applications with the real `sv` CLI.
- Runs real `shadcn-svelte init`, then `add` for a component, template, and theme
  for each base against locally served generated registry artifacts.
- Resolves every registry dependency with the CLI, without a custom copy script.
- Typechecks and requests first-PDF and invoice endpoints in development and
  after the production adapter-node build for each copied-source base.
- Packs the package, installs Forme-only and Takumi-only apps, and asserts the
  opposite renderer is absent from the app's resolvable dependency graph.
- Copies the **displayed source**, after the same documented public-import
  transformation, for every component/template/pagination example into its
  matching package consumer; typechecks and renders every one over production HTTP.
- Builds a separate browser-only app with the package and **neither** PDF engine;
  checks production browser output for renderer modules and binary assets.
- Tests installed theme imports and the actual paths created by the CLI.

To repeat the hosted verification after an authorized deployment:

```sh
PDFCN_CONSUMER_PREVIEW_SLUG=pdfcn-svelte-review pnpm test:consumer-release --hosted --registry-only
```

`--hosted` uses the public registry rather than local artifacts;
`--registry-only` limits this post-deployment test to the two copied-source apps.
`PDFCN_REGISTRY_URL` can select the exact deployment's registry root.
No hosted-fix claim is justified until that post-deployment run passes.

## Documentation prerequisites exposed

A fresh source-registry consumer needs Tailwind configured before shadcn init,
the CSS path created by its own scaffold, SvelteKit's standard `$lib` alias,
a chosen design-system preset, and a server-capable adapter for production PDF
endpoints. `sv create` with the exact add-ons above supplies these explicitly.
A PDF library package consumer does not require shadcn or Tailwind. Production
Node serving requires building with adapter-node and starting `node build`;
a static-only adapter cannot run the endpoint. Pin pnpm in the generated app.

Hosted artifacts fetched during this baseline (SHA-256):

```text
forme/alert.json          47b0a65c3a661f676b31f59785d4ffe89a79ef4f23600f2bd84672e41395ec96
forme/invoice-modern.json 49d1201a68a7c93e770242d54d0d5ee5862d7f2dd35bba99b0da57d6602038ce
forme/theme-modern.json   960f8f1ddc3dd401e846ab2ca57696d36712d1b436657a74e43e01ec41202e55
forme/utils.json          40536daa3d9bea18708641476c7ad23c96ff1719eecced1a11d8330d5c91a1ff
takumi/alert.json         87ae87a9eb8f9c7c68fc6565492d51b2d3231abe2e31c4b1b17d3871ce2e7b1d
takumi/invoice-modern.json 6a454da52272a8f18ff0e463af6946c1389df46dd1ac2e79acaa849506633242
takumi/theme-modern.json  7409a3f26ce103785e90395bb3b7e3073726014933166a5d2177e3fab378d59a
takumi/utils.json         efc5c71f136d2bbb7f0000505b11591e11747dcfc5eaa2a8bd20917837ee65d2
```

## Local corrected-artifact result before integration

`PDFCN_CONSUMER_PREVIEW_SLUG=pdfcn-svelte-review pnpm test:consumer-release`
passed with evidence at `/tmp/pdfcn-release-consumers-0pkEcP/results.json`.
This first run used the starting dependency lines; the integrated release gate
must repeat it after the planned Forme upgrade and pagination changes.

| Fresh app | Typecheck/build | Dev and production first PDF | Additional verification |
| --- | --- | --- | --- |
| CLI Forme | passed | 2,854 bytes each | Invoice dev/prod, theme import, dependency isolation |
| CLI Takumi | passed | 7,576 bytes each | Invoice dev/prod, theme import, browser assets |
| Package Forme only | passed | 2,854 bytes each | All 34 displayed examples rendered over production HTTP |
| Package Takumi only | passed | 7,576 bytes each | All 34 displayed examples rendered over production HTTP |
| Browser without renderers | passed | HTML only | Neither PDF engine installed; production HTML and clean assets |

The existing `pnpm test:consumer` also passed (44.7 seconds), including its
public-export contracts, displayed-source typechecks, both renderer runtimes,
and browser build. No `@types/qrcode` or checkout-specific aliases were added
to the new package-only consumers. The new CLI check verifies installed renderer
ranges against the package's declared ranges; the hosted baseline intentionally
records the old unversioned behavior separately. Browser interaction and PDF
visual review are performed by the coordinating release engineer, separately
from these HTTP and build assertions.


## Final integrated result (2026-09-28)

The complete `pnpm validate` gate passed with
`PDFCN_CONSUMER_PREVIEW_SLUG=pdfcn-svelte-review` and
`PDFCN_REGRESSION_ARTIFACTS=/tmp/pdfcn-release-final`.
Final consumer evidence: `/tmp/pdfcn-release-consumers-mNVdSe/results.json`;
neighboring numbered logs retain the exact invocations and output. All five
applications were freshly scaffolded outside the repository.

Node 24.20.0, pnpm 11.23.0, sv 0.17.1, shadcn-svelte 1.7.0;
Svelte 5.57.1, SvelteKit 2.70.3, Vite 8.3.1, TypeScript 6.0.3,
adapter-node 5.5.7. CLI apps resolved Tailwind 4.3.3.
Forme core/Svelte 0.25.0; takumi-pdf 0.11.3; helpers 2.14.0.

| Fresh app | Typecheck/build | Dev and production first PDF | Additional verification |
| --- | --- | --- | --- |
| Real CLI Forme | passed | 3,771 bytes each | Component/template/theme, invoice endpoints, dependency isolation |
| Real CLI Takumi | passed | 7,713 bytes each | Component/template/theme, invoice endpoints, browser assets |
| Package Forme only | passed | 3,771 bytes each | All 35 displayed examples over production HTTP |
| Package Takumi only | passed | 7,713 bytes each | All 35 displayed examples over production HTTP |
| Browser without renderers | passed | HTML only | No renderer installed; shared Chrome: nine 200 responses, no console errors |

The registry retains declared dependency ranges. The real CLI/pnpm can save a
narrower compatible range (helpers `^2.12.0` becomes `^2.14.0`). The consumer
assertion therefore checks semantic-version subset compatibility and the installed
version, rather than incorrect exact string equality. This strengthens dependency
validation while accepting the observed package-manager behavior; unversioned or
out-of-range artifacts still fail. No text/layout preservation assertion was
weakened.

The separately retained hosted baseline predates these fixes. No hosted artifacts
were changed; repeat the documented `--hosted --registry-only` CLI gate after an
authorized deployment before claiming hosted installation is fixed.
