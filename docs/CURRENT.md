# Current state of Rubend

## Latest checkpoint

U06 demand rendering is committed as signed `9dc6454`. Its scene-only comparison
passes. The rebuilt app's complete 97-command test recipe is now covered by a
source-checked 48-command prefix plus the repaired 49-command remainder.
The recovery archive verifies 2,119 seals/two receipts, worker gone/no stop:
docs/verification/next-plan/U06/u06-app-recovery-v1/index.json.

Actual rebuilt-app acceptance passed in `u06-gui-demand-v1`. Canonical archive
verifies 2,132 seals/four receipts, worker gone/no stop. Desktop, no-WebGL and
model-failure workflows pass. Viewport reset, owned tabs closed and all native,
server and IPC owners cleaned up. Review images are saved at
docs/verification/next-plan/U06/review-demand/index.json.

Retained-scene preflight passed canonical verification with 2,152 seals/two
receipts, worker gone/no stop. All eighteen animations and 23 final pose/color
checks pass. Candidate identities stay stable; all three actual corruptions fail
for expected reasons. The accepted app is unchanged. Read
docs/verification/next-plan/U06/MESH-RETENTION-PREFLIGHT.md and
docs/verification/next-plan/U06/u06-retain-preflight-v1/index.json.

Retained-scene browser comparison passed evidence verification with 2,171 seals,
three receipts and fifteen partial records. Pose/color/identity/recovery and
zero-idle checks pass, but cadence acceptance is inconclusive. Three of five A/A
cohorts exceed the noise floor, up to16.37percent; candidate cadence also misses
some floors. Keep retention private/unpromoted. Do not rerun unchanged cohorts
for luck. Accepted app unchanged. Read
docs/verification/next-plan/U06/MESH-RETENTION-COMPARISON.md and
docs/verification/next-plan/U06/u06-render-retain-v1/index.json.

The private phase-two projection passed `u04-phase2-v1`. Canonical verification
checks 2,196 seals/three receipts, worker gone/no resource stop. All 40,320 corner
codecs, 403,200 class actions, 2,240 decodes and 5,120 sampled child projections
pass. All three actual corruptions have counterexamples. The pure module,
native/JavaScript checksum parity and unchanged laws pass. The actual Goal guard
admits restricted Subgroup finishing only. No distance table, pruning or
production change. Read docs/verification/next-plan/U04/PHASE2-PROJECTION.md
and docs/verification/next-plan/U04/u04-phase2-v1/index.json.
The mapper preflight passed `u04-mapper-v1`, canonically verified with 2,209 seals
and four receipts, worker gone/no resource stop. Every entry, both actual data
corruptions, 30 work guards and native checksums pass. The timing comparison is
inconclusive. All samples are below 100 ms and two A/A cohorts exceed the noise
limit. The separate `u04-mapper-long-v1` archive verifies 2,231 seals/four receipts.
All counts, checksums and gates pass. Its samples clear 100 ms, but two A/A
cohorts still exceed five percent. Timing remains inconclusive. The longer
profile identifies the packed corner calculation as the dominant helper work.
No promotion or unchanged rerun. Read
docs/verification/next-plan/U04/PHASE2-MAPPER-LONG.md and
docs/verification/next-plan/U04/u04-mapper-long-v1/index.json.
U03's `u03-two-bit-v1` archive verifies 2,242 seals/three receipts, worker gone/no
resource stop. All 154,368 entry/base comparisons, 188 boundary checks, 99 refusals
and three actual corruptions pass. Twenty-one synthetic native checksums agree.
The pure module and unchanged proof/toolchain gates pass. Read
docs/verification/next-plan/U03/TWO-BIT-PREFLIGHT.md and
docs/verification/next-plan/U03/u03-two-bit-v1/index.json.
U03's saved-context screen passed canonical verification with 2,265 seals/three
receipts, worker gone/no stop. All 52,584 cubes, 315,504 projection ranks and
736,176 codec lookups pass. Its information result is inconclusive. Every saved
radius is 7–13, above the six-step maximum reference distance. Zero hypothetical
cuts is guaranteed by that mismatch. Do not infer a negative larger-PDB result
or a performance result. Read
docs/verification/next-plan/U03/CONDITIONAL-INFORMATION.md and
docs/issues/small-edge-screen-range.md. The range guard passed canonical
verification with 2,271 seals/two receipts, worker gone/no stop. Its regression,
twelve corruption controls and unchanged gates pass. Original counts are
unchanged; no cube/rank/codec work was repeated. Read
docs/verification/next-plan/U03/RANGE-GUARD.md and
docs/verification/next-plan/U03/u03-range-v1/index.json.
The `u05-prefix-v1` queue failed at the test adapter's application move-list
limit while reading 43,254 valid prefix IDs. All 2,284 source seals, executed
receipts, twenty native rows and eleven frozen Bend sources are preserved under
docs/verification/next-plan/U05/u05-prefix-v1-failed/. The app limit is unchanged.
A separate depth-bounded census reader passes the failing-before regression and
thirteen boundary/malformed controls. The `u05-prefix-recovery-v1` archive verifies
2,307 seals/three receipts, worker gone/no stop. All twenty censuses, twelve finite
endpoint-orbit comparisons, four compiled corruptions, two missing-endpoint
controls and native checksum parity pass. Unchanged compile/native data was
reused and unchanged proof/toolchain gates pass. The original run stays failed.
Read docs/verification/next-plan/U05/PARTITION-PREFLIGHT.md and
docs/issues/partition-prefix-list-adapter.md. The ledger `u05-ledger-v2` archive
verifies 2,318 seals/three receipts, worker gone/no stop. All forty transitions,
24 scope changes, 21 refusals, four malformed packets, twelve full ledgers and
five actual corruptions pass. Ten native packets agree; both pure modules and
unchanged gates pass. Prefix evidence was reused. Read
docs/verification/next-plan/U05/LEDGER-PREFLIGHT.md and
docs/verification/next-plan/U05/u05-ledger-v2/index.json. No actual worker
partitions, certified exhaustion, NP07 proof or production/global-bound change.
U07's comparison-record archive verifies 2,332 seals/two receipts, worker gone/no
stop. All 45 fixture rows, fifteen record corruptions, ten aggregate corruptions,
seven notation refusals and unchanged proof/toolchain gates pass. Read
docs/verification/next-plan/U07/COMPARISON-RECORDS.md and
docs/verification/next-plan/U07/u07-records-v1/index.json. No actual solver
comparison, release holdout or final configuration freeze occurred.
The reference-calibration archive verifies 2,460 seals/three receipts, worker
gone/no stop. All fourteen planned paths replay; cubing also passes KPuzzle
input/output checks and its process exits normally. The staged cache is read-only
and original artifacts/115runtime source hashes are unchanged. Twelve provenance
controls and unchanged proof gates pass. Explicit Nissy slack is zero, not the
CLI default twenty. No relative-speed or formal-optimality result. Read
docs/verification/next-plan/U07/REFERENCE-CALIBRATION.md and
docs/verification/next-plan/U07/u07-reference-v1/index.json and
docs/issues/nissy-optimal-slack.md. The cold-lifecycle archive verifies 2,481 seals
and three receipts, worker gone/no resource stop. All six process controls and
nine real shallow calibrations pass with replay-valid paths. Real children exit
without forced termination; all three Rubend native owners and IPC directories
are gone. Unchanged proof/toolchain gates pass. The owned-stdin shutdown defect
and its failing source are preserved. Read
docs/verification/next-plan/U07/COLD-LIFECYCLE.md. No pilot/release evaluation or
relative-performance acceptance is included.
The `u07-pilot-v1` archive verifies 2,501 seals and three receipts, worker gone/no
resource stop. All sixty serial requests are retained, with no errors, unavailable
backends, forced stops or surviving native/IPC owners. Both anytime backends cover
20/20 requests on four reused pilot roots. Every cohort has Rubend lengths
19/20/20/20 and bundled min2phase lengths21/20/20/21. Nissy's zero-slack exact
configuration is censored in20/20 requests. The 27 scorer corruption controls,
fixture-only regression and unchanged gates pass. Read
docs/verification/next-plan/U07/COLD-PILOT.md. Four roots repeated five times are
not twenty independent inputs. No tuned winner, exact-work comparison, kernel
speed, CPU/RSS gain, new default, final freeze or release holdout follows.
The `u04-move-v2` archive verifies2,401seals/three receipts, worker gone/no stop.
All59,049bucket assignments,123boundaries,eleven resume points,fourteen refusals
and two actual cursor corruptions pass. Generated Search matches4,800native
child sets and160independent scores. Goal-routing corruption has3,200counterexamples.
All128native cursor packets agree withJavaScript. The pure module, generated
Search and unchanged proof/toolchain gates pass. Production search stays unchanged.
Read docs/verification/next-plan/U04/PHASE2-MOVE-ORDER.md. No new pruning or table,
policy promotion, full-search quality/cost result, new law or release case.
The `u04-move-study-v1` archive verifies2,422seals/six receipts, worker gone/no stop.
All168guards and480fresh development528–535requests pass with285candidate replays.
Quality work accounts for192,000,000Search.advance calls. A/A and repeated states
are stable. All160control/treatment pairs tie on length and lower bound, so the
frozen rule skips long-cost and profile runs. They are not measured performance
results. Keep ordering private and unpromoted, with no unchanged lucky rerun.
Read docs/verification/next-plan/U04/MOVE-ORDER-STUDY.md. Existing proof/toolchain
gates pass. No new default, law, native-deadline or application-speed claim.
The `u05-worker-v1` archive verifies2,447seals/four receipts, worker gone/no stop.
All1,124jobs, five real replay-certified hits and two partial probes pass.
The independent oracle checks213,933states. One no-hit scope closes only after
all244required jobs exhaust. Five hit scopes retire without exclusion.323exact
receipt retries and twelve record/two manifest-scope corruptions pass. The actual
early-exhaustion native corruption fails admission. Existing raw cache hash and
identity, pure wrapper verdict and unchanged proof/toolchain gates pass. Read
docs/verification/next-plan/U05/PARTITION-WORKER.md. No NP07 proof, production/global
bound update, worker-pool/scaling result, new data/law or performance promotion.
The `u05-pool-v1` archive verifies2,470seals/four receipts, worker gone/no stop.
Both normal and retry worker pairs are ready concurrently onCPU2/3under the5GiB
aggregate ceiling. Every1,124result and ledger outcome matches the single-worker
reference. A worker exits2after one valid job;243missing jobs prevent commitment.
Checkpoint replay and244-job retry recover with exactly one identical duplicate.
All five owners are gone, process groups stay inside the resource runner, cache
and source seals hold, and fixture/actual corruption/proof gates pass. Read
docs/verification/next-plan/U05/PARTITION-POOL.md. No scaling speedup, NP07 proof,
production/global bound or application change is established.
The `u00-aa-cpu-v1` archive verifies 2,485 seals and three receipts, worker gone
and no resource stop. All ten identical-helper processes match the independent
50-million-probe checksums. All five pairs stay within five percent for both
whole-process CPU and wall time. Native work ranges from 1,444 to 1,524 ms.
Fourteen sample and three aggregate corruption controls and unchanged gates pass.
The disposition is stable in this diagnostic only. Historical noise remains
unexplained; mapper and browser acceptance stay inconclusive. Read
docs/verification/next-plan/U00/NATIVE-AA-CPU.md. No engine-speed claim follows.
The `u04-ep4-ccp-v1` archive verifies 2,510 seals and three receipts, worker gone
and no resource stop. All 235,200 product distances, 2,352,000 directed edges,
1,680 codecs, 16,800 transitions, 10,240 actual-cube child projections and three
source corruptions pass. The maximum projected distance is ten. Its 228,449
strict improvements over separate EP4/corner-class distances do not establish
improvement over Rubend's existing phase-two bounds. Generated payloads stay
outside Git. Read docs/verification/next-plan/U04/SMALL-PRODUCT.md. No actual
existing-bound cut, universal admissibility proof, production integration, or
speed gain is claimed. Clipboard/download acceptance remains open because the only connected
browser still has the recorded observation limitations. The temporary capability
check tab is closed; no unsupported browser connection or test hook was added.
The `u04-small-conditional-v1` archive verifies 2,539 seals and three receipts,
worker gone and no resource stop. All 640 child facts and 8,960 actual Search
admission masks reconcile on 64 distinct restricted-walk roots. Two actual
source corruptions, malformed cache input, sixteen record corruptions and thirty
residual-boundary checks pass. The product hypothetically excludes 376 of 23,932
admitted children across twenty roots. These synthetic radius/history contexts
are not actual visit frequencies. Distances are reused; unchanged gates pass.
Read docs/verification/next-plan/U04/SMALL-CONDITIONAL.md. No CPU or quality gain,
universal admissibility proof, production pruning or speed acceptance follows.
The existing raw cache is unchanged. No full six-edge database, production
pruning or new domain law.
Do not rerun the short comparison unchanged. Read
docs/verification/next-plan/U04/PHASE2-MAPPER-COST.md and
docs/verification/next-plan/U04/u04-mapper-v1/index.json.
U06 video/operator/package/general-performance gates remain open.
No push/merge/deploy or new-law authority.

## Current unit evidence

The fast-only R refinement confirms fixed-work answer coverage gains on three
of sixteen fast request/budget pairs, involving two fresh development roots.
There are no losses. All eighty exact paired runs preserve every saved state.
Canonical archive: docs/verification/next-plan/U04/u04-fast-only-v1/index.json,
2,010seals/four receipts, worker gone, no resource stop. No application deadline,
latency, CPU or default promotion is established. U05's non-pruning collector
passes its pure kernel and fourteen context guards in the same archive.

U05 native observation passed and was canonically archived with 2,026 seals,
three receipts, worker gone and no resource stop. Every saved control/observer
state matches. All 48 incumbent replays and 2,048 sampled cube roundtrips pass.
One repeat among 52,567 completed spans has a 19-step repeated span. This does
not justify a cache probe on the current workload. No cache/pruning or NP06/NP07
approval. Read docs/verification/next-plan/U05/NATIVE-DUPLICATE-OBSERVATION.md
and docs/verification/next-plan/U05/u05-interior-v1/index.json.

The native deadline queue `u04-deadline-v1` passed canonical verification with
2,041 seals, three receipts, worker gone and no stop. Its 236 requests and 552
candidate replays pass, but the treatment fails the frozen quality floor.
Fresh confirmation has zero wins and four longer answers among 80 paired runs.
Coverage and lower bounds hold. Same-binary p95 spreads exceed five percent, so
no latency gain follows. Keep the default unchanged and do not rerun this policy
unchanged for luck. Read docs/verification/next-plan/U04/DEADLINE-SEED-PROBE.md
and docs/verification/next-plan/U04/u04-deadline-v1/index.json.

U06 baseline passed canonical verification with 2,056 seals, three receipts,
worker gone and no stop. All five visible-document idle samples submit 120 frames
in two seconds. Each measured set creates 80 new meshes and 26 groups. All 101
canonical-color checks pass. Temporary server stopped, renderer disposed and
owned hidden tab closed. Read docs/verification/next-plan/U06/RENDERING-BASELINE.md
and docs/verification/next-plan/U06/u06-render-baseline-v1/index.json.

U06 demand rendering passed canonical verification with 2,075 seals, three
receipts and all fifteen partial records, worker gone and no resource stop.
Control submits 113–117 idle frames per two seconds; demand submits zero in all
five samples. A/A and active cadence floors pass, with no general speed claim.
All 303 canonical-color checks, 315 repaint checks and fifteen WebGL recovery
cycles pass. Normal candidate repaint peaks at 19 ms. Mesh rebuilding remains
unchanged. `just check` and focused tests pass. Owned hidden tab is closed.
Read docs/verification/next-plan/U06/DEMAND-RENDERING.md and
docs/verification/next-plan/U06/u06-render-demand-v2/index.json.

V1 failed its 240-second browser completion deadline. All 2,073 source seals,
executed receipts and uncommitted candidate sources are preserved under
docs/verification/next-plan/U06/u06-render-demand-v1-failed/index.json.
It has no captured browser result and no performance verdict. The v2 recovery
saves completed samples incrementally and uses bounded browser milestone waits.
Workload, resource caps and acceptance floors are unchanged.

V1 app regression rebuilt the actual app and passed 48 top-level recipe commands,
then failed linking the keyboard fixture's missing renderLabel export. The failure
and built artifact hashes are preserved with 2,105 source seals at
docs/verification/next-plan/U06/u06-app-regression-v1-failed/index.json.
The fixture now re-exports the real helper; all nine keyboard scenarios pass.

The `u06-app-recovery-v1` queue passed and was canonically archived. All 49
remaining commands pass; the unchanged 48-command prefix and actual rebuilt
artifacts match. All 97 top-level commands are covered across both runs, while
the original process remains failed. No browser benchmark is repeated. Run
hidden full-app acceptance next. Operator review and performance promotion
remain open. Keep mesh retention separate.
The app browser is outside the server's resource cgroup. No browser CPU/RSS
enforcement claim. No new law or proof label.

U04 move ordering/phase-two projection, U06 bridges/UI efficiency and U07 final
comparisons remain open. No default, application/CPU gain, publication or large
build is authorized by this probe.

## Earlier checkpoints

Execution priority correction on October 23. U02 has expanded into a broader
proof programme without an accepted performance gain. Do not treat closing all
of those proof gaps as a blanket prerequisite for U03–U07. The approved plan
allows U03 after U02's measured disposition even without a win. U02 remains
incomplete and unpromoted; its current performance disposition is inconclusive.
Keep unchecked pruning off and preserve every open proof obligation.

The `u02-slice-finish-v1` recovery passed and was canonically verified with
1,858 seals, worker gone and no resource stop. The private profile passes
495 codec cases, 2,003 coordinate cases and 4,096 rank comparisons. Production
coordinates and native-cost acceptance remain unchanged. Read
docs/verification/next-plan/U02/u02-slice-finish-v1/index.json.

The checked private-profile/runtime-strip checkpoint and U02 non-promotion
disposition are recorded in docs/verification/next-plan/U02/DISPOSITION.md.
Continue with U03's bounded feasibility and cost preparation. Do not extend
the U02 proof chain by default. U04's
bounded ordering work does not require a U03 winner. U05 and final U07
integration retain their actual dependencies. NP04–NP08, full database builds,
publication and all other existing authority gates remain unchanged.

U03's coordinate/action preflight passed with 1,865 matching seals, worker gone
and no resource stop. The one-to-six-edge prototype passes 11,112 exhaustive
small codecs, 200,016 small transitions, 18,432 sampled six-edge transitions
and 22,800 full-cube projections against KPuzzle. Three actual corruptions
have counterexamples. The archive is
docs/verification/next-plan/U03/u03-edge-pattern-v1/index.json.
No database was generated or new law assumed. Read
docs/verification/next-plan/U03/EDGE-PATTERN-PREFLIGHT.md.
The native-feasibility queue also passed, canonically verified with 1,885 seals,
all four receipts, worker gone and no resource stop. Its six-edge helper median
was 117 ms per 100,000 calls across five samples, range 116–120 ms. This is not
a database ETA or engine improvement. Several smaller helpers were noisy.
U04's unchanged round-robin baseline passed 330 snapshots and 228 independent
candidate replays. All 6,960,000 work steps reconcile, but the 115 observed
crossings remain coarse. Next, prepare small native one-to-three-edge table
generation and exact contour-change observation, preserving baseline states.
Read docs/verification/next-plan/U03/NATIVE-COST-PLAN.md and
docs/verification/next-plan/U04/ORDERING-OBSERVATION.md. Archive is
docs/verification/next-plan/U03/u03-native-feasibility-v1/index.json.

The small-table/exact-observer batch passed canonical verification with 1,911
seals, four receipts, no resource stop and worker gone. Six native tables pass
22,224 entry comparisons and 400,032 directed-edge/decreasing-path audits, plus
three native refusal and three corruption controls. The U04 observer preserves
all 330 canonical snapshots, replays 228 candidates, and measures 843 completed
contours separately from 179 censored spans. These are work-step counts, not
tree-node visits or completeness certificates. No speed promotion follows.
Both pure modules pass BendTT and unchanged proof/toolchain checks pass. Read
docs/verification/next-plan/U03/SMALL-TABLE-PILOT.md and
docs/verification/next-plan/U04/EXACT-CONTOUR-OBSERVATION.md. Inspect and
canonically archive completed results before tracked edits. Archive is
docs/verification/next-plan/U03/u03-pilot-u04-events-v1/index.json. The next U04
step is a bounded task-order treatment with fairness and unchanged work quanta.
U05 remains unstarted, U06 proof bridges partial and U07 holdout unopened.

The prior-contour ordering queue passed and its canonical archive verifies
1,921 seals, five receipts, worker gone and no resource stop. All control states
match. The pilot improves two distinct case/budget/request pairs with no losses;
all thirty-two disjoint development pairs tie across five cohorts. The pilot
gain is not confirmed. Fifteen of twenty A/A timing pairs exceed five-percent
spread. Keep round robin. No speed, deadline-quality or promotion claim.
The complete original large traces were preserved through a bounded streaming
archive recovery, then verified by the unchanged canonical checker. Read
docs/verification/next-plan/U04/PRIOR-CONTOUR-ORDER.md and
docs/verification/next-plan/U04/u04-prior-order-v1/index.json. Next, check
one-move premove path composition and independent replay before a candidate
generation treatment. Do not repeat unchanged ordering cohorts for luck.

The premove path preflight passed with 1,943 verified seals, four receipts,
worker gone and no resource stop. It passes 7,296 frame cases, 14,592 independent
replays, 2,375 normalization cases, three actual corruption counterexamples and
native packet checksum parity. Pure definitions pass BendTT. Bounded large
archival, eight original receipt/seal negatives and unchanged gates also pass.
No candidate search or strength result follows. Read
docs/verification/next-plan/U04/PREMOVE-PATHS.md and
docs/verification/next-plan/U04/u04-premove-paths-v1/index.json. Next, implement
a bounded seeded candidate bank with original-root certificate validation and
an untouched original exact-search authority.

The seed-bank guard passed and is canonically archived with 1,963 seals, three
receipts, worker gone and no stop. All 330 disabled control states match. Its
1,056 snapshots, 646 original candidate events, 75 child replays and 13,756,750
work steps reconcile. The bank did 740,000 seeded steps but admitted no better
original answer in this guard. Certificate, bound-isolation, budget tails,
shallow, owned-array, cache and unchanged proof gates pass. Read
docs/verification/next-plan/U04/SEED-BANK.md and
docs/verification/next-plan/U04/u04-seed-bank-v1/index.json. Next, freeze U/R/F
single-bank arms and run family validation plus matched-work pilot comparison.
Reuse the unchanged binary; do not claim strength from the functional guard.

The seed-quality screen passed canonical verification with 1,990 seals, five
receipts, no stop and worker gone. All three arms fail the frozen quality floor.
U/F have zero distinct wins and two losses; R has one fast-mode20-to19 win and
the same two exact-bound losses,13-to0 and14-to13. Development was skipped.
The pilot reconciles14,520snapshots,9,078original replays,1,840child replays and
176million work steps. Nineteen of twenty A/A pairs are noisy. No promotion.
Read docs/verification/next-plan/U04/SEED-BANK-QUALITY.md and
docs/verification/next-plan/U04/u04-seed-quality-v1/index.json. Next, freeze a
separate fast-only R refinement, reuse its saved pilot strata and confirm on
development512–519 without seeding exact requests. Begin non-pruning U05
duplicate-work preparation separately; U04 move ordering/projection stay open.

The `u04-fast-only-v1` batch passed and was canonically verified. The separate
post-hoc refinement gains coverage on three fresh fast budget pairs with no
losses; all eighty exact paired runs preserve full state equality. The original
all-request matrix remains rejected. U05's typed collector, BendTT and fourteen
context guards pass; native duplicate-rate collection and any cache remain
unimplemented. Read
docs/verification/next-plan/U04/FAST-SEED-REFINEMENT.md and
docs/verification/next-plan/U05/DUPLICATE-PREFLIGHT.md. No new law, pruning,
default or publication. Inspect completed results before edits.

Yuzy approved NP01–NP03 on October 23 and requested autonomous end-to-end
roadmap execution with scheduled continuations in this same chat. Codex heartbeat
`continue-rubend-roadmap` is active every thirty minutes. This supersedes the
earlier no-wakeup boundary for this task. Detached batches, source seals,
resource caps, signed subject-only local commits, hidden previews, solo work
and no Astra remain. NP04–NP08, new large-table generation and publication
remain separately gated. Do not create another automation or a message script.

The installed-package consistency queue passed at 02:07:04 Manila on October 23.
All 1,547 source seals and its receipt digest match. Saved canonical GUI
states, ZIP/assets, cleanup, focused tests and all sixteen proof/toolchain gates
pass with no resource stop; the worker is gone. Read
docs/verification/next-plan/U01/u01-installed-checks-v1/index.json.

U02's isolated exclusion preflight passed all 46,741 states through depth four,
63,036 independent transitions and four actual mutation counterexamples.
All 1,541 source seals and both resource-receipt hashes match; the worker is
gone and the joint cache is unchanged. No extra bound increase was observed
on this shallow set, so no speed benefit is claimed. Read
docs/verification/next-plan/U02/u02-exclusion-v1/index.json.

Supporting subgroup proof kernels now pass both Bend and BendTT, including
reference word replay/length/involution, final-move exclusion under explicit
target/admissibility witnesses, positive coverage and inverse first-move
transfer under an explicit reconstruction bridge. A reference target instance
passes. Two invalid proof fixtures are rejected by both public entrypoints.
Translated claim headers are preserved so the remaining premises are visible.
Exact NP01–NP03 are not complete. Concrete packed/joint target refinement,
loaded-data and inverse reconstruction bridges remain open. Production
search and the established 23 laws are unchanged. Read
docs/verification/next-plan/U02/PROOF-KERNEL.md.

The `u02-proof-v1` confirmation passed with 1,555 matching seals, unchanged
proof/toolchain gates, no resource stop and its worker gone. Read
docs/verification/next-plan/U02/u02-proof-v1/index.json.

The concrete reference UD/FB/RL predicates now have Bend/BendTT proofs of
identity membership, selected-move closure, inverse-member closure and exact
18-bit mask correspondence. An axis-indexed witness instantiates the generic
coverage kernel with these actual targets. Its admissibility premise is still
explicit. A deterministic generator reads the model's sticker permutations;
11,502 reference/packed samples and 6,000 preserving transitions pass, with a
real slice-orientation mutation counterexample. A deliberately swapped proof
witness fails on the expected s6 versus observed s3 mismatch. Two earlier
verifier failures are preserved. Read
docs/verification/next-plan/U02/REFERENCE-TARGETS.md.

The reference target confirmation passed with 1,577 matching seals, no resource
stop and its worker gone. Its archive is
docs/verification/next-plan/U02/u02-target-v3/index.json.

The separate U02 forward-coordinate reuse prototype now passes 100,000 native
whole-vector checks, all 85,140 transition entries, and 38,000 JavaScript vector
comparisons. The wrong-frame and corrupted-transition controls have actual
counterexamples. Its owned-array mode is checked. This does not measure extra
frame allocation, conditional probe costs or solver speed. Production sources
and established laws remain unchanged. Read
docs/verification/next-plan/U02/COORDINATE-REUSE.md.

The coordinate confirmation passed with 1,591 matching seals, no resource stop
and its worker gone. The canonical checker now verifies and archives completed
queues with one command: `node bench/check-background-results.mjs RUN-ID`.
It rejects eight bad receipt/source/lifecycle cases, is in `just test`, and
verified the actual completed queue twice without changing its archive. Read
docs/verification/next-plan/U02/u02-axis-v1/index.json.

The conditional pipeline queue passed with 1,604 matching seals, no resource
stop and its worker gone. Read
docs/verification/next-plan/U02/u02-pipeline-v2/index.json. Its root-near counts
guide a new source-isolated sixteen-field cached-axis Search, which updates FB
and RL only after the preceding bound passes. Candidate and audit pure modules
pass both checkers. The native equivalence queue passed all 179 cases across
control, candidate and audit workers. Every original stack field, metadata and
answer agrees, and 34,159 audited advances have consistent coordinates. All
1,618 seals match, there is no resource stop, and the worker is gone. Read
docs/verification/next-plan/U02/u02-axis-search-v1/index.json. The pilot native
cost queue passed with 1,631 matching seals and no resource stop. Fresh pilot
A/A meets its gate. The observed A/B paired native-time ratio has median 0.8947,
but its profiler mainly measures initialization. Overall performance acceptance
is inconclusive; deadline quality is unmeasured. Read
docs/verification/next-plan/U02/CACHED-AXIS-PILOT.md. Development confirmation
is archived with 1,645 matching seals. One same-binary cohort differs by 5.33
percent, so A/B was skipped under the unchanged gate. Additional on-CPU time
means scheduler delay alone does not explain it. The longer profile points
to lookup/read code but does not identify the noise cause. The control-only
diagnostic passed with 1,673 matching seals. Its 24 requests show no major faults
or large runnable-wait spikes; the timing cause remains unproved. The failed
acceptance gate is not retried. Work returns to the reference proof bridge.
Finite-cell confirmation passed with 1,681 matching seals. A field-wise proof
connects every typed whole-state move and finite replay word to the existing
facelet specification. Its guard and post-commit confirmation pass with 1,691
matching seals. Embedding injectivity and word-cancellation confirmation passed
with 1,703 matching seals. A constructed reference state-inversion bridge now
passes both pure checkers for roots presented by reaching words. It connects
the kernel's exact word convention and instantiates its first-move theorem
without assuming inversion. Confirmation passed with 1,725 matching seals.
Inspection of the pinned Base shows proof-visible `U32` Boolean words, enabling
the first actual packed-field proofs. Corner routing confirmation passed with
1,741 matching seals. A 72-statement module now proves corner labels, both
edge-label words and edge-orientation flips for all eighteen moves and arbitrary
32-bit words. Confirmation passed with 1,762 matching seals. Typed cell packing
now has forty proved component readbacks and an actual `Cubie.to_facelets`
view theorem. Both checkers, six expected rejection controls and 80,000 backend
component comparisons pass. The shared bit compiler reproduces all 72 existing
routing proofs byte-for-byte, so their evidence is reused. Packing confirmation
passed with 1,776 matching seals. Corner-orientation arithmetic now proves
typed packing is preserved by all eighteen actual packed moves. Both checkers,
six rejection controls, 36,000 move cases, 18,000 legacy comparisons and direct
delta/layout checks pass. Its confirmation passed with 1,790 matching seals,
no resource stop and its worker gone. The archive is
docs/verification/next-plan/U02/u02-corner-orientation-v1/index.json.
The complete five-field move, facelet and finite-word refinement now passes
both pure checkers and its fixed guard. All 1,786 source seals match, no resource
stop occurred and the worker is gone. The guard passes 36,000 complete moves,
18,000 legacy comparisons, 6,000 facelet checks and 256 replay words. Three
actual corrupt operations have backend counterexamples and six expected
proof rejections. A required explicit equality connects the two corner-word
projections; the first rejected probe is preserved. Read
docs/verification/next-plan/U02/PACKED-MOVE.md and
docs/verification/next-plan/U02/u02-packed-move-v1/index.json.
Packed inverse, input reachability and loaded admissibility remain open.
The packed replay extension also passed its fixed guard, with 1,798 matching
seals, no resource stop and its worker gone. Both pure checkers prove packing
injectivity, actual packed move/word cancellation, reaching-word root
correspondence, inverted solutions and the reference kernel bridge on packed
replay. All 1,024 roots, cancellations and inverted solutions pass the backend
driver. Two wrong conventions have actual counterexamples and four expected
proof rejections. `Cubie.inverse` remains a separate obligation. The batch also
rechecked the complete move module after its signed commit and reused its
unchanged backend/rejection evidence. Read
docs/verification/next-plan/U02/PACKED-REPLAY.md and
docs/verification/next-plan/U02/u02-packed-replay-v1/index.json.
All twenty actual packed position lookups passed the fixed guard with 1,812
matching seals, no resource stop and its worker gone. Both pure checkers
connect each lookup to its inverse-word label for every reaching word.
Two-sided reference composition derives match equivalence rather than assuming
unique positions. The backend passes 20,480 root and 20,060 raw-word lookups.
Both actual-source weight corruptions have counterexamples and four expected
proof rejections. The full inverse orientation/assembly remains open. Read
docs/verification/next-plan/U02/INVERSE-POSITIONS.md and
docs/verification/next-plan/U02/u02-inverse-positions-v1/index.json.
The complete actual `Cubie.inverse` and reconstruction bridge passed their
fixed guard with 1,823 matching seals, no resource stop and the worker gone.
Both pure checkers prove inverse-word correspondence for every reaching-word
root. All five words agree on 1,024 backend roots. Three actual-source
corruptions and a wrong-root claim have counterexamples and eight expected
proof rejections. The bit-name collision is reproduced and now rejected;
all previous routing, packing and packed-move proof bytes stay identical.
Read docs/verification/next-plan/U02/PACKED-INVERSE.md and
docs/verification/next-plan/U02/u02-packed-inverse-v1/index.json.
The source-prefix diagnostic passed collection with 1,832 matching seals,
worker gone and no resource stop. This is not proof acceptance. The first five
definitions pass both checkers; native BendTT reports `coordinate_shape: out
of fuel`. The pinned conversion budget is 400,000,000 steps and is unchanged.
The existing coordinate module passes its standalone verdict. Both direct
reflexivity and congruence-form shape proofs hit the normalization gate.
The normalization controls passed with 1,829 verified seals and the worker gone.
All alias depths and the exact reflexive control pass, ruling out the loop
alone. The constructor-guard prototype passes both checkers and all 4,096
low-mask backend comparisons. A private full coordinate profile with that
boundary now passes an initial universal typed mask verdict too.
The private profile passed both checkers for the universal mask relation and
all four 495-placement codec statements. The guard then failed in runtime
fixture extraction, which removed adjacent type declarations. Before edits,
all 1,847 original seals, failed receipts and successful formal artifacts were
verified and captured. The focused regression fails with `unknown: First`
before the type-preserving strip fix and passes afterward.
The next queue is `u02-slice-finish-v1`, estimated three minutes with a
ten-minute cap. It verifies the captured exact formal artifacts and unchanged
code dependencies, then finishes source-corruption controls, backend and
toolchain gates. It reuses the four passing formal stages instead of repeating
them. The original failed guard remains failed.
Production coordinate source and checker fuel remain unchanged. Native cost
and integration are not accepted by these proof checks. The earlier flat
placement probe's SIGKILL remains unexplained; the smaller branching type is
prepared, not yet verified. Read
docs/issues/slice-mask-verdict-mismatch.md and
docs/verification/next-plan/U02/u02-slice-verdict-v1/index.json.
New slice implementation and runtime harness fix remain uncommitted. Inspect
and archive the next completed guard before source edits.
There is no general speed claim, production change,
new PDB or release-holdout use. Validated-input refinement, loaded-data
admissibility remain open. The packed inverse bridge no longer assumes the
inverse function for reaching-word roots.
Actual native allocation, latency and stable matched controls still need
measurement before integration or promotion.

The following entries preserve the preceding U01 checkpoints.

On October 23 the completed redesign queue was rechecked before edits. All
1,493 source seals and three resource-receipt digests match. Focused checks,
full `just test`, and all sixteen `just check` gates passed without resource
stops. Its worker is gone. The compressed records are
docs/verification/next-plan/U01/u01-redesign-v1/index.json.
Yuzy explicitly requested pushing after the run on October 22. Main
fast-forwarded to 369f480, and GitHub confirmed all 23 outgoing commits Verified.
GitHub CI run 39787894581 subsequently passed at that same revision.

The `u01-delivery-redesign-v1` queue passed with 1,479 matching seals, 67 imported
closure paths, six delivery checksums, installed web assets, HTTP/native replay,
and three clean supervisor shutdowns. Artifact 12429624367 is the actual
redesigned package from successful CI run 39787894581. Read
docs/verification/next-plan/U01/u01-delivery-redesign-v1/index.json.
The actual installed entrypoint now also passes hidden-browser solve/export,
canonical playback, cancellation/resubmission, invalid input isolation, theme
persistence, search-time keyboard locking, repeated seeks, mobile move-rail
tracking, and sticker-editor checks. It runs without the host store or repository
mounted. All owners and IPC stop cleanly; the temporary tab closes and viewport
resets. Read docs/verification/next-plan/U01/u01-installed-redesign-gui-v1/index.json.

The next queue is `u01-installed-checks-v1`, expected two minutes with a
three-minute cap. It rechecks ZIP/assets, saved browser replay and cleanup,
focused tests, and unchanged proof gates. No package rebuild, large table,
full regression repeat, or new browser run is needed. Read its saved results
before further tracked edits. Production sources remain unchanged from the
fully tested redesigned build.
Clipboard/download and raw timing remain open. New law statements still need
separate approval. No new push, merge, release, or deployment is authorized by
the completed October 22 push request.

The following October 22 entry records the pre-queue redesign checkpoint.

On October 22 Yuzy requested a full UI/UX redesign. The paper-workbench layout
is implemented locally after two working visual prototypes. Actual rebuilt
desktop/narrow checks pass for solve/export/playback, theme persistence, sticker
editing, and notation-rail tracking. A confirmed search-time keyboard bypass is
fixed: the live probe moves from failing step three to correct step zero, and
the actual-main regression passes nine scenarios. Native search and 23 laws
are unchanged. Read docs/design/REDESIGN-2026-10-22.md and
docs/verification/next-plan/U01/REDESIGN.md. Next is u01-redesign-v1, a full
source-sealed regression/proof queue with a twelve-minute estimate and
twenty-six-minute cap. Read it before changing tracked sources.
The previous u01-ui-checks-v5 run passed with 1,483 seals, cache hashes unchanged,
and its worker gone. Old profile/CI-package evidence remains bound to its older
source graph, not the redesigned UI. Current CI delivery is not claimed.
Clipboard/download observations and raw timing remain open. No optimization,
new law, publication, deployment, or merge is claimed or authorized here.

The following checkpoint is the pre-redesign baseline.

All six preserved optional profiles and the actual imported CI package now
pass combined browser solve/export/playback/cancel/resubmit/invalid-input checks.
Profile owners remain unchanged before shutdown. All passing sessions stopped.
Production code is unchanged. Read
docs/verification/next-plan/U01/u01-cross-profile-gui-v1/index.json.
The first package cleanup snapshot failed and is preserved. The test supervisor
now stops the application before its namespace wrapper. A fresh GUI workflow
and three supervisor repeats pass without force, with owners gone.
The preceding focused/proof queue passed with 1,306 matching seals and no
resource stop. Read docs/verification/next-plan/U01/u01-ui-checks-v4/index.json.
Next is u01-ui-checks-v5, capped at three GiB and five minutes. It rehashes
the four caches after the GUI runs. Inspect saved results before source edits.
Clipboard/download, under-load seeks, raw timing, and new proof-law approval
remain open. No optimization is promoted.
The concise roadmap is docs/verification/next-plan/PROGRESS.md.

## Approved next implementation programme

Yuzy approved docs/architecture/NEXT-IMPLEMENTATION-PLAN.md on 2026-10-20.
Start at U00 against a7a087235b20b38767b216b0ab90523ac1a2b13f. Preserve the
signed, subject-only commit policy, solo work, hidden previews, current resource
admission, unchanged laws, and detached tests without model polling or wakeups.
This approval does not grant publication, merge, release, deployment, or new
large-table generation authority. U00 is in progress, not accepted.
Read docs/verification/next-plan/U00/README.md before resuming this programme.

The first U00 queue passed all three execution jobs at 19:11:55 Manila on
2026-10-20 in 509.388 seconds. The default app is frozen, all six historical
native snapshots verify, and 3,500 native A/A jobs pass without quality or
terminal-bound differences. The small control is stable on this sample. Raw
RawJoint remains inconclusive, with a 20 versus 24 ms exact first-answer p95
and a 12 ms fast p95 below the five-percent clock-resolution threshold.
No control was promoted. All workers/IPC stopped and the holdout was not
evaluated. The archive is docs/verification/next-plan/U00/u00-controls-v1/index.json.
U00 now needs targeted timing attribution, its live lanes, and theorem proposals.

The fixed latency diagnostic also passed at 23:03:52 Manila on 2026-10-20.
All 1,750 jobs pass and all 120 first-answer prefixes match the original control.
Unrounded exact first-answer p95 remains different, 22.8854 versus 19.7588 ms;
all measured minor/major page-fault deltas are zero. Native CPU consumed until
host observation varies too. This excludes neither cache nor frequency effects
and does not recover native emission time. Scheduler wait accounting is disabled.
The original raw timing gate remains inconclusive, not cleared by instrumentation.
Read docs/verification/next-plan/U00/u00-latency-v1/index.json.

Eight U00 live scenarios now have actual hidden-browser and canonical-replay
receipts for the default small app, including baseline/head agreement, exact
export, keyboard/playback/rewind, invalid input, timeouts, missing answers, and
cancel/resubmit. Both servers, their native workers, and temporary tabs stopped.
Optional-profile browser coverage and the capability-mismatch live lane remain
open. The proof statements in docs/architecture/NEXT-PROOF-STATEMENTS.md are
drafted for separate approval; no new law or pruning rule is enabled.

The sealed optional-profile queue passed at 00:07:24 Manila on October 21.
All six preserved native binaries match the current source graph and pass
Engine, HTTP, retained-owner cancellation, and thirty real control failures.
Existing profile/goal guards and all sixteen toolchain/proof gates pass.
Cache digests are unchanged, owners are stopped, and IPC cleanup passes.
Read docs/verification/next-plan/U00/u00-profiles-v1/index.json.
This is functional evidence, not browser acceptance or a performance verdict.

The remaining two U00 browser lanes now pass. Each of the six preserved
profiles solves and exports the known four-move optimum in a hidden tab,
with one native owner at a time. Binary graphs and cache digests agree with
the sealed integration records. An unsupported readiness protocol fails closed
in the real browser. Read docs/verification/next-plan/U00/status.json and
docs/verification/next-plan/U00/u00-browser-profiles-v1/index.json.
All ten live lanes have receipts, but the raw timing gate remains inconclusive.
U00 is not marked accepted and no search treatment is promoted.

A preparatory U01 worker-failure lane also passes in the actual browser.
After a deliberate model-worker exception, twenty Space presses and arrow
seeks leave playback stopped, requests settled, and the retained answer
unchanged. The diagnostic timer advances and the answer still exports and
replays. This does not close the remaining U01 acceptance matrix. Production
code is unchanged. The next fixed queue reruns full regression and proof checks
for the new test infrastructure. Read its saved results on the next ping.

That queue passed at 00:26:40 Manila on October 21. All sixteen just check
gates and the complete just test pass at 9b73f82. All 1,190 tracked source
seals and resource receipts verify, with no resource stop or surviving worker.
The compressed records are docs/verification/next-plan/U01/u01-checks-v2/index.json.
Continue delivered-package and remaining browser acceptance without repeating
this complete suite for unchanged source.

The next fixed queue is u01-delivery-v1. It checks the actual exported CI
package in a fresh private Nix store and an empty runtime mount namespace,
reusing existing HTTP/native-replay/cancellation assertions. Source and artifact
identities are pinned. The host Nix store is not imported into or mounted.
Read docs/verification/next-plan/U01/README.md and the saved queue result on
the next ping. Delivery is not yet verified and no broader browser result is
claimed. The raw timing acceptance gate remains inconclusive.

The actual delivery queue passed at 01:00:41 Manila on October 21. The pinned
CI ZIP digest, six delivery checksums, and 67 imported closure paths verify.
The installed package passes HTTP/native replay and cancellation in a private
store namespace without the host store or repository mounted. All 1,197 source
seals match, both resource jobs pass, and the worker is gone. Compressed records
are docs/verification/next-plan/U01/u01-delivery-v1/index.json. This is not yet
package GUI acceptance or a clean-machine claim for another kernel/platform.

The next U01 browser pass adds actual context-loss/restoration, canonical
stepping while lost, no-WebGL solve/export/playback, same-origin saved-state
reload, and 390-pixel layout receipts. Three sessions and all native owners
stop cleanly. Tabs close and the temporary viewport resets. Production code
does not change. Read docs/verification/next-plan/U01/u01-browser-acceptance-v1/index.json.

Clipboard denial and download remain unverified. The browser environment
replaces the denial fixture method, and neither inspected activation produces
an observable download event. Preserve both negative observations and strict
assertions. Read docs/issues/browser-clipboard-download-acceptance.md.
The fixed u01-ui-checks-v3 queue rechecks focused tests, saved canonical replay,
cleanup, and unchanged proof gates. Inspect it on the next ping before edits.
The concise unit-by-unit status is docs/verification/next-plan/PROGRESS.md.
The first UI-check plan was refused before tests because its four-GiB ceiling
could not leave eight GiB of desktop reserve. The fresh v2 plan requests three
GiB, above the previous focused check's recorded peak, with all reserve and
runtime enforcement unchanged. Preserve the failed v1 status and log.
The v2 focused tests passed, but its receipt checker incorrectly required
client content width to equal the requested viewport width. The v3 checker
accepts positive content widths up to 390 and rejects horizontal overflow.
It includes accepting 375/390-width and rejecting overflow fixtures. This fixes
test logic, not product layout. Preserve the v2 failure too.

Both private-review full confirmations have finished successfully, including
just test and all sixteen just check gates. The older "running" reference below
is historical. GitHub run 39291425745 also passed at a7a0872, including sandboxed
Nix package/runtime checks and package export. Download/import and broader GUI
acceptance are still open; a green package export does not close those gates.

## Private-review fixes and directed merge

PR 1 is closed and PR 2 retains its full checkpoint plus the contour protocol
and keyboard playback fixes. Five focused checks, the complete `just test`, and
all sixteen `just check` gates pass. The full run finished at 23:46 Manila on
October 19. Read docs/verification/PRIVATE-REVIEW-PASS-2.md and its source-bound
receipts. No independent or real-browser verification is claimed for this pass.

Yuzy explicitly directed merging on October 20 and repeated the direction after
the independent-review gate was disclosed. Work remains solo and Astra remains
prohibited. Main's twenty-seven diverged commits have exact patch counterparts
in the PR, and its complete tree equals PR checkpoint 402e899. An ancestry-only
merge preserves the previously tested source tree exactly. A redundant full
confirmation is running unattended as private-review-merge-full-v1. Read its
saved results on a later ping; do not poll or create an automatic wakeup.

## Latest unattended verification

Yuzy requested an unattended local test queue on 2026-10-19 to avoid spending
model usage while long checks run. Run r06-unattended-20261019-v1 passed all
three jobs and finished at 21:23:29 Manila, after 258.79 seconds. The detached
worker has stopped. Six optional profiles pass build and array-mode checks,
retained-owner cancellation, stable descriptors, fragmented and stale control,
and thirty real native control failures. The staged package passes native,
HTTP, export, and all sixteen toolchain checks with the unchanged 23 laws.
This is not Nix sandbox, relocation, independent-review, or GUI acceptance.
Read docs/verification/r06-unattended-20261019-v1/index.json for source-bound
receipts. Yuzy resumed at 21:51 and made detached test batches the standing
workflow. Prepare a meaningful fixed batch, launch it, and pause with an ETA.
Do not poll long tests or create automatic model wakeups. Read
docs/verification/BACKGROUND-TESTS.md before starting another batch.

The R05 queue r05-scheduling-unattended-20261019-v1 also passed its execution
checks, finishing at 22:13:10 Manila in 595.998 seconds. All 3,500 native jobs
and 10,585 independently replayed candidate events pass. Both policies tie
all sixty deadline answer lengths, but each loses one Superflip native lower
bound and misses its first-answer latency floor. Neither policy is promoted.
The default search, ordering, restarts, and 23 laws remain unchanged. Read
docs/verification/R05-SCHEDULING.md and the source-bound archive beside it.
The worker has stopped. No further tests are left running from either queue.

Yuzy requested a bounded closeout and public-facing README refresh at 22:20,
with 19 percent of the five-hour usage window remaining. This pass records
measured dispositions and updates the overview rather than starting another
expensive feature or repeating completed tests. See
docs/verification/ROADMAP-REPORT-2026-10-19.md for the consolidated roadmap,
strength, benchmarks, and remaining limitations. The roadmap is not complete.

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
