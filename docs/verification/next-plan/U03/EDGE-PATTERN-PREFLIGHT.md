# Edge-pattern coordinate preflight

U03 begins with a bounded coordinate and action check. No pruning database is
generated in this batch. U02 remains unpromoted under its
[recorded disposition](../U02/DISPOSITION.md).

The state tracks ordered positions and orientation bits for selected edge
labels. Partial-permutation ranking gives `12! / (12-k)!` position states.
The declared one-to-six-edge domains have 24, 528, 10,560, 190,080, 3,041,280
and 42,577,920 states. The six-edge number describes cardinality, not allocated
RAM, scratch space or a generation-time estimate.

The two fixed complementary label sets are `[0,2,4,6,8,10]` and
`[1,3,5,7,9,11]` in the existing cubie convention. Smaller pilots use their
prefixes. Goal indexes are derived from the actual solved cube, not assumed
zero. No release holdout is used to select these sets.

## Representation and checks

`bench/edge-pattern-coordinate.bend` owns the ordered position/orientation
state and codec. The rank uses a count of smaller earlier positions. Unrank
selects from the remaining slots. The decoder rejects unsupported counts and
out-of-range indexes before converting a count to recursive fuel.

`bench/generate-edge-pattern.mjs` reads the source-sealed reference edge maps
and generates all eighteen actions. The KPuzzle oracle derives its transport
independently. The driver uses an available-slot ranker and a forward-weight
unranker rather than copying the Bend rank implementation.

The [fixed queue passed](u03-edge-pattern-v1/index.json) with 1,865 matching
source seals, no resource stop and its worker gone. All 11,112 one-to-three-edge
states and 200,016 move transitions pass, including inverse-action checks.
Another 1,024 six-edge states pass 18,432 transitions. Both label sets pass
22,800 full-cube projection checks. Actual position, flip and rank corruptions
have counterexamples. No performance gain or native result follows from this.

Two representations were considered sequentially under solo work. A fixed
six-slot record would be suitable for a later measured hot path. The initial
list representation keeps the one-to-six-edge codec shared and makes the
small exhaustive oracle practical. Native allocation and cost are unmeasured;
do not infer a good engine representation from this preflight.

## Exit and next work

This batch must pass codec bounds, all small-domain actions, independent full
cube projections, mutation counterexamples, both pure code checkers and the
unchanged root/toolchain gates. Neither code checking nor sampled agreement
proves NP05 or loaded-distance admissibility.

After correctness, measure a small native generation/lookup pilot, memory and
conditional information against the existing pipeline. Prepare resumable
generation and audit costs before seeking full-build admission. NP04–NP08 and
large databases remain separately gated. Production search is unchanged.
