# Execution Plans - SOP

This directory is the repo-native memory for substantial work. Plans preserve intent, current state, decisions, validation evidence, and follow-up work so a separate Codex session can resume without relying on chat history.

Execution plans are not an agent loop. Use plans as durable work packets and let Codex handle implementation, review, subtasks, automation, and git workflows through current tooling.

## Start Here

1. Read [index.md](index.md) to see active, blocked, and backlog work.
2. For a new idea, capture it in `backlog/` unless it is already committed for execution.
3. To execute, move or create the plan in `active/`, fill in Fresh Session Kickoff, and work one validation boundary at a time.
4. When blocked on access, ownership, package managers, deploy windows, or unresolved decisions, move the plan to `blocked/` and make the unblock condition explicit.
5. When done, record final validation evidence and move the plan to `completed/`.

## Directory Structure

```text
docs/exec-plans/
  README.md
  index.md                         # Dashboard for work discovery and triage
  backlog/                         # Potential work, shaped enough to revisit
  active/                          # In-flight execution plans
  blocked/                         # Valid plans waiting on external unblockers
  completed/                       # Finished plans with final evidence
  templates/
    plan-template.md               # Standard work-packet format
    codex-next-step-prompt.md      # Prompt for executing the next plan step
    codex-audit-prompt.md          # Prompt for read-only plan/code audit
    completion-summary-template.md # Optional closeout summary
  tech-debt-tracker.md             # Small cross-cutting debt items
```

## Plan Levels

Use the lightest artifact that preserves future context.

| Level | Location | Use when | Required detail |
| --- | --- | --- | --- |
| Backlog item | `backlog/` | The work is real but not scheduled | Problem, why it matters, rough scope, source |
| Execution plan | `active/` or `blocked/` | A session should be able to execute it | Fresh Session Kickoff, steps, validation, risks |
| Completed plan | `completed/` | The work is finished | Final validation evidence, decisions, follow-ups |

Do not turn every stray observation into a full plan. Add small or uncertain items to the current plan's Follow-Up Register first, then promote them when they become substantial or time-sensitive.

## Required Plan Sections

Every active or blocked plan should include:

- Fresh Session Kickoff: handoff context for future agents.
- Goal / Scope / Out Of Scope: work boundary.
- Evidence / Current State: live state, code state, linked facts, or deploy facts.
- Plan: steps with status and validation criteria.
- Validation Commands: exact commands, including sub-project paths.
- Deploy / Operational Gate: required smoke tests or N/A.
- Decision Log: dated decisions and rationale.
- Follow-Up Register: discovered work that should not derail the current plan unless it blocks the goal.
- Audit Notes: read-only review findings.
- Closeout: final validation and transfer notes.

Use these statuses consistently:

```text
backlog | active | blocked | completed | abandoned
pending | in-progress | done | blocked | canceled
```

## Working A Plan

At the start of a session, read `AGENTS.md`, this SOP, the index, the plan's Fresh Session Kickoff, and the listed reference docs. Then choose the next actionable pending or in-progress step, implement only that step or a coherent validation-sized batch, run the listed validation, and update the plan before stopping.

Update these fields whenever state changes:

- Last updated.
- Step status and validation evidence.
- Fresh Session Kickoff, if a future session needs new context.
- Decision Log, if a trade-off or architecture choice was made.
- Follow-Up Register, if new work was discovered.
- `docs/exec-plans/index.md`, if status, priority, or next action changed.

## Capturing Discovered Work

Do not derail the active plan for non-blocking discoveries. Capture them in the Follow-Up Register with a source, classification, priority, suggested destination, and status.

Use these classifications:

- `blocks-current-plan`
- `needed-before-prod`
- `tech-debt`
- `new-plan-candidate`
- `nice-to-have`

Promote follow-up work as follows:

- Blocking work stays in the active plan and becomes the next step.
- Production-readiness work becomes a backlog or blocked plan if it needs its own validation path.
- Small cleanup goes to [tech-debt-tracker.md](tech-debt-tracker.md).
- Larger or risky work gets a backlog plan using [templates/plan-template.md](templates/plan-template.md).

## Review And Closeout

Before moving a plan to `completed/`, run a read-only audit:

1. Verify validation commands pass or record why they could not run.
2. Check postconditions and operational gates.
3. Check architectural invariants from [../../ARCHITECTURE.md](../../ARCHITECTURE.md).
4. Check core beliefs from [../core-beliefs.md](../core-beliefs.md).
5. Confirm follow-up work is resolved, transferred, or intentionally abandoned.

Use [templates/codex-audit-prompt.md](templates/codex-audit-prompt.md) for a cold-session audit and [templates/completion-summary-template.md](templates/completion-summary-template.md) when the closeout evidence deserves a separate report.

