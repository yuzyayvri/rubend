# Native CPU windows for future warm measurements

The calibrated GNU Time observer measures a whole command. It cannot separate
table initialization from a warm request inside one long-lived worker. This
benchmark-only effect supplies a process CPU timestamp for those future windows.
It does not yet instrument a solver or change production code.

The native effect uses `CLOCK_PROCESS_CPUTIME_ID`. The Linux API defines its
scope as CPU consumed by all threads of the current process, distinct from wall
time and the thread-only clock. See the
[primary Linux clock documentation](https://man7.org/linux/man-pages/man3/clock_gettime.3.html).
This is not the waited-child accounting contract of GNU Time.

`sample(0)` reads the counter. `sample(1)` reads reported resolution. Both return
`Result<error, seconds & nanoseconds>` using two U32 values. Syscall errors,
unsupported clocks, invalid operations and unrepresentable values fail closed.
Host differences use BigInt before serialization. Reported resolution is not a
precision or accuracy claim. The JavaScript backend explicitly returns ENOSYS
for supported operations and EINVAL for malformed operations. It never returns
wall time or zero as pretend CPU.

The effect follows the pinned Bend 2.0.37 effect ABI and lives only under bench.
It cannot enter the pure root proof import graph. No existing law, checker,
model, engine or timing adapter changes. The foreign C is a clock read, not
foreign search or cube logic. Rebuild and recalibrate it if the compiler changes.

Five alternating cohorts run CPU work, a 200-ms sleep and 100,000 native IO
clock reads. The fixed CPU recurrence performs 500 million steps and prints its
consumed checksum before the ending clock sample. The host derives that checksum
independently with affine exponentiation modulo 2^32. This ordering prevents a
lazy result from falling outside the measured window. CPU windows include their
checksum print and clock/accumulator work. The sampling-loop mean is not the
raw syscall cost. GNU Time checks whole-process CPU with a 30-ms quantization
allowance and a separate 100-ms startup/output allowance.

An actual CLOCK_MONOTONIC source variant must fail sleep/CPU accounting. An
invalid native clock ID must return failure without a CPU window. The actual
compiled JavaScript backend must report unavailable, and both backends must
reject an invalid operation. Model controls cover malformed pairs, backwards
time, missing CPU, incorrect work and wrong-clock data. All raw command records,
including expected failures, remain embedded in the final calibration artifact.

This is observer calibration, not a solver benchmark or speedup. Clock overhead
must remain explicit when it is later integrated into a measurement adapter.
No search, table build, competitor setup, release case, browser or publication.

The fixed batch is `u00-process-cpu-v1`, expected two minutes with a six-minute
cap. Compile uses at most 1.5 GiB and four low-priority lanes. Calibration uses
CPU2 under 1 GiB. The existing desktop reserve, no swap and priority remain.

## Verified calibration result

The [canonical archive](u00-process-cpu-v1/index.json) verifies 3,237 source seals
and three resource receipts. The worker is gone, and no resource stop occurred.
All fifteen fixture windows, twenty commands including expected failures, five
actual clock/backend controls and fourteen model controls pass. Five independent
work checksums equal 2,138,942,737. BigInt arithmetic retains a one-nanosecond
delta across the high-U32-second boundary.

Each row below contains five alternating-cohort observations.

| Calibration window | Minimum | Median | Maximum |
| --- | ---: | ---: | ---: |
| Consumed work CPU, ms | 54.977664 | 55.163670 | 55.684911 |
| 200-ms sleep CPU, ms | 0.091972 | 0.414907 | 0.639710 |
| Sampling-loop mean CPU, ns per iteration | 479.704780 | 482.108390 | 744.407650 |

All reported clock resolutions are one nanosecond. That does not establish
one-nanosecond accuracy. GNU Time whole-command CPU agrees within the frozen
quantization allowance. The actual wall-clock variant fails that comparison.
Invalid native clocks and unsupported compiled-JS operations produce errors,
not zero CPU. Raw counters, output, failures and source identities are archived.

The sampling loop includes IO, checksum accumulation and serialization. Its
spread does not support a constant overhead correction or a raw-syscall cost.
These calibration observations are not an end-to-end performance comparison.
The compile job peaks at 606,912 KiB aggregate tree RSS. Calibration peaks at
292,928 KiB including the host and measurement wrappers. Those figures are not
the native fixture's individual maximum RSS.

The unchanged 87-input root gate is explicitly reused from its archived passing
execution. No clock effect enters its import graph. Solver CPU instrumentation
is not integrated. Production code, existing timing adapters, table data and
the release holdout remain unchanged. Independent review is not run under the
solo restriction.
