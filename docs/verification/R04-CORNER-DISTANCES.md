# Raw and reduced corner distances

The Bend reference builds distances for all 153,090 raw corner states and
all 3,393 classes. Their values agree at every raw state. The maximum is nine
and the sum over raw states is 984,482. The reduced goal class is twelve,
derived from raw goal twenty-three rather than assumed zero.

The native audit checks all 2,755,620 directed raw edges, known ranges, the
unique zero, both distance inequalities, every non-goal's decreasing successor,
and raw/class equality. An independent JavaScript geometry/BFS oracle agrees
on every distance and all 40,626 component transitions. Every physical payload
word, including unchanged class data and unused ranges, agrees.

Nine mutations reject a nonzero goal, unknown distance, raw/class disagreement,
edge overestimate, invalid transition, missing decreasing path, wrong array
sizes, and raw-only completion. The first nonzero-goal fixture reached a
decreasing-path failure before visiting the goal row. The audit now checks
goal zero first so the fixture exercises the intended certificate condition.
Compiler failures also remain in the raw records. None counts as a pass.

Targeted tests, just check, and standalone BendTT pass with the unchanged
twenty-three laws. A later combined full regression with the edge component
also passes. Its receipt is in [the edge evidence](R04-EDGES.md).
The pure builder and audit are in PROOF.bend. Finite exhaustive agreement is
not a universal projection or search-completeness theorem.

Run just h0-distances-test in nix develop. The
[archive index](r04-corner-distances-v1/index.json) binds the source and raw
checks to the ignored four-MiB payload. The payload is read-only. Edge
placements and full product generation remain open. No engine-profile speedup
or full H0 table is claimed. Independent review remains unrun under solo work.
