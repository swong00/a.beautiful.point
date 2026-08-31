# 006 - Transparency In Coverage Discovery

Status: abandoned — superseded by the pipeline repo's completed discovery through public contract v0 (see `swventure-pipelines/domains/transparency-in-coverage/`); do not execute this plan. Successor: [007-tic-pricing-slice-anatomy-lab.md](../completed/007-tic-pricing-slice-anatomy-lab.md), activated 2026-08-30.
Domain: data
Priority: P1
Created: 2026-05-31
Last updated: 2026-08-30
Owner/driver: mixed
Branch: N/A
Related: [completed successor 007](../completed/007-tic-pricing-slice-anatomy-lab.md), [pipeline public contract v0](../../../../pipelines/domains/transparency-in-coverage/public-contract/README.md)

## Fresh Session Kickoff

This plan is retired; do not resume its original discovery sequence. Use [completed successor 007](../completed/007-tic-pricing-slice-anatomy-lab.md).

Current state:

- What already exists:
  - `../pipelines/domains/transparency-in-coverage/README.md` reserves the domain and points back to this plan.
  - The repo has an accepted local-first detachable data pipeline direction.
  - The active homelessness plan is the first proof point for the shared pipeline shape.
- What is known to work:
  - Cigna publishes a public Machine Readable Files page and a current Federal table-of-contents pointer at `https://www.cigna.com/static/mrf/latest.json`.
  - CMS publishes official Health Plan Price Transparency guidance and implementation schemas.
- What is known broken or incomplete:
  - No Transparency in Coverage source manifest, parser, schema validation, or analysis register exists.
  - No local approach has been tested for streaming or sampling large TiC source files.
  - No editorial question has been selected.
- Last validation command:
  - N/A
- Last validation result:
  - N/A
- External state or access needed:
  - Cigna public MRF page and table-of-contents endpoint.
  - CMS price transparency implementation guide and schemas.
  - Network access for HTTP metadata and small sample reads.
- Known traps:
  - Some linked files may be too large for a personal workstation.
  - Table-of-contents files can point to JSON gzip or ZIP files across multiple hosts.
  - Signed URLs, reporting months, file names, and schemas may change.
  - This work should begin with metadata, schemas, and samples, not a full local mirror.

## Goal

Create a metadata-first local discovery prototype for Transparency in Coverage data that can support future insight work without overbuilding a warehouse or downloading terabyte-scale sources.

The plan is complete when the repo has:

- A source manifest for the selected Cigna and CMS sources.
- A local command that discovers current table-of-contents metadata.
- A small indexed summary of plans, file locations, file types, reporting months, and selected candidate slices.
- Schema and sample validation evidence.
- A documented recommendation for the first publishable TiC insight question or a decision to park the project.

## Scope

- In scope:
  - Discover and record official Cigna and CMS source references.
  - Parse the Cigna table-of-contents file metadata.
  - Inspect official CMS schemas and choose the relevant schema version.
  - Identify a narrow first slice for sampling.
  - Stream or sample selected files without full-file local downloads.
  - Emit validation reports and a short research brief.
  - Decide whether this domain can remain local-first or needs a separate data-processing plan.

## Out Of Scope

- Out of scope:
  - Full local mirror of all Cigna MRFs.
  - Cloud warehouse setup.
  - Paid data provider selection.
  - Public healthcare price explorer UI.
  - Publishing provider, employer, plan, or negotiated-rate claims without analysis review.
  - Medical or consumer advice.

## Evidence / Current State

- Cigna's public Machine Readable Files page states that files are made available for the Federal Transparency in Coverage Rule and include negotiated service rates and out-of-network allowed amounts.
- The same page warns that individual JSON files may be as large as one terabyte and that the table of contents is not intended to be opened on personal workstations.
- Cigna exposes a current Federal table-of-contents pointer at `https://www.cigna.com/static/mrf/latest.json`.
- CMS publishes Health Plan Price Transparency guidance for machine-readable files and implementation schemas through the CMS price transparency guide.
- The pipeline repo has no TiC pipeline yet, only a reserved `../pipelines/domains/transparency-in-coverage/` directory.

Source references:

- Cigna Machine Readable Files page: https://www.cigna.com/legal/compliance/machine-readable-files
- Cigna current Federal table-of-contents pointer: https://www.cigna.com/static/mrf/latest.json
- CMS Health Plan Price Transparency overview: https://www.cms.gov/priorities/healthplan-price-transparency/overview/plans-and-issuers
- CMS price transparency implementation guide: https://github.com/CMSgov/price-transparency-guide

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Shape the first editorial question | pending | Brief states the reader question, why it matters, and what data slice could answer it |  |
| Build source discovery and manifest | pending | Command writes `../pipelines/domains/transparency-in-coverage/data/raw/manifest.json` with Cigna and CMS source metadata |  |
| Index Cigna table-of-contents metadata | pending | Command writes a small index summary without downloading linked MRF files |  |
| Inspect CMS schema and choose validation target | pending | Decision recorded with schema version and rationale |  |
| Stream or sample a narrow candidate slice | pending | Sample command records byte counts, compression handling, parse warnings, and row/object counts |  |
| Emit validation report | pending | Report distinguishes blocking issues from non-blocking caveats |  |
| Recommend next step | pending | Decision Log records whether to proceed local-first, split into a data repo, use cloud, or park |  |
| Run exit validation | pending | Commands in Validation Commands pass or blockers recorded |  |

## Validation Commands

Run commands from the repo root once this plan is implemented.

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
node --version
pnpm data:tic:doctor
pnpm data:tic:discover
pnpm data:tic:index
pnpm data:tic:sample
pnpm data:tic:validate
pnpm run check
pnpm run build
```

## Deploy / Operational Gate

N/A until this plan promotes public assets or frontend code.

Before any public TiC artifact:

- Validation report has no blocking errors.
- Claims are reviewed through an analysis packet.
- Public assets are compact and do not expose raw bulk source data.
- Caveats make clear that TiC negotiated-rate files are not consumer medical advice.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-05-31 | Start TiC with metadata-first discovery and narrow streaming samples. | Source files can be too large for personal workstations, so full local mirroring is the wrong first move. |
| 2026-05-31 | Treat TiC as a backlog plan until the homelessness pipeline proves the shared local-first pattern. | Homelessness remains the active P0 proof point; TiC needs careful scope before implementation. |
| 2026-08-30 | Retire this discovery plan as superseded. | Pipeline work completed discovery, cataloging, canonical modeling, and public contract v0; active plan 007 owns the consumer artifact. |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| Decide the first TiC editorial question before building extract logic. | Plan creation | blocks-current-plan | P0 | This plan | open |
| Evaluate whether DuckDB, Parquet, or another local columnar path is needed after sampling. | Plan creation | needed-before-prod | P1 | This plan Decision Log | open |
| Decide whether TiC needs a separate data repo or cloud workflow after first metadata/sample validation. | Data pipeline design | new-plan-candidate | P1 | Future plan or decision record | open |

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
