# Phase-two mapper cost pilot

The actual finishing frame already computes the full corner-permutation rank.
A 40,320-entry mapper can derive the 140-value class without repeating the packed
corner selection, combination ranking and inversion-parity loops. This experiment
compares those mechanisms in isolation. It does not estimate engine speed.

The pure module owns two affine U32 arrays. One contains all packed corner
permutations for the control fixture. The other is the proposed mapper. Each has
65,536 slots. Only the mapper's 262,144-byte capacity would be additional product
data. The mapper's useful payload is 161,280 bytes. These counts exclude Bend
runtime overhead and do not claim measured RSS savings.

An alternative would add and incrementally update another coordinate in every
frame. That changes frame storage and move-transition work. Test the smaller
mapper design first because the required rank already exists. Keep both designs
out of production until a useful bound, proof/data linkage and actual engine
comparison justify them. Symmetry reduction and a combined distance database
are outside this unit.

Exhaust all mapper entries against independent available-list permutation
ranking, colex selection and inversion parity. Check missing-parity and swapped
entry corruptions. Use one million checksum-dependent native probes per arm,
with the seed read at runtime. Run five cohorts with alternating control/A/A/mapper
order. Compare all consumed checksums with independent JavaScript expectations.
Measure initialization separately. Save sampled native RSS and process CPU, then
run a separate gprof-instrumented binary. Do not mix profile timings into samples.
The five cohorts retain the initialized arrays in one process. There is no
separate untimed warmup. Initialization touches both arrays before the first
cohort. Alternation and A/A expose remaining first-use and drift effects rather
than silently discarding them. The terminal recursion also reads one extra array
entry after the last projected probe on both arms.

The control reads an already packed cube word. The candidate reads a class using
the already available rank. Neither timing includes corner permutation ranking,
combined-bound access, frame mutation or search. The control's fixture-array read
is not an assertion about the engine's exact instruction sequence. A timing below
100 ms or A/A spread above five percent makes the micro comparison inconclusive.
Even stable micro evidence cannot establish a user-visible speedup here.

The fixed queue reuses the canonically verified projection preflight and runs
the new pure module's verdict, mapper checks, actual corruptions, native checksum
parity and unchanged proof/toolchain gates. The batch is serial and low priority,
with four build lanes, one measurement lane, at most 3 GiB and a twelve-minute
cap. No browser, table-cache load, large distance generation, pruning, new law,
holdout, independent-review claim or publication.

The `u04-mapper-v1` [canonical archive](u04-mapper-v1/index.json) verifies 2,209
seals and four receipts. The worker is gone with no resource stop. All 40,320
entries, 30 work guards, two actual corruption controls and native checksums
pass. The pure module and unchanged proof/toolchain gates pass.

The micro comparison is inconclusive. Across five samples per arm, control
median is 29 ms, range 28 to 30 ms. A/A median is 30 ms, range 29 to 31 ms.
Mapper median is 6 ms, range 5 to 6 ms. Every sample is below the frozen 100 ms
minimum. Two cohorts exceed the five-percent A/A limit, at 7.14 and 10.71 percent.
A single initialization takes 2 ms. These are raw planning observations, not
accepted speedup, startup or engine measurements.

The separate profile has only six 10 ms samples. Five fall in the generated
`spin_0` evaluator and one in the mapper loop. It cannot resolve the full limiter.
The millisecond timer is too coarse for the current samples. Freeze a separate
50-million-probe duration check to reduce quantization, retaining the same helper
algorithms, seeds, alternating cohorts, error checks and acceptance floors. Do
not rerun the one-million-probe comparison unchanged for luck. No default or
pruning change follows, even if the longer micro check becomes stable.
