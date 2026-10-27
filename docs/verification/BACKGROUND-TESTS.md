# Unattended local checks

On October 23 Yuzy requested automatic continuations in this same chat.
The existing `continue-rubend-roadmap` heartbeat now resumes every thirty
minutes. This supersedes the earlier no-wakeup instruction for this task.
The queue itself remains model-free. Do not create a second automation or a
custom message process. Keep the computer and app running for local work.

After a run passes, verify and archive it before source edits:

```sh
node bench/check-background-results.mjs FRESH-RUN-ID
```

The checker verifies the current revision, every source seal, both plan copies,
ordered job results, resource hashes, commands and limits, and worker identity.
It archives JSON receipts under the corresponding roadmap unit and verifies
existing compressed files instead of overwriting them. A duplicate invocation
on the unchanged completed run returns the same index. `--verify-only` skips
archive writes. The eight negative fixtures cover unfinished work, source and
receipt changes, a live worker, wrong revision, missing jobs, command drift and
limit drift. The actual completed coordinate queue was checked and archived,
then checked again without changes. These checks are not independent review.

If a proof queue's last job was refused for desktop headroom before admission,
no resource receipt exists for that job. Preserve that distinct state with
`node bench/preserve-unadmitted-background.mjs RUN-ID`. It accepts only the
exact pre-spawn headroom refusal, verifies the unchanged plan and passed jobs,
and records the missing receipt as unadmitted. It never fabricates a receipt.
Use a fresh bounded recovery plan and reuse passing evidence for unchanged
sources. Keep the desktop reserve and all enforcement enabled.

For an executed job stopped by `aggregate-rss-limit` with `SIGKILL`, use
`node bench/preserve-stopped-background.mjs RUN-ID`. The resource command can
have a null exit code while its queue wrapper reports 1. This strict path
preserves both statuses and verifies source seals, receipts and check-process
cleanup. It does not reinterpret the stop as a test failure or success.

Do not rerun a completed gate solely because another job was interrupted.
Source-bound reuse must verify its actual successful archived execution,
complete current input set, hashes, command, binary, limits and confirmation.
Keep altered-record controls and label reuse explicitly, not as a fresh run.

Receipts up to 32 MiB use the original synchronous archiver. Larger JSON traces
use bounded streamed compression, capped at 128 MiB input, with source-identity,
JSON, hash and roundtrip checks. JSON validation remains memory-bounded rather
than streaming. Both paths preserve source bytes and reject overwrites.
`tests/streamed-archive.mjs bench/archive-streamed-evidence.mjs` checks the
larger path and its hard cap. `tests/background-large-archive.mjs` checks
automatic canonical selection and stable repeat verification. The original
eight source/receipt negative controls remain unchanged.

The older queue descriptions below preserve their original scopes and timings.

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

The [first completed queue](r06-unattended-20261019-v1/index.json) passed all
three jobs in 258.79 seconds. This observed duration helps estimate similar
queues; it does not predict longer benchmark or table-generation workloads.
Yuzy confirmed this as the standing token-saving workflow at 21:51 Manila.
