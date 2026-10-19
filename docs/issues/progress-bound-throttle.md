# Stronger lower bounds dropped by the host throttle

Status is fixed on 2026-10-19, Asia/Manila. The native solver and all twenty-three
laws are unchanged.

Engine.receive updated its internal lower bound, then suppressed any progress
callback arriving within fifty milliseconds of the previous callback. A
completed exclusion could therefore be absent from the streamed UI events and
the retained solve record. Counter-only throttling should not discard a stronger
established lower bound.

A real fixture process emits bounds zero, zero, one, one, and two in one packet,
then a replay-valid candidate and terminal event. The
[failing-before test](../verification/r06-bound-throttle-v1/red.json.gz) observes
only zero instead of zero, one, and two through the public solve callback.

The host now compares progress with the prior bound before updating it. Stronger
bounds bypass throttling. Repeated counter-only progress still waits fifty
milliseconds. Replay, monotonicity, job identity, capability, and terminal
validation remain unchanged.

The [passing-after run](../verification/r06-bound-throttle-v1/green.json.gz)
checks all seventeen lifecycle scenarios, the rebuilt package, actual native
solving and cancellation, native control failures, HTTP, export, both measurement
adapters, and all sixteen toolchain/proof gates. Its
[build manifest](../verification/r06-bound-throttle-v1/application-build.json.gz)
binds the new host source. No independent review ran under the solo constraint.

This does not explain or erase the earlier v5 Superflip loss. That pair also
differs in native terminal lower bounds, fifteen against sixteen. Historical
benchmark source seals remain authoritative for their own adapter version.
