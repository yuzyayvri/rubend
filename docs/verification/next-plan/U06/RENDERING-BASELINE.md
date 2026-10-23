# Actual-scene rendering baseline

Measure the unchanged `CubeScene` before changing demand scheduling or retaining
its meshes. A small browser fixture imports the same source and pinned Three
dependency as the app. It uses the existing compiled Bend model for face turns.
It does not start a native solver or pretend to verify the full application.

The alternative was full-app instrumentation through a proxy. Start with the
isolated scene because the native owner's large allocation and unrelated app
work are not needed to establish actual draw submissions or object rebuilds.
Application playback/recovery and operator interaction review remain later gates.
This is a solo sequential design, not independent review.

`bench/render-baseline-spec.json` freezes five cohorts. Each has a settled idle
interval, programmatic camera orbit, four actual animated turns, resize and
sixteen canonical `set` updates. The browser executes the sequence itself and
posts one immutable result. The existing heartbeat inspects it after completion.
No model loop polls the experiment.

Wrap actual `renderer.render` calls to count submitted frames and their wall
cost. Capture every submission interval without discarding long gaps. New mesh
and group UUIDs across `set` identify rebuilt objects, not allocated heap bytes.
Check all 54 final material colors against each canonical Bend state. These
checks do not prove every intermediate displayed animation frame or input latency.

The preview stays hidden from the user. Record document visibility at every
phase and during submissions. A hidden document or zero idle submissions cannot
establish an idle speed gain. Integer frame counts do not establish reduced CPU,
GPU completion time, physical presentation cadence or whole-app performance.
Browser profiling and application acceptance remain open.

The temporary loopback server is low priority, memory-bounded and time-bounded.
The app-managed browser is outside that cgroup. Do not claim enforced browser
CPU/RSS ceilings. Only one hidden test page runs. No native work or compilation
overlaps the fixed samples. The page stops its animation loop and disposes the
renderer, controls, resize observer, geometries and materials when finished.
The server enforces exact origin, a per-run nonce, a body limit and one result.
No new service persists after the bounded run.

Keep scheduling and retained meshes as separate future treatments. U06's existing
target is at least 90 percent fewer idle submissions, no replay/recovery failure
and no more than five percent active p95 regression with valid controls. This
baseline alone meets none of those promotion gates. No product change, stronger
proof label, new law, holdout evaluation or publication.

## Result

The [canonical archive](u06-render-baseline-v1/index.json) verifies 2,056 seals,
three receipts, worker termination and no resource stop. The hidden preview kept
visible document semantics throughout all five cohorts. Every two-second idle
sample submitted exactly 120 frames. All 80 measured `set` calls create 80 new
meshes and 26 new groups each. The 101 canonical-color checks pass without errors.
The page reports cleanup, its server stops and its temporary tab is closed.

This establishes actual idle rendering and repeated object construction in the
declared fixture. It does not establish an optimization. Active submission-gap
p95 is about 16.8 ms in this baseline. Treat that as fixture cadence, not physical
presentation or whole-app input latency. Mesh UUID counts are not a heap profile.
Next, compare demand scheduling alone against the sealed old scene in five
alternating cohorts. Leave mesh retention unchanged for that comparison.
