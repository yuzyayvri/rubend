# Advanced exact-search profile: bounded experiments

## Final selected status, October 27

The [frozen comparison](../verification/next-plan/U07/COMPARATIVE-RESULTS.md)
retains the delivered default and preserved optional controls. It does not
promote a new default, GUI tier selector or larger exact tier. Existing optional
profiles have prior native exact known-case smoke evidence. The final H0 and
inverse holdout controls use fast/improvement contracts, not a newly measured
larger exact contract. The same delivered default binary has a separately
reported exact-request contract.

| Configuration | Warm initialization median ms | Whole-job charged peak median MiB | Idle ready PSS median MiB |
| --- | ---: | ---: | ---: |
| Delivered default | 283.121 | 171.926 | 62.687 |
| Preserved small | 377.016 | 143.820 | 34.720 |
| Preserved H0 | 1,924.333 | 2,223.754 | 2,111.917 |

These are five-cohort timing-job measurements under a four-GiB cap, not unique
physical-memory peaks or native-only CPU figures. PSS is an idle snapshot.
All 320 process-cold H0 and inverse requests exhaust their one-second budget
before readiness. The frozen noise/work gate is inconclusive, so warm first-
answer observations do not establish a general speedup or justify promotion.
Reuse the source-bound binaries, caches and evidence. No rebuild is needed.

The remainder preserves the earlier rationale, probes and optional build recipe.
Those historical observations do not replace the final report's scopes or gates.

Yuzy approved the envelope below on 2026-10-17 with “Yes. Keep working.”
Approval covers local experiments within these limits, not publication or
system changes. The earlier probe below remains a historical measurement.

The first joint-table experiment is complete. Use
[`JOINT.md`](../verification/JOINT.md) for measured results, data audits,
resource enforcement, and remaining limitations. The sections below preserve
the original rationale and probe; h0 has since been generated and smoke-tested.

The current product is a small-memory Bend implementation. It does not use a
foreign solver. Four audited pruning tables have maximum distances 9, 9, 14,
and 12; only the first two support the full 18-move exact traversal. That bound
is too weak for consistently fast optimal solving of difficult random states.

A bounded three-case diagnosis with 2-second budgets established lower bounds
around 12 while retaining valid 19/20-move answers. These are incomplete search
intervals, not shortest-path certificates. Superflip is a useful hard-tail
check: the current small-memory engine found a verified 21-move answer in
roughly 1.5–2 seconds, not its known 20-move optimum. These timings are preliminary.

## Prepared reference, no large allocation

Nissy was inspected and compiled only in the ignored reference cache at
`.cache/nissy-reference`. Its source is pinned to
`1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88`, GPLv3-or-later. The metadata-only
`solverinfo` command reports:

| Profile | Data bytes | Approximate GiB |
| --- | ---: | ---: |
| h48h0 | 31,683,944 | 0.030 |
| h48h7 | 3,793,842,344 | 3.533 |
| h48h8 | 7,585,624,040 | 7.065 |

The current parser accepts `h48hN`, not the older `h48hNkK` spelling found in
some upstream documentation. These figures do not include generation scratch
space or the host application.

A deliberately bounded h48h0 generation probe used one low-priority CPU
thread, a 256-MiB virtual-memory ceiling, and a 10-second timeout. It computed
7,437,855 short positions but did not finish the table. The empty placeholder
file was removed. No reference solve or H48 performance claim results from
that probe. Profiles h7/h8 were not generated, allocated, or downloaded.

## Proposed next experiment

Investigate symmetry-reduced joint phase-one and H48-style bounds in Bend.
Prefer the smallest sufficient representation; a memory allowance is a ceiling,
not a target. Keep generation and search in Bend. Nissy remains an independent
oracle and competitor, never a hidden product backend.

The raw joint phase-one space contains 2,217,093,120 states. Four bits each are
1,108,546,560 logical bytes before allocation padding, frontiers, and lookup
metadata. Symmetry can reduce this substantially, but handling stabilizers,
compressed-distance semantics, and proof/data obligations is material work.
Do not copy a large table and call its hash an admissibility proof.

Approved envelope for follow-up experiments:

- At most 8 GiB RAM, including scratch space.
- At most two CPU cores, with lowered scheduling priority.
- At most 30 minutes per explicitly approved experiment batch.
- Local-only computation and cache files; no cloud/GPU stack or publication.

Recheck available memory before each run and enforce the limits. Stop cleanly
on the time/memory limit, preserve a valid checkpoint where supported, and
report incomplete work. Larger memory, longer runs, or cloud compute would
require a new decision. No completion time or performance win is promised.

Read-only metadata can be reproduced after compiling the pinned reference:

```sh
cd .cache/nissy-reference
./run solverinfo -solver h48h0
./run solverinfo -solver h48h7
./run solverinfo -solver h48h8
```

Do not run `gendata` or `solve` there without checking their resource behavior:
the reference CLI can automatically generate missing solver data.

## Optional packed small tier

The packed small backend keeps the small solver's bounds and move order. Its
native process uses about fifteen MiB instead of forty-three in the five-pair
check. Its table allocation is four MiB instead of thirty-two. Startup takes
about ninety-two milliseconds longer at the median. The sixty deadline-quality
pairs tie. This is an experimental memory option, not a stronger solver or a
default change. Read [the evidence](../verification/R03-SMALL.md).

Build and run it locally without opening a window:

```sh
nix develop --command just build
nix develop --command node bench/build-experiment.mjs src/small/main.bend build/rubend-small
RUBEND_BINARY="$PWD/build/rubend-small" nix develop --command node apps/server.mjs
```

It generates its own packed table. It needs no joint-table cache. Stop the
server normally when finished. Current development resource authority is in
[the resource policy](RESOURCE-POLICY.md), which supersedes the older envelope
recorded above. Browser/package rollout and independent review remain separate.
