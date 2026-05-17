# Architecture

This repo should become a static-first visual intelligence lab, not an application platform for its own sake.

## Current Architecture

The current committed architecture is documentation and process only:

- `AGENTS.md` is the agent entry point.
- `docs/` is the source of truth for vision, content strategy, operating model, decisions, and execution plans.
- No runtime framework, dependency lockfile, or deployed site exists yet.

This is intentional. The next plan should add the smallest site runtime that lets the lab publish and validate public artifacts.

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

The `src/` and `public/` tree is planned, not yet implemented.

## Technical Defaults

- Site: Astro.
- Writing: MDX.
- Diagrams: Mermaid and hand-authored SVG where useful.
- Interactives: small, reusable components embedded directly in essays and visuals.
- Data: CSV and JSON first.
- Larger analysis: local notebooks or scripts that export static artifacts into the site.
- Hosting: Vercel or Cloudflare Pages later.

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

The first site plan should introduce commands equivalent to:

```sh
node --version
npm run build
npm run check
```

If the selected package manager differs, record that decision in [docs/decisions](docs/decisions) and update the active plan.

