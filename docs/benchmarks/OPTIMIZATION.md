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
