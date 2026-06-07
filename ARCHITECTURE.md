# Architecture

This repo should become a static-first visual intelligence lab, not an application platform for its own sake.

## Current Architecture

The current committed architecture is a static-first Astro site plus repo-native operating memory:

- `AGENTS.md` is the agent entry point.
- `docs/` is the source of truth for vision, content strategy, operating model, decisions, and execution plans.
- `src/pages/` owns the static route surface.
- `src/content/` stores local MDX artifacts for manifesto, essays, visuals, labs, and notes.
- `src/content.config.ts` defines the content collections.
- `src/components/layout/` and `src/components/visuals/` hold shared presentation and visual-system pieces.
- `package.json` keeps `pnpm data:*` compatibility scripts that delegate into the sibling `../pipelines` repo.
- `analysis/` may hold reviewed analysis packets when a dataset has validated clean outputs.
- `public/` holds static public assets.

The site has no CMS, database, accounts, backend service, analytics, or deployment adapter.

## Target Shape

```text
/
  AGENTS.md
  ARCHITECTURE.md
  README.md
  docs/
    core-beliefs.md
    content-system.md
    agent-first-operating-model.md
    data-pipeline-system-design.md
    data-analysis-sop.md
    decisions/
    exec-plans/
  analysis/
  src/
    content/
      essays/
      visuals/
      labs/
      notes/
    components/
      diagrams/
      interactives/
      layout/
    data/
    pages/
  public/
    data/
      <domain>/
```

The site skeleton is implemented. Source manifests, raw/staging/clean data, rollups, and validation reports now live in the sibling `../pipelines` repo. This project should only keep reviewed static public assets under `public/data/<domain>/` when a plan promotes them.

## Technical Defaults

- Site: Astro.
- Writing: MDX.
- Diagrams: Mermaid and hand-authored SVG where useful.
- Interactives: small, reusable components embedded directly in essays and visuals.
- Data: CSV and JSON first.
- Data pipelines: local-first scripts in `../pipelines` that write source manifests, clean outputs, validation reports, and compact public assets.
- Larger analysis: local notebooks or scripts that run from validated clean data and export reviewed static artifacts into the site.
- Hosting: GitHub Pages with the custom domain `abeautifulpoint.com`.

## Boundaries

- No CMS in the first version.
- No user accounts in the first version.
- No database unless a specific interactive artifact proves it needs one.
- No cloud data warehouse or external data provider until local discovery proves that source scale, update cadence, or query needs require it.
- No generic AI blog surface.
- No private employer data, screenshots, names, incidents, or customer facts.
- No opaque visual flourishes that do not improve understanding.

## Architectural Invariants

- The repo is legible to future agents without chat history.
- Content, visual data, and decisions are versioned in the repo.
- Public data assets are generated from source manifests and validation reports in the sibling pipeline repo.
- Public artifacts should degrade gracefully without client-side JavaScript.
- Interactive components should be small enough to inspect and validate.
- Visuals must support the argument of a piece.
- Navigation should preserve the lab structure: Essays, Visuals, Labs, Notes, About.
- Validation evidence belongs in execution plans, not in memory.

## Validation Direction

Current validation commands:

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
node --version
pnpm run check
pnpm run build
```

Frontend changes should also receive a local browser smoke check against the route surface once `pnpm run dev` is running.
