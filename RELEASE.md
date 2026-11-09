# Release preparation

PDFcn is a themed document component and block catalog using Forme and Takumi rendering engines. It is not an independent PDF engine. Pagination, font metrics and supported layout differ by backend; successful rendering does not establish PDF/A, accessibility or legal invoice compliance.

This committed candidate is the single `pdfcn-svelte` package, version 0.1.0. The local uncommitted workspace split into `forme-svelte`, `takumi-svelte` and `pdfcn-svelte`, including independent docs sites and consumer gates, is deliberately excluded pending owner selection. Passing this branch's gate does not qualify that three-package release. Recommend including the reviewed split before releasing the intended coordinated catalog, rather than accidentally publishing this older architecture.

For a coordinated release: select and commit the split; pin all three release versions; build and pack all artifacts from one immutable SHA; verify `workspace:` references become published semver dependencies; qualify each base independently and the combined catalog in clean consumers using only the three tarballs; retain rendering/pagination and font evidence; publish the two bases before the dependent catalog only after separate authorization. Verify registry names, actual ownership, fonts, hosted registry URLs and docs paths. A registry 404 is not a reserved name.

The upstream MIT notice remains intact. Font notices remain separately applicable. The three-package qualification is blocked until the owner selects the uncommitted work.

## Qualification on 2026-11-09

`heavy -- pnpm validate` passed type checks, primitive/component/render/pagination/output regressions, docs generation/build/contracts, API checks and the fresh package consumer. The final `test:consumer-release` stage stopped at `dev-preview start`: no free preview ports. This local invocation did not complete; no allocations belonging to other work were changed. GitHub CI subsequently passed the complete `pnpm validate` gate on e83924d ([run](https://github.com/alois-reinstadler/pdfcn-svelte/actions/runs/42552513324)). `validate:pack` was not reached. This evidence covers only the committed single-package tree.

## Owner checklist

- [ ] Select the exact source commit, version, package identity and archive hash.
- [ ] Resolve the limitations and inclusion decisions above.
- [ ] Run the repository gate on the final candidate and retain logs.
- [ ] Inspect packed exports, files, dependency closure and third-party notices.
- [ ] Verify public documentation and assets independently of local tests.
- [ ] Obtain separate publication approval; this preparation does not publish, tag or merge.
