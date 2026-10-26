# Bounded final controller

The [record-domain result](u07-final-admission-v1/index.json) verifies 8,912
seals and three receipts, worker gone and no resource stop. All 40 known requests,
twenty cleanups and the protocol, slot, record and metadata negatives pass.
This result is checked before source edits.

The October 24 completion/report/no-push order remains binding. The full roadmap
and comparative report are unfinished. The final freeze follows successful
controller admission and canonical verification, before any untouched cube.
Deliver the report before deleting the existing automation. Yuzy separately
decides any later push to main. No push, merge or publication occurs here.

## Claims, completion and continuation

`evaluation-checkpoints.mjs` atomically publishes a slot manifest. Before any
request, it creates an exclusive durable claim containing the frozen metadata
digest, exact slot and process-start identity. A result is written and synced,
then linked into its immutable destination without overwriting another result.
Completed failures are terminal observations, not opportunities to rerun.

A live claim blocks duplicate execution. A stale or partial claim without a
complete result is an explicit unavailable, execution-uncertain outcome. It is
not repeated. A soft stop claims nothing further, so a continuation can execute
only previously unclaimed slots. Twelve process/filesystem controls pass,
including actual stale-child identity, completed-error retention and corrupted
record detection. Reopening the same completed ledger does not start solvers.

`evaluation-worker.mjs` owns one CPU lane and one active solver. Warm readiness
and restarts are recorded separately from request windows. Cold requests include
the process lifetime. Complete frames, candidates, timeouts and errors are saved
before independent replay. Normalization occurs after request CPU windows.
Unavailable CPU is null, not zero. Sampled RSS and idle PSS keep their limited
meanings. Shared quality batches do not receive falsely attributed per-actor CPU.

Input-format conversion on the controller side precedes actor wall clocks.
Whole-cgroup CPU windows include it. Solver parsing and intrinsic Rubend Engine
validation remain inside the answer path. These are explicit backend-adapter
contracts, not UI latency or raw search-kernel timing.

## Frozen sources without unrelated table I/O

The final template records executable/test sources, dependencies, delivered
artifacts, selected caches, root generated model modules, upstream revisions,
licenses, modifications, notices and canonical provenance anchors. Full hashes
and file identities are checked together when preparing and sealing it.

Every final batch's existing canonical checker verifies full source hashes
before and after jobs. Inside the timed worker, the source identity check uses
device, inode, byte count and nanosecond modification/change times. It checks the
same immutable inputs without reading unrelated large tables into that actor's
charged memory scope. This fast path does not replace canonical full hashing.
Changing contents or replacing a file invalidates its identity seal.

The source-bound metadata includes only the CPU model, kernel, architecture and
Node version needed for reproduction. It does not dump hostnames, environment
variables or a broader personal machine inventory. Security mitigations are
left unchanged. Comparison executables are local; no license-compatibility
clearance for distributing them is claimed.

## Structural and statistical controls

The structural artifact has 181 cases. The existing 163 shallow oracle states
come from the canonically checked complete depth-four BFS and native regression.
Eight inverse/rotation four-move cases additionally have independent integer-
geometry BFS lower checks through depth three. These give 171 explicit known
optima. The superflip word is replayed against the Bend all-edge-flip cubie
state, but its optimum remains null here. Half-turn and near-symmetric families
also keep unknown gaps. Correlated variants are not independent uniform samples.

Statistics retain all planned slots, failures, unavailable attempts and censored
optimality. Ten statistical negative controls reject missing/duplicate records,
unsupported proof, absent work, missing cohorts, CPU windows below one second,
coverage drift and duplicate noise above five percent. Verified solutions never
become optimality events automatically. Missing latency or memory stays null.

Non-exact contracts have no censored exact-search duration. Exact-request and
optimal-return-only contracts get completion-time distributions, censor counts
and separate failure counts. The focused pre-fix test exposes `320 !== null`;
it passes after the contract-aware correction. The original raw observations
and solver configurations do not change. See
docs/issues/optimality-censoring-contracts.md.

Two further counterexample controls check reported optimality against a shorter
verified path and independent known optima. Any such contradiction blocks a
complete report. The audit covers raw claims even when an event arrives late.

The bootstrap resamples case IDs with rejection-sampled draws, keeping all
cohorts and repeats for an input together. Its interval describes case-mix
uncertainty conditional on the observed cohorts. Cohort medians and ranges are
reported separately. It is not a universal implementation-winner test. Three
report controls prevent incomplete results being rendered as complete and keep
cold and warm CPU separate.

## Fixed campaign

The campaign model checks all 57,678 slots exactly once across 23 groups and
102 worker tasks. Ten quality groups each cover 1,000 release inputs across
five primary actors, on four disjoint CPU lanes under one four-GiB ceiling.
Five timing cohorts use two groups of five configuration jobs each. The
structural group has six jobs. Two long-budget groups have three jobs each.

Quality has a 27-minute work-job cap and a 29-minute queue cap. Timing and long
groups have 26-minute queue caps. The structural group has a 28-minute cap.
All use nice 10, zero swap and desktop reserve. The soft checkpoints stop new
claims before the hard limit. A new group waits for canonical verification of
the previous run. An active or failed queue is never blindly duplicated.
The current final queue pointer is `build/evidence/u07-final-current.json`.

The actual controller smoke check locally passes 39 requests, ten configurations,
four parallel lanes, soft-stop/resume and stale-claim recovery. Reopening thirty
completed slots launches no solver sessions and leaves result digests unchanged.
The exact final queue executor separately passes eight known requests on four
lanes. A stale local metadata artifact is refused after a source change; its
failed receipt is preserved. Fresh source-bound smoke metadata passes.

`u07-final-controller-v1` repeats these gates against signed sealed source.
Controls have 512 MiB and 120 seconds. Structural/template preparation has one
GiB and 180 seconds. Actual controller checks have four GiB, CPU2–5 and 300
seconds. Confirmation has one GiB and 120 seconds. The queue cap is fifteen
minutes. Jobs are serial except the declared ordinary CPU worker lanes; no AI
delegates or independent reviewers run.

## Next handoff

After the controller queue passes, run the canonical checker before any edits.
Then seal the template into the campaign's final metadata and plan its first
fixed group. Sealing validates the canonical admission receipt and every frozen
source again. The template cannot open release cases while still at the
`admission-preflight` stage.

The final report writer requires every planned slot to be accounted for and
every ledger envelope to match canonical batch evidence. It recomputes independent
replays and metrics, preserves exact/anytime and proof-kind distinctions, and
produces raw JSON plus a numerical Markdown report. It cannot authorize a push.
The final report, remaining U07 acceptance and delivery of numbers in chat still
precede automation deletion. This controller queue is pending; no untouched
evaluation or overall completion is claimed.
