# Roadmap evidence and remaining work

Reconciled October 26, 2026, Asia/Manila, after signed checkpoint `7dfc405`.
The entire roadmap is not complete. This record separates actual unfinished
work from measured negative or inconclusive treatments. It does not mark an
unchecked test, proof, performance target or review passed.

The controlling plan is [NEXT-IMPLEMENTATION-PLAN.md](../../architecture/NEXT-IMPLEMENTATION-PLAN.md).
U07 explicitly depends on U00 through U06 dispositions, not on every optimization
winning. U03 explicitly allows retaining the existing profile. The closing
checklist requires accepted, rejected, inconclusive or explicitly approved
deferred dispositions. A conditional branch that never earns integration is
not a silently accepted production feature. No proposed treatment below is
called approved-deferred to avoid difficult work.

## Unit disposition matrix

| Unit and obligation | Current evidence and disposition | Remaining useful work |
| --- | --- | --- |
| U00 source, history, profile inventory and scorecards | [Control inventory, same-binary runs, ten live lanes and profile receipts](U00/README.md) exist. Original source/table identities are preserved. | Final source and selected controls must be reconciled again in U07. |
| U00 stable timing and causal attribution | [Whole-command CPU observer](U00/CPU-OBSERVER.md), [helper A/A diagnostic](U00/NATIVE-AA-CPU.md), [process clock](U00/PROCESS-CPU-CLOCK.md) and [native windows](U00/NATIVE-CPU-WINDOWS.md) are verified. Historical mapper/browser noise is not explained; short warm windows remain unresolved. | Retain inconclusive historical verdicts. Final comparisons need their own frozen noise gates. No unchanged rerun to clear an old gate. |
| U01 browser and installed CI delivery | [Profile/package/lifecycle matrix](U01/README.md), redesign regression and installed redesigned package are verified. [Actual clipboard and physical download](U01/FILE-BACKED-ACCEPTANCE.md) now close the last named observation gap. | U07 must check the final delivered source. Current source has the later demand-rendering change, so the older CI package is not its final package receipt. |
| U01 interaction review | Screenshots and [three sampled videos](U06/REVIEW-VIDEOS.md) are retained. | Operator review remains a before-merge gate, not supplied by solo execution. No merge or push is authorized. |
| U02 subgroup final/first exclusions | [Independent four-ply DAG](U02/README.md), NP01–NP03, packed inverse/replay/admission components pass their stated guards. The [private forward candidate](U02/FORWARD-NATIVE.md) now passes 8,056 finite native requests, all 3,758 shallow optima per active side, 8,040 independent answer replays and four normal owner/IPC cleanups. No production inference is enabled. | Equal-contour native cost and concrete target/data bridges remain. Keep inverse first-move masking separate. Do not call static intervals CPU savings, mark the missing proofs complete or quietly drop the candidate. |
| U02 retained rotated coordinates | [Actual source-isolated search](U02/CACHED-AXIS-SEARCH.md) matches states/work; [cost](U02/CACHED-AXIS-COST.md) and [development noise](U02/DEVELOPMENT-CONTROL-NOISE.md) keep performance inconclusive. | Keep private and unpromoted. No winning default or accepted general speedup. |
| U02 probe order and dual inverse | [Conditional pipeline diagnostic](U02/PIPELINE-DIAGNOSTIC.md) informs lazy staged coordinate updates. Rejected corner-first/late policies remain rejected. [NP08 reference identity](U05/EXACT-WORK-SAFETY.md) proves left action. No new measured inversion limiter justifies an optimized dual-state treatment. | Do not mistake the reference identity for a dual-state engine or repeat rejected orderings unchanged. |
| U03 six-edge data | Both 42,577,920-state tables are built; [both full reference-graph audits](U03/NP05-PROJECTION-PATH.md) pass with exact source/data identities. Checkpoints and independent corruption tests are retained. | Preserve completed tables and audits; no rebuild is needed. Concrete native/codec/storage proof boundaries remain explicit. |
| U03 marginal value and optional profile | [Six-edge screen](U03/SIX-EDGE-CONDITIONAL.md) finds two extra candidate cuts among 52,584 raw entries, each with a nineteen-step completed span, and none beyond the four-edge maximum on 420 structured entries. | Retain the existing profile. No new six-edge pruning, compression or speed claim is selected. This is a scoped negative opportunity result, not a universal impossibility claim. |
| U03 compression and enriched H0 | [Conservative NP04 component](U03/NP04-CONSERVATIVE.md) and two-bit finite controls exist; universal U32/storage and concrete NP05 are partial. Compression was conditional on justification. The orientation-enriched H0 condition requires a diagnostic missing-orientation mechanism, which the six-edge result does not establish. | Do not add unselected production compression or naive symmetry/orientation bits. No new default depends on the incomplete new-data bridge. |
| U04 task and move ordering | [Prior-contour pilot/development](U04/PRIOR-CONTOUR-ORDER.md), [move-order study](U04/MOVE-ORDER-STUDY.md) and [product-order study](U04/PRODUCT-ORDER-STUDY.md) retain ties and unconfirmed pilot gains. Each latter study has 160 final-quality pairs all tied. | Keep round robin and ordinary move order. Long-cost stages skipped under frozen no-benefit rules are not measurements. |
| U04 premoves and seed policy | [Path transformations](U04/PREMOVE-PATHS.md), [seed-bank fixed-work quality](U04/SEED-BANK-QUALITY.md) and [deadline probe](U04/DEADLINE-SEED-PROBE.md) are recorded. Fresh deadline quality has losses, so the candidate is rejected for integration. | Preserve rejection, control and replay evidence. Do not expand to two premoves or combine rejected policies. |
| U04 phase-two projection and mapper | [Projection](U04/PHASE2-PROJECTION.md), [small product](U04/SMALL-PRODUCT.md) and mapped probe checks exist. [Long mapper timing](U04/PHASE2-MAPPER-LONG.md) stays inconclusive. Product ordering has no confirmed quality gain. | Keep private and unpromoted. Do not turn helper timing or information counts into whole-solver speed. |
| U05 exact-context cache | [Actual duplicate screen](U05/NATIVE-DUPLICATE-OBSERVATION.md) finds one nineteen-step repeated context among 52,584 entries. [NP06](U05/EXACT-WORK-SAFETY.md) checks semantic exact-key/radius reuse, not runtime witnesses. | Retain cache-off. The plan makes a native cache conditional on plausible repayment; that condition is not met here. No collision/eviction or capacity benchmark is falsely claimed for a nonexistent engine cache. |
| U05 partition accounting and workers | [Finite partitions](U05/PARTITION-PREFLIGHT.md), [ledger](U05/LEDGER-PREFLIGHT.md), [native workers](U05/PARTITION-WORKER.md), [coordinator recovery](U05/PARTITION-POOL.md) and conditional NP07 pass their stated guards. Missing/failed work cannot commit a contour. | Runtime finite correctness is not a universal optimized coverage/exhaustion theorem. Keep those proof gaps explicit. |
| U05 scaling | [Five alternating cohorts](U05/PARTITION-SCALING.md) preserve 22,480 measured results. One duplicate pair has 8.23% noise, above 5%. Private initialization dominates diagnostic stages. | Inconclusive scaling; retain serial. No accepted multicore gain or quantified slowdown. Do not rerun unchanged for luck. |
| U06 bounded reference and optimized refinement | [Complete bounded reference](U06/BOUNDED-REFERENCE.md), [positive solved reflection](U06/SEARCH-GOAL-REFLECTION.md) and [seven-gap inventory](U06/REFINEMENT-GAPS.md) pass their actual guards. | Full optimized completeness, loaded-data and coverage implications remain unproved. The plan allows exact gap identification and forbids the stronger application label until all bridges hold. Keep it disabled. |
| U06 rendering | [Demand rendering](U06/DEMAND-RENDERING.md) reduces submitted idle work on a valid rendering surface. [Mesh retention](U06/MESH-RETENTION-COMPARISON.md) remains private/inconclusive, not bundled into that accepted change. Actual rebuilt-app recovery, replay and cleanup pass. | U07 final app/package check and operator before-merge review remain. No native strength or general CPU/GPU claim follows from idle frames. |
| U07 final research and comparison | [Reference calibration](U07/REFERENCE-CALIBRATION.md), [record contracts](U07/COMPARISON-RECORDS.md), [cold lifecycle](U07/COLD-LIFECYCLE.md) and [exploratory pilot](U07/COLD-PILOT.md) exist. These are not the requested final benchmark. | Research and locally set up meaningful additional solvers from primary upstream sources. Freeze all revisions/configs/licenses before opening untouched cases. Then complete matched repeated comparisons, every-answer replay, full final regression/package checks, numerical Pareto report and chat delivery. |

## Exit still open

First finish the U02 native forward-coverage treatment and concrete correctness
work warranted by its now verified opportunity signal. Do not call all
pre-evaluation work finished before its disposition. Other candidate integration
gates stay closed on the recorded negative,
unconfirmed or inconclusive dispositions; they are not successful optimizations.

Then perform the requested additional-solver research/setup and coordinate the
final evaluation with U07. Freeze Rubend and competitors before opening untouched
cases. Do not duplicate the final holdout or tune on it. Reuse source-identical
passing evidence; the final integration suite and delivery must describe the
actual selected source. Keep exact and anytime contracts, first/best answers,
censored optimality completion, initialization, CPU and aggregate memory distinct.

Only after the entire roadmap and reproducible comparative numerical report are
complete and delivered, delete `continue-rubend-roadmap`. The original 10x to
100x target remains unachieved. Independent review is not run under the solo
restriction. No push, merge, release or deployment is authorized. Yuzy reviews
the report before deciding on any later push to main.
