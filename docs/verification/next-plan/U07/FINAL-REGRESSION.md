# Final-source regression before evaluation

The U02 forward candidate now has an inconclusive measured disposition. It is
not selected for production. U07 still needs the full final-source regression,
actual delivered Nix artifact, hidden live checks, additional competitors,
configuration freeze, untouched evaluation and numerical report. No overall
completion, speedup or formal optimized proof is claimed.

The October 24 order remains in force. Finish roadmap verification, then obtain
additional 3x3 solvers from primary upstream sources, freeze every configuration,
run the coordinated U07 comparison once and deliver its numbers. Never push or
merge before Yuzy reviews that report and grants separate later approval.

## Isolated regression contract

The existing `just test` has 97 top-level commands and invokes the actual build.
It writes generated modules, native workers, fixtures, caches and receipts under
`build`. `just check` also writes `build/setup-check.json`. Reusing the original
output tree would overwrite earlier sealed evidence. A local committed-source
fixture checkout gives the test its own files and artifact lease.

`bench/regression-snapshot.mjs` verifies the expected HEAD and clean tracked
inputs, creates a detached local clone and checks every tracked copied byte.
Only immutable Git objects are shared. Installed dependencies are copied,
including their internal relative links, and every file digest is checked.
Dependency links escaping that copied tree fail before copying. Original builds
and caches are not copied or used as test-write targets. Existing destinations
are refused. No new branch, task or commit is created by the fixture.

The helper's unit test rejects five invalid targets, existing destinations and
an escaping dependency link. Mutating the copied module leaves the source
module unchanged. A synthetic copy test is not the actual Git snapshot result.
The first background job must verify that real checkout separately.

The normal suite keeps its corpus integrity checks. They check identity, count
and disjointness, including release hashes. No release solver case is evaluated,
scored, inspected for configuration selection or printed. Do not turn the
existing integrity check into a comparative evaluation before freezing configs.

## Fixed queue and evidence

`u07-regression-v1` has four serial jobs. Snapshot preparation uses 512 MiB and
sixty seconds on CPU2. The complete unchanged `just test` uses 4 GiB and twenty
minutes on CPU2, CPU3, CPU4 and CPU5. Fresh `just check` uses 3 GiB and three
minutes on those lanes. Confirmation uses 512 MiB and sixty seconds on CPU2.
The whole queue cap is twenty-seven minutes. The estimate is ten minutes.
Keep nice 10, no swap, desktop reserve and aggregate-memory backstops.

The pinned existing `nix develop` environment is used offline. No Nix package
build, dependency installation, toolchain update or system change is requested.
All build and test descendants stay under the normal resource runner. Each
command retains its actual arguments, output, exit status and error before a
failure stops the queue. Passing work is not inferred from an empty log.

Confirmation checks the built manifest against the actual application graph,
native/C/web artifact hashes, every copied source and dependency, original seals,
root checker records and absence of processes whose cwd is under the snapshot.
The native and HTTP tests retain their own cancellation, replay and IPC checks.
This process observation does not claim a universal proof of no possible leak.

Preserve fresh core, exact, engine, HTTP, build and root-proof evidence. Both
root checkers, the existing 23 laws and rejecting fixtures run freshly. Approved
additional proof components and completed table audits remain source-bound
reuse, not new executions or completed optimized proofs.

Passing this queue is not installed Nix delivery, real-browser acceptance,
additional-solver setup, the final comparative benchmark or a speed verdict.
Those remaining U07 gates stay open. Work is solo, with independent review not
run. The existing automation continues until the full report is delivered.
