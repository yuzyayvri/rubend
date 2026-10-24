# A complete bounded reference without pruning

This unit instantiates the original approved S04 obligation and U06's first
search-reference step. It does not implement NP04–NP08 or a new pruning rule.
The reference uses the actual facelet model and eighteen-move datatype.

`search(radius, cube)` returns `BRTResult<radius, cube>`. A found result carries
a move word, proof that its length is within the radius, and equality showing
that actual replay solves the original input. An excluded result carries a
function refuting every such solving word within that radius.

The result has no partial or timeout constructor. If the computation is killed,
it has not returned a result. There is no flag that turns incomplete work into
an exclusion. This is a pure, structurally terminating reference, not an
application cancellation protocol.

## All paths, including the empty word

The goal decision uses the checked reflection of the actual 54-field solved
predicate. At radius zero, a solved root returns the empty solution. An unsolved
root rejects the empty path, and a positive word cannot satisfy the zero bound.

At positive radius the reference recursively checks every first move with one
less radius. A child solution is prefixed with that exact move. If all children
exclude solutions and the root is not solved, a universal exclusion dispatches
each proposed word to its actual first-move child's evidence. The empty word
uses the unsolved-root evidence. No canonical pruning, heuristic, table or
cached failure is involved.

The generator derives and checks the eighteen constructors from `Model.Move`.
It emits typed branch inputs and exhaustive routing. A missing or substituted
branch cannot satisfy the original cube-indexed result type.

The alternative was a Boolean search followed by a separate meaning proof.
The chosen result type keeps successful replay and completed exclusion attached
to the values that need them. The entire reference is checked even though its
small numeric test packets do not serialize those formal proof objects.

## Bounded answers are not automatically shortest

One call answers whether a solution exists within one radius. A returned word
may be longer than the optimum when that radius exceeds the optimum.
Exclusions at smaller radii can justify a shortest answer, but one found packet
cannot. No application label or optimized result is strengthened here.

## Fixed guard

The focused complete reference passes Bend and BendTT. JavaScript spots cover
solved radius zero, a one-move exclusion and solution, and the noncommuting
`R U` root below and at its two-move optimum. A named-case native fixture
avoids the earlier pair-list kind errors.

The queue is `u06-bounded-reference-v1`, expected three minutes within a
thirteen-minute cap, at most 3 GiB and four low-priority build lanes.
Finite/native work uses CPU2. Generation must be byte-deterministic, and the
translated result and search signatures are retained.

Both proof entrypoints must reject eight actual missing/wrong-move, prefix,
radius, zero-bound and false-completion sources. Three actual packet exporters
must fail on a lost word, false exclusion and false solution.
The independent facelet oracle builds all 3,502 states through depth three,
checking 4,716 generator edges and the layers 1, 18, 243 and 3,240.
All eighteen one-move inputs and fixed higher-depth samples produce 153 bound
queries. Another 36 arbitrary-U32 center controls must be excluded.
All 189 packets must match native execution and a checksum. The established
23 laws and toolchain gates remain unchanged.

This does not prove optimized traversal refines the reference. Canonical pruning,
loaded distances, retained work, partition completion and the IO/data boundary
remain separate obligations. The reference is not a production solver, a speed
treatment, an application optimality certificate or a holdout result.
No publication or independent review is included.

## Translation-inspection recovery

The first queue reached a passing Bend/BendTT verdict and deterministic
generation, then its inspector looked for a field in the datatype dispatcher.
BendTT stores the fields separately in `BRTResult.arms`. The actual declaration
contains both required proof-bearing alternatives. No reference-search or
statement change is needed.

The [failed archive](u06-bounded-reference-v1-failed/index.json) preserves
2,712 seals and its receipt, worker gone. An additional compressed inspection
record retains the actual fields and old failing assertion. The corrected
inspector passes on that same translation and rejects four altered-text cases.
Those controls do not replace actual false-proof checks.

`u06-bounded-reference-v2` finishes the full fixed guard with the corrected
inspection and retained raw verdict output. Expected three minutes within a
thirteen-minute cap, at most 3 GiB. The original remains failed. Read
[the inspector defect](../../../issues/bounded-reference-arm-inspection.md).

## Resource admission recovery

V2 passed the complete proof job, all sixteen false-proof entrypoints and the
corrected inspection. Its finite job never started because available memory
did not meet the requested 3 GiB plus the 8 GiB desktop reserve.
The [unadmitted archive](u06-bounded-reference-v2-unadmitted/index.json)
preserves 2,722 seals, passed proof evidence and the exact pre-spawn refusal,
worker gone. It does not invent a missing resource receipt or a test result.

`u06-bounded-reference-v3` reuses those proofs and modules by hash and runs
the remaining checks under 2 GiB. Measured native build memory leaves margin
within that cap. The full reserve and enforcement remain unchanged. Expected
two minutes with a seven-minute cap. No reference source, theorem or test
expectation changes. Read
[the admission record](../../../issues/bounded-reference-resource-admission.md).

## Final source-bound confirmation

V3 passed the complete finite suite and all 189 native packets, checksum
2,582,377,809. It then hit the final root check's incorrectly shared 2-GiB
memory ceiling. The [stopped archive](u06-bounded-reference-v3-stopped/index.json)
preserves 2,760 seals, both passed receipts, the actual resource stop and all
records. The worker and repository check processes are gone.

That unchanged repository-wide gate previously passed with 3 GiB. All 87
current production, fixture and toolchain inputs and its original checker
script match the archived successful execution exactly. V4 verifies and reuses
that actual passing evidence, following the user's unchanged-source rule.
Six corrupted records must fail. It does not rerun passing reference work or
call reused gates fresh. The stopped run remains stopped.

`u06-bounded-reference-v4` is a one-minute verification batch under 1 GiB,
with a two-minute cap and unchanged reserve/enforcement. Read
[the budget and reuse record](../../../issues/bounded-reference-confirmation-budget.md).

## Result

The [completed archive](u06-bounded-reference-v4/index.json) verifies 2,800
source seals and its current resource receipt. The worker is gone, with no new
resource stop. It reuses the complete checked proof, sixteen actual false-proof
rejections and byte-identical module copies. The actual datatype dispatcher and
proof-bearing arms are retained. Four altered-text inspector controls reject.

The independent oracle has 3,502 states and 4,716 edges. All 153 bound queries
pass, with 75 found results and 78 exclusions. All 36 raw-center controls and
three actual packet corruptions pass. The 189 native packets match checksum
2,582,377,809. The current unchanged root gate is explicitly reused from its
actual archived successful execution after all 87 inputs, checker script,
command, binary, limits and confirmation match. Six altered records fail.
That gate was not freshly rerun.

The earlier inspector failure, admission refusal and resource stop retain their
original states. A focused cleanup-classifier check also passes eight cases
and detects then stops a real Node checker-shaped child. Its
[fixture](check-process-guard-v1/fixture.json.gz) and
[resource receipt](check-process-guard-v1/resource.json.gz) cover that utility
change separately. No original failing-before cleanup run is claimed.

This completes the unpruned bounded reference step. It does not certify the
optimized app, loaded distances, cancellation or partition completion.
No production change, speed result or independent review is claimed.
