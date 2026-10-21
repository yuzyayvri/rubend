# Installed GUI supervisor cleanup ordering

Status is fixed in test supervision. Production code is unchanged.

The first package browser workflow passed, but its immediate cleanup snapshot
still observed the native owner after the outer namespace wrapper exited.
A later scoped `/proc` probe found no process. The failed snapshot and later
observation are preserved in the U01 cross-profile GUI archive.

The installed application owns native cleanup. The fixture now finds its host
PID through the owned process tree, checks PID/start identity, sends SIGTERM,
then waits for the outer wrapper. This lets the app finish its existing Engine
cleanup and reap its native child. A bounded forced fallback fails the cleanup
result and fixture exit status. A fresh browser workflow and three supervisor
repeats pass with no force and both application/native owners gone.

Normal fixture tests stay independent of the ignored imported store.
The explicit delivered-artifact mode requires the completed U01 import.

Repeated termination requests now share one cleanup promise. A second request
cannot exit the fixture before the first finishes. The next focused queue
requests repeated termination in both normal and delivered fixture tests.
Those new repeated-signal checks are pending until the saved queue result.
