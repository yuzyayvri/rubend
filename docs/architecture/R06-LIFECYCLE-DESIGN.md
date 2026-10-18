# Local engine lifecycle

Status is a solo design against the current engine/server/runtime. Required
independent review cannot run under Yuzy's no-subagents instruction. Native
control is implemented. Final-artifact regression, browser acceptance, and
matched application measurements remain open.

## Existing ownership

The earlier Engine owns one input FIFO, one child process, and one active job.
Its generation filters replaced-process output. It replay-checks candidates
independently. Cancel kills the child and starts a replacement before old cleanup.
That reloads pruning tables. The earlier browser treats receipt of a session
token as readiness even when the server says false.

The earlier browser model-worker map has no crash, message-error, termination,
or timeout rejection. The integrated ModelClient now owns the worker and map.
Its ten direct unit checks pass. Browser acceptance remains open.

## Alternatives

The serialized restart design waits for old-child close and IPC cleanup, then
starts a replacement. It is small and supports every frozen legacy backend,
but cannot meet the table-reuse or normal cancellation-latency target.

The cooperative design gives each process a separate control FIFO and gives
each job a nonzero ID. A single persistent Bend IO reader sends control IDs
to a bounded Chan(U32). Pure search stays unchanged. Between bounded slices,
the service uses Chan.try_recv with zero timeout and matches only its current
job. It returns the same owned table on cancellation. This avoids new foreign
code and does not create a new pending read per slice.

Select cooperative control only after a versioned capability handshake. Use
serialized restart for legacy backends and a failed acknowledgement. Preserve
frozen binaries and their three-field protocol rather than mislabeling them as
cooperative. This is a labeled sequential design comparison, not independent
review. Confirm the installed channel timeout/closed semantics before coding.

Native verification exposed an extra scheduling obligation. The installed
runtime does not switch computations after an immediate effect. Add a zero-delay
IO yield at each bounded search checkpoint so completed control reads can run.
The [actual failing native test](../issues/cooperative-control-yield.md) records
the source diagnosis. This is an accepted solo refinement of the cooperative
design, not an independent design review.

## Interfaces and state

Engine has initializing, ready, searching, cancelling, failed, and closed states.
Only ready/searching mean that a usable worker exists. The active job owns its
timer, callback, input, and ID. Cancellation owns a separate acknowledgement
promise; a new solve waits for it. Close and failure settle every waiter.

Engine.solve(input, onEvent, options) accepts an AbortSignal in options.
Abort before readiness must not enqueue a job. Existing two-argument callers
keep working. Engine.cancel returns a promise that settles after acknowledgement
or completed fallback. Engine.close awaits every child it started. Replacement
never overlaps an old table owner.

The version-two worker command adds job ID to the existing facelets/mode/budget.
The host passes a private control-FIFO path through RUBEND_CONTROL_FIFO.
Without that variable, the native worker retains the three-field legacy mode.
Candidate, progress, invalid, done, and cancelled events echo that ID. A ready
message advertises the protocol and both ID/cancellation capabilities. Old
readiness without capabilities remains legacy. Late IDs and generations cannot
change the current job or canonical browser solution.

ModelClient.request returns domain data, not transport IDs. Worker crash,
message error, malformed matching reply, and bounded timeout reject outstanding
requests and terminate the failed worker. Ordinary validation and clone errors
reject only their own request. Close is idempotent. A failed client preserves
the last canonical cube and verified solution; UI integration supplies recovery
text rather than leaving busy controls forever.

## Verification before acceptance

Use real delayed-ready and malformed/late-event worker fixtures first. Test
cancel/resubmit, repeated cancellation, natural-completion races, startup abort,
acknowledgement failure, forced termination, and exact IPC cleanup. Track original
PIDs, start ticks, and initialization counts. Normal cancellation must retain the
same PID and table initialization. Legacy fallback must have no worker overlap.

Run native small and accepted optional profiles, HTTP/session/origin protections,
candidate replay, export intervals, and hidden browser interactions. Measure five
matched lifecycle cohorts separately from search throughput. No claim about
sub-100-ms cancellation or unchanged deadline quality before those runs.
