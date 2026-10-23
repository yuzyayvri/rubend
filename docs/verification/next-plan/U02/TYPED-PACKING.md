# Typed cells now pack to the actual facelet view

The [four-field routing confirmation](u02-packed-routing-all-v1/index.json)
passed with 1,762 matching seals, no resource stop and its worker gone. This unit
connects typed cell states to the packed representation itself.

The generated packing constructs all five `Cubie` words from proof-visible
Boolean bits. It proves all forty component readbacks, including corner twists
and edge flips. The complete view theorem calls the existing implementation:

```text
Cubie.to_facelets(pack(cells)) = PieceCells.to_facelets(cells)
```

This holds for every typed cell state, including duplicate pieces or wrong
global parity. It is an encoding theorem, not a statement that those states
are legal or that every validated input has a reaching-word witness.

## Proof construction

Twenty-eight universal extraction lemmas cover eight nibble positions, eight
two-bit twist positions and twelve one-bit flip positions. Each is proved over
an arbitrary 32-bit word using the actual `Cubie.nib` or `Cubie.bit`, or the
exact two-bit shift/mask expression. Forty component equalities then connect
packed fields to the typed piece labels and orientations.

Finite cell cases prove the actual packed color functions agree with the typed
sticker colors. The view theorem combines those facts through 54-field
extensionality. It does not enumerate the product of twenty cell domains.
The generator emits separate extraction and packing modules, totaling about
190 KB, instead of extending the large move-routing module.

The bit-expression compiler is now shared. Regeneration after that factoring
produces byte-identical output for all 72 existing routing proofs. The guard
checks their archived evidence and unchanged production inputs, then reuses
those results. It does not repeat unchanged large proof or backend workloads.
The shared compiler also passes direct semantic and rejection tests.

## Verification

Both pure checkers accept the complete packing-view theorem and component
proofs. The guard rejects three actual mistakes through both public checker
entrypoints. A wrong corner-label bit fails at `corner_piece_0`. A wrong twist
bit fails at `corner_orientation_0`. Changing the actual facelet decoder fails
at `view_refinement`. Missing imports or unrelated failures do not pass.

The emitted-JavaScript driver checks 2,000 typed states, including 1,000 legal
packed fixtures. It makes 80,000 explicit component comparisons and checks
packed words, reserved bits and both facelet views. The same three runtime
mutants provide actual counterexamples. The root verdict and sixteen toolchain
gates also pass. This is not a native backend certification.
The [passing guard](u02-typed-packing-guard-v1/guard.json.gz) records all six
expected proof rejections. Its [samples](u02-typed-packing-guard-v1/samples.json.gz)
contain the three actual counterexamples. The
[compatibility receipt](u02-typed-packing-guard-v1/compatibility.json.gz) binds
the reused routing proof bytes and revision. The resource record has no stop.

## Remaining boundary

The packing view now has an actual proof. Preservation of that representation
by packed moves still needs its component bridge, especially corner-orientation
arithmetic. Packed inverse reconstruction, validated-input reachability,
coordinate targets and loaded-bound admissibility remain open. No new pruning,
default, performance claim or independent review is enabled.

```sh
nix develop --command node bench/u02-typed-packing-checks.mjs plan u02-typed-packing-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-typed-packing-v1-plan.json
```

Expected confirmation duration is two minutes with a three-minute cap, three
GiB and at most four low-priority lanes. It rechecks the complete pure packing
module and reuses the source-bound samples. No application rebuild, timing
retry, distance table, holdout use or publication is included.
