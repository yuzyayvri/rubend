# Partition coordinator and retry

The single-worker protocol passes. This unit checks isolated worker ownership,
complete accounting and retry convergence. It does not compare throughput or
update the application. Reuse the exact verified native binary, table,1,124jobs
and independent oracle from the worker archive.

Split immutable requests into two static shards. Each attempt owns its file,
process, output and native table. Workers stay in the outer resource runner's
process group, so its emergency stop also reaches them. Each attempt targets its
own PID with start-identity checks for bounded termination. Workers never write a shared ledger.
The host checks complete job blocks against the source-bound single-worker
records, then orders the actual blocks by the original manifest for one final
ledger check. Preserve raw per-attempt streams separately. The merged transcript
is derived evidence, not a claimed single-worker emission.

The collector stores one validated block per required job. Identical retries are
idempotent. Unknown jobs, conflicting duplicates and changed scope fields fail.
A checkpoint stores actual blocks, not an authoritative completion count.
Restoration replays those blocks through the same admission checks. Completion
requires every manifest member. Partial probes remain partial in the final ledger
check; complete batch accounting does not mean contour exclusion.

For failure, give the unchanged worker one valid no-hit job followed by a refused
request. Require its actual nonzero exit. Preserve the completed block and rejected
trailing input. The remaining243jobs prevent commitment. Restore a fresh collector
from its checkpoint and retry all244jobs in two shards. The first result repeats
without counting twice. Only the full recovered manifest can reach the existing
private no-hit ledger closure. This tests real input-refusal recovery, not an OS
crash or cancellation-latency claim.

Freeze execution mode before the run from the resource policy. Two concurrent
2-GiB table owners use a5-GiB aggregate ceiling andCPU2/3only when at least8GiB
of additional memory is available. Otherwise use a3-GiB serial two-shard mode
and mark concurrent ownership unverified. Never run two independently reserved
limits against the same aggregate budget. All attempts stay low priority, have
bounded output/time, and must leave no owned process alive.

Source/cache identities and complete semantic results must match. Reuse passing
oracle work, not new solver runs or table builds. The worker policy and existing
ledger are unchanged. NP07, universal completeness, production lower bounds,
multicore scaling and performance acceptance remain open. Independent review is
not run under solo work.

The fixed queue is `u05-pool-v1`, expected four minutes, capped at twelve.
It checks collector fixtures first, then five real native attempts, saved-result
and checkpoint corruptions, and unchanged proof/toolchain gates. No native rebuild
or independent-oracle repeat. Each actor's group identity is checked against the
resource-limited coordinator, and actual CPU affinity is captured at readiness
when the process remains alive. All children must be gone before acceptance.

## Result

The [canonical archive](u05-pool-v1/index.json) verifies2,470source seals and
four resource receipts. Both normal workers and both retry workers have concurrent
lifetimes and both reach readiness before either closes. Actual affinities are
CPU2andCPU3. Their process groups match the resource-limited coordinator.
All five owned processes are gone. There is no resource stop or forced kill.

The two-shard normal run reproduces every one of the1,124single-worker results
and the same ledger outcomes. The input-refusing worker exits2after one complete
job. Its243missing jobs prevent commitment. Checkpoint replay and244-job retry
recover the scope, with exactly one identical duplicate. Source, cache, fixture,
actual-record/checkpoint and unchanged proof/toolchain gates pass. The native
binary and independent oracle are reused unchanged.

This is concurrent ownership and recovery evidence, not a speed comparison or
NP07 proof. No production lower bound or application code changed.
