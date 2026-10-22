# Proposed proof statements for the next implementation units

Yuzy separately approved NP01–NP03 on October 23 by replying "Yeah. Approved."
to the request naming those three statements. NP04–NP08 still await approval.
Approval permits proving the exact statements below, not assuming their data
premises or enabling unchecked pruning. No statement replaces or weakens any
of the existing 23 laws. NP01–NP03 are not yet implemented as Bend laws.
Supporting reference kernels are checked separately in
[the U02 proof record](../verification/next-plan/U02/PROOF-KERNEL.md).
They retain uninstantiated target, admissibility and inverse-bridge premises
and do not replace the exact statements below.

The statements below are the semantic contracts to approve. A concrete Bend
encoding must express the same quantifiers, premises, and conclusion. A material
change to a statement requires renewed approval. A theorem with an admissibility
premise does not establish that the currently loaded data satisfies that premise.

## Common definitions

Let G be the legal fixed-center 3x3 cube group under HTM. Let M be its eighteen
face moves, each of cost one. Concatenation acts on the right. A word w solves
g exactly when g*w=e. Let dist(g) be the minimum length of such a word.
For a subgroup H, dist_H(g) is the minimum length of a word taking g into H.
An H-bound h is admissible exactly when 0<=h(g)<=dist_H(g) for every legal g.
Projection and optimized cubie representations must be related to the existing
specification; naming an optimized value a Cube is not that refinement proof.

## NP01. Tight subgroup bounds exclude final moves

For every subgroup H, admissible H-bound h, legal g, positive integer r, and
word w of length r solving g, if h(g)>=r, the last move of w is not in H.

The positivity condition is mandatory. If the last move m belonged to H,
deleting it would give a word of length r-1 taking g into H, contradicting
admissibility. Apply this only with the actual proved target subgroup of the
bound, not an arbitrary collection of equal numeric estimates.

Implementation unit is U02. This is a final-move restriction, not directly a
next-move restriction.

## NP02. Complete final-move exclusion raises the full-cube lower bound

For every legal g and positive integer r, consider a nonempty finite family
of admissible subgroup bounds h_i with target subgroups H_i. If for each move
m in M there is an i such that h_i(g)>=r and m belongs to H_i, then
dist(g)>=r+1.

Some bound already excludes every solution shorter than r. NP01 excludes the
last move of every possible length-r solution. Every move must be covered.
The statement does not apply at r=0. A solved-state guard and exact child
residual-depth convention remain required runtime obligations.

Implementation unit is U02. Specializing this to three joint-table axes needs
the corresponding subgroup-membership, projection, and loaded-bound bridges.

## NP03. Inverse bounds can justify first-move exclusions

For every legal g, positive integer r, subgroup H, and admissible H-bound h,
if h(g^-1)>=r, no solution of g of length r starts with a move belonging to H.

If a solution w starts with m, the inverse word w^-1 solves g^-1 and ends with
m^-1. A subgroup contains a move exactly when it contains its inverse. NP01
then applies. Do not use a forward final-move mask as a first-move mask without
this inverse correspondence and a checked reconstruction convention.

Implementation unit is U02. This does not authorize transferring an H0-specific
half-turn rule to every pattern database.

## NP04. Saturating two-bit decode remains conservative

For every finite valid reference table h of nonnegative distances, base b,
valid index i, and fallback f_B for i's block B, assume f_B is nonnegative and
f_B<=min(h_j for j in B). Define q_i=0 when h_i<=b and otherwise
q_i=min(h_i-b,3). Define decoded_i=f_B when q_i=0 and decoded_i=b+q_i otherwise.
Then 0<=decoded_i<=h_i. If h is admissible, the decoded estimate is admissible.

Unknown/unbuilt sentinels and padding are not valid reference entries. The
concrete U32 implementation must prove index validity and b+3 has no overflow.
No claim of exact distance is made for a saturated or fallback entry.

Implementation unit is U03. Data validity and the file-to-table bridge remain
separate from the arithmetic theorem.

## NP05. A six-edge projection gives a full-cube lower bound

For either declared set of six distinct edge labels, let P project a legal cube
to the positions and orientations of those labels, with declared goal P(e).
For every legal cube g and move m, require P(g*m)=step(P(g),m). If d_P is the
shortest distance to P(e) using the projected eighteen cost-one transitions,
then d_P(P(g))<=dist(g) for every legal g.

The concrete codec must also satisfy rank/unrank identity on its valid domain
and range within 42,577,920 entries. The two label sets and their goal indexes
are explicit parameters. Combining these estimates with other overlapping
admissible bounds by maximum remains admissible; no sum is authorized.

Implementation unit is U03. This is not a bound on fixed-axis reduction unless
a separate target-specific theorem establishes it.

## NP06. Exact-context completed-failure reuse preserves permitted solutions

For every legal cube g, complete pruning context c, and nonnegative radius r,
CompletedFailure(g,c,r) means that no word permitted by c of length at most r
solves g. For any s<=r, skipping a visit with exactly the same g and c at
remaining radius s cannot discard a permitted solving word within that radius.

The initial context fixes the FullCube goal, profile/bound policy, contour epoch,
and move-pruning history. Initially exclude root symmetry masks and all
interrupted or incumbent-truncated subtrees. A completed-failure witness must
come from established exhaustion, not the existence of a cache entry.
Hash collisions require full-key comparison. Replacing or evicting an entry
cannot change the meaning of another completed-failure witness.

Implementation unit is U05. This preserves the base enumerator's permitted
paths; it does not prove that the base enumerator's pruning is complete.

## NP07. A fully certified partition ledger establishes contour exclusion

For every legal root g, nonnegative depth d, and immutable finite required
partition set J, assume coverage. Every solving word of length at most d has
an equal-or-shorter solving representative admitted by at least one j in J.
If every j certifies absence of an admitted solving word of total length at
most d, then dist(g)>=d+1.

Total length includes a partition's prefix. Solutions shorter than the frontier
depth must be checked separately or included in coverage. A pending, cancelled,
failed, duplicated, or omitted partition cannot supply an exhaustion witness.
Symmetry-based coverage needs the corresponding path transformation proof.

Implementation unit is U05. Taking the maximum of unfinished partition lower
bounds is not a permitted substitute for this statement.

## NP08. Incremental inverse maintenance uses a left action

For every legal cube g and move m, inverse(g*m)=inverse(m)*inverse(g).
An optimized dual-state step must refine this identity and its reconstruction
of solutions for the original root. Ordinary right-move coordinate transitions
must not be used as left-action transitions without that refinement.

Implementation unit is U02 only if profiling first justifies dual-state work.
Existing inverse root tasks are not a new implementation of this obligation.

## Approval and integration boundary

Approval permits implementing proofs of these exact statements, not assuming
their premises for real data. Keep IO, process management, timing, and rendering
outside the pure proof graph. Retain negative mutations and independent finite
checks alongside ordinary Bend and BendTT checking. Do not expose a formal
optimality label until actual optimized traversal and loaded data satisfy all
required completeness and admissibility bridges.
