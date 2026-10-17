# Packed small-table pilot

The coordinate-frame experiment is rejected and absent from this source tree.
This pilot changes table storage only. It must preserve every used transition
and distance exactly, keep the default engine's source graph unchanged, and
measure actual ready-state RSS, startup, search time, and answer quality.

The existing small array allocates 8,388,608 U32 words, or 32 MiB. Its 891,780
transition entries fit sixteen bits. Its 4,031,685 used distances fit four bits
in the existing audited data. Their packed lengths are 445,890 and 503,961 words.
The sum, 949,851 words, fits a 1,048,576-word array, or four MiB. This is an
eightfold array-allocation hypothesis, not an observed process-memory result.

One design adds layout constructors and per-child or per-slice access dispatch
to the shared engine. It keeps one source body, but expands the default search
program and can add matching or ownership traffic in hot code. The rejected
frame experiment showed that removing fields does not guarantee a faster
expanded Bend program. Do not assume inactive alternatives are free.

The selected design generates a separate packed small-tier search, portfolio,
runtime, table builder, and fixed-work observer from authoritative files. Exact source-pattern checks
permit only import routing, packed table access, small-profile geometry, and
small-table generation changes. A stale generator fails instead of silently
forking behavior. The default search imports no packed variant. Duplication is
intentional to keep the default compiler graph intact and the transforms auditable.

The reference codec remains handwritten pure Bend. It owns its source and target
arrays. It checks source geometry before any wrapping index, validates every
transition at most 65,535 and every used distance at most fifteen, and rejects
failure with a nonmatching output geometry. The runtime rejects that before
ready. The three unused final nibbles and remaining tail words stay zero.
The production builder creates packed transitions and distances directly. It
does not allocate an unpacked temporary table. Its BFS uses nibble fifteen as
unknown, and rejects before assigning a distance of fifteen. The current audited
maximum is fourteen. Checked setters reject geometry, index, and value overflow.
Initialization keeps unused nibbles and tail words zero. Only the small profile is accepted by the generated search. Other profile
initializers fail geometry admission, rather than treating packed data as raw.

The hot path uses dedicated transition and distance getters without a per-read
layout branch. Generation and validation happen once. Full used-entry equality,
malformed inputs, field boundaries, shallow optima, independent replay, fixed-
work equality, BendTT, and full regression precede promotion. No new theorem is
added and no existing law is weakened. The packed pure modules must be in the
proof dependency graph. Loaded-data and completeness bridges remain unfinished.

Memory-tier acceptance requires at least thirty percent lower observed native
RSS, no coverage loss, and no worse canary deadline lengths. Report any startup
or search-time cost explicitly. A speed promotion separately needs the existing
ten-percent repeated end-to-end gate. Keep a slower memory option opt-in.
No large cache, new foreign effect, GPU, external solver, or visible window is used.

The first in-worker packing pilot passes all 1,630 shallow jobs but increases
ready RSS from 43,776 to 47,876 KiB. The temporary table's resident footprint
remains after logical consumption. The exact allocator mechanism is not proved.
That version is rejected for memory, and its source/binary are preserved.

Direct construction then matches every one of the reference's 1,048,576 packed
words. The reference codec independently matches all 4,923,465 used raw entries.
Five fresh pairs pass 1,630 shallow optima. After those jobs, native RSS is
43,948 KiB for control and 15,276 KiB packed, a measured reduction of 28 MiB.
Native HWM shows the same figures. This excludes Node and browser memory.
Startup median rises from about 221 to 313 ms, with a 453-ms packed outlier.
It is an opt-in memory trade, not a speed win. Fixed-work equality, full regression,
and matched-deadline quality are still pending at this design checkpoint.

The quality-comparison boundary expands to explicit generated-table profiles
in the existing warm comparison tool. Cached profiles retain their requirements.
Generated profiles must not claim a disk cache. Mixed table sources are rejected.
Reuse the existing deadline, replay, and cleanup checks, with fixtures for the
new source variant before measuring it.
