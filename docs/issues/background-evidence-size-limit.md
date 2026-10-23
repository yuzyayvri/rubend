# Large background traces exceed synchronous archival cap

Observed in `u04-prior-order-v1` after every job passed. The canonical checker
verified revision, 1,921 source seals, five resource receipts and worker exit,
then its archival helper refused with `Evidence exceeds 32 MiB`. Pilot JSON is
40,041,728 bytes and development JSON is 56,888,911 bytes. Full snapshots were
retained deliberately; no benchmark failed and no trace was truncated.

The same completed run passed `--verify-only` before tracked source edits.
`tests/streamed-archive.mjs bench/archive-evidence.mjs` reproduces the refusal
on valid JSON just over 32 MiB. The bounded alternative
`bench/archive-streamed-evidence.mjs` caps input at 128 MiB, validates JSON,
streams compression and decompression, checks source identity and both hashes,
and publishes the destination without overwrite. It does not make JSON parsing
constant-memory. The original synchronous helper and its cap are unchanged.

The new roundtrip, exclusive-output and malformed-input test passes. Both real
traces were archived under separate two-GiB, ninety-second, low-priority resource
receipts. Sources remain at their original paths and bytes. The unchanged
canonical checker subsequently verified the full
[archive](../verification/next-plan/U04/u04-prior-order-v1/index.json).
Its compressed JSON records contain the original native traces, not summaries.

Recovery receipts are `build/evidence/u04-prior-archive-development-v2.json`
and `build/evidence/u04-prior-archive-pilot-v2.json`, preserved alongside the
archive. Automatic size-based selection and a checker regression are the next
maintenance step. Independent review was not run under the solo restriction.
