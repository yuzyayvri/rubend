# Loader design rubric

Score each criterion from zero to four. Reject a design that fails the first
criterion, regardless of its total.

1. Keep cube, table mathematics, lookup, and traversal in pure Bend. Preserve
   one owner per array, publish a chunk only after complete reads, and reject
   malformed sizes and overflowing ranges.
2. Give the caller a small coherent interface. Keep storage constants and
   validation policy in one owner. Do not leave competing production APIs.
3. Name a mechanism that can reduce full raw-cache process-to-ready latency
   without changing pruning values or warm search work. Stay within 8 GiB and
   one native worker for comparisons.
4. Support executable native and JS checks, forced short reads and interrupts,
   allocation and boundary checks, and repeated end-to-end measurement.
5. Minimize integration cost. Do not patch the compiler/runtime, change global
   settings, introduce a foreign solver, or require a new system service.
