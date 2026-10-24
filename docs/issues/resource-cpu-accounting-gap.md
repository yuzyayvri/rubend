# Resource receipts do not measure CPU time

The four-edge pilot's frozen scope said that generation/audit CPU, wall and RSS
would be retained. Actual `bench/run-limited.mjs` receipts contain elapsed wall
time, sampled peak process-tree RSS, CPU affinity and a CPU rlimit. They contain
no measured consumed-CPU counter. A CPU limit is not CPU usage.

The [four-edge archive](../verification/next-plan/U03/u03-four-edge-v1/index.json)
preserves the raw scope and receipts. The result report corrects that wording.
Neither the 5,990-ms generation job nor the 24,575-ms audit job has a measured
CPU-time value. The processes have exited. Do not infer CPU time from wall time
or rewrite their records as if the counter existed. No comparative speed or
CPU claim was accepted from this planning run.

The earlier native A/A diagnostic already uses a separately identified GNU Time
observer. A small opt-in whole-command observer can reuse that method for later
benchmark commands without changing the general resource runner. It must keep
command CPU, waited-child CPU, observer work, wall time and peak-RSS semantics
explicit, preserve nonzero exits and validate the metric against actual work.
The [opt-in observer guard](../verification/next-plan/U00/CPU-OBSERVER.md) now
passes direct, waited-child and failed-command calibration, eight malformed
records and output-collision checks. Later bounded commands can opt in to that
observer. The general resource runner is unchanged. Historical CPU values
remain unavailable, and no old planning or timing result is reclassified.
