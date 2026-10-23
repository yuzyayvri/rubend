# Actual inverse position lookups

The [fixed guard](u02-inverse-positions-v1/index.json) passes with 1,812 matching
source seals, no resource stop and its worker gone. Both pure checkers prove
all eight corner and twelve edge position lookups on typed roots presented by
arbitrary reaching words. Each actual lookup equals the corresponding piece
label in the reference inverse-word state.

`Cubie.corner_position` and `Cubie.edge_position` sum matching positions.
Those sums are not find operations on arbitrary malformed words. The proof
constructs both reference composition identities from reaching words. Finite
selection lemmas derive each direction of piece membership. Boolean match
equivalence and a finite sum-of-indicators theorem then establish the actual
numeric position. No uniqueness premise is assumed.

The generator is `bench/generate-inverse-positions.mjs`. A field registry owns
the corner and edge variants. The complete generated proof is about 672 KB
and stays outside Git. Repeated generation is byte-identical.

The emitted JavaScript passes 20,480 lookups on 1,024 reaching words. Another
20,060 checks cover 1,003 unrestricted raw packed vectors against independent
matching-position sums. Actual corner and edge source-weight corruptions have
counterexamples. Both public checker entrypoints reject each at its expected
source-shape theorem. The preceding packed replay module was rechecked after
its commit, and the root verdict and sixteen toolchain gates pass.

The full `Cubie.inverse` theorem still needs orientation recovery and packed
assembly. Validated-input reachability and loaded-distance admissibility
remain open. No production change, performance promotion or independent
review is claimed. U03–U07 remain open.
