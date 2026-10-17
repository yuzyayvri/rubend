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
