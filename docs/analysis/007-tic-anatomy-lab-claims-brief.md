# Analysis Brief — Anatomy of a Published Healthcare Rate

Status: approved repository review artifact for [exec plan 007](../exec-plans/active/007-tic-pricing-slice-anatomy-lab.md). This brief is not a published deliverable; it fixes the claims boundary the lab page must respect. Siew approved the reviewed page wording, retained strip plot, and publication on 2026-08-30 ("approve, push, merge and publish").

Created: 2026-08-30
Source of authority: pipeline public contract v0 (`pipelines/domains/transparency-in-coverage/public-contract/README.md`, approved 2026-08-24), release pin `b69ad4fd10fb128af66ffe48768c8a7f115b4d16`.

## Reader question

> "What did these files publish for this billing code, and what would I need to know before using it as a price?"

The lab answers by dissecting one real published record — its amount, its billing context, its lineage, and everything the record does *not* say — then letting the reader inspect the rest of the retained rows for that code and the other fourteen codes.

## What the data is

- 12,183 retained monetary negotiated-rate facts from eight Cigna Colorado July 2026 machine-readable files, filtered to fifteen exact CPT codes.
- Per-code retained row counts (99204: 1,994; 99203: 1,991; 99205: 1,741; 77067: 1,191; 74177: 707; 72148: 602; 70553: 535; 70450: 530; 80061: 504; 81003: 490; 85025: 440; 80053: 434; 45378: 371; 84443: 346; 80048: 307).
- Every fact carries: `fact_key`, `amount`, negotiated type (`fee schedule` 11,413 / `negotiated` 770), billing class (`professional` 11,374 / `institutional` 809), CPT service-code context, expiration lineage, a release-scoped opaque `provider_group_id`, and non-selecting plan-attribution status.

## Claims the page MAY make

1. **Retained-fact claims.** "This file published a fact stating amount X for CPT code Y with billing class Z" — one record, quoted as published, with its own fields.
2. **Per-code row counts.** "The slice retains N facts for this code" (exact counts above).
3. **Boundary statements.** The slice's own scope: Cigna, Colorado, July 2026 reporting month, fifteen CPT codes, monetary negotiated-rate facts only.
4. **Absence statements.** What the record does not contain: modifiers, care setting, plan attribution (`associated_plans_via_file` is empty and non-selecting), source-stated currency (USD is a contract assumption), provider identity (`provider_group_id` is a release-scoped opaque source context), currentness (July 2026 files are not a current-price claim).
5. **Educational explanation** of the Transparency in Coverage file format and of why the listed unknowns matter before treating a published fact as a price.

## Claims the page MUST NOT make

1. **No comparisons or rankings** — no "cheapest," "most expensive," "varies by N×," no sorting presented as a ranking, no cross-provider or cross-code price comparison framing.
2. **No aggregates** — no medians, averages, percentiles, ranges-as-headlines, or distribution summaries. The observed 99204 amount bounds are exploratory retained-sample values and stay out of all public text.
3. **No provider claims** — no provider identity, search, equivalence, or counting; one dot/row is one retained source fact, never one provider.
4. **No representativeness or completeness claims** — not "the market," not "Cigna's rates," not "what you'd pay"; the slice is a bounded retained sample of what specific files published.
5. **No current-price or plan-selection claims** — no "current rates," no plan membership or network claims, no percentage or per-diem metrics, no allowed amounts.
6. **No advice** — not consumer medical or purchasing advice; the caveat block says so explicitly.
7. **No comparability implication** — matching CPT codes alone do not establish comparable services (modifiers and setting are omitted from the slice; 3,625 staged rows carry modifiers); fee-schedule and negotiated rows, professional and institutional rows are never silently mixed in a visual.

## Display rules derived from the boundary

- Table rows are ordered by `fact_key` (deterministic source order), never by amount, so ordering cannot read as ranking.
- Any strip plot is faceted/labeled by billing class and negotiated type, axis labeled as "retained published amounts," one dot = one retained fact, with the caveat block adjacent.
- The caveat block appears beside every visual and carries: July 2026 file boundary, bounded retained sampling, USD contract assumption, missing plan/modifier/setting context, no current-price claim, not advice.
- All rendered values come from the checked-in verified assets, untransformed (formatting only: `$` prefix and thousands separators on display; underlying values unchanged).
