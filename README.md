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

The public site is live and includes:

- Astro `6.3.3` with MDX enabled.
- Local MDX content collections for manifesto, essays, visuals, labs, and notes.
- Static routes for `/`, `/manifesto`, `/essays`, `/visuals`, `/labs`, `/notes`, and `/about`.
- A shared layout, minimal visual identity, and first system-map visual.
- [Anatomy of a Published Healthcare Rate](https://abeautifulpoint.com/labs/anatomy-of-a-published-healthcare-rate/): an approved TiC lab with an annotated record, faceted plot, table excerpts, and fifteen static per-code routes, built from checked-in assets without client JavaScript.

Local environment resolved on 2026-05-17:

- `pnpm` `11.1.2` is installed at `$HOME/.local/share/pnpm/bin/pnpm`.
- A user-local Node `v24.14.0` is installed at `$HOME/Library/pnpm/bin/node`.
- Prefer this PATH when running site commands from Codex:

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
```

The user-local Node matters because the Codex-bundled Node hit a macOS native-module loading issue with Rollup.

## First Product Shape

The intended first public version is small, serious, and static-first:

- `/` - homepage
- `/manifesto` - founding essay
- `/essays` - durable thinking
- `/visuals` - diagrams, simulations, interactive explainers
- `/labs` - prototypes, notebooks, open fragments
- `/about` - mission, principles, and work-with-me bridge

Default stack direction: Astro, MDX, local CSV/JSON data, Mermaid/SVG diagrams, and small interactive components. Do not add a CMS, database, accounts, or backend until a specific artifact requires it.

## Local Development

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
pnpm run dev
```

Validation:

```sh
pnpm run check
pnpm run build
```

## Deployment

The public site is configured for GitHub Pages at:

```text
https://abeautifulpoint.com
```

Deployment runs from `.github/workflows/deploy-pages.yml` on pushes to `main`. Astro builds static output into `dist/`, and `public/CNAME` ensures the published artifact carries the custom domain.

In GitHub repository settings, set Pages to deploy from GitHub Actions and set the custom domain to `abeautifulpoint.com`.
