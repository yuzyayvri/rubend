# Rubend whole-engine improvement plan

Plan prepared 2026-10-17 against `d6120b2`. No implementation runs are armed.
Improve shortest-answer capability, quality at a fixed deadline, total solve time,
memory, responsiveness, and assurance while keeping the real engine in Bend 2.
Aim for 10x to 100x less exact-search time on declared hard strata through stronger
pruning. Treat that as a research target, not a forecast or tenfold shorter answers.
Run R01 first, then early R02 and R03 pilots. R05 and R06 are independent branches.
Use R04 for the larger exact-search leap. Preserve the small-memory profile.

## How to read this

One box is one unit of work. Every box names the evidence that checks it.
Check a box only when its evidence exists. The body is a how-to.
The appendices explain mechanisms, targets, unresolved choices, and sources.

The future execution protocol is `skills/poteto-mode/playbooks/autopilot-stack.md`
with its `autopilot-full.md` dependency, followed per experiment by
`playbooks/hillclimb.md` from the installed pstack plugin. User authority overrides
publication defaults. R01 to R06 are local implementation-unit IDs, not opened PRs.
Each accepted experiment gets a focused local commit and independent review.
No push, PR, merge, release, deployment, or system change is authorized by this plan.
A later publication request may map each verified feature to its own PR.
The operator owns any future merge. Stop now after delivering this plan.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State this plan and stop. Begin implementation only after the operator's explicit go.
- [ ] On that go, record these standing orders. "Run docs/architecture/OPTIMIZATION-ROADMAP.md in dependency order R01, R02/R03, R04, with R05/R06 independent after R01. Complete each unit's unit, live, and perf evidence before acceptance. Only the operator authorizes publication or merges. Done means an independently reviewed Pareto report, verified app integration, and honest proof coverage, not an assumed world-class victory."
- [ ] Read the execution playbooks and required leaf skills from the installed plugin at program start and each audit tick. Apply repository authority before any default push or PR step.
- [ ] For a later recurring unattended execution request, use an hourly Codex heartbeat with the audit prompt below. Do not create an automation for this planning request.
- [ ] Use this tick prompt. "Re-read the execution playbook and standing objective. Check every active owner and verifier against actual file/process evidence. Correct drift. Report a status message only for a meaningful new result, failure, or required operator decision. Record the decision trail. Stay quiet on unchanged state."
- [ ] On a pause, send all owners a zero-writes order, stop owned jobs safely, preserve caches, and publish a verified checkpoint.

### Spawn owners

- [ ] Use at most one active writer per boundary in an isolated worktree. Use read-only independent reviewers. No Astra. Use gpt-6.1-sol for ordinary work and gpt-6-sol or gpt-6-luna for independent/model-diverse review.
- [ ] Respect four total agent slots. Schedule the ten coverage lanes serially or in admitted small groups. They are ten scenarios, not permission for ten concurrent agents or processes.
- [ ] Run R01 first. Pilot R02 and R03 separately against its baseline. Run R04 after the simpler bound pilot. R05 and R06 can branch after R01 but integrate the accepted engine revisions before final acceptance.
- [ ] Split each treatment within a unit into a measured commit. Do not bundle a new heuristic, representation, scheduler, and table layout into one result.
- [ ] Keep every experiment below 8 GiB including scratch/accounted cache, two low-priority cores, and 30 minutes per batch. Recheck headroom and keep all previews hidden. A sequence of batches is not permission to evade a costly-run approval.

### PR mechanics, for every local unit

- [ ] Record base/head, source graph, binary, toolchain, table identities, seeds, and resource configuration in evidence. Preserve original sealed baselines.
- [ ] Apply deslop before a commit and no-comments before review. Add no code comments except required notices/tool directives.
- [ ] Run `nix develop --command just check` after changes and `bend PROOF.bend --verdict` before Bend commits. Run targeted behavior tests and the full regression suite before integration.
- [ ] Keep publication disabled. Do not resolve/push/open a forge PR unless the operator separately asks for publication. No automatic merge.
- [ ] Review every exact result, no-answer, timeout, cleanup failure, and source seal. A fast failed job is not a benchmark success.

### Verdict and merge, for every local unit

- [ ] Require independent correctness and evidence review at the exact head. Use model-diverse judgment for a new search/pruning architecture. If reviewer capacity is unavailable, keep acceptance closed.
- [ ] Require all unit, ten live coverage scenarios, and perf receipts. Run an independent diff/evidence audit. A screenshot illustrates state; replay, raw events, and oracle agreement determine correctness.
- [ ] Accept only repeated improvements outside control noise with the stated quality floor. Preserve negative or inconclusive experiments. Do not silently weaken a target to pass.
- [ ] Stop at verified local commits. A future PR, restack, or merge uses the execution playbook and fresh base/head verdict. None is authorized now.

### Boot recipe, for every live lane

- [ ] Use an isolated checkout at the recorded head. Run `nix develop --command just build`, then `nix develop --command node apps/server.mjs` on an available loopback port. Use an explicit sealed experimental binary/cache environment when testing the raw profile. Never overwrite a frozen binary.
- [ ] Open only a hidden in-app browser through the available cua browser driver. Wait for actual native ready in diagnostic events as well as truthful UI state. Send solver input through the app.
- [ ] Store screenshots under `build/evidence/roadmap/<unit>/lane-<n>.png`. Save matching events, replay assertions, timing, process identity, and cleanup receipts beside each image. The paths below are proposed outputs, not existing evidence.
- [ ] Stop the server/browser/owned workers after each group and prove cleanup. Do not start baseline and candidate concurrently when their combined resident tables and scratch exceed the ceiling.

## Freeze the scorecard and goal-aware contracts (R01)

**Depends on.** None.

**Files.**

- [ ] Touch only `bench/warm-compare.mjs`, `bench/fixed-work.bend`, `bench/run-limited.mjs`, `src/search.bend`, `src/portfolio.bend`, `src/main.bend`, `apps/engine.mjs`, protocol compatibility tests, new bounded corpus and telemetry fixtures, and proof-plan proposals. Keep existing visible behavior compatible. Record any browser or other boundary expansion before editing.

**Build.**

- [ ] Preserve d6120b2 and the sealed experimental binary as immutable baselines. Freeze a 128-state pilot, a distinct 1,000-state development set, and a sealed 10,000-state release set. Generate uniformly legal cubies, not scramble-length labels. Separately identify independently known-optimum depth strata. Do not assume every uniform state has an available oracle optimum. Record seeds, states, generator hashes, and oracle provenance.
- [ ] Define counters for attempted legal moves, admitted children, expansions, cuts by estimate, phase-two launches, completed contours, and lookup count. Keep legacy work steps separately. Use diagnostic builds for attribution and uninstrumented release builds for reported timings.
- [ ] Replace implicit array-size capabilities and numeric goal/completion conventions with goal-aware profile and result types. Distinguish subgroup reduction, subgroup solving, full-cube solving, exhausted depth, and incomplete work. Specialize the chosen profile once outside the hot loop where the compiler permits.
- [ ] Specify the missing-answer and timeout policy before expanding the benchmark tool. Rank answer coverage before answered-case lengths. Retain censored exact results, deadline candidates, and terminal candidates separately. Add rejecting fixtures before changing the currently zero-miss-only summarizer.
- [ ] Propose exact theorem statements under the existing proof-plan IDs. Obtain approval for additions or changes before adding domain laws. Keep all existing laws unchanged.

**You see.**

- [ ] A result record distinguishes work steps from real search work, identifies its goal and available bounds, and cannot label an unfinished contour exhausted. Save native events and the corresponding live receipt under `build/evidence/roadmap/R01/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Add counter-reconciliation, missing-answer, timeout, capability mismatch, and illegal goal/bound fixtures. Run the small fixtures, `nix develop --command just check`, and unchanged fixed-work comparison. Instrumentation must preserve candidate snapshots. Save test output and head SHA under `build/evidence/roadmap/R01/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R01/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R01/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R01/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R01/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R01/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R01/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R01/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R01/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Run a missing-answer fixture. Save `build/evidence/roadmap/R01/lane-9.png`. Pass when it cannot improve a headline quality score.
- [ ] Lane 10. Load identical-capacity profiles with different capabilities. Save `build/evidence/roadmap/R01/lane-10.png`. Pass when unavailable bounds are rejected.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Baseline and diagnostic overhead, coverage, exact status, first/best answer curves, completed-contour time, peak process-tree RSS, and startup.
- [ ] Probe. Use the existing fixed-work and warm adapters with frozen configurations. Extend them through fixtures first. Run an uninstrumented A/B control with identical binaries to estimate noise before using a candidate. Save raw records and analysis under `docs/verification/roadmap/R01/`.
- [ ] Baseline. Record the d6120b2 small tier and sealed accepted raw profile separately. Historical raw mean 18.75 at one second is a canary, not the new corpus baseline.
- [ ] Rule. Fail any semantic mismatch or missing case. Remove timing instrumentation from release builds. If the control difference exceeds 5%, stabilize/interleave the run before deciding performance.

**Review gate.** None. R01 changes no intended interaction and is not review-gated. Its independent correctness/evidence review still applies.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Add complementary exact bounds without changing the goal (R02)

**Depends on.** R01.

**Files.**

- [ ] Touch only `src/search.bend`, `src/cubie.bend`, `src/coordinates.bend`, `scripts/generate-coordinates.mjs`, `src/tables.bend`, new pure corner-table generator/auditor, and exact-bound tests. Record any boundary expansion before editing.

**Build.**

- [ ] Pilot lazy inverse joint estimates on exact children only. Test one extra axis, then up to three, after cheap forward cuts. Reuse the existing audited joint cache. Start by recomputing the inverse. Add incremental dual state only if inversion cost becomes the measured limiter.
- [ ] Separately pilot a full-corner permutation/orientation database. Add all-18-move corner transitions. Do not reuse the ten-move phase-two corner distances. Compare incremental corner coordinates against lazy ranking before selecting a kernel.
- [ ] Start corner distances as bytes, audit the observed maximum, and only then consider nibbles. Keep the existing raw cache immutable and store this data separately. Gate a complete build/audit on an enforced batch estimate and resumable checkpoints.
- [ ] Combine overlapping admissible estimates with maximum. Never apply solved-corner, inverse-full-cube, or other-axis exact bounds to fixed-axis subgroup reduction. Test the U-turn subgroup counterexample and Superflip's zero corner-root estimate.
- [ ] Compare bounds alone and their combination. Retain a bound only when its saved traversal exceeds evaluation cost on development and held-out cases. Keep no-gain outcomes as evidence, not a promotion.

**You see.**

- [ ] Hard exact searches exclude more work or complete the same contours sooner without changing an optimum or accepting an invalid answer. Save native events and the corresponding live receipt under `build/evidence/roadmap/R02/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Add all-18 transition/refinement checks, projection ranges, complete table edge/decreasing-path audits, malformed-cache tests, and exact shallow-oracle agreement. Run `just check` and `bend PROOF.bend --verdict` before any Bend commit. Save test output and head SHA under `build/evidence/roadmap/R02/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R02/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R02/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R02/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R02/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R02/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R02/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R02/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R02/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Run a U turn already inside the reduction subgroup. Save `build/evidence/roadmap/R02/lane-9.png`. Pass when exact-only bounds cannot prune its zero-distance reduction.
- [ ] Lane 10. Run Superflip and inverse/rotated controls. Save `build/evidence/roadmap/R02/lane-10.png`. Pass when the corner root is zero and all accepted answers replay.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Time for the same completed depth contour, true expansions, additional cuts per probe, best answer at fixed deadlines, time-to-optimal with censored failures, startup, and RSS.
- [ ] Probe. Run forward-only, lazy inverse, corner-only addition, and their combination as separate sealed treatments. Alternate at least five fresh cohorts where practical. Never compare profiler timings. Save raw records and analysis under `docs/verification/roadmap/R02/`.
- [ ] Baseline. Measure the R01 release baseline on the same cases and exact contours before each treatment. Preserve the old 163 shallow optima and hard-case intervals as canaries.
- [ ] Rule. Fail any invalid answer, wrong optimum, premature exhaustion, or canary quality loss. Promote a performance treatment only for a repeated end-to-end gain of at least 10% beyond control noise with no greater than 5% p95 latency regression and no answer-coverage loss.

**Review gate.** None. R02 changes no intended interaction and is not review-gated. Its independent correctness/evidence review still applies.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Make Bend's search state and table access cheaper (R03)

**Depends on.** R01. Integrate R02 separately after each kernel is verified.

**Files.**

- [ ] Touch only `src/search.bend`, `src/portfolio.bend`, `src/raw-table-io.bend`, `src/joint-cache.bend`, `src/tables.bend`, generated coordinate code, new owned-stack/layout modules, and differential fixtures. Record any boundary expansion before editing.

**Build.**

- [ ] First split phase two into a coordinate-only frame and loop. Remove its full cubie turns and storage. Keep phase-one and exact packed state where needed. Replay-certify every emitted solution through the unchanged boundary.
- [ ] Compare current persistent frames with bounded owned stacks and one current path per task. Derive maximum live Node/Retry occupancy. Guard capacity before indexing. Materialize a persistent move list only for a candidate.
- [ ] Independently compare incremental three-axis forward coordinates with current rotations and reranking. Choose by measured total time, not source function count. Maintain only state that pays for itself.
- [ ] Pilot a fixed segmented raw table with explicit logical ranges. The initial geometry is a 2^28-word block, a 2^24-word block, and a 2^23-word prefix. Keep raw nibble semantics and bounded foreign IO. Recompute geometry when corner or other data is added.
- [ ] Test packed small tables separately. Transitions fit 16 bits and existing distances fit four bits, but unpacking may lose speed. Keep the rejected block codec only as a separately labeled memory option unless a new matched test overturns its speed result.
- [ ] Inspect emitted C and source-correlated profiles. Do not hand-port search to C, add unsafe sharing, or claim that deleting tiny wrappers causes a tenfold gain.

**You see.**

- [ ] The same traversal or goal contract uses fewer bytes and less work per child while the native and browser replay checks remain intact. Save native events and the corresponding live receipt under `build/evidence/roadmap/R03/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run old/new semantic trace comparison where traversal order is preserved, coordinate-only phase-two differential tests, stack capacity/overflow fixtures, segment boundaries, codec checks, and all small-table audits. Require full entry equality before promoting a new large layout. Save test output and head SHA under `build/evidence/roadmap/R03/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R03/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R03/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R03/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R03/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R03/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R03/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R03/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R03/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Force a stack-capacity boundary in a fixture. Save `build/evidence/roadmap/R03/lane-9.png`. Pass when it reports incomplete/error before a wrapping write.
- [ ] Lane 10. Probe the first/last words of every table segment and a malformed cache. Save `build/evidence/roadmap/R03/lane-10.png`. Pass when values match the sealed raw source or loading fails closed.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Time per identical fixed-work task and completed contour, phase-two kernel time, allocations, table probes, peak RSS, initialization, and deadline quality.
- [ ] Probe. Test one representation change at a time, then a factorial combination only of accepted changes. Use identical heuristics, ordering, case order, resources, and at least five alternating release cohorts. Save raw records and analysis under `docs/verification/roadmap/R03/`.
- [ ] Baseline. Measure the current persistent-frame/raw-array kernel from R01. The segmented proposal allocates 1,120 MiB versus 2,048 MiB geometrically, before runtime overhead.
- [ ] Rule. Fail any changed semantics not explained by an approved ordering change. For speed promotion require the R02 10% repeated total-time rule. For a memory tier require at least 30% lower observed native RSS, no answer-coverage loss, and no worse canary deadline lengths. Report a time/memory trade explicitly.

**Review gate.** None. R03 changes no intended interaction and is not review-gated. Its independent correctness/evidence review still applies.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Build a modern symmetry-aware exact profile (R04)

**Depends on.** R01 and R02. Use R03 only where its measured representation is better.

**Files.**

- [ ] Touch only New pure projection, symmetry-orbit, representative/stabilizer, compressed-bound, frontier, and audit modules under `src/`; generator scripts; exact tests; profile manifests and provenance. Record any boundary expansion before editing.

**Build.**

- [ ] Compare two designs before a large build. Design A keeps the existing joint table plus complementary corner/edge projections. Design B uses balanced corner-separation/orientation and edge-separation/orientation coordinates inspired by H48 or nxopt. Select by pruning per byte and measured time on a small fully auditable projection.
- [ ] Implement symmetry representatives with every stabilizer alternative accounted for. Start with a small projection and uncompressed reference. Prove transition/refinement and conservative decode obligations before scaling. Do not assume 48 transforms mean 48 times less memory or 48 independent bounds.
- [ ] Add conservative base-plus-two-bit bounds only after a reference model. A low-code fallback must return a certified lower bound, not assume the base. Keep fallback data local to its main lookup when that wins under Bend's actual layout.
- [ ] Derive subgroup-specific tight-bound move masks and inverse switching from this profile's target group. Keep them off until a preservation proof and shallow exhaustive checks exist. H48's half-turn rule is not a rule for every admissible bound.
- [ ] Pilot stabilizer-aware frontier splitting through two to four moves for full-cube exact search. Test Superflip, near-symmetric cases, and uniform controls. Do not infer random-case gains from a structured-case task reduction.
- [ ] Scale through small profiles before a multi-GiB profile. Fit index arithmetic in validated U32 segments where necessary. Include all resident copies, generation frontier/scratch, host, page-cache accounting, and audit work in admission. Stop or resume at the batch boundary rather than silently exceed it.

**You see.**

- [ ] A new optional Bend-native exact profile establishes optima on harder strata and exposes its real quality/time/memory trade against the existing profile. Save native events and the corresponding live receipt under `build/evidence/roadmap/R04/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Require full small-projection enumeration, stabilizer and representative roundtrips, transition commutation, conservative decode, all-edge admissibility audits, decreasing paths, and independent shallow/deeper oracle agreement. Approve new theorem statements first. Save test output and head SHA under `build/evidence/roadmap/R04/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R04/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R04/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R04/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R04/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R04/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R04/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R04/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R04/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Run a self-symmetric coordinate with multiple representative transforms. Save `build/evidence/roadmap/R04/lane-9.png`. Pass when every permitted stabilizer path gives a sound bound.
- [ ] Lane 10. Run a low compression code and a symmetric frontier. Save `build/evidence/roadmap/R04/lane-10.png`. Pass when fallback never overestimates and filtered search preserves the optimum.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Known-depth heuristic distributions, expansions and wall time by depth stratum, exact completion fraction, restricted mean time with timeouts, table generation/audit cost, initialization, and total RSS.
- [ ] Probe. Use equal one-core memory ceilings for existing and new profiles, then separate two-core runs only when admitted. Compare complete fixed-depth work as well as first optimum. Evaluate the release holdout once after development choices freeze. Save raw records and analysis under `docs/verification/roadmap/R04/`.
- [ ] Baseline. Capture R02's best accepted exact profile on the same oracle strata. Existing three two-second hard cases and Superflip are unresolved baselines, not speed ratios.
- [ ] Rule. Require zero overestimates or optimum disagreements. Seek at least 10x less exact wall time on a declared deeper stratum, or a clear increase in exact completions under the same timeout, before calling this a large-factor milestone. Report uncured strata and memory costs. A weaker result remains an incremental profile, not a 10x claim.

**Review gate.** None. R04 changes no intended interaction and is not review-gated. Its independent correctness/evidence review still applies.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Improve anytime answers and spend the search budget deliberately (R05)

**Depends on.** R01. Rebase the experiment inputs on accepted R02/R03 changes. R04 is optional.

**Files.**

- [ ] Touch only `src/portfolio.bend`, `src/search.bend`, phase-two projection/table modules, symmetry/path mappings, and matched-deadline fixtures. Record any boundary expansion before editing.

**Build.**

- [ ] Treat fast mode and exact mode as distinct budget policies. Compare current fixed round robin with a first-answer stage, incumbent-improvement stage, and a reserved fair exact-exclusion allocation. Preserve all resumed state and certified incumbents.
- [ ] Add task/move ordering from previous-contour work or cheap projected estimates only as separate treatments. Measure the sorting cost. Ordering alone does not remove a fully exhausted fixed-depth tree.
- [ ] Study min2phase-style premoves and complementary phase-two permutation/combination projections. Implement one at a time in Bend, including transformed-path reconstruction and independent replay. Do not count existing axis and inverse root tasks as new improvements.
- [ ] After serial improvements, pilot two-core coarse independent tasks with private owned tables or a proved safe runtime representation. Start with one-core-vs-two-core scaling. Never copy a giant array implicitly or start four two-GiB benchmark workers.
- [ ] Represent partitioned exact work with a completion ledger. A contour completes only after every required partition finishes. Never take the maximum lower bound of unfinished partitions as a global exclusion certificate.
- [ ] Keep single-cube latency and batch throughput separate. Rebalance only at bounded slices. Reject an exact-scheduling win that makes fast answer coverage or established canary quality worse.

**You see.**

- [ ] At the same think time, users receive shorter verified answers or a shortest answer sooner, with a responsive first result and truthful lower bounds. Save native events and the corresponding live receipt under `build/evidence/roadmap/R05/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Add premove/path transformation replay, task fairness, restart/resume, incumbent monotonicity, partition coverage, and unfinished-partition negative fixtures. Run fixed-work checks for scheduling-independent semantics and all native/HTTP tests. Save test output and head SHA under `build/evidence/roadmap/R05/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R05/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R05/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R05/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R05/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R05/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R05/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R05/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R05/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Starve or cancel one exact partition in a fixture. Save `build/evidence/roadmap/R05/lane-9.png`. Pass when the global contour remains incomplete.
- [ ] Lane 10. Run a premove and inverse-root answer. Save `build/evidence/roadmap/R05/lane-10.png`. Pass when the reconstructed global path independently solves the original input.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Answer coverage, first-answer p95, paired best length at 10/100/1,000/5,000 ms where supported, excess over known optimum, time-to-optimal, single-cube latency, batch throughput, and total memory.
- [ ] Probe. Alternate policies on frozen per-case deadlines. Hold heuristics and core count fixed while selecting policy. Compare one/two cores only after policy selection, in separate memory-admitted cohorts. Save raw records and analysis under `docs/verification/roadmap/R05/`.
- [ ] Baseline. Use the accepted serial policy at the same profile and deadlines. Reproduce the 18.75 mean/27 ms p95 canary only as a regression check, not a guarantee on larger corpora.
- [ ] Rule. Fail any lower-bound/completion or replay error. Require no coverage loss and no worse canary deadline lengths. Accept a quality treatment only when paired aggregate/quantile results improve on development and confirmation sets. Cap tolerated first-answer p95 regression at 5%. Do not claim a 10x gain from a two-core comparison.

**Review gate.** None. R05 changes no intended interaction and is not review-gated. Its independent correctness/evidence review still applies.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Keep the local app ready and responsive (R06)

**Depends on.** R01. It can proceed alongside solver work with an isolated writer. Integrate profile changes only after their own gates.

**Files.**

- [ ] Touch only `src/main.bend`, isolated runtime control IO, `apps/engine.mjs`, `apps/server.mjs`, `apps/web/main.mjs`, `apps/web/scene.mjs`, `apps/web/worker.mjs`, native/HTTP/hidden-browser tests, and package checks. Record any boundary expansion before editing.

**Build.**

- [ ] Reproduce docs/issues/engine-lifecycle.md with bounded delayed-ready and failure fixtures. Model initializing, ready, searching, cancelling, failed, and closed states. Use native readiness rather than treating the session token as ready.
- [ ] Pilot a cooperative cancellation/control path read at effect boundaries between pure slices. Keep the initialized table after a normal cancel. Preserve job IDs, stale-result filtering, session/origin guards, and candidate certification. Retain forced stop for a failed acknowledgement.
- [ ] Require old-worker cleanup before fallback replacement, or enforce an explicitly admitted overlap bound. Never let cancel/retry loops grow table copies. Test startup disconnect and cancellation while already cancelling.
- [ ] Reject outstanding browser-model requests on worker error, message error, termination, or bounded timeout. Preserve canonical state and give a recoverable error. Test renderer context loss/restoration and a functioning 2D fallback.
- [ ] Measure idle rendering before trying demand-driven frames and retained meshes. Keep motion and controls smooth while search runs. Idle graphics savings are a separate product metric, not solver throughput.
- [ ] Recheck download, clipboard denial/fallback, narrow layouts, reduced motion, stable-origin saved state, native integration, and the Nix package. Keep previews hidden. Do not change global Nix settings to force a benchmark.
- [ ] Close the formal coverage report against the accepted changes. Continue toward data-linked admissibility and a small complete exact-search theorem. Expose FormallyCertifiedOptimal only after every required bridge exists; otherwise retain the search-established label.

**You see.**

- [ ] Cancel and resubmit normally reuses loaded tables. Readiness is truthful. Model/render failures cannot leave an endless busy state. Existing 3D editing/playback remains usable. Save native events and the corresponding live receipt under `build/evidence/roadmap/R06/`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Run native/HTTP lifecycle fixtures, malformed output, crash/fallback, IPC cleanup, worker-request rejection, replay/export checks, `just check`, and package checks under verified resource enforcement. New control effects stay outside PROOF.bend. Save test output and head SHA under `build/evidence/roadmap/R06/unit.json`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on the configured `swarm workers` model at the PR head, interpreted as this local unit head until publication is separately authorized. Use the boot recipe and schedule within actual slots and resources.

- [ ] Lane 1. Regression lane against trunk. Drive solved, depth-four, and uniform input at baseline and head through the real app. Save `build/evidence/roadmap/R06/lane-1.png`. Pass when every output replays and the user-visible completion state remains truthful.
- [ ] Lane 2. Drive exact input with known optimum and inspect the exported interval. Save `build/evidence/roadmap/R06/lane-2.png`. Pass when the optimum and established lower bound agree with the independent oracle.
- [ ] Lane 3. Run a difficult exact timeout and retain its incumbent. Save `build/evidence/roadmap/R06/lane-3.png`. Pass when incomplete work never becomes an optimal label.
- [ ] Lane 4. Run each supported profile, including the unchanged small tier. Save `build/evidence/roadmap/R06/lane-4.png`. Pass when capabilities, memory admission, and results match the selected profile.
- [ ] Lane 5. Submit an impossible cube and malformed/oversized input. Save `build/evidence/roadmap/R06/lane-5.png`. Pass when the boundary rejects it without native search or a stale accepted result.
- [ ] Lane 6. Exercise cancel, edit, resubmit, and a late event. Save `build/evidence/roadmap/R06/lane-6.png`. Pass when only the active job can change canonical state and all children clean up.
- [ ] Lane 7. Play, pause, seek, backstep, and export an answer during native work. Save `build/evidence/roadmap/R06/lane-7.png`. Pass when displayed committed states match canonical replay.
- [ ] Lane 8. Use a narrow hidden viewport and renderer fallback. Save `build/evidence/roadmap/R06/lane-8.png`. Pass when input, result, error, and playback controls remain usable.
- [ ] Lane 9. Cancel and immediately resubmit a raw-profile solve. Save `build/evidence/roadmap/R06/lane-9.png`. Pass when the acknowledged job stops, table/process identity stays stable on the cooperative path, and no stale answer applies.
- [ ] Lane 10. Delay initialization, kill the model worker, lose/restore WebGL, deny clipboard, and export a record. Save `build/evidence/roadmap/R06/lane-10.png`. Pass when readiness and failures are truthful and the cube remains recoverable.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Cancel acknowledgement and cancel-to-next-native-ready latency, cold/warm app readiness, resident worker count/RSS, idle render count and CPU, frame-time p95, and input latency during search.
- [ ] Probe. Run five alternating old/new lifecycle cohorts and idle/interaction traces with the same profile and browser configuration. Keep native and end-to-end browser timers separate. Never drop the OS file cache or disturb visible windows. Save raw records and analysis under `docs/verification/roadmap/R06/`.
- [ ] Baseline. Measure current lifecycle first. The only existing large-profile integration observation is 336 ms old exit and 1,944 ms full recovery. It is one run, not a stable median.
- [ ] Rule. Target cancel acknowledgement and cooperative reuse-ready p95 below 100 ms, zero stale-state commits, zero leaked workers, and preserved frame-time p95 near the existing 16.8 ms observation under matched conditions. Target 10x fewer idle renders only when the baseline actually renders continuously. Label ratios unmeasured until repeated end-to-end evidence exists.

**Review gate.** The operator reviews the changed interaction before any future merge.

- [ ] Post hidden-lane screenshots and a 30 to 60 second video for operator review. Save the screenshot and video under `build/evidence/roadmap/R06/review/`. Stop at local verification until the operator accepts the interaction. This does not authorize publication.

**Merge.**

- [ ] Record independent verdicts for the exact head, checked evidence, and a focused local commit. Do not merge or publish. Keep a rejected treatment recoverable without overwriting user changes.

## Close the program

- [ ] Check every applicable evidence box or record a rejected/inconclusive treatment explicitly. Do not mark a research target achieved because the program stopped.
- [ ] Run the combined accepted configuration on the untouched holdout within admitted batches. Report cold/warm readiness, first/best answer, exact completion/timeouts, RSS, throughput, and UI behavior separately.
- [ ] Compare matched-resource min2phase for anytime quality and Nissy/H48 for exact work. Add vcube only where its supported hardware/profile fits. No competitor is a product backend.
- [ ] Record exact proof coverage, remaining trusted components, unresolved issues, all accepted/rejected treatments, and supported profiles. Recheck packaging and source/license notices before any release request.
- [ ] Stop jobs, preserve ignored caches/binaries, commit durable evidence, update CURRENT.md, publish/read back a checkpoint, and report results with limits. No world-class claim without matched competitive evidence.

## Appendix A. Prototype evidence and open decisions

No new implementation prototype, table generation, or solver benchmark ran for this
plan. Code inspection and arithmetic are the evidence. Existing startup, fixed-work,
warm, and development-integration evidence is linked below. The pilot boxes remain
unchecked deliberately. No law addition is approved by this document.

| Decision | First deciding pilot | Proceed only when |
| --- | --- | --- |
| Extra inverse probes | One versus three lazy inverse axes, no new cache | Saved contour time exceeds inverse/probe cost |
| Corner lookup shape | Incremental all-18 coordinate versus lazy rank | Refined transitions and lower total solve time |
| New exact projection | Joint plus corner/edge versus balanced symmetry prototype | Better pruning/time per resident byte on known depths |
| Persistent versus owned stack | Phase-two-only kernel, then bounded stack | Equivalent results/traversal where applicable, lower total time |
| Rerank versus incremental axes | Identical heuristics and move order | Coordinate maintenance beats rotations/ranking |
| Raw padding | Fixed segmented raw layout | Full equality, lower RSS, preserved deadline quality |
| Cancellation control | Bounded nonblocking/control-channel pilot outside pure graph | Table reuse, bounded acknowledgement, safe fallback |
| Two cores | Independent admitted coarse partitions | Actual latency/throughput improvement and complete coverage ledger |

The original build plan is historical. This plan supersedes its future optimization
sequence, not established laws, source provenance, or accepted experimental results.

## Appendix B. Current architecture and the size of the opportunity

Read [the source-grounded findings](../research/OPTIMIZATION-GROUNDING.md) for
entry points and mathematical cautions. The implemented ownership boundary is:

```text
GUI and model worker -> local Node bridge -> Bend effect loop
                                              |
                         bounded portfolio slices, one owned table
                             |                         |
                    two-phase improvement       complete exact contours
                             |                         |
                         Bend-certified candidate and checked interval
```

The current engine already has packed cubies, coordinate move tables, admissible
projected estimates, three axis/inverse root views, bounded slices, incumbent
sharing, independent replay, and a real 3D application. This is an optimization
program, not a proposal to replace it with a foreign solver.

The accepted raw-profile startup median changed from 9,413.19 to 1,849.06 ms.
Five fresh confirmation workers per profile had ranges 9,226.22 to 9,470.85 and
1,819.68 to 1,856.63 ms. Byte-list creation/decoding was the diagnosed old cost.
The cache was already warmed by validation. The owned array still occupies two
GiB. This is a completed 5.09x startup result, not a future search-speed target.
See [the scoped result](../benchmarks/OPTIMIZATION.md).

The [five-round warm check](../verification/WARM.md) processed 1,990 jobs with
zero errors and 180 paired deadline-quality ties. Its 32 fast cases averaged
18.75 HTM at one second, with first-answer p95 27 ms for both profiles.
Work-step rate ranges overlap. No warm-speed gain is established. Three exact
cases remained [15,19], [15,18], [15,20] at two seconds. Superflip remained
[16,21] at five seconds. These intervals expose the main weakness but cannot
produce a completion-time ratio because both sides timed out.

The 32-state tuning set is too small and reused to establish competitive strength.
An optimal answer cannot become ten times shorter. Define strength as less
excess over independently known optimum, more established optima per time budget,
and shorter verified answers at the same deadline. Define speed at equal quality,
not as an increase in a counter whose meaning changes across implementations.

Use the following unmeasured ambitions to prioritize effort. None is a promised
combined multiplier.

| Dimension | Research ambition | Promotion evidence |
| --- | --- | --- |
| Hard exact search | 10x, then 100x less time on named strata | Same completed work/known optima, five-repeat confirmation, censored failures retained |
| Hot kernels | Seek 2x on phase-two or exact-bound evaluation | Identical-work kernel time plus actual end-to-end contribution |
| Anytime quality | First reach <=18.0 mean at one second on a frozen larger development set, then approach the matched competitor | Coverage-first paired length distributions, oracle excess, and untouched confirmation |
| Raw table allocation | 2,048 to 1,120 MiB with segmented raw layout | Geometry only today; full equality, observed RSS, and time/quality checks required |
| Default small tier | Explore packing 32 MiB of tables toward a roughly 4 MiB allocation | Actual ranges, capacity, unpack cost, native RSS, and preserved quality |
| Cancel/reuse | p95 acknowledgement and reuse-ready below 100 ms | Repeated raw-profile lifecycle and hidden-browser tests |
| Idle graphics | 10x fewer idle renders when continuous baseline is confirmed | Idle frame count/CPU separately, unchanged interaction frame times |
| Assurance | Cover the actual optimized projections, traversal, and completion boundary | Checked theorem statements and explicit loaded-data/runtime trust record |

A twofold kernel gain is not a twofold application gain unless that kernel
accounts for the entire solve. Model total time as attempts times cost per
attempt, plus initialization, scheduling, certificate, host, and rendering work.
Pruning alters the attempt count. Layout alters lookup cost. Their effects
overlap. Measure the combined configuration rather than multiplying guesses.

R02 is the lowest-cost search-strength pilot because inverse probes reuse the
existing cache. Full corners are complementary but do not cure edge-only states.
R04 is the principal route to a much stronger general exact engine. It spends
memory on complementary corner and edge information rather than only enlarging
the current orientation/slice table. Its feasibility is still unmeasured.

## Appendix C. Safety, proof, resource, and claim risks

Keep goal semantics in types. A bound for solved corners is not a bound for
reaching the UD subgroup. A restricted ten-move corner distance is not an
admissible unrestricted distance. Inversion updates reverse multiplication order.
Profile capacity does not prove that a particular bound was loaded. Add executable
counterexamples and checked refinements instead of relying on these sentences.

Use the existing proof-plan IDs in dependency order.

| Stage | Obligations | Release condition |
| --- | --- | --- |
| R01 | C01, C06, T01, S02, S05 | Validated input, bounded coordinates/capabilities, explicit incomplete/completed states |
| R02 | C07, T02, T03, S03 | Projection/move correspondence, inverse mappings, admissibility, goal-correct use |
| R03 | C07, T01, T04, S03 | Optimized layout/stack refines the pure reference and never wraps out of bounds |
| R04 | T02, T03, T04, S03, S04 | Stabilizers, conservative compression, pruning coverage, exact contour completeness |
| R05 | S02, S04, S05 | Monotone incumbent and lower bound, fair/resumable coverage, partition completion |
| R06 | S01, S05, U01 and all dependencies | Original-input replay and truthful job/playback lifecycle |

These are milestones, not a claim that universal proofs already exist.
Propose concrete statements for approval before adding laws. Do not weaken the
18 established laws. Begin the completeness proof on a small finite pure search,
then connect that semantics to the optimized bounded state machine and tables.
Prove edge inequalities imply admissibility abstractly, then connect the actual
audited/loaded data to that assumption. A SHA256 or exhaustive test alone is not
a universal proof of that entire bridge. If it remains trusted, say so and keep
the formally-certified label unavailable.

Bend's proof checker and independent kernel protect stated pure contracts.
They do not prove the compiler, foreign loader, host, or browser. Keep effects
outside the proof graph and use negative proof fixtures plus native/JS/oracle
differentials. More Bend usage means executable ownership and goal/proof
contracts in the hot engine, not rewriting buttons or graphics merely to count
Bend lines. Read the installed guides before Bend, parallel, or effect work.
Do not assume proof fields are erased by this release. Measure their cost.

Admission includes both experiment sides, native tables, scratch, hosts, and
cgroup-accounted page cache. The existing raw pair uses about four GiB in arrays
alone. Two two-core raw competitors at once would use eight GiB in arrays alone
and are not admitted. Alternate larger profiles sequentially. Nissy h48h7's
declared ~3.79 GB data can round to a four-GiB owned allocation before overhead.
h48h8's ~7.59 GB data is unsuitable for this envelope once overhead is counted.
Those are reference metadata, not a mandate to port either profile.

The segmented raw proposal is 1,120 MiB of allocated U32 storage before overhead.
Appending corner data changes the geometry. Current monolithic spare capacity
can fit the byte corner table without crossing its two-GiB tier, but generation
queues and audit scratch must still be budgeted. Start with a bounded pilot.
If full generation or audit cannot finish within an admitted batch, implement
verifiable resumability or request a resource decision. Never omit the audit.

Two cores offer at most a twofold hardware-compute scaling contribution, normally
less. Larger gains require different work. Native fork-join balance, immutable
Data replication, ownership, and memory bandwidth need actual probes. A shared
unsafe array, foreign search, unsupported GPU installation, or global system
tuning is not a workaround.

The lifecycle issue is tracked in [engine-lifecycle.md](../issues/engine-lifecycle.md).
It is source-observed, not a newly reproduced runtime failure. Cancel control
requires effect design. A cancellation flag in pure state cannot observe input
while the effect loop blocks. Prototype an actual control boundary and retain
a bounded forced-stop fallback.

Use matched one-core and two-core comparisons separately. Pin competitors,
release flags, tables, deadlines, and actual RSS ceilings. Keep mitigations
enabled. Use five alternating cohorts for decisions. Record count, median,
range, p95, worst cases, and bootstrap uncertainty for paired quality/latency
where appropriate. Define sample precision before calling the difference real.

For censored exact runs, report completed fraction and a timeout-aware statistic
such as restricted mean time under a common cutoff. Do not compute speedup only
over cases the new engine happens to finish. Freeze the release holdout before
tuning and inspect it only after treatment selection. A 10,000-case release
evaluation is a later admitted/cost decision, not an authorization to run it now.
Use the full uniform sets for coverage and deadline-length distributions. Report
excess over optimum only for the separately identified oracle-known subset. Show
its size, depth distribution, provenance, and oracle failures beside that metric.
Do not let an easier oracle subset stand in for general exact-search strength.

Retain both light and exact profiles. Never automatically load a large table or
generate a reference cache on startup. Package integration, cold-disk behavior,
new browser-rendering behavior, and competitive exact results remain unverified
until their own evidence exists.

## Appendix D. Links and reading list

Repository evidence and entry points:

- [Current implementation and authority](../CURRENT.md).
- [Architecture findings and source entry points](../research/OPTIMIZATION-GROUNDING.md).
- [Original research and pinned revisions](../research/SOURCES.json).
- [Matched warm evidence](../verification/WARM.md) and [raw adjudication](../verification/warm-v1/adjudication.json).
- [Accepted startup result](../benchmarks/OPTIMIZATION.md) and [acceptance scope](../verification/optimization-v1/acceptance.json).
- [Full joint-table audit](../verification/JOINT.md), [fixed-work equality](../verification/FIXED-WORK.md), and [original benchmark contract](../benchmarks/PROTOCOL.md).
- [Proof obligations](PROOF-PLAN.md) and [actual proof coverage](PROOF-COVERAGE.md).
- [Existing corner proposal](../research/NEXT-EXACT-BOUND.md) and [reference provenance](../research/NISSY-REFERENCE.md).
- [Application design](../design/APPLICATION.md) and [canonical decision trail](../../.audit/rubend-startup.tsv).

Primary research inspected for this plan:

- [Korf's pattern-database paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf).
- [Kociemba's two-phase explanation](https://kociemba.org/math/twophase.htm).
- [Pinned min2phase algorithm](https://github.com/cs0x7f/min2phase/blob/4d183b9eff8119cac72bc50ef35a7d8990740e06/Algorithm.md).
- [Pinned nxopt design](https://github.com/rokicki/cube20src/blob/f430921a48306874864b9f2ac8a059b43492fd3a/nxopt.md).
- [Pinned H48 design](https://github.com/sebastianotronto/nissy-core/blob/1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88/doc/h48.md).
- [Pinned Bend guide](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/guide/GUIDE.md) and [upstream trust limits](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/README.md#limitations).

Use `skills/how/SKILL.md` before changing each subsystem. Use
`skills/architect/SKILL.md` for the kernel/table/control designs and stop at
competing sketches before code. Use `skills/interrogate/SKILL.md` for contested
new pruning or data-proof architecture, with supported non-Astra models and
actual slot limits. Use benchmark-checklist for every claimed gain and
show-me-your-work for the canonical trail.

The principles applied here are Explain the Number, which separates completed
search from counters and timeouts; Model the Domain, which requires explicit
goals/capabilities/completion; Sequence Work into Verifiable Units, which keeps
treatments and commits separate; Prove It Works, which requires actual receipts;
and Guard the Context Window, which split read-only source exploration by subsystem.
