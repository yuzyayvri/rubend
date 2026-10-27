# Repository confirmation needs its own memory budget

`u06-bounded-reference-v3` passed the reference's full finite and native work.
All 153 bound queries, 36 raw-center controls and 189 native packets agree,
including all corruption controls. The native checksum is 2,582,377,809.
That job peaked at 678,448 KiB aggregate RSS.

The final unchanged `just check` job was incorrectly assigned the same 2 GiB
ceiling. The RSS monitor stopped it at 2,158,884 KiB. Prior successful runs of
that repository-wide gate peaked at 2,295,228, 2,350,356 and 2,581,304 KiB under
3 GiB. Native reference memory was not evidence for the whole gate's budget.
No theorem or behavioral test failed at this stop.

The [stopped archive](../verification/next-plan/U06/u06-bounded-reference-v3-stopped/index.json)
preserves 2,760 seals, both passed receipts, the stopped receipt, complete
reference records and source snapshot. The worker and repository check
processes are gone. The resource command has `exitCode:null`, `SIGKILL` and
`aggregate-rss-limit`, while the queue wrapper reports exit 1. The dedicated
stopped-run preserver verifies and retains both statuses instead of equating
them or changing either record. The original run stays stopped.

## Reuse the unchanged gate rather than run it again

Yuzy requires reuse of passing evidence for unchanged sources. The archived
successful `u02-packed-certificate-v2` confirmation actually ran `just check`.
Its checker script and all 87 current production, fixture and toolchain inputs
match exactly. No input was added, removed or changed. New reference files are
outside that root gate and have their own complete proof and backend evidence.

`u06-bounded-reference-v4` verifies the original archived plan, receipt,
confirmation, command, limits, binary and source hashes. Six record controls
must reject a changed law, missing or added input, stopped gate, wrong command
or false confirmation. It copies the already passing reference records without
rerunning them. The report explicitly labels the root gate reused, not freshly
executed, and never reclassifies the stopped run as passed.

This avoids another memory-heavy check without changing its coverage or
weakening the desktop reserve. The one-minute verification batch requests
1 GiB with a two-minute cap. It does not certify optimized traversal or loaded
data and does not strengthen the application's labels.

The [completed archive](../verification/next-plan/U06/u06-bounded-reference-v4/index.json)
verifies 2,800 seals and its current receipt, worker gone and no new stop.
All six gate-reuse controls pass. The actual root gate is labeled reused, not
fresh, and this original resource stop remains stopped. Reference proofs,
oracle checks and all 189 native packets retain their passing evidence.
