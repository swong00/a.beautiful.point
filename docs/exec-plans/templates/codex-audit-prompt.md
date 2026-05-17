# Codex Audit Prompt

Use this prompt for a read-only audit before moving a plan to `completed/`, or when an active plan needs an independent check.

Replace `{{PLAN_FILE}}` with the target plan path.

You are auditing `{{PLAN_FILE}}`. Do not modify source code.

## Read First

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/core-beliefs.md`
4. `docs/exec-plans/README.md`
5. `docs/exec-plans/index.md`
6. The full plan at `{{PLAN_FILE}}`
7. Any reference docs named in the plan

## Audit Checks

- Verify completed steps have evidence matching their validation criteria.
- Run or inspect the listed validation commands; record exact results.
- Check architectural invariants and import boundaries.
- Check that domain logic remains outside platform layers once such layers exist.
- Check that deploy or operational gates are clearly passed, blocked, or N/A.
- Check that decisions are captured in the Decision Log.
- Check that discovered follow-ups are resolved, transferred, or intentionally deferred.
- Check whether `docs/exec-plans/index.md` matches the plan status.

## Output

Return findings first, ordered by severity:

- `[FAIL]` for issues that should block completion.
- `[WARN]` for non-blocking risks or missing evidence.
- `[INFO]` for observations.

Then provide a short closeout recommendation: keep active, move to blocked, move to completed, or revise the plan.

If the user asks you to update docs, write audit notes only to the plan's Audit Notes section and keep source code unchanged.

