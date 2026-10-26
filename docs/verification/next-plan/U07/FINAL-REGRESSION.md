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

## Verified result

The [canonical archive](u07-regression-v1/index.json) verifies 8,068 source seals
and four resource receipts, with no resource stop and the detached worker gone.
The actual local fixture checkout contains 3,754 tracked files and 3,805 copied
dependency files. Every original and copied digest remains unchanged after work.

The complete unchanged 97-command `just test` passes freshly. The recorded core
checks include 10,000 independent transitions, 1,000 arbitrary legal states and
85,394 coordinate roundtrips. All 163 sampled native shallow optimum cases pass.
The engine checks all 34 requests and verifies every returned solution. Its
single cancellation observation is 11 ms, not a repeated latency or p95 claim.
The HTTP guards, solve and abort recovery pass. Normal suite failure, export,
keyboard, model, renderer, profile and owner/IPC checks also pass.

Fresh `just check` passes all sixteen gates, including both root proof entrypoints,
the original 23 laws and rejected false/open/unsafe fixtures. The regression job
takes 502,171 ms and peaks at 2,467,376 KiB sampled aggregate RSS. The proof job
takes 53,047 ms and peaks at 2,408,708 KiB. These are one-run resource observations,
not a build speed comparison or solver gain. The observed snapshot-cwd process
set is empty. Original builds, caches and dependencies remain sealed.

The [private-package preflight](PRIVATE-PACKAGE-PREFLIGHT.md) is next. The final
Nix artifact and installed/hidden live acceptance remain unverified. No final
solver holdout is evaluated, and no overall completion or push follows.
