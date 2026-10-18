# H0 symmetry prototype

Status: architecture proposal. No H0 or full-48-symmetry implementation, table
build, new law, or speed result exists yet. The five exact law statements in
[the proof plan](PROOF-PLAN.md#proposed-full-symmetry-laws) need Yuzy's approval
before they enter executable law files. This is the next R04 direction, not a
reason to claim the current solver is world-class.

## Why this experiment

The corner-first result is strong on the declared half-turn diagnostic but
ties inverse-only time on uniform positions. Both short-circuit placements
fail that marginal uniform gate. Stop placement-only variants. The next
hypothesis must add information or demonstrate a separate kernel saving.

The inspected [H48 design at the pinned revision](https://github.com/sebastianotronto/nissy-core/blob/1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88/doc/h48.md)
describes h0, which combines oriented corner-tetrad separation with all three
edge-slice placements. Its corner coordinate has 153,090 raw states and 3,393
symmetry classes. Combining those classes with 34,650 edge placements gives
117,567,450 entries. These are upstream expected dimensions, not counts observed
from Bend. Verify them in a small prototype before admitting a full build.

The other sketch is two independent six-edge pattern databases. Each tracks
12P6 positions and six orientation bits, or 42,577,920 states. It avoids symmetry
and needs separate goal indexes for the two edge sets. [Korf's paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf)
combines such edge tables with corners by maximum. That is a valid alternative,
not a measured gain on top of Rubend's existing six joint estimates.

Choose an exact-byte h0 reference first. It follows the approved R04 direction
and establishes reusable symmetry/stabilizer infrastructure for later scaling.
Neither candidate's cardinality or mean heuristic predicts conditional search
speed. Keep six-edge tables as an independent fallback if the H0 prototype fails
its correctness, generation-cost, or search-cost gates. This comparison is a
labeled solo design pass, not independent review.

## Caller and data shape

A private FullCube bound caller supplies the owned raw table, a validated child
cube, and the remaining-depth cutoff. It receives the same table and a branded
full-cube bound. Reduction and subgroup frames must bypass it. U is already in
the existing reduction subgroup but need not have h0 bound zero. Superflip's
ignored orientations leave its h0 coordinate at the target. Test both.

Use a closed forty-eight-case symmetry type, not arbitrary wrapping U32 indexes.
Generate the specification action from the forty-eight signed axis-permutation
matrices. The action permutes facelet positions and relabels colors together,
so it fixes the canonical solved cube. Reflections reverse quarter-turn sense;
they are not cube-state inversion. Composition applies the right argument first.

Planned interfaces are pure Bend definitions. Their bodies are not implemented.

```text
S48.Symmetry
S48.identity() -> S48.Symmetry
S48.inverse(S48.Symmetry) -> S48.Symmetry
S48.compose(S48.Symmetry, S48.Symmetry) -> S48.Symmetry
S48.apply(S48.Symmetry, Model.Cube) -> Model.Cube
S48.map_move(S48.Symmetry, Model.Move) -> Model.Move

CornerClass + transformation-to-representative + complete stabilizer set
EdgePlacement
H0Index = CornerClass × EdgePlacement
CubeBound

H0Bound.full_cube(owned table, child, cutoff) -> owned table × CubeBound
```

The raw product has 5,304,568,500 states and exceeds U32. Keep its components
separate. Only the reduced 117,567,450-state index is flattened. Do not truncate
the raw product or infer capability from the existing two-GiB array capacity.
Declare a loader-selected profile and reject unknown or incomplete data.

## Modules

- scripts/generate-symmetry48.mjs emits symmetry cases, position/color permutations,
  mapped moves, composition, and inverse data from signed matrices.
- src/symmetry48.bend defines the Model.Cube action and the five proposed
  laws once approval is given. Its proofs stay in the pure graph.
- src/h0-corners.bend maps the raw separation/orientation to a class and one
  representative transform. It also retains every stabilizer, using two U32
  words for a forty-eight-bit set rather than assuming native U64.
- src/h0-edges.bend defines edge placements, moves, and symmetry actions.
- src/h0-table.bend owns the queue, byte distances, transition data, and audit.
- src/h0-bound.bend and scripts/generate-h0-profile.mjs isolate search changes
  from the default. src/h0-table-io.bend stays outside PROOF.bend and reuses
  bounded word IO.

No foreign solver supplies product search or tables. The inspected Nissy code
is a GPL-3.0-or-later reference/oracle only; no source has been ported for this
proposal. Record any later adaptation and preserve its required notices.

## Stabilizers and data validity

A self-symmetric corner representative can transform its edge coordinate in
several ways. Choosing one representative is not enough. Every equivalent
edge state under that corner stabilizer must receive the same distance.
Construction propagates the complete zero-cost stabilizer orbit when it assigns
a newly reached state. The audit checks orbit equality, all eighteen directed
move inequalities, range, unknown values, goal uniqueness, decreasing successors,
and complete visitation. Compute the actual goal index; do not assume it is zero.

The first table stores exact bytes with unknown 255. The logical count is not
divisible by four. Its word-aligned file therefore has 117,567,452 bytes, with
two declared padding bytes. Validate padding separately from logical distances.
Do not import upstream two-bit values as exact distances, add an offset to a
zero code, or fold partially tracked orientations as if they were symmetry-
invariant coordinates. Those are separate designs with separate obligations.

These five action laws do not by themselves certify optimized projection,
stabilizer reduction, loaded data, or search completeness. The existing T01,
T02, T03, S03, and S04 obligations remain. Finite audits are evidence, not a
claim of universal formally certified optimality.

## Verifiable sequence and admission

1. After law approval, generate the forty-eight specification actions and prove
   all five statements with the ordinary checker and BendTT. Preserve all
   existing laws. Check matrix closure, distinctness, inverses, and all mapped
   moves with an independent positional oracle.
2. Build the 153,090-state corner-only reference and its expected 3,393 classes.
   Exhaustively compare raw distances, class distances, actions, and stabilizers.
   Stop on a dimension or refinement mismatch rather than adjusting the target.
3. Enumerate all edge placements and refine their moves and symmetry actions
   independently. Test nontrivial stabilizers and deliberately missing orbit
   updates. A mutation must fail for the intended reason.
4. Run a bounded generation prefix before admitting the full byte table.
   Geometry estimates are a 128-MiB distance array, a 512-MiB queue, and modest
   transition/metadata arrays. Begin within 1,536 MiB on one low-priority CPU
   only if inspected desktop headroom permits. Estimate complete generation,
   audit, and save from actual progress with margin against thirty minutes.
   If it does not fit, stop for authority or redesign, not repeated batches
   that evade the cap. No full build is authorized by a geometry estimate.
5. Only audited complete data enters an isolated profile. Compare normal and
   inverse h0 refinements to the frozen inverse/corner controls on the same
   pilot and development cases, targets, and resource limits. Keep the release
   holdout closed. Count censored cases and require deadline quality, coverage,
   and latency floors before accepting a profile. Record initialization and
   native/host memory separately. Do not infer a 10x gain from table size.

Independent review remains not run under the solo instruction. It is not replaced
by these checks. No default switch, new service, GPU/cloud work, publication,
or larger resource authority follows from this proposal.
