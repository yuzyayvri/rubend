# Resume small table generation across process exits

U03 requires resumable generation before seeking a large-build admission.
This unit tests that mechanism on the existing one-, two- and three-edge pilots.
It does not allocate a larger pattern or authorize a six-edge build.

The actual Bend builder already exposes one-layer steps. A thin pure module
serializes its active state and restores one owned array from admitted values.
The file boundary records source/module identity, pattern labels, goal, counts,
depth, values, a parent digest and a payload digest. Unknown fields, changed
identity, malformed counts and a fabricated completion tag refuse admission.
The worker must also match the expected digest supplied by its caller.
The digest detects changed bytes. It is not a proof of correct distances or
authorization to trust an arbitrary freshly signed payload.

Each step reads an immutable checkpoint in a fresh Node process and calls the
actual Bend-generated module. Repeating the same input must reproduce the same
result. A real worker exit with code two before output must leave the input
unchanged and produce no accepted result. The next normal worker then resumes.
Completion must equal both an uninterrupted Bend build and every value of the
existing independently audited native reference. Completed files are not
accepted as active checkpoints. This protocol is internal and experimental.

Four fresh native cases restore real one- and two-edge snapshots in memory.
They must match the JavaScript packet checksums and preserve owned-array mode.
That is native restoration parity, not native file IO restart. The cross-process
file test uses generated JavaScript. Six-edge generation will need native file
restart, aggregate scratch and audit costs before a separate admission request.
No large-database ETA follows from these small pilots.

The fixed `u03-checkpoint-v1` queue is expected to take three minutes and is
capped at ten. Compilation requests 1.5 GiB and up to four low-priority lanes.
Restart checks request 1 GiB on CPU2. The full desktop reserve remains in force.
The current 87-input root/toolchain gate is reused by exact source identity.
The new pure module gets a fresh verdict. No NP04–NP08 proof, production
pruning, cache mutation, performance promotion or final holdout is included.

## Packet-decoder recovery

V1 passed the pure verdict and module generation, then failed when the test
adapter applied the UI list converter's 10,000-item limit to a valid 10,565-item
three-edge checkpoint. The [failed archive](u03-checkpoint-v1-failed/index.json),
source snapshot and 22 partial files remain preserved. Read
[the adapter defect](../../../issues/edge-checkpoint-ui-list-limit.md).

The benchmark now has an exact-geometry decoder. The actual unchanged Bend
packet reproduces the old failure and passes full equality through the new
decoder. Six malformed or cyclic list controls and six unsupported counts
reject. The UI converter and all Bend code remain unchanged.

`u03-checkpoint-v2` reuses the passed proof and byte-identical module after
checking all pure source hashes. It reruns the changed adapter's complete
restart checks and performs the still-unrun native restoration checks.
Expected three minutes within the same ten-minute cap and resource limits.
The original run remains failed. No completed-table or native-restart result
is claimed before the recovery guard finishes.

## JavaScript restore-stack recovery

V2 passed the converter regression but reached another adapter limit.
Base `List.length` uses non-tail recursion in generated JavaScript, and the
actual 10,560-value restore input exhausted the default stack. The
[failed archive](u03-checkpoint-v2-failed/index.json) and additional pure/module,
diagnostic and 23-file snapshot preserve that run. Read
[the length-check defect](../../../issues/edge-checkpoint-js-length-stack.md).

The direct old-module restore reproduces the exact RangeError. A new
geometry-bounded tail-recursive length check passes the full actual restore
and rejects short and long inputs without changing stack settings, product
limits or the table builder. V3 freshly checks this changed pure adapter and
runs both regressions before the complete restart/native suite.
Expected three minutes within the same ten-minute cap and resource limits.
Neither failed run is reclassified. A large native format will need bounded
chunked transport rather than extrapolating this tiny list representation.

## Result

The [completed archive](u03-checkpoint-v3/index.json) verifies 2,779 source
seals and three resource receipts. The worker is gone, with no resource stop.
The changed pure adapter passes the fresh Bend/BendTT verdict. Both earlier
failures reproduce on their actual old paths. Exact-geometry decoding accepts
the full 10,565-value packet and rejects six malformed/cyclic lists and six
unsupported counts. The tail length check restores 10,560 values at the default
Node stack and refuses inputs of 10,559 and 10,561 values.

The six tiny tables complete through 34 fresh process restarts. Six repeated
inputs reproduce their result packets. Six real child exits with code two
produce no output and leave the pinned input checkpoint unchanged. Nine
altered-record controls refuse. Every completed packet equals the uninterrupted
Bend result and every audited native reference value, not only a checksum.

Four fresh native in-memory restorations match checksums 2,835,096,049,
1,288,846,037, 2,071,062,833 and 2,689,002,645. Owned-array mode passes.
The established root/toolchain gate is explicitly reused across 87 identical
inputs. The earlier two runs stay failed, including source and partial-file
snapshots. No product behavior, limit, law or table builder changed.

This establishes tiny generated-JavaScript file checkpoint/restart and small
native in-memory restoration. It does not establish native file restart,
large-profile scratch/admission costs, loaded-data admissibility or a search
speedup. Larger builds and NP04/NP05 remain separately gated.
