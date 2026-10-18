# Exact stage initializes the wrong goal

Status: closed with solo verification. The focused regression, full development
suite, sixteen toolchain checks, and independent BendTT verdict pass.

Search.initialize accepts a Stage and profile. ExactContour should begin a
full-cube contour, but initialize_checked always constructs a Reduction root.
The focused native test reports expected goal code two and observed zero, then
exits with code two. It uses a correctly sized light array and inspects only
initial state, without depending on pruning data or a long solve.

The application portfolio constructs its exact task directly with FullCube.
The direct-contour measurement entrypoints do the same. This does not establish
a wrong application answer or invalidate their measured exact traversals.
The internal initializer still violates the named Stage/Goal contract and could
mislead a future caller. Preserve improving-stage behavior and profile rejection.

The fix uses the existing next_goal/is_exact mapping instead of a new policy.
The same native test now reports observed two against expected two, and also
preserves both improving-stage goals and wrong-profile rejection. The generated
small, late-corner, and corner-first variants are refreshed through their checked
generators rather than edited by hand.

Emitted C is byte-identical before and after for seven real entrypoints. These
are the default, packed-small, inverse, late-corner, corner-first applications,
and both inverse/corner-first direct-contour controllers. Their portfolio and
measurement paths do not call this initializer, and the compiler excludes it.
This is actual program-output equality, not only a source-inspection claim.
The timed programs and results therefore do not acquire a changed search path.
Existing timed binaries and source snapshots remain preserved.

The red, green, and seven-program equality receipts are in
docs/verification/r01-initialization-v1/. No domain law is changed or weakened.
The regression is part of just test. Independent review remains not run under
the user's no-subagents instruction. No new speed or optimality-proof claim
comes from this API correction.
