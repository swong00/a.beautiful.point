# Static Site Skeleton

Status: active
Domain: site
Priority: P0
Created: 2026-05-17
Last updated: 2026-05-17
Owner/driver: mixed
Branch: N/A
Related: [../../decisions/0001-static-first-agent-legible-lab.md](../../decisions/0001-static-first-agent-legible-lab.md)

## Fresh Session Kickoff

Read these first:

1. [AGENTS.md](../../../AGENTS.md)
2. [ARCHITECTURE.md](../../../ARCHITECTURE.md)
3. [docs/core-beliefs.md](../../core-beliefs.md)
4. [docs/content-system.md](../../content-system.md)
5. [docs/agent-first-operating-model.md](../../agent-first-operating-model.md)
6. [docs/exec-plans/README.md](../README.md)

Current state:

- What already exists: repo-native agent foundation, north-star docs, content system, architecture doc, and execution-plan SOP.
- What is known to work: `node --version` returned `v24.14.0` during bootstrap.
- What is known broken or incomplete: no public site runtime, no package manifest, no lockfile, no routes, no content collections.
- Last validation command: `node --version`; `command -v npm`; `command -v pnpm`; `command -v yarn`; `command -v corepack`.
- Last validation result: Node exists; npm, pnpm, yarn, and corepack were not found on `PATH`.
- External state or access needed: choose or install a JavaScript package manager before dependency validation.
- Known traps: do not add a CMS, database, accounts, or backend; do not spend the first pass on perfect visual design.

## Goal

Create the first static-first public site skeleton for A Beautiful Point with enough structure to publish the manifesto, essays, visuals, labs, notes, and about content.

## Scope

- In scope: package baseline, Astro/MDX runtime, route skeleton, shared layout, initial content directories, minimal visual identity, and build validation.
- In scope: homepage copy from [docs/content-system.md](../../content-system.md).
- In scope: one simple diagram or interactive placeholder that proves visual artifacts have a home.

## Out Of Scope

- CMS.
- Database.
- User accounts.
- Newsletter integration.
- Paid products.
- Search.
- Analytics.
- Production deployment.
- Perfect brand design.

## Evidence / Current State

The repo was empty before foundation bootstrap except for `.git/` and `.DS_Store`. The first durable structure is now the agent-first documentation system. The technical stack choice is accepted in [../../decisions/0001-static-first-agent-legible-lab.md](../../decisions/0001-static-first-agent-legible-lab.md), but the runtime is not installed.

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Resolve package manager and package baseline | pending | A package manager is available and recorded; package manifest can be validated |  |
| Scaffold Astro + MDX runtime | pending | Install succeeds and framework files exist |  |
| Create route skeleton for `/`, `/manifesto`, `/essays`, `/visuals`, `/labs`, `/about` | pending | Local route smoke checks render expected pages |  |
| Add content directories and metadata conventions | pending | At least one stub content file validates with the chosen framework |  |
| Add minimal visual identity and one visual placeholder | pending | Homepage and visual route show the lab identity without layout overlap |  |
| Run exit validation | pending | Build/check commands pass or blockers are recorded |  |

## Validation Commands

Run from the repo root.

```sh
node --version
command -v npm || command -v pnpm || command -v yarn || command -v corepack

# After selecting a package manager, replace npm if needed.
npm run build
npm run check
```

Manual smoke checks once a dev server exists:

- `/`
- `/manifesto`
- `/essays`
- `/visuals`
- `/labs`
- `/about`

## Deploy / Operational Gate

N/A - no deployed artifact yet.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-05-17 | Use static-first Astro/MDX as the default starting point | It supports visual essays, MDX content, and static hosting without unnecessary backend surface |
| 2026-05-17 | Make package-manager availability the first validation boundary | The bootstrap environment had Node but no npm/pnpm/yarn/corepack on `PATH` |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| JavaScript package manager missing from bootstrap PATH | Environment validation | blocks-current-plan | P0 | Step 1 of this plan | open |
| Choose hosting target after local skeleton exists | Architecture bootstrap | new-plan-candidate | P2 | Future deployment plan | open |
| Add link/style checks for markdown docs | Foundation bootstrap | tech-debt | P2 | tech-debt-tracker.md | transferred |

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

