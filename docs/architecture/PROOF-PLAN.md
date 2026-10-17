# Proof and trust plan

Original domain-obligation plan. Some obligations are now implemented; use
[PROOF-COVERAGE.md](PROOF-COVERAGE.md) for the exact current proof scope.
Do not infer completion of this entire plan from a successful proof check.

## Boundary

Keep the pure model, optimized transitions, projections, table mathematics,
search traversal, and replay contracts reachable from `PROOF.bend`. Keep file
access, process management, timing, rendering, and transport outside that
dependency graph. An executable can import the proven pure core and perform IO;
the proof entrypoint must not import the executable's effects.

The planned API returns an accepted candidate only with evidence that replay
from its validated input reaches solved. Erase proof fields at runtime where
supported. Runtime boundary checks are still necessary for arbitrary host
messages; a JS caller cannot be trusted to manufacture a valid Bend value.

## Obligations, in implementation order

| ID | Statement | Evidence required |
| --- | --- | --- |
| C01 | Accepted cubes contain each corner/edge once, legal orientations, and matching permutation parity | Validator correctness and valid-state constructor |
| C02 | Applying a face move preserves validity | Proof per generator, extended to powers/sequences |
| C03 | A move followed by its inverse restores any valid cube | Proof, plus independent facelet test |
| C04 | Four identical quarter-turns are identity | Proof for each face |
| C05 | Replay of concatenated sequences equals composed replay | Induction over sequence |
| C06 | Encoding then decoding preserves canonical legal states | Proof of inverse conversions; explicit error type |
| C07 | Optimized transitions agree with the specification model | Refinement proof and backend comparisons |
| T01 | Coordinate indexes are in range; rank/unrank are inverse on their domains | Bounded types or erased bound witnesses |
| T02 | Projected transitions correspond to full-cube moves | Commuting-diagram proof |
| T03 | Every pruning estimate is a lower bound | Projection plus distance-data validity |
| T04 | Compression never raises a bound above the established valid bound | Proof against uncompressed semantics |
| S01 | Every accepted candidate solves the original input | Proof-bearing result and independent replay |
| S02 | Best accepted length never increases for the same job | State transition proof/check |
| S03 | Canonical pruning preserves an equal-or-shorter representative of every path | Lemmas for each pruning rule |
| S04 | A completed depth search excludes all shorter solutions | Search completeness and admissibility |
| S05 | Timeouts, partial batches, and cancellation cannot claim exhausted work | Distinct incomplete/completed result constructors |
| U01 | Committed playback states equal canonical replay | Domain reducer proof where practical; UI E2E outside proof |

Input legality is more than nine stickers of each color. Reject a single flipped
edge, a single twisted corner, parity mismatch, duplicate cubies, incorrect
centers, bad length, and unsupported notation. Keep whole-cube view orientation
separate from the fixed-center search frame.

## Table validity is a proof obligation, not a hash

A SHA256 hash identifies bytes; it does not prove that those bytes contain
admissible distances. The generator's correctness and the exact loaded table
must be connected. Early exact search should use small tables whose distances
can be validated completely.

One sufficient certificate for an admissible undirected unit-cost table is:
the goal bound is zero, values are nonnegative, and every legal projected edge
satisfies `h(s) <= 1 + h(t)`. This establishes a lower bound along any path to a
goal, although it does not establish that the bound is the strongest possible.
For exact distances also check a decreasing successor for each non-goal and
goal uniqueness in the projected space. Validate symmetry mappings and all
required stabilizer alternatives, not one arbitrarily chosen representative.

For large/compressed tables, either prove the builder and serialization
relationship or validate an equivalent sufficient certificate. Sampling alone
does not justify a universal formal-optimality claim. Corrupted, mismatched,
unknown, or partially built tables are rejected, never treated as valid bounds.
The raw-data-to-proof bridge remains a substantial milestone risk.

## Honest result types and labels

- `Candidate`: replay not yet checked; cannot be shown as a solution.
- `VerifiedSolution`: replay reaches solved; upper bound is known.
- `SearchOptimal`: all shorter depths exhausted with validated admissible
  pruning; record algorithm/data revisions and search completion evidence.
- `FormallyCertifiedOptimal`: search-optimal plus the relevant formal
  completeness/admissibility/data obligations checked by BendTT.
- `Incomplete`: time/fuel/cancellation/resource limit; retain verified incumbent
  and the last fully established lower bound, if any.

Do not present a successful `PROOF.bend` as proof of the entire application. The
coverage report names the actual laws and dependencies. Finite oracle checks
are valuable evidence, not replacements for universal proof.

## Trusted computing base

The reviewed Bend documentation states that its translation to BendTT is not
proved. Parser/elaboration, code generation, runtimes, host code, binary loading,
hardware, and rendering remain trust boundaries even when the pure laws pass.
The independent kernel narrows this boundary; it does not remove it.

Run both the ordinary checker and `--verdict`, negative-proof fixtures, generated
JS/native differential checks, and an independent facelet oracle. Preserve the
emitted proof translation for significant domain proofs. Compiler upgrades
require rerunning the entire evidence suite with old/new revisions recorded.
