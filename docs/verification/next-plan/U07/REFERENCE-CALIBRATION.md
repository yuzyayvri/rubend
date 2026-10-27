# Installed reference calibration

The local Nissy binary and 31,683,944-byte h0 table match the historical verified
smoke hashes. The checkout has the pinned revision and documented generation-only
patch. The installed cubing package is 0.66.0. Its bundled min2phase module is
identified by installed bytes and npm integrity, not by the separately pinned
upstream Java revision. No source download or build is needed.

Freeze runtime/source hashes and reject missing, changed or unsupported artifacts.
The pinned Nissy CLI's default optimal slack is 20, not zero. Pass zero explicitly
and retain all flags. The [options issue](../../../issues/nissy-optimal-slack.md)
records the source contract. Do not turn an H48 label into an optimality claim.

Use seven declared shallow scrambles, including solved and a single half turn.
Nissy gets a byte-identical staged copy of the existing table. The copy and both
CLI table-search directories are read-only, so a missing table cannot trigger a
writable regeneration fallback. Original cache bytes and metadata are unchanged.
Keep the staged copy under ignored build artifacts. No Nissy data is regenerated.
The unprivileged-process guard is mandatory for the read-only write protection.
The bundled reference may perform its normal bounded in-memory initialization.
No new persisted or large pruning database is generated.

Run Nissy in a fresh process per case with a five-second ceiling. Run the installed
two-phase API in one owned Node child with its cached worker and a watchdog.
The two lifecycles differ. This unit scores no elapsed times or relative speed.
The resource receipt covers the parent and children on one admitted CPU lane.

Verify all fourteen planned results. Replay in the actual Bend model and the
independent facelet model. The cubing lane also checks input/output through
KPuzzle. Retain stdout, stderr, errors and unexecuted cases. No error can disappear
from the result set. No returned reference answer is formally certified here.

This is functional convention/calibration evidence, not a final benchmark,
configuration choice or release-holdout evaluation. No Rubend backend is replaced,
no competitor table is built and no external publication occurs. Measured
comparisons still need matched lifecycle adapters and a frozen configuration.

The fixed queue is `u07-reference-v1`, estimated two minutes with an eight-minute
cap. Twelve provenance negative controls pass the focused check. The inventory
currently seals 115 reference/runtime files. Reference jobs use one low-priority
CPU lane and at most 2 GiB. Unchanged proof checks may use four lanes and 3 GiB.
The calibration result is pending. No general performance claim is admitted.

The [canonical archive](u07-reference-v1/index.json) verifies 2,460 seals and all
three receipts, worker gone/no resource stop. All fourteen planned results replay
through the Bend and independent facelet models. The cubing lane also passes
KPuzzle input/output checks. Its owned process exits normally. Nissy uses explicit
zero slack and the read-only staged cache. Original artifacts and all 115 runtime
source hashes are unchanged. Twelve provenance controls and unchanged proof
gates pass. No relative-speed or formal-optimality result follows.
