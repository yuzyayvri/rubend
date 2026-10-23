# Finite piece cells for the reference bridge

The [control diagnostic](u02-noise-v1/index.json) passed with 1,673 matching
seals, no resource stop and its worker gone. All 24 requests match the saved
work and results. There are no major faults. Each worker's first request has
nine minor faults; subsequent requests have none. Runnable wait is about one
to seven milliseconds per request, while requests take about 0.8 to 0.9 seconds.
The observer uses about 1.5 to 6.5 milliseconds of CPU. Sampled frequencies stay
near 4.54 to 4.64 GHz. This does not identify the cause of the previous timing
failure. It does show that large waiting or fault spikes did not occur in this
instrumented probe. The failed development A/A remains failed.

Further timing retries would not discharge the missing proof bridges. The next
unit develops the finite representation needed for reference move and inverse
reconstruction proofs. Production and the cached-axis treatment are unchanged.

## Representation

`PieceCells` stores eight corner cells and twelve edge cells. A corner cell has
exactly 24 constructors for eight piece labels and three orientations. An edge
cell has exactly 24 constructors for twelve labels and two orientations.
Impossible local labels or orientations cannot inhabit those types. Whole
states may still contain duplicate pieces or wrong global parity. This type is
not a claim of physical legality.

The generator reads cell slots and colors from `Cubie.validate` and the color
functions. It reads all eighteen move permutations from `Model.turn_*`.
Every transported cell must come from exactly one cell of the same kind, with
a cyclic slot order. Reflections and cross-kind mappings are rejected. All
48 non-center stickers are covered exactly once, leaving the six fixed centers.
The manifest records the actual slot, color and transport data.

Two alternatives were examined solo. Direct symbolic U32 bit manipulation
would keep the optimized layout but needs arithmetic facts before geometric
composition becomes visible. Finite typed cells make each local orientation
case explicit. Choose the latter as an isolated proof model, not a replacement
solver. Type System Discipline shaped the separate cell enums. Build the Lever
shaped deterministic generation from the existing specification.

## Proof and test boundaries

The pure module checks with Bend and BendTT. Its total finite proofs cover
successful decoding of encoded cells, recovery round trips, encoding
injectivity, rotation correspondence with sticker colors, and complete corner
or edge orientation cycles. Public color decoders return `None` for unrecognized
colors. The recovery helper's fallback is only used to prove a left inverse on
encoded values. It is not a validated input parser. Numeric test adapters use
the predeclared 0 through 23 domain.

The guard compares 2,000 sampled typed states with the reference permutations,
including 1,000 legal packed states. It checks all eighteen moves per sample
and reconstructs the resulting cell indices. An actual generated module with
one missing corner rotation must disagree with the reference. A separate false
rotation proof must fail at `corner_encode_rotate` through both public checker
entrypoints. Compilation or an unrelated error is not that negative control.
The [passing guard](u02-cells-guard-v1/guard.json.gz) preserves both expected
proof rejections. Its [sample receipt](u02-cells-guard-v1/samples.json.gz) contains
the actual wrong-rotation counterexample. The root verdict and sixteen
toolchain checks also pass without a resource stop.

These finite cell proofs do not prove whole-state move commutation, packed
refinement, inverse reconstruction or loaded-data admissibility. Those remain
open. No NP statement is marked complete, and no established law changes.
Whole-state refinement is the next proof step, using the local color-rotation
identities at each of the 54 output stickers.

After the signed local commit, launch the fixed confirmation:

```sh
nix develop --command node bench/u02-cell-checks.mjs plan u02-cells-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-cells-v1-plan.json
```

Expected duration is two minutes, with a three-minute cap, three GiB and at
most four low-priority lanes. Confirmation rechecks generation and the pure
verdict, and reuses the source-bound guard's finite samples and unchanged
toolchain checks. There is no table generation, application rebuild, timing
acceptance retry, holdout use or independent review.
