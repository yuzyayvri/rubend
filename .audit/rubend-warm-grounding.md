# Warm comparison grounding

The read-only `warm_compare_how` explainer used `gpt-6.1-sol` at code revision
`2240220`. It traced the existing layout and paired comparison scripts, the
Engine protocol, and native search counters. No tests or builds were run.

## Overview

Adapt the existing two-entry profile registry and case loops. No product change
or new solver abstraction is needed. Compare the frozen baseline with the
refined raw binary using the same sealed raw cache, not the rejected block
representation.

## Key concepts

Preserve first-answer length, best-at-completion length, first-answer latency,
lower bound, optimal status, moves, and work steps. The native `nodes` field
counts search state-machine advances, not expanded nodes. Exact strength is the
interval between a verified incumbent and a monotone lower bound.

Native completion is distinct from the host emergency timeout. The latter has
`reason: time_limit`, lacks native counters and elapsed time, and replaces the
worker. It must not count as a successful native measurement.

## Flow

Seal binary, build metadata, cache, measurement dependencies, and corpus inputs
before and after. Historical baseline metadata must not require current source
hashes to equal its original source snapshot. Reuse the startup script's file
identity and awaited-shutdown patterns without extracting a shared library.

For each of five rounds, create a fresh worker pair and alternate construction
order. Both workers receive the same 163 shallow exact warmups. Require expected
length, lower bound, optimal status, and replay before measurement.

Run 32 fast cases at 1,000 ms, three exact cases at 2,000 ms, and Superflip in
exact mode at 5,000 ms. Alternate profile order by round plus case index. Keep
hard exact and Superflip summaries separate from the fast mean. Close and await
both workers before starting the next pair.

## Gotchas

Keep complete candidate trajectories, the native terminal event, host completion
time, startup time, failure records, and counters. Record budget overshoot.
The native clock checks occur between portfolio slices. Report the last
candidate observed by the requested deadline separately from terminal best.
Engine timestamps have one-ms rounding. A terminal answer can arrive too late
to be an answer at the requested wall-time budget.

Two raw workers hold roughly four GiB of arrays even while idle. A six-GiB,
900-second, one-low-priority-core batch is within the authorized envelope.
The requested solving budgets alone sum to 430 seconds, excluding initialization,
warmups, hashing, and shutdown. That sum is a planning bound, not an observation.

## Source map

- `bench/layout-compare.mjs` and `bench/paired-profile.mjs` define the existing
  profile registry, paired jobs, and separate first and best quality fields.
- `bench/startup-measure.mjs` defines input sealing and shutdown patterns, and
  exports process-identity and RSS sampling helpers.
- `apps/engine.mjs` defines host deadlines, replay checks, events, and emergency
  worker replacement. Reject replacement during a measured job.
- `src/main.bend`, `src/portfolio.bend`, and `src/search.bend` own native clock
  checks and state-machine counters.
- `bench/advanced-profile.mjs` constructs Superflip from edge orientation 4095.
  The older `hard.json` has no facelets and is not new measurement evidence.
