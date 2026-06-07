# Data Pipeline System Design

Status: accepted direction
Last updated: 2026-06-05
Owner/driver: mixed

Related:

- [Data Analysis SOP](data-analysis-sop.md)
- [Homelessness Map Explorer Design](homelessness-map-explorer-design.md)
- [Decision 0002 - Local-First Detachable Data Pipeline](decisions/0002-local-first-detachable-data-pipeline.md)

## Purpose

A Beautiful Point needs a repeatable way to turn public, messy, recurring data into publishable evidence and insight.

The data-processing system should be separate from the public site or any future CMS surface, but it should start simple and local. The first version began in this repo and now lives in the sibling `../pipelines` repo, using local files and scripts to emit small reviewed static assets that the Astro site can publish.

As of 2026-06-05, this project keeps `pnpm data:*` commands as a compatibility surface that delegates to `../pipelines`.

The intended progression is:

```text
local project commands -> sibling pipeline repo -> scheduled job or cloud only when scale proves it
```

## Decision Summary

Use a local-first, detachable data pipeline.

Near term:

- Keep the pipeline local in the sibling `../pipelines` repo.
- Use this project's `pnpm data:*` commands as the compatibility surface for agents.
- Use Python for data ingestion, parsing, normalization, validation, and static asset generation unless a dataset has a stronger reason to use another runtime.
- Use TypeScript and Astro only for frontend loading and rendering.
- Keep raw and staging data out of the public bundle.
- Publish only reviewed, compact assets under `public/data/<domain>/`.

Long term:

- The pipeline may move to a separate repo, scheduled local job, GitHub Action, object-store workflow, or cloud warehouse.
- The public site should not care where the pipeline runs as long as the promoted static asset contract stays stable.

## System Principles

- Source-auditable: every dataset version needs source URLs, retrieval dates, hashes or remote metadata, source notes, and validation evidence.
- Static-publishing boundary: public pages consume generated assets, not raw source files or exploratory notebooks.
- Separate lanes: ETL answers "can we trust this data shape"; analysis answers "what does it reveal"; publishing answers "what should the reader see."
- Human review gate: automated jobs may refresh candidates and open diffs, but they must not silently publish new claims.
- Small public artifacts: public JSON, CSV, or TopoJSON assets should be compact and purpose-built for the artifact.
- Metadata-first for large sources: when source files are very large, index and sample before downloading or parsing full files.
- Cloud later: use cloud data providers only when local reproducibility, file sizes, update cadence, or query needs prove that local processing is the bottleneck.

## Repository Shape

Preferred pipeline repo shape:

```text
../pipelines/
  _system/
    pipeline-registry.json
    source-manifest-schema.json
    validation-report-schema.json
  domains/
    <domain>/
      data/
        raw/
        staging/
        clean/
        rollups/
        reports/
      analysis/
      public-contract/
      scripts/
        <domain>_pipeline.py
a.beautiful.point/
  docs/
    analysis/
      <domain>/
        analysis-register.md
  public/
    data/
      <domain>/
        manifest.json
        validation-report.json
        insights/
```

This is a target pattern, not a demand to create every directory before it has content.

## Pipeline Lifecycle

Use the same lifecycle for every recurring dataset:

```text
discover -> acquire or index -> parse -> normalize -> validate -> roll up -> analyze -> promote -> publish
```

### 1. Discover

- Find official source pages, file URLs, schemas, update schedules, and license or usage notes.
- Write or update a source manifest.
- Record HTTP metadata such as `etag`, `last-modified`, content length, and redirects when available.

### 2. Acquire Or Index

Small and medium files:

- Download source files locally.
- Record hashes, sizes, and retrieval timestamps.
- Preserve prior source evidence when files change.

Large files:

- Do not default to full downloads.
- Index table-of-contents files, manifests, headers, remote file metadata, and representative samples first.
- Use streaming reads, byte ranges, compressed streams, or selective extraction where possible.

### 3. Parse

- Convert source-specific formats into staging records.
- Preserve source file, source sheet or section, original column names, and parse warnings.
- Keep source quirks visible until normalization explains them.

### 4. Normalize

- Map source fields into canonical tables.
- Normalize IDs, dates, geographies, metric names, nulls, units, and quality flags.
- Keep reusable metric definitions in data artifacts, not hidden inside prose.

### 5. Validate

- Emit machine-readable and human-readable reports.
- Check row counts, year coverage, metric coverage, joins, missingness, duplicate IDs, schema drift, and rollup reconciliation.
- Classify validation findings as blocking or non-blocking.

### 6. Roll Up

- Generate compact tables for common public interactions.
- Precompute expensive or repetitive calculations.
- Record dataset versions and public asset size budgets.

### 7. Analyze

- Follow [Data Analysis SOP](data-analysis-sop.md).
- Run analysis only from validated clean data or rollups.
- Save findings, chart data, caveats, and validation notes in an analysis packet.

### 8. Promote

- Promote only reviewed findings and assets.
- Keep exploratory outputs out of `public/data/`.
- Record why a finding was promoted, parked, or rejected.

### 9. Publish

- Write static public assets.
- Run site validation when public assets or frontend code change.
- New source data should create an auditable diff before it changes published claims.

## Core Artifacts

Every durable dataset should eventually have:

```text
../pipelines/domains/<domain>/data/raw/manifest.json
../pipelines/domains/<domain>/data/reports/validation-report.json
../pipelines/domains/<domain>/data/reports/validation-report.md
../pipelines/domains/<domain>/data/clean/dataset-version.json
docs/analysis/<domain>/analysis-register.md
public/data/<domain>/manifest.json
```

Public assets should state:

- Dataset version.
- Source manifest version.
- Generation time.
- Validation report path.
- Caveats that affect interpretation.
- Review status for promoted insights.

## Runtime Defaults

Default command surface:

```sh
pnpm data:setup
pnpm data:doctor
pnpm data:discover
pnpm data:<domain>:doctor
pnpm data:<domain>:discover
pnpm data:<domain>:download
pnpm data:<domain>:build
pnpm data:<domain>:validate
pnpm data:<domain>:publish
```

For the single active pipeline, `pnpm data:doctor` and `pnpm data:discover` in this project delegate to `../pipelines`.

Default tools:

- Python for ETL, validation, spreadsheet parsing, streaming, and local analysis.
- `pandas` for tabular shaping when data fits comfortably in memory.
- Streaming parsers and local columnar formats such as Parquet only when source size requires them.
- DuckDB or SQLite only as local pipeline implementation details, not as public site dependencies.
- TypeScript for public data loaders, UI controls, and browser-side validation of expected asset shape.

## Automation Model

Start manual and reproducible.

Then add:

1. Local scheduled check, such as a macOS LaunchAgent or cron job, when the command sequence is stable.
2. GitHub Actions scheduled discovery, when source access and runtime are reliable.
3. Cloud processing only when local runtimes cannot handle the validated workload.

Automation may:

- Check whether sources changed.
- Regenerate manifests, validation reports, rollups, and analysis candidates.
- Open a PR or leave reviewable artifacts.

Automation must not:

- Promote new claims without review.
- Change metric definitions silently.
- Hide validation warnings.
- Publish full raw source files to the public site.

## Dataset Profiles

### Homelessness

Profile:

- Medium-size public files.
- Official HUD spreadsheets and geography services.
- Best first path: full local download, parse, normalize, validate, and publish compact map-ready JSON or TopoJSON.

This is the active proof point for the system.

### Transparency In Coverage

Profile:

- Very large machine-readable files.
- Monthly public updates.
- Table-of-contents files point to many large JSON, JSON gzip, or ZIP files.
- Some linked files may be too large for personal workstations.

Best first path:

- Discover official source pages and current table-of-contents files.
- Index table-of-contents metadata.
- Select a narrow slice by issuer, plan, billing code, provider group, geography, or file type.
- Stream or sample selected files.
- Validate against official CMS schemas before shaping insight candidates.

Do not try to download and parse all Transparency in Coverage files locally as the first move.

Useful source references:

- Cigna Machine Readable Files page: https://www.cigna.com/legal/compliance/machine-readable-files
- Cigna current Federal table-of-contents pointer: https://www.cigna.com/static/mrf/latest.json
- CMS Health Plan Price Transparency overview: https://www.cms.gov/priorities/healthplan-price-transparency/overview/plans-and-issuers
- CMS price transparency implementation guide: https://github.com/CMSgov/price-transparency-guide

## Option Record

### Option 1: Keep Data Pipelines In This Repo

This is the recommended current option.

Strengths:

- Lowest friction.
- Best agent legibility.
- Fits the static-first architecture.
- Keeps early data, analysis, decisions, and public assets together.

Risks:

- Scripts can sprawl.
- Large raw data can bloat local working directories.
- Future cloud or scheduling needs may outgrow the repo.

Mitigation:

- Use shared artifact conventions now.
- Keep raw files ignored unless explicitly promoted.
- Make the public asset contract independent of where the pipeline runs.

### Option 2: Separate Data Repo Now

This is a plausible later option.

Strengths:

- Cleaner boundary between publishing and data operations.
- Easier to manage large files, releases, and automation independently.

Risks:

- Premature ceremony.
- Slower iteration while the artifact pattern is still forming.

### Option 3: Cloud Or Data Provider Early

This is not the first move.

Strengths:

- Better for terabyte-scale processing, scheduled ingestion, and heavy analytical queries.

Risks:

- Adds cost, access management, vendor assumptions, and operational complexity before the editorial questions are clear.
- Can hide data-quality learning behind platform machinery.

Use this option only after local discovery proves a dataset cannot be handled responsibly with local indexing, streaming, sampling, and compact derived outputs.
