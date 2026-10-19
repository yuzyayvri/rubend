# PR 1 private review follow-up

The pass starts from PR 1 head `e3ccba1`. Its complete development checkpoint is
retained in the replacement branch. No merge, deployment, release, table rebuild,
or default-profile promotion is part of this pass.

## Confirmed defects and changes

The contour runner used the default solver event protocol for measurement workers.
Its new integration test failed at `shallow-0` with
`Engine protocol failure: Unknown engine event`. The runner now explicitly selects
`eventProtocol:"fixed-work"`. The production solver allowlist is unchanged.

The keyboard shortcut bypassed the disabled play button after model failure.
Its new entry-module test failed with `failed-before-space must settle playback`
and `true !== false`. Playback now checks the existing ModelClient lifecycle state
and rejects starts during a move or search. A failed jump stops playback and
discards a pending seek. Playback starts before rewind so a rewind failure cannot
be overwritten by setting playback active again.

Model the Domain kept the existing active/failed/closed ModelClient state as the
source of availability. Fix Root Causes put the guards in playback itself, where
keyboard and button input converge. Test Behavior, Not Implementation led to
driving the real contour runner and browser entry module rather than matching
their source text.

## Focused evidence

`scripts/private-review-check.mjs focused UNIQUE_LABEL` saves status, command
logs, source hashes, and command outputs under `build/evidence/UNIQUE_LABEL/`.
Use the pinned environment with `nix develop --command node`.

The [red receipt](private-review-pass-2/red.json.gz) records both failing tests
before the production fix. The [green receipt](private-review-pass-2/green.json.gz)
contains all five passing commands and their outputs after the fix.

The contour integration uses a tiny subprocess fixture through real Engine FIFOs.
Ordinary, corner, and H0 paths pass with eleven workers, 1,793 shallow requests,
eleven measurement requests, and no remaining worker or IPC directory. This
checks protocol wiring, not native solver speed or large-cache behavior.

Seven keyboard cases pass through the bundled actual `apps/web/main.mjs`, real
ModelClient, a worker transport fixture, and DOM/scene fixtures. They cover
healthy playback, replay from the end, failure before Space, failure at the end,
failure during rewind, a request error, and Space during an in-flight move.
The verified solution survives worker failure and export stays enabled.
This is not a real-browser rendering, input scheduling, or frame-rate check.

The existing contour validation, ModelClient, and Engine lifecycle tests also
pass. Both new regressions are included in `just test`.

## Unattended full run

After committing the runner, launch with
`nix develop --command node scripts/private-review-check.mjs launch private-review-full-v1`.
The detached process runs `just test` then `just check` without agent polling.
It uses the existing artifact lease and resource admission policy, four
low-priority CPU lanes, a 4-GiB cgroup ceiling, no swap, an eight-GiB desktop
reserve at admission, a memory-pressure backstop, and a thirty-minute wall cap.
The Nix daemon does not inherit this cgroup.

Inspect these files after thirty-five minutes:

- `build/evidence/private-review-full-v1-launch.json` records the launch PID and paths.
- `build/evidence/private-review-full-v1/status.json` records command outcomes and outputs.
- `build/evidence/private-review-full-v1-resource.json` records admission, resource use, and timeout or failure.
- `build/evidence/private-review-full-v1.log` preserves outer-runner output.

A status file without `finishedAt` does not establish success. Inspect the
resource receipt and process before interpreting a partial record. Failure or
timeout must remain visible. Full-run results are pending at this checkpoint.
No native performance benchmark is necessary for these protocol and playback fixes.

Independent review, comment review, and cross-model trail review are not run under
the solo instruction. Their gates remain blocked. Current hidden-browser and Nix
package acceptance are not claimed. No Astra model or other subagent was invoked.
