# NP04 result path collides with build metadata

Status. Resolved in the verified `u03-np04-v2` recovery. The failed v1 evidence
and unchanged build metadata remain preserved.

The [preserved failure](../verification/next-plan/U03/u03-np04-v1-failed/index.json)
verifies 3,349 seals and three executed receipts, worker gone with no resource
stop. Both proof checkers, twelve actual negative-proof entrypoints and native
compilation pass. The oracle process exits successfully, but its result is not
accepted or retained because the following exclusive write fails.

`build-experiment.mjs` owns `native.json` beside binary `native`. The oracle
wrongly attempts to put its scalar counters at that same path. `flag: wx`
correctly raises EEXIST. The original build metadata remains intact with its
recorded hash. This is an artifact-owner collision, not a proof rejection or
codec counterexample. Removing exclusive creation would destroy provenance.

The result now has its own `native-result.json` destination. A runtime check
requires the result path to be absent from the immutable build-artifact map.
Explicit binary and proof-module paths select reused artifacts in a fresh run.
The regression retains the real EEXIST diagnostic and checks the original
metadata identity plus disjoint destinations. All Bend, proof, primitive,
finite cases, counters and acceptance requirements remain unchanged.

Recovery reuses the actual passing proof, all twelve rejected entrypoints and
the native build after source/artifact/resource hash verification. The original
proof report and native metadata are also compressed beside the failed index.
The emitted BendTT, JS and mutation sources remain intact and are bundled in
the recovery evidence. No unchanged proof or build is rerun.

The recovery verifies 3,379 seals and three receipts, worker gone and no stop.
All 193,545 scalar comparisons pass with matching native/host checksum
256,391,068. The real collision regression passes. The source and artifact
hashes confirm no proof or codec change, no overwritten metadata and no repeated
compilation. Result and build provenance now have separate owners.
