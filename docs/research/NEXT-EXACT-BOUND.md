# Next exact-bound candidate

Current update. The all-eighteen-move full byte table is now built and audited.
Search integration remains pending. Read [the result](../verification/R02-CORNER.md).
The proposal below is retained as the original decision record.

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
