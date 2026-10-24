# Product lookup from existing node coordinates

The actual-trajectory screen finds complementary information, but its observer
reranks the packed cube. A phase-two node already carries the full corner and
EP8 permutation ranks. This private probe uses those existing values instead.
It does not replace frames or add new coordinates to them.

One owned 524,288-word array holds the audited product distances at index zero,
the 40,320-entry CP-to-corner-class map at 262,144, and the 40,320-entry
EP8-to-four-edge map at 327,680. The payload is 2 MiB. The two logical maps add
322,560 bytes. Bend generates the maps during initialization. It reuses the
previous product distances without regeneration.

The lookup reads both maps, constructs `edgeClass*140+cornerClass`, then reads
the distance. It performs no packed-cube ranking. Cache initialization checks
the exact array geometry before any map write. The owned state distinguishes
ready and refused arrays. Unsupported goals, out-of-range coordinates, invalid
map entries, and unknown distance values produce no bound. Only `Subgroup` is
admitted. This is not a FullCube or reduction inference rule.

This differs from the old isolated corner-mapper timing study. Both coordinate
inputs already exist in the actual phase-two frame, and the maps produce the
combined four-edge/corner-class product index. No result from that earlier
inconclusive study is promoted or rerun unchanged.

The fixed preflight checks all 80,640 map entries against independent permutation
ranking, combination ranking, and parity. It reuses all 15,609 saved actual
entries and requires identical product indexes and distances. A native checksum
consumes every map entry. Actual corner-map, edge-map, and goal-routing source
corruptions must have counterexamples. Size, range, unknown-data, and loaded
distance preservation checks cover the boundary. Both pure checkers, emitted
owned-array mode, and unchanged laws/toolchain gates remain required.

The queue is `u04-small-mapped-v1`, expected three minutes with a ten-minute cap.
Compile/proof jobs use at most 3 GiB and four low-priority lanes. The finite
oracle and native checksum run serially on CPU2 under 1 GiB. No timing, new
distance table, new domain law, pruning, production integration, release holdout,
publication, deployment, or independent review is included. All generated data
stays outside Git. Cost and full-search benefit remain unmeasured.

## Result

The [archive](u04-small-mapped-v1/index.json) verifies 2,601 seals and three
receipts. The worker is gone, and no resource stop occurred. All 80,640 map
entries agree with independent ranking. All 15,609 saved actual entries produce
the same product index and distance. The native checksum is 957,906,193.

All three actual source corruptions have counterexamples. Eighteen goal, range,
geometry, invalid-map, and unknown-distance refusals pass. Reinitialization
preserves every loaded distance. Both pure checkers, owned-array mode, and the
unchanged proof/toolchain gates pass. No frame layout or production code changes.

This establishes the private lookup's finite dataflow checks. Cost, actual
pruning/refinement, and whole-solver quality/latency remain open. The old isolated
corner-mapper timing remains inconclusive. No speedup or integration is accepted.
