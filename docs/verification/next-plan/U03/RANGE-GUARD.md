# Information-screen range guard

The original conditional screen is data-valid but inconclusive. Its radii
7 through 13 exceed the small references' maximum distance six. The missing
range classification is recorded in `docs/issues/small-edge-screen-range.md`.

The focused regression first failed with `actual undefined`, expected
`inconclusive`. The model now annotates both new observations and existing saved
aggregates. It compares each radius with the relevant exact-reference ceiling
or two-bit ceiling and counts range-eligible visits. Zero eligible visits gives
an inconclusive verdict. Range overlap gives an exploratory verdict only, not
representative sampling, useful pruning or accepted performance.

The annotation checks matching policy/radius histograms, root totals, visit/cut
counts and the declared policy set. Seven original model corruptions and five
histogram corruptions must fail. Annotation is idempotent. The original archive
and all raw counts remain unchanged.

The fixed `u03-range-v1` batch reuses the complete passed cube/projection/codec
work. It verifies the saved observation and table-diameter hashes, then derives
the verdict from per-radius aggregates. It does not repeat projections, searches
or table generation. Run focused regressions and unchanged proof/toolchain gates.
Estimate one minute with a five-minute cap, at most 3 GiB, low priority and serial
resource admission. No new domain law, production change or publication.

The [canonical archive](u03-range-v1/index.json) verifies 2,271 seals and both
resource receipts. The worker is gone with no resource stop. The focused
regression, twelve corruption controls, saved-aggregate checks and unchanged
proof/toolchain gates pass. All thirty policy ranges have zero eligible visits.
The executable verdict is inconclusive and every original count is unchanged.
No cube, projection or codec work was repeated.
