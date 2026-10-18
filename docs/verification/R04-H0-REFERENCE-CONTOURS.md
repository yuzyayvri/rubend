# Reference H0 contour result

The reference H0 kernel misses the ten-percent marginal CPU gate over
inverse-three on both frozen uniform sets. Keep its audited data and reference
implementation. Do not promote this kernel as the default.

Each set has sixteen states, five fresh cohorts, four same-binary policies,
and target lower bound fifteen. All 640 measured jobs complete. All 6,520
shallow warmup checks pass. Every answer replays and every worker exits with
its IPC removed. One native thread uses CPU 2 at nice 10, with a four-GiB
ceiling and the existing desktop reserve. Desktop activity remains uncontrolled.

| Same-binary comparison | Pilot CPU ratio | Development CPU ratio |
| --- | ---: | ---: |
| H0 / forward | 0.7168 | 0.7798 |
| Inverse plus H0 / inverse-three | 0.9552 | 0.9560 |
| Inverse plus H0 / forward | 0.5772 | 0.5595 |

Ratios are geometric means of five cohort-total ratios. Lower is better.
The marginal pilot interval is 0.9086 through 1.0228, so that pilot does not
resolve a gain. The development interval is 0.9495 through 0.9633, a finite
observed 4.4-percent saving that still misses the declared gate. The combined
kernel executes 21.3 percent fewer state-machine steps on pilot and 18.5 percent
fewer on development. These steps are not true node expansions.

The [archive index](r04-h0-reference-contours-v1/index.json) retains complete
raw reports, separate resource receipts, configurations, analysis, and source
identities. No censored case is dropped. These are direct-contour results,
not application deadline quality, a formal completeness theorem, or a world-class
strength comparison. Independent review remains unrun.

The fused-ranking hypothesis is now rejected. It reads the cube once and ranks
labeled edge slices directly, avoiding intermediate projection passes. It agrees
on all 153,090 corner codecs, 34,650 edge codecs, and 47,871 cache-backed cube
queries. Same-binary timing also gives exactly equal traversal on all 320 jobs
and passes 3,260 shallow warmups. Its standalone CPU ratio is 1.0159, with
interval 1.0050 through 1.0269. Combined with inverse-three, its ratio is 0.9967,
with interval 0.9928 through 1.0000. Fewer source passes did not yield useful
total speed. Do not infer a dominant cost from that premise.
The [fused check archive](r04-h0-fused-check-v1/index.json) binds its frozen
native binaries, source identities, complete codec checks, cube queries, and
unchanged twenty-three-law kernel verdict. This is correctness evidence only.
The [rejection archive](r04-h0-fused-rejected-v1/index.json) retains raw timings,
the exact prototype commit, and a losslessly compressed recovery patch. The live
H0 generator and runtime no longer select this treatment. An explicitly rejected
benchmark module remains for research and frozen-output readers remain usable.
The [cleanup checks](r04-h0-fused-rejected-v1/cleanup-index.json) verify that the
restored runtime has the same source graph and every allocated code/data byte
as the pre-treatment binary. One filename byte differs only in the non-allocated
ELF string table. No claimed speed gain depends on ignoring changed instructions.
