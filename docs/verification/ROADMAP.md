# Optimization-plan verification

Prepared 2026-10-17 against implementation base `d6120b2`.
This verifies a planning deliverable, not a new solver performance result.

## Scope

The deliverables are the [roadmap](../architecture/OPTIMIZATION-ROADMAP.md),
[source grounding](../research/OPTIMIZATION-GROUNDING.md), and
[open lifecycle issue](../issues/engine-lifecycle.md). CURRENT.md points to them.
No engine, application, table, law, dependency, or toolchain source was modified.
No prototype, solver benchmark, table generation, visible window, Astra call,
publication, or automation ran.

Two read-only gpt-6.1-sol explorers traced search and native/application
boundaries. A separate gpt-6.1-sol explainer reconciled the architecture.
The independent gpt-6-sol reviewer inspected the actual documents, source,
measurements, and the new decision-trail rows.

## Checks

The installed pstack plan checker reports `6 PR sections, 0 problems`.
The six IDs explicitly denote future local units, not opened PRs. Each specifies
dependencies, file boundaries, implementation/pilot steps, observable results,
unit/live/performance gates, and local acceptance authority.

A local reference/arithmetic check passed for all 28 relative Markdown links in
the three primary planning files. The revised documents retain those links.
The full-corner state count is 88,179,840. Its byte table needs 22,044,960 U32
words. Prefix, raw joint, and corner data total 307,570,208 words, below 2^29.
The proposed segmented raw allocation is 1,120 MiB versus 2,048 MiB, a 45.3125%
geometric reduction before overhead. These are arithmetic checks, not RSS or
speed measurements.

`nix develop --command just check` passed all 16 toolchain/proof checks,
including the independent BendTT verdict and negative false/open/unsafe proof
fixtures. The [raw result](roadmap-v1/toolchain-check.json) preserves its source
hashes and individual outputs. This does not prove the new roadmap's hypotheses.

`git diff --check` passed. Only documentation/checklist/trail files changed.
No code comments or suppressions were added, removed, or restored.

## Independent review

The gpt-6-sol reviewer found no blocker. It independently reproduced the plan
checker's zero-problem result, checked the capacity arithmetic, matched historical
startup/warm figures to evidence, and checked source-observed lifecycle claims.
It found no performance forecast, formal-proof overclaim, or authority expansion.

The reviewer raised two nonblocking execution risks. R01's initial file boundary
omitted host/protocol locations that typed result changes might need. The root
added those locations and retained a requirement for visible compatibility and
recorded browser-boundary expansion. The reviewer also asked for explicit
oracle-known subsets rather than assuming every hard uniform state has an
available optimum. The root added that distinction to R01 and the claim policy.

The sub-100 ms cancellation/reuse goal remains ambitious and unmeasured.
The new large-factor goals are research ambitions, not accepted results.
Implementation, new theorem approvals, hard-state oracle coverage, full table
build feasibility, packaging, and holdout evaluation remain future work.
