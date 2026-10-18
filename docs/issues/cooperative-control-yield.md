# Cooperative control must yield to IO

Status is fixed and functionally verified. Matched performance remains open.
The first actual native cancellation test falls
back to a replacement process. The host fixtures pass but do not model Bend's
event loop. Preserve build/evidence/r06-native-lifecycle-v1.json as the failing
prototype receipt. It observes PID1452284 instead of original PID1452275.

The installed Bend2.0.37 emitted runtime explains the failure. `io_step` keeps
executing the current computation until an effect parks. A zero-timeout empty
channel poll returns immediately. Clock reads and printing also return
immediately. The pure search loop therefore never returns control to `io_loop`.
Completed helper-thread file reads cannot be delivered to the control reader,
even after the OS has read the cancellation bytes.

The worker now calls `IO.sleep(0)` between bounded search slices. The installed
sleep effect always parks and gives `io_loop` a chance to deliver completed
reads and run the persistent reader. This is a zero-delay yield, not a repeated
uncancelled race or a positive sleep between nodes. Polling remains nonblocking.
No runtime, foreign effect, pure search, table, or law changes are needed.

`tests/native-lifecycle.mjs` must keep the original PID and generation across
five cancels, solve each following job, accept fragmented control, ignore a stale
ID, and remove IPC. A faster fallback does not satisfy the test. Performance and
deadline checks remain separate from this functional gate.
