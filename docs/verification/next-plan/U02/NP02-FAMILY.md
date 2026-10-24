# NP02 with a finite indexed family

This checked formulation implements approved NP02 over the same typed
reference group as NP01 and NP03. It proves every solving word has length at
least `r+1` when a nonempty finite family covers every final move at positive
radius `r`. That is the lower-bound form of `dist(g)>=r+1`, without computing
a minimum or assuming a particular shortest word.

## Family, coverage and root values

The family has `1+size` members. An index carries a natural value and a proof
that it is strictly below that count. The family is a pure function on those
finite indexes, not an unrestricted per-move bound generator.

Each bound package carries an actual subgroup, its globally admissible Nat
function, an evaluated value, and equality tying that value to the same root.
Coverage selects a valid family index for every one of the eighteen moves.
Its evidence proves both tightness of that selected value and membership of
the actual move in the selected subgroup. A stale or invented scalar cannot
replace the root-value equality.

`np02_excludes` handles the empty word separately. Coverage for U supplies one
positive bound, while subgroup identity and the empty reaching path force that
bound to be zero. U is not treated as the last move of an empty word. For a
nonempty word, the proved snoc decomposition selects its actual final move.
Typed prefix recovery and global admissibility contradict the shorter prefix.
Natural-number total order then converts exclusion through `r` into the numeric
lower bound for every solving word. Radius zero and empty families are absent
from the theorem's positive representations.

## A complete concrete family

The core theorem passes both focused checkers. A deterministic generator then
constructs eight oriented-corner stabilizers. Subgroup j consists of group
elements fixing corner j in its solved position and orientation. Product and
inverse closure are proved using the actual typed composition and inverse-root
identities. Each bound is zero in that subgroup and one otherwise. Its global
admissibility proof handles every reaching word and target-reaching path.

One stabilizer is checked first. Its exact source block is preserved when all
eight are generated. The complete family covers all eighteen moves for the
public `R U` root at radius one. Every selected bound is genuinely tight, and
every selected subgroup contains that move. A corollary gives a lower bound of
two for every solution. The actual `U' R'` solution supplies a nonvacuous closed
instance at length two. Both focused checkers accept the complete generated
family, including its subgroup, admissibility and coverage proofs.

## Fixed verification

The [completed queue](u02-np02-family-v1/index.json) verifies 2,615 source seals
and three resource receipts. The worker is gone with no resource stop. All
jobs pass, including the unchanged 23-law and toolchain gates. The run took
about 62 seconds within its twelve-minute cap.

Proof jobs use at most 3 GiB and four low-priority lanes. Finite checks run
serially on CPU2 under 1 GiB. Preserve translations of both generic forms and the
concrete instance. Repeated generation must have identical bytes.

Six actual bad sources fail through both checker entrypoints. They invent
a cached value, construct an empty-family index, choose a subgroup that misses
the move, add an unjustified extra lower-bound step, change a target selector,
or make its solved bound positive. All twelve rejections are the expected type
disagreement, not a parser or missing-source failure.

Backend checks cover 4,225 index cases, 4,225 order cases, 6,431 words and 51,448
bound values. Independent KPuzzle semantics checks all eighteen coverage choices.
Missing, duplicate and reassigned coverage records fail. An independent
one-move exclusion and a two-move replay check the public optimum-two instance.
The first stabilizer block is unchanged in the full family, and repeated
generation produces identical source bytes.

These reference laws do not instantiate the loaded joint tables or certify the
optimized enumerator. Validation/reaching-word, target-coordinate, loaded-data
and traversal bridges remain separate. No new unapproved law, production
pruning, stronger optimality label, performance result, database build, holdout,
publication or independent review is included. The October 24 final competitor
research/report/no-push order remains in force.
