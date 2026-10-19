# Bounded scheduling pilots

These are isolated solo experiments, not accepted policies. The default solver
and all twenty-three laws remain unchanged. No independent design review runs.

## Current flow

The runtime owns one persistent table and a Portfolio.Session. The portfolio
rotates up to six axis and inverse Improve tasks. A first incumbent restarts
their fast search under the existing deeper subgroup policy. Exact requests
then append a FullCube exclusion task. Improve slices receive 20,000 work steps;
exact slices receive 60,000. Search.run preserves incomplete continuations.
Only an exact task advances the established full-cube lower bound.

The pilots keep that task order, restart rule, incumbent mapping, and completion
logic. They change only each slice's work budget. Existing raw inverse-three
heuristics and the current File-owner lifecycle remain common.

## Caller and shape

The runtime calls the unchanged Portfolio.advance(Session) interface. Each
isolated portfolio derives its budget through this pure internal helper.

```text
slice_fuel(Request, Search.Stage, incumbentLength) -> U32
```

Reference keeps the current 20,000 and 60,000 budgets. Short-first gives Improve
tasks 5,000 steps while no incumbent exists, then restores the reference budgets.
Exact-reserve keeps fast and first-answer behavior at 20,000 steps. Once exact
search is active, it gives Improve tasks 10,000 and the exact task 120,000 steps.
Every budget is positive and bounded. Larger exact slices still require native
cancellation and deadline checks. There is no partitioning or completion ledger
change in these serial pilots.

## Alternatives and decision

Changing slice budgets preserves the existing queue ownership and task order.
A separate priority queue could reorder or starve tasks and would change more
than this first experiment needs. Keep it for a separately justified treatment.
Removing the first-incumbent restart is also not equivalent. That restart makes
previously restricted subgroup depths available. Neither pilot removes it.

The generator produces reference and both treatments from the same current
portfolio and runtime. Source hashes and exact rewrite anchors detect drift.
No search kernel is duplicated or replaced. A generated native fixture checks
fifteen budget cases before release binaries are measured.

## Evidence plan

Compile and check the pure portfolios through BendTT. Require unshared-array C,
native retained-owner cancellation, and the unchanged proof/toolchain gates.
Then run two separate five-cohort comparisons against the generated reference,
using CPU 2, nice 10, the same raw cache and frozen application cases. Measure
coverage, deadline lengths, established lower bounds, first-answer p95,
initialization, and native RSS. Independently replay every emitted candidate.
Any quality loss or more than five-percent first-answer p95 regression prevents
acceptance. Passing compilation or native jobs alone is not policy promotion.

Sequence Work into Verifiable Units closes the previous profile/package batch
before these pilots. Model the Domain reuses the existing Request and Stage
states rather than adding loosely coupled runtime flags. Long comparisons run
in the detached queue. The chat ends with an ETA and inspects results on the
next user ping. No model polls, new table builds, or automatic wakeups occur.
