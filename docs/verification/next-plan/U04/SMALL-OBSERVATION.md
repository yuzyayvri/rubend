# Small-product observation on unchanged search

The synthetic context screen finds extra information over existing phase-two
bounds. This unit asks whether that information appears on actual search
trajectories. It does not enable pruning or time a candidate algorithm.

Six standalone `Improve`/`Light` Search tasks use solved input, a commutator,
and the four previously used uniform pilot roots. Stop each task after the first
4,096 eligible entries, two million `Search.advance` calls, or non-running
status, whichever comes first. The stopping rule is fixed before observation.
These are bounded prefixes, not complete searches or portfolio visit estimates.

An eligible entry is a fresh subgroup node with positive residual depth, a
non-goal coordinate tuple, and path length below the current incumbent. Capture
the actual packed cube, existing coordinates and bounds, residual depth,
history, incumbent length, and product index/distance before the unchanged
advance. A hypothetical cut requires `productDistance > nodeResidual`, not
equality. No node is skipped. All captured points are retained and checked.

After observation, run the original unobserved Search for exactly the recorded
advance count. Compare its full continuation and metadata with the observer's
result. Replay every retained answer through both the Bend-generated model and
the independent facelet implementation. Distinguish a point-cap stop from a
work-cap or terminal stop. Unknown data, stale indexes, invalid cubes, and
unexplained early stops fail the check.

The previously audited product file and backend are reused unchanged. Normal
Light initialization constructs only the existing application tables. No new
product distances are generated. Actual wrong-index and double-advance source
variants and ten record corruptions must be detected. Both pure checkers check
the observer, and established proof/toolchain gates remain unchanged.

The queue is `u04-small-observe-v1`, expected three minutes with a ten-minute
cap. Compile/proof jobs use at most 3 GiB and four low-priority lanes.
Observation is serial on CPU2 under 1 GiB. Generated tables remain outside Git.
No timing, CPU-saving, solution-quality, pruning, universal admissibility,
release holdout, publication, deployment, or independent-review claim is made.

## Result

Canonical verification checks 2,569 seals and three receipts. The worker is gone,
and no resource stop occurred. The [archive](u04-small-observe-v1/index.json)
retains the complete point records and state comparisons.

All six observed/control continuations and metadata match at their exact work
counts. Every one of the 15,609 captured points passes cube, coordinate, existing
bound, product-index, distance, and residual checks. Eight retained candidates
replay through both models. Both actual source corruptions and all ten record
controls fail as expected. Both pure checkers and unchanged gates pass.

The product would exclude 6,828 captured entries. The commutator has 642 entries
and no extra exclusions. Pilot0–3 have 2,207, 831, 1,890, and 1,900 hypothetical
exclusions respectively. Pilot0,2,3 stop at the 4,096-point cap. The commutator
and pilot1 reach the two-million-advance cap. Solved input terminates normally
after 262 advances with no eligible points. The total observed work is 4,334,493
advances, with the same work repeated by controls.

These are overlapping unpruned subtrees, not 6,828 independent saved subtrees or
an estimate of runtime saved. No pruning occurred. A different traversal after
pruning would change which descendants are reached. The next cost question is
whether the current node's already maintained CP and EP8 coordinates can supply
the product index cheaply enough. This result does not reopen the old mapper
timing verdict or authorize unchecked pruning.
