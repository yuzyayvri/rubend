# Owned continuation evidence

The isolated store and search prototype pass their first semantic checks.
The default search and portfolio are unchanged. Portfolio integration, timing,
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
