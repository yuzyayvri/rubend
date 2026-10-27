# Four-edge binary checkpoint and restart

The native comma-separated pilot supports only payloads through 65,536 bytes.
It cannot establish restart or file costs for the larger audited four-edge pilot.
This preflight replaces that private transport with U32LE payloads and a small
digest-bound manifest. It does not change the old format or the builder.

Each payload contains 190,080 U32 words, or 760,320 bytes. The existing Bend
cache reader and writer process three chunks of at most 65,536 words each.
One 262,144-word owned array holds the restored table. Both already audited
four-edge patterns are checked. No six-edge allocation or distance BFS is added
to production. The worker resumes exactly one actual layered-builder step.

The manifest binds pattern, labels, goal, geometry, adapter, binary, reference
payload, parent identity, counters and payload bytes. The caller pins its digest.
The native process independently checks array size, every value's range, the
unique zero at the goal, actual reached count and actual prior-layer count.
These are format and state-admission checks, not a proof of distance correctness.
Every checkpoint is compared entry-by-entry with the previously independently
audited distance table, masked to its current radius. The final tables must agree
in every entry. The builder still runs in Bend.

Each layer starts in a fresh native process. All input manifests and payloads
remain immutable. Output paths must be fresh. Two repeated resumes must produce
identical metadata and payloads. Two actual failures occur after the input file
has been read and closed. They must leave input bytes unchanged and no output.
Native controls cover short and extra files, invalid distances, extra zeros,
wrong goals, counters, depths, pattern, numbers, action and existing output.
An actual weakened admission-source variant must accept a wrong counter and
then fail the independent state check. Manifest controls check both pinned
identity and semantic rejection after an attacker recomputes the digest.

GNU Time records each whole native command's CPU, elapsed time, maximum RSS,
status and raw counters through the already calibrated observer. Command scope
includes startup, load, admission scan, one layer, save and disposal. CPU fields
have 10-ms resolution. Its maximum RSS is not aggregate tree RSS. The outer
queue retains separate aggregate process-tree resource receipts. Keep actual
payload bytes, retained history bytes and simultaneous input/output bytes
separate. One planning run cannot establish a speedup or six-edge ETA.

The new pure admission helper receives a fresh verdict. The unchanged layered
builder, coordinate graph, audited references and 87-input root gate are reused
after identity checks. The worker has no new custom foreign effect.
No NP04 or NP05 theorem, compression bound, production pruning, new default,
holdout, large build, publication or independent review is included.

The fixed batch is `u03-binary-checkpoint-v1`, estimated four minutes with a
nine-minute cap. Builds use at most 1.5 GiB and four low-priority lanes.
The restart and control job uses CPU2 and 1 GiB. Six-edge generation and its
large-profile scratch and audit costs remain separately gated.

## Result

The [canonical archive](u03-binary-checkpoint-v1/index.json) verifies 2,951 seals
and three receipts. The worker is gone and no resource stop occurred. All 18
layer restarts, two repeats and two native failures pass. Every intermediate
entry and both complete tables match the audited distances. Thirteen native
controls and eighteen manifest controls pass. The actual admission fault accepts
the wrong count of fourteen where the correct next count is thirteen, and the
independent check catches it. The new pure admission helper passes BendTT.
Unchanged coordinate, builder, oracle and root evidence is reused.

The [raw-counter archive](u03-binary-checkpoint-v1/records/index.json) preserves
37 whole-command measurements with original GNU Time text and eighteen
checkpoint manifests. The main workflow's 24 native commands consume 5.79 s CPU
and 5.95 s summed command wall time. Those commands include seeds, repeats and
the two injected failures. The thirteen negative-control commands are retained
separately. This is one planning run, not throughput or a speed comparison.

Maximum native-command RSS is 10,292 KiB. The outer restart job takes 7.625 s
and peaks at 231,116 KiB aggregate tree RSS, including the host verifier.
Accepted history payloads total 16,727,040 bytes. All retained raw files,
including control artifacts, total 21,288,971 bytes. One simultaneous input and
output pair contains 1,520,640 bytes. Raw payloads stay outside Git.

The larger transport gap is closed for these two four-edge pilots. Six-edge
generation time, full-profile peak memory and independent full-audit costs are
not measured. No large-build admission, NP04 or NP05 proof, pruning, production
integration, holdout or performance acceptance follows.
