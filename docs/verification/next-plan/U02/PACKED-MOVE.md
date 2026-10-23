# Packed moves preserve typed states

The [fixed guard](u02-packed-move-v1/index.json) passes with 1,786 matching
source seals, no resource stop and its worker gone. Both Bend and BendTT
accept the complete relation for every typed cell state and all eighteen moves:

```text
Cubie.turn(Model.index(move), pack(cells))
  = pack(PieceCells.turn(move, cells))
```

The proof covers all five packed words. It calls the actual `Cubie.turn`.
It also proves facelet correspondence, finite-word replay preservation and
that the typed solved state packs to the actual packed solved state.

## Construction

`bench/generate-packed-move.mjs` substitutes typed cell bits into the actual
packed expressions. Finite rotation and flip lemmas connect each output bit to
the reference cell. Seventy-two field statements cover corner labels, both
edge-label words and edge orientation. The preceding corner-twist theorem
supplies the fifth field. Five-field extensionality joins the cube relation.

The first complete probe exposed two distinct corner-word projection functions
that the checker did not identify on an opaque cube. A case proof now connects
them explicitly. The rejected probe remains under
`build/evidence/u02-packed-move-full-probe-v1.json`.

The generator emits about six MB of proof source outside Git. Repeated
generation produces identical bytes. The separate packing and corner-twist
modules keep their unchanged source-bound evidence.

## Backend and rejection evidence

The emitted JavaScript passes 36,000 complete move comparisons on 2,000 states.
Half the states are legal cubes and also pass 18,000 comparisons with the
separately built cubie implementation. Six thousand facelet comparisons,
256 replay words and 128 legacy replay comparisons pass.

Three corrupt operations have actual counterexamples. They use the wrong move,
flip one extra edge bit or swap the corner words. Each also causes the expected
field theorem to fail through both public checker entrypoints. The archive
preserves all six rejection diagnostics, raw samples and resource receipts.
The root verdict and all sixteen toolchain gates pass.

## Boundary

Typed cells permit duplicate pieces and do not themselves certify global
reachability. The relation is universal on that typed representation, not on
arbitrary invalid packed encodings or all inputs accepted by validation.

`Cubie.inverse`, validation reachability, coordinate targets and loaded-distance
admissibility remain open. No search pruning or default changes are enabled.
No general speedup, native compiler certification or independent review is
claimed. U03–U07 have not advanced because this guard passed.
