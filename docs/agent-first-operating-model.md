# Agent-First Operating Model

This repo follows an agent-first process inspired by OpenAI's February 11, 2026 engineering post, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), and by the execution-plan SOP examples captured during project setup.

## Core Loop

Humans steer. Agents execute.

The human role:

- Set direction.
- Translate vision into constraints and acceptance criteria.
- Review outcomes and taste.
- Decide when a trade-off matters.

The agent role:

- Gather repo-local context.
- Execute one validation-sized unit of work.
- Run or document validation.
- Update durable repo memory.
- Surface blockers and follow-ups.

## Repository Knowledge Is The System Of Record

Future agents cannot rely on chat history. Anything important must be captured in versioned repo artifacts:

- `AGENTS.md` for the map.
- `ARCHITECTURE.md` for system boundaries.
- `docs/core-beliefs.md` for north-star intent.
- `docs/content-system.md` for editorial shape.
- `docs/exec-plans/` for substantial work.
- `docs/decisions/` for durable decisions that outlive one plan.

Use progressive disclosure: start with a small map, then read only the deeper docs needed for the task.

## Plan Levels

Use the lightest artifact that preserves future context.

| Level | Location | Use when | Required detail |
| --- | --- | --- | --- |
| Backlog item | `docs/exec-plans/backlog/` | Work is real but not scheduled | Problem, why it matters, rough scope, source |
| Execution plan | `docs/exec-plans/active/` or `docs/exec-plans/blocked/` | A session should be able to execute it | Fresh Session Kickoff, steps, validation, risks |
| Completed plan | `docs/exec-plans/completed/` | Work is finished | Final validation evidence, decisions, follow-ups |

Do not turn every stray observation into a full plan. Add small or uncertain items to the active plan's Follow-Up Register first.

## Working A Plan

At the start of a session:

1. Read `AGENTS.md`.
2. Read `docs/exec-plans/README.md`.
3. Read `docs/exec-plans/index.md`.
4. Read the target plan.
5. Read the plan's Fresh Session Kickoff and listed reference docs.
6. Choose the next actionable `pending` or `in-progress` step whose dependencies are satisfied.

During execution:

- Keep changes scoped to the selected step or coherent validation batch.
- Follow existing repo patterns and architectural invariants.
- Run validation commands listed for the step, or record why they cannot run.
- Do not work on newly discovered follow-ups unless they block the current plan.

Before stopping:

- Update `Last updated`.
- Update step status and evidence.
- Update Fresh Session Kickoff if future context changed.
- Add Decision Log entries for trade-offs.
- Add Follow-Up Register entries for discovered work.
- Update `docs/exec-plans/index.md` if status, priority, or next action changed.

## Review And Closeout

Before moving a plan to `completed/`, run a read-only audit:

1. Verify completed steps have evidence matching their validation criteria.
2. Run or inspect listed validation commands and record exact results.
3. Check architectural invariants.
4. Check deploy or operational gates are clearly passed, blocked, or N/A.
5. Check decisions are captured.
6. Check discovered follow-ups are resolved, transferred, or intentionally deferred.
7. Check `docs/exec-plans/index.md` matches the plan status.

Use [docs/exec-plans/templates/codex-audit-prompt.md](exec-plans/templates/codex-audit-prompt.md) for cold-session audits.

## Discovered Work

Use these classifications:

- `blocks-current-plan`
- `needed-before-prod`
- `tech-debt`
- `new-plan-candidate`
- `nice-to-have`

Promotion rules:

- Blocking work stays in the active plan and becomes the next step.
- Production-readiness work becomes a backlog or blocked plan if it needs its own validation path.
- Small cleanup goes to [docs/exec-plans/tech-debt-tracker.md](exec-plans/tech-debt-tracker.md).
- Larger or risky work gets a backlog plan using [docs/exec-plans/templates/plan-template.md](exec-plans/templates/plan-template.md).

## Autonomy Ladder

Increase agent autonomy only as the repo becomes more legible.

1. Documentation-only execution: agents update plans and docs.
2. Static site changes: agents edit content, routes, and styles with build checks.
3. Visual artifact changes: agents add diagrams and small interactives with browser checks.
4. Tooling changes: agents add lint, validation, and generation scripts.
5. Deployment changes: agents modify hosting and CI only with explicit plan validation.

## Entropy Control

When output drifts, do not rely on memory or repeated reminders. Convert taste into one of:

- A clearer doc rule.
- A reusable component.
- A validation command.
- A linter or structural check.
- A small tech-debt follow-up.

