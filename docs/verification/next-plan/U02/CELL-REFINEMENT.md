# Whole-state reference refinement

The [finite-cell confirmation](u02-cells-v1/index.json) passed with 1,681 matching
seals, no resource stop and its worker gone. The next proof unit connects those
cells to the existing facelet specification for every move and finite word.

The generated module now states these equalities for every `PieceCells` value
and every reference move or word:

```text
to_facelets(turn(move, cells)) = Model.turn(move, to_facelets(cells))
to_facelets(replay(word, cells)) = Model.replay(word, to_facelets(cells))
to_facelets(solved_cells()) = Model.solved()
```

No legal-state or admissibility witness is assumed to prove these equalities.
The theorem covers the typed cell domain, including duplicate pieces and wrong
global parity. It does not say those configurations are physically legal.
Packed `Cubie` values and loaded joint data are not arguments to this theorem.

## Proof construction

Case-splitting all twenty cells would require an exponential product of local
states. The generator instead proves 54-field cube extensionality once. Every
move then supplies one equality per output sticker. Centers use reflexivity.
Unrotated cells use reflexivity, and rotated cells use finite color-projection
identities. This checks actual correspondence with `Model.turn`, not agreement
between two copied permutation arrays.

The word theorem uses structural induction and the checked one-move theorem.
It follows the existing first-move-at-the-head `Model.replay` convention.
This is distinct from the last-move-at-the-head internal word representation
used by the earlier exclusion kernel. No inverse-word convention is changed.

The generator now rejects malformed sticker permutations and moved centers
before writing a proof. Build the Lever shaped this field-wise construction.
It makes the exact transport proof reproducible without a hand-maintained
18-by-54 proof matrix. The cell types and runtime move implementation remain
the same shape as the previous unit.

## Rejecting a wrong transport

The guard keeps the earlier 36,000 runtime comparisons and their actual missing
corner-rotation counterexample. That runtime mutant deliberately omits the new
refinement proofs. In a second mutant, the same incorrect transport remains
beside the universal theorem and must fail at `move_refinement`. The original
false local-rotation fixture still fails at `corner_encode_rotate`. Both public
checker entrypoints must reject each fixture at the expected location.

These rejection checks matter. The new theorem must detect the exact transport
mistake that the previous sample driver detected. A missing import or unrelated
type error does not pass the guard. The sample report now labels itself as
sample-only evidence instead of carrying a global proof-status flag.

The move, word and solved-view proofs pass Bend and BendTT. The
[full guard](u02-cells-refinement-guard-v1/guard.json.gz) also passes all four
expected proof rejections, fresh module compilation, 36,000 finite runtime
comparisons, the root verdict and sixteen unchanged toolchain checks.
The [resource receipt](u02-cells-refinement-guard-v1/resource.json.gz) has no stop.

## Confirmation and remaining work

```sh
nix develop --command node bench/u02-cell-checks.mjs plan u02-cells-refinement-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-cells-refinement-v1-plan.json
```

Expected duration is two minutes with a three-minute cap, three GiB and at most
four low-priority lanes. No application rebuild, timing retry, distance table,
release-holdout use or independent review is included.

Injectivity of the whole-state embedding, concrete inverse reconstruction,
packed-state refinement and loaded-bound admissibility remain open. This does
not complete NP01–NP03 or certify optimized search. Production pruning and
defaults stay unchanged. The failed performance gate remains inconclusive.
