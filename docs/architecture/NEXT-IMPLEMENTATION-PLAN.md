# Rubend next implementation plan

Approved by Yuzy on 2026-10-20. Execution starts with U00 under the boundaries below.
Improve fixed-budget answers and exact-search progress while finishing application acceptance.
Preserve the Bend engine, small-memory tier, existing laws, and sealed evidence.
Execute U00 through U07 as measured units, not one combined optimization rewrite.
Research gains are hypotheses. The original 10x to 100x target remains unachieved.

Execution status is recorded in
[the October 26 obligation/disposition matrix](../verification/next-plan/ROADMAP-RECONCILIATION.md).
The plan's original boxes are not blanket completion claims. The U02 native
inference disposition and U07 final research/comparison remain unfinished.
Measured rejected or inconclusive treatments are not successful optimizations.
The later approved heartbeat and NP04–NP08 authority supersede the original
no-wakeup and approval boundaries below, not resource limits or the no-push order.

## How to read this

One box is one unit of work and names the evidence that checks it. Check a box only when its evidence exists. The body is a how-to. Appendices record alternatives, hypotheses, and sources.

Use the installed plugin's `playbooks/feature.md`, `playbooks/bug-fix.md`, and `playbooks/perf-issue.md` per treatment. Use `playbooks/hillclimb.md` for a bounded optimization sequence, not repeated lucky reruns. The multi-phase planning skeleton is adapted to the user's overriding solo-work and detached-test instructions. Unit IDs are not GitHub PRs. Publication and merges require separate task authority.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

That template rule does not turn solo checks into independent review. The ten live lanes below are ten scenarios executed sequentially by the same agent. The phrase about the configured model is retained for the plan checker, not permission to delegate. Independent review remains explicitly not run unless the user changes the solo boundary.

## Program checklist

### Arm the program

- [x] Present this plan and stop. Start implementation only after explicit approval. Yuzy approved with "OK. Proceed. Approved."
- [ ] On approval, record standing orders naming this plan, the current base SHA, approved units, and unchanged resource, proof, signing, and publication boundaries. Save `build/evidence/next-plan/U00/orders.json`.
- [ ] Re-read the installed plugin's planning, architecture, verification, benchmark, and writing guidance as each unit requires. User instructions override prototype, subagent, and publication defaults.
- [ ] Do not arm an hourly audit or automatic wakeup. Prepare fixed scripts, launch bounded batches detached, return an ETA, and read receipts on the next user ping. Send a status message only for a material result or decision.
- [ ] Keep large data generation, expanded compute, law changes, deployment, and release authority separate. Approval of this plan is not an unlimited resource or publication grant.

### Spawn owners

- [ ] Do not spawn owners or reviewers. One solo writer owns the active unit. Record independent review as not run.
- [ ] Follow U00 -> U01 -> U02 -> U03 -> U04 -> U05 -> U06 -> U07. Proof obligations accompany each unit rather than waiting until U06.
- [ ] Treat subexperiments as separate commits and comparisons. Retain a known-good control before each treatment. Do not combine a bound, representation, cache, and scheduler into one attributed result.
- [ ] Throughput checkpoint. Gate on source/evidence reconciliation first. There is no agent fan-out. Serial builds hold the artifact lease; measured comparisons do not overlap builds or previews. Use four admitted development lanes at most, matched benchmark affinities, nice 10, and the current resource policy.

### PR mechanics

- [ ] Make focused, signed, subject-only local commits. Keep `.githooks` enabled. Do not rewrite the sealed baselines or repeat the historical signing migration.
- [ ] Run targeted checks, `nix develop --command just check`, and full regression at integration boundaries. Run `bend PROOF.bend --verdict` before Bend commits. Record source, binary, table, corpus, and toolchain identities.
- [ ] Do not open PRs, push, merge, tag, release, or deploy merely because a unit passes. Ask for missing publication authority only after preparing the checked result.

### Verdict and merge

- [ ] Separate implemented, functionally verified, performance-accepted, independently reviewed, and promoted states. A merged checkpoint does not imply all five.
- [ ] Keep the existing quality floor. No invalid answer, false optimum, lost answer coverage, or established deadline-bound regression. Count timeouts and fuel-censored jobs instead of dropping them.
- [ ] Require a repeatable gain of at least 10% for a general engine speed promotion and no greater than 5% first-answer p95 regression under a stable control. A strength treatment needs a predeclared paired improvement in answer length or completed optima, fresh confirmation, and the unchanged coverage/deadline-bound floor. Do not require or promise 10% shorter solutions. Smaller or stratum-specific wins need an explicitly labeled result, not a general default switch.
- [ ] Use at least five fresh alternating cohorts for decisions where the admitted workload permits. If same-binary A/A exceeds the noise floor, mark the comparison inconclusive and diagnose. Do not keep rerunning until a favorable sample appears.
- [ ] User review is required before merging interaction changes. No formal certification or independent review claim is permitted while its prerequisites remain open.

### Boot recipe

- [ ] After approval, build the recorded revision in an isolated checkout with `nix develop --command just build`; start `nix develop --command node apps/server.mjs` on loopback. Select experimental binaries and sealed caches explicitly.
- [ ] Use only a hidden browser through the available browser driver. Wait for real native readiness. Inspect `window.rubendDiagnostics()` and raw events; do not equate token receipt with readiness.
- [ ] Save each unit's screenshots, events, replay assertions, identities, timings, and cleanup under `build/evidence/next-plan/UNIT/`. Scenario screenshot names below are exact relative paths within that directory.
- [ ] For a native lane, also retain its CLI output and a hidden-app screenshot of the corresponding state. Screenshots illustrate behavior; raw output and replay determine the verdict.
- [ ] Use `bench/run-limited.mjs` and the artifact lease for local batches. Start with 4 GiB or the smallest sufficient ceiling, never above the admitted maximum. Respect the 30-minute cap, desktop reserve, no-swap limit, and emergency stop. Large builds need an explicit cost/admission decision before launch.

## Reconcile the current source and scorecard (U00)

**Depends on.** None.

**Files.**

- [ ] Update `docs/CURRENT.md`, the roadmap status, and a new `docs/verification/next-plan/U00/` evidence index. Touch measurement adapters only for a demonstrated defect.

**Build.**

- [ ] Map historical SHA references through `docs/verification/signing-history-v1/history.json.gz`. Preserve original evidence identities rather than rewriting old receipts.
- [ ] Freeze the current source as the new integration control. Keep the historical small, raw inverse, corner, and H0 controls separately. Record each capability and its acceptance status.
- [ ] Reuse the existing pilot/development sets and unopened release holdout. Add a small disjoint tuning set only if needed, before testing. Include uniform, half-turn, Superflip, near-symmetric, near-solved, and independently known-optimum cases. Do not tune on the final holdout.
- [ ] Separate native CPU, completed work, wall time, startup, process-tree memory, browser work, and cold/warm file-cache conditions. Diagnose the existing deadline-bound and A/A latency issues before accepting an optimized lifecycle policy.
- [ ] Draft exact additional theorem statements needed by U02 through U05. Obtain approval before adding new domain laws. Do not alter the existing 23 laws.

**You see.**

- [ ] `U00/status.json` identifies supported profiles, accepted and rejected treatments, open proof bridges, baseline hashes, and a reproducible A/A verdict.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Replay the existing scorecards and reject missing cases, false completion, wrong capabilities, and changed seals. Reconcile the latest successful CI receipts instead of rebuilding completed large tables.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo under the override above.

- [ ] Lane 1. Regression lane against trunk. Drive the same shallow solve at control and current head. Save `lane-1.png`. Pass when replay and status agree.
- [ ] Lane 2. Solve a known optimum. Save `lane-2.png`. Pass when its exported interval matches the oracle.
- [ ] Lane 3. Run a hard timeout. Save `lane-3.png`. Pass when the incumbent survives without a false optimal label.
- [ ] Lane 4. Select the small tier. Save `lane-4.png`. Pass when its declared profile and real process agree.
- [ ] Lane 5. Select each existing optional profile sequentially. Save `lane-5.png`. Pass when capabilities and cache identities agree.
- [ ] Lane 6. Submit invalid input. Save `lane-6.png`. Pass when it is rejected before search.
- [ ] Lane 7. Cancel and resubmit. Save `lane-7.png`. Pass when the old job cannot change the new result.
- [ ] Lane 8. Play and export an answer. Save `lane-8.png`. Pass when displayed and exported states replay.
- [ ] Lane 9. Exercise the no-answer score fixture. Save `lane-9.png`. Pass when missing coverage cannot improve the score.
- [ ] Lane 10. Inspect deliberately conflicting capability metadata. Save `lane-10.png`. Pass when the mismatch fails closed.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Coverage, deadline lengths/bounds, first-answer p95, completed-contour CPU, readiness, and native/process-tree RSS.
- [ ] Probe. Run sealed same-binary A/A and alternating control cohorts through the existing fixed-work, contour, and warm adapters; retain native terminal events.
- [ ] Baseline. Measure the current integration control first and record host noise and timer resolution. Do not pool old and new adapters.
- [ ] Rule. A control quality mismatch or more than 5% unexplained timing variation blocks a performance verdict. Classify and reproduce the observed cause before changing the floor.

**Review gate.** None. U00 is not review-gated because it changes no intended interaction.

**Merge.**

- [ ] Commit the reconciled evidence locally. Preserve every rejected result. Publication remains separately gated.

## Finish application and delivered-package acceptance (U01)

**Depends on.** U00.

**Files.**

- [ ] Add durable browser-driver scenarios under `tests/` and evidence under `docs/verification/next-plan/U01/`. Change `apps/web/`, `apps/engine.mjs`, `apps/server.mjs`, or `flake.nix` only for reproduced acceptance failures.

**Build.**

- [ ] Convert the existing hidden checks into one file-backed acceptance matrix covering all supported profiles, warm/cold readiness, native failure, worker failure, and cancellation during startup/search/cancellation.
- [ ] Extend the keyboard regression beyond DOM fixtures to real browser event scheduling. Cover Space after model failure, rewind failure, repeated seeks, export, and pending request cleanup.
- [ ] Verify renderer loss/restoration, 2D fallback, denied clipboard, download, narrow layout, reduced motion, and saved-state behavior under a recorded origin.
- [ ] Download the successful CI artifact, verify checksums, and test Nix import and launch in an isolated supported environment. Current sandboxed CI success does not prove this import/launch path.

**You see.**

- [ ] Every supported app/profile lane has a source-bound receipt, and the delivered package launches and solves through its installed entrypoint.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Add regressions for every reproduced defect and rerun native, HTTP, model-worker, playback, export, package, and proof checks. Do not call a fixture a real-browser result.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Solve and export the same input. Save `lane-1.png`. Pass when canonical results agree.
- [ ] Lane 2. Test delayed readiness and startup abort. Save `lane-2.png`. Pass when controls remain truthful and no abandoned solve starts later.
- [ ] Lane 3. Cancel, edit, and resubmit across each profile. Save `lane-3.png`. Pass when owners and late events remain isolated.
- [ ] Lane 4. Kill the native worker during a solve. Save `lane-4.png`. Pass when the session settles without leaked processes or IPC.
- [ ] Lane 5. Fail the model worker and press Space repeatedly. Save `lane-5.png`. Pass when timers and controls remain responsive and the solution stays exportable.
- [ ] Lane 6. Seek, rewind, pause, and export during native work. Save `lane-6.png`. Pass when committed states match replay.
- [ ] Lane 7. Lose and restore the renderer context. Save `lane-7.png`. Pass when fallback remains usable and recovery does not change the cube.
- [ ] Lane 8. Use narrow layout and reduced motion. Save `lane-8.png`. Pass when all essential controls remain usable.
- [ ] Lane 9. Deny clipboard, download a record, and reload saved state. Save `lane-9.png`. Pass when fallbacks and canonical data are correct.
- [ ] Lane 10. Import and launch the actual CI artifact. Save `lane-10.png`. Pass when installed native, HTTP, and replay checks pass without development paths.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Readiness, cancel-to-usable, request settlement, first answer, frame timing, memory, and owner/descriptor counts.
- [ ] Probe. Alternate baseline and repaired builds with identical resources and cases. Separate browser and native measurements.
- [ ] Baseline. Record U00's current behavior, including any reproduced failure, before changing it.
- [ ] Rule. No error loop, leaked owner, or stale state. Retain the existing 100 ms cancellation target for profiles already measured against it; new large-cache startup budgets must be declared before testing. Performance regressions above 5% need disposition, not a silent pass.

**Review gate.** The operator reviews any changed interaction before merge.

- [ ] Present screenshot receipts and a short video of each changed interaction to the operator. Wait for review before an authorized merge.

**Merge.**

- [ ] Commit verified fixes separately. Do not treat browser/package acceptance as a search-strength gain.

## Make existing bounds do more useful work (U02)

**Depends on.** U00 and U01. This is the first performance-priority unit.

**Files.**

- [ ] Limit changes to `src/search.bend`, `src/inverse-bound.bend`, necessary coordinate/generated profile modules, isolated benchmark entrypoints, and their tests. Propose theorem statements in the proof plan before adding laws.

**Build.**

- [ ] Personally recommended addition A. Derive last-move exclusions from the actual target subgroup of each existing joint estimate. Where valid tight estimates collectively exclude all possible final moves at residual depth r, test the implied extra exclusion without allocating a new PDB. Handle solved/zero cases and child-depth indexing explicitly.
- [ ] Do not apply an end-move inference directly as a next-move mask. Next-move pruning needs the corresponding inverse argument. Keep both rules private to FullCube until their exact target-group and preservation obligations pass.
- [ ] Separately pilot incremental forward coordinates in the rotated axes against the current rotate/rank pipeline. Include the extra transition reads, frame storage, initialization, and emitted-C ownership behavior in the cost.
- [ ] Add diagnostic conditional-cut accounting by residual depth and predecessor filters. Freeze any cheaper probe selection/order before confirmation. Do not rerun the rejected corner-first/late permutations without evidence of a different mechanism.
- [ ] Only if inversion is a measured limiter, compare recomputation with a dual cubie state updated by a left action. Existing inverse root tasks are not new work. Ordinary right-move coordinate tables cannot be assumed to update inverse nodes.

**You see.**

- [ ] An isolated treatment either completes the same exact contour sooner with unchanged answers and bounds or is recorded as rejected. No new default is selected by source-level intuition.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Check subgroup membership, all move directions, solved states, residual-depth off-by-one cases, inverse reconstruction, and oracle agreement. Require negative mutations that make an invalid mask or left/right action fail. Require generated C to retain the intended owned-array mode.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Compare known shallow exact cases. Save `lane-1.png`. Pass when every optimum and replay agrees.
- [ ] Lane 2. Solve the zero-move case. Save `lane-2.png`. Pass when no extra exclusion raises its bound.
- [ ] Lane 3. Use a U turn inside the reduction subgroup. Save `lane-3.png`. Pass when FullCube-only deductions cannot prune zero-distance reduction.
- [ ] Lane 4. Exercise every face and inverse direction. Save `lane-4.png`. Pass when returned paths and residual masks agree with the oracle.
- [ ] Lane 5. Test Superflip and near-symmetric controls. Save `lane-5.png`. Pass when no structured-case shortcut changes completeness.
- [ ] Lane 6. Run uniform development cases. Save `lane-6.png`. Pass when coverage and terminal quality do not regress.
- [ ] Lane 7. Timeout during an exact contour. Save `lane-7.png`. Pass when unfinished work never raises an established contour bound.
- [ ] Lane 8. Cancel and resume with the treatment. Save `lane-8.png`. Pass when the retained owner and canonical result remain correct.
- [ ] Lane 9. Replay inverse and rotated solutions. Save `lane-9.png`. Pass when reconstruction solves the original input.
- [ ] Lane 10. Run the unchanged small tier. Save `lane-10.png`. Pass when its native results and supported capabilities remain unchanged.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Equal-contour CPU, visits, conditional cuts/probes, deadline answers/bounds, first-answer p95, and RSS. Treat diagnostic instrumentation overhead separately.
- [ ] Probe. Use sealed direct-contour and application A/B configurations, one treatment at a time, then a fresh confirmation of the selected combination.
- [ ] Baseline. Run current inverse-three and the small control first on the same development cases.
- [ ] Rule. Require the unchanged correctness/quality floor and the program's 10%/5% promotion gate. A cheaper kernel that loses deadline bounds is rejected.

**Review gate.** None. U02 is not review-gated because it changes no intended interaction. Independent pruning review remains not run under solo work.

**Merge.**

- [ ] Preserve each proof/finite-check boundary, measured result, and rejected treatment in a signed local commit before another treatment begins.

## Add complementary exact information before increasing table size (U03)

**Depends on.** U02's measured disposition. It need not win to permit this unit.

**Files.**

- [ ] Add isolated six-edge coordinate, transition, byte-distance, loader, and bound modules with tests under `src/`, `bench/`, and `tests/`. Keep existing H0/corner/joint data immutable.

**Build.**

- [ ] Pilot two complementary six-edge PDBs, starting with smaller projections and independent geometry. The full uncompressed target is 42,577,920 states per six-edge pattern, before scratch and alignment. Derive and check these dimensions rather than assuming allocation equals cardinality.
- [ ] Measure conditional pruning after the selected joint/inverse pipeline. Compare one edge pattern, two patterns, corner/edge combinations, and existing H0 as separate treatments. Combine overlapping estimates by maximum, never an unjustified sum.
- [ ] Request large-build admission only after a bounded throughput and aggregate-memory estimate, resumable checkpoints, exact cache identity, and audit cost exist. Plan approval alone does not launch a complete database build.
- [ ] If compression is justified, first derive conservative base-plus-two-bit decoding from an exact byte reference. A low code cannot be interpreted as the base without a valid fallback. Test block-local fallback separately from adding another bound.
- [ ] Consider an edge-orientation-enriched H0 projection only if the six-edge branch fails the marginal gate and the diagnostic identifies missing orientation information. Partial orientations under symmetry require a valid canonical/minimum construction; do not append bits to h0 naively. Keep any multi-GiB expansion behind separate admission.

**You see.**

- [ ] A chosen optional exact profile adds measurable information per lookup and has a complete data audit, or the comparison explicitly retains the existing profile as the winner.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Check rank/unrank, all 18 moves, goal indexes for both patterns, orientations, independent shallow distances, malformed/partial caches, all-edge inequalities and decreasing successors. Require full byte/decoded comparison before compression promotion.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Solve the same shallow corpus. Save `lane-1.png`. Pass when optima and replay match.
- [ ] Lane 2. Load each edge pattern separately. Save `lane-2.png`. Pass when declared goals and actual tables match.
- [ ] Lane 3. Load the selected combination. Save `lane-3.png`. Pass when the reported capability and measured memory match admission.
- [ ] Lane 4. Use solved corners with displaced edges. Save `lane-4.png`. Pass when the edge estimate agrees with the oracle and no corner-only assumption leaks in.
- [ ] Lane 5. Use orientation-heavy and Superflip cases. Save `lane-5.png`. Pass when bounds remain admissible and all incumbents replay.
- [ ] Lane 6. Submit a U subgroup counterexample. Save `lane-6.png`. Pass when exact edge bounds cannot prune reduction.
- [ ] Lane 7. Corrupt or truncate a cache. Save `lane-7.png`. Pass when loading fails before search.
- [ ] Lane 8. Test compressed low-code fallback and block boundaries. Save `lane-8.png`. Pass when every decoded value stays below the reference distance.
- [ ] Lane 9. Cancel after profile initialization. Save `lane-9.png`. Pass when cancellation retains exactly one admitted owner.
- [ ] Lane 10. Use the default small profile without extra caches. Save `lane-10.png`. Pass when no experimental table is implicitly loaded or generated.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Conditional cuts per probe, equal-contour CPU, completed targets, deadline quality, startup, bytes, and peak aggregate RSS including generation scratch.
- [ ] Probe. Alternate sealed same-binary bound policies where possible; compare byte and compressed formats separately and include actual initialization/lookup work.
- [ ] Baseline. Measure the U02 winner and current H0 on identical cases/resources before adding a pattern.
- [ ] Rule. Promote only beyond the program's 10%/5% gate with no quality loss. Cardinality, average heuristic value, or reduced work alone does not pass.

**Review gate.** None. U03 is not review-gated because it adds no intended interaction. New pruning/data proof gates still apply.

**Merge.**

- [ ] Commit a source-bound data/provenance report and keep the profile opt-in. Preserve any rejected layout or larger-profile decision without regenerating sealed data.

## Find better incumbents without starving exact search (U04)

**Depends on.** U00 and U02. Compare against the U03 winner when available, without mixing attribution.

**Files.**

- [ ] Limit changes to isolated portfolio/search policies, a complementary phase-two projection, path transformations, generated profiles, and their tests. Keep the public request/result protocol unchanged.

**Build.**

- [ ] First evaluate cheap task ordering from prior-contour work; then test move ordering independently. Include sorting cost. Ordering cannot shrink a fully exhausted fixed-depth tree by itself.
- [ ] Add bounded premoves as a separate candidate-generation treatment, initially one move before considering two. Deduplicate equivalent starting states and verify reconstruction back to the original cube. Existing axis/inverse roots do not count as new premoves.
- [ ] Pilot a phase-two edge-permutation/corner-combination-parity projection separately from the exact edge PDB. Derive its subgroup goal, reachable coordinates, and memory cost. Keep it out of FullCube and reduction inference unless separately justified.
- [ ] Choose any budget policy only from measured application tradeoffs. Preserve the exact task's fairness and completion evidence. Do not recycle short-first or exact-reserve unchanged after their recorded lower-bound losses.

**You see.**

- [ ] The user receives an earlier or shorter replay-checked incumbent without losing answer coverage or exact progress at the same deadline.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Add premove/inverse/axis composition tests, independent replay, restart/resume, fairness, incumbent monotonicity, legal phase-two transitions, and rejected-domain fixtures. Prove transformed path conventions before trusting any score.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Solve the same fixed-budget corpus. Save `lane-1.png`. Pass when coverage and replay are preserved.
- [ ] Lane 2. Exercise a premove that cancels a suffix. Save `lane-2.png`. Pass when normalization preserves the original solution and HTM count.
- [ ] Lane 3. Combine premove, inverse, and axis mapping. Save `lane-3.png`. Pass when independent replay solves the original cube.
- [ ] Lane 4. Repeat a highly symmetric root. Save `lane-4.png`. Pass when deduplication does not remove required coverage.
- [ ] Lane 5. Use a phase-two input. Save `lane-5.png`. Pass when the complementary subgroup bound and emitted path agree with the oracle.
- [ ] Lane 6. Run fast mode at short and long budgets. Save `lane-6.png`. Pass when incumbent quality remains monotone.
- [ ] Lane 7. Run hard exact mode. Save `lane-7.png`. Pass when candidate search does not manufacture completed contours.
- [ ] Lane 8. Interrupt and restart. Save `lane-8.png`. Pass when transformed tasks and the incumbent remain consistent.
- [ ] Lane 9. Play and export the winning answer. Save `lane-9.png`. Pass when no transformed-coordinate state leaks into the UI.
- [ ] Lane 10. Disable the treatment. Save `lane-10.png`. Pass when the control policy remains reproducible.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Coverage-first deadline length/bound scores, first/best answer curves, first-answer p95, sorting/projection cost, and memory.
- [ ] Probe. Alternate frozen policies over declared budget strata and replay every candidate. Confirm the selected treatment on disjoint development cases.
- [ ] Baseline. Measure the existing round-robin policy first. Keep the two rejected scheduling pilots as negative controls, not candidate defaults.
- [ ] Rule. No lost deadline lower bound or coverage. Require a declared, repeatable answer-quality benefit or at least 10% latency/CPU gain without a greater than 5% first-answer p95 loss. Report ties as ties.

**Review gate.** None. U04 is not review-gated because it changes internal policy, not the intended controls. A new profile selector or interaction would move into U06 and require operator review.

**Merge.**

- [ ] Keep task ordering, premoves, projection, and budget policy in separate signed commits and scorecards. Integrate only the combination that passes fresh confirmation.

## Avoid repeated work and partition exact contours safely (U05)

**Depends on.** U02 and U04 dispositions. Use U03's selected profile for the final comparison.

**Files.**

- [ ] Add a bounded owned cache and explicit partition ledger in isolated Bend modules; change `src/search.bend`, `src/portfolio.bend`, native lifecycle adapters, and tests only as required by the accepted design.

**Build.**

- [ ] Personally recommended addition B. Measure completed, duplicate interior states with identical pruning context. Build a small fixed-capacity transposition cache only if duplicate work could plausibly repay its hash, comparison, and owned-array costs.
- [ ] Cache only a fully established no-solution radius. Key the complete packed cube and pruning context, with goal/profile/policy/session identity explicit or fixed by the cache epoch. Initially exclude root symmetry masks and interrupted or incumbent-truncated subtrees. Full-key comparison is mandatory; a fingerprint match cannot prune.
- [ ] Test cache capacities separately, initially 16 to 64 MiB, with bounded replacement and no unbounded allocation. Eviction must affect speed only. Preserve pure Bend search and owned state; check emitted array mode before timing.
- [ ] Independently build stabilizer-aware two- to four-move root partitions and an explicit completion ledger. A global contour finishes only when every required partition is exhausted. Cancellation or an unfinished partition cannot contribute a stronger global exclusion.
- [ ] Only after serial accounting passes, compare one and two native workers with explicitly admitted private tables. Share only replay-checked incumbents and completed partition evidence through the host. Do not add unsafe shared arrays or foreign search.

**You see.**

- [ ] Exact search avoids proved duplicate work or benefits from two admitted workers while returning the same truthful completion state. A cache miss or eviction never changes correctness.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Force hash collisions, tiny capacities, eviction, different previous-face contexts, interrupted nodes, changed profiles, duplicate partitions, and missing partitions. Compare shallow solution sets/completed contours with the exhaustive oracle and test transformed prefix reconstruction.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Run identical known-optimum exact cases. Save `lane-1.png`. Pass when bounds, optima, and replay agree.
- [ ] Lane 2. Force cache collisions and evictions. Save `lane-2.png`. Pass when results match cache-disabled search.
- [ ] Lane 3. Reach the same cube under different move contexts. Save `lane-3.png`. Pass when one context cannot invalidate another's permitted continuation.
- [ ] Lane 4. Timeout inside a cacheable subtree. Save `lane-4.png`. Pass when no incomplete failure radius is reused.
- [ ] Lane 5. Run Superflip and near-symmetric partitions. Save `lane-5.png`. Pass when representative coverage and prefix replay agree.
- [ ] Lane 6. Leave one partition unfinished. Save `lane-6.png`. Pass when the global contour remains incomplete.
- [ ] Lane 7. Run with one and two workers. Save `lane-7.png`. Pass when both preserve solution validity and completion semantics.
- [ ] Lane 8. Kill one partition worker. Save `lane-8.png`. Pass when failure is retained and no optimum is fabricated.
- [ ] Lane 9. Cancel/resubmit repeatedly. Save `lane-9.png`. Pass when all admitted owners, descriptors, and IPC clean up.
- [ ] Lane 10. Use the small single-worker profile. Save `lane-10.png`. Pass when no second owner or cache is allocated implicitly.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Useful duplicate rate, verified cache hits, equal-contour CPU, wall time, task imbalance, answer quality, cancellation, and total memory.
- [ ] Probe. Compare cache-off/on with one worker first; separately compare one/two workers on identical total jobs and declared per-worker profiles.
- [ ] Baseline. Record the selected serial engine first. Report one-to-two-core scaling separately from any kernel speedup.
- [ ] Rule. Reject a cache that fails the 10% benefit gate or increases established quality loss. Reject parallel scaling that exceeds admission, hides partial work, or loses coverage. Do not claim a cache or multicore gain from fewer counted events alone.

**Review gate.** None. U05 is not review-gated while it remains opt-in engine configuration with unchanged interaction. Safety and independent-review status remain explicit.

**Merge.**

- [ ] Preserve cache, partition, and multicore treatments independently. Keep any rejected treatment isolated and recoverable.

## Finish proof bridges and reduce actual UI overhead (U06)

**Depends on.** U01 and each selected engine treatment. Begin each proof obligation in its originating unit.

**Files.**

- [ ] Work in approved pure proof/refinement modules and `docs/architecture/PROOF-COVERAGE.md`. For measured UI work, limit edits to `apps/web/scene.mjs`, affected diagnostics, and browser tests.

**Build.**

- [ ] Connect accepted projected coordinates and conservative decoding to the model and validated loaded data. Establish a complete bounded exact-search reference theorem first, then identify the missing refinement from optimized traversal to that reference.
- [ ] Keep SearchOptimal distinct from FormallyCertifiedOptimal. Expose the stronger label only if the actual optimized path, pruning, loaded data, and completion evidence all satisfy the required bridges. Otherwise record the exact remaining gap.
- [ ] Personally prioritized existing roadmap work. Measure demand-driven rendering and retained scene objects as separate treatments. The current scene submits frames while active and rebuilds cubie/sticker objects on `set`; quantify those costs before changing them. This is not a new roadmap invention or a solver-strength claim.
- [ ] Drive rendering only for invalidation, camera damping, animation, resize, or recovery if the measurement justifies it. Reuse meshes without moving cube rules out of Bend. Update diagnostics so a correctly idle renderer is not reported as a broken fallback.

**You see.**

- [ ] Proof claims name their real dependencies, and any accepted rendering change reduces actual idle work without making playback or recovery less reliable.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Require both proof checkers, deliberate false-law/malformed-data rejection, unchanged established laws, and browser regressions for scheduling, canonical replay, renderer recovery, and resource cleanup.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Play the same solution. Save `lane-1.png`. Pass when every committed state matches canonical replay.
- [ ] Lane 2. Leave the cube stationary after damping settles. Save `lane-2.png`. Pass when idle work and diagnostics are recorded without a false fallback label.
- [ ] Lane 3. Orbit, resize, and reset the camera. Save `lane-3.png`. Pass when every invalidation renders correctly.
- [ ] Lane 4. Play, pause, seek, and rewind. Save `lane-4.png`. Pass when animations settle and timers remain responsive.
- [ ] Lane 5. Use reduced motion. Save `lane-5.png`. Pass when immediate updates display the canonical cube.
- [ ] Lane 6. Lose/restore WebGL and use 2D controls. Save `lane-6.png`. Pass when context recovery preserves state and controls.
- [ ] Lane 7. Search while manipulating the cube view. Save `lane-7.png`. Pass when interaction and incumbent updates remain usable.
- [ ] Lane 8. Repeat renderer and model failures. Save `lane-8.png`. Pass when no endless loop, stale scene, or owned worker remains.
- [ ] Lane 9. Export an incomplete exact result. Save `lane-9.png`. Pass when it cannot claim formal or search-established optimality.
- [ ] Lane 10. Inspect a certified-reference case and an uncertified optimized case. Save `lane-10.png`. Pass when each label matches its actual proof/data coverage.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Actual submitted idle frames, mesh allocations, browser CPU, active frame p95, native search latency, and proof/check runtime.
- [ ] Probe. Compare equal stationary, orbit, resize, and playback intervals in a document with visible rendering semantics while keeping the preview off the user's screen. Record `document.visibilityState`; a hidden document that already skips rendering cannot establish an idle gain.
- [ ] Baseline. Record the current animation loop and object construction first. Separate draw invalidation from mesh reuse.
- [ ] Rule. Target at least 90% fewer submitted frames once fully idle, without more than 5% active p95 regression or any replay/recovery failure. If the hidden driver cannot create a valid rendering measurement, mark this result inconclusive rather than claiming savings.

**Review gate.** The operator reviews interaction and result-label changes before merge.

- [ ] Present screenshot and video evidence to the operator for rendering behavior and any stronger certification label. Do not merge those changes before review.

**Merge.**

- [ ] Commit exact proof coverage and each measured UI treatment separately. Do not describe a small reference proof as certification of the full application.

## Confirm the integrated result on untouched cases (U07)

**Depends on.** U00 through U06 dispositions and stable selected configurations.

**Files.**

- [ ] Add final comparison adapters and source-bound evidence under `bench/` and `docs/verification/next-plan/U07/`; update the roadmap, supported-profile table, proof coverage, and current status.

**Build.**

- [ ] Freeze the selected configuration before opening the sealed release holdout. Treat default, low-memory, and larger exact tiers separately. Do not choose a new winner after inspecting release results without declaring a new experiment and new holdout.
- [ ] Compare min2phase for anytime solution quality and Nissy/H48 for exact work with pinned revisions, compatible HTM inputs, matched resources, explicit table memory, and separate initialization. External solvers remain oracles/competitors, never product backends.
- [ ] Report answer coverage, length distributions, exact solved fraction, censored completion times, startup, memory, throughput, cancellation, browser behavior, and trust boundaries. Keep small strata and aggregate results distinguishable.
- [ ] Recheck the delivered Nix artifact and licenses at the final source. Produce the final Pareto report and identify unsupported claims rather than equating experiment completion with solver improvement.

**You see.**

- [ ] A reproducible final report says which configuration is better, for which workload and memory budget, what lost, and what remains unproved.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Rerun the full regression, 23-law gate plus separately approved additions, source/cache seals, scorecard negatives, package checks, and independent replay. Audit holdout disjointness and competitor conventions.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, executed solo.

- [ ] Lane 1. Regression lane against trunk. Run the same installed-app solve. Save `lane-1.png`. Pass when correctness and stated capabilities are preserved.
- [ ] Lane 2. Verify a known optimum. Save `lane-2.png`. Pass when the reported interval and certification level are justified.
- [ ] Lane 3. Verify a hard censored result. Save `lane-3.png`. Pass when its incumbent, timeout, and lower bound remain visible.
- [ ] Lane 4. Run the low-memory tier. Save `lane-4.png`. Pass when its total memory and initialization match the final report.
- [ ] Lane 5. Run the selected larger exact tier. Save `lane-5.png`. Pass when admitted caches, memory, and result provenance agree.
- [ ] Lane 6. Exercise all failure/cancel paths. Save `lane-6.png`. Pass when no old job, process, descriptor, or IPC leaks.
- [ ] Lane 7. Play and export a release-case answer. Save `lane-7.png`. Pass when independent replay matches the original input.
- [ ] Lane 8. Use narrow layout, fallback, and reduced motion. Save `lane-8.png`. Pass when all essential workflows remain usable.
- [ ] Lane 9. Import and launch the final delivery artifact. Save `lane-9.png`. Pass when it works through installed paths outside development setup.
- [ ] Lane 10. Inspect matched competitor and Rubend records. Save `lane-10.png`. Pass when HTM conventions, coverage, limits, and timeouts are comparable.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Holdout coverage/quality, completed exact fraction and censored time, cold/warm startup, process-tree RSS, first-answer p95, throughput, cancellation, and active/idle UI work.
- [ ] Probe. Run frozen interleaved controls and candidates in detached admitted batches. Predeclare scoring, cohort count, timeout treatment, and supported comparisons before opening the holdout.
- [ ] Baseline. Measure the U00 integration control and each competitor under the same resources, without transplanting published hardware-specific timings.
- [ ] Rule. Apply the original quality and 10%/5% promotion gates to general claims. Mark a target unachieved if it is not measured. No universal speed, strength, or formal-optimality claim follows from specialized wins.

**Review gate.** The operator reviews final application and default-profile changes before merge.

- [ ] Present the final screenshot/video matrix and Pareto report to the operator. Keep independent review labeled not run under solo work.

**Merge.**

- [ ] Stop at a checked, signed local checkpoint and request any missing publication authority. Approval to execute the plan alone does not authorize a release or deployment.

## Close the program

- [ ] Give every proposed treatment a measured accepted, rejected, inconclusive, or explicitly approved deferred disposition. Do not silently drop a hard unit.
- [ ] Mark the original objective unmet if no treatment produces a supported improvement. A completed investigation is not automatically a stronger solver.
- [ ] Preserve all evidence, sealed artifacts, source identities, proof boundaries, and cleanup receipts. Update current status only from actual results.
- [ ] Report implementation/verification status separately from the still-blocked independent-review gate. Stop and wait for further authority where required.

## Appendix A. Prototype evidence

No new prototype, benchmark, build, data generation, or browser session was run for this plan. The user explicitly requested approval before action. Every proposed gain and new pruning/cache invariant remains unproven until its unit executes.

Existing evidence, not fresh experiments, grounds this proposal:

- `../verification/ROADMAP-REPORT-2026-10-19.md` records the accepted and rejected pilots.
- `../verification/R06-OWNED-CONTROL.md` preserves the unresolved deadline-bound loss and noisy latency control.
- `../verification/R05-SCHEDULING.md` records both failed serial-policy promotions.
- `../verification/R03-OWNED-STACKS.md` and `../verification/R03-SEGMENTED.md` explain why smaller state/storage is not enough.
- `../verification/R04-H0-REFERENCE-CONTOURS.md` records the marginal H0 result and rejected fused ranking.
- GitHub run `39291425745` already passed tests, proofs, sandboxed Nix runtime checks, and package export. It does not prove artifact import or all-profile GUI acceptance.

Sequence Verifiable Units shaped the one-treatment-per-commit design. Explain the Number shaped the separate CPU, work, latency, memory, and UI gates. These are planning choices, not new measurement results.

## Appendix B. Alternatives rejected

The architecture choice is between a measured extension of the existing engine and a new large-table/search rewrite. Choose the extension first. It preserves proven data and controls, tests cheap inference before large allocation, and lets failed ideas stop without destabilizing the workbench.

Do not repeat coordinate-only frames, segmented raw storage, owned continuations, fused H0 ranking, short-first, or exact-reserve unchanged. Their negative evidence stands until a distinct, directly testable mechanism justifies another attempt.

Do not start with a large transposition table, two-core search, or multi-GiB H48-like data. The cache must first show duplicate work; parallelism must first have completion accounting; larger data must first show conditional value and admitted generation cost.

The organizing data shapes are proposed contracts, not implemented APIs:

- `BoundEvidence` couples a goal, source profile, residual-depth lower bound, and any justified final-move exclusion mask. A final-move mask is not a next-move mask.
- `CompletedFailure` couples an exact cube/pruning context with a proved searched radius. A timeout or incumbent-truncated subtree cannot construct it.
- `ContourLedger` identifies the contour epoch, depth, required partitions, and each partition's incomplete/exhausted/failed state. Global exhaustion requires all required partitions.
- `TreatmentReceipt` binds code, data, corpus, resources, raw events, costs, and a verdict. Fewer visits without lower total time is not sufficient.

For inverse state maintenance, `(g m)^-1 = m^-1 g^-1`. The left action must be derived and checked. Reusing ordinary right-move transitions without that derivation is specifically excluded.

## Appendix C. Risks

- U02 can add unsound pruning if subgroup targets, move direction, or residual depth are confused. Keep the inference off until the exact statements and rejecting tests pass.
- U03 can spend substantial time generating a bound redundant with existing estimates. Conditional pruning and cost admission precede a full build; a larger H0 profile is not the default fallback for every failure.
- U04 can improve answers while starving exact progress. The existing lower-bound floor remains mandatory; no losing pair is dismissed as an average win.
- U05 can make exact search incomplete through hash collisions, path-context mismatch, partial failures, or unfinished partitions. Full keys and explicit completion evidence are mandatory.
- U02/U05 can trigger Bend ownership/compiler regressions. Inspect generated C and compare real work before accepting the representation.
- U06 can mistake a hidden page for a renderer optimization or a small theorem for full certification. Record visibility and the actual proof dependency graph.
- Timers and desktop activity can make short p95 comparisons inconclusive. Use recorded controls and predeclared confirmation, not a relaxed target after seeing results.
- No current independent reviewer may run. The program can produce solo evidence, but its independent-review acceptance gate remains open unless the user changes that boundary.

## Appendix D. Links and reading list

Repository grounding includes `OPTIMIZATION-ROADMAP.md`, `PROOF-PLAN.md`, `PROOF-COVERAGE.md`, `R04-H0-DESIGN.md`, `R05-SCHEDULING-DESIGN.md`, `../benchmarks/RESOURCE-POLICY.md`, and `../verification/BACKGROUND-TESTS.md`.

Read the actual callers in `src/search.bend`, `src/portfolio.bend`, `src/inverse-bound.bend`, the generated profile manifests, and `apps/web/scene.mjs` before designing a treatment. Run the installed `how` workflow sequentially under the solo override. Architecture and proof-risk review cannot be claimed independent.

Primary references used for the proposal:

- [Rokicki's nxopt design at the recorded revision](https://github.com/rokicki/cube20src/blob/f430921a48306874864b9f2ac8a059b43492fd3a/nxopt.md) grounds subgroup-derived tight-bound deductions. Applicability to Rubend still needs its own target-group/refinement argument.
- [The pinned H48 design](https://github.com/sebastianotronto/nissy-core/blob/1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88/doc/h48.md) informs conservative compressed lookup, symmetry cautions, and alternative state maintenance. No upstream speedup is assumed for Bend.
- [The pinned min2phase algorithm](https://github.com/cs0x7f/min2phase/blob/4d183b9eff8119cac72bc50ef35a7d8990740e06/Algorithm.md) motivates premoves and a complementary phase-two combination/parity projection. Existing axis and inverse roots are already present in Rubend.
- [Korf's original pattern-database paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf) grounds complementary edge projections. The six-edge prototype and context-sensitive cache remain separate experiments; this citation is not evidence that either improves Rubend.

Preserve upstream revisions, licenses, and notices for any adapted implementation. Algorithms remain implemented in Bend. No foreign solver, GPU stack, neural training, or hosted benchmark service is part of this plan.
