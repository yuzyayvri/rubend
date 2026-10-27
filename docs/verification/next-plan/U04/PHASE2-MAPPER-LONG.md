# Mapper duration check

The [one-million-probe check](PHASE2-MAPPER-COST.md) passed correctness but failed
its timing floor. The fastest samples were only 5 ms against a millisecond timer.
Keep that comparison inconclusive. Increase work to a fixed 50 million projected
probes per arm, rather than repeating unchanged short cohorts for a lucky result.
The expected claim remains native helper planning cost, not engine speed.

`bench/generate-phase2-mapper-long.mjs` derives the native entry, independent
oracle and result observer from the committed short check. It changes only the
iteration constants, emitted step count and relative import location. Exact
replacement counts reject source drift. Generated artifacts carry hashes.
The pure mapper and projection modules are unchanged. Reuse their checked source
and compiled JavaScript only after comparing every artifact and source seal.

Retain the five alternating cohorts, runtime seeds, dependent consumed checksums,
40320-entry independent oracle, actual corruptions, 100 ms minimum and five-percent
A/A floor. Initialization and the separate instrumented profile stay outside the
helper samples. There is no separate warmup. Both arrays were touched at build
time. All fifteen sample counts must equal 50 million. Reject missing work,
changed checksums or count drift. A noisy comparison stays inconclusive.

Inspection of the original emitted C identifies `spin_0` as the actual packed
corner selection/rank/parity computation, not merely generic dispatch overhead.
The short gprof run observed that function but had only six samples. The longer
profile must be interpreted against its generated C before reporting a limiter.
Neither result estimates the fraction of full solve time spent in this helper.

The serial `u04-mapper-long-v1` queue is estimated at four minutes, capped at
twelve. Build on CPU lanes 2,3,4,5 and measure on lane 2 at nice 10. Request at
most 3 GiB with the existing desktop reserve. Do not overlap previews or builds.
No production edit, distance table, pruning, new law, holdout or publication.

The [canonical archive](u04-mapper-long-v1/index.json) verifies 2,231 seals and
four receipts. All generated counts, independent oracle checks, actual corruption
controls, native checksums and unchanged proof/toolchain gates pass. The worker
is gone with no resource stop.

The timing comparison remains inconclusive. All fifteen samples now clear the
100 ms floor. Control median is 1,417 ms, range 1,403 to 1,429 ms. A/A median is
1,425 ms, range 1,404 to 1,496 ms. Mapper median is 273 ms, range 267 to 288 ms.
Two A/A cohorts exceed five percent, at 5.58 and 5.99 percent. The separate
2.76-second profile attributes about 70 percent to `spin_0`, the packed corner
selection/rank/parity computation. The generated direct loop accounts for about
20 percent and the mapper loop about 10 percent. This names the observed helper
work, not the limiter or savings fraction of a complete solve.

Keep the mapper private. Do not repeat this unchanged workload for luck or turn
its raw timing ratio into an engine claim. Continue other bounded roadmap work.
