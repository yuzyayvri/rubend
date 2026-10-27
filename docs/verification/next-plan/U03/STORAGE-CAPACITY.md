# Full-capacity synthetic storage preflight

Static byte counts are not resident-memory or IO evidence. This fixed preflight
allocates the planned 67,108,864-cell capacity and writes 42,577,920 words using
the existing chunked native IO. It does not build a pattern database.

Every word is `((index*1664525+1013904223) | 0x80000000)` modulo 2^32.
All words are at least 2^31, so none is a valid distance. The worker imports no
cube model, coordinates, search or builder. Synthetic files have a separate
`.synthetic-u32` extension and stay outside every solver-cache directory.
No BFS, cube-distance construction or solver request runs.

One native process allocates and fills the entire capacity, fingerprints the
logical prefix and writes a fresh 170,311,680-byte file. A second fresh native
process allocates the same capacity, loads the first file, fingerprints it and
writes a second file. Both payloads must agree byte-for-byte. An independent
streaming host check verifies all 42,577,920 words in each file, its digest and
the consumed native checksum. It retains partial-word tails across short reads.
Five odd and even stream sizes and five malformed tiny fixtures check the reader
before full-capacity work. Another 4,102 arithmetic cases check generated Bend
against the host formula. New pure pattern definitions receive a fresh verdict.

GNU Time records each whole native command. CPU and RSS include allocation,
fill or load, fingerprint, save, stdout and disposal. Host validation is outside
those counters but inside the outer aggregate resource receipt. The native
maximum RSS is not aggregate tree RSS. File-cache state is uncontrolled.
The two stages perform different work and are not a speed comparison.
One planning run cannot establish throughput, BFS peak memory or an audit ETA.

The fixed raw pair occupies 340,623,360 bytes. Admission requires that space plus
one GiB of free disk headroom and checks the reserve again after each command.
Files are immutable and retained. No cleanup or user-file deletion is needed.
The four-edge checkpoint and prior native helper evidence are reused. This is
a bounded local memory and IO test, not authorization for a full six-edge table,
its independent audit, NP04/NP05 proofs, pruning or production integration.

The batch is `u03-storage-capacity-v1`, expected three minutes with an eight-minute
cap. Compile uses at most 1.5 GiB and four low-priority lanes. The two serial
native commands and host checks use CPU2 under a one-GiB aggregate ceiling.
No browser, cloud, GPU, new foreign effect, holdout or publication is included.

## Result

The [canonical archive](u03-storage-capacity-v1/index.json) verifies 3,026 source
seals and three receipts, worker gone and no resource stop. All 4,102 arithmetic
cases, five stream sizes and five malformed-payload controls pass. Both complete
42,577,920-word streaming checks pass. The payload digests and native checksum
3,646,688,709 agree, and the original input remains unchanged.

The [writer CPU record](u03-storage-capacity-v1/write-cpu.json.gz) records 1.00 s
CPU and 1.00 s wall, with 269,112 KiB maximum native RSS. The
[rewriter CPU record](u03-storage-capacity-v1/rewrite-cpu.json.gz) records 1.53 s
CPU and 2.05 s wall, with 269,324 KiB maximum native RSS. These are different
whole-command workloads in one planning run with uncontrolled file caches.
They are not paired timings or a speed comparison.

The outer storage job takes 6.679 s and peaks at 443,160 KiB aggregate tree RSS,
including host verification. Both 170,311,680-byte synthetic files remain under
build, totaling 340,623,360 bytes. No cube distances, BFS or search were executed.
The pure pattern verdict and emitted unboxed owned-array checks pass.
Unchanged 87-input root evidence is explicitly reused.

This closes the synthetic capacity and IO observation gap. It does not measure
full BFS scratch, six-edge generation or independent audit time, admit a large
database build or discharge NP04/NP05. No production change or speedup is claimed.
