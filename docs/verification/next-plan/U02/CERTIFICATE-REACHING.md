# Reaching words from accepted certificates

NP01–NP03 describe roots reached by a move word. The application accepts
facelet inputs, not a proof that each input has such a word. This bridge uses an
already accepted incumbent instead of assuming the validator proves reachability.
No original scramble is required.

`from_certificate(cube, certificate)` consumes the actual `Certificate<cube>`
and returns `CRTWitness<cube>`. The witness contains the reversed-and-inverted
solution and equality between the original input and the typed root's facelets.
No Boolean flag, caller-provided root, or preexisting reaching word can replace
the certificate input.

## Why the certificate is enough

The existing certificate stores Boolean evidence that replay is solved.
`certificate-equality.bend` proves that the actual structural U32 comparison
reflects equality, then lifts that result through conjunction trees.
The generated `certificate-solved.bend` applies it to all 54 comparisons in
`M.is_solved`, including the six centers. The generator refuses a changed
predicate or solved layout rather than silently retaining an older shape.

Arbitrary-facelet word cancellation follows from the existing move/inverse and
replay-append laws. Replaying the inverse solution from solved therefore recovers
the original input. Typed replay refinement connects that facelet replay to
`R.root`. The witness's dependent type keeps the equality tied to the exact input.

The alternative was a universal validator-completeness proof before any
post-incumbent inference. That remains separate work. A certificate is a stronger
available fact once an answer exists, so this bridge uses it directly.

## Fixed guard

The initial queue is `u02-certificate-reaching-v2`, expected three minutes within a
twelve-minute cap. It uses at most 3 GiB, four low-priority build lanes, and
one CPU lane for finite/native checks. The previous NP01–NP03 and cold-pilot
artifacts are reused only after their archive hashes match.

Both proof entrypoints must reject actual wrong-word, wrong-root, wrong-sticker,
weakened-predicate, wrong-width and false-certificate sources. Generated
reflection bytes and translated signatures are retained. Separate runtime-only
mutations must expose an incorrectly serialized word, wrong typed root, and
admission after certificate failure.

Finite checks cover 6,431 word-derived cases, all 55 saved pilot answers,
486 single-sticker defects, two invalid solutions and 256 cancellation checks
on arbitrary U32 facelet values. The pilot answers come from four already-used
roots, not 55 independent inputs or untouched evaluation cases. Independent
facelet replay checks accepted answers and reconstructed inputs. A native entry
checks the same packet checksum on shallow cases, pilot answers and center
defects. No timings are used for performance claims.

This does not prove the input validator complete, accept an optimized packed
root, connect target coordinates or loaded bounds, certify optimized traversal,
or enable production pruning. The established 23 laws remain unchanged.
No new domain law, database, holdout, publication, stronger label or independent
review is included. The final report and no-push order remain in force.

## Native fixture recovery

The initial run passed the proofs and JavaScript checks, then failed at the
native template's unparenthesized pair type. All 2,651 seals and both resource
receipts are [preserved](u02-certificate-reaching-v2-failed/index.json).
An additional compressed recovery snapshot preserves the pure sources,
actual false proofs, failed native entry and completed records. The run remains
failed. Read [the syntax defect](../../../issues/certificate-native-pair-type.md).

The first recovery reached a second type defect. The pair is affine `Type`,
so the outer reusable list is invalid. That run's 2,674 seals and failed
receipt are [preserved](u02-certificate-recovery-v1-failed/index.json), including
an additional snapshot of the bad template and diagnostic. The loop only
consumes its case list, so the corrected outer list is affine as well.
A one-case native compile and execution pass with packet checksum 285,219,522.

`u02-certificate-recovery-v2` reuses the passing proof and JavaScript results
after hash checks. It changes only the template type. It checks both original
diagnostics, executes all 464 corrected native cases against checksum
3,997,635,194 and finishes the unchanged gates. Expected two minutes with a seven-minute cap,
at most 3 GiB and four low-priority build lanes. No repeated JavaScript or
unchanged proof work is scheduled.

## Result

The [recovery archive](u02-certificate-recovery-v2/index.json) verifies 2,691
source seals and two resource receipts. The worker is gone, with no resource
stop. All 464 native cases match the JavaScript packet checksum 3,997,635,194.
Both bad-template controls reproduce their exact original diagnostics. The
unchanged 23-law and toolchain gates pass. The recovery took about 56 seconds.

The original proof and JavaScript records are reused after source and artifact
hash checks. All twelve false-proof entrypoints, 6,431 word-derived witnesses,
55 saved pilot answers, 488 refusals, 256 arbitrary-U32 cancellations and three
runtime mutations pass. The two failed runs and their compressed source
snapshots remain failed evidence. No production, speed or independent-review
claim follows.
