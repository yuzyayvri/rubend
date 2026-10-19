# Rubend progress and performance

Rubend is a working local 3×3 solver and interactive workbench. Its strongest
verified progress is in correctness checks, explicit result bounds, table
validation, and lifecycle behavior. The optimization roadmap is not finished.
There is no supported world-class speed or fully certified optimality claim.

## Solving strength

For a cube solver, strength means solution length, response time, and how much
optimality it can establish, rather than an opponent rating. Rubend counts
half-turns as one move. It verifies answers by replay, keeps improving an
incumbent, and distinguishes unfinished search from an established optimum.

The native solver agrees with 163 shallow known optima. A separate breadth-first
oracle covers all 46,741 states through four moves for model and heuristic
checks; that is not a claim that every one was solved by a deep benchmark.

An earlier paired 32-state development sample averages 19.3125 moves for the
small backend and 18.75 for the larger joint-table backend after one second.
Both answer every case; the larger profile is shorter on thirteen and ties on
nineteen. This is a reused development corpus, not a fresh release population.
See [the original comparison](JOINT.md).

Current repeated canaries remain modest. Eight fast cases average 19.375 moves
after one second; three harder exact cases retain 19-, 18-, and 20-move answers
without establishing optima in two seconds. Superflip retains a 21-move answer
at five seconds, with an established lower bound commonly fifteen or sixteen.
Those intervals are useful progress, not completed optimal solves.

## Measured improvements and rejected ideas

| Work | Observed result | What it supports |
| --- | --- | --- |
| Three-axis inverse bounds | 36.6% less CPU on pilot and 37.8% on development at the declared completed-contour target | A real exact-search pilot improvement, not an all-cube speedup |
| Packed small tables | Native RSS 43,948 → 15,276 KiB in five pairs; startup median 221 → 313 ms | An optional low-memory tradeoff |
| Corner-first bound | CPU ratio 0.1275 on the half-turn diagnostic; no marginal uniform gain | A specialized result, not general acceleration |
| H0 symmetry profile | About 4.4% marginal direct-contour saving on development; all sixty application lengths and bounds tie | Audited research infrastructure, no default promotion |
| Segmented raw storage | 45.9% lower native RSS, but extra CPU and three lower-bound losses | Rejected promotion |
| Owned continuations | 20.04% more fast CPU and 11.83% more exact CPU; four lower-bound losses | Rejected promotion |
| Two scheduling pilots | 3,500 native jobs pass; each policy loses one lower-bound comparison | Rejected promotion |
| Persistent cancellation owner | Cancel-to-usable p95 16.03 ms; all fifteen owners retained | Lifecycle improvement only; deadline promotion remains rejected |

The [inverse](R02-INVERSE.md), [packed](R03-SMALL.md),
[corner-first](R02-CORNER-FIRST.md), [H0](R04-H0-REFERENCE-CONTOURS.md),
[segmented](R03-SEGMENTED.md), [owned](R03-OWNED-STACKS.md),
[scheduling](R05-SCHEDULING.md), and [lifecycle](R06-OWNED-CONTROL.md)
reports retain conditions and raw evidence. These rows use different workloads
and cannot be multiplied into one aggregate speedup. RAM figures exclude Node
and browser memory unless their source report explicitly says otherwise.

The standard backend uses roughly 43 MiB of native memory in its recorded
bounded checks. The packed option uses about 15 MiB. Large raw profiles occupy
about 2.04 GiB of native RSS and take roughly 1.7–1.9 seconds to initialize in
recent warm-file comparisons. They are separate experimental profiles, not the
default app. Cold-disk startup and total browser memory are not established by
those numbers. No current matched world-class reference benchmark is available.

## Roadmap position

| Phase | Completed work | Still open |
| --- | --- | --- |
| R01, measurement contracts | Frozen cases, coverage-first scoring, typed goals and completion states, counters, fixed-work comparisons | Final integration and independent review |
| R02, stronger bounds | Inverse pilots, complete corner data, goal guards, shallow oracles and application canaries | Broader rollout and deeper strength confirmation |
| R03, representation | Packed small tier; measured rejection of coordinate-only, segmented, and owned variants | Full rollout of any accepted optional tier |
| R04, symmetry-aware profiles | Forty-eight spatial actions, five added laws, complete H0 data and independent reproduction, contour and application comparisons | Six-edge fallback and remaining projection/scaling decisions |
| R05, scheduling | Two isolated serial policies built, checked, measured, and rejected | Ordering, premoves, complementary projections, fair partitions and separately admitted scaling |
| R06, lifecycle and integration | Persistent control, bounds reporting, six-profile native lifecycle/failure matrix, staged package checks, detached test queues | Remaining hidden GUI lanes, current Nix sandbox/relocation checks, final Pareto and proof report |

Independent review remains not run because work is explicitly solo. It is not
replaced by passing tests. No PR, merge, release, or deployment is implied.

## What makes the project interesting

The joint pruning graph has 2,217,093,120 states and an exhaustive audit of
39,907,676,160 directed edges. The H0 table has 117,567,450 entries, all matched
by a separately implemented BFS. These are projected state spaces, not an
enumeration of every physical cube position.

The logical joint cache is about 1.11 GB, but its power-of-two Bend array reserves
2 GiB. That gap explains the storage experiments. Reducing the allocation still
has to preserve latency and the strength of completed search bounds.

Inverse bounds reuse the same large table. Looking at the inverse can exclude
full-cube search branches that forward views miss, without another giant cache.
The goal matters: the same inference is unsafe for fixed-axis subgroup reduction.
The implementation tests that distinction rather than applying every bound
everywhere.

Representation wins are not automatic. Smaller segmented storage and fewer
persistent path objects pass semantic checks but lose on time or established
deadline bounds. The project keeps that negative evidence instead of treating
lower allocation or a smaller table as proof of a faster solver.

Twenty-three laws currently pass both the normal checker and BendTT. They cover
cube moves, replay certificates, symmetries, and selected pruning identities.
They do not certify the compiler, loaded-data bridge, full search completeness,
or the entire GUI. Read [the proof coverage](../architecture/PROOF-COVERAGE.md).

Long test batches now run locally without a model. The first profile/package
queue finishes in 4 minutes 19 seconds, and the scheduling queue in 9 minutes
56 seconds. Results, source seals, and failures persist until the next user
ping; there are no automatic AI wakeups.
