# NP05 projection-path kernel and second-table audit

Both six-edge native builds are complete. Pattern zero passes its independent
full graph audit. This unit reuses that evidence, audits pattern one with the
unchanged validator, and checks the semantic word-lifting part of approved NP05.
It does not claim that a generic projection is the concrete six-edge codec.

## Proof structure

`ProjectedPath` carries its start, goal and Nat move count in its type.
`AtGoal` requires both zero length and endpoint equality. `Next` consumes one
actual HTM move and a path from its actual projected successor. `ProjectedMinimum`
contains both an attaining path and a lower bound against every such path.
It does not assume a full-cube lower bound.

The proof follows the actual `model.bend` replay order. A legal root is reached
by replaying a finite word from solved. Each step extends that reaching word
on the right, using the existing proved replay-append law. A solving word lifts
to a projected path of exactly the same length and with goal `project(solved)`.
Minimality then bounds every actual solving word, which is the needed semantic
lower-bound conclusion. Maximum composition is proved separately. No sum of
overlapping estimates is admitted.

Commutation evidence is a structural finite certificate for the particular
word and all its successive legal roots. This records the finite instances
of the approved global commutation premise. The global concrete six-edge
commutation theorem and its certificate constructor are not supplied here.
Development v1 tried reusing one affine proof callback and was rejected.
The failed source and receipt remain preserved. Replacing that callback with
one consumed certificate node per move fixes ownership without admitting an
unchecked equality. No user-approved premise is dropped or assumed true.

Two structures were considered solo. Computing projected replay through an
arbitrary reusable callback conflicts with Bend's affine function ownership.
The typed path certificate records the same sequence without a runtime callback.
This is the selected design. The Model the Domain principle makes endpoints
and move count part of the certificate rather than informal metadata.

Ordinary Bend and BendTT check the new module. Actual source variants corrupt
the root, commutation, path length, endpoint, solving premise and lower-bound
conclusion, and turn maximum into an overestimate. Both proof entrypoints must
reject each of seven variants, fourteen rejected entrypoints. The translation,
generated module, mutated source bytes and raw diagnostics are archived.
Finite checks cover maximum composition and eighteen nonvacuous one-move
instances using the zero-distance Unit quotient. Those examples exercise the
actual cube replay/inverse law and path moves, not a six-edge distance claim.

## Second graph audit

The second payload comes directly from the verified `u03-six-cycle-v1` build.
Its pattern is `[1,3,5,7,9,11]`, goal 4,307,008 and SHA
`d9d572142a8675ff00f86d68051a02066ed403daa40e3f8de1d4622809c15b31`.
Four fixed disjoint ranges check all 42,577,920 states and 766,402,560 directed
edges. All domains, unique goal, inequalities, decreasing successors, histogram,
checksum and owned-worker cleanup are required. Actual Bend JavaScript codec
endpoint and zero-orientation transition reflections retain the first audit's
explicit scope. Native backend and universal symbolic codec checks remain open.

Preparation, proof and finite controls have a three-minute cap under 1 GiB on
CPU2. The graph audit has a four-minute cap under 2.5 GiB on four nice-10 lanes.
Confirmation has ninety seconds under 512 MiB. The whole queue has a ten-minute
ceiling, below the unchanged thirty-minute policy. No data generation or native
engine build repeats. Every old required input path and canonical evidence chain
is sealed. A source-identical first audit and four-edge controls are reused.

## Remaining boundaries

A passing finite graph certificate does not instantiate the global legal-cube
projection, prove universal U32 rank/unrank or connect loaded two-bit storage to
the distance words. NP05 is not marked fully discharged by this kernel alone.
No production pruning, changed application label, new solver-speed comparison,
competitor setup, final holdout or publishing occurs. Work stays solo.
Independent review is not run and the review gate remains closed.

## Verified result

The [source-bound archive](u03-np05-path-v1/index.json) verifies 3,632 seals
and three receipts. The queue worker and all four audit workers are gone.
No resource stop occurred. Both proof entrypoints pass. All fourteen altered
proof entrypoints reject with actual proof diagnostics. The archive contains
the translation, generated module and complete altered source bytes.

All 1,093 maximum pairs, 12,529 valid upper-bound comparisons and eighteen
actual one-move path instances pass. The Unit quotient makes these examples
nonvacuous without pretending it is a six-edge projection instance.

Pattern one passes every 42,577,920-state and 766,402,560-edge graph condition.
Its unique zero is at 4,307,008. Its diameter is ten. The independent serial
histogram and weighted checksum agree, and the payload is unchanged.
All 1,330,560 actual Bend JavaScript codec endpoint and 11,975,040
zero-orientation transition reflections pass. Both reference graphs are now
fully audited within the stated concrete reflection boundary.

The second audit command takes 75.76 s wall and 265.91 s CPU in this single
planning execution. The resource scope takes 76.564 s and peaks at 2,273,384 KiB
aggregate tree RSS. GNU Time's 473,184 KiB maximum child RSS is a different
scope. These are planning records, not a comparison or scaling result.
The first audit and both native builds are reused without repetition.

NP05 remains partially discharged. Global concrete commutation, the actual
codec and native/storage refinements are still required before promotion.
Next measure whether the six-edge distances add information after the existing
pipeline on saved source-bound contexts. This screening uses no pruning and
does not require pretending those remaining production proof bridges are done.
