# Cost of equivalent product queries

The mapped probe passes finite correctness checks. This microbenchmark asks
whether its coordinate-fed query is cheaper than recomputing the same product
index from a cube. It does not measure the main solver, saved subtrees, solution
quality, or an accepted pruning policy.

Both paths use one optimized native binary and the same audited distances.
The direct path derives the product index from the packed cube. The mapped path
uses the CP/EP8 coordinates already available in phase-two nodes. Both retain
their owned cache, distance checks, and exact index/value result. The record
supplier is part of the measured path. This is not an isolated memory-load
latency measurement. The small working set is warmer than a full solver's data.

The input is the existing 15,609 observed rows, serialized as nine U32 words per
query. A dependent checksum selects the next row. Every result is compared with
that row's audited index and distance. Native mismatches, consumed steps, and
the independently computed final checksum must all agree. Cache loading, map
initialization and its complete digest finish before the native work timestamp.
Owners are returned past the end timestamp so their final disposal is outside
that interval.

One fixed one-million-query calibration per mode chooses a work size once from
1,2,4,8,16,32,64 million. Select the smallest choice predicting at least 1,250 ms
for the faster mode and at most ninety seconds for all fifteen samples. If no
choice fits, record no timing comparison. Selection uses duration and resource
admission only, not a winner or A/A noise. Freeze it before measurement.

Five cohorts each run direct, mapped, and identical direct processes. Reverse
the order on odd cohorts. Each cohort uses its frozen seed. All samples remain
in the report. Require at least 1,000 ms for native work and process CPU in each
sample, and no more than five percent A/A spread in either clock. Do not repeat
the experiment until a favorable result appears. A micro cost difference needs
at least ten percent in the same direction across every cohort, stable controls,
and whole-process CPU counters consistent with CPU-bound work.

Installed GNU Time records whole-child user/system CPU, wall time, context
switches, faults, RSS, and status. Those CPU values include initialization and
output. They are separate from the native inner wall interval. Printed process
clock arithmetic has a fixed 30 ms quantization allowance. A separate gprof
binary runs four million queries per mode. Its profiles include initialization;
its timings are excluded from the comparison. Source and payload hashes are
checked throughout.

The queue is `u04-small-cost-v1`, expected four minutes with a ten-minute cap.
Compile/proof jobs use at most 3 GiB and four low-priority lanes. Measurement
and profiling are serial on CPU2 under 1 GiB. The fourteen sample and three
aggregate corruption controls, calibration controls, pure verdict, emitted-array
mode, and unchanged laws/toolchain gates are fixed before launch.

No new distance table or law, real search pruning, whole-engine speedup, default
change, old mapper promotion, holdout, publication, or independent review is
included. A useful micro result still needs proof/data refinement and actual
search quality/latency evidence before integration.

## Result

The [archive](u04-small-cost-v1/index.json) verifies 2,632 seals and three
receipts. The worker is gone, and no resource stop occurred. Calibration fixed
32 million queries per sample. All fifteen measured samples match their
independent checksums with zero query mismatches. Both clocks clear one second,
and whole-process counters indicate CPU-bound work. The fixture controls, pure
verdict, array mode, profiles, and unchanged proof/toolchain gates pass.

The frozen verdict is `inconclusive-aa-noise`. Cohorts zero and three exceed
five percent A/A spread in both native wall and process CPU. Their native wall
spreads are about 5.91 and 11.49 percent. Do not rerun unchanged work for luck.

Descriptively, direct-query native wall cost has a median of 235.92 ns per probe
and range 229.72–257.81 over ten samples. Mapped cost has a median of 48.81 ns
and range 47.25–60.00 over five samples. Those values include record supply and
guards on this warm small working set. They are not an accepted speedup or a
whole-solver result. Both paths remain private.

The separate direct profile attributes substantial samples to `term_drop`,
`rfc_wrap`, `span_fade`, edge projection and placement ranking. The mapped
profile executes edge projection only for the 40,320 initialization entries,
rather than for every query. This confirms the intended work difference, but
profile timings are not comparison samples. CPU-side A/A variation remains
unexplained. No host configuration is changed, and the old mapper result is
not promoted. Pruning, refinement and actual solver quality/latency remain open.
