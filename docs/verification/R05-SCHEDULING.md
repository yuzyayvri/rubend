# Scheduling pilot disposition

Neither serial scheduling pilot is promoted. Each passes all 1,750 native jobs
and ties all sixty deadline solution lengths, but loses one Superflip lower
bound and misses the five-percent first-answer latency floor. The default
portfolio remains unchanged. This does not rule out other scheduling policies.

The detached queue completes in 595.998 seconds without model polling. Its
build job passes fifteen native budget cases, three pure portfolio BendTT
verdicts, emitted-C unshared-array checks, retained-owner cancellation, and the
unchanged twenty-three-law toolchain gate. The two measured comparisons use
five alternating fresh cohorts each, CPU 2, nice 10, a 6-GiB memory cap, and
ten-minute job caps. No other build, profile, or preview runs alongside them.

| Treatment | Fast p95, reference → treatment | Exact p95 | Superflip p95 | Deadline lower-bound losses |
| --- | --- | --- | --- | --- |
| Short-first | 16 → 16 ms | 33 → 30 ms | 2,454 → 2,704 ms | 1 |
| Exact-reserve | 14 → 14 ms | 28 → 28 ms | 2,264 → 2,465 ms | 1 |

Each loss is also present in native terminal bounds, sixteen versus fifteen.
All other measured bounds tie. There are no errors, missing answers, source
seal failures, or forced worker cleanups. The independent facelet model checks
5,405 candidate events for short-first and 5,180 for exact-reserve. These counts
include repeated shallow warmups, not that many distinct scrambles.

Short-first uses smaller Improve slices before an incumbent. Exact-reserve
allocates more work to the exact task after the first answer. Task order,
restart coverage, pruning, and completion handling remain unchanged. Read
[the design](../architecture/R05-SCHEDULING-DESIGN.md).

The [archive](r05-scheduling-unattended-20261019-v1/index.json) binds plans,
source hashes, generated families, budget checks, resource receipts, every
job, independent replay counts, and scorecards. Native success is not policy
acceptance. Source layout and uncontrolled desktop activity limit cross-run
absolute timing comparisons; no precise causal speed attribution is claimed.
Independent review remains not run under the solo instruction. Other R05
ordering, premove, complementary projection, and partition work remains open.
