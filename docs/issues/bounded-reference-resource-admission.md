# Bounded-reference finite job was not admitted

`u06-bounded-reference-v2` passed the complete proof job, all sixteen false-proof
entrypoints, declaration inspection and deterministic generation. Its finite
job did not start. Available memory had fallen below the requested 3 GiB plus
the required 8 GiB desktop reserve. The runner refused before starting the
command or creating a resource receipt.

The ordinary failed-run preserver expects a receipt for each attempted job,
so it could not preserve this distinct unadmitted state. The strict
`bench/preserve-unadmitted-background.mjs` path verifies the unchanged plan,
source seals, passed receipts, worker identity and exact pre-spawn admission
diagnostic. It records the planned command as not started. It does not invent a
resource receipt or call unrun tests passing.

The [unadmitted archive](../verification/next-plan/U06/u06-bounded-reference-v2-unadmitted/index.json)
preserves all 2,722 seals, the passed proof receipt, complete proof record,
translation inspection, source snapshot and admission log. The worker is gone.
The original remains failed with its finite job explicitly unadmitted.

The native smoke build peaked at 474,364 KiB aggregate RSS. A larger previous
packed-admission finite/native job peaked at 1,499,476 KiB. The recovery requests
2 GiB for the remaining checks instead of 3 GiB. It retains the complete desktop
reserve, CPU affinity, low priority, cgroup limit, no swap and pressure backstop.
These observations justify an admission ceiling, not a performance comparison.

`u06-bounded-reference-v3` reuses the unchanged passing proofs and modules by
hash, with byte-identical copies in fresh run-owned paths. It runs the finite
and native checks for the first time, then unchanged proof/toolchain gates.
No theorem, test expectation, production solver or application label changes.

V3 completed the previously unrun finite/native work. Its different final
confirmation budget stop is recorded separately in
[the confirmation record](bounded-reference-confirmation-budget.md). The
[completed closure](../verification/next-plan/U06/u06-bounded-reference-v4/index.json)
retains this original job as unadmitted and never fabricates its receipt.
