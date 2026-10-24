# Packed comparison fixture used the wrong Boolean ABI

`u02-packed-certificate-v1` passed the complete proof job, including all sixteen
false-proof rejections. The finite job reached the first bit-flip comparison
and failed with `actual undefined, expected 'False'`.

The test read `R.equal(...).$` as a constructor tag. This Bend JavaScript export
returns primitive `true` and `false`, not tagged Bool objects. Direct inspection
of the actual emitted module confirms `typeof result === 'boolean'`.
The admission packets themselves use lists and were not affected by this ABI
mistake. No Bend source or certificate rule changes.

The correction changes three reads to strict primitive-Boolean comparisons.
The recovery checks both actual true and false exports and reproduces the old
undefined-versus-False assertion before running the corrected finite checks.
It does not change an expected admission result to make the test pass.

The [failed archive](../verification/next-plan/U02/u02-packed-certificate-v1-failed/index.json)
preserves 2,716 seals and both executed resource receipts, worker gone.
Its additional `boolean-recovery.json.gz` preserves the completed proof record,
new pure sources, generated negative proofs, templates and old adapter text.
The original run stays failed.

`u02-packed-certificate-v2` reuses those unchanged proof artifacts after hash
checks. Copies into fresh run-owned paths must match the original bytes.
The complete corrected finite/native suite and unchanged gates remain required.
No production pruning, loaded-bound theorem, performance or holdout claim
follows from the proof job alone.

The [completed recovery](../verification/next-plan/U02/u02-packed-certificate-v2/index.json)
resolves the adapter defect. Canonical verification checks 2,751 seals and three
receipts, worker gone and no stop. All finite checks and 570 native packets pass.
The old undefined-versus-False assertion reproduces against the actual compiled
export. The original run remains failed evidence.
