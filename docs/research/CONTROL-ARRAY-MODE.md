# Control channels and global array mode

Date is 2026-10-19, Asia/Manila. This is a reproduced compiler diagnosis, not
a measured solver fix. All work is solo.

## Observations

The contemporary reference emits `BLK_SHR 0`. The v2, v3, and tail-state
cooperative programs emit `BLK_SHR 1`. Their child-admission functions have the
same five extra location arguments and the same sixty-two seal sites. Changing
only the service wrapper did not remove this mode.

A same-binary detached/cooperative run passes all 1,750 jobs with sixty answer
length and lower-bound ties. Superflip first-answer medians are 2,432 and
2,453 ms. Ranges are 2,325 to 2,587 ms and 2,359 to 2,524 ms. This does not
support attributing the earlier slowdown mainly to enabled polling. It does
not prove a precise compiler-side cost.

The minimal three-program probe prints seven in every native execution. Plain
array access and a single-use channel emit `BLK_SHR 0`. Sending on and closing
the same channel emits `BLK_SHR 1`, despite no array sharing in the program.
Reproduce with `node bench/control-channel-probe.mjs` and a fresh directory
under build/experiments. The archived receipts are in
docs/verification/r06-ownership-v3/channel-array-probe.json.gz and
docs/verification/r06-ownership-v3/channel-array-result.json.gz.

## Compiler evidence

The [pinned compiler source](https://github.com/bendlang/bend/blob/4ff8545f19b09b7d2b8ca2303668100eac8efd66/bend2/comp.ts)
selects extra location arguments for boxed words when the global array type is
hot. The same flag selects shared-array location lookup. Opaque shared types
can trigger global type heating. These are not ordinary borrowed-parameter
arguments. The earlier terminology was inaccurate.

The inspected file SHA256 is
56d5727049bc3ef528ef84d3b4712a41a0a8ce0a06437b29d881e71107638c70.
It remains ignored under .cache/references/bend-4ff8545-comp.ts. No compiler,
toolchain pin, generated C, or pure search is patched.

## Next deciding treatment

Replace the reused opaque channel with a single-owned File. A bounded native
effect opens the private FIFO nonblocking and reads at most sixty-four bytes.
The Bend parser keeps fragmented-ID state and matches only the active job.
There is no background reader or shared handle. Effects remain outside the
pure proof graph.

The first gate is restored unshared-array mode in emitted C. Then require
fragment, malformed-input, nonblocking-empty, EOF, descriptor-cleanup, native
cancellation, complete regression, and matched lifecycle and quality evidence.
All twenty-three laws and existing quality floors remain unchanged. This is
an implementation hypothesis, not a claim that the remaining roadmap is done.
