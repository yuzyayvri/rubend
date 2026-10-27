# Native certificate fixture needs a parenthesized pair type

`u02-certificate-reaching-v2` passed its proof job and JavaScript checks,
then failed while compiling the native test entry. The template declared
`+List<+List<U32> & +List<U32>>`. Bend requires parentheses around a compound
type argument. The diagnostic was `a compound type argument takes parens`,
with `&` observed where `>` or `,` was expected.

That syntax correction exposed a kind error in `u02-certificate-recovery-v1`.
An outer `+List` requires `Data` elements. The pair is affine `Type`, even
though its two component lists contain reusable data. The loop consumes every
case once and never needs to copy the case list.

The corrected type is `List<(+List<U32> & +List<U32>)>`. No certificate or proof
logic changes. These are test-entry type defects, not failed certificate laws
or incorrect solver answers. A one-case native compile and execution pass with
packet checksum 285,219,522. The complete native fixture remains unverified.

The [failed archive](../verification/next-plan/U02/u02-certificate-reaching-v2-failed/index.json)
preserves 2,651 seals and both executed resource receipts. The worker is gone.
Its additional `recovery-inputs.json.gz` preserves the new Bend sources, actual
bad-proof fixtures, original template and generated native source, plus the
completed proof, finite and native-case records. The original run stays failed.

The proof job rejected all twelve expected false-proof entrypoints. JavaScript
checked 6,431 word-derived witnesses, 55 saved answers on four pilot inputs,
488 refusals, 256 arbitrary-U32 cancellation cases and three runtime mutations.
Those unchanged sources and artifacts are reused, not rerun. The 464 native
cases have expected packet checksum 3,997,635,194.

The [first recovery archive](../verification/next-plan/U02/u02-certificate-recovery-v1-failed/index.json)
preserves 2,674 seals and its failed receipt, worker gone. Its additional
`kind-failure.json.gz` retains the exact template and `expected Data, observed
Type` diagnostic. Both original runs stay failed.

`u02-certificate-recovery-v2` checks both frozen bad templates fail with their
exact diagnostics, then compiles and executes the corrected full fixture.
It runs the unchanged proof/toolchain gate afterward. Until that recovery is
verified, native parity remains unverified. No production pruning or stronger
application certification follows from either run.

The [completed recovery](../verification/next-plan/U02/u02-certificate-recovery-v2/index.json)
resolves the fixture defect. Canonical verification checks 2,691 seals and two
receipts, worker gone and no resource stop. All 464 native cases match checksum
3,997,635,194. Both frozen failures reproduce their exact diagnostics, and
unchanged proof/toolchain gates pass. Original failed statuses are retained.
