# 0002 - Local-First Detachable Data Pipeline

Status: accepted

Date: 2026-05-31

## Context

A Beautiful Point needs recurring data processing for public insight artifacts. The homelessness explorer is the first active use case. Transparency in Coverage data is a likely next project and has much larger source files and update cadence requirements.

The existing architecture is static-first: Astro, MDX, local data, generated static assets, and no CMS, backend service, database, or accounts in the first version. The new data-processing system should not turn the public site into an application platform before the editorial and visual workflow is proven.

## Decision

Start with a local-first data pipeline in this repo, designed so it can detach later.

The public site will consume only reviewed static assets from `public/data/<domain>/`. Raw downloads, staging files, validation reports, source manifests, clean canonical data, and analysis packets remain in the data and analysis lanes.

Default direction:

- Keep early pipelines repo-local.
- Use `pnpm` as the command surface for agents and humans.
- Use Python for ETL and validation unless a dataset proves another runtime is better.
- Keep ETL, analysis, and publishing as separate lanes.
- Use metadata-first and streaming-first approaches for very large sources.
- Add cloud services or external data providers only after local reproducibility exposes a real need.

## Consequences

- The homelessness pipeline continues as the first proof point.
- Transparency in Coverage should begin with source discovery, table-of-contents indexing, schema validation, and narrow samples, not full-file downloads.
- Future pipelines should share manifest, validation, dataset-version, and public-asset conventions.
- Automation may refresh data and open reviewable diffs, but it must not silently publish claims.
- A future split into a separate data repo, scheduled job, or cloud workflow should preserve the same promoted public asset contract.

Related:

- [Data Pipeline System Design](../data-pipeline-system-design.md)
- [Data Analysis SOP](../data-analysis-sop.md)
- [004 - Homelessness Map Explorer](../exec-plans/active/004-homelessness-map-explorer.md)
- [006 - Transparency In Coverage Discovery](../exec-plans/backlog/006-transparency-in-coverage-discovery.md)

