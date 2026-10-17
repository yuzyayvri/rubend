# Exact inverse-bound pilot

The lazy three-axis inverse bound passes the finite direct-contour gate on both
predeclared sets. It is experimental. The default application remains unchanged.
Application canaries and the full regression pass. Broader R02 work is separate.
No independent review runs under the user's no-subagents instruction.

## Mechanism and correctness boundary

The pure Bend implementation reuses the audited raw joint table. It computes
the inverse only after all three forward estimates admit a full-cube child.
The three-axis variant stops once an estimate suffices to prune. Reduction and
subgroup frames bypass this bound. Existing moves, replay certificates, and
eighteen domain laws are unchanged.

[The design](../architecture/R02-INVERSE-DESIGN.md) compares lazy recomputation
with incremental dual state and records the expanded experiment-file boundary.
CubeBound names the full-cube goal. It is not an admissibility proof. Inversion
preserves full-cube distance under the inverse-closed HTM move set, but the
packed-model, projection, loaded-data, and traversal proof bridges remain open.

The independent checks cover two thousand uniform legal inversions against
cubing@0.66.0 KPuzzle and all 46,741 facelet BFS states through depth four.
Inverse states and shallow distances agree. Synthetic all-fifteen data checks
goal dispatch only. Native and generated JavaScript guard checks pass.

The actual raw table confirms that U R is distance one from the fixed-axis
reduction subgroup while its inverse is distance two. Applying that inverse
estimate to reduction would be wrong. Fourteen thousand cutoff checks on one
thousand deterministic walk states agree with all three complete inverse reads.
The walk is not a uniform sample.

All sixteen toolchain and proof checks pass. The independent BendTT verdict is
ALL PROOFS CHECK. Sixteen negative measurement fixtures reject wrong profiles,
targets, bounds, fuel counts, timing values, replay, and completion claims.
The forward-only observer deliberately rejects changed source or unsupported
inverse profiles. It does not report inverse cuts or hardware memory events.

## Completed-depth measurement

Each worker owns one raw array. A request constructs a direct FullCube exact
search at depth zero, with no incumbent, and stops at lower bound fifteen,
a replay-checked optimum, or twenty million transitions. Reaching lower bound
fifteen means contours zero through fourteen are excluded. It does not mean
that depth fifteen itself is exhausted.

Native monotonic time surrounds actual search but excludes output. Parent-side
process CPU ticks include output. Native metadata echoes the selected policy.
The same native binary selects forward, one inverse axis, or three inverse axes.
This isolates the policy within the new implementation. A separate application
comparison uses the frozen R01 release binary, not that within-binary control.

Every cohort starts three fresh workers in rotating order. Each worker first
passes all 163 shallow native optima. Sixteen pilot positions and sixteen disjoint
development positions each run in five cohorts. The release holdout is unopened.
There are 480 measured jobs and 4,890 native shallow checks across these two runs.
Every measured target completes. There are zero errors or forced cleanups.

| Set | Policy | CPU-time geometric ratio to forward | Five-cohort bootstrap 95% interval |
| --- | --- | --- | --- |
| Pilot | One inverse axis | 0.8149 | 0.7803 to 0.8715 |
| Pilot | Three inverse axes | 0.6342 | 0.6185 to 0.6454 |
| Development | One inverse axis | 0.7936 | 0.7864 to 0.8060 |
| Development | Three inverse axes | 0.6216 | 0.6194 to 0.6238 |

Three inverse axes use about 36.6% less CPU time on the pilot and 37.8% less on
development for this target. Pilot paired CPU ratios range from 0.4545 to 0.7391,
and development from 0.4651 to 0.8125. Five-cohort resampling measures cohort
variation for these fixed positions. It is not a population confidence guarantee.

Pilot marginal CPU medians are 330 ms forward and 210 ms with three inverse axes.
Development medians are 410 ms and 230 ms. Their per-job ranges are 180 to 570 ms
and 130 to 330 ms on pilot, and 160 to 1,070 ms and 120 to 520 ms on development.
The paired geometric ratio, not a ratio of marginal medians, is the primary result.

The search is CPU-bound at this workload's scale. Native wall time divided by
process CPU time has a median near 1.01, with ten-millisecond tick quantization.
The pure timed loop performs S.advance transitions without IO. Median paired
work-step ratios fall to 0.4797 on pilot and 0.4699 on development. The extra
inverse computation costs time per step, so step reduction exceeds time reduction.
No instrumented observer or profiler timing contributes to these results.

Both runs use CPU 2, one native thread, nice 10, 4,096 MiB admission, no swap,
and a 600-second wall limit. The pilot takes 97.145 seconds and peaks at
2,269,748 KiB aggregate RSS. Development takes 109.833 seconds and peaks at
2,279,540 KiB. Workers run sequentially. Startup, raw-array memory, first-answer
latency, and application answer quality are not improved by this contour result.

## Reproduce and inspect

Build bench/contour-target.bend with bench/build-experiment.mjs. The comparison
configuration declares an absolute binary, audited cache and SHA256, shallow
fixture, output, target, count, split, and cohort count. bench/contour-compare.mjs
seals inputs before and after execution and retains fuel-exhausted jobs.
Run it through bench/run-limited.mjs after current headroom admission.

Compressed raw reports and resource receipts are under r02-v1/. The pilot and
development adjudications reproduce with bench/summarize-contours.mjs. These
records bind the native binary, frozen source hashes, table, host, corpus,
selected profiles, timings, work, terminal state, and child cleanup.

The first four-case pilot is retained separately and is not counted as an
independent confirmation cohort. A compile-time quantity error in the raw-table
test was fixed before its successful execution. Failed build receipts remain
ignored and are not counted as solver successes.

## Application canaries

Five alternating fresh pairs compare the frozen R01 raw release with the
three-axis inverse application entrypoint. Eight pilot fast cases use one second,
three earlier exact diagnoses use two seconds, and Superflip uses five seconds.
The 1,750 successful jobs include 1,630 shallow warmups and 120 timed jobs.
All sixty deadline solution-length pairs tie. Coverage and completed lower
bounds also tie with zero regressions. Hard exact cases remain censored at two
seconds. Faster direct contours have not yet produced a deadline strength gain.

First-answer p95 is 14 versus 12 ms for forty fast samples, 26 versus 19 ms for
fifteen exact samples, and 1,650 versus 1,702 ms for five Superflip samples.
The Superflip observation is 3.2% slower, within the finite five-percent canary
threshold. These small samples do not establish a general latency guarantee.
The runner admits 6,144 MiB on CPU 2 for 600 seconds. It completes in 222.908
seconds with peak aggregate RSS 4,414,572 KiB and clean child shutdown.

The complete development regression and toolchain checks pass in 107.871
seconds with 955,872 KiB peak aggregate RSS. That run uses a separate 2,048-MiB
scope on CPUs 3, 4, and 5 while the deadline comparison occupies CPU 2.
Background desktop activity remains uncontrolled and affects both benchmark
sides. Matched affinity and alternating pairs reduce, but do not eliminate, noise.

A hidden in-app browser renders the 3D cube, returns the expected four-move
optimum, exports its exact interval, seeks to the final state, backsteps, and
rejects R3 notation. A difficult exact case retains a nineteen-move verified
answer with lower bound fifteen instead of claiming optimality. Its export
incorrectly retains the last candidate's lower bound thirteen. This reproduced
[export-state issue](../issues/export-bound.md) belongs to R06 and is not a
solver-bound failure. The hidden tab, server, and native child are stopped.

## Remaining gates

The three-axis variant is selected for application canaries. It is not promoted
as the default raw profile. Complete browser and package rollout, the corner
database pilot, combined bounds, and
independent correctness/evidence review are not closed by these measurements.
No world-class strength, universal optimality, or order-of-magnitude gain is
claimed. No cache, binary, or dependency tree is committed.
