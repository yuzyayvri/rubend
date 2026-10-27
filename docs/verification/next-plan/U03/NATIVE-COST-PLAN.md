# Native edge-pattern planning costs

The coordinate/action [preflight](u03-edge-pattern-v1/index.json) passed before
this batch was prepared. This run asks how much the current list-based
prototype costs in native code. It does not compare two engine treatments or
admit a full database build.

The frozen spec is `bench/roadmap-native-spec.json`. One native process runs
100,000 rank/decode/move/encode calls for each pattern size, repeated in five
rounds. A deterministic feedback sequence consumes every result in the next
input and a printed checksum. The host computes matching expected checksums
before native timing. The result constructor is forced before the end timestamp.

Measurements separate native work-interval elapsed time, whole-process wall
time, sampled process RSS and observer CPU. Startup and full generation scratch
are not isolated. Five-round median, range and spread flags are retained.
Zero-resolution or unstable rows do not establish useful cost precision.

A separate `-pg` executable runs one round. Its timing is not combined with the
uninstrumented samples. Raw gprof output and emitted C are saved. Array mode and
source/build identities are checked. Compilation and measurement never overlap.

This helper decodes a coordinate on each call. A real generator could decode
once and emit eighteen children, but would also pay queue, distance-write and
audit costs. Do not turn this microbenchmark into a database ETA or a general
engine speedup. No new distance table is built. Native generation, lookup
marginality, scratch memory and resumable audit admission remain later steps.

The shared fixed queue is `u03-native-feasibility-v1`, expected eight minutes
with a twenty-minute hard cap. Compile/proof checks use up to four low-priority
lanes. Measurements use one lane. Every job has an admitted memory ceiling,
the desktop reserve and no swap. No installation or security changes occur.

The batch passed and [its canonical archive](u03-native-feasibility-v1/index.json)
verifies 1,885 source seals, all four receipts and clean worker exit. Five
six-edge samples took 116–120 ms per 100,000 calls, median 117 ms. Four other
sizes exceeded the five-percent spread check. These are short helper intervals,
not engine comparisons. Sampled helper RSS peaked at 2,420 KiB, excluding a
database. The separate profile points to allocation/reference counting and
list-based unranking. It does not establish full-generation throughput.

Next, generate and independently audit only the one-, two- and three-edge
reference tables in native Bend. This bounded pilot tests traversal, distance
writes, completion detection and actual generator cost without admitting the
42,577,920-state six-edge build or adding an unapproved bound.
