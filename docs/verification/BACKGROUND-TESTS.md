# Unattended local checks

The background runner executes a fixed local command queue without a model,
heartbeat, automatic message, or AI wakeup. It stops when the queue passes or
when a job, source seal, or resource check fails. It does not implement new
features, repair failures, commit, push, or deploy while the chat is inactive.

The current queue builds six existing optional profiles, checks retained-owner
cancellation and five real control failures per profile, and verifies a staged
local package through native, HTTP, export, and unchanged-law checks. It does
not repeat the full regression suite that already passed. It does not build
new tables or invoke the Nix daemon. Staging is not a Nix sandbox or relocation
claim. Temporary HTTP tests remain local and do not open browser windows.

Each job uses the existing resource runner, at most four low-priority CPU lanes,
4 GiB of RAM plus the required desktop reserve, and a ten-minute wall cap.
The queue runs serially. Expected duration is about fifteen minutes; the three
job caps total thirty minutes. Desktop load can change the duration.

Prepare and launch from the pinned shell after committing the tested source.

```sh
nix develop --command node bench/background-test-plan.mjs FRESH-RUN-ID
nix develop --command node bench/background-tests.mjs start build/evidence/FRESH-RUN-ID-plan.json
```

Read status without waking a model.

```sh
node bench/background-tests.mjs status build/evidence/FRESH-RUN-ID-plan.json
```

The run directory contains an immutable plan, per-job logs, results, and atomic
status.json updates. Resource receipts are under build/evidence. A repeated
launch returns the existing status rather than rerunning or overwriting jobs.
PID and process-start identity distinguish a live worker from a stale record.
If workerAlive is false while the recorded state is starting or running, the
run was interrupted. Do not infer success or restart it over partial artifacts.
Inspect its logs and use a fresh run ID for a deliberate retry.

The [runner tests](background-runner-v1/tests.json.gz) exercise detached success,
fail-fast behavior, source-change rejection, duplicate launch, and preservation
of existing receipts. No independent review ran under the solo instruction.
