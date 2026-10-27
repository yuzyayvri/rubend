# Constructed reference inversion bridge

The [word-cancellation confirmation](u02-cell-inverse-v1/index.json) passed with
1,703 matching seals, no resource stop and its worker gone. The next unit
constructs the exclusion kernel's `InversionBridge` for roots presented by a
reference reaching word. The bridge is no longer an assumed argument for those
roots.

## State composition

The generated composition selects a source cell from its left argument using
the right cell's piece label, then applies that cell's orientation. Local
substitution commutes with orientation rotation. Field-wise equality lifts that
fact to all eighteen moves and then to every finite word:

```text
compose(a, solved_cells) = a
compose(a, turn(move, b)) = turn(move, compose(a, b))
compose(a, replay(word, b)) = replay(word, compose(a, b))
```

These statements hold over typed cells without assuming global piece uniqueness.
No unproved associativity or legality law is used. The inverse-state construction
below is restricted to reachable roots.

## Inverse states from reaching words

For a reaching word `s`, define `root(s)` by replay from solved cells. Define
`inverse_root(s)` by replay of the reverse-order inverse word from solved cells.
Word inversion is now proved involutive, and cancellation is proved in both
orders. Composition then proves:

```text
compose(inverse_root(s), root(s)) = solved_cells
replay(w, root(s)) = solved_cells implies
  inverse_root(s) = replay(w, solved_cells)
replay(w, root(s)) = solved_cells implies
  replay(inverse_word(w), inverse_root(s)) = solved_cells
```

The second equality is the missing state correspondence. Ordinary cancellation
of a word followed by its inverse was not enough to establish it. Two reaching
words with equal typed roots also have equal inverse roots. The result does not
depend on choosing one particular reaching word.

Whole-state move refinement and embedding injectivity transfer the construction
to the existing facelet model. A further proved word equality connects ordinary
reverse-order inversion with the exclusion kernel's last-move-first replay.
`reference-inversion.bridge` returns the kernel's exact `InversionBridge` type.
`first_exclusion` instantiates the existing inverse first-move theorem with that
constructed witness. Target closure, the positive tight bound and admissibility
remain explicit premises. No admissibility witness is fabricated.

## Verification

Both pure checkers accept the complete reference bridge dependency graph.
The guard rejects a missing orientation in cell substitution at
`corner_substitute_rotate`. It also rejects replacing the inverse root with the
root itself at `compose_inverse`. Both public checker entrypoints must fail at
the expected location, not at an import or unrelated declaration.

The runtime driver checks 1,000 deterministic word pairs. It compares composition
with reference concatenation, checks inverse views and inverse-word involution,
and inverts solutions extended by an identity pair. Equivalent reaching words
must produce the same inverse view. An actual missing-orientation module gives
a counterexample, and `U` followed by `R` distinguishes composition order from
`R` followed by `U`. These are backend checks alongside the universal proofs.

An initial generator failure matched binders in the wrong order. Its receipts
are preserved, and the corrected module passes before the guard runs. The older
word-mutant driver now extracts its three numeric helpers by definition instead
of copying to end-of-file. Appended proof helpers no longer contaminate that
runtime fixture. Its original guard is rerun for this verification-tool change.
The [bridge guard](u02-reference-inversion-guard-v1/guard.json.gz) passes all
four expected proof rejections, 1,000 backend cases and sixteen toolchain gates.
The [sample receipt](u02-reference-inversion-guard-v1/samples.json.gz) records
48,347 moves. The corrected older
[word guard](u02-cell-inverse-guard-v2/guard.json.gz) also passes its original
1,000-word checks and four proof rejections. Neither resource receipt has a stop.

## Remaining boundaries

This proves the reference bridge for a reaching-word representation. It does not
prove that the optimized `Cubie.inverse` produces that inverse view. The packed
representation, validated-input reachability, joint-coordinate targets and
loaded distance data still need their actual connections. NP01–NP03 are not
marked complete for optimized search. No pruning or default changes are enabled.
Performance acceptance remains inconclusive, and independent review is not run.

```sh
nix develop --command node bench/u02-reference-inversion-checks.mjs plan u02-reference-inversion-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-reference-inversion-v1-plan.json
```

Expected confirmation duration is two minutes with a three-minute cap, three
GiB and at most four low-priority lanes. It reuses the source-bound runtime and
negative evidence. No application rebuild, timing retry, large table generation,
release-holdout use or publication is included.
