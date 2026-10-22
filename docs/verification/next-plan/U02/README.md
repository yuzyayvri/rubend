# Subgroup-exclusion preflight

Yuzy approved NP01–NP03 on October 23. These statements are not yet proved in
Bend, and no new pruning is enabled. The existing 23 laws remain unchanged.
U00's raw timing gate is still inconclusive and U01's clipboard/download gap
remains open. Isolated correctness work can proceed without claiming either
gate has passed or promoting an optimization.

## Candidate and oracle

`bench/subgroup-exclusion.bend` keeps `ForwardBounds` and `InverseBounds`
separate. Forward bounds produce only a `FinalMask`. Inverse bounds produce a
`FirstMask`. The first-move filter cannot accept a `FinalMask`; an intentional
compile-negative fixture checks that exact type mismatch.

The joint coordinates target twist=flip=slice=0. The three frames target UD,
FB and RL reduction subgroups. Their move masks are 77463, 239058 and 95418.
Each subgroup contains every half turn and its parallel quarter turns. Tests
derive membership from actual coordinate transitions, check inverse closure,
and check that their union covers the 18 moves. This is not a general subgroup
closure proof or a data-admissibility theorem.

At positive residual depth r, a tight admissible subgroup estimate excludes
final moves in its target subgroup. The candidate raises the full-cube bound
only when those exclusions cover all 18 moves. Zero and unknown-nibble guards
remain explicit. A forward final-move mask is never passed to the first-move
filter. No reduction/subgroup search or production profile imports this module.

`tests/subgroup-exclusion.mjs` builds a shortest-path DAG with pinned
`cubing@0.66.0` KPuzzle transitions, not Rubend's search. It propagates unions
of every shortest first/last solving move. Expected layer sizes through depth
four are 1, 18, 243, 3240 and 43239. Packed Bend transitions agree at every DAG
edge. Existing joint-cache bytes supply the three forward and inverse bounds.
Both cache hashes must match the preserved baseline. No table is generated.

The finite test checks all candidate bounds against independent exact shallow
depths, all shortest first/last masks, solved and zero-depth behavior, unknown
entries, and child residual indexing. It must retain actual counterexamples for
forward-as-first use, wrong axis masks, residual off-by-one use and missing
zero guard. It does not substitute a witness path for the complete shortest
move union. The release holdout stays unopened.

## Verification and next step

The precommit gate passed the unchanged root `PROOF.bend --verdict`, the
candidate's termination/type verdict, native synthetic checks, emitted-C
array mode zero, and the intended FirstMask/FinalMask compile rejection.
These are not formal NP01–NP03 proofs. Array mode on this array-free candidate
does not establish ownership of a future integrated search kernel.

The [two-ply pilot](u02-exclusion-precommit-v2/index.json) also passes all
262 states and finds all four required mutation counterexamples. In particular,
`U R` has forward bounds `[1,2,2]`; applying its final-move mask as a first-move
mask would remove `R'` from the actual shortest solution `R' U'`. The candidate's
inverse-derived first mask preserves that move. No increased lower bound occurs
in this shallow pilot, and no speed benefit is claimed. The four-ply oracle is
still pending. The first guard archive is preserved as a narrower native check.

After committing, launch a fresh bounded queue:

```sh
nix develop --command node bench/u02-exclusion-checks.mjs plan u02-exclusion-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-exclusion-v1-plan.json
```

The oracle job uses three GiB and one low-priority lane for at most ten minutes.
The unchanged proof/toolchain job can use four low-priority lanes and three
minutes. Expected total duration is five minutes; the hard cap is thirteen.
The existing thread heartbeat resumes after the batch. No model polling,
production change, new database, benchmark verdict, publication, or deployment
is part of the queue.

On continuation, inspect and archive receipts before edits. Reproduce any
failed mutation or oracle assertion. Then implement the exact approved general
proof statements and their concrete subgroup/data bridges before isolated
search integration. Compare the bound treatment independently of coordinate
reuse and task scheduling. No default changes until the roadmap's correctness,
quality and stable-control performance gates pass. Independent review is not
run under the solo instruction.
