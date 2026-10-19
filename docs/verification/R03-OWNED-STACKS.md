# Owned continuation evidence

Promotion of this owned-continuation implementation is rejected. Semantic and
application checks pass, but matched CPU, latency, lower-bound quality, and
memory results miss the declared targets. The default solver stays unchanged.
Independent review remains not run. No search-completeness claim follows.

## Storage boundary

The prototype owns 64 frame slots and 32 path words. Frames omit persistent
paths. Reads reconstruct reversed prefixes while consuming and returning the
same arrays. Logical occupancy and path length prevent wrapped indexing and
stale-prefix reads. Failure is sticky across reset.

Twelve storage checks pass in native and generated JavaScript execution.
They cover all frame fields, both capacity boundaries, invalid moves and
prefixes, rewinding, reset, missing slots, unsupported root depth, and corrupt
occupancy. Six isolated mutations break their intended check and exit with
the expected invariant failure. See
[the mutation records](r03-owned-foundation-v1/store-mutations.json.gz),
[JavaScript execution](r03-owned-foundation-v1/store-js.json.gz), and
[the pure-store verdict](r03-owned-foundation-v1/store-verdict.json.gz).

JavaScript composition uses one compiled entrypoint. The first attempt mixed
constructor objects from separate emitted modules and failed because their
constructor tags are module-relative. The corrected test checks the real
single-entrypoint composition. It does not establish a generic object ABI.

## Search state comparison

The generator derives src/owned/search.bend from the current src/search.bend
and the tested store. Source hashes and exact rewrite anchors reject drift.
The adapter reconstructs every legacy Node and Retry path, preserves stack
order, and compares every cube, frame, and metadata field.

Five cubes run in Improve, ExactContour, and FirstThenExact modes using two
separately generated Light tables. Every transition is compared, up to 20,000
steps per case. All 109,325 observed states match. The largest observed stack
has 20 frames. Some cases hit the cap. This is a bounded differential test,
not a universal storage refinement law or full search-completeness proof.
Read [the sealed run receipt](r03-owned-foundation-v1/search-equivalence.json.gz).

The observer also rejects seven changes to cube state, coordinates, depth,
goal, path, lower bound, and work. Two injected storage faults must propagate
through Search.run as ContinuationFailure, never a successful completion.
Read [the native checks](r03-owned-foundation-v1/observer-and-faults.json.gz).
An earlier hand-built reference frame omitted the initializer's root mask
and failed its positive comparison. The corrected fixture derives its baseline
from the real initializer before changing individual fields. The
[rejected fixture receipt](r03-owned-foundation-v1/observer-fixture-rejected.json.gz)
is retained. A too-large unrolled diagnostic also hit the compiler's arity
limit. A fuel-bounded test loop avoids that diagnostic shape.

Sequence Work into Verifiable Units keeps this search-only foundation separate
from portfolio migration. Prove It Works requires the native state comparison
and rejecting tests before timing. Neither principle substitutes for the
independent review prohibited by the solo instruction.

## Reproduction

Run nix develop --command just owned-continuation-test. The target checks
generation, both pure modules through BendTT, native and JavaScript storage,
observer rejection, fault propagation, and stepwise search equality.

For preserved mutation evidence, run the following in a resource-limited batch
with a fresh output directory.

```sh
node bench/owned-store-evidence.mjs build/experiments/FRESH-NAME
```

The accepted twenty-three domain laws remain unchanged. No new law is claimed.
The [final foundation batch](r03-owned-foundation-v1/final-checks.json.gz) passes
the reproduction target, all sixteen toolchain gates, the package rebuild,
and its source/artifact checks. The emitted native comparison program has
BLK_SHR zero. There is no performance or whole-application acceptance claim.

## Affine portfolio and runtime

The generator now also emits the isolated portfolio, runtime, raw entrypoint,
and legacy-compatible fixed-work adapter. Root descriptors are deduplicated
before allocating affine tasks. Restart reuses each task's arrays and preserves
its sticky failure. The portfolio propagates ContinuationFailure before
incumbent or completion logic. Both runtime service paths fail before a done
or optimal event, even when the incumbent length already equals its lower bound.

The first generic List<Task> queue compiled but emitted shared-array mode.
Frozen-source probes localize the trigger to recursive task restart. Single-task
restart, allocation, deduplication, and scheduling do not reproduce it. A nominal
affine Tasks queue restores unshared mode in recursive restart, full advance,
and the raw runtime. Simple generic array-list probes remain negative. This
does not establish a broader compiler rule or a speed benefit.

Light and Raw each match 350 general snapshots at 24 slices and 10,595 shallow
snapshots at 64 slices. All 21,890 pairs preserve every existing snapshot field.
All 163 known shallow optima per profile are established and independently
replayed. The first six-slice shallow run failed the reference's completion
requirement before testing the candidate. That bounded-work failure is retained.
No metric or equality field was relaxed.

The complete just test suite and all sixteen just check gates pass. Additional
isolated Light and Raw runs pass real retained-owner cancellation, fragmented
and stale control, stable descriptors, five native control failures, and process
and IPC cleanup. The isolated Light HTTP and export checks pass. This does not
replace the remaining hidden-browser and packaging acceptance lanes.

The [family archive](r03-owned-family-v1/index.json) binds the frozen binaries,
source graphs, complete compact snapshots, rejecting generic queue, diagnostic
probes, integration receipts, and cache digest. Snapshot compaction is lossless
and leaves every original record unchanged. The law-source guard compares all
23 statements with origin/main. PROOF.bend matches the actual 13e2557 resume
checkpoint, which already contains four segmented imports beyond main.

One integration launcher was stopped after its command composition was found
capable of masking an earlier failure. Its partial files remain preserved.
The corrected all-success-required batch is the passing integration receipt.
The reference timer had already completed its sealed build before that stop.
Both sealed timers subsequently pass the live 500-slice comparison below.

The frozen measurement plan requires at least ten percent repeated total-time
improvement, unchanged deadline coverage and quality, and at most five percent
first-answer p95 regression. Initialization and whole-engine RSS stay separate.
Independent review and the comment reviewer remain not run under solo work.

## Measured disposition

The five-cohort equal-work run passes all 1,630 shallow warmups and 110 measured
jobs. Every complete native snapshot agrees. Fast work costs 20.04 percent more
process CPU, with a cohort-bootstrap 95 percent ratio interval of 1.1831 to
1.2212. Exact work costs 11.83 percent more, with an interval of 1.0922 to
1.1408. The five cohort ratios range from 1.1754 to 1.2391 for fast work and
1.0752 to 1.1474 for exact work. Neither meets the speed target or the separate
five-percent overhead ceiling. Native and host wall observations are retained
separately in the [equal-work archive](r03-owned-measurement-v1/r03-owned-fixed-time-v1.json.gz).

The matched application run passes all 1,750 jobs without errors, missing
answers, forced cleanup, or source changes. All sixty deadline lengths tie.
Four Superflip lower-bound pairs regress from sixteen to fifteen. The fifth
pair ties at fifteen. These are native terminal bounds, not a host reporting
artifact. First-answer p95 changes from 12 to 14 ms for fast cases, 21 to 32 ms
for exact cases, and 1,752 to 2,099 ms for Superflip. Every group misses the
five-percent latency floor. The tiny short-case clock limits remain relevant;
they do not remove the CPU or lower-bound failures.

Native peak RSS is 2,142,320 KiB for the persistent reference and 2,142,356 KiB
for the owned variant in each cohort. This is not a useful whole-engine memory
reduction. Warm-file initialization medians are 1,760.43 and 1,781.95 ms,
respectively. Ranges are 1,754.03 to 1,805.06 ms and 1,747.52 to 1,852.45 ms.
These are not cold-disk results. Ten native workers shut down and remove IPC.

Separate instrumented runs complete ten identical ten-million-step jobs per
side. Samples occur in native array reads, generated ownership operations,
and search dispatch. The owned program has explicit generated run and advance
boundaries per work step. The [profile archive](r03-owned-profile-v1/index.json)
retains the generated-source snippets and full profiler text. Instrumentation
and initialization affect these samples. Their percentages and timings do not
quantify release overhead or establish a universal cause.

Both release comparisons use CPU 2, nice 10, a 6,144-MiB cap, and a ten-minute
batch cap, without concurrent builds, profiles, or previews. Desktop activity
is uncontrolled. Five alternating fresh cohorts limit, rather than remove,
that noise. The [measurement archive](r03-owned-measurement-v1/index.json)
binds configurations, resource records, all jobs, scores, RSS, and initialization.

The prototype remains recoverable for future compiler or representation work.
No broader claim about all owned data structures follows. Standalone phase-two
timing and structural allocation counts are not measured. Neither could
override the failed whole-kernel CPU and deadline-quality gates. No profile is
promoted, no new table is built, and no law is changed for this disposition.
