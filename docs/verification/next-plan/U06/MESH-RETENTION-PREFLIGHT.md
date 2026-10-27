# Retained scene structural preflight

The accepted demand renderer still rebuilds 80 meshes and 26 cubie groups on
every `set`. Prototype retention separately. Keep the accepted application
untouched until correctness and browser comparison pass.

The candidate reuses the initial groups and sticker slots. Every subsequent set
removes the temporary layer group, reparents all cubies, resets canonical
positions/quaternions/scales and updates sticker materials from the Bend state.
It still allocates a temporary group for each animated turn. Zero new objects
per set must not be reported as zero allocations across all rendering work.

Compare rebuilding with retained objects before WebGL. Use the actual scene
methods and Three objects, with RAF driven at half and completed animation times.
Check all eighteen turns, including half and inverse moves, plus direct repeated
states and an update while context is lost. After each operation, check all
parents/transforms and all 54 colors. Compare identity changes separately from
canonical correctness. Deliberately disable retention, skip color updates and
drop reparenting in three actual generated candidate variants. Each must produce
the expected counterexample, not a parser or loader failure.

The generator verifies its accepted base scene against the actual-app GUI seal.
Generated variants remain private under build. No product edit, WebGL, timing
ratio, heap-byte saving or browser performance claim follows from this preflight.
Reuse unchanged proof evidence only under identical application-source hashes.
The next gate is a frozen old/retained browser comparison with pose audits and
the existing cadence/recovery floors. Operator review and deployment stay gated.

## Result

The [canonical archive](u06-retain-preflight-v1/index.json) verifies 2,152 source
seals, two receipts, worker termination and no resource stop. Both actual-method
variants pass all eighteen animations and 23 final-pose/color checks. Rebuilding
creates 80 meshes and 26 groups per observed update. Retention creates zero after
initialization and preserves the original identities through every tested update.

The three generated corruptions fail for the expected mesh-identity, color and
parent errors. These are executable counterexamples, not syntax failures. The
accepted app and its source-bound proof evidence remain unchanged. No browser,
heap-byte, CPU/GPU or latency improvement is established by this result.
