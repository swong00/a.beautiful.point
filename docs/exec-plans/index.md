# Execution Plan Index

Last updated: 2026-08-30

## Active

| Plan | Domain | Priority | Status | Next action |
| --- | --- | --- | --- | --- |
| [007-tic-pricing-slice-anatomy-lab.md](active/007-tic-pricing-slice-anatomy-lab.md) | labs | P1 | active | R1–R6 repaired and re-validated on `feature/007-tic-anatomy-lab`; re-review the repairs if desired, then Siew: claim-wording + strip-plot review, push the pipelines commits, approve the merge to `main` (the publish trigger) |

## Blocked

| Plan | Domain | Priority | Blocker | Unblock condition |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

## Backlog

| Plan | Domain | Priority | Status | Why it matters |
| --- | --- | --- | --- | --- |
| [002-manifesto-launch-package.md](backlog/002-manifesto-launch-package.md) | content | P0 | backlog | First public artifacts define the lab's voice and editorial promise |
| [003-visual-component-system.md](backlog/003-visual-component-system.md) | visuals | P1 | backlog | Reusable visuals keep interactive explainers from becoming one-off work |
| [006-transparency-in-coverage-discovery.md](backlog/006-transparency-in-coverage-discovery.md) | data | P1 | abandoned (superseded) | Superseded by completed pipeline-repo TiC work; active plan 007 owns the consumer artifact |

## Completed

| Plan | Domain | Completed | Evidence |
| --- | --- | --- | --- |
| [001-static-site-skeleton.md](completed/001-static-site-skeleton.md) | site | 2026-05-17 | `pnpm run check`, `pnpm run build`, and local browser route smoke checks passed |
| [005-homepage-way-of-code-redesign.md](completed/005-homepage-way-of-code-redesign.md) | site | 2026-05-23 | `pnpm run check`, `pnpm run build`, and desktop/mobile homepage browser smoke checks passed |

## Notes

- Promote backlog items to `active/` only when a session is ready to execute them.
- Move plans to `blocked/` when external conditions prevent progress.
- Keep this dashboard synchronized with plan status before stopping work.
