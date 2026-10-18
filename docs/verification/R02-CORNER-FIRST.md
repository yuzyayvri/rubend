# Corner-first bound ordering

The corner-first combined policy has a specialized direct-contour gain, not a
general solver-speed gain. It uses 87.3% less CPU time than its inverse-only
control on the sixteen-case half-turn diagnostic, about 7.84 times as fast.
Uniform marginal CPU time still ties. Keep it experimental and leave the default
engine unchanged. Application canaries and native/HTTP integration pass.
Independent review has not run under the user's solo instruction.

## Change and checks

The late policy checks three forward joint axes, three inverse axes, then the
corner distance. This variant checks the corner distance between forward and
inverse work. It reads that estimate only once and keeps its FullCube guard.
It changes neither the max-bound cutoff nor moves, frame fields, or data.
The generator preserves the late variant and produces a separate private
search, portfolio, runtime, contour entrypoint, and manifest. The default source
files remain unchanged.

Native tests check reduction and subgroup bypass, both successive pruning
stages, and reuse of the supplied child. The pure search and portfolio pass
BendTT with the unchanged eighteen laws. Full development regression passes.
The shared loader retains exact size and fingerprint checks; runtime IO stays
outside the pure proof graph. Universal projection, data-loading, and search
completeness proof obligations remain open.

## Five-cohort result

The cases, targets, tables, worker limits, warmups, and policy rotation match
the late experiment. Five fresh cohorts per stratum run all 9,780 known shallow
optima and 960 measured requests without error or forced cleanup. All uniform
targets complete. On the diagnostic, inverse-three, corner, and combined each
complete all eighty requests. Forward-only again completes thirty-five and
leaves forty-five fuel-censored. Do not drop them or report a completed-all-case
ratio against forward.

| Set and target | Combined over inverse-three CPU ratio | Five-cohort 95% interval | Ten-percent gate |
| --- | --- | --- | --- |
| Pilot, lower fifteen | 0.9969 | 0.9896 to 1.0043 | Fails |
| Development, lower fifteen | 1.0016 | 0.9902 to 1.0141 | Fails |
| Half-turn diagnostic, lower ten or earlier optimum | 0.1275 | 0.1267 to 0.1284 | Passes |

Ratios use cohort CPU totals across all sixteen cases and resample five cohorts.
They are finite-set observations, not population confidence guarantees. Lower
ten excludes contours zero through nine; eight diagnostic cases per cohort
finish at an earlier optimum. This is not a complete deep half-turn solve test.

Corner-only beats forward-only by more than ten percent in this binary on both
uniform sets, but inverse-three remains the faster existing control. Combined
adds no measurable uniform gain over that relevant control. The two placements
therefore do not justify a third placement-only attempt or a default switch.
The next broad-strength hypothesis needs different information or separate
ownership/cost evidence, not a claim based on the table's mean distance.

A separate rerunnable comparison matches terminal metadata, moves, and work
counts across all 960 late/early request pairs. Shared table, model, and corpus
contents also match. The half-turn work ratio to inverse-three remains 0.1226.
The changed order avoids inverse computation on children cut by the corner
bound, consistent with lower CPU cost despite the unchanged traversed work.
The headline ratio is to the within-binary inverse control. No direct timing
ratio between the separately run late and early binaries is claimed.

The batch takes 432.387 seconds and peaks at 2,333,452 KiB aggregate RSS. It uses
CPU 2, one native thread, nice 10, a 4,096-MiB command-tree limit, no swap,
an eight-GiB desktop reserve, and a 1,800-second wall cap. Native search wall
time and process CPU time cover actual traversal; initialization and host IO
are separate. No work-step-throughput or memory improvement is claimed.

## Reproduce

Generate with scripts/generate-corner-profile.mjs --corner-first and check with
--check-corner-first. Build bench/corner-first-contour.bend through
bench/build-experiment.mjs, then use the same explicit corner configurations
with bench/contour-compare.mjs under bench/run-limited.mjs. Builds and experiments
now exclude one another's generated outputs through the checkout artifact lease.

Raw reports, build/regression receipts, adjudications, and semantic comparisons
are in r02-corner-first-v1/. Reproduce summaries with
bench/summarize-corner-contours.mjs and semantic checks with
bench/compare-corner-orders.mjs. The latter makes no direct timing claim and
has six rejecting fixtures. Sealed binaries and caches remain ignored locally.
The release holdout has not been used for tuning or strength evaluation.

## Application and integration

Five fresh alternating pairs compare the frozen inverse release with the
corner-first application backend. All 1,750 jobs pass, including 1,630 known
shallow optima. All sixty deadline length, coverage, and lower-bound pairs tie.
There are no missing deadline answers, errors, changed input seals, or forced
cleanup. The coverage-first scorer reproduces these results from complete
events. Hard exact jobs remain incomplete, so no general strength gain is claimed.

Both profiles average 19.375 moves on the eight pilot fast cases, nineteen on
three exact canaries, and twenty-one on Superflip. Both finish with lower fifteen
on the exact cases and sixteen on Superflip. First-answer p95 is eleven versus
ten milliseconds for forty fast samples, twenty-three versus twenty for fifteen
exact samples, and 1,613 versus 1,523 for five Superflip samples. These small
samples pass the finite latency floor but do not establish a general improvement.

Warm-file startup medians are 1,749.6 versus 1,750.7 milliseconds over five fresh
workers, with ranges 1,698.2 to 1,766.9 and 1,739.9 to 1,802.9. Sampled native
peak RSS is 2,142,152 versus 2,142,188 KiB, excluding the host and browser.
There is no claimed startup or memory gain. The application batch takes 221.677
seconds and peaks at 4,423,216 KiB aggregate RSS under a 6,144-MiB command-tree
ceiling, CPU 2, nice 10, no swap, and a 900-second wall limit.

The existing thirty-four-case native Engine suite and local HTTP suite pass
with this explicit backend and both sealed caches. The single integration run
observes 367 ms from cancellation to old-worker exit and 1,973 ms from cancel
to recovered readiness. That misses the 100-ms target and confirms the already
open kill/reload lifecycle issue; it is not a repeated before/after regression
measurement. No cancellation improvement is claimed. All test workers and
HTTP processes are stopped. Browser and package rollout remain separate.

The application, scorecard, native/HTTP, and final proof/check receipts are in
r02-corner-first-v1/. The final sixteen toolchain checks and independent BendTT
verdict pass with the unchanged eighteen laws. This kernel check is not an
independent human or agent review. Review remains not run under the solo rule.

The default Nix package and flake checks also pass at main 0c793d2. The stored
receipt contains the cached confirmation, derivation logs, setup/native/HTTP
reports, installed-native identity, and seventy-one matching source hashes.
It verifies the new util-linux build dependency and default packaged app. It
does not install the optional corner engine or its large cache. One build job
and four cores are requested; no experiment-cgroup inheritance is claimed for
the Nix daemon. This is packaging evidence, not a performance result.
