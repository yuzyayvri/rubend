# Bounded completion of the six-edge databases

The full-capacity [checkpoint pilot](SIX-EDGE-CHECKPOINT.md) is verified.
The October 25 grant authorizes continued local generation and full audits.
This unit attempts one pattern per fixed batch with the same tested native
binary. It does not rebuild the engine or ask for permission again.

## Fixed attempt and recovery contract

Pattern zero starts at its pinned depth-three checkpoint, with 3,052 known
entries. The source graph, binary, payload, manifest and caller digest match
the archived passing pilot. Each native call resumes one BFS layer and saves
a new immutable file. The host compares every input/output word. Previously
established distances cannot change. New cells have exactly the next depth,
the goal remains the only zero, and actual known/expanded counts must match.
Each input stays unchanged.

Every returned command and accepted layer has a separate durable progress
record. A crashed, partial or unaccepted output cannot resume. If a resource
or time ceiling stops this attempt, preserve the run and its receipts before
edits, verify the accepted records, and prepare a fresh fixed continuation
from its latest valid checkpoint. Do not repeat completed layers or erase
their data. Do not claim a completed build from accepted partial work.

An Active manifest and a BuiltUnverified manifest have different formats.
Active steps increase depth and expanded counts cover the earlier layers.
The terminal native step finds no new state, retains its depth, and counts
the final frontier as expanded. Model tests explicitly distinguish that
terminal count from the number of entries strictly below the final depth.
A complete native build requires all 42,577,920 entries known and expanded.

The fixed attempt allows at most eighteen native calls, logical depth twenty,
and a twenty-five-minute build job. It cannot expand another layer at the
depth ceiling unless all entries are already known and only native closure
remains. At most eighteen new 170,311,680-byte payloads are retained,
3,065,610,240 bytes total, plus a 2-GiB free-disk reserve.

## Evidence and remaining requirements

The queue `u03-six-build-p0-v1` has preparation under 512 MiB, one CPU2 build
job under 3 GiB and 1,500 seconds, then confirmation under 512 MiB. The whole
queue ceiling is twenty-nine minutes. This is an admitted attempt window,
not an ETA derived from a shallow pilot or helper timing. Enforce desktop
reserve, no swap, low priority and memory-pressure stops throughout.
No model polls while the detached job runs.

Whole native-command CPU and maximum RSS include allocation, IO, admission
and the layer. The outer resource receipt has a different scope. Preserve
raw measurements and every failure. Reuse passing native, admission, coordinate,
CPU-observer and root87 evidence for unchanged sources.

Even successful completion is labeled built-unverified and ineligible for
pruning. Next audit all projected edges, decreasing successors, zero goal and
distance domains with an independent implementation. NP05 and the concrete
projection/data refinements remain required. Repeat the bounded workflow for
the second pattern. No production, formal-optimality, speed, release-holdout,
competitor or publication claim follows from this build. Work stays solo.

## First pattern built, audit pending

The [pattern-zero archive](u03-six-build-p0-v1/index.json) verifies 3,529 source
seals and three receipts. The worker is gone, and no resource stop occurred.
All ten counter-model controls pass. The unchanged native binary and its
source-bound proof and pilot evidence are reused, not rebuilt.

Eight fresh native owners continue from depth three to terminal depth ten.
All 42,577,920 entries are known and expanded. Each old/new payload pair passes
the complete monotonicity, goal, range and actual-counter checks. All input
files retain their identities. The final 170,311,680-byte payload hash is
`87f57eb05d6e1ec226212d523a4ba63f5fdb63e6de133602537daa566a8ac492`.
Its manifest remains built-unverified with `eligibleForPruning: false`.

| Accepted output depth | Reached entries | Expanded entries | Native command CPU, s |
| --- | ---: | ---: | ---: |
| 4 | 34,757 | 3,052 | 3.30 |
| 5 | 355,130 | 34,757 | 3.92 |
| 6 | 2,968,478 | 355,130 | 10.20 |
| 7 | 16,539,185 | 2,968,478 | 58.46 |
| 8 | 39,833,460 | 16,539,185 | 318.16 |
| 9 | 42,577,846 | 39,833,460 | 495.78 |
| 10 active | 42,577,920 | 42,577,846 | 61.37 |
| 10 terminal | 42,577,920 | 42,577,920 | 3.41 |

Whole native-command CPU for this continuation is 954.60 s. Maximum native
RSS is 271,412 KiB. The host-inclusive build job takes 976.371 s and peaks
at 421,152 KiB tree RSS. These measurements include restart allocation, IO,
admission and generation. They start at the already built depth-three input,
not a fresh seed. Do not turn the continuation cost into a from-scratch timing
or use it as an engine speedup. This is one resource-planning execution.

Eight new raw payloads total 1,362,493,440 bytes and remain ignored. Every
accepted progress record, manifest and command measurement is archived.
The second pattern still needs generation. Both complete tables still need
independent full graph audits and NP05/refinement before pruning admission.
