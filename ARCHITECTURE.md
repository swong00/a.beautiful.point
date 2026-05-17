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
    decisions/
    exec-plans/
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
```

The first version of this tree is implemented. Keep new additions inside this shape unless a future execution plan records a stronger reason to change it.

## Technical Defaults

- Site: Astro.
- Writing: MDX.
- Diagrams: Mermaid and hand-authored SVG where useful.
- Interactives: small, reusable components embedded directly in essays and visuals.
- Data: CSV and JSON first.
- Larger analysis: local notebooks or scripts that export static artifacts into the site.
- Hosting: GitHub Pages with the custom domain `abeautifulpoint.com`.

## Boundaries

- No CMS in the first version.
- No user accounts in the first version.
- No database unless a specific interactive artifact proves it needs one.
- No generic AI blog surface.
- No private employer data, screenshots, names, incidents, or customer facts.
- No opaque visual flourishes that do not improve understanding.

## Architectural Invariants

- The repo is legible to future agents without chat history.
- Content, visual data, and decisions are versioned in the repo.
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
