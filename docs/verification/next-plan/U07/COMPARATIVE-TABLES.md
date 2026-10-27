# Rubend comparative benchmark

The frozen comparison is complete. No push, merge or publication is authorized.

This report describes pinned configurations at fixed resources, not a universally fastest solver. Exact-return, exact-request and first-answer/improvement contracts remain distinct. Formal full optimized-search completeness and optimality are not certified. Independent review was not run under the solo restriction. The overall 10x to 100x target is not established.

## Coverage, quality and conditional latency

All missing/error/unavailable slots remain in denominators. First-answer quantiles are conditional on deadline coverage. A cold process is not a cold disk cache. HTM is the move metric.

| Population | Configuration | Clock | Answered/planned | HTM median/p95 | First ms p50/p95/p99 | Optimality events | Errors/unavailable |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| quality | rubend-default | warm-request | 9962/10000 | 19/21 | 24.624/124.392/272.061 | 0 | 35/0 |
| quality | cubing-min2phase | warm-request | 10000/10000 | 21/21 | 13.31/68.68/125.688 | 0 | 0/0 |
| quality | muodov-c | warm-request | 10000/10000 | 21/22 | 16.884/65.14/105.076 | 0 | 0/0 |
| quality | nissy-h48h0 | warm-request | 13/10000 | 15/15 | 574.861/982.539/988.692 | 13 | 0/0 |
| quality | vcube-108 | warm-request | 202/10000 | 16/16 | 376.441/914.867/974.383 | 202 | 0/0 |
| timing | rubend-default | cold-process | 320/320 | 19/21 | 311.346/358.437/399.264 | 0 | 0/0 |
| timing | rubend-default | warm-request | 317/320 | 19/20 | 17.785/55.989/88.451 | 0 | 3/0 |
| timing | cubing-min2phase | cold-process | 320/320 | 21/21 | 337.035/412.377/426.458 | 0 | 0/0 |
| timing | cubing-min2phase | warm-request | 320/320 | 21/21 | 11.226/58.214/74.063 | 0 | 0/0 |
| timing | muodov-c | cold-process | 320/320 | 21/21 | 23.327/47.69/50.035 | 0 | 0/0 |
| timing | muodov-c | warm-request | 320/320 | 21/21 | 15.429/40.706/55.369 | 0 | 0/0 |
| timing | nissy-h48h0 | cold-process | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | nissy-h48h0 | warm-request | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | vcube-104 | cold-process | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | vcube-104 | warm-request | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | vcube-108 | cold-process | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | vcube-108 | warm-request | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | rubend-u00-small | cold-process | 320/320 | 19/21 | 397.458/448.647/473.077 | 0 | 0/0 |
| timing | rubend-u00-small | warm-request | 314/320 | 19/20 | 13.512/42.998/71.175 | 0 | 6/0 |
| timing | rubend-u00-inverse | cold-process | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | rubend-u00-inverse | warm-request | 316/320 | 19/20 | 8.615/22.075/31.259 | 0 | 4/0 |
| timing | rubend-u00-h0 | cold-process | 0/320 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| timing | rubend-u00-h0 | warm-request | 320/320 | 19/20 | 8.223/23/30.699 | 0 | 0/0 |
| timing | rubend-default-exact | cold-process | 320/320 | 19.5/21 | 308.882/354.05/387.335 | 0 | 0/0 |
| timing | rubend-default-exact | warm-request | 319/320 | 19/21 | 18.362/62.336/90.885 | 0 | 1/0 |
| structural | rubend-default | warm-request | 180/181 | 3/4.1 | 3.204/3.795/4.78 | 1 | 0/0 |
| structural | cubing-min2phase | warm-request | 180/181 | 3/4.1 | 0.741/2.965/4.675 | 0 | 0/0 |
| structural | muodov-c | warm-request | 181/181 | 3/10 | 3.251/3.764/5.642 | 0 | 0/0 |
| structural | nissy-h48h0 | warm-request | 179/181 | 3/4 | 12.514/16.907/230.754 | 179 | 0/0 |
| structural | vcube-108 | warm-request | 180/181 | 3/4.1 | 11.158/12.492/13.782 | 180 | 0/0 |
| structural | rubend-default-exact | warm-request | 180/181 | 3/4.1 | 3.13/3.791/5.227 | 175 | 0/0 |
| long | rubend-default | warm-request | 32/32 | 19/20 | 17.236/55.2/75.645 | 0 | 0/0 |
| long | cubing-min2phase | warm-request | 32/32 | 21/21 | 11.448/44.141/65.3 | 0 | 0/0 |
| long | muodov-c | warm-request | 32/32 | 21/21 | 15.011/35.057/40.013 | 0 | 0/0 |
| long | nissy-h48h0 | warm-request | 0/32 | n/a/n/a | n/a/n/a/n/a | 0 | 0/0 |
| long | vcube-108 | warm-request | 5/32 | 17/17 | 2507.229/4939.839/4973.47 | 5 | 0/0 |
| long | rubend-default-exact | warm-request | 32/32 | 19/20 | 18.452/60.064/80.68 | 0 | 0/0 |

## Exact-contract completion

Non-exact contracts are not labeled censored exact searches. Their incidental verified proof events remain separate. Failures are not silently converted into censored successful observations.

| Population | Configuration | Clock | Proof events/planned | Proof ms p50/p95 | Right-censored/failures |
| --- | --- | --- | ---: | ---: | ---: |
| quality | nissy-h48h0 | warm-request | 13/10000 | 574.861/982.539 | 9987/0 |
| quality | vcube-108 | warm-request | 202/10000 | 376.441/914.867 | 9798/0 |
| timing | nissy-h48h0 | cold-process | 0/320 | n/a/n/a | 320/0 |
| timing | nissy-h48h0 | warm-request | 0/320 | n/a/n/a | 320/0 |
| timing | vcube-104 | cold-process | 0/320 | n/a/n/a | 320/0 |
| timing | vcube-104 | warm-request | 0/320 | n/a/n/a | 320/0 |
| timing | vcube-108 | cold-process | 0/320 | n/a/n/a | 320/0 |
| timing | vcube-108 | warm-request | 0/320 | n/a/n/a | 320/0 |
| timing | rubend-default-exact | cold-process | 0/320 | n/a/n/a | 320/0 |
| timing | rubend-default-exact | warm-request | 0/320 | n/a/n/a | 319/1 |
| structural | nissy-h48h0 | warm-request | 179/181 | 12.514/16.907 | 2/0 |
| structural | vcube-108 | warm-request | 180/181 | 11.158/12.492 | 1/0 |
| structural | rubend-default-exact | warm-request | 175/181 | 6.3/9.341 | 6/0 |
| long | nissy-h48h0 | warm-request | 0/32 | n/a/n/a | 32/0 |
| long | vcube-108 | warm-request | 5/32 | 2507.229/4939.839 | 27/0 |
| long | rubend-default-exact | warm-request | 0/32 | n/a/n/a | 32/0 |

Compute environment is AMD Ryzen 5 5600 6-Core Processor, kernel 7.2.9, Node v24.21.0. Actor clocks exclude controller-side input-format conversion and post-run independent replay; intrinsic solver parsing and Rubend Engine validation stay inside the answer path. CPU windows include controller conversion and relevant driver work.

## Pinned implementations and notices

Rubend delivered source is c7d74d63e20dc7d90bb0865dc84edaa7952b4969, GPL-3.0-or-later. Cubing package 0.66.0 is pinned by npm integrity and vendor-module hashes, not a claimed upstream Java revision. Its package metadata is MPL-2.0 OR GPL-3.0-or-later; separately licensed vendored notices remain in the installed package. Nissy revision is 1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88, GPL-3.0-or-later, with zero optimal slack and the recorded generation-only patch.

muodov-kociemba is pinned at e2690493b43921732960cd5eeee2b1ee91922a7b. License metadata is GPL-2.0; inspect file-level grants before the build. Primary source is [the pinned upstream documentation](https://github.com/muodov/kociemba/blob/e2690493b43921732960cd5eeee2b1ee91922a7b/README.md).

vcube is pinned at 9f5bc2cce18f29437879ace825f22917f6705378. License metadata is GPL-3.0-or-later source notices; retain LICENSE and file-level notices. Primary source is [the pinned upstream documentation](https://github.com/Voltara/vcube/blob/9f5bc2cce18f29437879ace825f22917f6705378/README.md).

Standalone comparison services change process ownership and deadline handling, not upstream search algorithms. All modifications, binary hashes, flags, data hashes and preserved notice paths are in report.json. These are local comparison builds, not distribution-compatibility clearance. They are not Rubend's search engine.

## Resource scopes

CPU includes benchmark driver, sandbox and relevant descendant request windows. Warm readiness and restart CPU are separate. Charged memory is a whole-job kernel peak including the driver, not unique physical resident memory. Proportional memory is an idle snapshot, not a peak. Requested RSS sampling can miss transient processes and double-count shared pages.

| Configuration | Cold/warm CPU ms per 32-case repeat median | Charged job peak MiB median/max | Ready PSS MiB median | Warm init ms median | Cold init censored |
| --- | ---: | ---: | ---: | ---: | ---: |
| rubend-default | 31962.419/31509.746 | 171.926/172.809 | 62.687 | 283.121 | 0 |
| cubing-min2phase | 11258.872/525.994 | 159.793/161.836 | 68.813 | 289.553 | 0 |
| muodov-c | 857.62/549.891 | 102.965/103.492 | 4.772 | 8.805 | 0 |
| nissy-h48h0 | 32084.147/31946.393 | 143.703/143.953 | 30.926 | 22.104 | 0 |
| vcube-104 | 32094.925/31972.209 | 167.582/168.09 | 35.361 | 49.941 | 0 |
| vcube-108 | 32911.623/32125.128 | 460.113/460.352 | 326.286 | 180.342 | 0 |
| rubend-u00-small | 32100.336/30935.836 | 143.82/145.477 | 34.72 | 377.016 | 0 |
| rubend-u00-inverse | 31548.684/31186.297 | 2223.223/2224.445 | 2111.873 | 1891.29 | 320 |
| rubend-u00-h0 | 31589.956/31750.817 | 2223.754/2224.266 | 2111.917 | 1924.333 | 320 |
| rubend-default-exact | 32168.063/31875.433 | 172.41/173.227 | 62.738 | 285.764 | 0 |

## Uncertainty and proof limits

inconclusive-duplicate-or-work-gate. A passed duplicate gate alone is not a speedup claim. Missing completions are censored; budget-capped mean first-arrival scores are not completed-job latencies. Case-level bootstrap keeps every repeat and cohort for one input together. The paired differences and intervals are in report.json. No default or configuration was tuned on the holdout.

Known-optimum gaps are reported only for explicitly justified structural optima. Other gaps stay null. Search-established and reference-reported events are empirical contracts, not formal optimized-search certificates. Tables, binaries, revisions, modifications and notices remain pinned in the frozen metadata and upstream setup evidence.

## Reproduction and evidence

Canonical metadata value digest is 7db44c8dd10f127bcaee094bd35ffeb7b63f75ab9e6d326c0804c49b01b1db0d. The [raw report JSON](u07-final-report-v1/3-report.json.gz) contains exact counts, distributions, capped scores, gaps, uncertainty gates, case-level intervals and every canonical batch index. Each batch preserves raw parent-timestamped frames, resource receipts, source seals and worker cleanup.
