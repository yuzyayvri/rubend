# Demand rendering

The verified baseline submits 120 idle frames every two seconds. Replace the
continuous callback with a single-owner frame scheduler. Leave mesh rebuilding,
cube rules, scene geometry, materials and search policy unchanged.

The first design kept continuous RAF and skipped draws. The selected design
cancels idle callbacks too. `FrameDriver` coalesces invalidations and preserves
changes made during a frame. It ignores cancelled stale callbacks. Hidden or lost
contexts suspend scheduling. Resume schedules a fresh frame. `CubeScene` requests
frames on camera changes, animation, set, home, resize and recovery. Damping
continues while the pinned OrbitControls reports camera changes. Throttled dirty
work remains pending. Disposal cancels scheduling and releases owned resources.

Idle diagnostics say that 3D is ready, rather than claiming a missing renderer.
This changes rendering behavior and diagnostics only. It does not add a stronger
proof label. Independent review is blocked under solo work. Operator interaction
review and whole-application acceptance remain open.

## Fixed comparison

Freeze the old scene from signed commit `616f7d5` and verify its source digest
against the canonical baseline plan. Bundle it with the candidate and the same
pinned Three dependency. One hidden page runs five alternating cohorts. Each
cohort has old control, a second old-code A/A sample and demand rendering. Samples
run sequentially, with one live scene and no native solver or concurrent build.

Keep the original idle, orbit, playback and set workload. Require at least
90 percent fewer actual idle submissions. Compare orbit and animated playback
submission-gap p95 within five percent, with at least 95 percent of control's
active submission rate. A/A p95 must also stay within five percent. Resize and
set intentionally render sparsely, so test their mutation-to-draw latency instead
of treating missing redundant draws as slow frames. Require each candidate
normal repaint within 50 ms. Context restoration has a separate one-second
draw timeout, including renderer reinitialization. Keep those thresholds frozen.

Replay canonical Bend states, check all final sticker material colors, keep mesh
and group allocation counts unchanged, and test immediate reduced-motion updates.
Lose WebGL, update the canonical state while lost, then restore and require a
correct redraw. No submissions may occur while lost or after disposal.
Deterministic tests separately cover hidden/resume, reentrant invalidation and
stale callbacks. They do not substitute for a real document visibility transition
or the full app's model failure, playback controls and search-under-load lanes.

Actual draw submissions and cadence are the measured outcomes. CPU usage, GPU
completion, presentation timing and full-application latency are not measured.
The server is resource-bounded and temporary. The app-managed browser is outside
its cgroup. No browser CPU/RSS enforcement or general speedup claim. A scene-only
result cannot close operator review, packaging or full application acceptance.

## Runner failure and recovery

The first comparison's server timed out after 240 seconds. Preparation passed,
the worker exited and no resource-pressure stop occurred. Source and receipt
verification preserves all 2,073 seals and the uncommitted candidate sources in
[the failed-run archive](u06-render-demand-v1-failed/index.json). Its status stays
failed. It has no captured browser comparison result and cannot support any
gain, loss or acceptance verdict. The temporary browser tab is closed.

The page later showed completion after the server expired, so browser execution
did not finish inside its admitted window. Off-turn throttling is suspected but
not established by this run. The recovered runner records phase wall timestamps
and saves each completed sample outside its measured intervals. The final result
must exactly match those immutable partial records. A fixture-contract test
checks the progress DOM target before launch.

Use two bounded browser milestone waits, each at most 55 seconds, while this
browser-specific sequence executes. These are event waits, not repeated model
polls. Native proof checks remain detached. Do not change workloads, resource
caps or performance floors to rescue the timeout. A second run is a runner
recovery, not a statistical retry for a more favorable outcome.

## Verified scene result

The [canonical v2 archive](u06-render-demand-v2/index.json) verifies 2,075 source
seals, three receipts, all fifteen incremental sample records, worker termination
and no resource stop. Existing `just check` and focused tests pass. The temporary
browser tab is closed. The failed first run remains excluded.

The control submits 113–117 idle frames in each two-second sample, median 116.
The demand renderer submits zero in all five samples. That is a 100 percent
reduction in actual idle submissions in this fixture. A/A active cadence meets
the control floor. The largest candidate active p95 ratio is 1.04445 and the
smallest active submission-rate ratio is 0.95634, both inside the frozen limits.
Do not turn those limits into a claim that active rendering became faster.

All 303 final canonical-color checks, 315 repaint checks and fifteen actual
context-loss/update/restore cycles pass. Candidate normal repaint latency peaks
at 19 ms. No draw occurs while lost or after disposal. Every measured set still
rebuilds 80 meshes and 26 groups. Mesh retention has not been mixed into this win.

The scene treatment meets this fixture's gates. General performance acceptance,
browser CPU/RSS limits, GPU completion, packaging, full application workflows,
real visibility transitions and operator interaction review remain open.
Rebuild the app and run its regression/browser lanes before the next UI treatment.

## Application regression recovery

The rebuilt app completes its build and the first 48 top-level test commands.
The full recipe then fails linking the keyboard fixture because its substitute
scene lacks the new `renderLabel` export. This is an actual failing-before
regression, not a rendering performance verdict. The
[failed-run archive](u06-app-regression-v1-failed/index.json) preserves 2,105
source seals, the failed receipt, original recipe and actual built artifact hashes.
The run remains failed. It cannot be cited as a complete passing suite.

The repaired fixture re-exports the real label function and includes scene
disposal in its substitute class. The same focused test now passes all nine
keyboard scenarios. No keyboard assertion or product behavior is weakened.

Recovery derives the remaining 49 commands from the unchanged recipe. It verifies
the exact failure line, source delta and sealed rebuilt assets before reusing the
48-command prefix. New recovery fixtures reject missing, duplicate or malformed
failure boundaries. The prefix is not rebuilt or repeated. A successful recovery
can establish complete recipe coverage across the two source-checked runs, not a
successful original `just test` process. Full browser acceptance remains separate.

The [recovery archive](u06-app-recovery-v1/index.json) verifies 2,119 source seals,
two receipts, worker termination and no resource stop. All 49 remainder commands
pass, including the repaired keyboard test and the new frame guards. The original
48-command prefix and actual rebuilt artifacts pass the reuse checks. This covers
all 97 top-level recipe commands across the two runs. The original process remains
failed, and the recovery record says so. The existing raw cache digest matches.

The native binary, emitted C, manifest and built UI assets are sealed. Next, run
the actual hidden-app workflows for playback, idle diagnostics, camera/resize,
reduced motion, renderer and model recovery, export and search interaction. This
recovery does not claim a browser rerun, package rollout or operator review.
