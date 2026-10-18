# All-move corner database

The full byte database is generated and completely audited. The isolated
late-corner backend has a finite diagnostic win, but no general speed or solution
quality gain is established. The default engine remains unchanged.
No independent review runs under the user's no-subagents instruction.

The pure Bend builder uses all eighteen HTM face moves. It does not reuse the
ten-move phase-two corner transitions. Its 40,320 permutations and 2,187 twists
give 88,179,840 states. Generation reaches every state. The audit checks all
1,587,237,120 directed edges, the unique zero goal, both distance inequalities,
and a decreasing successor for each non-goal. Unknown or incomplete data fails.

The observed maximum is eleven. The exact distance sum is 772,819,906, giving
mean 8.764133684. These agree with the range and rounded mean reported in
[Korf's primary paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf). They do not
predict gains in Rubend's existing biased search tree. The cache remains byte-
encoded as planned. A later nibble codec requires its own measured decision.

## Independent evidence

An independent cubing@0.66.0 KPuzzle checker matches all 725,760 permutation
transitions and 39,366 twist transitions from a native-generated file. It also
checks 18,000 joint projection moves on arbitrary legal cubes. A separate JS
BFS agrees with all 40,320 permutation distances. The smaller projection's
maximum is seven, not the full database's eleven.

Independent facelet BFS enumerates all 46,741 full-cube states through depth
four. Their 31,136 distinct corner projections have exactly matching shortest
corner distances. No corner estimate exceeds a known full-cube optimum.
Four thousand finite inverse/frame checks pass. U has corner bound one while
already inside the reduction subgroup. Superflip's corner bound is zero.
These support FullCube-only integration and avoiding redundant frame estimates.

Seven table mutations reject unknown/incorrect goals, spurious zeros, bad
edge values, missing decreasing paths, out-of-range neighbors, and incomplete
counts. Four builder guards and partial-audit rejection pass. CI repeats the
small projection and native independent oracle without building the large table.

The complete development regression and sixteen toolchain checks pass. The
pure builder/auditor is imported by PROOF.bend and passes independent BendTT.
The eighteen existing laws are unchanged. This does not close universal model
projection, loaded-data, or traversal-completeness proofs. IO is outside the
pure graph. No unsafe def, foreign solver, or new foreign effect is used.

## Resources and output identity

A bounded prefix probe expands one million states in 1,136 ms after initialization,
visits 5,508,269, and remains explicitly incomplete. It peaks at 664,872 KiB
sampled aggregate RSS. The admission estimates about 100 seconds for generation
and allows about 461 seconds for build/audit/save, with an enforced 1,800-second
wall cap. The estimate is not a guarantee.

The complete run takes 69.082 seconds, including 59.768 seconds of generation
and 8.777 seconds of audit. Its sampled aggregate RSS peak is 669,496 KiB.
The limit is 1,536 MiB on CPU 2, nice 10, no swap, with current desktop headroom
checked. Only one native CPU thread is used. No GPU or cloud work occurs.

The little-endian move file has 765,126 words, or 3,060,504 bytes. The distance
file has 22,044,960 words, or 88,179,840 bytes. Both are read-only ignored local
artifacts. They are not committed. Their saved identities are:

- Moves SHA256 c35322a3747b001df13e58d387f412a2af7e197f087a1af7f0c3b7d8ea305d19.
- Distances SHA256 a8f48d1e8dcc87e9d235da7753d5d3f9d8254191f77d32c3097533a7b5ed53ce.
- Distance-word fingerprint 3472661170 with seed 2166136261 under the existing
  U32 multiply/xor-word/xor-index scheme. This fingerprint is not cryptographic.

The files are build/evidence/r02-corner-full-moves-v1.raw and
build/evidence/r02-corner-full-bytes-v1.raw in the managed writer checkout.
The cache metadata, full histogram, source/binary hashes, resource receipts,
and raw logs are archived under r02-corner-v1/. The earlier uppercase boolean
report was corrected before final runs; incomplete probes are never counted
as a complete table or search result.

## Search integration

The private search, portfolio, runtime, and direct-contour entrypoint compile.
Forward, inverse-three, corner, and combined profiles are selected explicitly.
All four load the same joint and corner payloads into one two-GiB array. The
default search and runtime files remain unchanged. A checked generator records
the permitted differences and rejects five stale or mismatched source fixtures.

Synthetic checks pass for supported geometry, unsupported profiles, reduction
and subgroup bypass, full-cube cutoffs, reuse of the supplied child, solved
index, and all four byte lanes. The native runtime rejects an unknown policy,
a missing corner file, short and trailing files, and a same-length one-byte
mutation. Both sealed source caches remain unchanged. The complete development
regression, sixteen toolchain checks, and separate BendTT verdict pass. The pure
private search and portfolio are in the proof graph; IO is not. No law changes.
Raw integration/build/loader receipts are archived under r02-corner-v1/.

The extended contour runner preserves the original inverse-only protocol and
adds explicit four-policy corner ablations. Its fixtures reject six malformed
corner configurations and unknown policies. Sixteen deterministic half-turn
positions are frozen separately before timing. They are a diagnostic subgroup,
not a uniform strength corpus or known-optimum set. Loaded-backend shallow and
contour checks and the late backend's application canaries are complete below.

The application comparison runner now seals declared additional caches before
and after use, validates exact lengths and SHA256 identities, and rejects
unregistered cache environment variables. A positive auxiliary-cache fixture,
six preflight rejects, and a mutation fixture pass alongside the existing worker
and cleanup tests. The four-policy contour summarizer has nine rejecting
fixtures and preserves censored jobs. It uses ratios of cohort totals so very
short individual requests cannot create zero-CPU divisions. Each policy's cohort
must still total at least 100 ms of process CPU time.

All sixteen frozen half-turn states replay through the independent facelet
model. Reads from the actual raw joint cache show zero for all three forward
and three inverse estimates on every root. An independent corner rank agrees
with the Bend-generated rank and reads a positive distance for each. This
confirms the diagnostic's intended blind spot, not its timing result.

## Late-corner timing

Five fresh cohorts compare forward, inverse-three, corner, and combined policies
on each declared set. Each worker passes all 163 known shallow optima before
timing. All 9,780 warmups and 960 measured requests execute without error or forced
cleanup. All 640 uniform targets complete. The release holdout stays unopened.

The primary ratio is the geometric mean of five ratios of cohort CPU totals,
each using all sixteen declared cases. The interval resamples the five cohorts,
not the population of possible cubes. It differs from the earlier inverse report's
geometric per-case statistic, so compare the policies inside this result.

| Set and target | Candidate over control | CPU ratio | Five-cohort 95% interval | Ten-percent gate |
| --- | --- | --- | --- | --- |
| Pilot, lower fifteen | Corner over forward | 0.9183 | 0.9133 to 0.9232 | Fails |
| Development, lower fifteen | Corner over forward | 0.8779 | 0.8431 to 0.9161 | Fails |
| Pilot, lower fifteen | Combined over inverse-three | 1.0014 | 0.9855 to 1.0196 | Fails |
| Development, lower fifteen | Combined over inverse-three | 0.9946 | 0.9812 to 1.0147 | Fails |
| Half-turn diagnostic, lower ten or optimum | Combined over inverse-three | 0.1909 | 0.1887 to 0.1933 | Passes |

Uniform corner pruning does not meet the declared ten-percent threshold. Adding
the late corner check to inverse-three gives no measurable uniform speed gain.
Combined beats forward on those sets, but inverse-three already supplies that
gain. Do not attribute it to the corner addition or promote the default engine.

On the separate half-turn diagnostic, both inverse-three and combined complete
all eighty repeated targets. Combined uses about 80.9% less CPU time, about 5.24
times as fast for this finite direct-contour task. Its cohort ratios range from
0.1880 to 0.1947. The combined work-step total is 12.26% of inverse-three's,
so added work per surviving step limits the time gain. This does not establish
a general fivefold solver improvement. Eight cases per cohort are solved below
depth ten; the others reach lower bound ten, excluding contours zero through
nine rather than exhausting depth ten.

Forward-only completes only thirty-five of eighty diagnostic requests. Forty-
five hit twenty-million-step fuel, and every censored record stays present.
No completed-all-case time ratio against forward is claimed on that stratum.
Every complete policy agrees on the established bound and any optimum, and
deterministic final states agree across all five cohorts.

The timed pure loop advances the real search without IO. Native wall totals
are about 1.01 to 1.05 times process CPU totals across these policies and sets.
This is a CPU-bound traversal result, not startup, disk, or work-step throughput.
All policies load identical data in the same binary; fewer steps reflect actual
cuts rather than different request budgets or missing work. State-machine steps
are not expanded-node counts. No profiler or diagnostic observer time is reported.

The sequential batch takes 538.746 seconds and peaks at 2,324,684 KiB aggregate
RSS. It uses one native thread on CPU 2, nice 10, a 4,096-MiB ceiling, no swap,
an eight-GiB desktop reserve, and a 1,800-second wall cap. These are warm-file
measurements. Startup and two-GiB table allocation are separate costs.

Reproduce the raw report summaries with bench/summarize-corner-contours.mjs.
The raw pilot, three confirmations, version-two adjudications, and resource
receipt are archived under r02-corner-v1/. Version two adds deterministic-state
and cross-policy completion checks without changing the measured inputs or
ratios. The first four-case pilot is not counted as a confirmation cohort.
One separately generated corner-first ordering experiment remains in progress.
No incremental frame field or default switch is accepted.

## Application canaries

A fresh serialized five-pair run compares the frozen inverse-three release with
the late combined application backend. All 1,750 jobs pass with zero errors,
missing deadline answers, forced cleanup, or input-seal changes. This includes
1,630 shallow optima and 120 measured jobs. All sixty deadline solution-length
pairs tie, with no coverage or completed-lower-bound loss. The coverage-first
scorecard independently reproduces those ties from the complete event records.

Both profiles average 19.375 moves on eight pilot fast cases, nineteen on three
exact canaries, and twenty-one on Superflip. Exact intervals end at lower fifteen
and Superflip at lower sixteen for both profiles. The difficult jobs remain
incomplete. First-answer p95 is twelve milliseconds for forty fast samples per
side, twenty-two for fifteen exact samples, and 1,545 versus 1,507 for five
Superflip samples. These are small canaries, not a population latency guarantee.

Warm-file initialization medians are 1,756.7 versus 1,773.9 milliseconds over
five fresh workers. Their ranges are 1,705.7 to 1,758.3 and 1,748.3 to 1,823.8.
Sampled native peak RSS is 2,142,152 versus 2,142,188 KiB, excluding the host and
browser. Both still allocate the two-GiB raw tier. No memory or initialization
improvement is claimed. The batch takes 221.883 seconds and peaks at 4,411,200
KiB aggregate RSS under its 6,144-MiB limit, CPU 2, nice 10, no swap, and
900-second wall cap. Both native workers may reside concurrently; work alternates.

The first attempt is invalidated because a concurrent build rewrote generated
model modules. Their contents stayed equal but their filesystem seals changed.
The new checkout lease prevents competing builds and bounded experiments from
writing during a measurement. Its real-entrypoint and failure-release tests
pass. Read [the closed incident](../issues/artifact-build-overlap.md). Never use
the invalidated run's timings or quality counts as accepted evidence.

The version-two report, resource receipt, and scorecard are archived under
r02-corner-v1/. Reproduce the scorecard with bench/score-warm.mjs --report on
the complete warm report. That mode does not claim to validate resource limits;
inspect the separate actual run receipt. Its four rejecting fixtures and the
legacy resource-record mode agree. No hidden GUI or package rollout for the
corner profile is claimed yet, and independent review remains not run.
