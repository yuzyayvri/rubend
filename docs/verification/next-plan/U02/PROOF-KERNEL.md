# Subgroup exclusion proof kernel

The [guard receipt](u02-proof-guard-v1/index.json) passes Bend and the
independent BendTT checker. The approved NP01–NP03 obligations are not complete.
Actual joint-subgroup membership, loaded-data admissibility, packed/reference
refinement and the concrete inverse reconstruction bridge remain open. No
production search imports the kernel, and the established 23 laws are unchanged.

## Reference definitions

`bench/subgroup-proof-kernel.bend` uses `src/model.bend`, not packed cubies.
Its internal word stores the last move at the head, so deleting the final move
is structural. `forward_word` reverses that representation for the existing
model. Checked theorems preserve length, replay and reversal involution. The
coverage result is also proved directly for ordinary forward model words.

`Le(a,b)` is a structural natural-number order relation. Functions in both
directions connect it to `Nat.is_le`. Bounds cannot wrap. A positive radius is
represented as `1n+predecessor`, not a boolean assertion or a default value.

## What the kernel proves

`target_final_exclusion` accepts a target predicate, its identity membership,
closure under selected member moves, inverse closure, and admissibility at the
root for every word reaching that target. For a positive-length solving word
whose length is at most the bound, the final move cannot be a target member.
The proof removes that move using the established reference inverse law and
contradicts admissibility of the shorter prefix. The premises remain explicit.

`Covered<root,radius,move>` carries one selected target, its bound, closure and
admissibility evidence, plus both radius tightness and membership of that move.
If such a witness exists for every one of the eighteen moves, the coverage
theorem excludes every solving word through the positive radius. It handles
the empty word separately. It does not ignore shorter solutions, use the
maximum of incomplete searches, or manufacture coverage from equal numbers.

`inverse_first_exclusion` transfers the argument to a first move. It needs an
explicit `InversionBridge(root,inverse_root)` that maps every original solving
word to the correctly reversed inverse solution. The inverse suffix preserves
length. Supplying an arbitrary cube as `inverse_root` cannot satisfy that bridge
without a proof. The kernel does not prove that `Cubie.inverse` satisfies it.

The concrete test instance uses the solved-position target, the cube after U,
and an admissible bound of one. Its empty-word case is impossible because that
cube is not solved; every nonempty reaching word has length at least one.
This exercises a real reference target instance, not loaded joint-table data.

## Rejected proofs and translation

Both public check entrypoints reject a zero-bound proof because `Empty` is
required but `Unit` was supplied. They also reject a claimed bound of one for
the solved state. The latter fails at `Le(1,length(word))`; an unexamined empty
word cannot be replaced by `Unit`. Exact diagnostics are in the guard archive.
These are frontend rejections through both entrypoints, not separate claims
that BendTT received and rejected an invalid translation.

The guard exports BendTT text, hashes it and preserves the actual eight claim
headers. They show the admissibility and inversion premises. A passing kernel
check does not assert those premises for a host-loaded file or optimized cube.

## Resume and verify

The run ID selects fresh guard, translation and queue paths. Existing receipts
are not overwritten. After committing, launch the bounded confirmation:

```sh
nix develop --command node bench/u02-proof-checks.mjs plan u02-proof-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-proof-v1-plan.json
```

This rechecks the pure kernel and reference instance, reuses the completed
46,741-state oracle, and runs unchanged toolchain/proof gates. Expected duration
is two minutes, with a three-minute cap, three GiB and four low-priority lanes.
It neither rebuilds the application nor reruns the unchanged finite oracle.

Next, construct actual subgroup witnesses and concrete refinement bridges.
Keep missing witnesses visible. Do not replace the approved semantic statements
with these conditional helper signatures or enable production pruning merely
because the helpers pass. Performance acceptance and independent review remain
open.
