# NP01 over the typed reference group

This is a candidate encoding of the approved NP01 statement. It replaces the
older helper's separate target/member interface with an explicit subgroup and a
globally admissible bound over the existing typed cube model. It does not
instantiate loaded joint-table data or enable optimized pruning.

## Quantifier alignment

A legal group element is presented by any finite reaching word. `R.root` uses
the actual typed replay from solved cells. Existing refinement connects that
replay with the facelet specification. Existing inverse proofs establish the
inverse word and its uniqueness across equal represented roots. This is a
word-presented cube group, not an arbitrary U32 tuple called legal.

`inside` is a membership proposition on the actual typed cube value. Equal
values therefore have the same membership proposition. `Subgroup` carries
identity membership, closure under arbitrary products of group elements, and
inverse closure. The proof needs inverse closure for the final move. The other
fields remain because the approved input is a subgroup, not an arbitrary target.

`h` maps typed cubes to `Nat`, so negative bounds and U32 wrapping are absent.
`Admissible` quantifies every reaching word and every path whose endpoint belongs
to the target. It requires the bound to be no greater than that path's length.
This is the lower-bound form of admissibility, not an assumed value for one path.
Identity membership and inverse replay ensure a target-reaching path exists.

Every positive solving word is represented as a prefix followed by its last
move. The radius is exactly one plus the prefix length. The existing snoc-length
theorem checks that equality. A total `positive_split` constructs such a
representation for every nonempty ordinary word and carries its reconstruction
proof. No empty word or radius-zero case is admitted by this encoding.

`np01_final` assumes that positive radius is no greater than `h(g)` and that the
complete word solves `g`. It concludes that the actual group element represented
by the last move cannot belong to `inside`. The proof cancels the last move in
the existing typed model, uses subgroup inverse closure, then contradicts the
global admissibility premise with the shorter prefix.

## Concrete instance and controls

The identity subgroup uses equality with solved typed cells as membership.
Product closure uses actual replay composition. Inverse closure uses the proved
unique inverse. Its bound is zero on a solved facelet view and one otherwise.
The global admissibility proof handles the empty path with its endpoint equality
and every positive path with the one-step upper bound. A U-turn instance has a
genuinely tight bound of one and uses its actual inverse solution.

Fixed proof controls weaken the positive gap, omit inverse closure, claim a
nonidentity single turn is the identity, and assert a false globally admissible
constant-one bound. Both public checker entrypoints must reject them for the
expected type disagreement. These are frontend rejections through both commands,
not a claim that the kernel received an invalid translated proof.

Finite backend checks cover every positive word through length three and 256
longer words. They check ordinary-word decomposition, actual typed prefix
recovery against independent facelets, and the zero-or-one bound. Separate
counterexamples explain why the weakened conditions are false. Finite checks
do not replace the quantified proof. The BendTT claim text and source hashes
are retained for inspection.

## Boundary

The focused source currently passes both checkers and its backend spot checks.
The complete fixed guard is `u02-np01-group-v1`, expected three minutes with an
eleven-minute hard cap. Proof jobs use at most 3 GiB and four low-priority lanes.
The finite check runs on CPU2 under 1 GiB. Existing laws stay unchanged.

This does not prove that every input accepted by validation has a reaching-word
witness, that the optimized coordinate target matches this subgroup, or that a
loaded distance table satisfies global admissibility. NP02 and NP03 remain
separate. No formal optimality label, production integration, performance
acceptance, new unapproved law, database build, publication, or independent
review follows. Quantifier alignment and remaining application bridges stay
explicit rather than being hidden by a passing helper.

## Result

The [archive](u02-np01-group-v1/index.json) verifies 2,573 seals and three
receipts. The worker is gone, and no resource stop occurred. Both pure checkers
accept the quantified law, subgroup instance, global indicator bound, and
positive-word decomposition. The preserved BendTT header contains the subgroup,
global admissibility, positive radius, and actual solving-word premises.

All eight false-proof entrypoint checks reject for the expected disagreement.
All 6,430 positive-word decompositions and typed prefix recoveries pass. The
6,431 indicator-bound checks include empty input. The finite counterexamples
and unchanged proof/toolchain gates pass. No established law changes.

This is the checked NP01 reference-group formulation, not certification of the
optimized application or its input/data bridges. NP02 and NP03 remain separate.
Independent review is not run under the solo rule.
