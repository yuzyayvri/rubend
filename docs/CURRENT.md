# Current state of Rubend

## Background-only interval

Yuzy requested an unattended local test queue on 2026-10-19 to avoid spending
model usage while long checks run. Implementation pauses after launching the
fixed queue. No heartbeat or automatic AI wakeup is created. The planned run ID
is r06-unattended-20261019-v1. Read its plan at
build/evidence/r06-unattended-20261019-v1-plan.json and its mutable status at
build/experiments/r06-unattended-20261019-v1/status.json.
Expected completion is about fifteen minutes after launch, with a thirty-minute
aggregate queue cap. Results stay on disk until Yuzy pings again. Read
docs/verification/BACKGROUND-TESTS.md before resuming or starting another build.

The H0 application comparison also passes all 1,750 jobs, with sixty paired
deadline lengths and lower bounds tied. First-answer p95 is 13 versus 12 ms,
22 versus 22 ms, and 1,674 versus 1,675 ms. There is no observed canary quality
gain and no promotion. Source-sealed evidence is under
docs/verification/r04-h0-application-v1. Remaining R04 projection decisions,
R05 implementation, and broader R06 acceptance stay pending while the chat rests.

## Active resume

Yuzy resumed on 2026-10-19 in the managed writer below, with solo work, hidden
previews, unchanged twenty-three laws, frequent commits, and verified pushes
when finished. No subagents may run. Independent review remains not run.

The single-owned control File treatment is implemented. Its emitted raw C
restores BLK_SHR zero and the reference child-admission body. Focused IO, parser,
native reuse, stable-descriptor, and real failure/cleanup checks pass. The
complete v5 native-source application suite and all sixteen toolchain/proof gates
pass with the unchanged twenty-three laws. The FIFO-kind startup guard is
included. The frozen raw binary is build/experiments/r06-raw-v5. build/rubend
and its frontend now also contain this final source. Native and actual Bun
FFI boundary checks pass. Broader hidden GUI/profile/package acceptance remains.
Read docs/verification/R06-OWNED-CONTROL.md.

The first v4 quality run passes1,750jobs and ties sixty answer lengths and
lower bounds, but short-case first-answer p95 misses the five-percent floor.
Same-binary A/A produces fast p95 values of13and16ms, beyond the five-percent
noise limit. Latency acceptance is therefore inconclusive, not passed. The v5
confirmation passes all1,750jobs and sixty answer lengths but loses one
Superflip lower-bound pair, including native terminal bounds. Promotion remains
rejected. Matched cancellation p95 is16.03ms, with all fifteen owners retained
and clean recovery/shutdown. No search speed gain or roadmap completion is
claimed. Remaining R04, R05, and R06 work stays queued.

The R03 owned-continuation pilot is now verified and rejected for promotion.
Storage, mutation, 109,325 complete search-state observations, and 21,890 Light
and Raw portfolio snapshot pairs pass. All 163 shallow optima per profile,
full application regression, all 23 laws, and both native lifecycle/failure
paths pass. A nominal affine Tasks queue avoids the reproduced generic-list
restart array-mode trigger. All sources and negative evidence are preserved.

Five matched cohorts use 20.04 percent more CPU for fast fixed work and
11.83 percent more for exact work. All 1,750 application jobs pass and sixty
deadline answer lengths tie, but four Superflip lower-bound pairs regress.
First-answer p95 misses the latency floor and native RSS does not improve.
The default solver remains unchanged. Read docs/verification/R03-OWNED-STACKS.md.
Continue remaining R04 application/projection decisions, R05 scheduling pilots,
and final R06 hidden-browser, profile, package, and trust checks. Independent
review remains not run. No overall completion or strength claim is made.

A separate host reporting gap is also fixed. Stronger lower bounds now bypass
counter-only progress throttling. The test first observes zero instead of
zero, one, and two; the focused rebuilt native/HTTP/export suite and all23laws
pass after the change. Read docs/issues/progress-bound-throttle.md. This does
not explain away the v5 native lower-bound loss. New comparisons must record
the changed host adapter.

## Inherited ownership investigation

The paused R06 source is now frozen as build/experiments/r06-raw-v3. Actual
raw-table cancellation, fragmented/stale control, retained PID, recovery, IPC
cleanup, host fixtures, and all sixteen toolchain/proof checks pass. The
rerunnable child-admission inspection finds the same emitted body as v2,
including five borrowed-location arguments. The ownership hypothesis did not
produce its intended C change.

Five fresh matched-kernel cohorts pass all 1,750 application jobs and tie all
sixty answer lengths and lower bounds. Superflip first-answer p95 is 2,293 ms
for the contemporary reference and 2,520 ms for v3. That exceeds the five-percent
latency floor, so v3 is not promoted. Full regression and all sixteen final
toolchain/proof gates pass. Fresh matched cancellation p95 is 25.76 ms, with
all fifteen cooperative table owners retained. A separate
tail-state compiler probe is rejected after emitting the same hot function.
A same-binary detached/cooperative comparison passes all1,750jobs and ties
quality. Its first-answer ranges overlap. A minimal native test isolates reused
opaque channels as a trigger for global shared-array mode. The extra location
arguments were previously mislabeled as ordinary borrows. Read
docs/research/CONTROL-ARRAY-MODE.md. This led to the File-owner treatment above,
preserving the Bend parser and pure engine. Neither C
shape nor search work-step counts establish a speedup.

The reproducible C-inspection tool and rejecting fixtures are committed at
3ea769c. Read docs/verification/R06-LIFECYCLE.md for current receipts and the
remaining roadmap gates. The following safe-pause section is historical.

## Previous safe pause

Yuzy explicitly paused on 2026-10-19, Asia/Manila, with15percent usage remaining.
No owned experiment, build, native worker, or preview server remains running.
Four verified-dead scratch/IPC directories from interrupted baseline fixtures
are removed after saving their diagnostic contents. Keep sealed tables, frozen
binaries, source snapshots, and the existing node_modules symlink.
The continuation prompt is in chat, not a repository artifact.

The managed writer is /home/yuzy/.codex/worktrees/roadmap-r01/rubend.
Its latest commit is the safe WIP pause checkpoint after81bb524. Use the shared
pstack checkpoint locator and Git log for its exact identity. Nothing is pushed
during this pause. Resume only after Yuzy asks.

Main and origin/main are both at 076682d937e40355aed444bfdfe0e5efd316d85d.
That integrated checkpoint passes just check, just test, and the standalone
twenty-three-law verdict. Later H0 measurement/rejection work is committed
locally in the writer. The segmented foundation is a local WIP checkpoint.
Its word, fixed-state, malformed-input, and kernel checks pass; the final new
build/test hooks have not had another complete application-suite run.

Segmented measurements now pass all jobs but reject promotion. RSS is 45.9 percent
lower; fixed-work CPU misses the overhead target and three Superflip lower bounds
regress. Keep the default unchanged. Read docs/verification/R03-SEGMENTED.md.
Continue with the lifecycle implementation and remaining hypotheses. Owned stacks, remaining R04
decisions, R05, and most of R06 still need work. No overall completion,
world-class strength, new default profile, or independent review is claimed.

The lifecycle core is implemented. Protocol-two cancellation retains the native
table owner, while frozen legacy backends restart serially. Startup abort, late
IDs, malformed events, terminal contradictions, and browser-worker failure have
executable checks. Full regression passes before the last small host/browser
guards; their focused checks and actual hidden failure/recovery path pass afterward.
The hidden warming fixture also verifies truthful readiness. Five matched raw
cohorts observe cancel-to-ready medians 2,046.43 ms and 2.95 ms, with cooperative
p95 14.11 ms and fifteen of fifteen retained owners. This is not search throughput.
The first deadline-quality run passes all 1,750 jobs and ties sixty answer lengths
but loses four Superflip lower bounds. It rejects promotion. An instrumented
diagnostic finds 636 native pselect6 calls versus one during marked search. The
second treatment batches 64-byte reads and yields once per eight slices. Parser,
native cancellation, host fixtures, and a real frozen fixed-work timer pass.
The batched candidate is build/experiments/r06-raw-v2, with frozen metadata and
source snapshot. Its diagnostic sees 103 pselect6 calls rather than 636, without
using traced timings as release evidence. Its five-cohort quality run also passes
all1,750jobs and sixty answer lengths but loses three Superflip lower bounds.
Neither version is promoted. The OS-polling explanation is therefore incomplete.

The R01 control predates inverse-bound plumbing. A new contemporary reference is
build/experiments/r06-reference-v1, exported from62de4d8 with readback provenance.
Its search, portfolio, cubie, coordinates, and raw loader hashes equal the current
candidate. Keep the historical quality failures visible, but use this matched
kernel control when isolating lifecycle overhead.

Emitted C also shows extra borrowed-location arguments in hot search functions
under the cooperative Loop wrapper, even with unchanged pure source. This is
observed ABI evidence, not proof of the cause. The current unmeasured treatment
removes that Loop wrapper and hands the affine table to one of two IO continuations.
It restores the original service-loop shape and retains the64-byte reader and
eight-slice checkpoint. RootMain check-only and native smoke compilation pass.
Regenerated variants are refreshed. Just check passes all16gates, including the
unchanged23-law verdict, in build/evidence/r06-pause-check-v1.json.
This latest service shape has no frozen raw binary, solve/cancel test, matched
timing, deadline result, or full regression yet. build/rubend still contains the
previous built treatment; do not mistake it for the paused source.

First on resume, inspect/compile the current ownership treatment against the
matched reference, then run native semantics, cancellation, full gates, and fresh
matched comparisons. Do not weaken the quality floor or infer speed from C shape.
The fixed-work timer now selects its explicit diagnostic-event opt-in;
default solver events remain strict. Final full integration, broader GUI, optional-profile
lifecycle, and packaging remain. Read docs/verification/R06-LIFECYCLE.md and its
linked receipts. R06 is not complete.

## Latest verified work

R04's full spatial-symmetry foundation is implemented and verified. All five
laws approved on 2026-10-18 pass the ordinary checker and BendTT, bringing the
total to twenty-three without changing the original eighteen statements.
Independent positional checks, 27,648 KPuzzle comparisons, native action and
composition output, deliberate-error rejection, full regression, and just check
pass. The emitted default-engine C is unchanged. See
[the evidence](verification/R04-SYMMETRY.md).

The H0 corner codec also passes all 153,090 dense roundtrips, legal canonical
representatives, sparse-key uniqueness, 18,000 move comparisons, and 6,144
reference-symmetry comparisons. All forty-eight target actions agree; its
dense goal index is 23. Full regression and the unchanged twenty-three-law
BendTT check pass. See [the codec evidence](verification/R04-CORNER-CODEC.md).

The small H0 quotient also reaches 3,393 classes covering all 153,090 raw states.
Every transformation to representative and every stabilizer bit passes the
native audit. An independent oracle agrees on all 1,048,576 physical words.
Six rejecting mutations, repeated audits, full regression, and the unchanged
twenty-three-law BendTT check pass. See
[the class evidence](verification/R04-CORNER-CLASSES.md).

The raw and reduced corner distances agree on every state, with maximum nine
and sum 984,482. The native audit checks all 2,755,620 raw edges, and an
independent geometry/BFS oracle agrees on every distance and component move.
Nine rejecting mutations, targeted tests, just check, and unchanged-law BendTT
pass. The later combined component regression also passes. See
[the distance evidence](verification/R04-CORNER-DISTANCES.md).

The edge component reaches all 34,650 placements and agrees with independent
geometry on all moves, symmetries, and physical words. All 29,937,600 native
commutation checks and seven mutations pass. A combined-coordinate fixture
checks parity repair, moves, and spatial transforms. Combined full regression,
just check, and unchanged-law BendTT pass. See
[the edge evidence](verification/R04-EDGES.md).

Compact metadata now agrees with independent assembly on all 2,892,000 words.
Nine mutations and 36,000 coupled move checks pass, including cases that need
nontrivial stabilizer equivalence. The derived product goal is 450,429.
Targeted checks and unchanged-law BendTT pass. See
[the metadata evidence](verification/R04-META.md).

The full H0 byte table now reaches and audits all 117,567,450 entries, including
all move edges and stabilizer equalities. The maximum is twelve. The actual
missing-orbit-update mutation and nine auditor rejection fixtures pass. Five
fresh feasibility cohorts admitted the bounded full run. A separately
implemented full reference BFS agrees on every distance and both padding bytes.
The isolated profile, all 47,871 cache-backed bound queries, malformed-cache
checks, the full development regression, and unchanged-law kernel checks pass.
Read [the data evidence](verification/R04-H0-TABLE.md). Application comparisons
remain unrun.
The reference contour comparisons are now complete on pilot and disjoint
development sets. All 640 measured jobs and 6,520 shallow checks pass. The
kernel misses the ten-percent marginal gate over inverse-three. Read
[the measured disposition](verification/R04-H0-REFERENCE-CONTOURS.md).
The fused-ranking treatment is rejected after identical-traversal timing.
It gives no useful total gain. Its source and raw evidence are preserved in
the rejection archive; the live H0 runtime is restored to the reference.

R03's segmented raw owner is also a live isolated prototype. All 285,525,248
used words match the original loader. All 4,075 shallow and 350 general
fixed-work snapshots agree, including cubes, paths, bounds, and completion.
Five repeated cohorts observe45.9percent lower native RSS but reject promotion
after CPU overhead and three lower-bound losses. Independent review remains open. Read
[the data shape and remaining checks](architecture/R03-SEGMENTED-DESIGN.md).
Read [the verified foundation](verification/R03-SEGMENTED.md). The prototype
also closes a zero-geometry/profile collision before promotion.
Its real initialization test fails before and passes after the positive-size
guard. Full data identity and fixed-state checks are rerun after that fix.
No integrated strength gain or default switch is claimed. R03, R05, and R06
remain open. Independent review remains not run under solo work.

Verified development work through the raw corner codec is pushed to origin/main
under Yuzy's configured GitHub author identity. The remote commit was read back
and matched the local checkpoint. This is not a release, default-profile
promotion, or claim that R01 through R06 are complete.

Experiment source snapshots are also hardened. Different source trees can yield
identical binaries, so the old binary-only key could replace frozen source.
Snapshots now bind both digests and reject overwrite/conflict. All eight audited
frozen graphs are intact. Real native building and legacy fixed-work reading,
focused red/green fixtures, full regression, and unchanged-law BendTT pass.
Read [the closed artifact issue](issues/experiment-source-snapshots.md). This
changes development tooling, not the measured solver. No old artifact is rewritten.

The internal Search.initialize contract is corrected. ExactContour now begins
with FullCube, not Reduction. The focused test fails before with observed goal
zero against expected two and passes after with observed two. Improving stages
and profile rejection remain correct. Full regression, sixteen toolchain checks,
and unchanged-law BendTT pass. Seven real application/contour entrypoints emit
byte-identical native C across the fix, so their measured search programs are
unchanged. This is an API correctness fix, not a new speed claim. Read the
[closed initializer issue](issues/search-initial-goal.md).

The complete all-eighteen-move corner database now exists. Bend generation
reaches all 88,179,840 states and its audit checks all 1,587,237,120 directed
edges. Independent transitions, shallow distances, and rejecting fixtures pass.
The pure builder and auditor pass BendTT with the unchanged eighteen laws.
Read [the corner result](verification/R02-CORNER.md). The sealed byte cache
remains ignored in the managed writer checkout. Do not rebuild it on resumption.
The isolated four-policy backend compiles and passes synthetic goal/cutoff
checks, native malformed-cache rejection, full development regression, and
BendTT. Its pure search and portfolio are checked; runtime IO is excluded.
All 9,780 native shallow checks and 960 measured requests pass without errors.
Uniform corner additions fail the ten-percent gate against the relevant control.
The combined bound uses about 80.9% less CPU time than inverse-three on the
sixteen-case half-turn diagnostic, over five fresh cohorts to lower ten or an
earlier optimum. Both complete all eighty repeated targets. Forward-only leaves
forty-five diagnostic requests fuel-censored; no all-case ratio against it is
claimed. This is a specialized contour gain, not general strength. Application
canaries now pass all 1,750 jobs with sixty deadline quality, coverage, and
lower-bound ties against the frozen inverse backend. The first application attempt
was correctly invalidated for overlapping generated-file writes. A new artifact
lease passes conflict/failure tests and prevents that overlap; the serialized
second run has unchanged seals. The separate corner-first ordering experiment
also ties uniform inverse-only time but uses 87.3% less CPU on the declared
half-turn diagnostic, about 7.84 times as fast to its target. Another 9,780 shallow
checks, 960 measured requests, and 1,750 application jobs pass. All sixty
application quality/lower-bound pairs tie, and native/HTTP integration passes.
Read [the ordering result](verification/R02-CORNER-FIRST.md). No third
placement-only variant is justified. The default remains unchanged and independent review
has not run. The large-profile lifecycle check still misses the cancellation
target; its existing R06 issue remains open. Browser/package rollout is separate.

The default Nix package and flake checks now pass at main 0c793d2. A cached
confirmation also verifies the installed native hash and all seventy-one
source-manifest hashes. The setup verdict and packaged native/HTTP checks pass.
This checks the new build-lock dependency and current default app, not a Nix
package of the optional corner binary. The daemon does not inherit experiment
MemoryMax or affinity; the command uses one build job and four declared cores.
The receipt is docs/verification/r02-corner-first-v1/r02-nix-package-v1.json.gz.
After the initializer fix, the fresh default package/setup/runtime checks and
cached confirmation also pass at main e45e209. All seventy-one source hashes
match, and the installed native binary is byte-identical to the earlier
package. The newer receipt is
docs/verification/r01-initialization-v1/nix-package-v2.json.gz.

The exact-only inverse pilot is implemented and remains opt-in. Three lazy
inverse-axis estimates use 36.6% less CPU time on sixteen pilot positions and
37.8% less on sixteen disjoint development positions to reach lower bound
fifteen. Each set uses five fresh cohorts. All 480 measured targets and 4,890
native shallow checks pass. These are direct-contour results, not general
answer-speed or world-class strength claims. See [R02 evidence](verification/R02-INVERSE.md).

The application canaries compare the frozen R01 raw release against the inverse
profile. All 1,750 jobs pass. Sixty deadline quality and lower-bound pairs tie.
Superflip first-answer p95 is 3.2% slower on five samples, within the finite
five-percent canary threshold. Hard exact jobs remain incomplete. The full
development regression, sixteen toolchain checks, and eighteen laws pass.
The default small profile has not changed. Remaining kernel pilots, broad corner
browser/profile rollout, and independent review are not done.

A hidden GUI check found and reproduced a stale export bound. The canonical
solution now follows progress and completion events, so the same difficult
case displays and exports fifteen to nineteen, with no optimal claim. The cheap
regression fails before the fix and passes after it. Read the
[closed export issue](issues/export-bound.md) and docs/verification/r06-export-v1/.
The rebuilt hidden GUI confirms the fix. Its bounded server lease expired during
the usage-limit interruption. After resumption the saved result was captured,
the hidden tab was closed, and direct inspection found no remaining preview or
native child. No subagent, Astra, visible window, push, or deployment was used.

Yuzy resumed work after replenishing limits on 2026-10-18. Continue solo from
the approved roadmap. The R03 coordinate-only phase-two pilot is now rejected.
Both correct implementations take about fifteen to nineteen percent more CPU
time than R01 for identical work. A same-source legacy-frame comparison gives
no useful gain, and an ownership variation does not recover the regression.
No slower frame code was integrated into main. The source is preserved in a
local experiment branch and a portable recovery patch alongside all evidence.
Read [the rejected pilot](verification/R03-SUBGROUP.md). The runtime cause is
not yet isolated. Do not repeat the same field-deletion premise without a new
direct test.

The independent packed-small-table pilot now passes its finite memory gate.
It generates an exact four-MiB table directly instead of a thirty-two-MiB table.
Native after-shallow RSS falls from 43,948 to 15,276 KiB in five fresh pairs.
All 1,630 shallow memory jobs and 1,750 application jobs pass. Sixty deadline
quality/lower-bound pairs tie. Startup median rises from 221 to 313 ms, so this
is an optional memory tier, not a default switch or a general speed claim.
All used entries and all packed words match the original data. Fixed-work
snapshots, full regression, native/HTTP integration, and a hidden 3D solve,
playback, and export smoke check pass. The pure direct builder also passes
BendTT with the unchanged eighteen laws. No foreign solver or new unsafe effect
is used. See [the packed result](verification/R03-SMALL.md) and
[local profile instructions](benchmarks/ADVANCED-PROFILES.md).

The memory and corner experiments leave the default hot loops unchanged. The
later initializer correction above changes an unused helper, with identical
emitted native application code. Variants are generated separately with
stale-source checks. Independent
review, broad browser coverage, and Nix package rollout are not claimed. All
temporary UI and worker processes are stopped. The corner follow-up is recorded
above. R03 raw segmentation and owned-stack pilots remain before broader R04
scaling. R06 lifecycle work can proceed independently. Keep the expanded resource
policy, solo work, and frequent verified commits. No push has occurred yet.

## Whole-engine execution

Yuzy approved autonomous implementation of the plan on 2026-10-17 and authorized
pushing verified changes when done. Read the
[whole-engine optimization roadmap](architecture/OPTIMIZATION-ROADMAP.md) and its
[source-grounded findings](research/OPTIMIZATION-GROUNDING.md) before resuming.
The roadmap covers stronger exact bounds, cheaper Bend search state, modern
symmetry-aware projections, anytime policies, table memory, lifecycle reuse,
GUI responsiveness, and staged proof coverage. No implementation or benchmark
ran in the earlier planning turn. The new performance targets remain unmeasured.
The [lifecycle issue](issues/engine-lifecycle.md) is source-observed and open.
R01's solo foundation is complete as recorded below. Push authority does not include
PR creation, merges, releases, deployment, or global system changes. Existing
resource, model, and hidden-window boundaries still apply.

R01a is implemented with solo checks. The pilot/development/release sets contain
128, 1,000, and 10,000 disjoint frozen states. Coverage-first scoring preserves
missing answers, exact lower-bound losses, and censored exact times. Six positive
families and twenty rejecting fixtures pass. Re-scoring existing warm evidence
reproduces its 180 paired ties. No new solver performance result is claimed.
See [R01 progress](verification/R01.md). Independent review has not run under
the user's explicit no-subagents instruction. R01 as a whole remains incomplete.

Explicit table profiles and named Bend Goal, Stage, Completion, and portfolio
Request types are implemented in focused commits. Baseline/current fixed-work
records match all 163 shallow optima, 4,075 raw snapshots, and 3,911 candidates.
The numeric protocol is unchanged. Native/generated-JS codec checks and a
negative numeric-goal type fixture pass. The complete development regression
suite also passes. This is behavior-preservation evidence, not a speed claim.

R01's noise control and typed-contract deadline comparison are complete. Each
passed 1,990 jobs without error. The typed comparison has all 180 deadline
quality pairs tied. Rate ranges overlap widely. Exact first-answer p95 on
fifteen jobs is 25 versus 32 ms, an unresolved small-sample latency observation.
No speed gain is claimed.

A separate equal-work check used five fresh pairs, 1,630 shallow warmups, and
110 measurements with exactly 500 portfolio slices each. Complete native states
match. Geometric typed/before CPU-time ratios are 1.0073 fast and 1.0096 exact.
Five-cohort bootstrap upper limits are 1.0219 and 1.0266, below the 1.05 overhead
gate on this finite sample. All measured workers are stopped.

The separate diagnostic observer also passes native light/raw semantic-trace
checks and twelve rejecting counter fixtures. It leaves release sources
untouched, recomputes logical cuts/probes, checks actual child coordinates, and
uses nonwrapping counters. Its timing is intentionally not a release metric.
Read [R01 measurements](verification/R01-MEASUREMENTS.md) and the compressed raw
records under docs/verification/r01-v1/. The implementation/finite-check portion
of R01 is complete. Independent review, separate browser coverage, and package
rollout are not claimed by this R01 result. The later R02 pilots are recorded above.

Yuzy extended local CPU/RAM authority after inspection. Read the current
[resource policy](benchmarks/RESOURCE-POLICY.md). It allows inspected development
up to four low-priority CPU lanes and a sixteen-GiB per-batch ceiling, subject to
eight GiB of remaining desktop headroom. The thirty-minute wall cap remains.
Actual admissible RAM can be much lower. No subagents, visible windows, cloud,
GPU installation, global system changes, PRs, or merges are authorized.

## Accepted experimental raw startup

The raw-profile initialization change is accepted after independent review of
code at `e6d5e6f`. It reads bounded little-endian word chunks into their final
positions in one owned array. Search, table generation, fingerprint mathematics,
and candidate certificates remain Bend code. The default small-memory app is
not switched to this experimental profile.

A separate five-run alternating confirmation measured median ready latency of
9.41 seconds for the untouched original and 1.85 seconds for the candidate,
80.36% lower. All 55 tuning and confirmation workers passed with zero errors.
The complete fixed-work comparisons matched 4,591 semantic snapshots per side,
including all 163 raw-profile shallow optima and 3,907 candidate snapshots.
Both large caches and the frozen baseline and candidate binaries still match
their saved SHA256 values after the interruption.

The `gpt-6-sol` reviewer approved loader/FFI and fixed-work correctness. The
`gpt-6-luna` reviewer approved evidence, trail, and the scoped comment scan.
Neither found an actionable defect. The earlier review-capacity blocker is
resolved. Read `.audit/rubend-startup-approval.md` and
`docs/verification/optimization-v1/acceptance.json` for the exact scope.

The result is warm-file-cache native startup, not cold disk, browser, or
packaged-app performance. The raw array still occupies two GiB. Nix package
checks have not been rerun for this source. The reviewer explicitly confirmed
that package rechecking is a separate rollout requirement, not a gate for this
experimental-binary measurement. No universal foreign-IO or completeness proof,
world-class strength, or equal quality at every time budget is claimed.

The lossless block codec passed full entry equality but remains rejected for the
speed profile. The matched five-round warm check is now complete. All 1,990 jobs
passed, including 1,630 shallow warmups and 360 measurement jobs. All 180 paired
deadline-quality comparisons tied. Fast mean best length is 18.75 and first-
answer p95 is 27 ms for both profiles. Exact and Superflip intervals also match.
Rate ranges overlap, so no warm-speed gain is accepted for the search
specializations or exact-child reuse. Read `docs/verification/WARM.md` and
`.audit/rubend-warm-result-review.md` for the independently reviewed result.

The large experimental backend also passed the existing 34-case Engine and
local HTTP suites through a temporary environment override. No browser opened
and no server remains running. This is development integration evidence, not a
Nix package or browser-rendering recheck. The next research target is stronger
exact-search pruning; the hard cases still do not finish within their budgets.

The complete development regression and BendTT checks pass. Preserve the source
and evidence in Git, and the ignored sealed caches and frozen binaries on disk.
The checklists are `.audit/rubend-startup.todo.md` and `.audit/rubend-warm.todo.md`.
The append-only trail is `.audit/rubend-startup.tsv`. The old checkpoint pointer
reported intentional artifact changes after resumed progress, not lost source
or data. Publish and verify the current checkpoint at handoff.

Continue solo without visible windows or Astra calls. The newer resource policy
supersedes this historical startup unit's two-core/eight-GiB envelope. Keep the
thirty-minute batch cap, desktop reserve, configured Git authorship, and frequent
verified commits. Yuzy later authorized pushing verified work when done, as
recorded above. PRs, merges, releases, deployment, and system changes remain gated.

## Run and verify

- `nix run .` builds the packaged local app and prints its loopback URL. It does
  not open a window.
- Development: `nix develop`, `npm ci --ignore-scripts`, then `just dev`.
- `just test` builds and tests the core, shallow exact solver, native process,
  HTTP boundary, and export records.
- `just check` checks the pinned toolchain, independent proof gate, and negative
  proof fixtures. `just audit` exhaustively audits all four projected tables.
- `nix flake check --no-update-lock-file` additionally tests the packaged runtime
  inside the Nix sandbox.

The package and tests target x86_64 Linux/NixOS only. GPU search is not configured;
this machine's AMD GPU does not match Bend's current Linux CUDA path.

## Implemented architecture

The actual search, cube rules, table generation, notation, and candidate replay
certificate are Bend code. Three.js presents the 3D cube; a small Node host
manages loopback transport and the native process. No foreign solver is used in
the product.

Six rotated/inverse searches share one owned table, with duplicate roots removed.
UD-preserving root symmetries reduce equivalent first branches. A first-answer
depth heuristic is removed by restarting improvement work after the first result.
Exact mode keeps the improving searches active alongside complete depth search,
sharing a verified incumbent and monotone lower bound. An optimal label requires
the two bounds to meet.

Private FIFOs avoid the Node-stdio socket reopening problem. Native output is
line-buffered. Progress reaching the browser is throttled, while candidates are
immediate. Shutdown waits for child cleanup; failed startup must not leak IPC
directories or restart indefinitely. Table-generation incompleteness and failed
candidate certificates fail closed.

## Evidence and limitations

Use [JOINT.md](verification/JOINT.md) for the 2026-10-17 engine experiment and
`docs/verification/joint-v1/` for its raw evidence. The local GUI and original
small-memory tier are documented in [PORTFOLIO.md](verification/PORTFOLIO.md)
and `docs/verification/portfolio-v1/`. Earlier records in
`docs/verification/implementation/` and `SETUP.md` are historical.

- 18 laws check through Bend and BendTT, including replay-certificate soundness,
  move identities, codec roundtrips, and frame/move-set transformations.
- 10,000 independent cubing.js move comparisons, 1,000 arbitrary legal states,
  18,000 packed/specification transitions, inverse/frame checks, and 2,000
  subgroup-frame checks pass.
- All 85,394 coordinate roundtrips pass.
- All 46,741 states through depth four were enumerated; 163 depth-stratified
  native optima agree with the shallow oracle.
- The four projected distance tables pass full neighbor/decreasing-path audits.
- The native suite has 34 solve cases, replay checks, cancellation, warm recovery,
  missing-binary handling, and owned-IPC cleanup checks.
- A fresh 32-state release-smoke measurement solved every case at a 1-second
  budget. Its mean best length was about 19.3 HTM and first-answer p95 about
  64 ms. The record separately reports first-answer quality and a one-shot
  cubing.js comparison. These are preliminary small-sample results, not a
  matched world-class benchmark.
- Native peak RSS is about 43 MiB, excluding Node/browser. Native cancellation
  measured roughly 7–9 ms, versus about 0.23 seconds for full worker replacement.
- Hidden browser checks covered playback/pause/seek/backstep, exact short solves,
  invalid input, cancellation/stale reset, selectable JSON export, and narrow
  light/dark layouts. A 1920×1080 viewport showed about 60 fps with p95 frame
  intervals around 16.8 ms. Browser download events and the user's clipboard
  were not fully tested; export has a selectable JSON fallback.

Saved cube state is browser-origin-local. Use a stable `PORT` when persistence
across server restarts matters, or export the record; random loopback ports have
separate browser storage. Dedicated session import/management remains future work.

Full validator correctness, representation refinement, search completeness,
table/data linkage, parser/compiler translation, and backend equivalence are
not all formally proved. See [PROOF-COVERAGE.md](architecture/PROOF-COVERAGE.md).
Hard random exact positions remain incomplete within short budgets. Superflip
still returns a non-optimal 21-move answer near 1.5–2 seconds in the small profile.

Before this optimization batch, the package passed all three Nix sandbox checks.
Those packaged and development runtime source hashes agreed; the derivations and
raw packaged HTTP/native records are in `docs/verification/joint-v1/`.

## Advanced profile

Read [ADVANCED-PROFILES.md](benchmarks/ADVANCED-PROFILES.md). A pinned Nissy
reference was compiled only in the ignored `.cache/nissy-reference` directory.
Metadata reports h48h7 data at 3,793,842,344 bytes and h48h8 at 7,585,624,040 bytes.
The earlier 10-second h0 probe was superseded by a completed local h0 cache and
replay-checked smoke cases. Generation-only local fixes and a boundary regression
test are in `docs/research/NISSY-REFERENCE.md`. Three uniform reference cases
timed out at five seconds; this is not a competitive exact-solver comparison.

On 2026-10-17, Yuzy explicitly approved the proposed local envelope: up to 8 GiB
RAM including scratch, at most two low-priority CPU cores, and 30 minutes per
experiment batch. This is a ceiling, not a memory target. Recheck headroom,
enforce the limits, and stop cleanly at them. No cloud use, GPU installation,
publication, deployment, or visible windows are authorized.

The Bend joint phase-one table has now been generated and exhaustively audited:
2,217,093,120 states, 39,907,676,160 directed edges, maximum distance 12. Its
four-bit cache is about 1.03 GiB, but the owned Bend array occupies 2 GiB.
It is experimental, not enabled in the default app or packaged automatically.

A same-core paired 32-state run at one second improved mean best length from
19.3125 to 18.75 HTM, and first-answer p95 from 83 to 37 ms; 13 shorter answers,
19 ties, no losses. Initialization increased from 278 ms to 9,890 ms. All 163
shallow optima agreed. Three difficult exact diagnoses reached lower bound 15
instead of 12 after two seconds, but did not finish. Superflip remained 21 moves
at five seconds. Full world-class strength and formal exactness are not achieved.

## Resume after the decision

1. Reduce the experimental profile's padding/startup cost and strengthen the
   exact bound with symmetry/inverse estimates. Validate representation changes
   against the audited joint table. Never use a foreign product backend.
2. Use Nissy/H48 only as an independent exact oracle/competitor. Its CLI can
   generate data automatically when a cache is missing; inspect before running.
3. Freeze larger development/release corpora and perform matched-resource
   latency/quality/initialization/memory comparisons. The 32-case sample is not
   enough for a world-class claim.
4. Continue formal coverage without weakening established laws. Investigate the
   data-to-admissibility and traversal-completeness bridges explicitly.
5. Verify fallback/context loss and download/clipboard behavior in external
   browsers when it can be done without disturbing the user.

## Build/provenance details

Six generators emit the model, packed cubies, coordinates, facelet and packed
frame symmetries, and pruning laws. The build checks generated sources for staleness. Generated
JavaScript constructor tags are namespaced, so public move codecs use numeric
IDs rather than passing constructors between separately compiled modules.

`build/manifest.json` binds artifacts to source hashes and pinned toolchains.
Benchmarks reject stale/changing builds. Rebuild after changes to runtime files,
scripts, or the flake before benchmarking. The Nix post-fixup step updates the
packaged native binary digest. Generated binaries, dependencies, large tables,
and temporary outputs remain ignored.

GPL-3.0-or-later is selected. Third-party runtime licenses are retained. Git is
initialized with the private remote. On 2026-10-17 the user authorized using the
authenticated GitHub account's identity for the initial local commit. The name
was verified through GitHub's API; the account-linked ID-based no-reply address
is used because the profile keeps its email private. Configuration is local to
this repository, not global. Consult `git log` for local snapshots. No push, PR,
release, deployment, or repository-visibility change is authorized or performed.
Preserve any remaining staged/uncommitted work.
The agent-owned preview and worker are stopped when handing off this checkpoint.
