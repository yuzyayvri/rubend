# Application and package acceptance

U01 is not complete. The full programme remains at U00's unresolved raw timing
acceptance gate. Preparatory browser checks can establish functional behavior
without promoting the lifecycle policy or changing solver defaults.

The actual model-worker failure lane passes. Its full records, source hashes,
cleanup, and screenshot are in
[the shared browser archive](../U00/u00-browser-profiles-v1/index.json).
Playback stops after a worker exception. Twenty Space presses and arrow seeks
leave pending requests at zero, the diagnostic timer advancing, and the retained
answer unchanged and exportable. All temporary tabs and owned processes stop.

`tests/u00-browser-driver.mjs` contains the rerunnable browser scenario.
`tests/ui-fixture-server.mjs model-failure RUN-ID` serves the current app with
a deliberate worker exception and a diagnostic-only DOM mirror. The bridge
does not expose session tokens. `tests/ui-fixture-session.mjs` checks delayed
startup abort, model-failure fixture delivery, incompatible readiness, origin
protection, and process cleanup without claiming real-browser execution.

Remaining work includes cancellation across profiles in the GUI, native death
during search, failure at rewind, repeated live seeks, context loss and recovery,
2D fallback, narrow layout, clipboard denial, downloaded records, saved state,
and isolated import/launch of the actual CI artifact. The earlier successful
CI export is not evidence for import and launch.

## Development regression

[The full regression archive](u01-checks-v2/index.json) passes all sixteen
`just check` gates and the complete `just test` at 9b73f82. The queue finished
at 00:26:40 Manila on October 21. All 1,190 source seals and receipt digests
match. The worker is gone and neither job hit a resource stop. No independent
review ran. This does not close the remaining browser and delivery checks.

## Fixed delivered-package check

`bench/u01-delivery.mjs` pins successful GitHub run 39291425745, package artifact
12205837803, its ZIP digest, and source commit a7a0872. It verifies the complete
ZIP entry set and every delivered checksum before using the NAR. It rejects
expired or replaced artifacts, failed runs, wrong commits, and changed source
graphs. The artifact is still available when this queue is prepared.

The check imports into a fresh store under its ignored run directory. It does
not write the host Nix store or contact the Nix daemon. The installed app runs
with only that imported `/nix` tree, kernel process/device interfaces, a temporary
directory, and an empty working directory. The runtime has no repository or
host store mounted. Its environment is cleared and loopback networking stays
shared so the existing HTTP suite can reach it. This is a filesystem/environment
relocation check on this supported host, not a different kernel or browser.

The existing HTTP suite gains explicit argument support for the isolated
entrypoint. It retains the same origin/session guards, invalid inputs, streamed
four-move optimum, cancellation, and recovery assertions. A focused regression
checks three rejected argument shapes and the normal explicit Node entrypoint.
No product code or installed package is changed. Native solving occurs inside
the delivered package through HTTP, not through a substitute engine.

This design avoids a second HTTP implementation and any package rebuild.
The data shape is one pinned delivery identity and one fresh private store.
The rejected alternative copied the HTTP checks into a separate driver and
would duplicate its acceptance rules. Design review is a solo sequential pass.

After committing source, use a fresh run id:

```sh
nix develop --command node bench/u01-delivery.mjs plan u01-delivery-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u01-delivery-v1-plan.json
```

The serial jobs use 4 GiB and CPU 2 at low priority. The focused checks have a
two-minute cap and delivery has ten minutes. Expected duration is five minutes.
The second job downloads about 89 MB. The uncompressed import stream is capped
at two GiB. No new pruning table, package build, deployment, or system change
is part of this queue. Read its saved result on the next ping without polling.
Package browser acceptance remains separate even if these checks pass.

[The actual delivery archive](u01-delivery-v1/index.json) passes both jobs at
01:00:41 Manila on October 21. The GitHub ZIP digest and all six delivered
checksums match. All 67 closure paths import into the private store. The
installed package manifest agrees with its native/modules and current source
graph. Its isolated entrypoint passes the existing HTTP, native-replay, origin,
session, invalid-input, cancellation, and recovery checks. The host store and
repository are not mounted. All 1,197 source seals and resource receipts verify.
The detached worker has stopped. This does not establish package GUI acceptance.

## Browser recovery and fallback

[The partial browser archive](u01-browser-acceptance-v1/index.json) retains
twenty-one compressed JSON records and three representative screenshots.
The actual `WEBGL_lose_context` extension loses and restores the renderer.
Canonical state and the solution survive. Stepping while the context is lost
agrees with Bend replay, and restoration keeps that committed state. The saved
screenshot shows the renderer drawing the cube again after restoration.

A separate early fixture disables only WebGL context creation. The app still
solves and exports the four-move oracle case, steps, and plays to solved with
no renderer. Both ordinary and fallback controls fit a 390-pixel viewport.
Reload at the same origin restores the committed canonical cube, without
inventing a restored solution record. All three wrappers, servers, and recorded
native owners stop. IPC is removed. Tabs close and the viewport resets.

The acceptance fixture uses a script before the app module and visible
test-only context buttons. Production files are unchanged. Compared with
adding product diagnostics or hooks, this keeps the tested interaction intact.
Design exploration and review were solo. No independent review is claimed.

Clipboard denial fails its intended precondition. The browser replaces the
fixture's exact denial function, recorded as `fixtureMethodIntact: false`.
Copy reports success despite the override and explicit permission policy.
Download activation has no observable event after keyboard and pointer probes.
These are not passing acceptance checks. Keep them open under
[the observation issue](../../../issues/browser-clipboard-download-acceptance.md).
The exported modal record remains canonical, but that alone is not a download.

`tests/u01-browser-driver.mjs` keeps renderer, fallback, persistence, layout,
clipboard, and download checks separately rerunnable. A failed observation
does not prevent unrelated scenarios from producing their own receipts.
`tests/ui-acceptance-setup.mjs` verifies the isolated setup semantics without
accessing a user's clipboard. The fixture-session test now checks five modes,
including early script order and permission policy. Those tests are not GUI
results. `bench/u01-ui-checks.mjs` prepares the next focused detached queue.

```sh
nix develop --command node bench/u01-ui-checks.mjs plan u01-ui-checks-v2
nix develop --command node bench/background-tests.mjs start build/evidence/u01-ui-checks-v2-plan.json
```

One serial job uses 3 GiB, low-priority CPU 2, and a five-minute hard cap.
Expected duration is two minutes. It checks focused fixture/model/playback/
export tests, saved replay and process cleanup, and existing proof/toolchain
gates. It does not rebuild the app, repeat the full suite, or rerun a browser.
Passing it cannot close clipboard/download or the remaining U01 matrix.
The first plan's four-GiB ceiling was refused by resource admission before tests.
The three-GiB ceiling uses the prior focused receipt's observed peak for sizing.
The eight-GiB desktop reserve and all enforcement remain unchanged.
