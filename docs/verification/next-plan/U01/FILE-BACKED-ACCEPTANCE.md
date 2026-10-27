# Real clipboard policy and file-backed export acceptance

The earlier browser connection did not expose an application download event,
and its synthetic clipboard function was replaced. Those observations remain
unverified, not product failures or passing acceptance.

## Current isolated capability evidence

A fresh hidden-browser probe serves an explicit `clipboard-write=()` policy
without overriding the Clipboard API. Its actual write rejects with
`NotAllowedError`; the document policy is false and permission state denied.
A direct HTTP download emits the supported event and saves the expected file.
A Blob download times out at that event API but nevertheless saves its file.
Both actual files contain the same 94 bytes and expected SHA256. Their creation
times fall within the probe execution. Reading a Blob was not used as evidence
that a file was saved.

The probe is throwaway and isolated from production. Its resource window later
expires, so its final resource record is not relabeled passed. The observations
precede that timeout and its tab is closed. Preserve the source, timeout,
actual files and observations. The decision is to verify real files and browser
policy in the app, not to change the application's working download handler.

## Actual application protocol

Use the unchanged source-bound app/native build. The test proxy's `policy-only`
mode sends the real denial header and adds a read-only policy observer. It does
not redefine `navigator.clipboard`, intercept writeText, alter permissions or
change any production code. The observer checks document policy, permission
state and whether the original write method remains unchanged.

Set `R U R' U'` through the ordinary face-turn buttons, solve exactly through
the actual native engine, and check the known four-move result and independent
original-root replay. Click Copy using
the browser's supported pointer API. Require the actual policy denial and the
visible fallback message. Do not count a fixture-thrown error as browser denial.

Open the real export dialog and record its exact displayed text. Observe the
actual download directory established by the HTTP download receipt. Preserve
any pre-existing `rubend-solve.json` in a private temporary backup, leaving the
expected path absent before clicking the real Download button. A filesystem
event watcher waits only for that path and accepts only the exact displayed
bytes. Partial files, wrong content and files present before the action fail.
The observer never writes those expected bytes to the download path.

Move the actual downloaded file into evidence, parse and compare its record,
then independently replay its moves. Restore any pre-existing download with
unchanged bytes and retain no private backup in the published evidence.
Unknown concurrent files are never overwritten. No download event, HTTP
response body, in-memory Blob or modal JSON alone supplies this witness.
The original strict event-based driver remains unchanged.

## Evidence and bounds

Seal the source, unchanged accepted app build, native binary and fixture/driver
before the live run. Keep the browser hidden. A 1-GiB nice-10 CPU2 fixture
scope lasts at most ten minutes; close the tab and request normal fixture
shutdown after the checks. Require all server/native identities and IPC gone.
Record exact source hashes and actual resource/cleanup outcomes.

The post-live fixed queue checks fixture HTTP/lifecycle behavior, the read-only
policy observer and file-event controls. It verifies source seals, actual
displayed/downloaded bytes, independent replay, screenshots and restoration.
Source-identical engine/proof/package evidence is reused. This closes only the
named UI acceptance cases, not stronger search certification, operator review,
performance targets, final evaluation or publication. Work remains solo.

## Preserved automated text-entry interference

The first live run uses text fill and catches an altered clipboard method.
Document policy and permission are denied, but the replaced binding reports
success. The assertion correctly fails. A fresh context on the same test origin
restores the saved position without text fill; the binding stays unchanged and
the actual Copy action reports the required fallback. This is automation
interference, not a product defect or a passing denial test.

Before changing the driver, the failed source seals, resource receipt, native/IPC
cleanup, protected-download hash and both context observations are preserved in
[the failed live archive](u01-file-acceptance-v1-failed/index.json).
The second run uses only ordinary face-turn controls for input. Three quarter
turns supply each inverse, with reduced animation, so no text-fill operation
can contaminate the capability under test. The original clipboard method and
actual browser-policy denial assertions remain mandatory. No binding is restored,
overridden or replaced by the fixture or the driver.

## Accepted result

The second live run and its fixed post-live queue pass. Copy displays
`Clipboard unavailable. Use Export to save the moves.` under the actual denied
document policy with the original Clipboard API binding unchanged. The actual
397-byte downloaded record equals the displayed text and independently replays
to solved. The pre-existing download is restored byte-identically; no private
backup remains. The fixture, server, native owners and IPC clean up normally.

`node bench/check-background-results.mjs u01-file-acceptance-v2` verifies
3,947 seals, two resource receipts, no resource stops and the absent queue worker.
The seven fixture lifecycle modes, read-only policy observation and file-event
controls all pass. Read [the compressed evidence](u01-file-acceptance-v2/index.json)
and [the actual screenshots](u01-file-acceptance-v2-media/index.json).
The earlier failed live run and later capability-probe timeout are preserved,
not relabeled passed. This closes the named clipboard/download acceptance gap.
It does not close final evaluation, performance, operator or independent review,
whole-search formal certification or publication gates.
