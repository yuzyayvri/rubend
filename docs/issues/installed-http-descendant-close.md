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
fails with `false !== true` before the fix. The bounded implementation passes
both real-process controls and rejects four invalid limits. These checks have
saved 512-MiB resource receipts. They are behavioral controls, not timing claims.

The HTTP driver now waits at most one second for all recorded identities and
PID-root IPC paths to disappear after wrapper close. It retains both the first
and final snapshots, the sample count and the configured limit. It sends no
extra cleanup signal. Same-installed-package integration is still pending.

`u07-delivery-http-v1` reuses the unchanged exports and import. A fresh check
compares all 67 runtime metadata records and runs actual Nix content verification.
The queue runs three fresh installed HTTP sessions and only then writes a new
local-delivery receipt. The old failed run remains failed. No application,
engine, law, package build, CI artifact pin or holdout case changes.

The same-package recovery now passes canonical verification with 8,248 seals,
three resource receipts, no resource stop and the worker gone. All three actual
sessions pass, with 69 independently replayed candidates and every recorded
identity and PID-root IPC path gone. Two sessions observe a helper present at
outer close and absent during bounded settlement. The integration regression
is resolved without an application or solver change. The original failure is
still preserved and failed. Browser and final comparative acceptance are separate.
