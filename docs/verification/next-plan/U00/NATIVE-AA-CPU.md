# Native A/A CPU and wall diagnosis

The longer mapper comparison remains inconclusive. Its two A/A wall-time spreads
exceed5percent. The old observer records only one cumulative process CPU sample
after the three arms, so it cannot explain those individual differences.

This diagnostic has no candidate algorithm. A single executable performs the
unchanged direct packed-corner calculation for50milliondependent probes. Two
identical copies run for each of five frozen seeds, reversing their order on odd
cohorts. Reuse the existing independent checksums, mapper-source identities and
known helper profile. Do not repeat the mapper treatment or pick a new winner.

Observe each entire child with installed GNU Time1.10. Save user/system CPU,
wall time, involuntary/voluntary context switches, page faults, peak RSS and exit
status. The native program separately prints initialization and forced-work wall
milliseconds. Whole-process CPU includes startup, fixture setup and output. It is
not CPU time for the inner work interval. GNU Time's printed second fields have
centisecond resolution here; allow at most30ms when checking the one-core
CPU-versus-wall arithmetic. Require at least1000ms of native work for inference.

A new runtime FFI clock could isolate CPU inside the work interval. Use the
existing external observer first, with explicit boundaries and no new trusted
foreign code. Every sample must consume all50millionsteps and match the sealed
checksum before any timing is used. Failed, missing, duplicated or mismatched
samples fail the diagnostic instead of improving a median.

Keep the5percentmax/minratio threshold. Wall variation with stable CPU and a
changed off-CPU gap is consistent with waiting or preemption. Counters provide
support, not causal proof. CPU-side variation cannot be blamed on preemption
alone. Do not infer a governor, frequency, thermal or cache cause without further
evidence. Do not change priority, host configuration or security mitigations to
obtain a stable result.

Fresh stability applies only to this diagnostic. It cannot retroactively promote
the old mapper, explain browser cadence or establish full-solver performance.
Do not repeat this batch merely until it becomes noisy or favorable. The queued
run preserves raw resource counters and descriptive cohort/overall ranges.
Existing proof and source gates stay unchanged. Independent review is not run.

The fixed queue is `u00-aa-cpu-v1`, expected two minutes and capped at eight.
Compile/proof jobs use at most3GiB and four low-priority lanes. Ten native
processes run serially onCPU2under1GiB. No large cache, solver search, new distance
table, law, browser, publication or deployment is included.

## Result

The queue passed. Canonical verification checks 2,485 source seals and three
resource receipts. The worker is gone, and no resource stop occurred. The archive
is [u00-aa-cpu-v1/index.json](u00-aa-cpu-v1/index.json).

All ten processes consume the expected 50 million probes and match the reused
independent checksums. All five identical-work pairs stay within five percent
for both whole-process CPU and wall time. The largest paired CPU spread is
4.17 percent, and the largest paired wall spread is 4.14 percent. Native work
ranges from 1,444 to 1,524 ms. Every sample clears the one-second duration floor.
The parser's fourteen sample and three aggregate corruption controls pass.
Both proof checkers and unchanged toolchain gates pass.

The disposition is `control-stable-in-this-diagnostic`. The earlier noise is
not reproduced or explained. Whole-process off-CPU gaps range from 10 to 70 ms,
but pair differences are at most 10 ms. These observations do not establish a
historical scheduling cause. The centisecond external clock can round below
the native millisecond interval, within the frozen 30 ms arithmetic allowance.
The earlier mapper and browser comparisons remain inconclusive. No algorithm
or performance acceptance changes.
