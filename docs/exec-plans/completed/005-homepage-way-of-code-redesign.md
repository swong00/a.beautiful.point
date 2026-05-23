# 005 - Homepage Way Of Code Redesign

Status: completed
Domain: site
Priority: P0
Created: 2026-05-23
Last updated: 2026-05-23
Owner/driver: Codex
Branch: N/A
Related: homepage redesign request inspired by https://www.thewayofcode.com/#20

## Fresh Session Kickoff

Read these first:

1. [AGENTS.md](../../../AGENTS.md)
2. [README.md](../../../README.md)
3. [ARCHITECTURE.md](../../../ARCHITECTURE.md)
4. [docs/core-beliefs.md](../../core-beliefs.md)
5. [docs/content-system.md](../../content-system.md)
6. [docs/exec-plans/README.md](../README.md)

Current state:

- The homepage uses the original static-site skeleton layout: a large sans-serif hero, three pillar cards, and the shared `SystemMap` SVG.
- The reference page uses off-white paper, serif typography, sparse chapter navigation, very large quiet whitespace, and a delicate generative visual paired with text.
- This redesign should borrow mood and interaction cues without copying content, source, or proprietary visual assets.

## Goal

Redesign the homepage so it feels quiet, editorial, and systems-minded in the spirit of the reference, while preserving A Beautiful Point's own identity, static-first architecture, and existing route structure.

## Scope

- In scope:
  - Redesign `/`.
  - Add a homepage-specific visual component if useful.
  - Tune shared CSS only where needed for typography, navigation, and artifact surfaces.
  - Run `pnpm run check`, `pnpm run build`, and browser smoke checks.
- Out of scope:
  - Copying The Way of Code copy, source, art, or exact page behavior.
  - Adding a CMS, backend, database, analytics, or new framework.
  - Redesigning every interior route beyond shared layout polish.

## Evidence / Current State

- Astro static site and content collections are already present.
- Current validation commands are `pnpm run check` and `pnpm run build`.
- Browser plugin can inspect the local site once the dev server is running.

## Plan

| Step | Status | Validation | Evidence |
| --- | --- | --- | --- |
| Capture reference cues and repo constraints | done | Reference inspected and repo docs read | Reference observed: paper background, serif type, sparse rail, delicate generative visual, text-first pacing |
| Build homepage visual direction | done | Homepage renders without overlap at desktop and mobile widths | Added `src/components/visuals/SignalField.astro`; redesigned `src/pages/index.astro`; tuned shared CSS in `src/components/layout/BaseLayout.astro` |
| Run validation | done | `pnpm run check`, `pnpm run build`, browser smoke checks pass | 2026-05-23: checks passed; browser smoke passed at 1280x720 and 390x844 with no horizontal overflow |
| Close plan | done | Move to completed and update index | Plan moved to completed and index updated |

## Validation Commands

Run commands from the repo root.

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
pnpm run check
pnpm run build
pnpm run dev
```

Browser smoke check `/` on desktop and mobile viewport:

- Homepage renders.
- Navigation is readable.
- Visual component is visible and nonblank.
- Text and controls do not overlap.
- No horizontal overflow.

## Deploy / Operational Gate

Before public deployment:

- `pnpm run check` passes.
- `pnpm run build` passes.
- Browser smoke check passes on desktop and mobile.

## Decision Log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-05-23 | Treat the reference as aesthetic direction, not a source to clone. | Keeps the work original and aligned with the lab's own systems/data identity. |
| 2026-05-23 | Use an original static SVG signal field instead of external imagery or copied canvas behavior. | Preserves static-first inspectability while carrying the delicate generative-system mood of the reference. |
| 2026-05-23 | Let the reference influence the homepage through paper color, serif typography, sparse numeric navigation, and generous whitespace. | These cues are durable and brand-appropriate without importing the reference site's content or implementation. |

## Follow-Up Register

| Item | Source | Classification | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- | --- |
| N/A | Closeout | nice-to-have | P3 | N/A | No follow-ups identified |

## Audit Notes

| Date | Reviewer | Verdict | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## Closeout

Final validation:

- Command: `pnpm run check`
- Result: Passed with 0 errors, 0 warnings, and 0 hints.
- Evidence: 2026-05-23 local run.
- Command: `pnpm run build`
- Result: Passed and built 11 static pages.
- Evidence: 2026-05-23 local run.
- Command: Browser smoke check against `http://localhost:4321/`
- Result: Passed on desktop 1280x720 and mobile 390x844.
- Evidence: Desktop audit reported no horizontal overflow, visible nonblank signal visual, and next-section hint; mobile audit reported no horizontal overflow, visible signal visual, and next-section hint.

Follow-ups transferred:

- None.

Residual risk:

- Interior pages inherited the quieter typography and flatter surface styling, but this plan only smoke-checked the homepage.
