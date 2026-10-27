# Packed corner twists preserve typed packing

The [typed-packing confirmation](u02-typed-packing-v1/index.json) passed with
1,776 matching seals, no resource stop and its worker gone. This unit proves
the nonlinear corner-orientation field agrees with typed moves:

```text
co_word(Cubie.turn(Model.index(move), pack(cells)))
  = pack_co(PieceCells.turn(move, cells))
```

The statement covers all eighteen moves and every typed cell state. Typed
corner orientations are zero, one or two. It is not a claim about interpreting
arbitrary invalid twist encodings as typed cells.

## Proof construction

The source-shape probe first checks all eighteen actual `Cubie.turn` orientation
expressions against reference source positions and twist deltas. This succeeds
for arbitrary packed cubes and tests the decomposition before it is used.
No reference delta is adjusted to match an unexpected implementation result.

Finite corner cases prove addition modulo three matches the typed orientation
rotation. An eight-input congruence theorem and a sixteen-Boolean packing lemma
then connect those values to the packed word. The existing component readbacks
replace packed extracts with typed values. The resulting proof calls the actual
packed move implementation, not a copied orientation simulator.

This avoids enumerating all corner-orientation combinations or expanding
division over an entire symbolic word. The generated orientation proof is about
118 KB and imports the checked packing modules separately. Other packed-field
proofs remain separate too.

## Verification

Both pure checkers accept the source-shape probe and complete orientation
refinement. The guard rejects an actual wrong move delta, wrong modulo update
and wrong assembly shift through both public checker entrypoints. Each must
fail at its expected source-shape, finite-arithmetic or layout theorem.

The emitted-JavaScript driver checks 36,000 typed move cases. Half also compare
against the separately built legacy cubie module on legal states. Its source
and artifact hashes are checked before that evidence is used. Seventy-two
direct delta cases and 1,018 two-bit assembly inputs pass. Three runtime mutants
provide actual counterexamples. The root verdict and sixteen toolchain gates
also pass. No native backend certification is claimed.
The [passing guard](u02-corner-orientation-guard-v1/guard.json.gz) preserves
all six expected rejections. Its
[samples](u02-corner-orientation-guard-v1/samples.json.gz) record the three
actual counterexamples. The resource record has no stop.

## Remaining work

All four previous raw packed-word updates are proved, and corner orientation
now has a typed-preservation theorem. Joining the other four fields to typed
packing and proving the complete packed move relation remains open. Packed
inverse reconstruction, validated-input reachability, coordinate targets and
loaded-bound admissibility remain open too. No pruning, default or performance
promotion is enabled. Independent review is not run.

```sh
nix develop --command node bench/u02-corner-orientation-checks.mjs plan u02-corner-orientation-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-corner-orientation-v1-plan.json
```

Expected confirmation duration is two minutes with a three-minute cap, three
GiB and at most four low-priority lanes. It rechecks the complete pure module
and reuses the source-bound guard samples. No application rebuild, timing retry,
distance table, holdout use or publication is included.
