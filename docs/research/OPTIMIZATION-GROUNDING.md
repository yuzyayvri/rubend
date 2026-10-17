# Whole-engine optimization findings

Inspected 2026-10-17 at `d6120b2`. This is architecture research, not a new
benchmark. Two read-only `gpt-6.1-sol` explorations covered search algorithms
and Bend/runtime/application boundaries. The root checked the cited search,
coordinate, portfolio, proof, host, and browser paths. No engine was changed.

## The existing search has useful foundations and specific gaps

`src/portfolio.bend` initializes three axis views and their inverses. These are
serial, resumable two-phase tasks sharing one owned array. After the first
answer, exact mode adds a separate full-cube depth traversal. The task slices
are 20,000 state-machine steps for improvement and 60,000 for exact search.

`src/search.bend:109` checks three forward-axis joint estimates for surviving
exact children. Inverse root tasks are not inverse estimates at each exact
state. A lazy inverse estimate can reuse the audited joint cache without a
new large table. Whether the extra inversions and lookups save time is unknown.
The [pinned nxopt design](https://github.com/rokicki/cube20src/blob/f430921a48306874864b9f2ac8a059b43492fd3a/nxopt.md)
provides the primary precedent for inverse estimates and subgroup-specific
tight-bound pruning. Its rules need derivation for Rubend's subgroup.

`src/coordinates.bend:253` gives Corners, Edges, and Middle ten phase-two moves.
A full-corner database for unrestricted exact search needs separate all-18-move
transitions. A restricted-move distance can overestimate unrestricted distance.
The [existing corner proposal](NEXT-EXACT-BOUND.md) therefore needs this addition.
Its 40,320 permutations times 2,187 twists give 88,179,840 states. Byte distances
need 22,044,960 U32 words. Current prefix plus raw data occupies 285,525,248
words. Their sum, 307,570,208, fits the existing 536,870,912-word allocation.
This is capacity arithmetic, not measured memory or generation performance.

A nontrivial U turn is already in the phase-one subgroup but has unsolved
corners. A solved-corner distance cannot prune fixed-axis subgroup reduction.
Superflip has solved corners, so that estimate is zero at its root. Exact
full-corner distances are also invariant under inversion and HTM frame changes.
Six copies of that lookup would not add information. These mathematical
deductions need executable regression examples before integration.

`src/search.bend:269` increments `nodes` per state-machine step, including
enumeration, retries, and backtracking. No current counter separates actual
expansions, attempted moves, individual bound cuts, or large-table probes.
The [warm result](../verification/WARM.md) correctly calls these work steps.

## The native representation does work that may be removable

`src/search.bend:72` computes a full packed cubie turn even for phase-two
children. Phase-two goal and bound checks use only its coordinate triple.
A coordinate-only phase-two frame is a focused first kernel experiment.
The persistent Node/Retry frame lists and per-frame paths are another candidate.
An owned stack must account for suspended parents and Retry frames, not merely
the maximum solution length. Array bounds need checks because Bend indexes wrap.

Exact survivors currently compute two packed frame rotations and rank two
additional coordinate triples. Maintaining forward-axis coordinates trades
extra scalar state and small transition reads against those transformations.
That trade remains unmeasured. It should not be bundled with a heuristic change.

The [diagnostic source map](../verification/warm-v1/profile-source-map.json)
locates the hot fused search loops. Those two instrumented first-job profiles
do not isolate allocation versus arithmetic versus memory stalls. They do not
justify a tenfold reference-counting or function-inlining speed claim.

The raw payload has 277,136,640 U32 words. A fixed segmented layout using
2^28 and 2^24-word payload arrays plus the 2^23-word prefix allocates 1,120 MiB,
instead of 2,048 MiB for the single array. The geometric reduction is 45.3125%.
Extra dispatch, ownership plumbing, metadata, scratch, and actual RSS still need
measurement. This alternative preserves raw nibble values rather than using the
slower experimental block codec. Adding a corner table changes this layout math.

## The host reloads tables on cancellation

`apps/engine.mjs` cancels by killing the process and immediately starting
another. Native `main.service` already yields between bounded pure slices, but
does not poll cancellation then. A cooperative control channel might retain
the loaded table. Its IO design needs a separate pilot and forced-stop fallback.
Immediate replacement also permits transient old/new worker overlap. The
[one large-profile integration run](../verification/WARM.md#local-development-integration)
measured 336 ms until old exit and 1,944 ms for full recovery, not a distribution.

`apps/server.mjs:26` sends native readiness. `apps/web/main.mjs:93` ignores that
field and sets its own ready flag after a successful session response. The model
request map also lacks worker-failure rejection. These source-observed lifecycle
gaps are tracked in [the local issue](../issues/engine-lifecycle.md). No new
runtime reproduction is claimed.

The scene already skips hidden frames. While visible it renders continuously,
including idle periods. Demand rendering and retained meshes could reduce idle
graphics work. They cannot be counted as faster cube search.

## Proof coverage is narrower than the import graph

`PROOF.bend` imports search and table modules, but their presence does not prove
traversal completeness or loaded-data admissibility. The current 18 laws include
model identities, candidate replay, frame mappings, and pruning identities.
Use [the coverage report](../architecture/PROOF-COVERAGE.md) for exact scope.
The existing [proof plan](../architecture/PROOF-PLAN.md) already names validator,
representation, projection, table, traversal, scheduling, and incomplete-work
obligations. New theorem statements need separate approval before addition.

## Primary references support mechanisms, not Rubend forecasts

Korf supplies the [pattern-database foundation](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf).
The [pinned min2phase algorithm](https://github.com/cs0x7f/min2phase/blob/4d183b9eff8119cac72bc50ef35a7d8990740e06/Algorithm.md)
adds premoves and complementary phase-two coordinates to the multi-axis/inverse
approach already partly present in Rubend.
The [pinned H48 design](https://github.com/sebastianotronto/nissy-core/blob/1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88/doc/h48.md)
motivates balanced corner/edge projections, symmetry representatives, stabilizer
handling, conservative compression, and deeper symmetric frontiers. Its
machine-specific speed figures are not Rubend targets or measurements.

The [pinned Bend guide](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/guide/GUIDE.md)
and [limitations](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/README.md#limitations)
support owned data, dependent contracts, and the separate runtime trust boundary.
No foreign solver, unsafe shared array, or unsupported GPU path belongs in this plan.
