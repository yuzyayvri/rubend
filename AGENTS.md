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

On 2026-10-26 Yuzy asked to shorten completion time as much as possible after
the thirty-minute handoff gaps were explained. The existing heartbeat now
checks every minute. This changes scheduling only. Frozen benchmark sources,
configurations, slots, order, budgets and resource limits stay unchanged.
An active check reads the compact saved queue status and worker identity once,
then ends quietly without polling, edits or duplicate work. Completed queues
still require canonical verification before tracked edits and the next batch.
Keep handoff bookkeeping concise. No push or merge before report review.

On 2026-10-25 Yuzy replied "I literally approve anything man. Just fucking do
it." to the remaining roadmap approval request. The exact NP04–NP08 statements
and necessary local generation, builds and full audits for this roadmap are
approved. Do not ask again for these in-scope approvals. Resume the existing
`continue-rubend-roadmap` automation. Keep engineering admission, source seals,
checkpoints and every RESOURCE-POLICY.md limit, including thirty-minute batches,
desktop reserve, no swap and low priority. Stay solo and never use Astra.
This does not override the explicit later decision about pushing to main after
the numerical report. No push, merge, release, deployment, cloud/GPU work or
system change is authorized. Read docs/verification/next-plan/OCT25-AUTHORITY.md.

On 2026-10-24 Yuzy required roadmap completion, then a primary-source research
and local setup pass for additional 3x3 solvers, then controlled comparative
benchmarks and a numerical report. Coordinate U07 with that final pass so the
holdout is opened only after configurations are frozen and no final evaluation
is duplicated. Keep solution quality, coverage, time, CPU, memory, initialization,
timeouts and proof limits explicit. Preserve competitor revisions and licenses.
Only after the full roadmap and report are complete, delete the existing
`continue-rubend-roadmap` automation. Do not stop at implementation alone.
Yuzy will read the report and decide separately whether to approve a push to
main. This supersedes every earlier standing push authorization. No push,
merge, release or deployment is authorized now. Existing gates for unapproved
laws, large/costly builds, cloud/GPU work and system changes remain in force.

On 2026-10-23 Yuzy approved the exact NP01–NP03 statements in
`docs/architecture/NEXT-PROOF-STATEMENTS.md` and requested autonomous roadmap
execution with automatic messages to this same chat after detached runs.
This supersedes the older no-heartbeat/no-wakeup instruction for this task.
Use the existing Codex heartbeat `continue-rubend-roadmap`, not a custom
message-injection script or a second automation. Keep fixed detached batches,
source seals, resource admission, solo work, and the no-Astra restriction.
The original heartbeat checked every thirty minutes; the October 26 order
above shortens that interval. Do not duplicate active work or
spend model turns polling. Pause it if missing authority prevents all useful
in-scope progress. Delete it only after the full workflow and report above are
complete. NP04–NP08 and local generation were awaiting separate approval at
that time; the October 25 grant above supersedes that gate. The October 22 main push was a
completed specific request, not blanket publication authority for later units.

After a queue reports passed, run `node bench/check-background-results.mjs RUN-ID`
before editing sources. It checks revision, source seals, resource commands,
limits and receipts, verifies the worker is gone, and preserves compressed
records. A passed status alone is not that verification. If the queue is still
active, end the turn instead of polling or starting duplicate work.

On 2026-10-17 Yuzy approved `docs/architecture/OPTIMIZATION-ROADMAP.md`, requested
autonomous implementation, and authorized pushing verified changes when done.
This supersedes the older no-push boundary below. It does not authorize PR
creation, merges, releases, deployment, or system changes.
Yuzy subsequently required solo work. Do not spawn, resume, or delegate to any
subagent. Perform implementation and checks directly. Do not claim independent
review for solo work; record any resulting review gate as not run.

Yuzy's 2026-10-19 token-saving workflow is to prepare fixed test files and
bounded local queues, launch them detached, then end the chat turn with an
estimated time to ping again. Do not spend model turns polling long tests.
Do not create AI heartbeats or automatic model wakeups. On the next ping,
inspect the saved results before changing sources or launching another batch.
Use docs/verification/BACKGROUND-TESTS.md. This changes waiting behavior, not
the verification requirements, resource limits, or solo-work boundary.

Yuzy later authorized more local CPU and RAM after inspecting headroom. Use
docs/benchmarks/RESOURCE-POLICY.md instead of the older two-core/eight-GiB
allocation ceiling below. Keep desktop headroom, low priority, matched benchmark
resources, and the thirty-minute per-batch limit. No cloud or GPU installation.

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

Yuzy requires every published commit to have a GitHub-verified signature and a
single-line subject with no body. Use the existing registered SSH signing key,
repository-local signing configuration, and .githooks. Never pass a merge commit
description. Keep GitHub merge-message defaults blank. Validate new history with
scripts/commit-policy.mjs before pushing. Do not bypass these checks.

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

Yuzy requested frequent commits on 2026-10-17. Make focused local commits after
verified improvements and preserve the configured GitHub author identity.
This does not authorize pushes, releases, or deployment.

## Pstack routing and model limit

The user's 2026-10-17 routing update requires the installed pstack poteto-mode
workflow for nontrivial implementation, architecture, unknown-cause bugs, and
performance work. Read its full skill and Codex tool mapping. Use native
collaboration, isolated writer worktrees, and read-only independent reviewers.
Keep required review gates closed when a reviewer cannot run.

The latest user instruction prohibits Astra. Do not invoke gpt-6-astra.
Use gpt-6.1-sol for ordinary implementation and analysis. Use gpt-6-sol or
gpt-6-luna when an independent or model-diverse review is required. This overrides
earlier pstack configuration entries naming Astra. Keep delegation scoped.
Use fresh or bounded forks for any model override. Default effort is session.
