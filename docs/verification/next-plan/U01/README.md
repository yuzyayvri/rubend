# Application and package acceptance

## Current artifact

The [current import queue](u01-delivery-redesign-v1/index.json) passed all
1,479 seals, 67 closure paths, six checksums, installed HTTP/native replay,
three supervisor shutdowns, and unchanged proof gates. The
[actual installed-package GUI](u01-installed-redesign-gui-v1/index.json) then
passed solve/export, playback/rewind, cancellation/resubmission, invalid input,
theme/saved state, search-lock keys, repeated seeks, mobile rail, narrow controls,
and sticker editor. Preview cleanup is complete. Clipboard denial and actual
downloaded-file acceptance remain unverified. No independent review ran.

The October 22 redesigned build passed local full regression and hosted CI at
369f480. The completed local run is in
[the redesign regression archive](u01-redesign-v1/index.json).
The `redesign` pin in `bench/delivery-pins.mjs` identifies successful run
39787894581, package artifact 12429624367, its SHA256 ZIP digest, and byte size.
The legacy pin and its original artifact remain intact. No historical receipt
is relabeled as a redesigned-package result.

Use a fresh run id after committing source:

```sh
nix develop --command node bench/u01-delivery.mjs plan u01-delivery-redesign-v1 redesign
nix develop --command node bench/background-tests.mjs start build/evidence/u01-delivery-redesign-v1-plan.json
```

The serial queue requests three GiB and low-priority CPU 2. It retains the
eight-GiB desktop reserve. The two job caps total twelve minutes; expected
duration is five minutes. It downloads about 89 MB and caps the import stream
at two GiB. It checks delivered HTML, CSS, and favicon against the manifest's
source hashes, then installed native HTTP replay/cancellation and three
supervisor starts/stops. No package rebuild or new table is needed.

After the queue passes, the new private-store entrypoint can be driven through
the hidden browser with `tests/ui-fixture-server.mjs delivered RUN-ID
u01-delivery-redesign-v1`. `tests/ui-fixture-session.mjs --delivered
u01-delivery-redesign-v1` checks its supervisor only, not browser interaction.
The fixture rejects mismatched artifact identity, store path, native binary, or
current source graph. It does not weaken the old-source guard. Clipboard
denial, actual file download, and raw timing remain open.

## Historical acceptance records

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

Remaining work includes cancellation across profiles in the GUI, repeated
live seeks and control isolation during native work, clipboard denial,
downloaded records, and browser acceptance of the imported CI package.
Native failure, failed rewind, delayed readiness, context recovery, fallback,
layout, persistence, and isolated artifact import/HTTP launch now have receipts
below. U01 is still not complete.

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
nix develop --command node bench/u01-ui-checks.mjs plan u01-ui-checks-v3
nix develop --command node bench/background-tests.mjs start build/evidence/u01-ui-checks-v3-plan.json
```

One serial job uses 3 GiB, low-priority CPU 2, and a five-minute hard cap.
Expected duration is two minutes. It checks focused fixture/model/playback/
export tests, saved replay and process cleanup, and existing proof/toolchain
gates. It does not rebuild the app, repeat the full suite, or rerun a browser.
Passing it cannot close clipboard/download or the remaining U01 matrix.
The first plan's four-GiB ceiling was refused by resource admission before tests.
The three-GiB ceiling uses the prior focused receipt's observed peak for sizing.
The eight-GiB desktop reserve and all enforcement remain unchanged.
The v2 focused tests passed before a receipt-validator assertion failed. The
recorded content width is 375 pixels inside the requested 390-pixel viewport.
The corrected v3 validator checks fit and overflow instead of exact equality.
Accepting and rejecting dimension fixtures protect that distinction. This is
not a product-layout fix. Both earlier failed runs remain preserved.

[The v3 check archive](u01-ui-checks-v3/index.json) passes all focused tests,
saved replay/cleanup checks, and sixteen toolchain/proof gates. All 1,257 seals
match. The worker is gone, with no resource stop.

## Rewind, native failure, and delayed readiness

[The lifecycle browser archive](u01-lifecycle-browser-v1/index.json) adds three
real-browser scenarios without changing production code. A model-worker fixture
allows the first playback apply and throws on the rewind apply. The committed
step and facelets remain unchanged, ten Space presses do not restart playback,
pending requests settle, and the retained exported solution still replays.

A separate session starts the existing hard development case in native exact
search. `bench/u01-native-failure.mjs` verifies the recorded wrapper, server,
native PID/start identities, and native IPC argument before issuing SIGKILL to
that single test owner. The browser settles with an explicit native error,
searching stops, and solving becomes unavailable. Its model remains active.
The helper rejects a stale native identity before any signal. It adds no HTTP
control endpoint and cannot silently retarget a reused PID.

The delayed-readiness fixture keeps solving disabled while model input remains
usable and canonical. No solve is queued. The fixture stops before its 25-second
readiness delay, and its process/IPC cleanup passes. This is a live GUI readiness
check with a delayed fixture, not a cold large-table startup measurement.

The initial rewind driver read the healthy first step before animation committed.
It now waits for visible `1 / 4` before requesting rewind. Both attempts are
preserved. Four session wrappers and all recorded owners stop cleanly. Temporary
tabs close. Full accessibility trees are no longer emitted by every shared
shallow-solve observation, but the driver still samples and checks current state.

The same focused runner now verifies these receipts and the stale-identity
rejection. It uses three GiB, one low-priority CPU, and a five-minute cap.
Expected duration is two minutes. No app rebuild, full-suite repeat, table build,
or benchmark is needed for these test-only changes.

```sh
nix develop --command node bench/u01-ui-checks.mjs plan u01-ui-checks-v4
nix develop --command node bench/background-tests.mjs start build/evidence/u01-ui-checks-v4-plan.json
```

## Cross-profile and actual-package GUI acceptance

[V4 passed](u01-ui-checks-v4/index.json) with 1,306 matching seals and no live
worker or resource stop. [The new GUI archive](u01-cross-profile-gui-v1/index.json)
retains ninety compressed JSON records and two representative screenshots.
All six preserved profiles pass solve/export, canonical keyboard/playback/rewind,
cancel/resubmit, and invalid-input isolation. Profiles run serially with one
low-priority CPU and three GiB. Each original native PID/start identity remains
present before shutdown, then stops and removes its recorded IPC. This does
not promote the rejected or experimental profiles' performance.

The imported CI package passes the same browser workflow. The runtime mounts
only its private store, kernel process/device interfaces, temporary storage,
and an empty working directory. Host store and repository remain unavailable.
The proxy serves its actual frontend/worker and adds only the diagnostic mirror.
Native digest and manifest/source identity are checked before launch. No NAR
transfer, import, or build is repeated.

The first package GUI workflow passed, but its immediate cleanup snapshot still
observed the native owner after the outer wrapper exited. A later scoped probe
found it gone. That failed snapshot is preserved. The supervisor now signals
the installed application owner, then waits for its namespace wrapper. Its
three-second forced fallback cannot count as clean shutdown. Exit status now
reflects cleanup success. A fresh GUI workflow and three explicit supervisor
repeats pass without force and with both application/native identities gone.
This fixes test supervision, not product code. See
[the resolved issue](../../../issues/installed-gui-supervision.md).

The ordinary fixture regression does not require the ignored imported store.
`tests/ui-fixture-session.mjs --delivered` explicitly checks it separately.
Existing supervision and one hidden browser tab are reused. Design/review is
solo. No independent review, new law, or production change is claimed.

Four cache hashes matched before GUI work. V5 rehashes them afterward and checks
fourteen passing sessions, owner retention, focused regressions, and `just check`.
The failed first package snapshot stays outside the passing set. Post-GUI cache
equality is pending, not inferred from the preflight. Clipboard/download and
under-load seeking remain open.

```sh
nix develop --command node bench/u01-ui-checks.mjs caches u01-ui-checks-v5
nix develop --command node bench/u01-ui-checks.mjs plan u01-ui-checks-v5
nix develop --command node bench/background-tests.mjs start build/evidence/u01-ui-checks-v5-plan.json
```

The v5 preflight already ran. Do not overwrite its immutable file. Use a fresh
id for any deliberate new batch. The queued job uses three GiB, low-priority
CPU 2, and a five-minute cap. Expected duration is two minutes. It performs no
browser rerun, package rebuild, table generation, or performance comparison.
