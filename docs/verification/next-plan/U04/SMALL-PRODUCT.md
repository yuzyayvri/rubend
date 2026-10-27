# Small phase-two product screen

The complete EP8 by corner-combination/parity product has 5,644,800 entries.
Before considering that build, screen a smaller product. Track the ordered
positions of edge labels 0–3 among the eight non-middle positions. Combine the
1,680 placements with the existing 140 corner combination/parity classes.
The logical distance domain has 235,200 entries, or 940,800 U32 payload bytes.

The private Bend module admits only validated subgroup-finishing inputs. It
uses the same ten phase-two moves. It does not admit fixed-axis reduction or
FullCube inference. All four tracked edges must occupy their solved positions,
and the corner class must be zero at the projected goal. This is not a solved
full-cube detector.

Two implementation choices were considered sequentially under the solo rule.
The complete EP8 product would require a larger build before conditional value
is known. The four-edge product tests the same complementary-information idea
with a bounded allocation. It does not repeat the rejected coordinate-only
frame representation or the inconclusive mapper timing experiment.

Native Bend generates the table with the existing owned-array breadth-first
traversal. A 524,288-slot array holds distances and the 18,200 transition entries.
A separate 262,144-slot queue holds discovered indexes. The two U32 arrays have
3 MiB of payload in total, excluding runtime overhead and serialized output.
Only the first 235,200 slots are distance entries. Padding is never evidence.

The fixed checks compare every edge-placement codec and transition with pinned
KPuzzle permutations. They audit every product edge, shortest distance,
decreasing path, and goal. Sampled legal restricted walks check actual cube
projection. Corrupted action and distance sources must produce counterexamples.
Keep unknown entries as failures. Both pure checkers and established laws stay
unchanged. This is finite graph evidence, not a new universal admissibility law.

No production code or saved cache changes. No performance or solution-strength
acceptance follows from constructing the table. Conditional value and native
lookup cost need separate evidence before an integration experiment. NP04–NP08,
large builds, release evaluation, publication, and independent review remain
outside this unit.

The queue is `u04-ep4-ccp-v1`, expected three minutes with a ten-minute hard cap.
Compile and proof jobs use at most 3 GiB and four low-priority lanes. Native
generation and the finite oracle run serially on CPU2 under 1 GiB. The source
emits C in the spot check, and boundary codecs pass sampled backend checks.
The complete audit has not run yet.

## Result

The queue passed. Canonical verification checks 2,510 source seals and three
resource receipts. The worker is gone, and no resource stop occurred. The
[archive](u04-ep4-ccp-v1/index.json) contains metadata and audit results, not
the generated distance payloads.

All 1,680 edge-placement codecs, 16,800 edge transitions, 10,240 actual-cube
child projections, and 3,082 goal/range refusals pass. The independent graph
audit checks all 235,200 distances and 2,352,000 directed edges. Every non-goal
entry has a decreasing path. There is exactly one zero-distance entry, and
the maximum projected distance is ten. The action, rank, and native distance
corruptions all have semantic counterexamples. Both pure checkers and the
unchanged proof/toolchain gates pass.

The product exceeds the maximum of its separate EP4 and corner-class distances
at 228,449 entries. Those are not Rubend's existing CP-by-middle and
EP8-by-middle bounds. The result establishes complementary information within
this abstract product only. Existing-bound conditional value, native lookup
cost, search quality, universal refinement, and production integration remain
unmeasured or unproved. Do not promote it on the marginal comparison.
