# Injective cell views and word cancellation

The [whole-state refinement confirmation](u02-cells-refinement-v1/index.json)
passed with 1,691 matching seals, no resource stop and its worker gone. The next
unit proves that the typed embedding loses no cell information and that inverse
moves and inverse words undo their forward action.

## Checked statements

The generated embedding now has a recovery function and a checked left inverse:

```text
recover_facelets(to_facelets(cells)) = cells
to_facelets(a) = to_facelets(b) implies a = b
```

These statements quantify over every `PieceCells` value. They do not claim that
recovering arbitrary facelets validates legality. The recovery function's
fallbacks only help express a total left inverse on the encoded domain.
Whole-state injectivity follows from that left inverse, rather than enumerating
every possible pair of twenty-cell states.

`bench/piece-cell-inverse.bend` uses injectivity, move refinement and the existing
proved `Model.turn_inverse` law to prove inverse moves on typed cells. It then
defines reverse-order move inversion and proves these statements:

```text
turn(inverse(move), turn(move, cells)) = cells
length(inverse_word(word)) = length(word)
replay(inverse_word(word), replay(word, cells)) = cells
replay(word, root) = solved_cells implies
  root = replay(inverse_word(word), solved_cells)
```

Replay append is proved by structural induction. Word cancellation uses that
append theorem and the inverse-move theorem. The existing root laws are imported
with their proofs and remain unchanged. There are no unsafe definitions or new
assumed laws in this dependency graph.

## Verification

The initial pure module passes Bend and BendTT. The guard checks two actual
mistakes. Swapping recovered corner cells must fail at `state_roundtrip`.
Inverting moves without reversing their order must fail at `cancel_word`, even
when its correct length proof is retained. Each fixture must fail through both
public check entrypoints at the expected location.

A separate runtime mutant omits those proof claims. The numeric ABI driver
compares 1,000 deterministic words with reverse-order reference inversion and
replays each word followed by its inverse. `U R` is a concrete wrong-order
counterexample. The runtime driver is sample evidence, not the universal proof.
The old runtime implementation is preserved as an exact source prefix from
commit `c664800`, so its passing 36,000 move comparisons are reused.

## Boundary and continuation

Word cancellation is not inversion of the represented cube state. In particular,
this unit does not prove the NP03 premise that reversing and inverting a solving
word solves the concrete inverse state. It does not certify `Cubie.inverse`,
left-action inverse updates, packed-state refinement or loaded-bound
admissibility. Those remain open, and NP01–NP03 are not marked complete.

The source-bound guard includes generation checks, both pure modules, actual
mutation rejection, the numeric word driver, the root verdict and unchanged
toolchain gates. The [passing guard](u02-cell-inverse-guard-v1/guard.json.gz)
preserves all four expected proof rejections. Its
[word samples](u02-cell-inverse-guard-v1/samples.json.gz) cover 48,864 moves.
The [resource receipt](u02-cell-inverse-guard-v1/resource.json.gz) has no stop.
The fixed post-commit confirmation is:

```sh
nix develop --command node bench/u02-cell-inverse-checks.mjs plan u02-cell-inverse-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-cell-inverse-v1-plan.json
```

Expected duration is two minutes with a three-minute cap, three GiB and at most
four low-priority lanes. No application rebuild, timing retry, table generation,
holdout use, production pruning or independent review is included.
