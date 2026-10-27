# Equal completed-contour cost of forward coverage

The [completed scored result](FORWARD-COST-RESULT.md) is inconclusive because
the frozen duplicate CPU gate fails. Production remains unchanged. The sections
below preserve the protocol and its preparation history, not a pending rerun.

The [finite native guard](FORWARD-NATIVE.md) passes. This experiment asks whether
the same two verified native binaries consume less CPU to reach the same
search-established exclusion threshold. It does not yet test deadline answers,
first-answer latency, an integrated application or formal optimized completeness.

The intended narrow claim is a repeatable reduction of native CPU for a fixed
warm batch of completed threshold-fourteen requests on the eight declared
pilot/development roots. The claim remains unmeasured until the fixed batch,
profile review and noise gates pass. A numeric gate is not a product promotion.

The current fixed plan is `u02-forward-cost-v3`. Its scored workload is 128
repetitions, or 1,024 requests per owner. The earlier v2 workload remains
explicitly unmeasured after sizing refused it. No scored sample or ratio informed
the new count. Acceptance gates, cases, binaries, target and deadlines do not
change. Preserve the v1 failure and v2 admission record.

## Ownership and alternatives

Use the exact control and candidate binaries and generated C from
`u02-forward-native-v1`. Do not rebuild or instrument scored release binaries.
Their 8,056 functional requests, 8,040 independent answer replays, four cleanup
receipts and current 87-input toolchain checks are reused by source/artifact
identity. The existing raw table stays immutable.

Two designs were considered solo. New native CPU effects and a new batch loop
would change the verified wrapper. Instead, aggregate the existing process CPU
counter over long host-framed batches. The organizing records bind PID and start
identity, counter units, before/after samples, work, initialization and teardown.
CPU sampling and result parsing belong to the benchmark, not the search frame.
Regular-file batching is not substituted for the current FIFO protocol: the
existing worker reads arbitrary chunks, not a whole file of delimited commands.

## Counter calibration and timing scopes

The existing `parseCpu` reads user and system CPU from process stat fields
fourteen and fifteen. The [Linux man-pages](https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html)
specify clock-tick units converted through `sysconf(_SC_CLK_TCK)`. Read the
actual value through `getconf CLK_TCK`; require 100 on this host, without changing
any setting. The ten-millisecond quantum is explicit, not nanosecond accuracy.

A fixed local calibration compares that unchanged parser with independent
`process.cpuUsage()` around two owned Node worker threads. Both consume
200 million dependent checksum-checked steps. Compare counters while both
threads are alive and again after they exit. A missing thread-group contribution,
PID reuse, counter regression, wrong unit or discrepancy above forty milliseconds
fails before profiling or measurement. Calibration is not solver performance.
The original preparation passes this calibration. Recovery reuses its exact
source import closure and raw record rather than repeating the unchanged work.

For each real sample, native CPU is the counter difference from before the first
measured request through the last observed result. Native input parsing, search,
certificate/output work and host-observation boundary slack remain inside this
scope. It is not CPU until a native emission instant or pure `Search.run` time.
Record host monotonic batch wall and Node driver CPU separately. Both processes
and all observed native threads must retain CPU2 affinity. Their combined CPU
cannot exceed the one-core wall envelope beyond the fixed quantization allowance.

Native cumulative CPU when the host observes readiness and host launch-to-ready
wall are separate initialization records. They are not precise table-only timers.
GNU Time records whole sample-command CPU including the waited native child,
startup, driver and teardown. It bounds the measured native intervals but is
not silently substituted for warm native CPU. No clock overhead is subtracted.

Record native reported VmHWM and RSS at the scoped samples. The outer resource
receipt separately retains sampled aggregate tree RSS and the enforced memory
ceiling. These are different scopes. The [kernel proc documentation](https://www.kernel.org/doc/html/latest/filesystems/proc.html)
also warns that RSS accounting is asynchronous; do not present these observations
as an exact aggregate high-water mark or a personal machine inventory.

## Frozen work and decision rules

Use all eight deeper guard inputs, pilot zero through three and development
zero through three. Each already reaches lower bound fourteen within 200,000
advances in both accepted workers. Select threshold fourteen to compare completed
work instead of mixing unequal fuel-censored trees. No input is discarded based
on observed timing and no release input is opened.

Each fresh owner runs one untimed eight-request warmup, then 128 repetitions
of all eight inputs. Every one of the 1,024 measured requests must reach lower
bound fourteen with no answer and running status. This is completed work for
the requested exclusion threshold, not a solved cube or completed optimality
proof. Keep every request and any failure. Repeated per-root results and node
counts must be identical within each arm, including under reversed input order.

Run five alternating ABBA/BAAB cohorts, twenty batches and ten per arm.
Cases reverse on odd cohorts. Both arms use the same one-core affinity, limits,
file-cache warming, fresh-process initialization and warmup. Repetitions are
timing trials on eight roots, not 20,480 independent cube inputs.

Require every measured native CPU window to span at least one second. Every
same-arm duplicate CPU pair must differ by at most five percent. A native-CPU
numeric signal also requires a median control/candidate ratio of at least 1.10
and a ratio above one in every cohort. Short windows and noisy pairs are
inconclusive, not retried unchanged for luck. Preserve medians, ranges, all five
cohort ratios and each duplicate. Host-wall duplicates and a matching ten-percent
host-wall gate are reported separately. Driver CPU can expose IPC/host limits.

Even a passing numeric CPU gate still requires inspection of the actual profile
and source before interpreting the limiter. It does not satisfy the program's
general speed, first-answer p95, deadline-quality, application or proof gates.
Keep `performanceAcceptance:false` and production promotion closed.

## Separate profiles and resource admission

The original preparation builds non-scored `-O3 -g -pg` diagnostic executables
from the exact accepted C using pinned Nix tooling. Recovery reuses those
unchanged executables and compiler records. Profile both arms on the same
per-request cases and target, using 128 repetitions rather than the scored 512.
Require the same per-root semantic digest as the release runs. Preserve compiler commands, hashes,
raw gmon files and full line-level gprof output. Profiles include initialization
and instrumentation; their absolute timings and shares are not release timings.

The profile driver deliberately closes its owned FIFO writer to let the native
program exit zero and flush gmon. Engine reports an unscheduled exit in this
diagnostic-only path; retain that expected message explicitly. It is not GUI
lifecycle acceptance. Scored owners use ordinary Engine close and normal SIGTERM.
Either internal or outer SIGKILL, leaked owner or retained IPC fails the run.

The preserved recovery batch `u02-forward-cost-v2` requests at most 3 GiB. Reuse
preparation has sixty seconds under 512 MiB, and sizing has one hundred seconds.
Profiling has four minutes; scored work has fifteen minutes on CPU2.
Confirmation has sixty seconds under 512 MiB. The whole queue cap is 27 minutes.
Keep nice 10, desktop reserve, no swap, memory-pressure guards and the artifact
lease. A scored child has forty seconds; a diagnostic profile has ninety.
No native build overlaps a scored batch or browser preview.

No new Bend/foreign code, table, application change, inverse-mask treatment,
competitor setup, final holdout, publication or independent review occurs.
Read detached receipts and the canonical checker before tracked edits.

## Preserved diagnostic failure and recovery admission

The [failed v1 archive](u02-forward-cost-v1-failed/index.json) verifies all 4,107
seals and both resource receipts before edits. Calibration and profile builds
pass, but the first instrumented sample times out at ninety seconds with 4,000
of 4,096 entries retained. The native exits by SIGTERM and the detached worker
is gone. No scored measurement starts, and the failed run gets no speed verdict.
The original omitted IPC path remains a historical recording limit, not a
fabricated direct recheck. See [the issue](../../../issues/forward-cost-profile-window.md).

The calibration's live-worker process counter is 5,990 ms versus 5,993.577 ms
from independent process CPU accounting. After worker exit it is 5,990 ms versus
5,998.565 ms, within the fixed forty-millisecond allowance. These are Node
checksum-work calibration numbers, not solver CPU. Recovery checks the complete
unchanged calibration import closure and reuses the actual passed data.

The corrected typed input format v2 separates measured, diagnostic and sizing
workloads. The regression preserves its failing-before source and diagnostic
`512 !== 128`, then passes the 128-repeat profile with 512-repeat scoring intact.
Profiles contain 1,024 requests each. Scored batches still contain 4,096 each.
No old output or binary is overwritten, and new samples record their actual IPC
directory for direct cleanup validation.

Before profiling and scoring, two non-scored release sizing probes each run
64 repetitions, or 512 requests. Freeze the projection rule before running them.
Scale each observed warm interval by eight. Require projected native CPU of at
least 1,500 ms on both arms and projected warm host wall plus observed readiness
of at most 30,000 ms on both arms. This is conservative workload admission,
not a speed estimate, ratio comparison, algorithm selection or measured gain.
It does not change the actual one-second or five-percent scoring gates.

If the sizing gate fails, still retain the diagnostic profiles and all sizing
data, but write an explicit unmeasured/inconclusive disposition instead of
launching scored work. A passing execution receipt with that disposition is
not a passed benchmark or a completed roadmap. Do not adapt the scored count
after seeing timing ratios. Any later sizing change needs a distinct fixed plan.

## Verified recovery and diagnostic review

The [v2 archive](u02-forward-cost-v2/index.json) verifies 4,169 seals and five
receipts, with no resource stop and the detached worker gone. All four sizing
and diagnostic owners pass direct PID/start and IPC-path absence checks. Both
profiles complete all 1,024 requests with the expected per-arm semantic digest.
The diagnostic timeout and missing-path recording defect are resolved. The
failed v1's historical missing path stays a limitation.

The two release sizing samples each contain 512 completed requests. Their native
CPU is 10,300 and 7,800 ms. Host warm wall is 11,421.151 and 8,473.362 ms, while
driver CPU is 193.299 and 179.396 ms. These are single unscored planning probes,
not repeated comparison results. Scaling to the old 4,096-request workload
projects 93,300.322 ms for the larger host interval plus readiness. That exceeds
the frozen 30,000-ms admission limit. Scored samples and measured requests are
both zero. A passed queue does not turn this into a passed benchmark.

`bench/forward-cost-profile-review.mjs` reads all 641 control and 550 candidate
flat-profile entries. The generated C maps `spin_16` to packed nibble decoding
and the top command locations to table indices and block reads. The instrumented
whole-process self-time shares for `spin_16` are 28.12% and 42.70%. Block access
shares are 25.30% and 13.15%. Initialization and instrumentation are included.
These symbol associations identify the main sampled native work, not hardware
memory stalls or a release-build speed ratio. The full profiles, source hashes,
top source excerpts and raw gmon bytes remain evidence. The profile parser has
six malformed-input controls. The main agent inspected the hot source excerpts.
This is solo review, not an independent verdict.

## Distinct scored plan after admission

V3 freezes 128 repetitions before any scored work. Reuse the exact v2 sizing
samples and complete diagnostic profiles by their canonical archive identities.
Do not rebuild or rerun unchanged native diagnostics. The factor-two projection
has a 15,600-ms minimum native CPU interval and 24,773.417-ms maximum host warm
interval plus readiness. Both meet the existing admission bounds. Projection
is still not measurement or a speed claim.

The new fixed-count summary accepts exactly 1,024 completed requests per row.
Its eleven synthetic controls retain rejection of missing rows, errors in work
counts, answers, cleanup, ordering, semantic identity and counter units. The
old CPU parser, event contract, calibration and 23 controls remain unchanged.
Their complete twelve-file calibration closure is checked for exact reuse.
An isolated count-specific summary avoids changing that accepted closure.

V3 runs twenty fresh owners in five ABBA/BAAB cohorts, ten per arm. All 20,480
scored requests remain threshold-fourteen exclusions on eight distinct roots.
The forty-second sample deadline, one-second actual native CPU floor, every-pair
five-percent noise limit and ten-percent median numerical gate stay fixed.
Profiles and sizing are excluded from these samples. Separate diagnostic source
review does not replace post-measurement scope and uncertainty review.

The fixed queue has three serial jobs. Preparation and confirmation each use
512 MiB and sixty seconds. Scoring uses 3 GiB, CPU2 and at most fifteen minutes.
The whole queue is capped at twenty minutes, with nice 10, no swap, desktop
reserve, aggregate memory checks and the artifact lease unchanged. The planning
estimate is eight minutes. Any timeout, invalid output or forced owner exit
remains a failure, never a faster result. No holdout or competitor is opened.
