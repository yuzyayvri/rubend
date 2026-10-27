# Packed edge routing and flips

The [corner-word confirmation](u02-packed-routing-v1/index.json) passed with
1,741 matching seals, no resource stop and its worker gone. The bit-level proof
generator now covers four actual packed move fields, with eighteen statements
per field.

| Field | Proved update |
| --- | --- |
| `cp` | Eight corner-label nibbles follow the reference corner-position permutation. |
| `ep` | Eight low edge-label nibbles select the correct source in either edge word. |
| `eh` | Four high edge-label nibbles select the correct source; the upper sixteen bits are zero. |
| `eo` | Twelve edge-orientation bits follow reference positions and XOR flips; the upper twenty bits are zero. |

All 72 equalities quantify over arbitrary 32-bit input words, with unrelated
fields arbitrary too. Edge routing covers both input words without assuming
unused high bits were already clear. The orientation target comes from the
actual reference sticker transport, including edge-slot order, rather than a
copied list of face names.

## Construction and rejection checks

One registry owns the field projection, required input words and target layout.
It preserves the original corner-only command while adding the four-field
selection. The generator verifies source hashes and independently reconstructs
both corner and edge transport from the current `Model.turn_*` definitions.
Every generated equality still calls the actual `Cubie.turn` implementation.

The new pure module passes Bend and BendTT. Its 6.47-MB proof source stays under
`build/` and regenerates deterministically. This is proof code, not a pruning
table or a larger search profile. The complete type-check probe stays within
the existing three-GiB resource ceiling.

The guard retains the wrong-corner-route and corrupted-target controls. It
adds an actual wrong edge source word and a missing orientation flip. Each
false claim must fail through both public checker entrypoints at the expected
field theorem. Runtime mutants omit those proof claims and must provide actual
counterexamples. The original 18,612 corner comparisons remain passing.

The four-field backend driver checks 1,162 input tuples, including zero, all
ones, every one-hot bit in all five input words, and 1,000 deterministic random
tuples. All eighteen moves are checked for 20,916 vectors and 83,664 individual
field comparisons. Reserved output bits are checked explicitly. These are
emitted-JavaScript checks alongside the source-semantic proofs, not a native
backend certification or a benchmark.

## Remaining boundary

Corner orientation `co` is still unproved. Its quarter-turn arithmetic requires
a separate finite-orientation argument. Connecting these word-level equalities
to typed cell packing, packed inverse reconstruction, validated-input
reachability, coordinate targets and loaded-bound admissibility remains open.
No full packed/reference theorem or optimized search certification is claimed.
Production pruning and defaults remain unchanged, and performance acceptance
is still inconclusive. Independent review is not run.

```sh
nix develop --command node bench/u02-packed-routing-checks.mjs plan u02-packed-routing-all-v1 all
nix develop --command node bench/background-tests.mjs start build/evidence/u02-packed-routing-all-v1-plan.json
```

The source-bound guard checks all 72 statements, eight expected proof rejections,
both backend drivers, the root verdict and sixteen toolchain gates. The
[passing guard](u02-packed-routing-all-guard-v1/guard.json.gz) preserves those
results. Its [field samples](u02-packed-routing-all-guard-v1/field-samples.json.gz)
contain both actual counterexamples. The resource record has no stop.
Confirmation
rechecks the complete pure module and reuses its verified samples. Expected
duration is three minutes, with a three-minute cap, three GiB and at most four
low-priority lanes. No application rebuild, timing retry, distance table,
holdout use or publication is included.
