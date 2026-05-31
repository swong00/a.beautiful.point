# 004 - Homelessness Map Explorer

Status: active
Domain: visuals
Priority: P0
Created: 2026-05-18
Last updated: 2026-05-30
Owner/driver: mixed
Branch: codex/homelessness-data-scaffold
Related: [../../homelessness-map-explorer-design.md](../../homelessness-map-explorer-design.md)

## Fresh Session Kickoff

Read these first:

1. [AGENTS.md](../../../AGENTS.md)
2. [README.md](../../../README.md)
3. [ARCHITECTURE.md](../../../ARCHITECTURE.md)
4. [docs/core-beliefs.md](../../core-beliefs.md)
5. [docs/exec-plans/README.md](../README.md)
6. [docs/homelessness-map-explorer-design.md](../../homelessness-map-explorer-design.md)
7. [docs/data-analysis-sop.md](../../data-analysis-sop.md)

Current state:

- What already exists:
  - The Astro static site skeleton is implemented.
  - The repo has no data pipeline or interactive map framework yet.
  - A prior local analysis exists outside the repo at `/Users/swong/Library/Mobile Documents/com~apple~CloudDocs/Documents/Projects.macmini/thescottandsiewproject/homeless-data-analysis`.
  - The design note captures the target UX, data model, ETL stages, official sources, caveats, and automation direction.
  - The data analysis SOP now defines the Data Analyst role and review-gated analysis packets.
- What is known to work:
  - Current site validation commands are `pnpm run check` and `pnpm run build`.
  - HUD's FY2024 CoC geography FeatureServer supports GeoJSON.
  - The ETL runtime is scaffolded as Python through `pnpm data:setup` and `pnpm data:doctor`.
  - `pnpm data:discover` writes `data/homelessness/raw/manifest.json` with eight HUD AHAR resource links and one HUD CoC geography source.
- What is known broken or incomplete:
  - No official HUD source download code exists in this repo.
  - No PIT/HIC normalization code exists in this repo.
  - No map UI exists.
  - No analysis register or reviewed homelessness analysis packets exist yet.
  - CoC historical boundary handling is unresolved.
  - CoC population denominators are not production-ready.
  - Local non-browser HTTP requests to HUD USER return an AWS WAF challenge, so the raw download stage must handle or route around that access pattern.
- Last validation command:
  - `node --version`
  - `pnpm --version`
  - `pnpm install`
  - `pnpm data:setup`
  - `pnpm data:doctor`
  - `pnpm data:discover`
  - `pnpm run check`
  - `pnpm run build`
- Last validation result:
  - 2026-05-30: `node --version` returned `v24.14.0`; `pnpm --version` returned `11.1.2`.
  - 2026-05-30: `pnpm install` passed and reported the lockfile/environment already up to date.
  - 2026-05-30: `pnpm data:setup` passed with pinned Python dependencies already satisfied.
  - 2026-05-30: `pnpm data:doctor` passed with Python 3.11.7 and pinned dependencies present.
  - 2026-05-30: `pnpm data:discover` passed and wrote `data/homelessness/raw/manifest.json`; discovery used the verified 2024 fallback because local HUD USER requests returned `x-amzn-waf-action: challenge`.
  - 2026-05-30: `pnpm run check` passed with 0 errors, 0 warnings, and 0 hints.
  - 2026-05-30: `pnpm run build` passed and built 11 static pages.
  - 2026-05-30: `pnpm data:download`, `pnpm data:build`, `pnpm data:validate`, and `pnpm data:publish` were not run because those package scripts are pending future plan steps and are not defined in `package.json` yet.
- External state or access needed:
  - HUD public data files and HUD GIS FeatureServer access.
  - Network access for source discovery and download.
- Known traps:
  - 2024 PIT files are `xlsb`, not the older `xlsx` shape from the local prototype.
  - 2021 PIT data has pandemic-related disruption and should be flagged clearly.
  - CoC names and boundaries change; use official CoC numbers where possible.
  - The old county-to-CoC mapping prototype has brittle joins and should not be copied as production truth.

## Goal

Create a reproducible static-first foundation for a U.S. map based interactive explorer of homelessness data over time.

The plan is complete when the repo has:

- A source-backed local data pipeline that ingests official HUD PIT data, emits validated static assets, and records source provenance.
- A first interactive Astro visual route that loads generated assets and lets a reader explore at least state-level homelessness metrics over time.
- A data analysis lane that can produce reviewed insight artifacts from the validated dataset without mixing exploratory analysis into ETL.
- Clear caveats, validation evidence, and follow-up work for CoC boundaries, HIC capacity, and automation.

## Scope

- In scope:
  - Add repo-local data pipeline scaffolding and scripts.
  - Ingest official HUD PIT files through the latest available public release.
  - Normalize a focused set of core PIT metrics.
  - Generate public JSON assets for a state-level MVP.
  - Add a static-friendly interactive route/component.
  - Add validation reports for source hashes, row counts, year coverage, metric coverage, and rollup totals.
  - Add a homelessness analysis register and first analysis packet scaffold after the clean dataset exists.
  - Capture source and data caveats in product-facing copy or data flags.
  - Prepare local automation commands that can later run under LaunchAgent, cron, or GitHub Actions.

## Out Of Scope

- Out of scope:
  - Backend API, database, CMS, or user accounts.
  - Cloud automation until local reproducibility is proven.
  - Production CoC rate calculations until denominators are validated.
  - Fully historical CoC boundary reconstruction.
  - Full HIC explorer until PIT ingest and map workflow are stable.
  - Polished narrative essay around the explorer beyond essential explanatory copy.

## Evidence / Current State

- The repository architecture is static-first Astro, MDX, local CSV/JSON data, small inspectable interactives, and GitHub Pages hosting.
- Existing local analysis shows that HUD PIT spreadsheets can be normalized into a long-form table, but its current generated dataset stops at 2020.
- Current HUD 2024 AHAR resource page lists PIT files as `xlsb` and HIC files as `xlsx/csv`.
- HUD's 2024 CoC FeatureServer exposes polygon boundaries and supports GeoJSON.
- HUD dataset update schedule lists AHAR and data as FY2024 released on 2024-12-27 with 2025 as the expected next update.

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Capture design, SOP, and execution plan | done | Design doc, data analysis SOP, and active plan committed to repo working tree; `pnpm run check` and `pnpm run build` pass | `docs/homelessness-map-explorer-design.md`; `docs/data-analysis-sop.md`; this plan |
| Decide pipeline runtime and dependencies | done | Decision recorded in Decision Log; package files or environment files updated | Python ETL + TypeScript frontend split recorded; `requirements-data.txt`, `package.json`, `.gitignore`, `scripts/data/homelessness_pipeline.py`, and `data/homelessness/README.md` updated |
| Build source discovery and manifest | done | `pnpm data:discover` writes a manifest with current HUD source URLs and metadata | `data/homelessness/raw/manifest.json`; command passed on 2026-05-18 with verified 2024 fallback and HUD WAF warning recorded in manifest |
| Build raw download stage | pending | `pnpm data:download` downloads sources, records hashes, and is idempotent |  |
| Build PIT parser and normalizer | pending | `pnpm data:build` emits clean PIT observations for selected core metrics |  |
| Build state-level rollups | pending | Rollups cover all available years and pass state/national sanity checks |  |
| Add validation reports | pending | `pnpm data:validate` emits JSON and markdown validation reports with no blocking errors |  |
| Publish static data assets | pending | `pnpm data:publish` writes compact public assets under `public/data/homelessness/` |  |
| Add analysis register and first packet scaffold | pending | Register follows Data Analysis SOP and references the validated dataset version |  |
| Run first reviewed analysis packet | pending | Packet outputs findings, validation notes, and a publish decision |  |
| Build first explorer UI | pending | Local browser smoke check shows state map, year control, metric control, and detail panel |  |
| Add CoC latest-year geography prototype | pending | CoC boundary data joins by official CoC ID with missing joins reported |  |
| Add local automation notes | pending | README or docs mention how to run locally and how to schedule later |  |
| Run exit validation | pending | Commands in Validation Commands pass or blockers recorded |  |

## Validation Commands

Run commands from the repo root.

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
node --version
pnpm install
pnpm data:setup
pnpm data:doctor
pnpm data:discover
pnpm data:download
pnpm data:build
pnpm data:validate
pnpm data:publish
pnpm run check
pnpm run build
```

Frontend smoke check once the route exists:

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
pnpm run dev
```

Then open the explorer route in the browser and verify:

- The map renders.
- The year control changes values.
- The metric control changes the color scale and detail values.
- Hover or click exposes a readable detail panel.
- 2021 caveats appear where relevant.
- Mobile viewport does not overlap controls, map, and detail content.

## Deploy / Operational Gate

Before public deployment:

- `pnpm run check` passes.
- `pnpm run build` passes.
- Data validation report has no blocking errors.
- Browser smoke check passes on desktop and mobile viewports.
- Public data assets have an acceptable size budget recorded in this plan.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-05-18 | Start static-first with generated JSON/TopoJSON assets instead of a backend service. | Matches repo architecture and keeps the first explorer inspectable, portable, and GitHub Pages compatible. |
| 2026-05-18 | Treat the old local homelessness project as reference context, not production source of truth. | Its long-form normalization is useful, but its manual geography joins are brittle and current HUD sources have newer file formats. |
| 2026-05-18 | Make state-level trends the first reliable MVP and CoC geography a latest-year prototype. | State history is more stable; CoC geography changes make historical comparisons riskier. |
| 2026-05-18 | Introduce a Data Analyst role and review-gated analysis packets as a separate lane from ETL. | ETL should produce trustworthy data; analysis should produce supported insight candidates for the UI. |
| 2026-05-18 | Use Python for the data pipeline and TypeScript/Astro for the explorer frontend. | Python with pinned `pandas`, `python-calamine`, and `openpyxl` is the clearest path for HUD XLSB/XLSX parsing and validation, while `pnpm` remains the top-level command surface for agents and the static frontend. |
| 2026-05-18 | Let source discovery fall back to a verified 2024 HUD resource list when local HUD USER requests return a WAF challenge, while recording fetch diagnostics in the manifest. | Keeps the manifest reproducible and makes the access issue explicit for the download stage. |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| Decide whether to use Python, TypeScript, or a hybrid pipeline after inspecting dependency friction for `xlsb` parsing. | Design capture | blocks-current-plan | P0 | This plan Decision Log | closed |
| Validate CoC population denominators before exposing CoC rates. | Existing local prototype review | needed-before-prod | P1 | Future data-quality plan | open |
| Decide how to represent historical CoC boundary changes. | Design capture | needed-before-prod | P1 | Future geography plan | open |
| Add HIC capacity explorer after PIT workflow is stable. | Product scope | new-plan-candidate | P2 | Backlog plan | open |
| Add scheduled GitHub Actions or local LaunchAgent automation after local reproducibility is proven. | Automation design | new-plan-candidate | P2 | Backlog or later step in this plan | open |
| Define the first homelessness analysis register entries after the canonical dataset version exists. | Data Analysis SOP | needed-before-prod | P1 | This plan | open |
| Handle HUD USER AWS WAF challenge for local non-browser download requests. | Source discovery validation | blocks-current-plan | P0 | This plan raw download stage | open |

## Audit Notes

| Date | Reviewer | Verdict | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

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
