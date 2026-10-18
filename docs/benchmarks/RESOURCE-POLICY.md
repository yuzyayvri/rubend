# Local resource admission

On 2026-10-17 Yuzy explicitly authorized more local CPU and RAM when inspection
shows that the allocation speeds development. This supersedes the earlier
two-core/eight-GiB allocation ceiling. It does not authorize cloud work, GPU
installation, deployment, visible windows, or global system changes.
The thirty-minute per-batch wall limit remains unchanged.

Use up to four low-priority CPU lanes for development builds/tests where that
helps. Keep matched benchmark sides on the same chosen affinity and limits.
Do not increase search threads and call the resulting ratio a kernel speedup.

The runner admits at most 16 GiB per batch and requires at least eight GiB of
available memory beyond the requested ceiling before launch. It rejects
unavailable/duplicate CPU IDs. A four-GiB global available-memory emergency
backstop stops owned work if desktop headroom collapses. MemoryMax, no swap,
CPU affinity, nice 10, wall timeout, and aggregate RSS checks remain enabled.

These are conservative operating choices, not a request to allocate sixteen
GiB automatically. Current free memory can make the admissible ceiling lower.
Run large-memory batches sequentially. For parallel builds, divide the available
aggregate budget among them rather than independently reserving the full amount.
Leave interactive desktop work room to proceed.

Read-only inspection found six physical cores with twelve CPU lanes. Development
can use four distinct physical cores while leaving two available to the desktop.
Do not persist a broader personal machine inventory. Recheck headroom at launch.
The Nix daemon does not inherit a user scope's limits automatically. Do not claim
that it does, and do not alter global daemon settings for a speed comparison.

Builds and bounded experiment commands now take an exclusive per-checkout
artifact lease. An unrelated build or experiment exits with code 73 before
writing shared generated files. Commands nested inside the owning batch reuse
the lease. The kernel releases the file lock when its owning processes exit.
The inherited ownership marker coordinates trusted local tools; it is not a
security boundary. The small launcher and lease processes remain outside the
experiment's cgroup, like the existing monitor and Nix launcher. The enforced
memory ceiling applies to the experiment command tree, with desktop reserve
and the global memory-pressure backstop still active.
