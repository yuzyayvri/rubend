# Reusable native worker and browser failure handling

Status is verified core behavior with matched raw cancellation and hidden
failure/readiness checks. Broader browser, deadline-quality, packaging, and
integration gates remain open. All work is solo. Independent review is not run.

## Behavior

The native version-two worker returns its existing owned table on cancellation.
It does not rebuild the pruning database. One persistent Bend reader accepts
bounded positive U32 control records through a private FIFO and a bounded
channel. The search loop yields between bounded slices before polling it.
Every tracked native event carries its job ID. No foreign search or new foreign
effect is introduced.

The host negotiates capabilities before using this protocol. Frozen version-one
binaries retain their three-field commands and use serialized restart. The old
process and its IPC must finish before a new table owner starts. A missing
cancellation acknowledgement takes the same bounded fallback. A process that
ignores termination is killed after the stop deadline.

Startup abort cannot enqueue a solve later. Close rejects readiness waiters,
cleans the active job, and awaits its process. Native failures settle the active
job and make readiness fail. Late generations and job IDs cannot change the
current result. Candidates retain replay and monotonic-bound checks. Terminal
length must match the verified incumbent.

The integrated ModelClient settles pending requests on worker errors, unreadable
messages, malformed results, timeout, and close. It removes listeners and timers
and terminates failed workers. Validation or cloning errors affect only their
own request. Cube controls show recovery text after failure while keeping the
last committed cube and verified solution. Session-token receipt no longer
pretends that the native tables are ready. The browser polls actual readiness.

## Executable evidence

The [full regression](r06-lifecycle-core-v1/regression.json.gz) passes after the
native implementation. It includes all existing model, symmetry, codec, loader,
profile, shallow optimum, native, HTTP, export, and measurement-fixture checks.
Its build passes the unchanged twenty-three-law BendTT verdict. A subsequent
terminal-length guard and stronger startup-overlap observation pass the
[focused final host run](r06-lifecycle-core-v1/host-final.json.gz). Final
integration will rerun the full suite after the remaining app work.

`tests/engine-lifecycle.mjs --baseline` against 62de4d8 fails with missing
AbortError rejection. That old request enters native search after cancellation.
The [failing record](r06-lifecycle-core-v1/startup-abort-red.json.gz) is preserved.
The current fourteen-scenario test passes across sixteen fixture processes.
It covers delayed startup abort, close while initializing, cooperative reuse,
late replies, natural-completion cancellation races, legacy restart, missing
acknowledgement, ignored termination, malformed identity or events, replay and
terminal contradictions, unsupported capabilities, and close during cancellation.
Each replacement independently inspects prior owned PIDs and start ticks before
announcing its startup. No earlier fixture owner is still alive.

The terminal contradiction test first observes done instead of error. Its
[failing record](r06-lifecycle-core-v1/terminal-red.json.gz) precedes the new
guard. The current host run rejects that contradiction and passes HTTP and
export checks. No assertion was relaxed.

`tests/native-lifecycle.mjs` keeps the original PID and generation through five
actual cancellations and subsequent solved requests. Fragmented control and a
stale ID also pass. IPC and the original PID are absent after close. Its small
observations are functional evidence, not a matched speed comparison.
The first native prototype instead replaces the PID. Its
[failing receipt](r06-lifecycle-core-v1/native-yield-red.json.gz) and
[source diagnosis](../issues/cooperative-control-yield.md) preserve the missing
IO-yield failure. Host fixtures alone did not catch it.

`tests/model-client.mjs` passes ten cases, including concurrent out-of-order
replies, payload identity spoofing, recoverable errors, fatal errors, timeout,
late replies, and idempotent close. `tests/worker-control.mjs` checks nine parser
boundaries, including U32 maximum, overflow, empty or zero IDs, and wrong bytes.

`tests/lifecycle-compare.mjs` validates the dedicated measurement adapter using
twenty-five fixture processes, thirty cancellation cycles, a known replacement
delay, and five rejected configurations. This establishes fixture sensitivity,
not product latency. The real raw-table result is recorded below.

One build is rejected because a late web-source edit changes its input seal.
Its [rejected receipt](r06-lifecycle-core-v1/rejected-changing-build.json.gz)
remains separate. The replacement build passes. No benchmark uses the rejected
build for acceptance. All archives are exclusive, hash bound, and losslessly
roundtrip checked.

The pure proof check passes in the final build batch. A subsequent check-only
invocation on the optional H0 IO entrypoint rejects its existing foreign file
reader. That is the wrong check mode for the runtime, not a new pure dependency.
The [rejected invocation](r06-lifecycle-core-v1/io-check-mode-rejected.json.gz)
is kept. Five explicit runtime variants build natively alongside the default,
including H0 and segmented owners. Their control IO remains outside PROOF.bend. The
[replacement build batch](r06-lifecycle-core-v1/native-profile-build.json.gz)
and [latest browser build](r06-lifecycle-core-v1/browser-recovery-build.json.gz)
pass without changing any law or foreign-code gate.

## Hidden browser checks

A loopback-only test proxy injects a worker exception on playback. It does not
replace the native solver. The real Bend engine first solves R U R' U' in four
moves and establishes the four-move lower bound. After the injected exception,
the position remains at step zero and the verified answer remains exportable.
Playback and cube-worker controls disable instead of staying busy.

The first page shows the raw error without recovery instructions. The error
handler had displayed the reload text, then the rejected playback request
overwrote it. The [before screenshot](r06-lifecycle-core-v1/r06-model-failure-before.png)
and [retained export](r06-lifecycle-core-v1/r06-model-failure-retained-export.txt)
record that real path. The new model test first rejects the missing recovery
message in [its red run](r06-lifecycle-core-v1/model-recovery-red.json.gz).
ModelClient now gives every pending request the same actionable failure.
The [rebuilt page](r06-lifecycle-core-v1/r06-model-failure-after.png) keeps the
reload instruction after playback catches the rejection. Export stays enabled.
Both snapshots are accompanied by complete accessibility records.

A separate delayed worker-process fixture leaves model input usable but solving disabled
while its real readiness is false. The [warming screenshot](r06-lifecycle-core-v1/r06-delayed-ready-before.png)
and [later ready state](r06-lifecycle-core-v1/r06-delayed-ready-after.txt) show the
transition. This is readiness verification, not a startup-speed measurement.
All tabs remain hidden. Both fixture servers and their children stop afterward.
The saved images and text are byte-compared with their original captures.

## Matched raw cancellation

Five alternating fresh cohorts run the frozen typed raw control and cooperative
raw worker on CPU 2 at nice 10, with the same audited cache, a 6,144-MiB cap, and
a 300-second batch cap. There are no concurrent builds or preview servers.
Each cancellation follows at least 100,000 observed native search work steps.
Each following solved request returns its verified zero-length optimum.
All thirty cancellation cycles and thirty recovery requests pass. These hard
requests are cancelled, not claimed as completed exact solves.

Cancel-to-usable median is 2,046.43 ms for legacy restart and 2.95 ms for cooperative
reuse. Fifteen observations per profile span 1,903.83 to 2,128.11 ms and 2.34 to
14.11 ms, respectively. The nearest-rank p95 is 2,128.11 ms versus 14.11 ms. The
cooperative path meets the declared sub-100-ms target in this finite run.

The observed mechanism is table reuse. Legacy workers initialize twenty times
across five cohorts, while cooperative workers initialize five times. All
fifteen cooperative cancels retain their PID and start ticks. Every legacy
replacement waits for the old PID and IPC to disappear. All final processes
exit through SIGTERM, with no surviving IPC. Startup is recorded separately
and is not claimed faster. This result does not measure search throughput.

The [complete resource record](r06-lifecycle-core-v1/raw-lifecycle.json.gz)
contains configuration, source/binary/cache seals, every native event, PID/start
identities, RSS samples, and shutdown. Exit status is zero and no resource stop
occurs. Reproduce with `node bench/lifecycle-compare.mjs` and the embedded
configuration in a fresh limited run. Desktop background activity and the small
case count still limit generalization.

## First quality gate rejects promotion

The first five-cohort [application run](r06-lifecycle-core-v1/deadline-rejected-v1.json.gz)
passes all 1,750 jobs and sixty answer-length pairs. It has no missing answers
or leaked IPC. However, four Superflip lower bounds regress. The unchanged
scorecard therefore rejects the quality floor. Fast first-answer p95 is12ms
versus13ms, exact is29ms versus30ms, and Superflip is2,000ms versus2,162ms.
No default integration is accepted from the cancellation result alone.

An [instrumented diagnostic](r06-lifecycle-core-v1/diagnostic-v1.json.gz) traces
one actual job per worker. It is not a timing comparison. During the marked
search interval the cooperative native main performs636pselect6 calls, versus
one for the legacy process. The trace also records substantially more context
switches. The immediate next hypothesis batches control reads and yields less
often within a bounded cancellation interval. Do not use traced CPU/work rates
as release performance evidence. Raw per-thread traces stay ignored under
build/evidence/r06-control-io-trace-v1.*.

The strict solver event boundary also initially rejects the private fixed-work
timer's snapshot and measurement packets. Its dedicated fixture first observes
only error instead of snapshot, measurement, candidate, and done, as recorded
in [the red run](r06-lifecycle-core-v1/benchmark-protocol-red.json.gz).
The timer adapter now explicitly selects the closed fixed-work event protocol.
The application keeps the strict solver default. Both positive diagnostic
packets and default rejection pass the current host fixtures. This is a host
protocol correction, not a relaxation of snapshot or solution validation.

## Open gates

Broader hidden-browser cancel, playback, and fallback acceptance remains open.
Optional-profile native lifecycle checks, deadline-quality measurements,
packaging, and final integration remain open. No new default
profile, general speedup, world-class strength, or formal search completeness
claim follows from this work. Required independent review stays blocked under
the solo instruction.
