# Cold adapter lifecycle

The reference calibration passes. A matched pilot still needs one explicit clock
and ownership contract. This unit checks that lifecycle before scoring any speed
or quality comparison.

The parent clock starts before process creation and timestamps complete candidate
messages on arrival. All startup, package/worker setup, table load or generated
small-profile initialization is inside that clock. This is cold adapter-process
cost, not kernel time or cold disk cache. Existing input/artifact digest checks
warm file pages before execution. Wrapper/process overhead remains visible.
Common case validation and source checks occur before the clock. Every complete
frame in one received chunk shares its arrival timestamp, before replay work.

Each case has its own process group. Rubend uses the retained generated-table
Light binary through the actual Engine. The bundled reference owns one Node
process and its worker. Nissy uses one direct native process and the verified
read-only staged table. Do not label cubing's input preparation as solver readiness.

One parent deadline governs candidate eligibility. Soft stop is attempted first.
Rubend closes its Engine and awaits native/IPC cleanup. A bundled worker is
cancelled by ending its owned process. Nissy gets SIGTERM. A bounded group kill
is the last resort. Keep the stop/close events and owned process identities.
IPC or native owners left alive make the row an error, not a successful timeout.

Candidate paths are checked in Bend and the independent facelet model. Preserve
partial and late answers, but never credit arrival after the deadline. Distinguish
normal settlement, deadline censoring, protocol failure and forced shutdown.
Parent timestamps, terminal reply and process closure remain separate fields.

Two designs were considered. Per-backend request timers would compare different
startup boundaries. The selected parent clock includes those differences and
keeps backend readiness explicit. No warm-start or generic kernel-speed claim
can follow from this cold adapter.

First exercise partial, late, hung, malformed, wrong-job and unterminated-final-
frame child fixtures. Then
calibrate solved, half-turn and commutator cases through all three real backends.
Reuse pinned references, their existing read-only stage and the accepted Rubend
binary. No release case, new configuration, database build, pruning or new law.

The initial stop fixture reproduced an owned-stdin leak. Its failure/source
snapshot is preserved in the [shutdown issue](../../../issues/cold-child-stdin-shutdown.md).
Destroy the completed one-shot input descriptor instead of pausing it. The five
original process controls pass after that fix. A sixth control also checks the
final frame without a newline and prevents a post-close kill timer.

The fixed queue is `u07-cold-v1`, estimated two minutes, capped at eight. Run the
six fixed controls and nine real shallow calibrations, then unchanged proof
gates. Reuse source-verified reference artifacts and the read-only table stage.
One low-priority CPU lane for actors, at most 2 GiB; proof checks may use four
lanes and 3 GiB.

The [canonical archive](u07-cold-v1/index.json) verifies 2,481 source seals and
three resource receipts. The worker is gone and no resource stop occurred.
All six process controls and nine real calibrations pass. Every real path replays
in Bend and the independent model. Real children exit with code zero, without
forced group termination. All three Rubend native owners are gone and their IPC
directories are removed. Unchanged proof and toolchain checks pass.

These shallow cases establish the adapter lifecycle, not relative performance.
The accepted app, references and existing cache remain unchanged. No release
holdout, final configuration freeze or formal optimality claim follows.
