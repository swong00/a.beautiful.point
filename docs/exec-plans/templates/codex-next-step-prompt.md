# Codex Next-Step Prompt

Use this prompt when a fresh Codex session should pick up a plan and execute the next validation-sized unit of work.

Replace `{{PLAN_FILE}}` with the target plan path.

You are executing one validation-sized unit of work from `{{PLAN_FILE}}`.

## Read First

1. Read `AGENTS.md`.
2. Read `docs/exec-plans/README.md`.
3. Read `docs/exec-plans/index.md`.
4. Read the full plan at `{{PLAN_FILE}}`.
5. Read the plan's Fresh Session Kickoff and listed reference docs before changing files.

## Work Selection

Choose the next actionable `pending` or `in-progress` step whose dependencies are satisfied. If all remaining work is blocked, update the plan with the blocker and stop.

Do not work on newly discovered follow-ups unless they block the current plan. Capture non-blocking discoveries in the plan's Follow-Up Register.

## Execution Rules

- Keep the change scoped to the selected step or coherent validation batch.
- Follow existing repo patterns and architectural invariants.
- Run the validation commands listed for the step or explain why they cannot run.
- Update the plan before stopping:
  - `Last updated`
  - step status and evidence
  - Fresh Session Kickoff if future context changed
  - Decision Log for trade-offs
  - Follow-Up Register for discovered work
  - `docs/exec-plans/index.md` if status, priority, or next action changed
- Commit only if the user explicitly asked for a commit or PR workflow.

## Final Response

Summarize what changed, validation run, plan updates, and any remaining blockers or follow-ups.

