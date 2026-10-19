# Owned continuation evidence

The isolated store, search, affine portfolio, and runtime pass semantic and
application checks. The default search and portfolio are unchanged. Timing,
whole-engine memory, application quality, and independent review remain open.
No promotion or search completeness claim follows from these checks.

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
Its live 500-slice comparison is still pending, along with the owned timer.

The frozen measurement plan requires at least ten percent repeated total-time
improvement, unchanged deadline coverage and quality, and at most five percent
first-answer p95 regression. Initialization and whole-engine RSS stay separate.
No profiling or release timing result is available yet. Independent review and
the comment reviewer remain not run under the solo instruction.
