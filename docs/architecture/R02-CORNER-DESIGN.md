# All-move corner bound

This continues the approved R02 pilot after the optional packed-small tier.
Do not change default search, cube rules, old coordinates, or sealed raw data.
The new pure builder/auditor and test/runtime entrypoints are a recorded boundary
expansion. No new domain law is added before its separate approval.

[Korf's primary paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf) uses all
eighteen face twists and a corner pattern database with 88,179,840 states.
It reports distances at most eleven and combines overlapping bounds by maximum.
Those are prior results, not observations of this Bend implementation. Start
with bytes and audit our actual range before considering nibbles.

The projection is corner permutation times corner twist, 40,320 times 2,187.
Its exact distance to solved corners lower-bounds full-cube solution length.
It does not lower-bound reaching the fixed-axis reduction subgroup. Test U,
which already belongs to that subgroup, and Superflip's solved corners.
Initial search integration is FullCube only, never reduction or subgroup work.

Two integration sketches are lazy ranking from the surviving child cube, and
an incremental corner-permutation field with all-eighteen-move transitions.
Select lazy ranking first to avoid changing Frame shape after R03's rejected
field experiment. Measure its cost and pruning before trying incremental state.
Keep normal/inverse joint and corner additions as separate treatments. Do not
count repeated corner estimates under rotation or inversion as new information.

The first complete pilot ignores twist and enumerates all 40,320 permutations.
Build permutation transitions with C.turn on move IDs zero through seventeen,
not Q.transition(Corners), whose graph has ten restricted moves. Twist's existing
all-move transition is independently checked. Corner permutation and orientation
actions must commute with independent full-cube replay before any engine trial.

The full builder uses byte distances and a checked queue. Its unpadded payload
is 88,179,840 bytes. A 2^25-word distance array allocates 128 MiB, the 2^27-word
queue 512 MiB, and all permutation/twist transitions fit a four-MiB array.
These are geometry estimates, not observed RSS. The 1,763,596,801-step complete
BFS fuel is below the U32 ceiling. Reject range, depth, count, or queue failure
before a wrapping read/write, and reject incomplete construction.

First time initialization, transitions, permutation BFS, and its full audit
separately. Then admit a bounded full-space prefix probe with honest incomplete
status. Only select a full build/audit after measuring headroom and the estimate
against the existing thirty-minute batch cap. Begin within 1.5 GiB if inspection
permits. No partial table can become an engine input. Parallel audit, if used,
requires the full Bend shaders guide first and separately owned read copies.

Every projected edge must satisfy the distance inequality. Every non-goal needs
a decreasing successor, only the goal can have zero, and every state must be
visited. Use independent shallow corner oracles and full-cube move/refinement
checks. A fingerprint identifies data but is not a proof of admissibility.
Preserve the raw joint cache. Future serialization/loader effects stay outside
the pure proof graph and reuse bounded byte/word IO, not a foreign solver.

Histograms and prior mean values do not predict search speed. Same completed-
depth timing, known optima, and deadline coverage/quality decide whether the
complementary bound pays. The release holdout remains unopened for tuning.

## Search boundary

The isolated caller selects one of four profiles before allocating tables.
Forward and inverse-three are same-binary controls. Corner adds the corner
estimate to forward axes; combined adds it after surviving inverse estimates.
Unknown policy text fails. Unsupported private geometries fail admission.
Array capacity alone never activates a bound. Each policy loads both audited
payloads to hold initialization and resident data constant for the ablation.

The existing raw array has 536,870,912 words. Its small prefix and joint payload
end at word 285,525,248. The 22,044,960 corner words end at 307,570,208, inside
the same array. The loader checks exact byte counts and recorded fingerprints.
It reuses bounded word IO and keeps effects outside PROOF.bend.

CornerBound.CubeBound brands the estimate as a full-cube bound. Its index is
corner permutation times 2,187 plus twist. The private search applies it only
after ordinary forward cuts and optional inverse cuts. It accepts a child when
the distance is below the parent's remaining depth, equivalent to the child's
remaining depth being at least the estimate. It reuses the existing child cube.
Reduction and subgroup frames bypass this estimate even for corner profiles.

The generator produces private search, portfolio, runtime, and contour modules.
It checks exact transformation patterns, output identities, and original input
hashes. It does not edit the default engine. The alternative incremental-frame
sketch stays deferred until lazy ranking has measured cost and pruning evidence.
This is a solo architecture pass under the no-subagents instruction. Independent
design and correctness review remain not run.

## Frozen contour measurement

The first four-position pilot passes all 652 shallow optima and sixteen depth-
fifteen targets. It is not the five-cohort acceptance result. Next compare all
four policies on sixteen pilot and sixteen disjoint development positions, to
lower bound fifteen. Run five fresh sequential workers per policy and stratum,
rotating policy order and reversing cases on alternate cohorts. The separate
sixteen-case half-turn diagnostic uses target ten, a bounded shallow contour
test rather than a claim of solving the entire half-turn group. These targets
and cases are selected before the confirmation runs. Keep the release holdout
closed. Preserve incomplete requests rather than dropping them from ratios.

Expected claim, if measured, is less CPU time to the same completed contour on
the declared finite stratum. Require a five-cohort upper confidence bound below
0.9 for a ten-percent gain over each relevant control. Same-binary forward and
inverse controls do not replace comparisons to frozen real application binaries.
Deadline quality, coverage, initialization, RSS, and default rollout stay separate.
