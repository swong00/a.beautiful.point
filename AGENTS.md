# Agent Guide

This file is the map, not the manual. Keep it short and point to deeper repo-local sources of truth.

## Read First

For any substantial change, read in this order:

1. [README.md](README.md)
2. [docs/core-beliefs.md](docs/core-beliefs.md)
3. [ARCHITECTURE.md](ARCHITECTURE.md)
4. [docs/agent-first-operating-model.md](docs/agent-first-operating-model.md)
5. [docs/exec-plans/README.md](docs/exec-plans/README.md)
6. [docs/exec-plans/index.md](docs/exec-plans/index.md)
7. The active plan named by the user, or the next actionable active plan

## Operating Principles

- Humans steer; agents execute.
- Repository-local markdown is the durable memory. If future agents need to know it, write it here.
- Work one validation-sized unit at a time.
- Follow existing plans and docs before inventing new structure.
- Keep `AGENTS.md` light. Promote detail into `docs/`.
- Capture non-blocking discoveries in a plan Follow-Up Register; do not derail the active work.
- Generalize professional lessons. Do not include proprietary names, data, screenshots, or internal-only details.
- Start static-first. Avoid CMS, accounts, databases, and backend services until a plan proves they are necessary.

## Site Defaults

- Prefer Astro + MDX for the public site unless a later decision changes this.
- Keep content inspectable in the repo.
- Keep data local and simple first: CSV, JSON, or checked-in generated artifacts.
- Use diagrams and visuals to clarify systems, not to decorate around unclear ideas.
- Every major artifact should reveal one "beautiful point" inside a messy system.

## Validation

- Run the validation commands listed in the active plan.
- If a command cannot run, record the exact reason in the plan.
- For frontend work, use browser smoke checks once a local server exists.
- Update plan status, validation evidence, Decision Log, and Follow-Up Register before stopping.

