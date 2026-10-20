# Clipboard and download acceptance gap

Status is open. This is a verification gap, not a confirmed product defect.

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
