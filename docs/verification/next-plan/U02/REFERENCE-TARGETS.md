# Reference subgroup targets

The pure reference predicates now have checked closure and membership proofs.
They do not yet certify packed-coordinate refinement or loaded-table bounds.
Production search and the established 23 root laws are unchanged.

## Target structure

`inside_ud` requires U/D colours in the sixteen non-centre U/D stickers and
F/B colours in the four equatorial edge stickers on the F/B faces. The latter
constraint matters even when all U/D stickers are in place. The other two
targets transport this predicate through the existing proved frame rotation.

The generator reads the actual eighteen sticker permutations from
`src/model.bend`. It derives and checks the ten preserving UD moves, builds
the twenty-field proof witness, and reorders its evidence under each move.
No runtime search or copied pruning table is generated.

The selected UD moves are U, U2, U', D, D2, D', R2, F2, L2 and B2. For all
three axes, the source proves target identity membership, closure under those
axis member moves, inverse-member closure, and equality between move membership
and the target reached from solved. The mask theorem connects these members to
the candidate's actual 18-bit masks. These quantify over the reference model,
not sampled cubes.

`AxisBound` carries an axis, bound, admissibility, radius tightness and move
membership. It constructs the generic coverage witness with the actual proved
target closure and identity facts. The coverage caller no longer supplies
arbitrary target predicates or unproved closure functions. Admissibility is
still an explicit premise. The packed inverse reconstruction bridge is not
part of this proof.

## Reproducibility

The small conjunction proof helpers were written and checked first. The
deterministic generator writes the repetitive predicates and witness mappings.
`node bench/generate-subgroup-targets.mjs --check` rejects drift in source,
output or provenance. It performs no writes in check mode. The initial attempt
to destructure a computed pair was rejected by Bend; the final version extracts
equality evidence directly, avoiding a chain of twenty helper functions.

The precommit guard rechecks the original root verdict and the reference target
bridge with BendTT. It exports actual translated claim headers, compiles a JS
adapter, and checks reference/packed agreement on declared finite samples.
A deliberately swapped witness must fail with mismatched expected/observed
sticker predicates through both public checker entrypoints. A separate legal
two-edge-flip case must reject dropping the slice-orientation condition.

The first finite adapter run failed because it passed an unqualified move tag
from a separate compiled module. Read
[the resolved verifier issue](../../../issues/bend-imported-constructor-tags.md).
The [v3 guard](u02-target-guard-v3/index.json) passes the complete check.
Its 11,502 finite reference/packed comparisons include 2,534 positive cases
per axis and 6,000 sampled preserving transitions. The slice-orientation
counterexample is rejected by the complete target. A swapped witness is
rejected at both entrypoints with sticker s6 expected and s3 observed.

Both earlier resource failures remain preserved. V1 used the wrong imported
move tag. V2 passed the samples and correctly rejected the bad witness, but
its validator expected `ud(sN)` instead of the expanded Boolean predicate.
V3 checks the actual expected and observed sticker indexes from the generated
witness mapping. It does not weaken the negative condition to any nonzero exit.

The fresh confirmation is `u02-target-v3`. After committing, use
`node bench/u02-target-checks.mjs plan u02-target-v3` in the pinned shell and
launch its saved plan with the background runner. Expected duration is two
minutes with a three-minute cap, three GiB and four low-priority lanes. It
reuses the completed finite samples and rechecks generation, BendTT and the
unchanged toolchain/proof gates.

## Remaining obligations

Finite reference/packed agreement is not a universal refinement proof. The
checker must continue to label it as sampling. It must not claim that a
host-loaded bound satisfies `AdmissibleAt` merely because these target proofs
pass. The packed/reference projection, loaded-distance and inverse-path bridges
remain open before production pruning. No performance benefit is established.
