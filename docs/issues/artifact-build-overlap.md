# Generated artifacts changed during a benchmark

Status: the application run is invalidated. A per-checkout exclusion guard is
implemented; its integration checks and serialized rerun are pending.

The first corner application comparison completed 1,750 native-validated jobs.
Its postflight guard correctly rejects the entire result because a concurrent
regression build rewrites build/model.mjs, cubie.mjs, and notation.mjs. Their
bytes and SHA256 identities stay the same, but filesystem identities change.
Do not weaken that guard or count this attempt as a performance/quality result.
The failed raw report and resource receipt remain preserved.

The root cause is two workflows owning the same generated outputs. Allocating
different cores does not separate their files. scripts/artifact-lease.mjs gives
scripts/build.mjs and bench/run-limited.mjs one exclusive checkout lease. Nested
commands within the owning batch can run. An unrelated writer exits with code
73 before its build or experiment starts. A failed owner releases the lease.
The project pins util-linux for the flock command rather than relying on a
system installation. No global system configuration changes.

Tests cover conflict rejection without writes, ownership reuse, release after
failure, and both real build/experiment entrypoints. The generated-input seals
remain unchanged through the rejecting integration check. A fresh serialized
application cohort is required before accepting any corner application claim.
