# All-move corner database

The full byte database is generated and completely audited. It is not yet
connected to search, and no solution-quality or search-speed gain is claimed.
No independent review runs under the user's no-subagents instruction.

The pure Bend builder uses all eighteen HTM face moves. It does not reuse the
ten-move phase-two corner transitions. Its 40,320 permutations and 2,187 twists
give 88,179,840 states. Generation reaches every state. The audit checks all
1,587,237,120 directed edges, the unique zero goal, both distance inequalities,
and a decreasing successor for each non-goal. Unknown or incomplete data fails.

The observed maximum is eleven. The exact distance sum is 772,819,906, giving
mean 8.764133684. These agree with the range and rounded mean reported in
[Korf's primary paper](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf). They do not
predict gains in Rubend's existing biased search tree. The cache remains byte-
encoded as planned. A later nibble codec requires its own measured decision.

## Independent evidence

An independent cubing@0.66.0 KPuzzle checker matches all 725,760 permutation
transitions and 39,366 twist transitions from a native-generated file. It also
checks 18,000 joint projection moves on arbitrary legal cubes. A separate JS
BFS agrees with all 40,320 permutation distances. The smaller projection's
maximum is seven, not the full database's eleven.

Independent facelet BFS enumerates all 46,741 full-cube states through depth
four. Their 31,136 distinct corner projections have exactly matching shortest
corner distances. No corner estimate exceeds a known full-cube optimum.
Four thousand finite inverse/frame checks pass. U has corner bound one while
already inside the reduction subgroup. Superflip's corner bound is zero.
These support FullCube-only integration and avoiding redundant frame estimates.

Seven table mutations reject unknown/incorrect goals, spurious zeros, bad
edge values, missing decreasing paths, out-of-range neighbors, and incomplete
counts. Four builder guards and partial-audit rejection pass. CI repeats the
small projection and native independent oracle without building the large table.

The complete development regression and sixteen toolchain checks pass. The
pure builder/auditor is imported by PROOF.bend and passes independent BendTT.
The eighteen existing laws are unchanged. This does not close universal model
projection, loaded-data, or traversal-completeness proofs. IO is outside the
pure graph. No unsafe def, foreign solver, or new foreign effect is used.

## Resources and output identity

A bounded prefix probe expands one million states in 1,136 ms after initialization,
visits 5,508,269, and remains explicitly incomplete. It peaks at 664,872 KiB
sampled aggregate RSS. The admission estimates about 100 seconds for generation
and allows about 461 seconds for build/audit/save, with an enforced 1,800-second
wall cap. The estimate is not a guarantee.

The complete run takes 69.082 seconds, including 59.768 seconds of generation
and 8.777 seconds of audit. Its sampled aggregate RSS peak is 669,496 KiB.
The limit is 1,536 MiB on CPU 2, nice 10, no swap, with current desktop headroom
checked. Only one native CPU thread is used. No GPU or cloud work occurs.

The little-endian move file has 765,126 words, or 3,060,504 bytes. The distance
file has 22,044,960 words, or 88,179,840 bytes. Both are read-only ignored local
artifacts. They are not committed. Their saved identities are:

- Moves SHA256 c35322a3747b001df13e58d387f412a2af7e197f087a1af7f0c3b7d8ea305d19.
- Distances SHA256 a8f48d1e8dcc87e9d235da7753d5d3f9d8254191f77d32c3097533a7b5ed53ce.
- Distance-word fingerprint 3472661170 with seed 2166136261 under the existing
  U32 multiply/xor-word/xor-index scheme. This fingerprint is not cryptographic.

The files are build/evidence/r02-corner-full-moves-v1.raw and
build/evidence/r02-corner-full-bytes-v1.raw in the managed writer checkout.
The cache metadata, full histogram, source/binary hashes, resource receipts,
and raw logs are archived under r02-corner-v1/. The earlier uppercase boolean
report was corrected before final runs; incomplete probes are never counted
as a complete table or search result.

## Next integration

Compare lazy corner ranking against the existing forward and inverse policies
before adding any incremental field. Keep default search code unchanged and use
an isolated, checked variant. Load the corner bytes into the raw array's unused
region only after exact size and identity checks. Select capabilities explicitly,
not from array capacity. Apply this bound only to FullCube frames and combine
it by maximum. Require wrong-goal, malformed-cache, shallow-optimum, completed-
contour, and deadline tests before accepting an engine treatment.

Include an explicit half-turn stratum. Every face half-turn belongs to each
axis reduction subgroup, so all forward/inverse joint reduction estimates can
be zero on unsolved states in that group. Corner permutation information can
address this blind spot. Verify that deduction on actual cases before using it
to explain a measured gain. Do not confuse larger heuristic values with less
time to the same completed contour.
