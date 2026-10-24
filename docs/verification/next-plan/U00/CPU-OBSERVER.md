# Record whole-command CPU without changing the resource runner

General resource receipts have wall time and sampled aggregate RSS, but no
consumed-CPU counter. The final comparison needs actual CPU time. The opt-in
`measureCpu(command, outputPath)` uses the existing GNU Time approach from the
native A/A diagnostic. No global resource-runner or Nix/system change is needed.

Each measurement preserves the executable hash, observer executable/version/hash,
literal arguments, raw usage bytes and their hash, stdout, stderr and exit status.
User and system CPU have GNU Time's ten-millisecond field resolution. Their sum
is whole-command CPU, including descendants accumulated through waited-for exits.
It excludes this Node observer's work and does not measure an inner search phase
or a warm request inside a persistent process. Unwaited detached work is outside
that contract. CPU can exceed wall time when multiple cores run.

GNU Time's maximum RSS is not the sum of concurrently live workers. Aggregate
RSS remains the unchanged outer resource runner's separately sampled metric.
Missing or malformed CPU records produce an unavailable measurement, not zero.
A nonzero command exit remains nonzero even when its CPU observation is valid.
The output file must be fresh before the command can start.

This observer has no independent timeout or cancellation protocol and creates
no detached process group. Use it only inside an approved bounded local queue
or an existing lifecycle owner. The outer resource controls still apply.
Native solver lifecycle ownership is not replaced by this utility.

## Fixed guard

The test burns a CPU-time budget and compares the observer against Node's
independent `process.cpuUsage` counters. A nested case includes a waited-for
child's CPU plus its parent's work. Another command exits seven after doing
work. Stdout, stderr and status must survive unchanged. Eight malformed records
must reject, and an existing output must prevent execution. One-core checks
allow thirty milliseconds for field quantization and counter endpoints.
No throughput or speed conclusion follows from these calibration fixtures.

The `u00-cpu-observer-v1` queue is expected within one minute, capped at two.
It uses 512 MiB for calibration and 256 MiB for confirmation on low-priority CPU2,
with the full desktop reserve. The observer binary is identified before freeze
and after each command. Existing root inputs and the general resource runner
must remain byte-identical. No solver, holdout, new proof or publishing runs.
Old missing CPU counters remain unavailable and are not retroactively filled.

## Result

The [archive](u00-cpu-observer-v1/index.json) verifies 2,821 source seals and
both resource receipts. The worker is gone, with no resource stop. All three
commands preserve their stdout, stderr and exit codes. The failed command
remains exit seven despite having a valid CPU observation.

The direct fixture records 270 ms CPU versus 274.615 ms from Node. The nested
fixture records 450 ms versus 177.512 ms parent CPU plus 274.752 ms waited-child
CPU. The failed fixture records 120 ms versus 124.540 ms from Node. All agree
within the declared thirty-millisecond allowance. These numbers calibrate the
observer only. They are not solver speed or latency measurements.

Eight malformed records reject. A preexisting output prevents the command
from running and remains unchanged. The observer executable/version/hash and
raw usage hashes agree after every call. The generic resource runner remains
byte-identical, and the unchanged 87-input root gate is explicitly reused.
No old receipt is rewritten or assigned a CPU value it never measured.
