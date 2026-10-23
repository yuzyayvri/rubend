# Fast-only premove at native deadlines

The fixed-work refinement improves answer coverage on two development roots.
That does not establish a benefit at a wall-clock deadline. This separate probe
charges seed initialization, portfolio work, original-root certificate checking
and candidate output to the clock. It reuses the existing raw table and unchanged
one-in-eight seed allocation. Exact requests stay out of this probe.

## Measurement boundary

`deadline-bank-worker.bend` owns one table across sequential requests. It parses
and validates a root before starting the clock, like `src/main.bend`. Initialization
occurs after the clock starts. A typed `Active` or `Finished` state owns the table.
The loop checks native time after each unchanged work quantum. Decreasing fuel is
a hard failure backstop, never a successful censored result.

`H.emit_for` certifies each improved answer against the original sticker cube.
The next native timestamp records certificate/output availability. The host scores
only candidates available at or before the declared deadline. An answer found in
an overshooting quantum is replayed but excluded if its availability is late.
Sparse bound-change points preserve the same cutoff for lower bounds. Missing
answers remain coverage failures. Initial setup, output and clock checks count.

The alternative was a host timer that kills a fixed-work worker. Reject it because
it can lose a completed certificate and cannot timestamp native initialization or
availability precisely. Full stack snapshots per quantum also distort this test.
No product interface or production search module changes.

The pinned Base clock returns integer milliseconds from `io_tick`. Record its
source hash with the build. Do not treat sub-millisecond differences as evidence.
No OS cache dropping or desktop disruption. Table load, HTTP/GUI response time,
native CPU cost and per-arm peak memory are outside this measurement. Resource
receipts still enforce aggregate memory and desktop reserve.

## Frozen cases and decision

The specification is `bench/deadline-seed-spec.json`. Compare NoSeed with R at
100 and 1,000 ms. Use five alternating cohorts on development roots 520 through
527. These are disjoint from the fixed-work confirmation. Roots 512 and 518 are
separate known-gain diagnostics and cannot establish fresh confirmation. Run two
same-binary NoSeed copies for each confirmation root/deadline. Solved and one-turn
warmups check observed known-depth answers before measurements.

Require no paired answer-coverage, length or deadline-bound loss. A strength
confirmation requires a gain on at least one fresh root/deadline in all five
cohorts, no paired loss, and stable A/A quality. First-answer p95 cannot regress
over five percent under a stable control. Report p95 only with complete coverage;
otherwise show missing counts and censored latency separately. A/A quality drift
or p95 spread above five percent makes the decision inconclusive. Never repeat
unchanged cohorts to get a favorable draw.

Every candidate replays independently. Fixtures must detect late answers, coverage
loss, a wrong original-root replay, incorrect bounds, missing events, counter drift
and a broken availability timestamp before the native experiment runs. Report work
counts and errors. Native deadline observations cannot establish a kernel speedup
without separate profiling, or application improvement without the real app path.
Integration, fresh application confirmation, independent review and promotion stay
open even if this probe passes. No holdout, database build or new law.

## Result

The [canonical archive](u04-deadline-v1/index.json) verifies 2,041 seals,
three receipts, worker termination and no resource stop. All 236 requests
complete without errors. Independent replay checks all 552 emitted candidates.
The counters reconcile 2,295,848,840 advance calls, including 122,600,000 seed
calls. These are work counters, not tree-node visits or a throughput claim.
The unchanged proof and toolchain checks pass.

Reject this policy under the frozen deadline quality floor. Fresh confirmation
has zero wins and four losses among 80 paired runs. Development 522 at one second
returns 19 HTM against the control's 17 in three cohorts. Development 521 at
100 ms returns 20 against 19 in one cohort. All other fresh pairs tie. Coverage
and lower bounds hold. The separate known-gain diagnostics all tie at these
deadlines. The earlier fixed-work coverage result remains valid in its own scope.

Same-binary A/A quality is stable, but first-answer p95 spreads are 7.69 percent
and 25 percent at the two budgets. The lower candidate p95 observations do not
establish a latency gain under those controls. No native CPU profile or actual
application latency comparison ran. No policy integration or default change.
Do not rerun unchanged cohorts to seek a favorable result. Continue U06's actual
rendering baseline separately, while U04 move ordering/projection remain open.
