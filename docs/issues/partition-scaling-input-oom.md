# Partition scaling preparation allocates a whole cache while hashing

Status: fixed and verified by bounded regressions and the
[full recovered batch](../verification/next-plan/U05/u05-scaling-v2/index.json).
No measured worker run began in the failed batch.

`u05-scaling-v1` fails in preparation. Its 512-MiB cgroup records SIGKILL, with
`stoppedFor: null`. The owned systemd scope's journal explicitly reports the
kernel OOM killer and a 512-MiB peak. This is not an aggregate-RSS monitor stop.
The monitor's sampled RSS below its threshold does not refute the kernel limit.

The new scaling controller calls the general in-memory hash helper on the
1,108,546,560-byte joint cache before it reaches model tests or worker launch.
The helper uses `readFileSync`, so its one cache buffer exceeds the entire
preparation allowance. The queue source verifier has the same whole-file
allocation pattern outside the experiment scope. Raising the preparation
ceiling would retain both unnecessary allocations.

Before tracked edits, a dedicated preserver verified all 3,802 source seals,
revision, copied plan, actual command/resource limits, dead worker identity,
owned-scope journal and absence of every measured/diagnostic output. The
[failed archive](../verification/next-plan/U05/u05-scaling-v1-oom/index.json)
retains the exact receipt, SIGKILL, journal, sources and zero started owners.
The [preservation helper source](../verification/next-plan/U05/u05-scaling-v1-oom/preservation-helper-source.json.gz)
is retained separately without changing the original archive index.

`bench/bounded-file-hash.mjs` hashes through one 256-KiB read buffer, checks
descriptor/path identity and complete byte count, and closes the descriptor
on success or error. The scaling controller and background source verifier
use it. Other small reference-provenance users remain unchanged.

The same `tests/file-hash-memory.mjs` check fails with the old helper under
512 MiB, again SIGKILL. It succeeds on the same 1.1-GB cache with the bounded
helper, consuming a 68,536-KiB maximum process RSS in the development check.
The preparation cap is unchanged. Six byte-boundary cases, changed data,
missing files, directories, descriptor cleanup and rejection of a bad large
source seal before queue creation also pass under 512 MiB. Raw before/after
and refusal records are retained under `build/evidence/u05-scaling-hash-*`.

Recovery keeps every benchmark job, order, flag, table, native binary, timer,
noise gate and measurement limit unchanged. It retains all old required
input paths, including the large cache. Repeat no native work because none
started. The original failure is not rewritten as a passing or unadmitted run.

The recovery verifies all 3,825 seals and four receipts, worker gone with no
resource stop. Full preparation peaks at 215,464 KiB aggregate tree RSS under
the original 512-MiB cap. All twenty measured runs finish and all results replay.
The performance verdict is separately inconclusive due to duplicate-control
noise; that does not undo the verified memory fix or promote parallel execution.
