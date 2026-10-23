# Typed slice-mask proof has a checker disagreement

The existing `src/coordinates.bend` passes its standalone Bend/BendTT verdict.
The new typed mask-refinement module passes the primary checker but its verdict
reports a disagreement with the formalized kernel. No result is accepted for
that module. The reproduction is
`build/evidence/u02-slice-coordinate-mask-probe-v2.json`.

An earlier complete slice-codec probe ended with `SIGKILL` before a verdict.
Its record is `build/evidence/u02-slice-coordinate-probe-v1.json`. The recorded
signal does not establish whether CPU, memory or another cause ended it.
The 495-constructor placement representation was replaced with a type whose
branches have at most eight constructors. That is a representation change,
not passing verification evidence.

The fixed `u02-slice-verdict-v1` diagnostic checks eight source prefixes and
records the first primary/kernel disagreement. It also preserves the translated
file digest and direct native kernel output. A passing diagnostic run means
that collection completed, not that the proof passed.

The diagnostic completed with 1,832 verified seals and the worker gone. The
first five definitions pass both checkers. The native kernel reports
`In coordinate_shape: out of fuel`. This is a normalization-budget failure,
not a reported expected/observed equality mismatch. Acceptance stays closed.
The [diagnostic archive](../verification/next-plan/U02/u02-slice-verdict-v1/index.json)
preserves the direct output and translated-file digest.

The pinned kernel has a fixed 400,000,000-step budget. Its conversion checker
normalizes both differing expressions before comparing their parts. A direct
rank-loop reflexivity proof and a congruence-form replacement both exhaust the
budget in the slice shape relation. The kernel and its fuel are unchanged.

The shared premise was that an open twelve-step rank loop would remain cheap
inside these equalities. The `u02-rank-normalization-v1` controls all pass,
including aliases at depths four, eight and twelve. This rules out the loop
alone as the explanation. The constructor-guard prototype also passes both
checkers and all 4,096 low-mask backend comparisons. Its verified archive is
`docs/verification/next-plan/U02/u02-rank-normalization-v1/index.json`.

The next test applies that boundary to a private copy of the full coordinate
expression, where the disagreement actually appeared. The universal typed mask
relation for that candidate now passes both checkers in an initial probe. Its
complete 495-placement and rejection guard is `u02-slice-coordinate-profile-v1`.
The source-isolated copy leaves production unchanged. Complete proof, native
cost and integration are still separate gates. No kernel fuel changes.

Do not weaken the statements, bypass the kernel or promote pruning to avoid
this gate. The suitable representation and complete slice-codec verdict remain
open.
