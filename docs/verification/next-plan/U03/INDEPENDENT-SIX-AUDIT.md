# Independent complete distance-graph audit

Pattern zero now passes the complete independent reference-graph audit. This pass checks its complete projected graph
with a different implementation while continuing pattern-one generation in a
separate serial job. Existing cubing is reused as an oracle, not relabeled as
the additional competitor research requested for after roadmap completion.

## What the audit checks

The auditor uses pinned KPuzzle move actions, independent bitset-based partial
permutation ranking and a separate decoder. Four fixed disjoint position ranges
cover all 665,280 position permutations and all 64 orientations. Every one of
42,577,920 states and 766,402,560 directed moves is checked.

Valid distances are nonnegative integers below the unknown sentinel. The goal
is the only zero. Every edge satisfies `h(u) <= h(v) + 1`. Every non-goal has a
successor with distance exactly one less. The edge and decreasing-successor
conditions are both necessary. Together with goal identity they check exact
distances in this independently implemented finite graph, not arbitrary loaded
data or full-cube projection correctness by assertion.

The actual unchanged Bend codec is also reflected at orientation zero and all
ones for every position, 1,330,560 cases. Its orientation-zero moves are compared
for every position and generator, 11,975,040 transitions. The distance checks
cover every orientation, but those concrete reflection counts are not a
universal symbolic U32 or projection theorem. NP05/refinement stays explicit.

The coordinator requires exact range coverage, counts, no errors, one global
zero, matching histograms and a separate serial file checksum. It verifies
worker exit identities. Worker JSON, stdout, stderr, hashes and resource data
are retained. Four ordinary local Node processes are not LLM subagents.
The full-distance payload remains unchanged.

## Verify the verifier first

The same auditor is checked against the previously fully audited four-edge
table, all 190,080 states and 3,421,440 directed edges. Malformed distances,
missing/extra goals and an invalid U32 value must fail. One fixture collapses
all non-goal distances to one, satisfying edge inequalities but lacking most
decreasing successors. Another increases a selected distance while preserving
all decreasing successors, violating edge inequalities only.

Two actual source variants remove one of those checks. They accept their
corresponding bad fixtures while the ordinary validator rejects them. Keep
those counterexamples and mutated source bytes in the report. This establishes
that a passing status is not inferred from monotone file generation alone.

## Bounded combined queue

`u03-six-cycle-v1` prepares these controls, continues pattern one from its
independently checked depth-three checkpoint, audits pattern zero, and confirms
both records. The native binary, native proof and passing counter-model evidence
are reused. Pattern-one limits are the same eighteen calls and depth twenty,
with a twenty-two-minute job cap under 3 GiB on CPU2. Completed layers remain
durable if it stops. Its output remains built-unverified.

The first-table audit has a four-minute cap under 2.5 GiB and four admitted
nice-10 lanes. Each worker has a bounded V8 heap and reads the same immutable
payload. Preparation and confirmation have ninety-second caps. The declared
job ceilings total twenty-nine minutes, leaving launcher overhead within the
thirty-minute batch limit. All desktop reserve, no-swap and pressure guards
remain enabled. A failed job stops the queue and preserves partial work.

The raw whole-command CPU observer includes the coordinator and waited audit
workers. Individual worker CPU windows and the outer process-tree RSS have
different scopes. Generation and audit do different work. No speedup or scaling
ratio follows from these measurements. This is one resource-planning execution,
not an alternating solver benchmark.

Complete old input paths and actual source, artifact, data, oracle and successful
receipt identities are sealed. No native generation code changes. A successful
data audit does not enable pruning, prove NP05 or certify optimized traversal.
The final holdout, peer setup and publication remain untouched. Work is solo;
independent review is not run.

## Verified first audit and second build

The [combined archive](u03-six-cycle-v1/index.json) verifies 3,577 source seals
and four receipts. The queue worker and all four audit workers are gone.
No resource stop occurred. Preparation passes the complete four-edge baseline,
four invalid-data controls and both actual missing-check source faults.

Pattern zero passes all 42,577,920 distance domains, 766,402,560 directed edge
inequalities and every non-goal decreasing-successor check. There is exactly
one zero, at goal 399,936. Its maximum distance is ten. All 665,280 position
roundtrips, 1,330,560 actual Bend JavaScript codec endpoint reflections and
11,975,040 zero-orientation transition reflections pass. The independent
serial histogram and weighted checksum agree. The payload is unchanged.

The whole audit command takes 59.93 s wall and 215.50 s CPU in this single
planning run. Its resource scope peaks at 2,111,332 KiB aggregate tree RSS.
GNU Time reports 473,784 KiB maximum child RSS, which is not the aggregate.
Neither result is an engine-speed or parallel-scaling comparison.

Pattern one also completes eight accepted native continuations from depth
three, reaching and expanding all 42,577,920 entries at terminal depth ten.
Its final payload SHA is
`d9d572142a8675ff00f86d68051a02066ed403daa40e3f8de1d4622809c15b31`.
The continuation consumes 928.44 s native CPU with 271,412 KiB maximum native
RSS. The host-inclusive job takes 943.710 s and peaks at 422,956 KiB tree RSS.
Eight retained raw payloads total 1,362,493,440 bytes. This is not a fresh-seed
timing. The second table remains built-unverified until its own graph audit.

The certificate establishes exact distances in the independently checked finite
graph, with the concrete reflection scope above. It does not establish the
universal legal-cube projection bridge, native backend reflection or NP05.
Pruning remains disabled. Reuse this passing first audit and both complete
builds rather than regenerating them. The next unit audits pattern one and
checks the approved NP05 theorem with its actual remaining premises explicit.
