# Frozen comparative results

The performance-promotion verdict is inconclusive. Rubend returns shorter
solutions on the broad population, but has lower answer coverage than the two
first-returned competitors. This does not establish a whole-solver speedup,
universal solver ranking or the roadmap's 10x to 100x target. The default stays
unchanged. Application evidence and the [final source/history audit](u07-final-acceptance-v1/index.json)
are verified. The [checked handoff](../FINAL-HANDOFF.md) records closure of the
scheduled workflow without claiming these unmet targets passed.

The [canonical analysis](u07-final-report-v1/index.json) verifies 5,136 source
and input seals and one resource receipt, with the worker gone and no stop.
All 57,678 planned attempts across 23 measurement groups remain accounted for.
All answers are independently replayed again through Bend and integer geometry.
The optimality audit checks 1,061 recorded claims against 10,180 input states
and finds no disagreement. This is empirical consistency, not a formal proof
of optimized search completeness or optimality.

The [complete numerical tables](COMPARATIVE-TABLES.md) and
[raw report JSON](u07-final-report-v1/3-report.json.gz) contain every configuration,
clock, distribution, cohort, interval, provenance record and canonical batch
index. The raw JSON SHA256 is
`f6bf5cfa438874fd1273f37994582699c474dd5c41327d76c9afc21dc53d871a`.
The tables use the frozen renderer's values. Only the metadata-digest label and
raw-JSON link are clarified after generation. No analysis rule changes.

## Broad quality population

These are warm one-second requests on all 10,000 release inputs. Four CPU lanes
share four GiB, and the five actors for one input use the same lane. These
shared runs establish quality and coverage, not isolated latency or per-actor
CPU rankings. HTM counts every quarter-turn or half-turn as one move.

| Pinned configuration | Answers by deadline | Best HTM median | Best HTM mean | Best HTM p95 | Adapter errors |
| --- | ---: | ---: | ---: | ---: | ---: |
| Rubend default | 9,962/10,000 | 19 | 19.393 | 21 | 35 |
| cubing min2phase | 10,000/10,000 | 21 | 20.559 | 21 | 0 |
| Muodov C | 10,000/10,000 | 21 | 20.761 | 22 | 0 |
| Nissy H48h0 | 13/10,000 | 15 | 14.846 | 15 | 0 |
| vcube108 | 202/10,000 | 16 | 15.871 | 16 | 0 |

Length statistics are conditional on receiving an eligible answer. In particular,
the exact-return configurations' short solutions cover only a small subset.
Their conditional lengths cannot be ranked against the other configurations as
if they answered every input. Release-case optima are unknown here, so their
optimality gaps remain null.

Rubend's contract retains improvements after its first answer. The two
first-returned competitors stop at their returned solution. Rubend's median
time to its best eligible broad-population answer is 130.327 ms, with p95
791.395 ms. The corresponding first-returned times are 13.310/68.680 ms for
cubing min2phase and 16.884/65.140 ms for Muodov C. These shared-lane observations
are descriptive, not an isolated speed comparison.

## Isolated repeated timing

Thirty-two case IDs are fixed before reading their facelets. Each configuration
has five alternating cohorts, two repeats, and both process-cold and warm
one-second clocks. Each actor has a separate four-GiB CPU2 job, one search
thread, nice 10 and zero swap. The table below is conditional first-answer
latency, not time to shortest solution or completion of improvement search.

| Configuration | Cold answers/320 | Cold p50 ms | Warm answers/320 | Warm p50/p95 ms |
| --- | ---: | ---: | ---: | ---: |
| Rubend default | 320 | 311.346 | 317 | 17.785/55.989 |
| cubing min2phase | 320 | 337.035 | 320 | 11.226/58.214 |
| Muodov C | 320 | 23.327 | 320 | 15.429/40.706 |
| Preserved Rubend small | 320 | 397.458 | 314 | 13.512/42.998 |
| Preserved Rubend inverse | 0 | n/a | 316 | 8.615/22.075 |
| Preserved Rubend H0 | 0 | n/a | 320 | 8.223/23.000 |

The preserved profiles are controls, not additional solvers or new defaults.
The inverse and H0 cold requests all exhaust the one-second budget before
readiness. Their warm initialization medians are 1,891.290 and 1,924.333 ms.
Warm speed alone does not repay their initialization and memory costs.

The general performance gate fails. Recorded reasons include duplicate
variation above five percent, coverage drift and adapter failures, no completed
answer work in some exact-return strata, and CPU repeat windows below the
predeclared one-second floor for fast competitors. No favorable reruns occur.
Rubend warm first-answer cohort medians range from 17.029 to 18.313 ms. Cubing
min2phase ranges from 10.211 to 13.111 ms, and Muodov C from 14.493 to 17.767 ms.

The predeclared budget-capped first-arrival difference for Rubend minus cubing
min2phase is +18.889 ms warm, with a conditional case-bootstrap interval of
[6.887, 31.924] ms. Cold is -24.469 ms, interval [-35.221, -14.250] ms.
All missing answers contribute the full budget to this score. These intervals
keep an input's repeats and cohorts together and describe case-mix uncertainty
conditional on the observed cohorts. They do not override the failed promotion
gate, compare equal optimality work or prove a whole-solver speedup.

## Exact contracts and structured cases

Nissy and vcube use optimal-return-only contracts. In the broad population,
Nissy completes 13 and vcube108 completes 202 of 10,000 requests. The remaining
9,987 and 9,798 are right-censored at one second. These are upstream-reported
exact completions with independently replayed answers, not formal certificates.

On the 32 fixed ten-second cases, Rubend default, cubing min2phase and Muodov C
each answer all 32. Their median best lengths are 19, 21 and 21 HTM. Nissy
answers none and vcube108 answers five, with median length 17 HTM on those five.
The same Rubend binary's exact-request contract answers all 32, but establishes
optimality for none within ten seconds. Its first answers are not exact-search
completion times. All 32 exact requests are right-censored for that metric.

The structural population has 181 entries, including 171 entries with justified
optima. Entries include related rotations and are not 181 independent random
states. Rubend default and exact-request, cubing min2phase, Nissy and vcube108
all return zero-gap answers on those 171 known-optimum entries. Muodov's gap
has median zero and maximum thirteen HTM. The raw report preserves each count.
Rubend exact-request records 175 search-established events across all 181
entries, versus one incidental event in the fast/improvement contract. Neither
count is a proof of universal optimized-search correctness.

## CPU, initialization and memory

Whole-request CPU includes the driver and relevant descendants, including exited
children. Warm readiness is separate. Median warm CPU per 32-case repeat is
31,509.746 ms for Rubend default, 525.994 ms for cubing min2phase and 549.891 ms
for Muodov C. Rubend usually continues improvement search toward the deadline
after answering. These different contracts do not represent equal completed
search work or a native-kernel efficiency ratio.

| Configuration | Warm initialization median ms | Charged whole-job peak median MiB | Idle ready PSS median MiB | Sampled aggregate RSS peak median MiB |
| --- | ---: | ---: | ---: | ---: |
| Rubend default | 283.121 | 171.926 | 62.687 | 121.066 |
| cubing min2phase | 289.553 | 159.793 | 68.813 | 122.223 |
| Muodov C | 8.805 | 102.965 | 4.772 | 15.215 |
| Nissy H48h0 | 22.104 | 143.703 | 30.926 | 71.789 |
| vcube104 | 49.941 | 167.582 | 35.361 | 100.570 |
| vcube108 | 180.342 | 460.113 | 326.286 | 682.406 |
| Preserved Rubend small | 377.016 | 143.820 | 34.720 | 92.891 |
| Preserved Rubend inverse | 1,891.290 | 2,223.223 | 2,111.873 | 2,169.168 |
| Preserved Rubend H0 | 1,924.333 | 2,223.754 | 2,111.917 | 2,169.051 |
| Rubend default exact-request | 285.764 | 172.410 | 62.738 | 120.633 |

The charged peak includes the entire actor job and its driver. PSS is an idle
snapshot, not a peak. The last column is the median of five observed job maxima,
derived from the existing raw samples after frozen analysis. Summed RSS can
count shared table pages repeatedly, as vcube's forked requests illustrate.
Sampling targets 50 ms, but observed gaps reach 262.244 ms and some transient
process reads are unavailable. It is not unique physical memory or a complete
transient peak. The [derivation resource receipt](u07-final-report-v1/rss-summary-resource.json.gz)
retains its exact executable command. All fifty timing actor jobs are included.

## Scope and reproducibility

The [freeze](FINAL-EVALUATION.md) pins Rubend, four external solver families and
ten configurations before any release solve. The tables list exact upstream
revisions and licenses. These are bounded local configurations with the recorded
tables and service adapters, not each upstream's largest advertised database or
best published hardware setup. External code is never the Rubend backend.

All 49 [adapter cancellation failures](../../../issues/frozen-comparison-late-cancel-ack.md)
remain in denominators. Thirty-five affect broad quality and fourteen affect
timing. They fail closed on stale request identity rather than accepting a
wrong-request answer. No source repair, post-holdout tuning or replacement
attempt changes this campaign. The report measures these pinned solver-plus-
adapter contracts, not a hypothetical error-free native-only experiment.

The [handoff gaps](../../../issues/final-evaluation-handoff-gap.md) affect
campaign completion time, not measured request budgets. The one-minute schedule
does not guarantee that a continuation actually runs each minute. No cause for
those gaps is established.

To reproduce the frozen numerical analysis on the retained local artifacts,
use the report command in [FINAL-EVALUATION.md](FINAL-EVALUATION.md). The
canonical index archives its exact plan, resource command, report and hashes.
The corpus, metadata, raw parent-timestamped candidates, per-slot ledgers and
all 23 compressed batch archives are retained. Reproduction of analysis requires
no solver rerun. Do not overwrite the original output directory.

Independent review is not run under the solo restriction. Operator review,
merge, push, release and deployment are not authorized by these results.
The final source/history audit and checked local handoff are saved. Operator
review and any later publication decision remain separate.
