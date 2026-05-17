# Visual Component System

Status: backlog
Domain: visuals
Priority: P1
Created: 2026-05-17
Last updated: 2026-05-17
Owner/driver: mixed
Branch: N/A
Related: [../../content-system.md](../../content-system.md), [../../../ARCHITECTURE.md](../../../ARCHITECTURE.md)

## Problem

Interactive explainers and visual essays will become expensive if every chart, system map, and simulation is built as a one-off.

## Why It Matters

Reusable visual primitives let the lab publish faster while preserving a coherent design language. They also make future agents more effective because the intended patterns are inspectable in the repo.

## Rough Scope

- Define first reusable diagram styles.
- Define chart and annotation conventions.
- Add one small interactive primitive for system flows or causal maps.
- Add visual QA expectations for desktop and mobile.
- Document when to use Mermaid, SVG, chart libraries, or custom components.

## Acceptance Direction

- The component system helps explain systems rather than decorate pages.
- Components are small, accessible, and inspectable.
- Visual examples render correctly in browser smoke checks.

## Source

Initial project vision and the "Visual architecture" model in [../../content-system.md](../../content-system.md).

