# Single-owned native control reader

Status is verified core behavior and complete application regression. Matched
cancellation meets its finite-run target. Deadline promotion remains rejected;
optional-profile rollout and hidden browser checks remain open. Work is solo.
Independent review is not run.

## Ownership and runtime boundary

Control.Context now owns one File and the partial decimal value and digit count.
The current job ID is separate. Every control checkpoint and job returns that
same owner. Pure search and portfolio source are unchanged. There is no channel,
background reader task, or zero-delay sleep.

The new runtime-only effects open nonblocking and read at most sixty-four bytes.
They return the File on both read success and failure. Empty readiness differs
from EOF. Read interruption and EAGAIN are retryable. Other descriptor errors
fail the job. Effects stay outside PROOF.bend. The final startup boundary also
rejects regular files and closes rejected descriptors. That guard is included
in the final v5 build and complete regression.

## Verified foundation

The old runtime fails the new array-mode gate with observed one against expected
zero. The File-owner runtime emits BLK_SHR zero. Its child-admission function is
byte-identical to the contemporary reference, with zero extra location arguments
and sixty-two seal sites. This establishes the intended compiler change, not a
speed result. The [red gate](r06-owned-control-v1/mode-red.json.gz) and
[final C inspection](r06-owned-control-v1/inspection-v5.json.gz) preserve the
actual observed compiler flags and function hashes.

The final IO boundary passes twenty-one native and JavaScript fault cases, including
empty FIFO reads, bounded chunks, blocking-handle rejection, EOF, path limits,
descriptor failure, read failure, interruption, and injected oversized reads.
The native fault wrapper covers both read and fortified __read_chk, without
disabling the bound check. The JavaScript tests execute the effect twins with
real FIFO reads and Linux fdinfo flags. A separate compiled-JavaScript run also
passes real FFI integration under the already available Bun 1.4.2. It covers
empty reads, chunks, blocking handles, invalid paths, regular-file rejection,
and EOF. The [combined receipt](r06-owned-control-v1/bun-and-native-io-v5.json.gz)
separates those actual Bun cases from VM fault injection. Bun is not added as a
package or development dependency.

Native and generated-JavaScript scanners pass the retained U32 boundary cases,
six malformed-record cases, and 1,991 independent fragmented-state comparisons.
Actual raw-table cancellation retains the PID and one nonblocking control
descriptor without descriptor growth across jobs. Stale and fragmented control
passes. Five real native malformed/EOF cases settle the active job as an error,
never completion, and remove the process and IPC.

All sixteen toolchain gates pass, including the unchanged twenty-three-law
BendTT verdict. The frozen current binary is build/experiments/r06-raw-v5,
with [final metadata](r06-owned-control-v1/metadata-v5.json.gz). All seventeen
common core dependencies match the contemporary reference. The earlier v4
artifact is preserved and excludes only the later FIFO-kind startup guard.

The [complete regression](r06-owned-control-v1/regression-v5.json.gz) passes
`just test` and final `just check` with no resource stop. It includes the actual
default application build, native and HTTP integration, all existing model,
table, profile, codec, optimum, export, lifecycle, and benchmark-fixture checks.
The [source manifest](r06-owned-control-v1/application-build-v5.json.gz) and
[toolchain receipt](r06-owned-control-v1/toolchain-v5.json.gz) bind the checked
source. build/rubend now contains this final source. No law statement is changed.

## Performance gate remains open

The first five matched cohorts pass all 1,750 jobs, with sixty answer-length and
lower-bound ties. Superflip first-answer medians are 2,171 and 2,092 ms, with
overlapping ranges. Fast first-answer p95 is fifteen against eighteen ms, and
exact is twenty-nine against thirty-eight ms. These fail the five-percent
latency floor. The [raw trial](r06-owned-control-v1/quality-v4.json.gz) retains
every job and seal. No throughput or default promotion is claimed.

The [five same-binary A/A cohorts](r06-owned-control-v1/aa-v4.json.gz) also pass
1,750 jobs. Identical binaries produce fast first-answer p95 values of thirteen
and sixteen ms, beyond the five-percent control-noise limit. They also produce
one Superflip lower-bound difference. The current short-case wall-time test
cannot support a five-percent latency conclusion. Keep that gate inconclusive,
not passed. No favorable rerun replaces the earlier observations.

The [final-source confirmation](r06-owned-control-v1/quality-v5.json.gz) passes
all 1,750 jobs and sixty answer lengths. Fast first-answer p95 ties at twelve ms,
exact ties at twenty-eight ms, and Superflip is 1,669 against 1,751 ms. However,
one Superflip lower-bound pair loses, including native terminal bounds fifteen
against sixteen. The unchanged quality floor rejects promotion. A/A noise does
not erase that result or establish a performance win.

The [final matched cancellation run](r06-owned-control-v1/lifecycle-v5.json.gz)
passes all thirty cancellations and solved recoveries over five alternating
cohorts on CPU 2, nice 10, with the same cache and a 6,144-MiB cap. Cooperative
cancel-to-usable median is 14.09 ms, range 1.19 to 16.03 ms, and nearest-rank p95
16.03 ms. Restart median is 1,925.91 ms, range 1,909.83 to 1,944.84 ms, and p95
1,944.84 ms. All fifteen cooperative owners persist, with five initializations
instead of twenty. Every recovery solves the zero-move case, all processes and
IPC are removed, no input seal changes, and no resource stop occurs. Startup
is recorded separately and is not claimed faster.

A later [host-only correction](../issues/progress-bound-throttle.md) ensures that
stronger lower-bound events bypass counter-only throttling. Its red/green
checks and rebuilt application pass. It does not change the frozen v5 native
binary or retroactively clear the measured lower-bound loss. Future measurements
must retain the new adapter's source identity.

The data shape and rejected alternatives are in
docs/architecture/R06-LIFECYCLE-DESIGN.md. The compiler diagnosis and preserved
earlier failures are in docs/research/CONTROL-ARRAY-MODE.md and
docs/verification/R06-LIFECYCLE.md.
