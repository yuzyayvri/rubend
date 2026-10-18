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

Extra projection/ranking work is the next hypothesis, not a proven profiler
result. A fused implementation reads the cube once and ranks labeled edge
slices directly, avoiding intermediate projection passes. It already agrees
on all 153,090 corner codecs, 34,650 edge codecs, and 47,871 cache-backed cube
queries. Same-binary reference/fused policies and a comparison requiring exactly
equal traversal are prepared. Timing and application canaries are still due.
The [fused check archive](r04-h0-fused-check-v1/index.json) binds its frozen
native binaries, source identities, complete codec checks, cube queries, and
unchanged twenty-three-law kernel verdict. This is correctness evidence only.
