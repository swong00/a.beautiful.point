# Tech Debt Tracker

Small, cross-cutting cleanup items live here when they do not deserve a full execution plan yet.

| Item | Source | Priority | Suggested destination | Status |
| --- | --- | --- | --- | --- |
| Add automated markdown link/style checks once a package manager exists | Foundation bootstrap | P2 | Future tooling plan | open |
| Resolve local pnpm store-location mismatch before adding dependencies; existing check/build and CI install pass | Completed plan 007 | P3 | Local package-manager configuration | open |
| Update Pages workflow actions when suitable versions remove the Node 20 runtime deprecation warning; publication currently succeeds on Node 24 | Plan 007 / Pages run 33359164922 | P3 | `.github/workflows/deploy-pages.yml` maintenance | open |
