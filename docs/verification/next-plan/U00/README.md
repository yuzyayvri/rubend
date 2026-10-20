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

## Fixed timing-attribution batch

The diagnostic uses the original complete five-cohort raw A/A configuration and
the original sealed RawJoint binary. No shortened request, first-answer cancel,
or new corpus replaces the workload. `bench/u00-latency.mjs` verifies the old
configuration, binary, metadata, and production host adapter before planning.

The warm adapter gains an optional engine factory used only by this diagnostic.
The default path still constructs the normal Engine. A custom factory is marked
explicitly as diagnostic in the report, so its instrumented timings cannot be
silently presented as release evidence. This is preferred to global prototype
patching or a separate prefix-only benchmark that would change cache/work history.

`bench/latency-probe.mjs` records the first accepted candidate using the same
job-start clock as Engine without rounding. It retains the public integer
elapsed time unchanged. Native observations sum live thread scheduled CPU and
context switches and record process page-fault deltas. Thread identities and
counter monotonicity are checked. Unknown counters remain unknown, not zero.
Each counter-read window and host CPU/event-loop observation is retained.

CPU until host observation is not CPU until native emission. The native worker
can continue searching before the host reads the pipe. Read windows, post-emission
work, observer startup/overhead, and disabled scheduler wait accounting remain
explicit limitations. No precise causal split is claimed merely by subtracting
CPU from wall time. Results are stratified by case and profile, with the full
trace retained. Every first solution/work-step prefix must match an original
control prefix before equal-work interpretation is allowed.

Prepare the fixed queue after committing sources:

```sh
nix develop --command node bench/u00-latency.mjs plan u00-latency-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u00-latency-v1-plan.json
```

The first job runs the parser/observer, warm-adapter default/custom, A/A analyzer,
engine lifecycle, and sixteen toolchain/proof checks. The second records one
instrumented raw comparison with the same two-owner 5.5-GiB ceiling and CPU 2.
Each job is capped at ten minutes. Expected queue duration is about eight minutes.
Read build/experiments/u00-latency-v1/status.json on the next ping. Trace, raw
report, and per-case summary remain in that directory. Do not poll or rerun to
clear the old acceptance gate.

## Diagnostic and initial browser results

[The diagnostic archive](u00-latency-v1/index.json) preserves all 1,750 jobs,
120 traces, producer identities, resource receipts, and summaries. Checks and
trace complete successfully at 23:03:52 Manila on October 20. All first prefixes
match the original control. No counter is missing, but scheduler wait accounting
remains unavailable. Observed page-fault deltas are all zero.

The instrumented exact p95 is 22.8854 ms for control-a and 19.7588 ms for
control-b. Each still contains only fifteen observations. The slow exact case
has variable scheduled CPU until observation, not merely different rounded
timestamps. The CPU window includes post-emission work and counter-read skew.
This does not identify frequency/cache/scheduler effects precisely and does
not clear the original release gate. Instrumented reports are now explicitly
rejected by the ordinary A/A classifier to prevent accidental promotion.

[The first browser matrix](u00-live-v2/index.json) covers U00 lanes 1, 2, 3, 4,
6, 7, 8, and 9 on the small profile. A hidden frozen-control tab and a hidden
current-app tab return the same four-move exact answer and export. A test-only
DOM mirror exposes the app's own diagnostics to the read-only browser driver;
it changes no production code and is not a rendering-performance benchmark.
Canonical states at steps one/two, completed playback, backstep, and rewind
agree with Bend-generated replay. Invalid input preserves revision and state.
A 250 ms hard solve retains a 20-move answer with lower bound twelve and no
optimal label. A separate no-answer case preserves missing coverage. Cancellation
and resubmission end with a fresh verified optimum. Solved input returns zero.

The initial pointer click after a full-page screenshot failed in the browser
driver. The receipt-producing run uses the controls' keyboard activation.
No pointer-coverage claim is made. Both live wrappers end cleanly with native
owners gone and IPC removed. Temporary browser tabs are closed. Lane 5 and
lane 10 are still pending; no complete live or independent-review verdict exists.

## Next fixed profile checks

Six preserved binaries under the historical checkout's
build/experiments/r06-unattended-20261019-v1/profiles directory match the current
Bend dependency graph exactly. Reuse these rather than rebuild them. Keep their
packed, inverse, corner, corner-first, H0, and segmented identities explicit.
Auxiliary data stays at its existing sealed owner paths; do not copy or rebuild
the large caches merely to satisfy the current working directory.

`bench/u00-profiles.mjs` prepares two serial jobs. The first compiles/runs the
existing profile and exact-bound goal guards, checks generated JS domain results,
and runs focused fixtures plus sixteen toolchain/proof gates. No new Bend source
or law is written. The second checks all six source-identical binaries through
Engine, HTTP, native lifecycle, and five real native control failures each.
Cache digests are streamed before/after the checks. Preserve each profile's
native and HTTP receipt before the generic test output is reused.

```sh
nix develop --command node bench/u00-profiles.mjs plan u00-profiles-v1 /absolute/path/to/historical-checkout
nix develop --command node bench/background-tests.mjs start build/evidence/u00-profiles-v1-plan.json
```

Both jobs use 4 GiB, with caps of ten and fifteen minutes. Expected duration is
about ten minutes. The queue does not clear optional-profile browser coverage
or add a performance claim. Read saved results on the next ping.

## Profile integration result

[The profile archive](u00-profiles-v1/index.json) retains the complete source
seals, cache identities, resource receipts, and all twenty-four integration
records. Both jobs passed at 00:07:24 Manila on October 21. All six profiles
pass Engine, HTTP, retained-owner cancellation, and five real native control
failures each. The existing profile geometry and exact-bound goal checks pass
in native and generated JavaScript where applicable. All sixteen toolchain
gates pass with the established laws unchanged. No binary or table was rebuilt.

`bench/u00-profiles-archive.mjs` rejects failed jobs, changed seals or receipts,
missing profile records, and live native owners before creating the archive.
Real-browser profile and capability-mismatch checks remain separate.

The live supervisor accepts an optional sealed profile specification and id.
It runs only that profile's head server, so two large table owners cannot
overlap. The default two-server baseline/head mode is unchanged. Each session
records the selected binary, cache paths, process identities, and cleanup.

## Completed browser lanes

[The second browser archive](u00-browser-profiles-v1/index.json) completes
lanes 5 and 10. All six preserved profiles solve the four-move oracle case
and export a replay-certified interval of four through four. The packed small
profile is distinct from the default control. Each session runs serially with
one native owner. Inverse playback also agrees with canonical replay.

The negative lane supplies a native readiness event declaring unsupported
protocol three. Engine refuses it before any solve request reaches the fixture.
The browser shows Engine offline and disables solving. This tests protocol
capability refusal, not corrupt-cache recovery. The native geometry checks
remain in the separate integration archive.

The same archive preserves a preparatory U01 model-worker failure check.
A real module worker throws when playback first requests move application.
Twenty Space key presses and both arrow keys do not start an error loop.
The diagnostic timer advances, pending requests reach zero, canonical state
and the retained answer stay unchanged, and export still replays to solved.
The fixture changes worker behavior only for this local test. No production
interaction changed and no operator interaction-review gate is claimed closed.

All eight sessions stop cleanly. Their wrappers, servers, and native identities
are gone, and recorded IPC directories are removed. Binary source graphs and
all cache hashes still agree. `bench/u00-browser-archive.mjs` rechecks these
records and canonical exports before archiving them. Three representative
screenshots and complete compressed JSON records are retained.

[The machine-readable status](status.json) keeps all ten completed browser
lanes separate from U00 acceptance. Raw release timing remains inconclusive.
The new fixed regression queue runs `just check` followed by `just test` with
four low-priority lanes, 4 GiB, and a thirty-minute total ceiling. It includes
the fixture server's three-mode bridge, origin, abort, and cleanup regression.
No model wakeup or polling is scheduled.
