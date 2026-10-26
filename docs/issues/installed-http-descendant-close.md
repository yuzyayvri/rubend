# Installed HTTP cleanup checked before descendant exit

The original `u07-delivery-v1` exports and imports the actual Nix runtime
artifact successfully. Its first installed HTTP session serves the expected
assets, passes request guards, answers twenty known cases and retains its native
owner across cancellation. The driver independently replays 59 query candidates.

The check fails after normal wrapper shutdown with `ownerGone: false` for a
bubblewrap helper. The application and native identities are already gone.
All four recorded identities are gone at later inspection. The original
failure, all 8,176 source seals, three resource receipts and successful prefix
records are preserved in `../verification/next-plan/U07/u07-delivery-v1-failed/`.
The failed queue has no resource stop and its worker is gone.

Five installed startup and shutdown probes reproduce a helper still present at
outer-child close in four cases. The observed helper has parent PID1, state R
and an empty command line. Every recorded identity disappears within the later
bounded observations. These probes do not measure solve or cleanup performance.
Their observations survive, but the diagnostic output filename collides with
the resource receipt filename. No saved resource receipt is claimed for that
probe. The failed delivery's three original resource receipts are unaffected.

The driver's wrong assumption is that its child's `close` event also waits for
every observed descendant. Fix Root Causes requires changing that observation
boundary, not changing application shutdown or ignoring helper identities.
Model the Domain leads to a finite settlement record with initial and final
PID/start snapshots. A persistent process or IPC path still fails acceptance.
The existing no-forced-kill and normal-wrapper-exit checks remain unchanged.

`tests/owned-process-settlement.mjs` uses real processes. One stays live through
the finite limit and must remain incomplete. Another handles SIGTERM, waits
sixty milliseconds and exits normally. The settlement check must observe its
exit without sending a second signal. The initial immediate-snapshot helper
fails this delayed-exit expectation. The fix and same-installed-package recovery
are not yet verified.
