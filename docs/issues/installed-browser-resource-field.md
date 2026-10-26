# Installed-browser checker compares a field against a record

The hidden installed-package session passes its known-case browser workflows
at `978e5e5`. It stops normally under its one-GiB, ten-minute CPU2 limit.
All four recorded namespace identities and the native PID-root IPC path are gone.
The separate post-live planner then fails before creating a detached queue.
Its limit check compares `resource.limits[k]` against the whole `limits` object.
The first comparison reports `1024` against `{memoryMiB:1024,seconds:600,cpus:[2]}`.

The [failure archive](../verification/next-plan/U07/u07-installed-gui-v1-planner-failed/index.json)
preserves the original checker source, live plan, resource receipt, failed
planner receipt and seventeen raw browser records. All 8,268 live source seals
pass before edits. Fifteen screenshots have preserved hashes. The live resource
receipt passes a correctly keyed comparison during preservation, with no stop.
The failed planner also has no resource stop. Browser CPU and memory are outside
the server's cgroup and are not claimed as capped or measured.

The fix compares each field against `limits[k]`. Only the post-live analysis
checker changes. Its new source is frozen separately in the fresh queue plan.
Every other original live source seal and all captured artifact hashes must
still match. The original source bytes and revision remain preserved, and the
new revision must descend from the live revision. No browser workflow, app,
fixture, driver, imported artifact or observed result is changed or rerun.
The planner failure is not relabelled as passed. Complete post-live validation
and fixed controls remain pending.
