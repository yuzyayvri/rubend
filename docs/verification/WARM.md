# Matched warm-solve results

The five-round check found no measured quality loss on its frozen corpus and
budgets. It found no measurable warm search-rate improvement. This does not
change the separately accepted 80.36% raw-startup reduction.

Each round used a fresh baseline/candidate worker pair with the same raw table
and 163 shallow-optimum warmups per worker. Measurement then used 32 fast cases
at one second, three exact diagnoses at two seconds, and exact Superflip at five
seconds. Profile order alternated by case and round. Answers observed by the
requested host deadline remain separate from terminal answers.

All 1,990 jobs passed. That comprises 1,630 warmups and 360 measurement jobs.
All 180 paired deadline-quality results tied, with no errors, missing deadline
answers, changed inputs, forced shutdowns, or failed cleanup. All 32 fast cases
have five ties. Mean fast best length is 18.75 for both profiles; mean first
length is 20.40625. First-answer p95 is 27 ms for both across 160 fast jobs each.
These are finite development-corpus observations, not universal strength claims.

The three exact intervals match at [15,19], [15,18], and [15,20] in every round.
Superflip remains [16,21] in every round. None is marked optimal. This batch
does not establish world-class exact solving.

## Rate and limits

The native counter measures search state-machine steps, not expanded nodes.
Each rate is total group work divided by observed completion time in one round.
The table gives the median and range across the five rounds, in million work
steps per second.

| Group | Baseline median and range | Candidate median and range |
| --- | --- | --- |
| Fast | 20.191, 19.777 to 20.697 | 20.168, 19.920 to 21.199 |
| Exact diagnoses | 12.765, 12.481 to 12.931 | 12.861, 12.679 to 12.889 |
| Superflip | 17.933, 17.796 to 18.063 | 17.845, 17.744 to 18.111 |

All ranges overlap. The median deltas are about -0.11%, +0.75%, and -0.49%.
Do not promote the search refinements as a warm-speed win from these numbers.
Terminal overshoot stays recorded rather than extending the answer deadline.
The largest observed overshoot is below nine ms in these measured groups.

The batch took 493.634 seconds and peaked at 4,427,092 KiB aggregate process RSS.
The enforced ceiling was 6,144 MiB with no swap, one pinned low-priority CPU,
and 900 seconds. Five complete pair shutdowns prevented round overlap.
The file cache was warmed by SHA256 validation. Desktop activity was uncontrolled.

## Executable evidence and review

`warm-v1/comparison.json.gz` preserves the complete resource record and raw
measurement JSON, including trajectories, native terminal events, input seals,
worker identities, RSS samples, and shutdown records. `adjudication.json` records
its compressed and uncompressed SHA256 values, distributions, and case floors.
`bench/summarize-warm.mjs` reproduces the derived results. It deliberately rejects
deadline misses rather than applying an unspecified missing-answer mean policy.
The positive and negative checks are in `warm-v1/summarizer-check.json`.

The Sol reviewer approved the adapter after fixes for emergency-worker overlap
and configuration sealing. The Luna reviewer checked the complete result and
approved the narrow quality claim, while keeping warm performance promotion
closed. Sol then approved the summarizer's zero-miss guard and found zero
comments or suppressions. The reviewers did not run the heavy benchmark again.

Two separate instrumented first-hard-job CPU profiles disable startup sampling,
enable it after readiness, and stop before the first native done. Their hottest
sampled symbols contain the fused portfolio/search loops. Full traces, generated
source hashes, instrumentation scripts, and source maps are adjacent profile
artifacts. These are diagnostic profiles, not five-repeat warmed timings or
evidence for a rate improvement.

## Local development integration

The experimental raw backend also passed the existing 34-case native Engine
suite and local HTTP checks with a temporary environment override. Replay,
input/session protection, streamed solving, cancellation, and recovery passed.
The tests opened no browser and left no server running. The bounded batch took
25.535 seconds with peak process RSS 2,305,804 KiB under its six-GiB ceiling.
Cancellation until old-worker exit measured 336 ms and full worker recovery
1,944 ms in this one integration run. This is not the small-memory tier's
cancellation cost or a packaged-app comparison.

`dev-engine.json`, `dev-http.json`, and `dev-integration.json` preserve those
records. The Nix package and browser rendering were not rechecked by this batch.
The default application configuration is unchanged.
