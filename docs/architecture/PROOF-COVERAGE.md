# Proof coverage and remaining trust

`bend PROOF.bend --verdict` currently checks 18 laws through the normal checker
and the independently built BendTT kernel. This is not a proof of the entire
application or compiler.

| Module | Checked obligation |
| --- | --- |
| Toolchain | Boolean flip roundtrip; setup plumbing only |
| Model | Move/inverse cancellation, four identical turns, inverse involution, replay concatenation |
| Certificate | Every value of the accepted-certificate type replays to solved |
| Notation | Showing and parsing any one of the 18 moves returns that move |
| Frame symmetries | Three frame transforms commute with mapped moves and fix solved; the two UD-subgroup transforms preserve the phase-two move set |
| Pruning identities | Same-face pairs combine to at most one turn; opposite faces commute; move/index codec roundtrip |

The specification is a 54-field facelet model, so the permutation laws quantify
over arbitrary cube field values rather than a few example scrambles. The
pruning identities justify the corresponding move normalizations; the proof
does not yet connect every detail of the search implementation to a universal
completeness theorem.

## Actual candidate boundary

The native engine calls `Certificate.certify` before it emits an answer. This
returns an accepted value only with evidence that Bend model replay is solved.
The bridge independently replays the emitted numeric move list through
Bend-generated JavaScript, and development tests compare moves with cubing.js.
The certificate proof field remains live in this Bend version so its soundness
law can use it. Exported JSON records a checked result; it is not a serialized
formal optimality proof.

## Executable evidence beyond the laws

- 10,000 moves cross-checked against independent cubing.js KPuzzle semantics.
- 1,000 arbitrary legal states, 18,000 packed/specification move comparisons,
  inverse/frame roundtrips, and 2,000 subgroup-frame checks.
- All 85,394 coordinate encoder/decoder roundtrips.
- Breadth-first layer counts through depth four: 1, 18, 243, 3,240, 43,239.
  A depth-stratified sample of 163 native optima agrees with that exhaustive
  shallow oracle.
- Complete audits of all four projected distance tables: goal uniqueness,
  finite entries, neighbor bounds, decreasing successors, and transition ranges.
- The experimental joint phase-one table has a complete 2,217,093,120-state,
  39,907,676,160-edge audit, following every-state packed/uncompressed agreement
  on a smaller product graph. See `docs/verification/JOINT.md`.
- Packed frame transforms have 3,000 facelet comparisons and 54,000 conjugation
  checks. Their universal refinement theorem is not among the 18 checked laws.

These finite audits give strong data evidence. Their implementation, abstract
transition refinement, optimized representation, input-validator correctness,
full traversal completeness, scheduling, and native/JS backend equivalence
are not all universally proved. There are no unsafe definitions or foreign
calls in the pure proof graph; runtime IO and graphics remain outside it.

## Root symmetry and portfolio invariants

Six searches use three axis frames and their inverse positions. Identical root
states are deduplicated, not run six times. A single owned array travels between
search tasks; tables are never cloned per task or shared unsafely.

UD-axis quarter-rotation and a perpendicular half-rotation normalize the
phase-two move subgroup. Their move-conjugation and move-set-closure laws are
checked. Root branches are reduced only when the transformed root is equal.
The diagonal axis transform is used for portfolio views, not for pruning the
fixed-UD subgroup's first moves.

The first-answer heuristic limits phase-two depth initially. On the first
answer, the improving searches restart without that restriction. Exact mode
keeps improving searches active alongside a complete exact traversal, sharing
the verified incumbent and a monotone lower bound. Optimality is reported only
when the established lower bound meets the verified answer length. It is
search-established optimality, not universal formal certification.

The parser/elaborator, translation to BendTT, compiler backends, host runtime,
hardware, and data-generation bridge remain trusted components. Failed proofs,
incomplete table generation, invalid candidates, or protocol inconsistencies
must fail closed; they are not reasons to weaken the laws.

## Packed small tier

PROOF.bend also imports the pure packed codec and generated small search and
portfolio. The runtime effects are not imported. The existing eighteen laws
are unchanged. BendTT accepts the expanded pure graph, but this does not add a
universal compression, generator-equivalence, or traversal-completeness theorem.

The packed pilot checks every one of the 4,923,465 used raw entries and all
1,048,576 packed physical words against the original generator. Fixed-work
native states, candidates, coordinates, and bounds match. These are exhaustive
data-identity checks for the current tables plus finite runtime evidence, not
a proof of all the missing refinement and compiler/backend bridges. The source
generator's stale-pattern and exact-access guards do not replace such a proof.
See [the packed result](../verification/R03-SMALL.md).
