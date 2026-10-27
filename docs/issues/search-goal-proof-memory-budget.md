# Combined goal-proof job exceeded its declared memory

The `u06-search-goal-v1` proof job was stopped by aggregate RSS enforcement at
1,594,364 KiB against a 1,536-MiB ceiling. The wrapper reports exit one while
the command receipt reports null exit, SIGKILL and `aggregate-rss-limit`.
This is a resource stop, not a theorem rejection or accepted proof batch.

The helper imports each full actual search module and the checked reference.
The seven profile checks ran inside one host job. The run had emitted two
translated modules and two JavaScript modules before the next profile stopped.
No per-profile checker receipts were saved. Those partial outputs cannot be
relabeled as reusable passing evidence.

The strict resource-stop preserver verifies all 3,077 seals, receipt commands,
limits and worker/checker cleanup. It retains the distinct wrapper and command
statuses. The ordinary failed-command preserver correctly refuses their status
disagreement. The supplemental archive preserves all sixty partial artifacts,
including both translations, with zero checker-pass claims.

The recovery leaves the predicate, proof template, reference type, source-fault
fixtures, checker configuration and law statements unchanged. Each actual profile
gets its own serial job and 3-GiB ceiling under the existing resource policy.
The eight-GiB desktop reserve, no swap, affinity and low priority remain enforced.
Every completed profile gets a durable proof/translation/module record and job
receipt before the next starts. Failed-batch checker results are not reused.
Seven fresh verdicts, sixteen rejected proof entrypoints and all finite/native
checks remain required. The first resource-stopped run stays stopped.

The memory correction passes in `u06-search-goal-v2`. All seven profile jobs
complete. H0 peaks at 1,654,728 KiB, above the original cap and within its new
three-GiB ceiling. The stopped run is not relabeled. Final dependency audit
found a separate [input-seal gap](search-goal-recovery-input-seals.md), subsequently
closed by the fully sealed v3 finite/native rerun. No production or label change.
