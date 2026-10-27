# NP03 with actual inverse-word reconstruction

This candidate encoding follows the approved NP03 statement using the same
typed reference subgroup and globally admissible Nat bound as NP01. It uses
the existing proved inverse root and solution transformation. There is no
uninstantiated `InversionBridge` parameter.

A legal root is presented by an arbitrary reaching word. The actual inverse
root is replay of its reversed-and-inverted word. Existing inverse uniqueness
makes that root independent of the chosen presentation. A positive solving word
is its first move followed by a suffix. Its radius is exactly one plus the
suffix length.

The theorem assumes the bound at that inverse root is at least the radius.
`R.invert_solution` produces the actual inverse solving word. Its last move is
the inverse of the original first move. Cancelling that final move leaves the
original first-move element, using double-inverse identity. If that element
belongs to the target, global admissibility contradicts the shorter inverse
prefix. The suffix-length theorem supplies the exact radius correspondence.
No forward estimate is substituted for the inverse estimate.

The subgroup remains an explicit semantic input. This cancellation proof needs
the original first-move membership directly, so it does not consume or duplicate
the subgroup's closure functions. A concrete identity-subgroup/global-indicator
instance uses the U-turn root and its actual one-move inverse solution.

The focused source passes both checkers. The full fixed guard checks the saved
BendTT statement and rejects four actual source variants through both entrypoints.
They substitute a forward bound, omit suffix reversal, change the inverted root,
or use the wrong last move. The eight failures must be type disagreements at
the theorem, not parser or missing-file failures.

Backend checks cover every positive word through length three, empty identity,
and 256 longer reaching words. Actual typed inverse-solution transfer must agree
with independent facelet replay. A separate finite counterexample uses the
proper four-element U-turn subgroup. For root `R' U'`, solution `U R` starts in
that subgroup. Its forward distance to the subgroup is two, while its inverse
distance is one. Thus a forward tight bound would reject a valid first move.
A complete radius-two independent target graph checks those distances. That
test-only oracle is not a new production distance table or an admissibility proof
for loaded solver data.

The queue is `u02-np03-group-v1`, expected three minutes with an eleven-minute
hard cap. Proof jobs use at most 3 GiB and four low-priority lanes. The finite
check is serial on CPU2 under 1 GiB. NP01 evidence and unchanged source graphs
are reused. Established laws remain unchanged.

This does not finish NP02, validator reachability, optimized target correspondence,
loaded-table admissibility, or application certification. A possible later bridge
is to recover a reaching word from an already replay-certified incumbent instead
of assuming all validated inputs have a witness. That reconstruction and packed
root agreement still need proof and executable checks. Nothing here enables
pruning, updates an inverse incrementally, changes defaults, builds large data,
uses a release case, publishes, or claims independent review.

## Result

The [archive](u02-np03-group-v1/index.json) verifies 2,593 seals and three
receipts. The worker is gone, and no resource stop occurred. Both checkers accept
the quantified theorem and its concrete identity instance. The saved BendTT
statement evaluates the bound at the actual inverse root and has no assumed
`InversionBridge` argument.

All eight false-proof entrypoint checks reject for the expected disagreement.
All 6,431 inverse-word and typed solution-transfer checks pass. The finite U4
subgroup checks all sixteen products and four inverses. Its complete radius-two
oracle checks 856 states and 1,152 edges, confirming forward distance two and
inverse distance one for the counterexample. Unchanged proof/toolchain gates
pass. No optimized or loaded-data bridge, pruning, or application certification
is implied. Independent review is not run.
