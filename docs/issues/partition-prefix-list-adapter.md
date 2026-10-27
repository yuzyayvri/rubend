# Prefix oracle used the application move-list decoder

Observed October 24, 2026 in `u05-prefix-v1`. Compilation, the pure module's verdict
and twenty native census rows completed. The JavaScript oracle then stopped with
`List limit exceeded` while reading the valid four-move census of 43,254 IDs.

The test imported `apps/model.mjs`'s move-list decoder. That application limit is
appropriate for user move text, not a bounded experimental prefix census. Keep
the application limit unchanged. Use a separate prefix decoder limited by the
declared depth, at most 18^4 entries, with unsigned ID, list-shape and termination
checks. This is a test-adapter correction, not a search or move-rule change.

The failed run is preserved at
`docs/verification/next-plan/U05/u05-prefix-v1-failed/index.json`. The supplemental
record preserves twenty native rows and the complete eleven-file immutable Bend
source snapshot. The original run remains failed. Reuse matching compiled
artifacts and native rows in a fresh recovery run rather than rebuilding them.

The focused 43,254-entry regression fails before the adapter fix with the same
exception. The corrected reader must also handle the full 18^4 boundary and
reject an extra entry, cycles, malformed tails, bad IDs and excessive depth.
Prefix coverage remains unaccepted until the recovered oracle and unchanged
proof/toolchain gates finish and canonical verification passes.

The [recovery](../verification/next-plan/U05/u05-prefix-recovery-v1/index.json)
passed canonical verification with 2,307 seals and all three receipts. Its finite
censuses/coverage controls, native parity and unchanged gates pass. This closes
the adapter defect. The application limit and original failed record remain
unchanged. No universal partition/search-completeness claim is established.
