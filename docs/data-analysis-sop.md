# Data Analysis SOP

Status: draft
Last updated: 2026-05-18
Owner/driver: mixed

## Purpose

This SOP defines how A Beautiful Point turns validated datasets into publishable insight.

It separates three lanes:

```text
Data Ingest / ETL
  raw sources -> clean canonical data -> validated rollups

Data Analysis
  clean data -> research questions -> findings -> insight artifacts

Explorer / Publishing
  selected findings -> UI layers, annotations, essays, visuals, and notes
```

The separation matters because a good explorer is not just a dataset with controls. The public artifact should reveal a system, defend its claims, and help a reader see what changed, where, compared to what, and why the caveats matter.

## Role

The data analyst role may be performed by a human, Codex, or a future specialized agent. It is a workflow role, not a required person.

Name to use in plans:

```text
Data Analyst
```

Responsibilities:

- Define research questions against a validated dataset.
- Choose metrics, baselines, geographies, filters, and comparison groups.
- Run reproducible analysis from canonical clean data, not raw source files.
- Produce findings, chart data, map-layer candidates, caveats, and short narrative claims.
- Flag data-quality concerns that affect interpretation.
- Package outputs in a UI-ready and source-auditable format.
- Maintain an analysis register so strong questions and discarded findings are not lost.

Not responsible for:

- Scraping, downloading, or normalizing raw source files.
- Owning the ETL pipeline.
- Frontend implementation or visual polish.
- Publishing claims that are not supported by the analysis evidence.

## Inputs

Analysis starts only after the ETL lane has produced:

- A named dataset version.
- Clean canonical tables or rollups.
- Source manifest with file URLs, hashes, dates, and source notes.
- Validation report with blocking and non-blocking findings.
- Metric definitions and known caveats.

If these inputs do not exist, the correct next step is to improve the ETL plan, not to run exploratory analysis from raw files.

## Outputs

Each analysis packet should produce a small set of durable artifacts:

```text
analysis/<domain>/<analysis-id>/
  brief.md
  method.md
  outputs/
    findings.json
    chart-data.json
    map-layer.json
    validation.md
```

Use only the outputs that the analysis actually needs. For example, a ranking analysis may not need `map-layer.json`.

Public UI assets should be promoted separately:

```text
public/data/<domain>/insights/
  <analysis-id>.json
```

Do not make every analysis public by default. Promote only reviewed, useful findings.

## Analysis Register

Each domain with recurring analysis should keep a register:

```text
docs/analysis/<domain>/analysis-register.md
```

The register tracks questions, status, dataset version, owner, and publish decision.

Suggested statuses:

```text
idea | scoped | running | reviewing | promoted | parked | rejected
```

Suggested fields:

```text
analysis_id
question
dataset_version
status
priority
owner
publish_target
last_updated
notes
```

## Analysis Packet Workflow

1. Question
   - State the question in one sentence.
   - Name why it matters to the reader.
   - Define what would count as an interesting answer.

2. Dataset Version
   - Pin the analysis to a specific validated dataset version.
   - Link to the source manifest and validation report.
   - Record known caveats before calculating.

3. Metric Definition
   - Define the numerator, denominator, unit, years, geography, filters, and missing-data behavior.
   - Use existing metric definitions when available.
   - Add a new metric definition only when the concept will be reused.

4. Method
   - Choose a method that fits the question: trend, rank, rate, before/after, outlier scan, clustering, cohort comparison, decomposition, or correlation.
   - Keep the method reproducible.
   - Avoid causal language unless the method supports it.

5. Run
   - Run the analysis from clean data or validated rollups.
   - Save code, query, or notebook steps where future agents can inspect them.
   - Write machine-readable outputs for downstream UI use.

6. Validate
   - Check row counts, missing values, denominators, baselines, and joins.
   - Reconcile totals to validated rollups where applicable.
   - Record any sensitivity checks or limitations.

7. Interpret
   - Convert results into concise insight candidates.
   - Each candidate should answer:
     - What changed?
     - Where?
     - Compared to what?
     - How strong is the evidence?
     - What caveat could mislead the reader?
     - What UI element should reveal it?

8. Review Gate
   - Decide whether the finding is supported, useful, and worth showing.
   - Mark unsupported or low-signal findings as parked or rejected.
   - Record why, because negative results can still save future work.

9. Promote
   - Promote reviewed findings into public insight assets, UI annotations, essays, visual modules, or backlog work.
   - Keep the analysis packet as the audit trail.

## Review Checklist

Before promoting a finding:

- The dataset version is pinned.
- Metric definitions are explicit.
- Source and validation reports are linked.
- The analysis does not use raw data bypassing the ETL lane.
- Missing data and count-method caveats are visible.
- The claim is no stronger than the evidence.
- The output includes a recommended UI treatment.
- The result still makes sense at human scale, not only as a table.

## Claim Levels

Use these levels when writing insight summaries:

```text
descriptive
  The data shows X changed in Y place over Z period.

comparative
  X changed more in A than B under the same metric definition.

associative
  X and Y move together, but this does not establish cause.

causal
  Avoid unless the analysis design supports causal inference.
```

Most public findings for this site should be descriptive or comparative.

## Relationship To ETL

ETL answers:

```text
Can we trust this data shape?
```

Analysis answers:

```text
What does this data reveal?
```

Publishing answers:

```text
What should the reader see, understand, and do differently?
```

The data analyst role should not fix ETL issues inline. If a quality issue blocks analysis, record it as a blocker and send it back to the active data pipeline plan.

## Relationship To UI

The UI should consume reviewed analysis outputs, not exploratory scratch files.

Good analysis outputs should be easy to render as:

- Map layers.
- Trend lines.
- Ranking tables.
- Annotations.
- Detail-panel explanations.
- Small multiples.
- Companion essays or lab notes.

If an analysis does not suggest a clear visual or editorial treatment, keep it in the register until the product question is sharper.

## File And Naming Conventions

Analysis IDs should be stable and sortable:

```text
001-post-2019-unsheltered-growth
002-state-rate-outliers
003-coc-category-comparison
```

Use lowercase kebab-case for directories and artifact files.

Use `README.md` only for directory maps. Use `brief.md`, `method.md`, and `validation.md` inside analysis packets.

## Automation

Analysis can be automated after ETL is stable, but automation should produce candidates, not silently publish claims.

Automated analysis jobs may:

- Refresh established analysis packets after a new dataset version.
- Recompute rankings, deltas, and outlier lists.
- Flag changed findings for review.
- Open a PR with regenerated outputs and validation evidence.

Automated analysis jobs must not:

- Promote findings to public UI assets without a review step.
- Change metric definitions silently.
- Hide new data-quality warnings.

## Homelessness Explorer First Use

The homelessness map explorer is the first planned use of this SOP.

Initial analysis questions to register after the ETL pipeline exists:

- Which states had the largest post-2019 increase in unsheltered homelessness?
- Which states diverged most from the national trend after 2015?
- Where did sheltered and unsheltered trends move in opposite directions?
- Which CoCs are latest-year outliers by raw count, and which remain outliers after rate normalization?
- Which places have the strongest mismatch between homelessness trends and shelter capacity trends?

The first public explorer should ship with only a small number of reviewed findings. More analysis packets can feed future annotations, essays, and UI layers over time.
