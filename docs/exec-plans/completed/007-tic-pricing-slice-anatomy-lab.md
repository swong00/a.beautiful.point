# 007 - TiC Pricing Slice Anatomy Lab

Status: completed
Domain: labs
Priority: P1
Created: 2026-08-30
Last updated: 2026-08-30
Owner/driver: mixed
Branch: `feature/007-tic-anatomy-lab` merged to `main` at `faad44734fe28ce531c23deecd22666f826c79c2`
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

- **Published 2026-08-30:** [Anatomy of a Published Healthcare Rate](https://abeautifulpoint.com/labs/anatomy-of-a-published-healthcare-rate/), including the approved strip plot and fifteen per-code routes. The content status is `ready`.
- Siew approved the reviewed wording, strip plot, commits, pushes, merge, and publication in this task: "approve, push, merge and publish". All review findings, including R1a/R3a, are closed.
- Pipeline main includes exporter implementation `34f42f7`, safety repair `7d96342`, and final repair `3b046a803a61727038653cbc69848a45f45aaf18`; all were pushed. The data release remains pinned to `b69ad4fd10fb128af66ffe48768c8a7f115b4d16`.
- Site feature branch was pushed and merged into main at `faad44734fe28ce531c23deecd22666f826c79c2`. [GitHub Pages run 33359164922](https://github.com/swong00/a.beautiful.point/actions/runs/33359164922) passed build and deployment.
- GitHub rejected the first site pushes under email privacy protection. Only unpublished author/committer email metadata was replaced with the account's GitHub noreply address; trees, messages, attribution, and dates were preserved. Hash mapping: `136579c` → `d25ed15`, `35c27b6` → `7799789`, `3f6fcee` → `9e459e3`, unpublished merge `534f736` → `faad447`. The original local refs remain under `codex/pre-email-privacy-*`; no remote history was force-pushed and no privacy protection was disabled.
- Final validation: pipeline offline suite **57/57**; Astro check **0 errors/warnings/hints**; build **27 pages**; **640/640** table rows and all dot counts reconciled; public data unchanged; zero client JavaScript.
- Live validation: **33/33** URLs returned HTTP **200** and matched the built bytes exactly (16 lab routes, labs index, manifest, 15 code files). Browser verified the default record, 70450 sentinel, 77067 facets, normal navigation, 375px mobile layout, and no captured errors.
- Plan 006 is superseded. No implementation or publication blocker remains. Native screen-reader acceptance was not performed; this validation limit and the intentionally deferred work remain recorded below.
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
| Analysis brief with claims boundary (repository review artifact) | done | Brief states reader question, permitted claims, forbidden claims; reviewed in-repo | [docs/analysis/007-tic-anatomy-lab-claims-brief.md](../../analysis/007-tic-anatomy-lab-claims-brief.md): reader question, five permitted claim classes, seven forbidden classes, and display rules (fact_key ordering, faceting, caveat adjacency). Siew approved the reviewed wording on 2026-08-30. |
| Exporter in `pipelines` + pinned import | done | `export-pricing-slice-v0-public-assets` and `scripts/import-tic-pricing-slice-v0.mjs` implement the Export / Import Contract; import records release commit + SHA-256 hashes of slice/header/validation evidence/assets and fails before replacement on mismatch; assets land in `public/data/transparency-in-coverage/` | Original happy-path/refusal evidence plus R1+R3 repairs, and the R1a/R3a repairs closing the re-review. **R1a**: previous-package recognition now requires the exact shape the exporter writes — top-level entries exactly `manifest.json` + `codes/`, and `codes/` holding exactly the fifteen contract filenames as regular files — so an added `codes/review-notes.json` makes the destination unrecognized and the re-export refuses (live: file survives, exit 1); legitimate re-export still lands 15/15 byte-identical. **R3a**: the trusted descriptor now carries the full `source_metadata` block plus each source's `path` (and the slice `row_count`), compared by canonical value; the reproduced payer/reporting-month/source-URL mutation exits 1 before replacement. **R1**: exporter now refuses any `--output-dir` inside the pipeline repository, containing a protected input, or holding anything but a recognizable previous export package, and preserves the previous package until the new one lands (rename-swap with restore-on-failure); live refusal reproduced against `public-contract` with inputs untouched; three new tests (suite 55/55). **R3**: importer embeds a trusted release descriptor (source trio hashed independently via `git show b69ad4f:… \| shasum`; per-code hashes pinned from the independently reconciled assets) and refuses manifests disagreeing with it; both reproduced attacks — fabricated source hash/negative byte size, and altered amount with self-consistent updated manifest hash — now exit 1 before replacement; happy path re-imports byte-identically (git shows no asset diff). |
| Per-code asset reconciliation | done | Exporter proves the declared projection against every source fact; importer verifies every manifest hash/count/byte size and its copied files; total and per-code sizes meet the stated payload budget | Exporter reconciles all 12,183 projections back to source facts (field equality, shared-metadata constancy, no extra fields) and re-verifies written bytes against the manifest; importer re-verifies all fifteen SHA-256/byte/row declarations. Payload (gzip -9, bytes): 45378 18,693; 70450 25,376; 70553 25,697; 72148 29,038; 74177 34,224; 77067 58,268; 80048 14,926; 80053 20,982; 80061 24,274; 81003 23,314; 84443 16,777; 85025 21,197; 99203 99,539; 99204 99,864; 99205 86,578 — max 97.5 KiB vs 256 KiB cap; max uncompressed 913,059 B (99203) vs 1 MiB cap. |
| Lab page: annotated 99204 record + table + selector | done | Page renders all fifteen codes from checked-in assets only; caveat block present beside every visual; no-JS render of the annotated record, count, caveats, and table excerpt; normal per-code route links provide the selector fallback | MDX entry + `TicRateLab` components + `[code].astro` per-code routes (15 static routes built). Zero client JavaScript is emitted (`grep "<script"` on built route = 0), so the entire page — annotated record, counts, caveats, 40-row excerpt, selector — is the no-JS render; the selector is plain links. Default route payload after R2/R4–R6 repairs: HTML 15,638 B + CSS 2,963 B gzip ≈ 18.2 KiB vs 512 KiB budget; it requests no code data files at all (data is server-rendered; only anchor hrefs point at 99204.json/release.json). **R2** repaired: the MDX introduction and caveat block now attribute the missing modifier/setting/plan context to this bounded slice (noting the CMS format can carry it) and keep the source-schema currency caveat separate. **R4** repaired: `CSTM-00` renders verbatim with a sentinel explanation, an empty list renders as "none published", and counted lists use correct singular/plural. |
| Optional strip plot (one dot = one retained fact) | done | Reviewed before inclusion; faceted or labeled so negotiated types and billing classes are never silently mixed | Implemented as build-time SVG dots faceted by billing class × negotiated type (99204: 1,978 + 16 = 1,994 ✓; 77067 three facets, 1,191 dots ✓), $0-anchored axis, deterministic fact_key jitter. **R5** repaired: facet and axis labels are HTML text at fixed size (measured ≈11.5–11.8 CSS px at a 375 px viewport, was ≈4.8 px scaled SVG text); dot SVGs are `aria-hidden` decoration with the information carried by the labels and figcaption. **R6** repaired: the figcaption names the $0–max scale explicitly as "the axis range, not observed amounts"; no accessible text claims observed endpoints. **Approved by Siew on 2026-08-30; retain the reviewed strip plot.** |
| Displayed-record reconciliation | done | Machine reconciliation proves every exported field against every contract fact; sampled browser checks across codes prove the rendered values use those checked-in assets without transformation | Machine chain: exporter full-row reconciliation + importer hash verification + build-time row-count asserts in `src/lib/tic-pricing-slice.ts`. Sampled browser checks (built site, preview server): 99204, 45378, 77067 — first rendered table row and annotated amount equal the checked-in asset's first fact in fact_key order; facet counts sum to asset row counts; selector marks the current code. |
| Claims-wording, accessibility, and mobile review | done | Exact public text reviewed by Siew; keyboard/screen-reader pass; mobile layout checked | Agent-side pass done and redone after R5/R6: no JS so all interaction is native links; table excerpt is a labeled focusable scroll region (`tabindex=0`, `role=region`, `aria-label`); strip-plot information lives in HTML facet labels + figcaption (dot SVGs `aria-hidden`); single h1 per page; mobile 375 px re-verified after the label repair — no horizontal body scroll, plot labels legible, last axis tick contained. Note: this is DOM/keyboard/visual inspection, not a native screen-reader acceptance pass. **Siew approved the reviewed public text and publication on 2026-08-30** (see analysis brief); the documented native screen-reader validation limitation remains explicit. |
| Publish gate + closeout | done | `pnpm run check`, `pnpm run build`, local browser smoke on the feature branch; Siew approves the finished artifact at the merge-to-`main` trigger (the push deploys); 006 marked superseded | `pnpm run check` 0 errors; `pnpm run build` 27 pages; browser smoke on the built site passed (parent + per-code routes + labs listing card). Work is on branch `feature/007-tic-anatomy-lab`; Siew approved merge/publication on 2026-08-30. Merged at `faad447`; GitHub Pages run `33359164922` succeeded; all 33 live routes/assets match the built bytes and browser checks pass. 006 already marked superseded at activation. |

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
| 2026-08-30 | Independent review keeps 007 active and reopens exporter/import validation; no publication approval inferred | Correct checked-in data and passing builds do not resolve the reproduced safety, provenance-checking, claim-text, and accessibility defects. Implementation fixes and subsequent human review remain separate from this review. |
| 2026-08-30 | Repair R1–R6 in place rather than descoping (e.g. not dropping the strip plot to avoid R5/R6) | Every finding had a bounded fix inside the declared contract: destination safety and a trusted release descriptor strengthen the existing safeguards without changing the package format; wording and sentinel fixes correct claims without changing the claims boundary; HTML labels fix readability without adding client JavaScript. Keep/drop on the plot itself stays Siew's call. |
| 2026-08-30 | Importer's trusted descriptor pins per-code hashes from the independently reconciled committed assets, source hashes from `git show` at the release | The exporter's serialization is byte-deterministic per release, and the 2026-08-30 independent review reconciled all 12,183 facts and every hash, so today's values are a sound trust anchor; a future release requires adding its independently computed descriptor, which is the intended friction. |
| 2026-08-30 | Repair re-review closes R2/R4/R5/R6 but keeps exporter/import validation open for R1a/R3a | Original failure cases now pass and data is unchanged; the remaining risks are narrower P2 gaps in nested-file protection and shared-metadata integrity. No publication approval or code changes are implied by this review. |
| 2026-08-30 | Close R1a by recognizing only the exporter's exact output shape, rather than allowing a filename pattern under `codes/` | Recognition authorizes deletion, so it should describe precisely what this exporter writes and nothing more. Refusing an unrecognized destination is a safe failure the operator can resolve by hand; deleting a file the exporter never wrote is not. Legitimate re-export is unaffected because exports are written atomically and always carry all fifteen files. |
| 2026-08-30 | Close R3a by pinning the whole `source_metadata` block (plus source paths) rather than a canonical manifest digest | The page's public lineage claims come from these values and appear in no hashed payload, while `generated_at` must stay variable; pinning the stable block directly names which field disagrees in the refusal message, where a whole-manifest digest would only say the manifest changed. Values were read back out of the release slice, not copied from the manifest under test. |
| 2026-08-30 | Independent review accepts R1a/R3a closure and deliberate refusal of incomplete export packages | Live reproductions now preserve unexpected/incomplete packages, legitimate export/re-export succeeds, and metadata/path mutations refuse before import replacement. An operator can use a fresh output directory for recovery; no relaxation of destination safety is needed. |
| 2026-08-30 | Siew approves the reviewed artifact, retains the strip plot, and directs commit/push/merge/publication | Explicit user instruction after closure of all review findings: "approve, push, merge and publish". Mark the lab ready and use the existing GitHub Pages workflow; no hosting migration or new infrastructure. |
| 2026-08-30 | Publish the approved artifact through existing GitHub Pages and close 007 after live reconciliation | The site merge deployed successfully; all 33 live routes/assets match the validated build. Preserve the data release pin and transfer non-blocking tooling follow-ups. |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| Retire plan 006 formally when this plan activates | Plan creation | blocks-current-plan | P2 | This plan's activation step | done — 2026-08-30 |
| Reader-facing explainer on how TiC files are produced (background essay) | Anatomy framing | nice-to-have | P3 | Future content backlog if prioritized | intentionally deferred — independent of the published anatomy lab |
| Push the pipelines exporter commits to `origin/main` | Exporter implementation 2026-08-30 | needed-before-prod | P2 | Pipeline main | done — 2026-08-30, remote main includes `34f42f7`, `7d96342`, and `3b046a8` |
| `pnpm add` fails in this repo with a pnpm store-location mismatch (node_modules installed from a different store than pnpm 11.1.2 now uses) | Tooling friction during implementation | tech-debt | P3 | [tech-debt-tracker](../tech-debt-tracker.md) | transferred — existing check/build and clean CI installation pass |
| R1: reject exporter destinations that contain protected inputs or unrelated files; preserve previous output on replacement failure | Independent implementation review | blocks-current-plan | P2 | This plan's bounded pipeline exporter change | done — 2026-08-30 (P1 protection/rollback verified; R1a closed by restricting recognition to the fifteen expected code files) |
| R2: distinguish omissions in this slice from limitations of the source format | Independent implementation review | blocks-current-plan | P1 | MDX introduction and shared caveat block | done — 2026-08-30 (intro + caveat reworded to slice omissions vs format capability) |
| R3: anchor importer source/asset hashes to trusted release expectations | Independent implementation review | blocks-current-plan | P2 | Pinned importer and focused negative validation | done — 2026-08-30 (original tamper cases refused; R3a closed by pinning the full `source_metadata` and source path declarations) |
| R4: preserve/explain `CSTM-00` and missing service-code context instead of treating array length as service coverage | Independent implementation review | blocks-current-plan | P2 | Annotated record | done — 2026-08-30 (sentinel verbatim + explanation; empty list = "none published") |
| R5–R6: make strip-plot labels readable on mobile and stop describing axis endpoints as observed amounts | Independent implementation review | blocks-current-plan | P2 | Optional strip plot; remove if human review drops it | done — 2026-08-30 (HTML labels ≈11.5–11.8 px at 375 px; figcaption names axis range as axis limits) |
| Pages workflow warns that `actions/configure-pages@v5` and `pnpm/action-setup@v4` target the deprecated Node 20 action runtime, currently forced to Node 24 | Successful publication run 33359164922 | tech-debt | P3 | [tech-debt-tracker](../tech-debt-tracker.md) | transferred — warning only; both build and deployment succeed |

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

### 2026-08-30 implementation review of Claude Fable's commits

Scope: site commit `136579c86f212396cd3ff5c86371e01f6428c599` and pipeline exporter commit `34f42f7a0ba4888359c45bddf98e828d5fe06830`. Codex reviewed the consumer and browser; an independent bounded subagent reviewed the exporter under the pipeline repository's parallel-review guidance. No implementation, approved data, or pipeline working-tree files changed. No push, merge, deployment, or vault write was performed.

Verdict: **[FAIL] keep active; repair R1–R6 before publication review.**

- **R1 [FAIL, P1] — destructive exporter destination.** `public_assets_export.py:320–322` recursively deletes any existing `--output-dir` before renaming staging, without excluding directories containing its slice/header/report or unrelated files. An isolated synthetic fixture with the pin checks mocked and `output_dir=public-contract` returned no blockers while deleting the three input files and README. A separate injected final-rename failure also discarded the previous export package. Resolve and validate destination paths before writing; refuse protected-input ancestors/unrecognized existing directories and preserve prior output on failure.
- **R2 [FAIL, P1] — source-format claim is false.** The MDX introduction (`:31–35`) says the file format leaves out modifiers, setting, and plan attribution; `TicCaveatBlock.astro:31–34` calls the missing context a source-design decision. These are different from this slice's omissions. The retained stage contains **3,625/12,183** rows with nonempty `billing_code_modifier`, and the public contract says plan observations were not loaded. The [CMS schema documentation](https://github.com/CMSgov/price-transparency-guide/blob/master/schemas/in-network-rates/README.md) supports modifier, setting, and plan context. Reword the argument and shared caveat around what this bounded slice retains or omits; preserve the separate source-stated-currency caveat.
- **R3 [FAIL, P2] — the importer does not verify immutable content expectations.** `scripts/import-tic-pricing-slice-v0.mjs:83–92` compares the release string, then checks only the *shape* of source hashes and that byte sizes are integers. In a temporary copy of the importer/site, an all-zero source SHA-256 and a negative source byte size imported successfully under the correct release. A changed amount with an updated self-declared asset hash/size also imported under the unchanged release/source pins. Existing asset hashes protect against payload-only corruption, not a mismatched manifest. Anchor source and generated-asset declarations to a separately trusted release descriptor or manifest digest; refuse discrepancies before replacement. **Current committed hashes and data are correct**, independently reconciled below.
- **R4 [FAIL, P2] — service-code sentinel becomes a false count.** `TicRateAnatomy.astro:51–54` renders only `service_codes.length`. For 70450 (also 70553, 72148, 74177, 80053, 80061, 81003, 84443, 85025), the annotated fact has `["CSTM-00"]` but the page says “1 place-of-service codes.” CMS defines that sentinel as all service codes, not one setting. Render the raw context with a sentinel explanation, and distinguish an empty array from zero possible settings.
- **R5 [FAIL, P2] — mobile facet/axis text is unreadable.** `TicRateStripPlot.astro:151–160` scales a 700-unit SVG to 302.625 CSS pixels at a 375-pixel viewport. Its 11-unit facet/axis labels therefore render at approximately **4.76 CSS pixels**; the mobile screenshot confirms the tiny labels. This makes the billing-class/type distinctions unavailable to an ordinary mobile reader. Keep labels readable through a responsive layout or an accessible scroller, or remove the optional plot.
- **R6 [FAIL, P2] — accessible chart text invents an observed range.** `TicRateStripPlot.astro:83` says the amounts span zero to `axisMax`, which is a rounded display bound. For 99204 it announces `$0` to `$800`, although neither endpoint is present in the facts. Describe these as axis limits, or omit the limits; do not turn chart padding into a retained-fact claim. This is separate from the human decision about whether to keep the plot.

Validation re-run:

- `pnpm run check` (documented Node/pnpm PATH): **0 errors, 0 warnings, 0 hints**. `pnpm run build`: **27 static pages**.
- Pipeline doctor: ready. Offline suite: **52/52 pass**, with existing SQLite resource warnings. Fresh export to a unique temporary output: **15/15 code files byte-identical** to committed assets; manifest identical except `generated_at`.
- Independent source-to-consumer comparison: **all 12,183 nine-field projections exact**; each code's row count, SHA-256 and byte size match; all three source-file hashes/sizes match the release files. No amount requires precision beyond two decimal places.
- Independent built-HTML inspection: **16 lab routes**, **640/640 displayed table rows exact**, all dot counts equal their corresponding code counts, **zero script tags**. This supplements full data reconciliation rather than substituting browser sampling for it.
- Importer in a disposable site copy: valid import succeeds with byte-identical output; wrong release and corrupted payload each exit **1**, leaving the destination untouched. R3's two malformed-but-self-consistent manifest cases exit **0**; no actual site data was altered.
- Browser against built preview: parent 99204 and selected 70450/45378/77067 routes render and navigate; sampled first rows and facet counts match assets; no captured browser errors. At **375 × 812**, body width is **375** and table overflow remains within its focusable region (**341px client / 672px content**). The plot fails readability as R5 describes. This was DOM/keyboard/visual inspection, **not a native screen-reader acceptance pass**. Temporary viewport override reset.
- Payload reproduced with `gzip -9c`: HTML **15,647 B**; linked CSS **1,710 + 1,182 B**; total **18,539 B** (approximately **18.1 KiB**), no script/image/data autoload. All fifteen per-code compressed sizes match the implementation evidence above; maximum **99,864 B** compressed and **913,059 B** uncompressed, within both limits.
- `git ls-remote origin refs/heads/main` in `pipelines`: remote main is **b69ad4fd10fb128af66ffe48768c8a7f115b4d16**. Reachability passes; `34f42f7` remains local-only. No export push or site merge was authorized by this review.

Non-blocking review notes: the approved anatomy framing, static-only build boundary, exact current data, plain-link selector, and payload claims hold. Human approval of final claim wording and plot inclusion remains pending. The earlier “accessibility/mobile pass” is insufficient while R5–R6 remain open.

### 2026-08-30 independent re-review of the repair commits

Scope: site `35c27b6` and pipelines `7d96342495c66d34cfb976b8ca43e4c04cb432e0`, compared with the reviewed implementations. Consumer/importer/browser review by Codex; bounded independent exporter re-review under the pipeline repository's parallel-review guidance. Repository changes from this review are limited to this plan and its index; no code, data, push, merge, or vault changes.

Verdict: **[FAIL] two narrower P2 gaps remain in R1/R3.** The original reproductions now pass. **R2, R4, R5, and R6 are verified closed**; final human wording/plot approval and publication remain separate gates.

- **R1a [FAIL, P2] — undeclared nested JSON is still deleted.** In `public_assets_export.py:116–118`, previous-package recognition accepts any alphanumeric `.json` filename under `codes/`. Starting from a genuine fresh export, adding `codes/review-notes.json` and exporting again returns no blockers and silently deletes the added file. Restrict existing code files to the supported fifteen filenames (and/or validated prior-manifest declarations) before replacing the directory. The original P1 protected-input/ancestor/symlink safeguards and final-rename rollback now work; this finding concerns only the remaining unrelated-file loophole.
- **R3a [FAIL, P2] — shared source metadata remains outside the trusted descriptor.** In `scripts/import-tic-pricing-slice-v0.mjs:149–153`, the only metadata check is that `source_files` is a nonempty array. With all pinned source/code hashes, sizes, counts, and release ID unchanged, a disposable package altered to `payer: "WRONG PAYER"`, `reporting_month: "2099-01"`, and one unrelated source-file URL imports with exit **0** and reports the release verified. These values are copied into `release.json`; `TicRateAnatomy.astro:18–22` and `TicCaveatBlock.astro` trust them for the public source lineage and time boundary. Pin the complete stable `source_metadata` and source-path declarations, or compare a canonical stable manifest digest (excluding only intentionally variable fields such as generation time). Add metadata-only refusal validation. The current committed metadata is correct; the original fabricated-source-hash and altered-amount cases now both refuse before replacement.

Re-review evidence:

- `pnpm run check`: **0 errors, 0 warnings, 0 hints**. `pnpm run build`: **27 pages**. Pipeline doctor: ready; offline tests: **55/55 pass**.
- Real pipeline export and re-export: **15/15 code files byte-identical** to checked-in assets. Source files remain unchanged. Protected-input ancestors, repository destinations, symlinks into the repository, existing files, and unrelated `.txt` content are refused. An injected final-rename `OSError` restores the previous package byte-for-byte with no staging/backup leftovers. The additional nested-JSON case reproduces R1a.
- Importer in a temporary site copy: valid import succeeds byte-identically; unknown release, original fabricated source hash/negative size, and original changed-amount/rehashed-manifest cases each exit **1**, preserving the destination. Metadata-only mutation exits **0**, reproducing R3a. No negative test changed this repository's assets.
- All three source hashes/sizes checked against `git show b69ad4f:<path>`; every code hash/size/count matches committed `release.json`; **12,183 facts** remain byte-identical to the previously reconciled assets (`git diff 136579c HEAD -- public/data/transparency-in-coverage` is empty). All **640/640** table rows across **16** lab routes match, all dot counts match, and every route has zero script tags.
- Browser at **375 × 812**: default 99204 labels measure **11.84px** (facets) and **11.52px** (axis), visually readable; body width **375px**, last tick contained. HTML caption correctly identifies display-axis limits; facet labels remain accessible text. 70450 displays `CSTM-00` with its explanation; 45378 displays the absent-list explanation; 77067's three facets sum to **1,191**. Revised slice-versus-format wording is rendered in the introduction and caveat. No captured browser errors. Temporary viewport reset. Native screen-reader acceptance was not performed.
- Default route `gzip -9c`: HTML **15,638 B**, CSS **2,963 B**, total **18,601 B** (approximately **18.2 KiB**). Data assets and their previously measured payload sizes are unchanged.
- Live `git ls-remote` confirms pipeline remote main remains **b69ad4f**; exporter commits **34f42f7** and **7d96342** remain local-only. Both repositories were clean before this review's plan/index edits; whitespace validation passes.

### 2026-08-30 R1a/R3a repairs

Scope: the two P2 gaps left open by the repair re-review. Changes are limited to `public_assets_export.py`, its test module, `scripts/import-tic-pricing-slice-v0.mjs`, and this plan/index. No approved data, no push, no merge.

- **R1a [closed] — recognition narrowed to the exporter's exact output shape.** `_is_previous_export_package` previously accepted any `[0-9A-Za-z-]+\.json` name under `codes/` and tolerated a missing `codes/` directory. It now requires top-level entries to be exactly `manifest.json` and `codes/`, and `codes/` to hold exactly the fifteen `PUBLIC_ASSETS_CONTRACT_CODES` filenames as regular files. Anything else leaves the destination unrecognized, so the existing destination check refuses instead of deleting.
- **R3a [closed] — stable source metadata pinned.** `RELEASE_PINS` now carries the release's complete `source_metadata` (the eleven fields constant across all facts plus the eight sorted `source_file_path` URLs) and each source's `path`/`row_count`; the importer compares them by canonical value, so key order alone never reads as tampering while array order stays significant. Refusals name the differing fields. Pinned values were read back out of the release slice (`git show b69ad4f:<slice path>`), not copied from the manifest under test; each pinned source hash/size was re-confirmed to belong to its pinned path at that commit.

Repair evidence:

- Pipelines offline suite: **57/57 pass** (55 prior + two new exporter tests). Both new tests were run against the pre-repair exporter and **fail** there, confirming they cover the reported defect rather than the new code.
- Live exporter: fresh export writes **15/15 code files byte-identical** to the checked-in assets; re-export over that genuine package succeeds unchanged; adding `codes/review-notes.json` and re-exporting now exits **1** with "not a previous export package", and the added file **survives** with the package intact (16 files under `codes/`). Removing a contract code file is likewise refused.
- Importer negative validation against a package rebuilt from the committed assets: the re-review's exact mutation (`payer`, `reporting_month`, and source URLs, all hashes intact) exits **1**, naming `payer, reporting_month, source_files`; `geography`-only, single-URL, added-field, and removed-`source_metadata` cases each exit **1**; rewritten source `path` or slice `row_count` each exit **1**. A manifest with identical values but reordered keys correctly succeeds. Every refusal happens before replacement.
- Happy path re-imports byte-identically (`git status` on `public/data/transparency-in-coverage/` is empty after every run). `pnpm run check`: **0 errors, 0 warnings, 0 hints**; `pnpm run build`: **27 pages**. Rebuilt site still renders **640/640** table rows across **16** lab routes with **zero** script tags and the unchanged Cigna / 2026-07 lineage text.

### 2026-08-30 independent closure review of R1a/R3a

Scope: Claude's uncommitted importer, exporter, and exporter-test changes atop site `35c27b6` and pipelines `7d96342`. Codex independently reviewed the importer and site output; the bounded exporter re-review followed pipeline parallel-review guidance. Existing uncommitted edits were preserved. This review added only plan/index documentation.

Verdict: **[PASS] R1a and R3a closed; no new blocking findings in the repair scope.** R2/R4/R5/R6 remain closed from the prior browser review; frontend source and public data are unchanged. Plan stays active for the existing human wording/plot and publication gates. The latest fixes still need committing in both repositories.

- **R1a:** offline pipeline suite **57/57 passes** (existing SQLite resource warnings only). Live export and legitimate re-export succeed with **15/15** byte-identical code assets. Adding `codes/review-notes.json` to a genuine package now exits **1**, preserving every file byte-for-byte. Removing `codes/45378.json` also exits **1**, preserving the remaining files. Success/refusal paths leave no temporary directories. Refusal of incomplete packages is accepted as the intended safe behavior; exporting to a fresh directory remains available.
- **R3a:** independent disposable-site validation ran **23 cases**: normal import succeeds byte-identically; metadata key reordering succeeds without changing values; **21 negative cases exit 1 before replacement and preserve the destination**. Cases cover the exact payer/month/URL reproduction, independent changes to each of the twelve metadata entries, missing metadata, an added non-null metadata field, all three source paths, slice row count, the original fabricated source hash/size, and rehashed altered amounts. Metadata values were independently compared against **all 12,183 release facts** read with `git show`; the eight source URLs and all source paths/hashes/sizes match the pinned release.
- Site validation: `pnpm run check` **0 errors/warnings/hints**; `pnpm run build` **27 pages**. Independent HTML reconciliation confirms **640/640 table rows across 16 lab routes**, correct dot counts, unchanged Cigna / 2026-07 lineage, and **zero script tags**. Default route remains **18,601 B gzip**. Public assets are byte-unchanged from the original reconciled implementation. No frontend source changed in this repair, so the prior mobile/browser evidence is retained rather than claimed as a fresh screen-reader pass.
- `git diff --check` passes in both repositories. Three implementation/test files plus the two plan/index files remain modified, matching the declared repair scope. Nothing was committed, pushed, merged, or deployed during this review.

## Closeout

Completed: 2026-08-30. Human authorization: Siew's explicit "approve, push, merge and publish" following independent closure of every review finding.

- **Published artifact:** [Anatomy of a Published Healthcare Rate](https://abeautifulpoint.com/labs/anatomy-of-a-published-healthcare-rate/), default CPT 99204 plus fifteen per-code routes; approved strip plot retained, content marked ready.
- **Source publication:** pipeline exporter repairs pushed through `3b046a8`; site branch pushed and merged at `faad447`. Existing GitHub Pages deployment [33359164922](https://github.com/swong00/a.beautiful.point/actions/runs/33359164922) completed successfully. Data release pin `b69ad4f` and every checked-in asset remain unchanged.
- **Validation:** `pnpm run check` 0 errors/warnings/hints; `pnpm run build` 27 static pages; pipeline offline suite 57/57; all 640 table rows exact; 21 importer negative cases refuse before replacement; exporter unexpected/incomplete-package refusals preserve prior files; valid export/import/re-export succeed. Default route and data stay well below the payload limits and emit no client JavaScript.
- **Live gate:** 33 HTTPS requests returned 200 with response bytes identical to `dist/`: labs index, default lab, fifteen per-code pages, release manifest, and fifteen code files. Browser confirmed the $186.82 default record and 40-row excerpt, all 15 selector links, correct 70450 `CSTM-00` explanation, 77067's 1,191 dots across three facets, no body overflow at 375px, and no captured errors. Temporary viewport override reset.
- **Follow-ups:** local pnpm store configuration and GitHub Actions runtime warnings transferred to `docs/exec-plans/tech-debt-tracker.md`; the optional background essay is intentionally deferred. No blocking follow-up remains.
- **Residual limits:** native screen-reader acceptance was not performed (DOM, keyboard, and browser checks passed). Published facts remain a bounded July 2026 slice with the documented comparability, missing-context, currency, and currentness caveats. No refresh automation or new infrastructure was introduced.
