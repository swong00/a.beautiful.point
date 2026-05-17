# 0001 - Static-First Agent-Legible Lab

Status: accepted

Date: 2026-05-17

## Context

A Beautiful Point needs to become a durable public lab for visual systems intelligence. The immediate risk is overbuilding platform machinery before the editorial and visual system has proven itself.

The agent-first process also needs repo-local knowledge, clear boundaries, and validation-sized plans so future Codex sessions can resume work without relying on chat history.

## Decision

Start with a static-first site and a repo-native operating model.

Default technical direction:

- Astro.
- MDX.
- Local CSV/JSON data.
- Mermaid, SVG, and small interactive components.
- Static hosting later.

Default operating direction:

- `AGENTS.md` remains a short map.
- `docs/` is the source of truth.
- Substantial work uses execution plans.
- Decisions and validation evidence are written into the repo.

## Consequences

- No CMS, database, users, or backend in the first version.
- The first engineering task is package-manager and site skeleton setup.
- Content structure and agent legibility are first-class architecture.
- Future deviations should be captured in a new decision record.

Related plan: [../exec-plans/active/001-static-site-skeleton.md](../exec-plans/active/001-static-site-skeleton.md)

