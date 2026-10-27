# Baseline task-order observability

U04 starts with a native diagnostic of the existing round-robin portfolio.
The earlier short-first and exact-reserve policies remain rejected. No task
ordering, work quantum, incumbent restart or exact-progress rule changes here.

The fixed worker uses RawInverseThree on the first four pilot corpus roots and
public Superflip, with fast and exact requests. It saves thirty-two advance
snapshots per request plus the initial state. Every candidate is replayed by
the independent sticker model. No release corpus is opened.

The analysis identifies which task consumed each quantum and reconciles its
local node increment with the session increment. It records contour-crossing
intervals, first-incumbent restarts and per-task observed work spans. Restarts
get separate epochs so unrelated visits cannot become one completed contour.

A snapshot can cross more than one contour. A span between observations is
therefore censored and is only an observed lower bound on work. It is not an
exact previous-contour cost or completed-failure certificate. The result must
say `exactPriorContourWorkMeasured:false`. Decide whether finer instrumentation
is needed before proposing a cost-based ordering key.

Full snapshots are instrumented output, not a latency benchmark. No policy
benefit or deadline-quality result is inferred. The existing raw cache is
hashed before and after, and the fresh native worker has source/build receipts.
An older fixed-work binary was not reused because its core source hashes drifted.

The diagnostic is the ordering job in the serial
`u03-native-feasibility-v1` queue. It shares no live measured run with compilation
or the U03 profiling job. Sorting, budget policies and new pruning remain off.

The [completed archive](../U03/u03-native-feasibility-v1/index.json) verifies
1,885 seals and all four receipts. The diagnostic passed 330 snapshots and
228 independent candidate replays across ten requests. All 6,960,000 work
steps reconcile. There are 115 coarse crossings and 79 positive observed
spans. None is relabeled as an exact completed-contour cost.

Next, add a source-isolated observer at the actual `Search.advance` boundary.
Retain events only when a contour, incumbent or terminal state changes. Require
every canonical snapshot to equal this saved round-robin baseline. Separate
incumbent-interrupted work from exhausted contours. Count search advance calls,
not tree-node visits. Keep task selection and quanta unchanged until the signal
is trustworthy.
