# Bounded reference inspection looked in the datatype dispatcher

`u06-bounded-reference-v1` passed the reference's Bend/BendTT verdict and
deterministic generation. The evidence inspector then expected `NoSolution`
inside the top-level `BRTResult` declaration and stopped before negative or
backend tests ran.

BendTT represents that declaration as a constructor tag and a dispatch to
`BRTResult.arms`. The field types are in `BRTResult.arms`, where the actual
found-word length/replay evidence and universal exclusion are present.
The reference implementation and its statements need no change.

The [failed archive](../verification/next-plan/U06/u06-bounded-reference-v1-failed/index.json)
preserves 2,712 seals and the executed receipt, worker gone. Its extra
`translation-inspection.json.gz` preserves the actual declarations and original
wrong-location assertion. The failed run stays failed.

`tests/bounded-reference-translation.mjs` now checks the dispatcher and its
actual arms. It requires the found word's radius and original-input replay
evidence, plus the excluded arm's `NoSolution` at the same radius and input.
It reproduces the old missing-token assertion against the actual translation.
Four altered-text controls reject a missing exclusion field, missing radius
evidence, wrong replay root or missing arms declaration. These text controls
are evidence-inspector tests, not independent formal proof checks.

The recovery queue is `u06-bounded-reference-v2`. Its complete failed proof
job is retried with raw verdict output retained, followed by the previously
unrun false-proof, finite and native checks. No completed backend run or
expensive benchmark is repeated. Existing laws and reference source remain
unchanged. No optimized traversal or application certification is implied.

The [completed archive](../verification/next-plan/U06/u06-bounded-reference-v4/index.json)
closes this inspection defect. Both dispatch and arms checks, the frozen old
assertion and four altered-text controls pass. Sixteen actual false-proof
entrypoints remain separate formal-checker controls. The original failure is
retained.
