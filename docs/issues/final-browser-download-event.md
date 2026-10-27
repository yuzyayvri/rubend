# Release export download event not observed

During the hidden final stored-event browser check, the application displays a
replay-certified nineteen-HTM JSON export for `release-91`, with lower bound zero
and `searchOptimal` false. The captured export is independently replayed by the
post-live checker. The source-bound screenshot and DOM record preserve its exact
input and moves.

The agent registers the browser's documented download-event wait before clicking
Download JSON. No event is observed within ten seconds. The export dialog remains
available and the browser console has no recorded warning or error. Whether a
file was actually saved is not established. No physical release-case download
success or cause is claimed. The attempted observation is retained in
`build/experiments/u07-final-browser-live-v1/browser-observations.json` under
`release-export.physicalDownloadStatus`.

The existing actual physical-download and clipboard-denial checks remain
source-identical prior evidence, not a new release-case download. The final
application matrix distinguishes the new JSON display/export and replay from
that reused physical-file evidence. No product or frozen benchmark change is
justified solely by this unobserved browser event. A later fresh physical-file
claim needs an observed file and matching bytes through a supported mechanism.

## File-backed resolution

The existing project evidence already records the same Blob-event limitation.
A new hidden stored-record session therefore uses the unchanged filesystem-event
observer from `tests/u01-file-backed-acceptance.mjs`. It moves the pre-existing
expected download into a private backup, requires the expected path to be absent,
then clicks the real application Download button. Only a browser-created file
with the exact displayed bytes is accepted. The observer does not write those
bytes to the download location.

The actual 547-byte file arrives and has SHA256
`d56b48f27430653337094abc99c8879c577ed48c69dc0434a90da257ffa65bbb`.
Its nineteen moves independently replay through Bend and geometry. The original
download is restored byte-identically and no private backup remains. The tab
closes and the replay server stops normally. All 5,146 live source hashes and
resource fields are checked before tracked edits and saved in
`build/evidence/u07-final-download-v1-live-verification.json`.

This closes the physical-file observation gap for the new stored release answer.
The first event wait remains unobserved and is not relabeled passed. No new
solver or holdout measurement runs. The final canonical audit remains required.
