# 0003 - Extract Data Pipeline To swventure-pipelines

Status: accepted

Date: 2026-06-05

## Context

The homelessness data pipeline began inside `a.beautiful.point` as a local-first proof point. The broader `swventure` workspace now has a separate private GitHub repo for shared data processing: `swong00/swventure-pipelines`.

The project still needs active execution plans to work from the `a.beautiful.point` root without retraining agents on a new command shape.

## Decision

Move source manifests, pipeline scripts, pinned data requirements, and data-domain READMEs out of this project and into the sibling `../pipelines` repo.

Keep `pnpm data:*` commands in this project as compatibility delegates into `../pipelines`.

## Consequences

- `a.beautiful.point` remains focused on the public Astro site, product/content memory, and reviewed public assets.
- `../pipelines` owns source discovery, raw/staging/clean data, validation reports, and future shared data-domain work.
- Active project plans can continue to run `pnpm data:setup`, `pnpm data:doctor`, and `pnpm data:discover` from this project root.
- Future pipeline steps should update both the pipeline repo and consuming project docs when command or public asset contracts change.

Related:

- [Data Pipeline System Design](../data-pipeline-system-design.md)
- [0002 - Local-First Detachable Data Pipeline](0002-local-first-detachable-data-pipeline.md)
- [004 - Homelessness Map Explorer](../exec-plans/active/004-homelessness-map-explorer.md)
