# Rubend working instructions

Work from first principles. Identify objectives, constraints, and evidence.
Test material assumptions and solve root causes.

The repository is persistent memory. Save research, decisions, and test evidence
here and reference durable paths across sessions. Encode invariants in types,
structure, and executable checks. No code comments except required notices and
tool directives.

Write agent-first code. Optimize for reliable agent work and measured
performance. DRY and human readability are not constraints.

Preserve user changes, secrets, and sealed artifacts. Publication, deployment,
merges, destructive actions, and costly runs need task authorization. Work
independently on reversible in-scope steps. Verify outcomes proportionately and
never invent success.

## Current boundary

Yuzy resumed autonomous implementation on 2026-10-16 after replenishing usage
limits. Read `docs/CURRENT.md` before doing further work. All browser previews
must stay hidden; do not obstruct the user's screen.

Yuzy authorized autonomous end-to-end implementation on 2026-10-16 after
reviewing the plan. Implement and verify the solver and local GUI. The license
is GPL-3.0-or-later. Publication, deployment, system changes, and costly runs
remain separately gated. The approved proof-plan obligations may now be added;
do not weaken established laws to make changes pass.

Read `docs/PLAN.md`, `docs/research/FINDINGS.md`, and
`docs/verification/SETUP.md` before continuing. Treat targets as unmeasured until
there is a reproducible result. Core move and replay-certificate laws are
checked; full search completeness and optimality are not formally certified.

## Bend

Run `bend guide` before writing Bend. Read `bend guide shaders` before graphical
or parallel Bend work, and `bend guide effects` before foreign effects. Bend 1
and HVM instructions are not applicable to Bend 2.

Use `nix develop` for the pinned toolchain. Run `just check` after changes and
`bend PROOF.bend --verdict` before committing Bend changes. Do not use unsafe
definitions or foreign code in the pure proof dependency graph. Keep runtime IO
separate. Never weaken a law just to make a proof pass; approved domain laws
require explicit user approval to change. Add proposed domain laws to
`docs/architecture/PROOF-PLAN.md` for approval first.

Keep the search, cube rules, table generation, and replay checks in Bend. Do not
replace the engine with a foreign solver. External solvers are reference oracles
and benchmark competitors. Record upstream revisions, licenses, modifications,
and required notices for reused code.

## Evidence and resources

Small, bounded local tests are normal implementation work. Large table builds,
long searches, external compute, installation of GPU stacks, system changes, and
new services need authorization. Do not disable security mitigations for a speed
comparison. Benchmark solution quality, latency, memory, and initialization
separately on the same cases and resource limits.

On 2026-10-17 Yuzy approved local experiment batches capped at 8 GiB RAM including
scratch, two low-priority CPU cores, and 30 minutes each. Enforce these ceilings
and check headroom. This does not authorize cloud work, GPU installation,
publication, deployment, or visible windows.

Keep generated binaries, dependency trees, and pruning tables out of Git. Commit
small deterministic fixtures and raw benchmark records with provenance. Do not
store credentials or personal machine inventories.
