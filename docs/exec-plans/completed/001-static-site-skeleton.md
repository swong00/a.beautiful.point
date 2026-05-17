# Static Site Skeleton

Status: completed
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

- What already exists: first static Astro/MDX site skeleton, local content collections, shared layout, route surface, and system-map visual.
- What is known to work: `pnpm run check`, `pnpm run build`, and local browser route smoke checks passed on 2026-05-17.
- What is known incomplete: no production deployment, analytics, search, newsletter integration, or final launch content.
- Last validation command: `pnpm run check`; `pnpm run build`; `pnpm run dev -- --host 127.0.0.1`; browser smoke checks for `/`, `/manifesto`, `/essays`, `/visuals`, `/labs`, `/notes`, and `/about`.
- Last validation result: check passed with 0 errors, 0 warnings, 0 hints; build generated 11 static pages; browser route checks found no horizontal overflow at desktop width or 390px mobile width.
- External state or access needed: none for local development.
- Known traps: use the user-local Node/PATH documented in README because the Codex-bundled Node could not load Rollup's native package on macOS.

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

The static-first site skeleton is implemented with Astro `6.3.3`, `@astrojs/mdx` `5.0.6`, `@astrojs/check` `0.9.9`, TypeScript `6.0.3`, and pnpm `11.1.2`.

Implemented route surface:

- `/`
- `/manifesto`
- `/essays`
- `/essays/what-makes-a-system-legible`
- `/visuals`
- `/visuals/problem-data-system-visual-insight`
- `/labs`
- `/labs/static-first-lab-notebook`
- `/notes`
- `/notes/field-note-on-alerts`
- `/about`

Implemented structure:

- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `astro.config.mjs`, `tsconfig.json`
- `src/content.config.ts`
- `src/content/{manifesto,essays,visuals,labs,notes}/`
- `src/pages/`
- `src/components/layout/`
- `src/components/visuals/SystemMap.astro`
- `public/favicon.svg`

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Resolve package manager and package baseline | done | A package manager is available and recorded; package manifest can be validated | pnpm `11.1.2` installed at `$HOME/.local/share/pnpm/bin/pnpm`; user-local Node `v24.14.0` installed at `$HOME/Library/pnpm/bin/node`; package manifest and lockfile created |
| Scaffold Astro + MDX runtime | done | Install succeeds and framework files exist | Astro `6.3.3`, `@astrojs/mdx` `5.0.6`, `@astrojs/check` `0.9.9`, TypeScript `6.0.3`; `astro.config.mjs` and `tsconfig.json` added |
| Create route skeleton for `/`, `/manifesto`, `/essays`, `/visuals`, `/labs`, `/about` | done | Local route smoke checks render expected pages | Primary routes plus `/notes` render with expected H1 and active nav in browser smoke checks |
| Add content directories and metadata conventions | done | At least one stub content file validates with the chosen framework | Five MDX seed artifacts validate through `src/content.config.ts` collections |
| Add minimal visual identity and one visual placeholder | done | Homepage and visual route show the lab identity without layout overlap | Shared layout, favicon, CSS identity, and `SystemMap.astro` added; browser checks found no horizontal overflow |
| Run exit validation | done | Build/check commands pass or blockers are recorded | `pnpm run check` passed; `pnpm run build` generated 11 pages; dev server ran at `http://localhost:4321/` |

## Validation Commands

Run from the repo root.

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
node --version
command -v pnpm
pnpm --version
pnpm run check
pnpm run build
```

Manual smoke checks once a dev server exists:

- `/`
- `/manifesto`
- `/essays`
- `/visuals`
- `/labs`
- `/notes`
- `/about`

## Deploy / Operational Gate

N/A - no deployed artifact yet.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-05-17 | Use static-first Astro/MDX as the default starting point | It supports visual essays, MDX content, and static hosting without unnecessary backend surface |
| 2026-05-17 | Make package-manager availability the first validation boundary | The bootstrap environment had Node but no npm/pnpm/yarn/corepack on `PATH` |
| 2026-05-17 | Use pnpm `11.1.2` and a user-local Node `v24.14.0` for site commands | The Codex-bundled Node could not load Rollup's native macOS package because of code-signing/library-validation constraints |
| 2026-05-17 | Approve `esbuild` and `sharp` build scripts through `pnpm-workspace.yaml` | pnpm `11` blocks dependency build scripts until explicitly approved |
| 2026-05-17 | Add `/notes` in the first route skeleton | The architecture invariant says navigation should preserve Essays, Visuals, Labs, Notes, and About |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| JavaScript package manager missing from bootstrap PATH | Environment validation | blocks-current-plan | P0 | Step 1 of this plan | resolved |
| Choose hosting target after local skeleton exists | Architecture bootstrap | new-plan-candidate | P2 | Future deployment plan | open |
| Add link/style checks for markdown docs | Foundation bootstrap | tech-debt | P2 | tech-debt-tracker.md | transferred |
| Browser screenshot capture timed out during local smoke checks | Local browser validation | tech-debt | P3 | Future visual QA tooling follow-up if screenshots become required evidence | open |

## Audit Notes

| Date | Reviewer | Verdict | Notes |
| --- | --- | --- | --- |
| 2026-05-17 | Codex | pass | Validation commands passed, route surface rendered locally, no CMS/backend/database was introduced, and architecture/core-belief boundaries were preserved |

## Closeout

Final validation:

- Command: `export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"; node --version; command -v pnpm; pnpm --version`
- Result: passed
- Evidence: Node `v24.14.0`; pnpm at `/Users/swong/.local/share/pnpm/bin/pnpm`; pnpm `11.1.2`

- Command: `pnpm run check`
- Result: passed
- Evidence: Astro check reported 17 files, 0 errors, 0 warnings, 0 hints

- Command: `pnpm run build`
- Result: passed
- Evidence: Astro generated 11 static pages in `dist/`

- Command: `pnpm run dev -- --host 127.0.0.1`
- Result: passed
- Evidence: dev server started at `http://localhost:4321/`

- Command: local browser smoke checks
- Result: passed with screenshot limitation
- Evidence: `/`, `/manifesto`, `/essays`, `/visuals`, `/labs`, `/notes`, and `/about` rendered expected H1/current-nav values with no horizontal overflow at desktop width; a fresh 390px mobile viewport rendered the homepage with no horizontal overflow and the system map constrained to viewport width. Browser screenshot capture timed out after route checks.

Follow-ups transferred:

- Item: hosting target selection
- Destination: future deployment plan
- Priority: P2

- Item: markdown doc link/style checks
- Destination: `docs/exec-plans/tech-debt-tracker.md`
- Priority: P2

Residual risk:

- First public content remains seed-quality and should be expanded in the manifesto launch package.
- Browser screenshot capture was not available as persisted evidence in this session, though DOM smoke checks passed.
