# Measured optimization work

Started 2026-10-17 at `9924b25`. The user requested min-maxing and frequent
commits. Keep experiments local, hidden, low priority, and within the existing
8-GiB / two-core / 30-minute-per-batch envelope. No publication is authorized.

## First objective

Reduce the larger engine's 2-GiB allocation and roughly 10-second startup without
weakening a single pruning distance. The baseline remains the audited raw joint
table and the raw engine's frozen experimental build identity. Preserve that
cache and binary; do not overwrite the only known-good baseline.

Hypothesis: adjacent coordinate entries have small enough distance ranges to
encode many blocks as exact two-bit deltas from their minimum. Other blocks
retain exact four-bit distances. One metadata word per block selects the
representation and word-aligned payload address. Measure full-table block
statistics before selecting a layout; do not assume compression or speed wins.

Acceptance requires codec boundary tests, every-entry equality against the
audited 2,217,093,120-state reference, unchanged shallow optima, and matched
warmup/resource comparisons of solution quality, search work, latency, startup,
and memory. Equal pruning values are necessary but are not alone evidence of
faster solving. Reject a speed regression instead of concealing it in a mean.

Do not sum overlapping heuristics, weaken established laws, reinterpret timeout
as optimality, add foreign search, or apply other-axis bounds to fixed-axis
phase-one reduction. Existing proof limitations remain explicit.

## Layout measurement

Two complete scans of the pinned raw cache agree on all block statistics; an
independent small-fixture implementation checks the profiler's range counts and
chunk boundaries. Blocks of 64 are the first candidate: 31,538,304 narrow and
3,103,776 wide blocks, or 91.04% narrow. The projected cache is 742,502,016 bytes;
including the small-table prefix it needs 776,056,448 logical bytes, fitting one
1-GiB Bend array. This is a measured layout estimate, not yet a successful codec
or faster solver. Blocks of 128 are a close alternative and remain an experiment
if two-read lookup locality is unfavorable.

Raw statistics and resource records are in `docs/verification/optimization-v1/`.

## Codec checks

`src/block-table.bend` encodes narrow blocks with a base and two-bit deltas;
wide blocks retain the original nibbles. A metadata word stores the base, width,
and word-aligned payload address. The codec remains pure affine Bend.

851,968 word patterns cover all 65,536 two-bit patterns at 13 bases. Native and
generated-JS checks pass, including 13,631,488 decoded fields. A 65,536-entry
mixed-block fixture checks all lookups at a nonzero storage base, metadata
addresses, capacity rejection, and invalid-distance rejection. These are finite
tests and a successful independent type/proof gate, not a new universal law or
the full-table acceptance check. The existing 18 laws are unchanged.

## Pause state

The full conversion matched every raw entry and retained entry fingerprint
1448581281. The block cache is 742,502,016 bytes with word fingerprint 3919871918
and SHA256 `ed938e76a8d21ba7d6bb95cee1b3eb26fbaa48897c86d986bb044fb01bb7fc3e`.

The preliminary one-pass layout comparison measured fewer search steps and one
worse answer for the block format. It is not promoted for speed. Pstack routing
arrived afterward and requires repeated measurements before a final verdict.
An unreported gprof run identified byte-list construction, reference-count
wrapping, and decoding as hot routines. The instrumented profile is not a
startup speedup measurement.

The user paused the work at 7% usage. The word-reader and search refinements are
WIP. Word-reader fixtures passed 32 cases, including native sanitizers and
forced partial reads and interruptions. The architecture cross-judge and full
regression gates remain open. Follow `.audit/rubend-startup.todo.md` and the
canonical `.audit/rubend-startup.tsv` trail on resume.

## Resumed measurement

The measurement harness is frozen after independent Luna review and 30 fixture
cases, including 97 worker cleanup checks. A known 100-ms ready delay separates
the fixture distributions. Measurement errors and failed shutdowns cannot enter
the successful medians.

Five fresh raw baseline workers reproduced the startup cost. Median ready time
was 9,212.97 ms, range 9,135.33 to 9,280.56 ms. All five checked solved replays
passed with zero run or batch errors. Native observed peak RSS was 2,147,348 KiB
in every run. The complete host SHA256 pass before each worker intentionally
warms the file cache. Including that validation, median time was 10,156.58 ms.
This is a reproduction baseline, not a comparison with a tuned alternative.

The bounded batch used one low-priority core, took 53.8 seconds, and peaked at
2,273,780 KiB aggregate RSS under its 3-GiB ceiling. The profile identifies
byte-list construction, decoding, and reference-count operations as the main CPU
work. Instrumented profile times are not included in the five-run median.
Raw evidence is `docs/verification/optimization-v1/startup-baseline-five.json`.

## Repeated startup result

The experimental raw initializer is accepted after independent correctness,
evidence, trail, and comment reviews of `e6d5e6f`. No performance change is
promoted into the default small-memory application. The review record is
`.audit/rubend-startup-approval.md`.

After tuning eight configurations, a separate alternating confirmation compared
the untouched original, the best tuned byte loader, and the word loader. Each
profile used five fresh workers with the same sealed raw cache. The original's
median was 9,413.19 ms, range 9,226.22 to 9,470.85 ms. The word loader's median
was 1,849.06 ms, range 1,819.68 to 1,856.63 ms. That is 80.36% lower ready latency,
exceeding the 50% target. Including host SHA256 validation, the medians were
10,337.26 and 2,769.72 ms, a 73.21% reduction. These are warm-file-cache native
engine timings, not cold disk or browser startup.

All 55 tuning and confirmation runs returned checked solved answers with zero
run or batch errors. Cache, binary, metadata, and measurement-source identities
remained stable. The confirmation batch took 126.25 seconds and peaked at
2,263,344 KiB aggregate RSS under its 3-GiB ceiling. Native observed peak RSS for
the word profile was 2,142,072 KiB. Its owned lookup array still occupies 2 GiB.

The eight-profile matrix found 65,536-word byte chunks best among 16,384,
65,536, and 262,144. At 65,536 words, direct placement reduced the median from
9,538.03 to 9,435.51 ms. The small isolated placement gain is not a demonstrated
win over the untouched original. Holding direct placement and chunk size fixed,
word transport reduced 9,435.51 to 1,864.62 ms. Increasing word chunks to 262,144
reduced that median to 1,835.15 ms. The existing 1-MiB scratch cap is retained.

The separate instrumented word-loader profile shifts sampled user CPU work to
the Bend fingerprint, small-table generation, and complete-chunk publication.
It does not provide precise wall-time fractions for kernel allocation or waits.
No profile-instrumented timing enters the medians.

The full development and independent proof checks pass. Frozen/current
fixed-work comparisons match all 4,591 semantic snapshots per side, including
all 163 raw-profile shallow optima and 3,907 certified, independently replayed
candidate snapshots. See `docs/verification/FIXED-WORK.md`. These finite checks
do not prove general search completeness, foreign IO correctness, or equal
solution quality under every wall-time budget. This batch does not establish
world-class strength. The Nix package checks have not been rerun for this WIP.

Raw runs are preserved as compressed JSON next to
`startup-eight-profile-summary.json` and `startup-confirmation-summary.json`
under `docs/verification/optimization-v1/`. Each summary records archive hashes,
counts, conditions, limits, and distributions. Binary build manifests preserve
the exact source graphs. Reproduce with `bench/startup-compare.json` and
`bench/startup-confirm.json` through the bounded runner.

Block compression remains rejected for the speed profile. One new performance
unit is accepted, bounded word transport into the final raw-table positions.
Chunk tuning retains the existing one-MiB scratch setting. The Sol correctness
review and Luna evidence/comment review close the four startup gates.
The next experiment checks matched-budget warm solving quality and work rate.
Any later startup work must preserve validation and keep search mathematics in
Bend. Packaged-app performance still needs its separate package checks.
