# Approved whole-engine execution

Standing orders from the approved plan. Run docs/architecture/OPTIMIZATION-ROADMAP.md
in dependency order R01, R02/R03, R04, with R05/R06 independent after R01. Complete
each unit's unit, live, and perf evidence before acceptance. The user now
authorizes pushing verified work when done, not PRs, merges, releases, deployment,
or system changes. Done means an independently reviewed Pareto report, verified
app integration, and honest proof coverage, not an assumed world-class victory.

- [x] State the exit condition as a checkable predicate before the first iteration.
- [x] Pick the wake mechanism. Active bounded checks and agent completion events.
  - skip: No recurring or deferred monitoring request. Do not create a heartbeat.
- [ ] Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that did not help.
- [ ] Mid-run discoveries are yours. Address related failures and return to the predicate.
- [ ] Checkpoint every iteration via show-me-your-work.
- [ ] Stop when the predicate is met. Do not relax the predicate to declare victory.

## Architecture for R01

- [x] Ground.
  - [x] Read live source/state and approved architecture findings.
  - [x] Frame the data shape. Explicit search goal/profile/completion and diagnostic counters, preserving existing traversal and protocol.
- [ ] Sketch.
  - [x] Dispatch independent Sol candidate.
  - [x] Attempt Luna candidate.
  - skip: Host rejected the second dispatch for thread capacity. No further spawns.
  - [ ] Produce a labeled sequential alternative and compare the sketches.
  - skip: The user explicitly prohibited all further subagents. Work and review are solo. Do not claim an independent verdict.
- [ ] Agree.
  - skip: Approved autonomous work needs no design checkpoint for reversible steps.
- [ ] Implement.
- [ ] Scrap.
  - skip: Conditional. Reopen architecture if repeated structural deviations appear.

## Units

- [x] R01a. Frozen corpus and coverage-first scoring contracts. Six positive families, twenty rejecting fixtures, historical-data reproduction, and sixteen toolchain/proof checks pass. Solo verification only.
- [x] R01b implementation. Explicit goal/profile/completion and fixed-work semantic equality pass. Timed overhead and independent-review gates are not closed.
- [ ] R01c. Diagnostic attribution, sensitivity/control, and measured overhead.
- [ ] R02. Exact-bound pilots, independently measured.
- [ ] R03. Kernel and memory pilots, independently measured.
- [ ] R04. Modern symmetry-aware projection pilots, then admitted scaling.
- [ ] R05. Anytime and bounded scheduling pilots.
- [ ] R06. Lifecycle, GUI, proof coverage, packaging, and final integration.
- [ ] Push verified accepted commits to the existing repository without force.

Throughput checkpoint. Two design seats were planned, only one ran. The user then
required solo work. Root owns all implementation and checks from here. Any gate
that specifically requires independent review remains marked not run.
