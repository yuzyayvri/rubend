# Imported Bend move tags in the reference verifier

Status is fixed in the verifier. No production defect was identified.

The first reference-target guard passed its root and target proof verdicts,
then failed the first move-membership assertion with `false !== true`.
The caller passed `Model.from_index(0)` from the separately generated root
model module into the new target module. That value had the tag `U`.
The target module's imported model expected `../src/model.U` and fell through
its move match. This is an inter-module host representation mismatch, not a
counterexample to the checked closure theorem.

The verifier now passes numeric move indexes to `member_index`, which constructs
the move inside the target module. Its packed-word adapter likewise constructs
the reference model value inside that same module. Tests cover all eighteen
moves in all three frames and reject index eighteen. Do not repair the failure
by changing the expected mask or assuming an unqualified imported constructor.

`apps/model.mjs` already creates moves and replays them within the same generated
model module. It does not use this failing cross-module move call. No product
code is changed. Preserve the failed v1 guard/resource record alongside the
fresh v3 result. V2 passed the corrected adapter samples, then found a separate
negative-result validator wording error. V3 passes all 54 move cases and the
complete guard. A passing Bend proof does not validate a host adapter's value
encoding. Evidence is in
[the preserved guard archive](../verification/next-plan/U02/u02-target-guard-v3/index.json).
