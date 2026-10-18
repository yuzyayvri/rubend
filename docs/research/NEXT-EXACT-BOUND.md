# Next exact-bound candidate

Current update. The all-eighteen-move byte table is built, audited, and integrated
in private profiles. Read [the result](../verification/R02-CORNER.md). The late
combined bound gives a specialized half-turn contour gain but ties inverse-three
on uniform cases. Its serialized application canaries pass with equal deadline
quality. The corner-first ordering also misses the uniform pilot's marginal
ten-percent gate on both uniform sets. It gives a stronger within-binary half-
turn diagnostic result, about 7.84 times as fast as inverse-three to the declared
target. Its application canaries and native/HTTP integration pass. Read the
[ordering result](../verification/R02-CORNER-FIRST.md).

The tested premise is that adding this lazy corner information saves at least
ten percent over the existing three-axis inverse bound on uniform positions.
Two short-circuit placements fail that pilot gate. The late variant removes
only about six to seven percent of work after inverse pruning on the two uniform
sets, while total CPU time ties. The rerunnable four-policy contour comparison
and nine-reject summarizer test that premise directly, rather than inferring
strength from the table's average distance. Do not try a third placement-only
fix. A cheaper incremental coordinate or a more informative projection needs
its own new hypothesis, cost/ownership evidence, and frozen comparison.

Keep the specialized result opt-in and leave the default unchanged. Continue
the approved independent R03 memory/kernel pilots or R04 projection work after
closing the current ordering experiment. No larger generation run, new theorem,
or general speed claim is authorized by this research note.

## Original proposal

The following text records the pre-implementation decision. Its pending status
does not override the current result above.

Status is a research proposal only. No new table, heuristic, or law is
implemented or accepted by this note. The warm results show matching quality
and overlapping rate ranges. Hard exact cases remain unfinished, so more
useful pruning is a better next question than another unmeasured loop tweak.

Investigate a full corner-permutation and corner-orientation pattern database.
The existing coordinates have 40,320 permutations and 2,187 twists, giving
88,179,840 projected states. Start with byte distances and audit the actual range
before selecting any narrower encoding. The byte form is 22,044,960 U32 words.

The current prefix and raw joint payload occupy 285,525,248 words. Adding that
byte table gives 307,570,208 words, below the existing 536,870,912-word capacity.
It could therefore fit in the current two-GiB array without increasing its
power-of-two allocation tier. This is storage arithmetic, not an RSS, generation-
time, admissibility, or speed result.

Keep the audited joint file immutable. Generate a separate corner-cache file
and load it into the unused region. Both layouts would have the same array
capacity, so do not infer bound availability from `Array.size`. The initializer
must make the available data and goal semantics explicit.

A distance to solved corners is not a lower bound on reaching the phase-one
subgroup. Restrict any initial trial to full-cube exact traversal. Keep goal
semantics explicit in interfaces and add subgroup counterexamples to tests.
Combine admissible overlapping estimates with max, not an unjustified sum.

Before implementation, trace the existing goal and coordinate invariants,
compare at least two design sketches, and check the proposed proof obligations
against the approved proof plan. Any new domain-law approval remains separate.
Run a small generator/transition pilot before selecting a full-table batch.
Then require independent move/refinement checks, table-edge and decreasing-path
audits, shallow optima, and the matched deadline-quality experiment. Do not move
the search or table mathematics into foreign code.
