# Cold pilot diagnostic

This experiment measures answer coverage and HTM lengths under a common cold
adapter deadline. It uses four pilot roots already observed in U05, not the
release holdout. The default Light binary remains unchanged. No policy selection
or general implementation-speed claim follows from this small diagnostic.

Freeze all sixty requests before execution. Each of five cohorts runs the same
four inputs through Rubend, bundled cubing min2phase and Nissy h48h0. Reverse the
solver order in odd cohorts. Each actor has CPU2, one search thread, a 2-GiB
command-tree ceiling and a 4,000-ms parent deadline. The same parent clock starts
before process creation. Cleanup has a separate bounded grace period.

Rubend uses its actual fast mode with the retained generated-table Light profile.
The bundled reference returns its first two-phase answer. Nissy uses explicit
zero slack and one answer, so its search contract differs. Nissy's coverage is a
diagnostic for that exact-search configuration, not a matched anytime policy.
Optimality, exact-work throughput and lower-bound strength are not assessed.

Every input comes from the existing uniform pilot corpus. Nissy's CLI needs a
reaching word. Invert an already sealed U05 solution outside the clock, then
replay it against the exact pilot facelets in Bend and the independent model.
The CLI converts that word to a cube before search. It does not receive the
solution as an incumbent or search hint. No new oracle search or random-walk
corpus is introduced. Rubend and cubing receive the same root as facelets.
Backend-specific input conversion remains inside the actor clock.

Startup includes the adapter, worker setup and normal small-profile initialization
or existing table loading. Digest checks and common validation occur beforehand
and warm file pages. This is not cold disk-cache time or native kernel time.
Do not derive per-backend CPU or memory figures from the aggregate queue receipt.

Keep raw output, candidate arrivals, late answers, timeouts, errors, unavailable
rows, stop events and closure records. Independently replay every retained path.
Recompute deadline eligibility rather than trusting a reported coverage flag.
Missing or duplicate slots and source/resource drift fail the assessment. Errors
and absent answers stay in the denominator. A late valid answer remains visible
but receives no deadline credit. Conditional first-answer times always retain
their coverage denominator. Print per-cohort counts and lengths before pooled
descriptive summaries. Do not turn five repeats of four roots into twenty
independent cube samples.

Two record designs were considered. Adding a measured bypass to the fixture
normalizer would weaken its existing guard. A separate cold-pilot assessor
consumes the actual lifecycle records and immutable source-bound freeze instead.
The fixture-only API and its negative controls stay unchanged. One writer owns
incremental records, so a failed queue preserves all completed requests.

The fixed queue is `u07-pilot-v1`. Expected duration is six minutes, capped at
fifteen. Controls run first, then the sixty serial requests, then unchanged proof
and toolchain checks. The pilot has no performance-acceptance gate. Lifecycle,
replay, source identity and complete accounting are executable gates. Any result
remains exploratory until larger frozen development and untouched confirmation.
Independent review is not run under the solo restriction.

## Observed result

The [canonical archive](u07-pilot-v1/index.json) verifies 2,501 source seals and
three resource receipts. All sixty planned requests are present. Every retained
path replays in Bend and the independent model. No actor error, unavailable
backend, forced stop, resource stop or surviving native/IPC owner occurred.
The 27 scorer corruption controls, fixture-only regression and unchanged proof
and toolchain gates pass.

Every cohort has the same deadline lengths in pilot-index order.

| Configuration | Answers by deadline | Lengths for pilot 0, 1, 2, 3 | Deadline-censored requests |
| --- | --- | --- | --- |
| Rubend Light fast | 20 of 20 | 19, 20, 20, 20 | 20 |
| Bundled min2phase | 20 of 20 | 21, 20, 20, 21 | 0 |
| Nissy h48h0, zero slack | 0 of 20 | No answer | 20 |

Rubend's parent-clock first-answer median is 308.04 ms, range 288.67 to 329.48 ms.
Bundled min2phase's is 320.78 ms, range 300.73 to 346.60 ms. These are descriptive
cold adapter times on four roots, each repeated five times. No tuning, limiter
profile, independent larger sample or speed-promotion control supports a winner.
Nissy's exact-search configuration is censored, not evidence of absent solutions
or an inferior anytime implementation.

Rubend retains valid answers through all twenty parent deadlines. A timeout here
means that the cold adapter stopped the still-running request at four seconds,
not that the request produced no answer. This pilot does not establish optimum
lengths, exact-work throughput, new strength gains or final acceptance. Do not
rerun these same four roots as fresh confirmation.
