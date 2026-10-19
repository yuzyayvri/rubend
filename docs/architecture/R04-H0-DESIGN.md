# H0 symmetry prototype

Current status supersedes the historical proposal below. The complete H0 table,
native audit, and independent BFS now agree on all 117,567,450 entries. Direct
contours miss the ten-percent marginal gain over inverse-three. The application
canary passes 1,750 jobs with sixty deadline length and lower-bound ties, not a
quality gain or default promotion. Read docs/verification/R04-H0-TABLE.md and
docs/verification/R04-H0-REFERENCE-CONTOURS.md. The six-edge fallback and remaining
projection decisions are pending.

Original foundation status: the full forty-eight-case specification action is implemented. The five
approved action laws pass the ordinary checker and BendTT. Runtime regression,
native comparisons, and deliberate-error rejection pass. The raw corner codec
also passes all 153,090 cases and target checks. The small quotient reaches
3,393 classes and passes representative/stabilizer audits and full oracle data
agreement. Raw/class distances agree at every state. Edge placements, moves,
symmetries, and combined-coordinate refinements pass their component checks.
Full H0 pruning data and strength results are not implemented yet. This is the R04
foundation, not a world-class solver claim.

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

The six S48 interfaces below are implemented pure Bend definitions. The
coordinate and bound interfaces remain planned.

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
- src/symmetry48.bend defines the Model.Cube action. The five approved statements
  live in src/symmetry48-laws.bend and their proofs in src/symmetry48-proof.bend.
  LAWS.bend and PROOF.bend import them. The IO comparison driver stays outside
  the proof graph.
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

The product metadata is planned as one owned 2^22-word array. Its logical
ranges are sparse corner map at zero, 3,393 representatives at 524,288, low
stabilizers at 528,384, high stabilizers at 532,480, 61,074 corner moves at
536,576, 623,700 edge moves at 602,112, and 1,663,200 edge symmetry entries at
1,228,800. The logical end is 2,892,000 words. Inputs remain separate during
assembly so sparse writes cannot overwrite unread dense class entries.

A corner-move word contains destination class and transformation to
representative. A product move first moves the edge placement, then applies
that representative transform. It assigns the destination's entire corner
stabilizer orbit at the same depth. A known orbit member at a different depth
is a build failure. Queue entries are unique newly assigned logical entries.

The planned exact-byte builder owns a 128-MiB distance array, a 512-MiB queue,
and the 16-MiB metadata array. Its prefix is bounded by expanded nodes, with
incomplete and complete states distinct. Full generation requires a measured
prefix with conservative audit/save margin inside thirty minutes. The audit
checks every logical entry, all eighteen neighbors, every stabilizer equality,
the unique derived goal, and a decreasing successor. The two serialized padding
bytes are 255 and are checked separately. No full build has run yet.

The raw corner goal is twenty-three and its class is twelve. The edge goal is
34,629 under the checked colex convention. Their product index is
derived at runtime. No part of the generator or loader assumes index zero.

The small class builder owns one 2^20-word array. Raw entries hold a class ID
and transformation to representative. Separate fixed ranges hold canonical
representatives and the low/high stabilizer masks. Incomplete, complete, and
failed builds are distinct types. Every target and metadata range is checked
before an array access. The expected class count is an admission check, not
a value silently substituted into the output.

This is preferred to materializing a 153,090 by 48 action matrix. Enumerating
only unassigned representatives requires roughly one orbit per class and
preserves all stabilizers. The reference transform remains the checked full
facelet action. A separate audit verifies each raw transformation back to its
representative and recomputes stabilizers rather than trusting generated bits.
This is a solo design pass. Raw/class distances remain a subsequent check.

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

## Specification implementation

The existing model owns fifty-four U32 facelet fields and eighteen typed moves.
Existing three-frame transforms serve the portfolio and subgroup pruning.
The new module is separate. It does not change those callers or assume that all
forty-eight transforms preserve the ten-move subgroup.

Two action shapes were considered: one generated cube expression per symmetry,
and a position permutation followed by a pointwise color action. The second
keeps color composition separate from cube composition. Generic field rewrites
then avoid splitting all color combinations across fifty-four fields. This is
a solo design choice, not an independently reviewed synthesis.

The color action inspects the high twenty-nine bits before changing the low
three. Any high bit set leaves the value unchanged. Values six and seven also
remain unchanged. This gives a structural proof for arbitrary U32 values.
A numeric wildcard did not give the checker enough information to reduce a
nested color action. The diagnostic and rejected proof layouts are recorded in
[the proof-cost issue](../issues/symmetry-proof-cost.md).

The generator owns the specification, finite proof cases, native comparison
driver, and deterministic test data. The law statements remain outside the
generator and an executable check compares them exactly with the approved text.
This specification is not the optimized packed-coordinate action. Any later
packed action must be compared with it before use in generation or search.

## Verifiable sequence and admission

The edge coordinate uses twelve two-bit slice labels, four from each slice.
Its dense index is the colex rank of the four E positions times seventy plus
the colex rank of the four M positions among the eight remaining positions.
It has 34,650 values. The index is derived rather than assumed zero at solved.
Boundary decoding rejects the first out-of-range value and U32 max.

This keeps the labeled placement available for direct moves and transforms,
instead of decoding a dense index in every action. Canonical representatives
fill each slice in order and fix corner parity without changing edges. An
independent two-sticker geometry oracle will check every move and symmetry
entry before product generation. Product representatives must repair parity
within an untracked tetrad, not swap edges across slices.

The first corner unit stores a four-of-eight separation mask and the existing
seven-trit twist rank in a branded Corner value. Its dense index is
twist * 70 + colex separation rank. A sparse key uses twist * 128 plus the low
seven separation bits. The unused last bit follows from the four-of-eight
constraint. The boundary decoder rejects indexes at or beyond 153,090.

This is preferred to storing only a dense U32 index. It keeps separation and
orientation distinct during prototype actions and makes the sparse lookup
explicit. The representative fills each tetrad in canonical piece order and
fixes edge parity without changing the corner projection. Typed eighteen-move
transitions and full-model reference transforms remain separate from the later
optimized action. Every representative, dense roundtrip, and sparse-key
collision is checked before building the quotient. This unit adds no new law.

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
