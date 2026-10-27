# Fixed-work native cost experiment

The [native functional queue](u02-axis-search-v1/index.json) passed all three
workers on 179 cases. All original stack fields, metadata and replay-checked
answers agree. The separate audit checked 34,159 search advances without a
coordinate mismatch. All 1,618 seals and three resource receipts match, the
worker is gone, and IPC directories were removed. Emitted C uses owned arrays.
This is sampled functional evidence, not universal refinement or a speed result.

## Frozen comparison

The next experiment tests whether retained FB and RL coordinates reduce actual
native cost for the same search work. It does not combine coordinate reuse with
new inference, pruning, ordering or scheduling. Production remains unchanged.

Both uninstrumented workers use the current contour adapter with one million
steps, target twenty and RawInverseThree. Four fixed pilot cases run in five
alternating cohorts. The native control first runs against itself. A cohort
contains all four cases on each side. Every A/A cohort must stay within five
percent, with at least 100 milliseconds summed native work per side. Otherwise
the A/B stage is skipped, not retried for a favorable sample. Candidate and
control results must match by case, including nodes, bounds, moves and status.
Fuel exhaustion remains in the report. Answers replay independently of timing.

The raw cache digest warms file pages before measurement. Each side gets a fresh
worker. Startup wall time and ready RSS are separate from each request's native
time, host time and process CPU ticks. A 20-millisecond sampler records native
RSS, while the outer resource receipt records aggregate process-tree RSS.
The first request's effects remain visible. Case order reverses by cohort.
The release holdout is unopened.

## Profiling and limits

A separate `-pg -g` control build uses the already available pinned clang and
gprof tools. Its one-case profile includes initialization and is excluded from
timing comparisons. Raw line-level profile output, the compiler command and
actual search event counts are preserved. This is a diagnostic instrument,
not the release configuration. No profiler installation, kernel setting or
security mitigation changes are involved. The saved profile must be examined
before naming a limiter or accepting a performance explanation.

The experiment collects evidence. Its runner never promotes a default or marks
performance accepted. Full deadline quality, broader case strata, readiness
acceptance, process-tree memory interpretation and the existing U00 timing
issues still need their own evidence. A stable fixed-work A/A result would not
silently close those gates.

The fixed queue requests three GiB and low priority. Compile uses at most four
lanes for seven minutes. Profiling uses one lane for three minutes. Measurement
uses one lane for fifteen minutes. Confirmation uses at most four lanes for
three minutes. Expected duration is ten minutes, with a combined twenty-eight
minute cap. The existing thirty-minute heartbeat checks saved results.

```sh
nix develop --command node bench/u02-axis-cost-checks.mjs plan u02-axis-cost-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-axis-cost-v1-plan.json
```

The unit checks reject noisy controls, too-short cohorts, changed work or answers,
missing rows and missing sides. Independent review is not run under the solo
restriction. The [preflight resource record](u02-axis-cost-precommit-v1/resource.json.gz)
preserves the passing comparison controls, root verdict and sixteen unchanged
toolchain checks without a resource stop. No speedup claim accompanies the launch.
