# Audit a small four-edge generation pilot

The two fixed four-edge label sets are `[0,2,4,6]` and `[1,3,5,7]`, prefixes
of the existing frozen six-edge patterns. Each has `12*11*10*9*16 = 190,080`
logical states. Its one owned array allocates 262,144 U32 slots. Both complete
byte payloads total 380,160 bytes, before runtime and audit scratch.
This is a small resource-planning pilot, not the 42,577,920-state six-edge build.

The actual generic Bend builder remains unchanged. A new isolated entrypoint
supplies count four and checks actual array capacity before seeding. An actual
native source mutation allocating half the required capacity must fail before
the seed and emit no distance payload. The normal native output is separately
parsed into ignored raw `.data` files. Only summaries and hashes enter Git.

The independent checker derives all eighteen transports from pinned KPuzzle
semantics. It checks every four-edge codec and transition, then constructs
complete independent FIFO BFS distances for both goals. Every native byte,
zero, neighbor inequality, decreasing path and inverse transition must agree.
Changed-byte, missing-byte and wrong-goal controls must reject.

## What the cost records can support

The predeclared claim is a single observed cost for this exact small build and
its independent audit. The native generation interval ends after completed
traversal and before serialization. The parent execution interval also includes
serialization, parsing and payload writes. Separate resource receipts include
the generator controller and native child together, and the independent audit
separately. Neither receipt is mislabeled as native-only CPU or memory.

This is one fixed sequential run, not an alternating speed comparison or a
configuration choice. There is no variance estimate, accepted speedup or stable
throughput claim. Larger coordinates, allocation, IO chunks and audit costs can
scale differently. Do not multiply a small-table timing into a six-edge ETA or
use this run as large-build approval. Conditional information remains a separate
question after all distances pass their audits.

The queue `u03-four-edge-v1` is expected within three minutes and capped at ten.
Compilation requests 1.5 GiB and four low-priority lanes. Generation uses
512 MiB on CPU2, independent audit 1 GiB on CPU2, with the full desktop reserve.
Existing data and production code are untouched. No NP04–NP08 theorem,
production pruning, larger profile, comparison holdout or publishing is included.

## Result

The [archive](u03-four-edge-v1/index.json) verifies 2,805 source seals and four
resource receipts. The worker is gone, with no resource stop. All 190,080 codec
cases and 3,421,440 transitions agree with independent geometry. Both complete
distance audits cover 380,160 states and 6,842,880 edges, with decreasing paths
for every non-goal and inverse transport on every edge. Both diameters are eight.
The goals are 1,776 and 19,216. Their identical distance histograms are
`[1,12,138,1440,11009,51100,96002,30338,40]`.

The actual half-capacity native source mutation refuses before seed. Changed
distance, missing-byte and wrong-goal controls all reject. The two ignored byte
payloads total 380,160 bytes. Their SHA256 values and generation provenance are
retained in the archived records. The payloads are not committed tables.

This one sequential planning run records 2,984 ms and 2,839 ms inside native
generation, excluding serialization. The complete generation-controller job
takes 5,990 ms and samples peak aggregate tree RSS of 145,328 KiB. The separate
independent audit job takes 24,575 ms and samples 188,184 KiB. These are single
observations, not repeated speed measurements, allocator-only memory or a
six-edge prediction. Controller and child memory are included.

The archived plan's scope mentions CPU records, but the actual resource runner
records CPU affinity and limits, not consumed CPU time. Measured CPU time is
unavailable for this run. It is not inferred from wall time or reconstructed
after process exit. Read [the metric gap](../../../issues/resource-cpu-accounting-gap.md).
The raw archives retain their original wording and values. No speedup,
configuration winner, large-build admission or production change follows.
