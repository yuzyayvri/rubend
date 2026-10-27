# Cached-axis pilot cost result

The [pilot queue](u02-axis-cost-v1/index.json) passed with 1,631 matching source
seals, four verified resource receipts, no stop and its worker gone. All eighty
requests performed one million search advances. They exhausted fuel without
an answer. Control and candidate match by case on visits, lower bounds and
status. This is not evidence of better deadline solutions.

Fresh same-binary A/A passes the predeclared five-percent gate. Its five paired
native-time ratios span 0.9902 to 1.0380. The median is 1.0212. Each side's
four-case cohort took at least 702 milliseconds.

The A/B paired native-time ratio has median 0.8947 and range 0.8748 to 0.9091.
The five control cohorts took 712 to 743 milliseconds, and candidate cohorts
took 630 to 650 milliseconds. These observations justify fresh confirmation,
not promotion. They do not establish a general engine speedup. Startup remains
about 1.8 seconds, outside the measured request region. Sampled RSS remains
about two GiB; the 32-KiB candidate peak difference is not a measurement of
per-frame allocation cost.

The separate line-level gprof run is dominated by initialization. The largest
`spin_193` entries include the joint-cache hash loop and its inlined hash
operation. `spin_178` includes small-table generation. Raw word reading and
array writes also appear. This profile includes startup, uses an instrumented
build and has only 0.83 sampled CPU seconds. It cannot yet explain the limiting
search operation. The overall performance verdict remains inconclusive under
the benchmark checklist. No default changes or new pruning are enabled.

## Fresh confirmation

`bench/axis-search-confirm-v1.json` fixes four development cases, five alternating
cohorts and five million measured search advances per request. This changes the
workload and increases timer resolution without changing either treatment.
It is not a rerun of a failed noise gate. The original pilot passed that gate.
Fresh A/A still precedes A/B, with the same refusal rule and no favorable retry.
The independent profiler workload uses twenty million advances so initialization
accounts for less of its work. Its profile still includes startup and must be
read before identifying the search limiter. No release cases are read.

The runner retains separate native time, process CPU ticks, host time, startup,
sampled native RSS and aggregate resource records. Native answers, if any,
must replay. Result mismatches fail the batch rather than improve its timing.
The raw cache and source seals remain checked. The established laws and passing
functional evidence are reused for unchanged search sources.

```sh
nix develop --command node bench/u02-axis-cost-checks.mjs plan u02-axis-cost-confirm-v1 bench/axis-search-confirm-v1.json
nix develop --command node bench/background-tests.mjs start build/evidence/u02-axis-cost-confirm-v1-plan.json
```

Expected duration is ten minutes. The existing three-GiB, low-priority,
twenty-eight-minute queue cap remains. Deadline quality, broader strata,
universal refinement and independent review remain open even if this passes.
The [preflight](u02-axis-cost-confirm-precommit-v1/resource.json.gz) passes the
comparison controls, configuration checks, root verdict and all sixteen
toolchain gates without a resource stop.
