# Startup design decision

The root agent read all three candidate packages. The gpt-6-luna cross-judge
recommended candidate A. The earlier gpt-6-sol judge was interrupted at the
user's pause and supplied no verdict. No further Astra call is authorized.

## Selected shape

Use candidate A's bounded read into the final owned array layout. A raw-format
initializer owns the expected count, prefix, fingerprint, allocation, validation,
and small-table setup. Its caller supplies a sealed local cache path and receives
one complete table. File transport remains outside the pure proof graph.

The IO helper reads only private scratch. The event-loop callback copies a
complete chunk into the one owned array. No incomplete chunk becomes visible.
Failure closes the file and terminates initialization without ready. Do not move
search, table generation, lookup, or fingerprint mathematics into foreign code.

## Scores and grafts

The root scores A as 4,3,4,4,3 and B as 4,4,3,4,3 under the five rubric criteria.
It selects A's direct placement and explicit failure ownership. B supplies the
caller-first raw-format interface and fault-injection matrix. C reinforces the
failure-after-earlier-chunks test. The root scores C as 3,2,3,2,4. Loading at zero
then copying is less direct, but does not by itself violate array safety. This
differs from the cross-judge's first-criterion score of two and does not change
the selected base.

Reject the whole-file foreign importer. It increases scratch memory and moves
array construction into runtime-private foreign code. Keep only one production
raw initialization recipe. Frozen baseline source and binaries remain separate
benchmark references, not alternate production APIs.

## Accepted contract details

The pinned Base File.size already checks a wide fstat size before returning U32.
The generic loader must additionally reject word counts above U32_MAX divided
by four before multiplying. Reuse that boundary instead of adding an unnecessary
foreign file-size implementation. Test the wrap case and files above 4 GiB.

Input immutability is a precondition for this local cache path. The host checks
regular-file shape, identity metadata, and SHA256 before and after measurement.
The native 32-bit fingerprint remains a consistency check. Neither that check
nor post-read size alone claims to defeat an adversarial same-size mutation.
Post-read size checks must reject observed growth. The current fixed raw
geometry fits all native array and byte bounds.

## Next units

Freeze a five-repeat startup benchmark with byte, error, readiness, and replay
counts. Its file-cache state must be explicit. Then delegate one implementation
attempt per isolated worktree. Separate direct-placement and word-transport
attempts from search changes so their timing has one cause. Benchmark agreement
and independent correctness review remain open gates.
