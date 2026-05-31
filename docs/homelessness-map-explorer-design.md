# Homelessness Map Explorer Design

Status: draft
Last updated: 2026-05-18
Owner/driver: mixed

Related:

- [Data Analysis SOP](data-analysis-sop.md)

## Product Intent

Build a static-first interactive explorer that helps people see how homelessness has changed across the United States over time.

The first public artifact should make one system clearer:

> Homelessness is not one national trend. It is a changing relationship between geography, shelter capacity, count method, and local governance boundaries.

The explorer should let a reader move between the national picture, state-level patterns, and Continuum of Care (CoC) geographies without needing to understand HUD data files first.

## Audience

Primary audience:

- Technical leaders, operators, civic technologists, analysts, and policy-curious readers who want a reliable visual explanation.

Secondary audience:

- Readers who know homelessness is worsening in some places but do not yet understand the geography, count methods, and data caveats.

## Existing Analysis Context

An older local prototype exists at:

```text
/Users/swong/Library/Mobile Documents/com~apple~CloudDocs/Documents/Projects.macmini/thescottandsiewproject/homeless-data-analysis
```

It contains:

- Python scripts that reshape HUD PIT spreadsheets into a long format.
- A generated `data/all.csv` with roughly 1.28 million PIT observation rows for 2007-2020.
- Node scripts that join 2021 CoC PIT data to county population and TopoJSON-style map artifacts.

Use this project as a learning source, not as the new source of truth. The strongest reusable idea is the long-form PIT normalization. The manual county-to-CoC mapping layer is useful evidence of the problem but has data-quality hazards, including brittle name matching, changing CoC boundaries, and encoding issues.

## Current Official Sources

As of 2026-05-18, the current HUD AHAR page lists FY 2024 as the most recent public AHAR data release, published in December 2024.

Official source pages:

- HUD AHAR reports: https://www.huduser.gov/portal/datasets/ahar.html
- 2024 AHAR resource page: https://www.huduser.gov/portal/datasets/ahar/2024-ahar-part-1-pit-estimates-of-homelessness-in-the-us.html
- HUD dataset update schedule: https://www.huduser.gov/portal/datasets/update-schedule.html
- HUD FY2024 CoC geography FeatureServer: https://services.arcgis.com/VTyQ9soqVukalItT/ArcGIS/rest/services/CoC_Geo_Type/FeatureServer/0

Current data files listed by HUD for the 2024 AHAR resource page:

- `2007-2024-PIT-Counts-by-CoC.xlsb`
- `2007-2024-PIT-Counts-by-State.xlsb`
- `2007-2024-HIC-Counts-by-CoC.xlsx`
- `2007-2024-HIC-Counts-by-State.xlsx`
- `2011-2024-PIT-Veteran-Counts-by-CoC.xlsx`
- `2011-2024-PIT-Veteran-Counts-by-State.xlsx`
- `2024-HIC-Counts-by-State.csv`

HUD's 2024 CoC geography layer supports GeoJSON output and includes fields such as `COCNUM`, `COCNAME`, `HudNum`, `STATE_NAME`, and `Geo_Type`.

## Explorer UX

The first screen should be the explorer, not a landing page.

Core controls:

- Geography mode: `State` and `CoC`.
- Year slider: 2007 through the latest available HUD release.
- Metric picker:
  - Overall homelessness.
  - Sheltered homelessness.
  - Unsheltered homelessness.
  - Individuals.
  - People in families.
  - Veterans.
  - Youth.
  - Chronic homelessness.
  - HIC bed or capacity measures when HIC is enabled.
- Display mode: raw count or rate per 10,000 residents.
- Search: state, CoC number, CoC name.
- Compare mode: selected geography versus national trend, state trend, or peer CoC category.

Map behavior:

- Choropleth map for the selected metric/year.
- Hover shows compact label, value, year, and data-quality flag.
- Click opens a detail panel with trend line, latest value, change since baseline, rank/context, and caveats.
- Mobile layout prioritizes map, year control, and detail drawer.

Explanatory layer:

- Use short annotations on the chart or detail panel for major discontinuities.
- Make 2021 pandemic-related count disruption visible, especially for unsheltered or total comparisons.
- Explain CoC boundaries as operational geographies, not ordinary city/county/state units.

## Data Product Shape

The public site should consume generated static assets only.

Target structure:

```text
data/
  homelessness/
    raw/
      manifest.json
      hud/
      census/
      geography/
    staging/
    clean/
    rollups/
    reports/
public/
  data/
    homelessness/
      manifest.json
      metrics.json
      national-series.json
      state-series.json
      coc-series.json
      state-latest.json
      coc-latest.json
      state-boundaries.topojson
      coc-boundaries.topojson
      validation-report.json
```

The `data/homelessness/raw/` directory may stay out of the public bundle if file sizes are large. Public assets should be small enough for a static site and generated from reproducible source manifests.

## Analysis Lane

The data ingest pipeline and the analysis process are separate lanes.

ETL produces clean, validated, versioned data. The Data Analyst role works from that validated data to produce insight packets, candidate map layers, chart data, annotations, and publishable claims.

Use [Data Analysis SOP](data-analysis-sop.md) for the standard workflow.

Homelessness analysis should use this shape:

```text
docs/analysis/homelessness/
  analysis-register.md
analysis/homelessness/
  001-post-2019-unsheltered-growth/
    brief.md
    method.md
    outputs/
      findings.json
      chart-data.json
      validation.md
public/data/homelessness/insights/
  reviewed-insight-assets.json
```

The explorer should consume only reviewed analysis outputs. Exploratory analysis may inform the work, but it should not become public UI data without a review gate.

Initial research questions:

- Which states had the largest post-2019 increase in unsheltered homelessness?
- Which states diverged most from the national trend after 2015?
- Where did sheltered and unsheltered trends move in opposite directions?
- Which CoCs are latest-year outliers by raw count, and which remain outliers after rate normalization?
- Which places have the strongest mismatch between homelessness trends and shelter capacity trends?

## Canonical Tables

`source_manifest`

```text
source_id
source_name
source_url
retrieved_at
published_date
file_name
file_hash
file_size_bytes
license_or_usage_note
```

`geographies`

```text
geo_id
geo_level
name
state
coc_number
coc_name
boundary_year
geo_type
source
```

`pit_observations`

```text
year
geo_level
geo_id
metric_id
value
count_type
source_file
source_sheet
quality_flags
```

`hic_observations`

```text
year
geo_level
geo_id
inventory_type
metric_id
value
source_file
source_sheet
quality_flags
```

`population_observations`

```text
year
geo_level
geo_id
population
source
quality_flags
```

`metric_definitions`

```text
metric_id
label
short_label
description
dataset
unit
default_scale
display_group
polarity
caveats
```

`quality_flags`

```text
flag_id
label
description
severity
applies_to
```

## ETL Pipeline

Pipeline stages:

1. Discover
   - Fetch or scrape the HUD AHAR page.
   - Resolve the latest AHAR resource page and linked data files.
   - Record expected URLs in `source_manifest`.

2. Download
   - Download source files into `data/homelessness/raw/`.
   - Write hashes, sizes, timestamps, and source URLs.
   - Do not overwrite a raw file without preserving the manifest evidence.

3. Parse
   - Read PIT `xlsb` and HIC `xlsx/csv` files.
   - Extract year-named sheets.
   - Preserve source sheet and original column names in staging metadata.

4. Normalize
   - Convert wide HUD sheets into long canonical rows.
   - Map original column names into stable `metric_id` values.
   - Normalize CoC IDs, state abbreviations, names, count types, and nulls.

5. Join Geography
   - Pull the latest HUD CoC FeatureServer GeoJSON.
   - Use official state boundaries or a compact Census/TopoJSON state file.
   - Join by official CoC number where possible, not hand-normalized names.

6. Add Population
   - Use Census population estimates for state rates.
   - Treat CoC rates as a second-phase feature unless reliable CoC population denominators are validated.

7. Roll Up
   - Generate national, state, and CoC metric series.
   - Generate latest-year map-ready tables.
   - Precompute ranks, deltas, and percent changes for common baselines.

8. Validate
   - Compare national totals against HUD-reported totals where available.
   - Check state sums against national totals.
   - Check row counts, year coverage, metric coverage, and missing geography joins.
   - Emit `validation-report.json` and a human-readable markdown report.

9. Publish Assets
   - Write compact public JSON and TopoJSON assets.
   - Keep raw files and staging outputs outside the shipped route.

## Automation

Local automation should come first.

Suggested commands:

```sh
pnpm data:discover
pnpm data:download
pnpm data:build
pnpm data:validate
pnpm data:publish
pnpm build
```

Local scheduled run options:

- macOS LaunchAgent for monthly checks.
- Cron if the machine's environment is stable.

Cloud-ready path:

- GitHub Actions scheduled workflow checks HUD sources monthly.
- If source hashes or latest release year change, regenerate assets and open a PR.
- The workflow must include the validation report as a build artifact or committed report.

Automation rule:

- New HUD data should never silently become public data. It should pass validation and create an auditable diff first.

## Frontend Architecture

Preferred static-first implementation:

```text
src/content/visuals/homelessness-map-explorer.mdx
src/components/interactives/HomelessnessExplorer.astro
src/components/interactives/homelessness/
  data-loader.ts
  map-view.ts
  controls.ts
  detail-panel.ts
  scales.ts
  metric-copy.ts
public/data/homelessness/
```

Use D3-style geography and TopoJSON for the first implementation. Avoid a hosted map tile provider, token, account, database, or backend service until there is a specific reason.

The static fallback should still show:

- Latest national headline metrics.
- A small static table of top state/CoC changes.
- A note that the interactive map requires JavaScript.

## Data Caveats

Known caveats to expose in product copy and data flags:

- PIT counts are one-night estimates, not annual service counts.
- Unsheltered counts may be biennial or incomplete in some places.
- 2021 has pandemic-related count disruption; HUD's 2021 AHAR Part 1 focused on sheltered homelessness.
- CoC geographies are operational service geographies and can change over time.
- Current CoC boundaries should not automatically be treated as historically exact boundaries.
- Rate calculations require reliable population denominators; state rates are safer than CoC rates for the first release.

## MVP Boundary

MVP includes:

- Official HUD PIT ingest through latest public release.
- State-level map and trend explorer for core PIT metrics.
- CoC latest-year map explorer using official HUD CoC boundaries.
- Data quality flags and validation report.
- Static public data assets generated locally.

MVP does not include:

- Database or backend API.
- User accounts, saved views, or personalization.
- Real-time source updates.
- Hand-authored county-to-CoC population estimates for production use.
- Full HIC capacity explorer unless PIT workflow is already stable.

## Open Decisions

- Pipeline language: Python is strongest for spreadsheet parsing and validation; TypeScript is strongest for site integration. Start with Python for ETL and TypeScript for frontend unless early implementation proves that one runtime is clearly simpler.
- CoC historical boundaries: decide whether to show latest CoC boundaries only, historical CoC boundaries by year, or current-boundary approximations with caveats.
- Population denominators: decide when CoC rate calculations are reliable enough for public display.
- Data file size budget: set a public asset size target after the first generated rollups.
