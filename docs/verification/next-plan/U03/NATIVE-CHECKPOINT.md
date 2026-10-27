# Resume tiny tables from disk in fresh native workers

The generated-JavaScript checkpoint guard and native in-memory restoration
already pass. This unit checks the remaining native file boundary without
changing the table builder, pattern size or production solver.

The host admits an immutable JSON checkpoint by its caller-pinned digest,
identity, geometry and counter checks. It writes an immutable ASCII payload
containing the four builder fields and the table values. The payload is bound
to the JSON checkpoint and current native binary in the receipt. Every fresh
native Bend process opens that payload from disk and resumes exactly one layer.
The existing generated module supplies only the initial seed, not later layers.

The native process accepts a declared size of at most 65,536 bytes. It reads
at most that size plus one and then checks EOF. It requires exactly the declared
bytes before parsing fields. A short read fails closed instead of treating a
prefix as a checkpoint. The standard pinned `File.read_bytes` uses POSIX read,
which is not assumed to fill the buffer. The file handle closes before the
builder or injected failure runs. No custom foreign effect is added.

Six real native failures after file read/close must produce no result and leave
the input checkpoint unchanged. Repeating the same input must reproduce its
packet. Every completed value and metadata field must equal the existing audited
native reference. Eleven malformed native files or request configurations must
refuse. Process exit and payload hashes are checked after every worker.

This is an internal tiny-pilot boundary. Digests are byte-integrity evidence,
not admissibility proofs. The caller supplies trusted identity and expected
digest. The native parser does not independently prove the table's distances.
No large table, search integration or speedup follows. A larger profile still
needs a multi-chunk format, measured scratch/audit costs and separate admission.

The fixed queue is `u03-native-checkpoint-v1`, expected two minutes with a
seven-minute cap. Native compilation requests 1.5 GiB and four low-priority
lanes. File-restart checks request 1 GiB on CPU2. The full desktop reserve stays
enabled. The pure adapter proof/module, audited reference payloads and 87-input
root gate are source-bound reuse. The runtime worker gets its own source-sealed
native build and owned-array check. No NP04–NP08 proof or holdout is included.

## Result

The [archive](u03-native-checkpoint-v1/index.json) verifies 2,791 source seals
and three resource receipts. The queue worker is gone, with no resource stop.
All 34 native file restarts pass. Six native failures after read/close return
the intended exit code two and diagnostic, with no answer and no changed input.
Six repeats reproduce their exact stdout. Eleven malformed native requests
refuse. Every native owner is gone after its wait completes.

All six completed tables exactly match the previously audited native values
and metadata. The largest derived payload is 42,246 bytes under the 65,536-byte
limit. All checkpoint, payload, result, binary and source identities match.
Owned-array mode passes. The current pure adapter and the unchanged 87-input
root/toolchain gate are explicitly reused, not freshly proved.

This closes the tiny native file-restart observation gap. It does not provide
a large multi-chunk format, six-edge generation ETA, scratch/admission estimate,
universal distance theorem or production pruning. The final holdout is untouched.
No general solver performance or independent-review claim is made.
