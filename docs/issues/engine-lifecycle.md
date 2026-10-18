# Native readiness and cancellation lifecycle

Status is open. Found by source inspection at `d6120b2` on 2026-10-17.
Subsequent large-profile integration checks reproduce the kill/reload behavior.
It is not fixed yet.

`apps/server.mjs:26` returns `ready: engine.available`. The initialization path
in `apps/web/main.mjs:93` instead unconditionally sets `ready=true` after a
successful response. The UI can therefore advertise readiness while native
initialization is unfinished. The server still waits for native readiness before
solving, so this observation does not establish invalid solutions or data loss.

`Engine.cancel` kills the old process and starts its replacement without waiting
for old-process cleanup. This discards loaded tables and allows transient worker
overlap. The existing large-profile integration record measured 336 ms to old
exit and 1,944 ms to recovery in one run. It is not a repeated latency benchmark.
The corner-first backend's thirty-four-case Engine check later observes 367 ms
to old exit and 1,973 ms from cancellation to readiness. This misses the 100-ms
target. The source bridge is unchanged, so do not attribute the observation to
the new bound or claim a comparative regression. The raw receipt is
docs/verification/r02-corner-first-v1/r02-corner-first-native-http-v1.json.gz.

The browser's model request map has no worker `error` or `messageerror` rejection.
A failed model worker can leave pending requests unresolved.

Proposed resolution belongs to the lifecycle unit in the
[optimization roadmap](../architecture/OPTIMIZATION-ROADMAP.md). Use explicit
initializing, ready, searching, cancelling, failed, and closed states. Test the
source-observed paths with delayed readiness, model-worker failure, cancellation,
immediate resubmit, and forced-stop fixtures before accepting a fix. Keep the
server guards, replay checks, stale-result isolation, and owned-IPC cleanup.
