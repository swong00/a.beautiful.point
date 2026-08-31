# 007 - TiC Pricing Slice Anatomy Lab

Status: active
Domain: labs
Priority: P1
Created: 2026-08-30
Last updated: 2026-08-30
Owner/driver: mixed
Branch: feature branch required before code changes (not created)
Related: [006-transparency-in-coverage-discovery.md](../backlog/006-transparency-in-coverage-discovery.md) (superseded by pipeline work), [pipeline contract v0](../../../../pipelines/domains/transparency-in-coverage/public-contract/README.md), [completed pipeline release-repair plan](../../../../pipelines/docs/exec-plans/completed/transparency-in-coverage-pricing-slice-v0-release-repair.md) — cross-repo links resolve in the swventure workspace layout

## Fresh Session Kickoff

Read these first:

1. [AGENTS.md](../../../AGENTS.md)
2. [ARCHITECTURE.md](../../../ARCHITECTURE.md)
3. [docs/core-beliefs.md](../../core-beliefs.md)
4. [docs/exec-plans/README.md](../README.md)
5. [docs/content-system.md](../../content-system.md)
6. Pipeline public contract v0: `pipelines/domains/transparency-in-coverage/public-contract/README.md`
7. The completed pipeline release-repair plan (dependency): `pipelines/docs/exec-plans/completed/transparency-in-coverage-pricing-slice-v0-release-repair.md`

Current state:

- What already exists:
  - The pipeline repo holds pricing slice v0: `12,183` retained Cigna Colorado monetary negotiated-rate facts across fifteen exact CPT codes (July 2026 files), with public contract v0 approved 2026-08-24. The completed repair is pinned at `b69ad4fd10fb128af66ffe48768c8a7f115b4d16` (pushed; verified reachable from `origin/main` 2026-08-30); its v3 validator records all ten checks passing.
  - This site has a working Astro/MDX lab surface (`src/content/labs`, `src/pages/labs`) but no TiC page, importer, or assets. There is no finished homelessness asset importer to copy.
  - Plan 006 (metadata-first TiC discovery, May 2026) is superseded: the pipeline completed discovery, cataloging, canonical modeling, and the first public contract.
- What is known to work: `pnpm run check` and `pnpm run build` on the existing site.
- What is known broken or incomplete: nothing on this side — the plan starts from zero consumer code.
- Execution state 2026-08-30 (branch `feature/007-tic-anatomy-lab`): analysis brief, exporter (in `pipelines`, committed locally after `b69ad4f`, **not yet pushed**), pinned importer, checked-in verified assets, and the zero-JS lab page with 15 per-code routes are implemented and validated; strip-plot inclusion and exact claim wording await Siew's review; merge to `main` (the publish trigger) awaits Siew's approval.
- Last validation command: `pnpm run check && pnpm run build`, pipelines offline test suite, importer negative tests, gzip payload measurements, browser smoke on the built site (see step evidence).
- Last validation result: all pass — check 0 errors, build 27 pages, pipelines suite 52/52, payload max 99,864 B gzip per code vs 262,144 B cap, default route ≈ 18.1 KiB gzip with zero client JS.
- External state or access needed: release pin `b69ad4fd10fb128af66ffe48768c8a7f115b4d16` verified reachable from `pipelines` `origin/main` on 2026-08-30 (`git merge-base --is-ancestor` passes); re-run that check at activation. An earlier draft pinned `a7c6c80`, which was amended (message-only; identical tree) into `b69ad4f` before pushing — the old hash is orphaned and must not be used. The raw slice is `14.2 MB` JSONL — never shipped whole to the browser.
- Known traps:
  - The contract's claims boundary permits only retained facts and per-code row counts: no comparisons, rankings, medians, averages, "cheapest" claims, provider search, or representative-market framing.
  - One dot/record means one retained source fact, never one provider; `provider_group_id` values are release-scoped opaque source contexts.
  - Rows mix `fee schedule`/`negotiated` types and `professional`/`institutional` billing classes; the slice omits modifiers and setting (3,625 staged rows carry modifiers), so matching CPT codes alone does not establish comparable services.
  - `associated_plans_via_file` is empty and non-selecting for this slice; USD is a contract assumption, not a source field; July 2026 files are not a currentness claim.
  - Observed amount bounds (e.g. for 99204) are exploratory retained-sample values and stay out of public headlines.
  - **Pushing to `main` deploys**: `.github/workflows/deploy-pages.yml` publishes on every `main` push, and the lab routes render every collection entry regardless of its `seed`/`draft`/`ready` status (verified: `getCollection("labs")` has no status filter). Work stays on a feature branch until the finished artifact is approved; the existing publication approval applies at the merge-to-`main` trigger. No new deployment system.
  - The site build must use only its own checked-in assets — no sibling-checkout, stage-volume, or network dependency at build time.

## Goal

Ship one small explanatory lab, **"Anatomy of a published healthcare rate,"** answering the reader question: *"What did these files publish for this billing code, and what would I need to know before using it as a price?"* — starting with CPT 99204 (`1,994` retained rows) and offering the other fourteen codes through a selector.

The plan is complete when the site has:

- An analysis brief (a repository review artifact, not a separately published deliverable) recording the reader question, the exact claims the page may make, and the claims it must not make.
- Compact per-code data assets checked into `public/data/transparency-in-coverage/`, generated by a bounded exporter in the `pipelines` repo (that limited cross-repo change is declared under this plan — the repair plan does not supply an exporter), pinned to a specific pipeline release commit plus SHA-256 content hashes of the slice, header, validation evidence, and generated assets. Import fails on any hash mismatch; the reusable `v0` label alone is not a pin.
- A lab page that leads with one annotated record (amount, billing context, source lineage, expiration, and the unknowns: modifiers, setting, plan attribution, currency assumption), an inspectable table, an optional reviewed strip plot where one dot means one retained fact, and a code selector.
- A caveat block beside the visual carrying the July 2026 boundary, bounded sampling, USD assumption, missing plan context, and absence of current-price claims.
- Reviewed exact claim wording, and passing accessibility/mobile checks.

## Scope

- In scope:
  - Analysis brief and claim-wording review.
  - Exporter + import handoff: a bounded exporter command in `pipelines` producing per-code JSON from `pricing-slice-v0.jsonl` (leak-scanned, identifier-free beyond the contract's own fields), an import/reconciliation step in this repo writing to `public/data/transparency-in-coverage/`, and the release pin (pipeline commit + content hashes) with fail-on-mismatch.
  - Lab page (annotated record, table, optional strip plot, selector, caveat block) on the existing Astro/MDX lab surface, built only from the checked-in assets.
  - No-JavaScript and initial-load acceptance: the annotated 99204 record, its count, explanation, caveats, and a readable table excerpt render without JavaScript, with a defined selector fallback; a recorded initial-load/per-code payload budget ensures code-splitting cannot still fetch all fifteen chunks on first load.
  - Displayed-record reconciliation against the contract slice (exact across every row; sampled browser checks supplement, never replace it); accessibility and mobile validation; local/feature-branch review build.
  - Marking plan 006 superseded once this plan activates.

## Export / Import Contract

The consumer change owns this deliberately narrow cross-repository handoff. It does not change the approved slice or public-contract files.

1. Add the pipeline command `export-pricing-slice-v0-public-assets`. It accepts `--release-commit`, `--slice`, `--header`, `--validation-report`, and `--output-dir`; it must refuse to run unless the supplied commit is reachable from `origin/main` and the three inputs byte-match their paths at that commit. The exporter implementation may land in a later pipeline commit; it must not silently export that later state as the release.
2. Its output is a generated package containing `manifest.json` and one minified `codes/<CPT>.json` file for each of the fifteen contract codes. The manifest declares the release commit; source slice/header/validation hashes; exporter version; projection version; total/per-code counts, byte sizes, and SHA-256 values; and the source metadata shared by every fact (payer, geography, reporting month, currency assumption/source status, freshness status, plan-attribution status, source-file lineage, and source-last-updated value).
3. Each per-code file contains only `fact_key`, `amount`, `billing_class`, `negotiated_type`, `service_codes`, `service_name`, `service_description`, `expiration_date`, and opaque `provider_group_id`. `billing_code` is the filename/manifest key. The omitted contract fields are either package-level metadata above or intentionally outside the display projection; no raw provider references or new identifiers may enter the package. The exporter must reconcile this projection to every source fact before writing it.
4. Add consumer command `node scripts/import-tic-pricing-slice-v0.mjs --input <export-package> --expected-release b69ad4fd10fb128af66ffe48768c8a7f115b4d16`. It verifies the manifest, every declared hash/count/byte size, and every generated JSON file before atomically replacing `public/data/transparency-in-coverage/`. It writes a committed `release.json` copy of the verified manifest. No site build reads the sibling pipeline checkout or stage volume.
5. The parent lab defaults to a server-rendered 99204 table excerpt. Each code selector item is also a normal link to a statically generated per-code route, so every selected code has a no-JavaScript fallback; JavaScript may enhance this but is not required for the initial explanation or navigation.

Payload acceptance is measured from the production build with `gzip -9` on the emitted HTML/JS/CSS and public data files: the default route’s initial HTML/CSS/JS plus its 99204 data may total at most `512 KiB` compressed; the 99204 data file and each other code file may each be at most `256 KiB` compressed and `1 MiB` uncompressed; and the default route must not request any non-99204 code file. Record the measured total and all fifteen per-code sizes in the import/reconciliation evidence. A failed budget is a stop condition, not permission to weaken the limit or ship the full slice.

## Out Of Scope

- Out of scope:
  - Medians, averages, rankings, price comparisons, "cheapest" or savings claims, provider search or identity, representative-market or price-range headlines.
  - Any new data acquisition, additional payers/states/codes, allowed amounts, percentage or per-diem metrics.
  - Refresh automation; changes to the pipeline contract or slice; consumer medical or purchasing advice.

## Evidence / Current State

- Contract v0 limits public claims to retained facts and per-code counts; provider identity, comparisons, and completeness claims are excluded (`public-contract/README.md`, approved 2026-08-24).
- Slice composition verified 2026-08-29: `11,413` fee-schedule / `770` negotiated rows; `11,374` professional / `809` institutional; `99204` has `1,994` rows; no modifier field in the public slice.
- The converged claude/codex product recommendation (2026-08-29/30, recorded in shared memory and the pipeline repair plan) selected this educational anatomy framing over a price-distribution story because the latter is not justified by the contract or the data's comparability.

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Depends on: repair release published and pinned | done | `git fetch origin` then `git merge-base --is-ancestor b69ad4fd10fb128af66ffe48768c8a7f115b4d16 origin/main` succeeds in `pipelines`; completed repair plan and contract assets resolve at that commit | Verified at activation 2026-08-30; release trees for superseded `a7c6c80` and pinned `b69ad4f` are identical. Re-verified 2026-08-30 at execution start (`git fetch origin` + `merge-base --is-ancestor` pass; pipelines HEAD == pin, working tree clean). |
| Analysis brief with claims boundary (repository review artifact) | done | Brief states reader question, permitted claims, forbidden claims; reviewed in-repo | [docs/analysis/007-tic-anatomy-lab-claims-brief.md](../../analysis/007-tic-anatomy-lab-claims-brief.md): reader question, five permitted claim classes, seven forbidden classes, and display rules (fact_key ordering, faceting, caveat adjacency). Page wording still needs Siew's review at the publish gate. |
| Exporter in `pipelines` + pinned import | done | `export-pricing-slice-v0-public-assets` and `scripts/import-tic-pricing-slice-v0.mjs` implement the Export / Import Contract; import records release commit + SHA-256 hashes of slice/header/validation evidence/assets and fails before replacement on mismatch; assets land in `public/data/transparency-in-coverage/` | Exporter: `pipelines/.../transparency_in_coverage_pipeline_impl/public_assets_export.py` + CLI wiring; refuses non-ancestor commits and byte-mismatched inputs; four new offline tests (52/52 suite). Real export against `b69ad4f` produced 12,183 facts / 15 codes. Import verified manifest + every hash/count/byte size, wrote `public/data/transparency-in-coverage/` with `release.json`; negative tests: corrupted payload and wrong expected release both refused with exit 1 before replacement. |
| Per-code asset reconciliation | done | Exporter proves the declared projection against every source fact; importer verifies every manifest hash/count/byte size and its copied files; total and per-code sizes meet the stated payload budget | Exporter reconciles all 12,183 projections back to source facts (field equality, shared-metadata constancy, no extra fields) and re-verifies written bytes against the manifest; importer re-verifies all fifteen SHA-256/byte/row declarations. Payload (gzip -9, bytes): 45378 18,693; 70450 25,376; 70553 25,697; 72148 29,038; 74177 34,224; 77067 58,268; 80048 14,926; 80053 20,982; 80061 24,274; 81003 23,314; 84443 16,777; 85025 21,197; 99203 99,539; 99204 99,864; 99205 86,578 — max 97.5 KiB vs 256 KiB cap; max uncompressed 913,059 B (99203) vs 1 MiB cap. |
| Lab page: annotated 99204 record + table + selector | done | Page renders all fifteen codes from checked-in assets only; caveat block present beside every visual; no-JS render of the annotated record, count, caveats, and table excerpt; normal per-code route links provide the selector fallback | MDX entry + `TicRateLab` components + `[code].astro` per-code routes (15 static routes built). Zero client JavaScript is emitted (`grep "<script"` on built route = 0), so the entire page — annotated record, counts, caveats, 40-row excerpt, selector — is the no-JS render; the selector is plain links. Default route payload: HTML 15,647 B + CSS 2,892 B gzip ≈ 18.1 KiB vs 512 KiB budget; it requests no code data files at all (data is server-rendered; only anchor hrefs point at 99204.json/release.json). |
| Optional strip plot (one dot = one retained fact) | in-progress | Reviewed before inclusion; faceted or labeled so negotiated types and billing classes are never silently mixed | Implemented as build-time SVG, faceted by billing class × negotiated type with per-facet counts (99204: professional·fee schedule 1,978 + institutional·fee schedule 16 = 1,994 ✓; 77067 renders three facets, 1,191 dots ✓), $0-anchored axis, deterministic fact_key jitter. **Awaiting Siew's review at the publish gate** — remove or keep is his call. |
| Displayed-record reconciliation | done | Machine reconciliation proves every exported field against every contract fact; sampled browser checks across codes prove the rendered values use those checked-in assets without transformation | Machine chain: exporter full-row reconciliation + importer hash verification + build-time row-count asserts in `src/lib/tic-pricing-slice.ts`. Sampled browser checks (built site, preview server): 99204, 45378, 77067 — first rendered table row and annotated amount equal the checked-in asset's first fact in fact_key order; facet counts sum to asset row counts; selector marks the current code. |
| Claims-wording, accessibility, and mobile review | in-progress | Exact public text reviewed by Siew; keyboard/screen-reader pass; mobile layout checked | Agent-side pass done: no JS so all interaction is native links; table excerpt is a labeled focusable scroll region (`tabindex=0`, `role=region`, `aria-label`); strip-plot SVG has `role=img` + full text alternative and facet counts also appear as text; single h1 per page; mobile 375px verified with no horizontal body scroll and working overflow container. **Siew's review of the exact public claim text is pending** (see analysis brief). |
| Publish gate + closeout | pending | `pnpm run check`, `pnpm run build`, local browser smoke on the feature branch; Siew approves the finished artifact at the merge-to-`main` trigger (the push deploys); 006 marked superseded | `pnpm run check` 0 errors; `pnpm run build` 27 pages; browser smoke on the built site passed (parent + per-code routes + labs listing card). Work is on branch `feature/007-tic-anatomy-lab`; merge/deploy awaits Siew. 006 already marked superseded at activation. |

## Validation Commands

Run commands from the repo root once this plan is implemented.

```sh
pnpm run check
pnpm run build

# regenerate + re-verify the pinned assets (exporter runs in the pipelines repo):
(cd ../pipelines && .venv-data/bin/python domains/transparency-in-coverage/scripts/transparency_in_coverage_pipeline.py \
  export-pricing-slice-v0-public-assets \
  --release-commit b69ad4fd10fb128af66ffe48768c8a7f115b4d16 \
  --output-dir /tmp/tic-export-package)
node scripts/import-tic-pricing-slice-v0.mjs --input /tmp/tic-export-package \
  --expected-release b69ad4fd10fb128af66ffe48768c8a7f115b4d16

# exporter tests (offline):
(cd ../pipelines && env -u SWVENTURE_STAGE_VOLUME .venv-data/bin/python \
  domains/transparency-in-coverage/tests/test_transparency_in_coverage_pipeline.py)

# payload budget (per-code compressed sizes):
for f in dist/data/transparency-in-coverage/codes/*.json; do echo "$f $(gzip -9c "$f" | wc -c)"; done
gzip -9c dist/labs/anatomy-of-a-published-healthcare-rate/index.html | wc -c
```

## Deploy / Operational Gate

Merging to `main` is the publish trigger — the Pages workflow deploys every `main` push, and lab routes render entries regardless of `draft` status. Before that merge:

- Displayed records reconcile to the contract slice exactly, across every row.
- The exact claim wording is human-reviewed; no claim exceeds the contract's boundary.
- Assets are compact, checked in, pinned to a pipeline release commit with verified content hashes, and expose no raw bulk source data; the build has no external dependency.
- The no-JavaScript render and the initial-load payload budget pass.
- Caveats make clear this is not consumer medical or purchasing advice and not a current-price claim.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-08-30 | Capture the converged consumer path as this plan; supersede 006's discovery goal | The pipeline completed discovery through a first public contract; the open P1 follow-up is consumer implementation |
| 2026-08-30 | Anatomy-of-a-record framing over a price-distribution story | The contract excludes comparisons; mixed types/classes and omitted modifiers make a spread story unsupportable; the educational framing turns missing context into content |
| 2026-08-30 | Apply Codex review amendments C1–C3 (verified: deploy workflow triggers on `main` pushes; lab routes have no status filter) | Concrete exporter/import ownership with an immutable release pin, no-JS and payload-budget acceptance, and the merge-to-`main` publish trigger make the plan executable without changing product direction or the claims boundary |
| 2026-08-30 | Apply release-readiness review corrections | Pin the completed repair to `a7c6c80`, require that it be reachable from `origin/main`, and define the export/import schema, exact reconciliation boundary, no-JavaScript route fallback, and measurable payload limits before implementation |
| 2026-08-30 | Re-pin the release to `b69ad4f` | `a7c6c80` was amended (message-only; `git diff` between the two commits is empty) into `b69ad4fd10fb128af66ffe48768c8a7f115b4d16`, which is pushed and reachable from `origin/main`; the old hash is orphaned and can never satisfy the reachability gate |
| 2026-08-30 | Activate 007 | Siew directed activation after the re-pinned release and reachability gate were independently verified. |
| 2026-08-30 | Analysis brief lives in new `docs/analysis/` | The brief is a review artifact, not a plan or decision record; a small `analysis/` home keeps the exec-plans index clean while staying inside `docs/` |
| 2026-08-30 | Ship the lab with zero client JavaScript | All 15 routes are fully server-rendered from checked-in assets; the selector is plain links to static per-code routes, so the no-JS acceptance and payload budget are met structurally (default route ≈ 18.1 KiB gzip, no data fetches) rather than by code-splitting discipline |
| 2026-08-30 | Site data loading uses `import.meta.glob` over the checked-in assets, not `node:fs` | Keeps the build free of Node API typing needs (a pnpm store mismatch blocked adding `@types/node`) and makes "build reads only checked-in assets" enforceable in the module graph |
| 2026-08-30 | Table and per-code arrays display in `fact_key` order, never amount order | Deterministic source-keyed ordering cannot read as a ranking, keeping the inspectable table inside the contract's no-comparison boundary (recorded in the analysis brief's display rules) |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| Retire plan 006 formally when this plan activates | Plan creation | blocks-current-plan | P2 | This plan's activation step | done — 2026-08-30 |
| Reader-facing explainer on how TiC files are produced (background essay) | Anatomy framing | nice-to-have | P3 | Content backlog | open |
| Push the pipelines exporter commit (exporter + tests, committed locally on `pipelines` `main` after `b69ad4f`) to `origin/main` | Exporter implementation 2026-08-30 | needed-before-prod | P2 | Siew: `git push` in `pipelines` after reviewing the commit | open |
| `pnpm add` fails in this repo with a pnpm store-location mismatch (node_modules installed from a different store than pnpm 11.1.2 now uses) | Tooling friction during implementation | tech-debt | P3 | tech-debt-tracker or a fresh `pnpm install` after store config decision | open |

## Audit Notes

| Date | Reviewer | Verdict | Notes |
| --- | --- | --- | --- |
| 2026-08-30 | Codex (model ID not exposed); Codex desktop with independent consumer-plan review | amendments-required | Anatomy framing, claims boundary, 99204 default, and pipeline dependency are sound; specify the export/import handoff and execution acceptance below. |
| 2026-08-30 | Codex / GPT-5.6 Sol | corrections applied; remote release still blocks activation | Replaced stale repair references; pinned the release, defined export/import fields and verification, made reconciliation and payload criteria testable, and recorded the no-JavaScript route fallback. |

### 2026-08-30 captured-plan review

- **C1 — export/import ownership and release pin (P2):** Name the bounded exporter in `pipelines`, the import/reconciliation step, and the reviewed destination `public/data/transparency-in-coverage/` in this repo. Declare these limited cross-repo changes under this consumer plan; the repair plan does not supply an exporter. Pin the import to a pipeline release commit plus content hashes of the slice/header/validation evidence and generated assets, not merely the reusable `v0` label. Fail import on mismatch. The site build must use only its committed local assets, with no sibling checkout, stage volume, or source-network dependency.
- **C2 — first-page acceptance:** Add a JavaScript-disabled check for the annotated 99204 record, count, explanation, caveats, and readable table excerpt; define the selector fallback. Record an initial-load/per-code payload budget so splitting the data cannot still cause all fifteen chunks to be fetched on first load. Keep exact asset reconciliation across every row; sampled browser checks supplement it.
- **C3 — review before the actual publish trigger:** Call the initial analysis brief a repository review artifact, not a separately published deliverable. Keep the page on a local/feature branch until the finished artifact is approved. The existing GitHub Pages workflow deploys pushes to `main`, and lab routes include all entries regardless of a `draft` label. Apply the existing publication approval at that trigger; no new deployment system is needed.

Review scope: repository reads, cross-plan consistency, route/workflow inspection, and link/whitespace validation only. These are proposed amendments; this review does not activate 007, retire 006, or authorize publication.

## Closeout

Final validation:

- Command:
- Result:
- Evidence:

Follow-ups transferred:

- Item:
- Destination:
- Priority:

Residual risk:

-
