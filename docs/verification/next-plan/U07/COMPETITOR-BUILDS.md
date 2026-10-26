# Additional native solver builds

The [source acquisition](u07-competitor-sources-v1/index.json) passes canonical
verification with 8,373 seals, two receipts, no stop and the worker gone. Both
exact commits and all 93 source files match their Git blobs and SHA256 hashes.
Muodov has 61 tracked files and 26,766,617 bytes. Vcube has 32 tracked files
and 197,670 bytes. No upstream code executes during acquisition.

The October24 order remains binding. Build and calibrate the additional solvers,
freeze all actors, coordinate one untouched final U07 evaluation, deliver the
reproducible numerical report, then delete the existing automation. The roadmap
and report remain incomplete. Yuzy reviews the report before a later separate
push decision. No push, merge, release, deployment or system change occurs here.

## Build contracts

Muodov's unchanged standalone C entrypoint calls its two-phase `solution` with
maximum depth24, an internal1000-second timeout and relative cache directory
`cache`. A later comparison watchdog must enforce the matched outer deadline.
The original no-argument path returns1 before table initialization. Use that
path only as a link smoke check, not an answer or correctness result.

The pinned source already includes twelve C cache files. Reuse these exact
bytes. Their compiled declaration sizes must all match the files, with two-byte
short integers and the expected little-endian ABI. Copy the cache into a
separate runtime directory and make staged files read-only. Do not rely on
upstream's permissive short-read handling. Actual convention/replay calibration
still has to check the loaded solver. No cache is generated during this build.

Build Muodov C with the pinned Clang21.1.8 wrapper, C99 and O3. Define
`_POSIX_C_SOURCE=200809L` to expose the `strnlen` declaration under strict C99.
This is a compile-configuration change, not an algorithm or upstream-source
edit. Retain the exact GPLv2 LICENSE and original README. Inspected C files
have no separate file-level later-version grant. Record that provenance without
claiming distribution clearance. The competitor is not linked into Rubend.

Vcube's original checkout and copied source tree stay unchanged. Generate a
separate CLI source that enables its existing commented104/base7 and108/base8
declarations. Keep every original source byte outside those declarations and
add a dated modification notice. The default308 remains unchanged but is not
run. The pure generator rejects changed bases, missing declarations and repeat
application, and reverses exactly to the pinned original. Five mutation controls
and actual pinned-source identity pass. Search logic is not changed.

Those two coordinates imply 20,336,640 and 325,386,240 table bytes under the
upstream layout. These are prospective data sizes, not measured peak memory or
allocated tables. Check the actual built CLI's help. Build the original five
library translation units and generated CLI using C++17, O3, NDEBUG, the
upstream ISA flags and pthreads. Modern Clang uses the explicit spelling
`-flax-vector-conversions=all`. Preserve all GPL-3.0-or-later source notices and
the original LICENSE. The only upstream execution is `--help`, with no table
directory and no solve input. Upstream's CppUTest dependency is not installed,
and its test suite is not claimed run. Independent local calibration remains.

The pinned source also reveals that vcube probes shared memory even without
`-S`. Later runtime/generation commands need an isolated IPC namespace so they
cannot attach an unrelated host table. Do not change huge-page or security
settings. Its generator writes a table only at completion, without a checkpoint
between depth passes. Any generation needs separate finite admission and a
small sizing stage. This build does not start it.

## Fixed queue

`u07-competitor-build-v1` has four serial low-priority jobs. Preparation uses
512 MiB and sixty seconds on CPU2. Muodov uses one GiB and two minutes on CPU2.
Vcube uses four GiB and ten minutes on CPU2–5. Confirmation uses 512 MiB and
sixty seconds on CPU2. The queue cap is sixteen minutes, with desktop reserve,
no swap and aggregate-memory enforcement. Compiler paths, version, flags,
required ISA booleans, input and generated hashes, commands and output are
retained. No broader machine inventory is stored.

Confirm original/copy/cache/license hashes and both native executable hashes.
Keep binaries, source copies and tables ignored. Preserve small original
license texts and change notices in repository evidence. Builds, metadata and
ABI checks are pending. There is no solver calibration, table generation,
holdout evaluation, configuration freeze, comparative speed or formal-optimality
claim from this unit. Independent review remains not run under solo work.

The actual build now passes canonical verification with8,486 seals and four
resource receipts, worker gone and no stop. Both native executables, the
sizeof-only probe and vcube help pass. All twelve C-cache sizes match, totaling
4,368,335 bytes. Original/copy/cache/license hashes remain unchanged. The
small-variant modification notice is retained separately from upstream source.
No solver case or vcube table is generated. [Isolated setup and convention
calibration](COMPETITOR-CALIBRATION.md) remain next, not a performance verdict.
