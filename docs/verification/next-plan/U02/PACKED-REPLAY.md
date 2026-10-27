# Inverse-word transport on packed replay

The [fixed guard](u02-packed-replay-v1/index.json) passes with 1,798 matching
source seals, no resource stop and its worker gone. Both pure checkers prove
packing injectivity, inverse-move cancellation and finite inverse-word
cancellation on typed packed states.

For a root presented by a reaching word, the generated module connects actual
packed replay to the reference root and its inverse-word root. A word that
solves the packed root transports to an inverse word that solves the packed
inverse-word root. The exact reference kernel reconstruction convention is
instantiated on those actual packed replay views.

This uses the checked five-field move relation. It does not assume that the
numeric `Cubie.inverse` function computes the inverse-word root. That remains
a separate obligation, as does reachability of every validated input.

The emitted JavaScript passes 1,024 roots, 1,024 cancellations and 1,024
inverted solutions. The sample inverse roots also agree with `Cubie.inverse`;
sample agreement is not a proof of that function. Two wrong conventions have
actual counterexamples and fail at the expected theorem through both public
checker entrypoints. The root verdict and all sixteen toolchain gates pass.

The generator is `bench/generate-packed-replay.mjs`. The fixed guard is
`bench/u02-packed-replay-checks.mjs`. Generated proofs and modules stay outside
Git. Deterministic generation and unchanged move evidence are checked. Two
early quantity-check failures and the passing initial probe are preserved in
`u02-packed-replay-probes-v1/`.

No loaded-distance admissibility, full search certification, production pruning
or performance promotion is enabled. Independent review is not run. U03–U07
remain open.
