# Clipboard and download acceptance gap

Status is closed by `u01-file-acceptance-v2`. This was a verification gap,
not a confirmed product defect. The historical failures below remain failures.

The new hidden app run uses a real `clipboard-write=()` document policy and a
read-only observer, without redefining the Clipboard API. The original write
binding stays unchanged. Copy displays the actual clipboard-unavailable fallback.
The source-bound native engine solves the four-move input, and an independent
facelet replay checks the answer. The actual browser-created 397-byte download
matches the displayed record exactly. Its path was absent before the click;
the existing user download is restored byte-identically after preserving the
new file. All fixture, server, native owners and IPC are gone.

The canonical checker verifies 3,947 source seals and both resource receipts,
with no resource stop and no remaining worker. See
[the acceptance protocol](../verification/next-plan/U01/FILE-BACKED-ACCEPTANCE.md),
[the raw archive](../verification/next-plan/U01/u01-file-acceptance-v2/index.json)
and [actual screenshots](../verification/next-plan/U01/u01-file-acceptance-v2-media/index.json).
This does not claim that the missing Blob download event now works. It uses the
actual filesystem output, not a Blob or modal read, as the download witness.
The original strict event-based driver and production handlers are unchanged.

## Preserved earlier observations

The in-app browser replaces the test fixture's `navigator.clipboard.writeText`
method. A DOM diagnostic compares the current method with the fixture's exact
denial function and records `fixtureMethodIntact: false`. Copy then reports
`Moves copied.` despite both the early denial override and an explicit
`Permissions-Policy: clipboard-write=()` response. The fixture override passes
its isolated executable test. Do not count this browser run as denied-clipboard
coverage or infer that a normal browser ignores permission policy.

The export modal contains a valid canonical solve record. Keyboard activation
and one inspected pointer activation of Download produce no observable download
event in this browser connection. The saved pointer attempt times out after five
seconds. There is no console error. This does not prove either that a file was
saved or that the product's download handler is broken.

Raw observations are in build/evidence/next-plan/U01/u01-live-acceptance-v1/
and u01-live-acceptance-v2/. Compressed copies are in the U01 browser archive.
Keep the strict browser-driver assertions. Close this gap only with an actual
permission-denial result and a downloaded file whose bytes agree with the
displayed, replay-checked record. Use a supported browser connection that can
observe those operations. Do not add production test hooks to make it pass.
