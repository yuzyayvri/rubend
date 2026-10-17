# Coordinate-only subgroup frames

This solo pilot changes representation, not heuristics or ordering. Keep R02's
inverse treatment separate. The forward-only R01/R02 kernel is the control.
The user prohibits agents, so the two alternatives below are sequential designs,
not independent reviews. No independent acceptance gate is closed.

Current Subgroup Node frames contain a full packed cube, three permutation
coordinates, remaining depth, canonical-move state, and path. Child creation
updates both cube and coordinates. Subgroup goals and all subgroup estimates
read only coordinates. Candidate replay starts at Meta.root with the stored
path. Retry frames keep the phase-one entry and contour schedule.

The first alternative skips cubie turns while keeping the original Node shape
and a stale entry cube. This is a small mechanism probe, but leaves misleading
state and all cubie fields in every frame. A later edit could accidentally use
that stale cube. Reject this shape for the implementation.

The selected alternative adds a flat SubNode variant with only a, b, c, left,
previous, next, path, and length. A dedicated coordinate-only step reads the same
three transitions and two bounds and uses the same canonical move condition.
It records a candidate through the existing replay boundary. Retry still holds
its entry cube for the control kernel. Removing Retry's cube is a later separate
representation experiment, not bundled into this one.

LightCoordinates and RawCoordinates select the pilot at Retry dispatch. They are
flat zero-field profile variants, so no new copied policy object is carried per
transition. Their table geometry and bounds match Light and RawJoint exactly.
The default app and existing profiles remain unchanged. Do not combine this with
RawInverseThree until both treatments have separate evidence.

The new frame cannot represent a full-cube goal or carry a misleading cube.
It is a subgroup frame by construction. No domain law, table byte, goal, pruning
rule, depth contour, move order, path reconstruction, or work-step count changes.
The source boundary expands only to search, explicit benchmark entrypoints,
fixed-work frame observation, coordinate-refinement checks, and these records.

For semantic comparison, fixed-work observation reconstructs a SubNode's abstract
cube from its task's Meta.root and reversed path, outside timed search. It emits
the same complete frame schema as the control. A separate checker independently
replays facelets and verifies all subgroup coordinates before equality. No
coordinate, path, bound, or work counter is masked. Serialization reconstruction
must not be included in a kernel timing claim. Native timers end before it.

First run matched fixed-work light and raw traces, all 163 shallow optima,
coordinate refinement, negative fixtures, full regression, and BendTT. Only then
run five alternating equal-work CPU/native-time pairs and deadline canaries.
Keep the pilot only if end-to-end savings clear the ten-percent rule with no
coverage or canary-quality loss. Otherwise preserve the negative evidence and
remove or isolate the implementation. Table packing and owned stacks are later
independent hypotheses.

The first implementation passes all 4,607 semantic snapshots, 77,182 frame
refinements, and full regression, but fails the equal-work timing gate against
R01. CPU ratios are 1.1838 fast and 1.1471 exact over five fresh cohorts.
Do not promote it. A same-source legacy-frame control is measured separately
to distinguish active subgroup overhead from inactive dispatch/code-layout cost.
That comparison produces CPU ratios 0.9888 fast and 0.9968 exact. It does not
meet the ten-percent gate or identify a compiler limiter. The source-level
coordinate simplification alone does not explain the earlier R01-relative gap.

The second implementation removes reusable whole-frame aliases from its hot
helpers. It destructures and reconstructs flat fields like the original Bend
kernel. This tests the specific hypothesis that retained Data boxes and their
reference counts prevent fusion or cheap ownership reuse. It is not a proven
cause yet. Preserve the first binary, source snapshot, and full measurement.

Both versions fail the ten-percent whole-search gate. Version two's CPU ratios
are 1.1922 fast and 1.1491 exact versus R01. The alias hypothesis is not supported
as a useful fix. Keep the unchanged main representation and preserve the rejected
source separately. The next hypothesis packs small-table values, not frames.
