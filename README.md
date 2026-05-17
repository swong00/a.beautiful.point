# A Beautiful Point

A Beautiful Point is a visual systems intelligence lab.

Its purpose is to make complex real-world systems legible, beautiful, and actionable through data, software, diagrams, and interactive visual explanation.

The editorial promise is simple:

> Every public artifact should help someone see a complex system more clearly.

## Start Here

- [AGENTS.md](AGENTS.md) is the short map for Codex and future agents.
- [ARCHITECTURE.md](ARCHITECTURE.md) records the static-first technical direction and boundaries.
- [docs/core-beliefs.md](docs/core-beliefs.md) is the north star for product, audience, voice, and taste.
- [docs/content-system.md](docs/content-system.md) defines the site sections, artifact formats, and first content ideas.
- [docs/agent-first-operating-model.md](docs/agent-first-operating-model.md) defines how humans and agents work in this repo.
- [docs/exec-plans/README.md](docs/exec-plans/README.md) explains the execution-plan system.
- [docs/exec-plans/index.md](docs/exec-plans/index.md) is the current plan dashboard.

## Current State

This repository is intentionally at foundation stage. The durable working memory and execution-plan system now exist; the public site runtime has not been installed yet.

Bootstrap environment observed on 2026-05-17:

- `node --version` works and returned `v24.14.0`.
- `npm`, `pnpm`, `yarn`, and `corepack` were not available on `PATH`.
- The first active execution plan records package-manager setup as the first validation boundary.

## First Product Shape

The intended first public version is small, serious, and static-first:

- `/` - homepage
- `/manifesto` - founding essay
- `/essays` - durable thinking
- `/visuals` - diagrams, simulations, interactive explainers
- `/labs` - prototypes, notebooks, open fragments
- `/about` - mission, principles, and work-with-me bridge

Default stack direction: Astro, MDX, local CSV/JSON data, Mermaid/SVG diagrams, and small interactive components. Do not add a CMS, database, accounts, or backend until a specific artifact requires it.

