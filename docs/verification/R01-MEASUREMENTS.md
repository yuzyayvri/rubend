# R01 measurements and diagnostic boundary

All implementation and checks are solo, per the user's instruction. No
independent review is claimed. No new speedup or world-class result is claimed.

## Preserve the experimental contract without a large cost

The full development regression passes after the explicit table profiles and
named goal/stage/completion refactor. Raw output is in
r01-v1/full-regression.json.gz. The run includes all 163 shallow optima,
independent model/refinement tests, native/HTTP behavior, loader fault tests,
startup fixture cleanup, and warm-protocol negative fixtures. Source/build
identities and resources remain in the archive.

An identical-binary five-cohort control completed 1,990 jobs without error.
Median work-step-rate offsets were 1.93%, 3.20%, and 2.08% for fast, exact,
and Superflip groups. One answer-length pair differed despite identical
binaries. This demonstrates why small deadline differences cannot prove a win.
Its raw archive is r01-v1/noise-control.json.gz.

The typed-contract deadline comparison also completed 1,990 jobs without error.
All 180 deadline-quality pairs tied. Mean fast best length is 18.7625 on both
sides. Fast first-answer p95 is 31 versus 32 ms. Exact first-answer p95 on
fifteen jobs is 25 versus 32 ms. That small-sample latency observation remains
visible and is not a claim of equal latency. Rate ranges overlap widely.
The marginal rate medians alone do not settle overhead.
Raw data is r01-v1/typed-warm.json.gz.

A second harness holds actual work fixed instead of extending a think-time
budget. It freezes before/typed sources, performs exactly 500 portfolio slices,
compares complete native semantic states, and records process CPU ticks,
native wall time, and host wall time separately. Five fresh worker pairs perform
1,630 shallow warmups and 110 measurement jobs. The measurements use eight
frozen pilot states and the three existing exact diagnoses. No holdout is used.
All worker cleanup and source/cache seals pass.

The typed/before geometric CPU-time ratios are 1.0073 for fast work and 1.0096
for exact work. Five-cohort percentile-bootstrap intervals are approximately
[0.9964, 1.0219] and [0.9966, 1.0266]. Both observed upper limits stay below the
predeclared 1.05 overhead ceiling. This is a finite overhead check, not a
universal bound. Individual pair ratios are much wider and remain in raw data.
The native clock covers the measured CPU work. Linux process-tick parsing is
checked against independent Node CPU-usage readings.

The fixed-work executable is a private benchmark program. Its ten-second host
request budget is a safety watchdog, not a solve deadline. Startup precedes the
timed region. Native milliseconds exclude output serialization. Process CPU
ticks include work through the observed done event and omit descheduling.
Possible asynchronous cleanup after done is outside that sample.
Never use this program as the application backend or score it as a deadline run.

Use bench/summarize-fixed-time.mjs with r01-v1/fixed-time-details.json.gz to
reproduce the derived overhead report. The resource receipt is separately
archived as r01-v1/fixed-time-resource.json.gz. Failed harness prototypes remain
in ignored build evidence. One compile caught a missing reusable parameter;
one preflight caught a missing root binding before any worker started. Both
were corrected before the successful measurement.

## Keep diagnostics out of release work

bench/search-observer.bend is a separate observational program. It copies only
Data frames and metadata, retains the sole owner of the pruning array, and
maintains nonwrapping counters in a different owned array. Its branch model
recomputes coordinates and reads estimates before actual Search.advance.
Attempt predictions check the actual child or unchanged parent coordinates.
A source-hash contract forces reconciliation when search/scheduling changes.

The counters distinguish work steps, frame expansions, considered moves,
canonical rejects, admitted children, cuts, phase-two launches, completed exact
contours, and logical probes. Logical probes are source-model counts, not
hardware memory events. Expansions mean non-goal frames opened with depth left,
not unique cube states. Counter conservation is checked at each snapshot.

The light trace matches all 98 release snapshots and 36 candidate records
across fourteen six-slice jobs. It accounts for 1,260,818 work steps and
77,058 expansions. Its early-canary work mix has 947,554 reduction steps and
313,264 subgroup steps. This is not a representative CPU-time fraction.
The raw trace matches 182 release snapshots and eighty candidate records
across fourteen twelve-slice jobs. Both traces and their identities are in
r01-v1/observer-light.json.gz and observer-raw.json.gz.
Twelve corrupt counter fixtures are rejected.

The observer's extra queries, recomputation, reference-counting, and counter
updates distort execution time. No release timing uses it. It supplies finite
attribution and semantic checks, not a universal theorem about counters or
search. Existing eighteen laws remain unchanged.

## Remaining gates

R01's implementation, finite semantic checks, development regression, quality
canary, and observed fixed-work overhead check are complete. Independent review
is not run under the solo-work instruction. The plan's separate hidden-browser
integration coverage and packaged rollout are not established by these CLI
checks. The exact first-answer p95 observation is not concealed as a timing win.
Formal table/data linkage and traversal completeness remain unfinished.
