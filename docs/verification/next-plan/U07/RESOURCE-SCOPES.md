# Resource measurement scopes

The [common-clock result](u07-clock-adapters-v1/index.json) verifies 8,819 seals
and three receipts, worker gone and no resource stop. All 70 known-case requests
and analyses pass. Its adapter sources stay unchanged during this unit.
The October 24 completion/report/no-push order remains binding. The full roadmap
and numerical report are incomplete. No untouched evaluation case runs here.

## Read-only kernel counters

The kernel's [`cpu.stat` interface](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html#cpu-interface-files)
counts all processes and threads in a cgroup and descendant cgroups in
microseconds. Before/after differences include the benchmark driver, sandbox
launchers and exited workers. They are not search-kernel-only CPU. Separate
readiness, request and shutdown intervals expose initialization cost. Very short
windows remain descriptive, without a resolution or noise-based speed claim.

The kernel's [`memory.peak` interface](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html#memory-interface-files)
reports charged cgroup lifetime peak. Charges include anonymous, file and kernel
memory. This is neither unique physical resident memory nor a difference between
window endpoints. Shared page-cache ownership can affect charges. No reset,
reclaim, cgroup migration, permission change or global setting is used.

Each final timed actor cohort gets one fresh bounded resource job. Its memory
peak cannot inherit another solver's earlier allocation. The calibration also
uses nine distinct resource jobs. Its peak includes driver preparation and
hashing, so these raw calibration peaks are not a solver-memory ranking. The
final measured runner must consume pre-frozen actor configuration without
rehashing unrelated large profiles inside the measured scope.

## Resident and proportional memory

[`VmRSS` and `VmHWM`](https://man7.org/linux/man-pages/man5/proc_pid_status.5.html)
are process resident-memory counters. Summing process RSS can double-count shared
pages, including tables inherited by a native request fork. The sampler records
every observed process-start identity and checks cgroup membership. A requested
50-millisecond interval is not a guarantee; actual gaps and missed short-lived
processes remain explicit. Missing or exited-root data stays null, not zero.

[`Pss`](https://man7.org/linux/man-pages/man5/proc_pid_smaps.5.html) apportions
shared pages among processes. The reader uses idle `smaps_rollup` snapshots at
readiness and completion, outside search timing. Missing permission or process
exit remains unavailable. A complete snapshot is not a physical-memory peak.
No sampling technique here claims to observe every transient process.

Native `wait4` request CPU and maximum one-child RSS remain separate fields.
They exclude retained-parent initialization and control. They are not substituted
for the whole-cgroup CPU or aggregate memory measurements.

## Executable calibration

Twelve malformed-snapshot controls and eight regressing-window controls pass.
They reject missing or duplicate counters, changed scope/limits, negative values,
CPU regression and an incorrect window-scoped interpretation of lifetime peak.
Missing peak support remains unavailable. An actual kernel counter named
`core_sched.force_idle_usec` initially reveals an over-restrictive name parser.
The literal dotted-name control and live recovery now pass. The failed resource
receipt is preserved rather than relabelled as success.

The actual allocation/CPU fixture has two observed processes in the same limited
cgroup. It checks real resident allocations and proportional snapshots, then
waits for both descendants to exit. Whole-scope CPU includes their completed
work and exceeds the waiting driver's own CPU. All observed owners are gone.
The local recovery passes under 512 MiB, CPU2, nice 10 and zero swap.

The instrumented delivered Rubend check passes six requests locally, including
exact mode, a prior-pilot short deadline and known recovery. All returned
candidates independently replay after the measured windows. This verifies
accounting integration, not relative performance.

`u07-resource-scope-v1` has twelve serial jobs. Parser controls and the real
fixture each have 512 MiB and 60 seconds. Nine actor configurations each get a
fresh four-GiB, 90-second job on CPU2. Confirmation has one GiB and 60 seconds.
All jobs are nice 10 with desktop reserve and no swap. The queue cap is twenty
minutes. The expected workload is 49 already-known calibration requests, with
four Rubend exact-mode rows. No new table is built.

Confirmation recomputes CPU windows and all independent candidate analyses,
checks nine distinct actor scope identities and verifies normal cleanup. Pure
clock controls and the 70 source-identical clock requests are reused, not
repeated. The original 23 laws and stronger-proof limitations are unchanged.

The fixed queue is pending. Final measured-record admission, complete protocol,
configuration freeze, one untouched quality pass, five alternating repeated
timing cohorts and the numerical report remain open. No push, merge,
publication, release, deployment or independent review is claimed.
