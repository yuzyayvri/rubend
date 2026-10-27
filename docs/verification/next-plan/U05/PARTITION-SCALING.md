# One versus two native owners on the same bounded partition jobs

The existing native worker and two-owner coordinator pass correctness and
failure/retry checks. No scaling measurement exists yet. This experiment keeps
their native binary, cache, 1,124-job manifest and reference answers unchanged.
It measures fresh-process execution, including private table initialization.
The result is not a whole-solver or kernel-speed comparison.

## Measured work and timer boundaries

One owner processes all jobs on CPU2. Two owners process fixed odd/even shards
on CPU2 and CPU3. Every native process uses one thread and GPU off. Both modes
have the same five-GiB aggregate ceiling and two available lanes, with nice 10,
desktop reserve, no swap and memory-pressure stops. Two owners deliberately use
more of that admitted CPU and memory budget. The comparison measures scaling,
not an identical-core kernel optimization. No serial fallback counts as two
workers. If the concurrent allocation is not admitted, do not run it.

The primary wall interval starts before first-owner request preparation and
launch, and ends at the last observed native close. It includes launch work,
private cache load, initialization, execution and output transport. It excludes
subsequent semantic scoring. The calibrated GNU Time observer separately
measures the complete coordinator command and waited native children, including
scoring and serialization. CPU is not assigned to the narrower wall interval.
Maximum child RSS is not aggregate memory. Report it separately from diagnostic
aggregate direct-owner RSS and the resource receipt's full process-tree peak.

Do not time from the last readiness marker. There is no barrier, so the earlier
owner can already be working. Readiness-to-close is a diagnostic phase only,
not a fair warm-work timer. The actual Bend source prints readiness immediately
after `F.load(True{})` in `bench/partition-worker.bend`. This maps the startup
phase to private table loading and initialization rather than guessing from a
headline runtime. Cache files are source-hashed; filesystem cache temperature
is not controlled as cold disk. Every process and its owned table are fresh.

## Diagnostics before measured cohorts

Run one single-owner and one two-owner diagnostic. Record actual readiness,
close and affinity markers. Sample direct owned native children every 100 ms
for CPU ticks and aggregate RSS. These observations identify startup versus
post-ready work and memory cost. The sampled diagnostics are excluded from
every performance cohort and ratio. Sampling does not measure page-cache charge
or prove a memory maximum between samples.

Then execute five fixed cohorts. Even cohorts use single, double, double,
single order. Odd cohorts reverse that order. Each mode has two observations
per cohort, ten total. Do not tune cases, fuel, sharding or flags after seeing
results. All jobs, including both partial probes, must remain present.

Each result must match the source-bound per-job reference exactly. Derive one
ordered transcript, apply the existing ledger scorer and independently replay
all five returned candidate answers in every run. Missing, changed, errored,
timed-out or leaked-owner results stop the batch and remain failures. Never
drop them for a faster median. All native process groups remain inside the
outer resource scope and all actual owner identities must be gone.

## Frozen gates and limits

Report median and range, all five cohort ratios and duplicate-control noise
for each mode. Every duplicate pair must differ by at most 5% of its smaller
wall observation. Otherwise the comparison is inconclusive. A bounded-batch
benefit needs a median single-over-double ratio of at least 1.10 and all five
cohort ratios above one, with unchanged results and complete cleanup. This
does not promote a production profile or establish a whole-solver gain.

The Explain the Number principle keeps startup, native-owner wall, whole-command
CPU, sampled RSS and admitted memory in separate measurements. The typed row
model rejects missing/changed results, inconsistent owners, sub-100-ms windows,
bad order and CPU counts beyond the two-lane wall envelope. Ten bad-record
controls plus noise, tie and strict-count controls must pass.

Preparation has thirty seconds under 512 MiB. Diagnostics have ninety seconds
under five GiB, and twenty measured runs have a three-minute cap under five GiB.
Confirmation has sixty seconds under 1 GiB. The whole queue is capped at eight
minutes, below the thirty-minute policy. Preparation freezes actual admission
and tool identities. Raw records, requests, command counters, diagnostic samples,
per-run progress and final summaries are retained. No native rebuild, new oracle
search, database generation, cache, production lower bound, global optimality
claim, final holdout, peer setup, publishing or independent review occurs.

## Preparation failure and fixed recovery

The first batch, `u05-scaling-v1`, stops before model tests, diagnostics or
native launch. Its 512-MiB preparation scope suffers a confirmed kernel OOM
while the controller hashes the 1,108,546,560-byte cache as one buffer.
The [preserved failure](u05-scaling-v1-oom/index.json) verifies 3,802 seals,
revision, receipt and worker cleanup. Its actual journal and SIGKILL remain
unchanged. The monitor did not report an aggregate-RSS stop.

The [memory defect](../../../issues/partition-scaling-input-oom.md) is fixed by
one 256-KiB streaming hash buffer in the controller and background source-seal
verifier. All file bytes and descriptor/path identity remain checked. The same
cache-hash check fails with the old helper under 512 MiB and passes with the
new helper at 68,536 KiB process RSS. Byte boundaries, changed files, descriptor
cleanup and bad-large-seal rejection before queue creation also pass.

The recovered plan is `u05-scaling-v2`. It seals all old input paths plus the
failure archive, hash regressions and new helper. Preparation repeats the memory
and refusal checks under the unchanged 512-MiB ceiling. Workloads, table/binary,
timers, cohorts, gates and worker limits are unchanged. No native or measured
run is repeated because none began in v1. The complete comparison is pending.

## Verified comparison and disposition

The [recovery archive](u05-scaling-v2/index.json) verifies 3,825 source seals
and four receipts. The queue worker and every native owner are gone.
No resource stop occurred. The recovered preparation stays under its original
512-MiB ceiling, with 215,464 KiB aggregate tree peak. All hashing, source-refusal
and descriptor regressions pass. The original kernel-OOM record is preserved.

All twenty measured batches reproduce the same 22,480 partition results.
All one hundred measured candidate answers and ten diagnostic answers replay
independently. Partial probes remain partial. No binary, cache, oracle, job,
timer or acceptance threshold changes. The fixed source-identical workload
is not a final playing-strength corpus.

| Measurement | One native owner | Two native owners |
| --- | ---: | ---: |
| Makespan median, ten runs, ms | 2,082.704 | 2,219.649 |
| Makespan range, ms | 2,057.787 to 2,114.128 | 2,188.923 to 2,406.964 |
| Whole-command CPU median, ms | 2,275 | 4,545 |
| Whole-command CPU range, ms | 2,240 to 2,310 | 4,510 to 4,600 |
| Largest-child RSS range, KiB | 2,149,496 to 2,149,612 | 2,145,660 to 2,145,800 |
| Untimed diagnostic direct-owner RSS peak, KiB | 2,148,164 | 4,290,084 |

The five single-over-double cohort ratios are 0.8793, 0.9093, 0.9309, 0.9558
and 0.9474. One two-owner duplicate pair differs by 8.23%, above the frozen
5% noise floor. The formal verdict is inconclusive duplicate-control noise,
not an accepted scaling gain or quantified slowdown. No unchanged lucky rerun
is justified. Retain serial execution and keep the coordinator private.

The separate one-owner stage profile records 1,967.402 ms until observed ready
and 178.682 ms afterward. The two-owner initialization phases are 2,116.928 ms
and 2,052.244 ms. Private table initialization dominates this short workload.
These are two untimed diagnostics, not a measured warm-work or CPU breakdown.
The measurement resource scope peaks at 4,625,140 KiB aggregate tree RSS.
The largest-child and sampled direct-owner values above have different scopes.

The experiment establishes correct repeated finite execution and no accepted
process-cold benefit. It does not settle longer warm contours, full-solver
scaling, first-answer latency or complete optimized-search certification.
Continue application acceptance and the remaining roadmap checks. Keep the
final evaluation unopened until the selected configurations are frozen.
