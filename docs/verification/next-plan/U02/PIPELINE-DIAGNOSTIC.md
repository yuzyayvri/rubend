# Conditional joint-pipeline diagnostic

The coordinate prototype is functionally consistent on its recorded samples.
That does not show that carrying six extra values will improve search. This
diagnostic records where the existing RawInverseThree FullCube pipeline would
stop on a fixed root-near sample before choosing an integrated representation.
It is not a timing comparison or a complete contour.

## Fixed sample and counts

The first sixteen pilot and first sixteen development cases are fixed before
the run. Each root supplies its actual symmetry mask from `Search.root_frame`.
Permitted first moves create one-prefix parents with their real previous face.
All next moves use the current predecessor predicate. A source fence fails if
that predicate drifts from `Search.enumerate`.

Existing immutable joint data supplies six values per edge. The pure Bend
classifier uses the current forward UD/FB/RL then inverse UD/FB/RL order, for
each child residual from zero through fourteen. A bound equal to the residual
passes. The tests reject the off-by-one interpretation that would cut it.
No small pair-bound cut is applied before this joint stage, so the counts are
conditional models, not observations from actual tree visits.

The raw edge vectors remain in the receipt. Rows grouped by residual and
previous-face context count predecessor rejections, first cut, modeled reads,
rotations, rank encodes, proposed extra transition reads and stored scalar
writes. Hypothetical exclusion counts are labeled as such. They do not
discharge data or inverse premises or enable a pruning rule.

The proposed flattened frame would have sixteen fields instead of ten. The
current native allocator's class formula rounds both to sixteen slots. This
is a static model, not an emitted implementation or memory measurement. Extra
field stores, temporary values, cache misses and path allocation still matter.

## Verification and limits

The [guard](u02-pipeline-guard-v2/index.json) passes the unchanged root verdict,
diagnostic type/termination verdict, source fence, all six cut stages and
zero/tight/off-by-one controls. The probe checks the cache digest before and
after reading, keeps unknown entries fatal, and never writes a sealed cache.
The release holdout is not read. There is no native latency, speedup, coverage
or solution-quality verdict in these observations.

After committing, launch the bounded run:

```sh
nix develop --command node bench/u02-pipeline-checks.mjs plan u02-pipeline-v2
nix develop --command node bench/background-tests.mjs start build/evidence/u02-pipeline-v2-plan.json
```

The serial jobs request three GiB. The probe uses one low-priority lane with a
ten-minute cap; confirmation uses at most four lanes for three minutes. Expected
duration is five minutes and the queue cap is thirteen. Confirmation includes
the result-verifier regressions and unchanged proof/toolchain gates. No PDB,
application rebuild or production change is part of the run.

Use the resulting density only to design a faithful source-isolated native
comparison. Before any performance decision, compile the actual extended frame,
check owned-array mode and equal-contour/answer behavior, profile the limiter,
alternate matched controls, and include startup, memory and deadline quality.
The unresolved raw A/A gate still prevents promotion.
