# U00 control and measurement reconciliation

Status is in progress. Yuzy approved the next implementation plan on 2026-10-20.
The starting source is a7a087235b20b38767b216b0ab90523ac1a2b13f. No new solver
policy, table, domain law, default profile, or performance improvement is claimed.

## Standing orders

Execute docs/architecture/NEXT-IMPLEMENTATION-PLAN.md in U00 through U07 order.
Keep unit, live, and performance evidence separate. Work solo and do not claim
independent review. Use hidden browser surfaces only. Keep all search and replay
logic in Bend and all established laws unchanged. New domain statements require
separate approval before they enter the law set.

Create fixed local jobs, enforce the resource policy, launch detached, and return
an ETA. Do not poll long work or schedule automatic model wakeups. Use signed,
subject-only local commits. Publication and merges remain separately gated.

The first batch boundary adds a control inventory/freeze and same-binary A/A
orchestration under bench/, with focused fixture tests. Existing measurement
adapters are reused, not rewritten. It does not rebuild historical large tables.
Runtime orders and source seals are retained under build/evidence/next-plan/U00/.

## Existing evidence

- Private-review full-v1 passes just test and all sixteen toolchain checks.
- The independent execution of the same full suite in private-review-merge-full-v1
  also passes. This is a second run, not an independent reviewer.
- GitHub run 39291425745 passes the actual current sandboxed package/runtime
  checks and export. Artifact import/launch is not yet verified.
- The signing history receipt maps old SHAs to replacement commits. Old source
  and table identities remain valid; never rewrite their frozen receipts.

## Control dispositions

| Profile/treatment | Recorded disposition | Still needed |
| --- | --- | --- |
| Current default small engine | Implemented, full functional checks pass | Fresh frozen integration control and A/A diagnosis |
| Raw inverse-three | Finite contour gain; optional larger tier | Current host-adapter A/A control and broader rollout |
| Corner and corner-first | Specialized half-turn result; no uniform marginal promotion | Source/data identity inventory and supported-profile acceptance |
| H0 | Complete data audit and tied application quality; no default promotion | Preserve data; remaining projection decisions |
| Packed small | Finite memory-tier acceptance, slower startup | Complete optional-tier rollout |
| Segmented / owned / fused H0 | Promotion rejected | Preserve negative evidence; do not repeat unchanged |
| Short-first / exact-reserve | Promotion rejected after deadline-bound losses | Preserve quality floor; evaluate only distinct mechanisms |
| Cooperative lifecycle | Functional retained-owner cancellation | Keep unresolved quality/latency promotion separate |

## First batch and interpretation

Freeze the rebuilt default app with its source graph, generated modules, frontend,
and binary. Verify the existing raw v5 binary against its own immutable source
snapshot and the current Bend graph. Keep the historical reference, corner, and
H0 snapshots identified separately; a source path relative to another checkout
must be resolved against that artifact's owner, not silently called corruption.

The raw v5 entry selects RawJoint, not RawInverseThree. Use it specifically for
the current lifecycle noise control. Preserve the inverse-three binary as a
separately identified historical heuristic control; do not attribute RawJoint
A/A results to an inverse-three benchmark.

Run five alternating A/A cohorts per selected control using the same binary on
both sides and the existing shallow/fast/exact/Superflip canaries. The warm
adapter retains two workers, so raw A/A admission must account for both arrays.
No build or preview overlaps a measurement job. Hash the release corpus for
identity only; do not inspect or tune on its cases.

A/A is a noise diagnostic, not a proposed speedup. Record deadline-quality
differences, native terminal differences, first-answer p95, work steps, and
one-millisecond clock resolution separately. Mark results inconclusive when
quality differs or the five-percent latency floor cannot be resolved. Do not
rerun to select a favorable result or treat this batch as U00 completion.

U00 live lanes, exact proposed theorem statements, and remaining noise diagnosis
are still open after preparation of the first batch.

## Run the first batch

After the source is committed, prepare and launch with a fresh id:

```sh
nix develop --command node bench/u00-plan.mjs u00-controls-v1 /absolute/path/to/historical-checkout
nix develop --command node bench/background-tests.mjs start build/evidence/u00-controls-v1-plan.json
```

The queue has three serial jobs capped at ten minutes each. The freeze/build
and small A/A jobs use a 4-GiB ceiling. Raw A/A uses a 5.5-GiB ceiling for both
resident workers together, subject to fresh admission and the eight-GiB desktop
reserve. It does not reserve another memory budget for each worker.

The queue status is build/experiments/u00-controls-v1/status.json. Control
identities and raw/diagnostic reports are inside the same directory. Per-job
resource receipts are build/evidence/u00-controls-v1-JOB.json. Standing orders
are build/evidence/next-plan/U00/orders.json. Runtime specifications and copied
corpora are sealed before use. Read results on the next ping, not by polling.

The focused fixture check `node tests/u00-aa.mjs` currently passes a stable
synthetic case, three explicit inconclusive cases, and seven rejecting cases.
This verifies classification behavior, not product performance.

## First batch result

[The complete archive](u00-controls-v1/index.json) retains the source-bound
inventory, original plan, resource receipts, both raw reports, and diagnostics.
All three jobs pass, including the current build, unchanged 23-law verdict,
sixteen toolchain checks, and 3,500 native jobs. Elapsed queue time is 509.388
seconds. There are no resource stops, changed source seals, remaining worker
owners, or recorded IPC directories. All six historical source snapshots agree
with their own metadata. The release holdout was not evaluated.

Both sides of each A/A run use the same binary and data. The small control ties
all deadline answer lengths and bounds; its first-answer p95 values are 36/36 ms
fast, 35/35 ms exact, and 1,597/1,593 ms Superflip. This is stability on this
finite sample, not a performance gain.

RawJoint also ties every deadline answer and bound. Its fast p95 is 12/12 ms,
where five percent is smaller than one millisecond. Exact p95 is 20/24 ms over
fifteen observations per side, making this nearest-rank p95 the sample maximum.
The 24 ms event belongs to exact case 1, round 2, control-b. Every repeat of that
case returns the same first move list at 420,000 native work steps. This rules
out a different first-answer path in those observations, not CPU/cache/scheduler
variation. Superflip p95 is 1,608/1,539 ms. Raw timing acceptance stays inconclusive.

The next diagnostic must preserve the full job sequence and frozen binary.
It will separate unrounded host arrival from the public rounded clock and
record per-thread native CPU/context-switch observations, process page faults,
and host work around first-candidate observation. It cannot recover the native
emission instant from a pipe arrival. Scheduler wait accounting is disabled on
this machine and will not be enabled. Instrumented timings will not replace
release timings or retroactively clear the old noise gate.
