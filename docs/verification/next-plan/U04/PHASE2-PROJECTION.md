# Phase-two edge/corner projection preflight

The actual `Subgroup` frames finish to identity using the ten moves declared by
`Coordinates.phase2_move`. The current finish bound is the maximum of
corner-permutation/slice-permutation and UD-edge-permutation/slice-permutation
tables. This is not the reduction bound for reaching the subgroup. A restricted
finish estimate must not prune Reduction or unrestricted FullCube search.

The [pinned min2phase algorithm](https://github.com/cs0x7f/min2phase/blob/4d183b9eff8119cac72bc50ef35a7d8990740e06/Algorithm.md)
uses a phase-two edge-permutation/corner-combination-parity projection. Its corner
class has 140 values. Rubend's pilot is unreduced, with 40,320 UD edge permutations.
No upstream code is copied. Symmetry reduction is not included in this unit.

The private Bend module combines the existing UD-edge codec with the positions
of corner labels 0 through 3 and corner permutation parity. It derives canonical
representatives, choosing slice parity to keep the full cube legal. The actual
search Goal type guards projection and transition admission. The numeric test
boundary validates facelets and rejects noncanonical packed aliases. All runtime
inputs are still subject to the existing validator/refinement proof gaps.

First test all 40,320 corner permutations and 403,200 class transitions against
independent KPuzzle permutations, colex ranking and inversion parity. Sample
2,240 valid combined decodes and 512 checkpoints of one seeded restricted walk,
with all ten children each. Require actual counterexamples for missing parity, wrong action
and goal leakage. Check native/JavaScript checksum parity separately. The pure
module's checker verdict is not a new admissibility theorem or domain law.

The unreduced combined cardinality is 5,644,800. A four-byte entry needs 22,579,200
payload bytes, or 32 MiB as a standalone power-of-two U32 array. Appending it and a
40,320-entry corner-class mapper to the existing 4,923,465-word light prefix would
cross the current 32 MiB capacity and need 64 MiB under that layout. Lossless byte
packing could fit differently, but requires validated value ranges and cost
evidence. No combined distance table is built or admitted here.

For a later cost pilot, derive the 140 class from the already cached full-corner
permutation coordinate through a small mapper rather than reranking packed
corners on every probe. Compare that cost before adding another frame field.
No strength, cut-rate, memory or latency improvement is established yet.
No search integration, full table build, new law, holdout or publication.

The fixed `u04-phase2-v1` queue passed. Its [canonical archive](u04-phase2-v1/index.json)
verifies 2,196 seals and all three resource receipts. The worker is gone with no
resource stop. The counts above pass, together with 6,739 refusal checks and all
three executable corruption counterexamples. Native and JavaScript checksums
agree at 245,991,103 for seed 7. `just check` passes the unchanged proof/toolchain
gates, including `bend PROOF.bend --verdict`. The pure prototype's own verdict
passes. These checks are solo verification, not independent review.
