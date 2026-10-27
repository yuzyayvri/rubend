# NP04 conservative decoding

The exact statement is approved by the
[October 25 grant](../OCT25-AUTHORITY.md). This unit proves the arithmetic and
valid-block semantics. It does not assume that arbitrary loaded bytes are
valid distances, and it does not enable production pruning.

## Checked data shape

`bench/two-bit-conservative.bend` imports Base only. Natural numbers encode
nonnegative reference distances, base and fallback without machine overflow.
The code is zero at or below the base and otherwise the difference saturated
at three. A formula law identifies it with `min(value-base, 3)` using truncated
natural subtraction. Decode zero with the fallback, not the base.

The scalar law quantifies over every reference, base and fallback, with the
required fallback-below-reference witness. Structural induction proves decode
is no larger than the reference. Transitivity preserves any supplied distance
lower-bound witness. A finite block is a list of valid entries with one shared
fallback and a pointwise lower-bound witness, exactly the required minimum
condition. The indexed law requires a valid-index witness, so padding and an
out-of-range default cannot supply an accepted lookup. Empty and partial final
blocks retain their distinct index domains.

The arithmetic guard proves `base + code <= 255` from `base <= 252` and
`code <= 3`. The actual U32 implementation is tested over every admitted
reference/base pair, with three valid fallback choices. These finite backend
checks are not relabeled a universal symbolic U32 reflection theorem or proof
of file transport and loaded data.

## Design and verification

Two shapes were considered. A single U32-heavy symbolic proof would combine
primitive arithmetic, storage and table semantics at once. The selected design
isolates the quantified mathematical theorem and typed valid block first, then
checks the existing U32 primitive separately. Model the Domain puts the index
and fallback premises in proof types. It does not hide them in documentation.
Design exploration and verification are solo, not independent review.

Both proof checkers must accept the same definitions. Six actual source
mutations must fail through both checker entrypoints. They replace fallback by
base, change saturation, shift the difference, admit an empty-block index,
remove the fallback premise, or relax the admitted base bound. Each rejection
retains its actual diagnostics. The fresh emitted BendTT translation is saved.

The independent scalar oracle covers 64,515 admitted value/base pairs and
193,545 fallback instances. It compares the proved Nat implementation and the
actual existing U32 codec. A fresh native wrapper consumes every pair in the
same order, checks agreement and reports a host-verified checksum. No answer,
search step, table build or timing comparison is part of this proof batch.

Reuse the source-identical complete small-table codec audit, its three actual
codec corruptions, 99 refusals and native checks. Do not regenerate those
distances. Reuse the unchanged 87-input root gate from its actual successful
execution. All required previous input paths remain in the source seal.

The fixed queue is `u03-np04-v1`, expected three minutes and capped at eight.
The proof job uses 512 MiB on CPU2. Native compilation uses at most 1.5 GiB
and four low-priority lanes. Scalar checks use 1 GiB on CPU2, confirmation
512 MiB. Desktop reserve, no swap, seals, receipts and cleanup remain enforced.
Results are pending canonical verification. The semantic proof does not by
itself finish the concrete bit-packed/data refinement or U03 performance work.

## Artifact-path recovery

The [first failure](u03-np04-v1-failed/index.json) preserves 3,349 seals and
three executed receipts, worker gone and no resource stop. Both checkers,
all twelve false-source entrypoints and native compilation pass. The oracle
result write collides with the existing native build metadata. Exclusive
creation rejects EEXIST without changing the metadata. See the
[collision issue](../../../issues/np04-artifact-output-collision.md).

The fixed recovery `u03-np04-v2` writes `native-result.json` separately and
requires result/build-artifact disjointness. Explicit metadata selects the
retained binary and JS proof module in a fresh run. All passing proofs, negative
entrypoints and native compilation are reused after complete source, artifact
and resource verification. The proof translation, JS and mutated proof sources
are bundled as evidence. The real old failure remains a regression.

No Bend code, theorem, codec, scalar case or acceptance threshold changes.
Only the not-yet-accepted native counters and scalar oracle run again.
Prepare uses 512 MiB, oracle 1 GiB and confirmation 512 MiB, serial CPU2.
Expected one minute with a four-minute cap. All original input seals remain.

## Verified result

The [recovery archive](u03-np04-v2/index.json) verifies 3,379 source seals and
three receipts. The worker is gone, and no resource stop occurred. Both actual
positive checker executions and all twelve false-proof entrypoints are reused
from the verified passing v1 proof job. Its emitted translation, module and
six mutated sources are preserved in `proof-bundle.json.gz`. Native compilation
is also reused unchanged. The initial collision and diagnostics remain failed.

All 193,545 scalar instances pass against the existing U32 codec. The native
and independent host checksums both equal 256,391,068. The oracle checks all
64,515 admitted value/base pairs with three valid fallback choices and 71 list
lookups. Concrete fallback, saturation and difference-shift counterexamples
reconcile. The actual EEXIST regression passes, and build metadata retains its
original hash after the separately named result is written.

This verifies the quantified Nat scalar and valid-block/index semantics,
admissibility consequence and bounded sum arithmetic. The unchanged prior codec
audit and root87 gate are source-identically reused. It does not prove a
universal symbolic U32 or bit-storage refinement, loaded-file validity, NP05,
optimized traversal or application optimality. Production remains unchanged.
There is no timing or solver-strength result here. Independent review is not run.
