# Raw cache startup architecture candidate

## Problem

The experimental raw worker must own a 536,870,912-word Bend array containing 8,388,608 generated prefix words followed by 277,136,640 audited raw-cache words. The current byte-list path boxes each byte. The uncommitted word-reader prototype removes that boxing, but the raw entrypoint loads at zero and shifts the entire cache to make the prefix. The host pins the file's SHA-256; the Bend-side 32-bit fingerprint is only a consistency check. Neither inspected code nor a design sketch establishes the requested 50% cold process-to-ready median reduction.

## Usage (caller's view)

The raw worker's `table()` calls one loader operation and then passes its returned, solely owned array to the existing worker loop. The light app remains on its existing path.

```bend
def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    raw : Array<U32> <- Cache.load_raw_prefixed(path)
    return raw

def worker(file: File) -> IO(Unit):
  do IO<Unit>:
    IO.print("{\"type\":\"initializing\"}")
    table : Array<U32> <- table()
    IO.print("{\"type\":\"ready\"}")
    read : File & Result<&1, &1, U32 & String, String> <- File.read(file, 4096)
    H.worker_loop(1000000n, table, read)
```

The host accepts the raw file by pinned SHA-256 before spawning, and verifies it again after the bounded run; the timer surrounds a fresh process through its `ready` event. A changed file between acceptance and reading remains a threat unless the host can pin a stable snapshot or hold an enforceable immutability contract. The Bend fingerprint does not close that gap.

## Shape A: bounded read into final layout

The recommended loader's public interface is `Cache.load_raw_prefixed(path: String) -> IO(Array<U32>)`. It owns the fixed raw layout, expected word count and fingerprint in one module. The caller does not choose offsets, chunk size, or byte order. The function allocates `[0 : U32^29n]`, opens one file, checks its exact 1,108,546,560-byte length with a widened native/JS file-size boundary, then reads chunks directly beginning at index 8,388,608. It computes the existing logical-index fingerprint from that offset, requires 2620826876, generates and checks the small Bend table, and copies only those 8,388,608 prefix words. It returns the final array only after every check. No 277,136,640-word shift occurs.

```bend
def load_raw_prefixed(path: String) -> IO(Array<U32>)
def read_raw_chunks(fuel: Nat, state: File & Array<U32>, +logical: U32, +remaining: U32) -> IO(Array<U32>)
def checked_raw(table: Array<U32>) -> IO(Array<U32>)

def W.open_exact_words(path: String, words: U32) -> IO(Result<&1, &1, U32 & String, File>)
def W.read_words(file: File, table: Array<U32>, offset: U32, count: U32) -> IO(File & (Array<U32> & Result<&1, &1, U32 & String, Unit>))
```

`open_exact_words` rejects `words > floor(U32_MAX / 4)` before multiplication, obtains a 64-bit size for the opened descriptor, and rejects any mismatch, including files larger than 4 GiB. The fixed raw count is also checked against the physical array capacity using widened `prefix + count`, not wrapping U32 arithmetic. This resolves the general `sized` flaw in the new path; the old generic path needs the same regression fix before any new caller can rely on it. The foreign effect accepts only an unshared `TAG_BUF`, a positive count at most 262,144, and a widened in-capacity range. Its worker fills a temporary byte chunk, retries EINTR and short reads, and publishes no word until the chunk is complete. Its event-loop completion writes little-endian words into that same affine table. A failed later chunk leaves private partial state, but terminates without returning the table or printing `ready`; the file and temporary allocation are closed/freed on every outcome. The JS implementation follows the same complete-before-publish contract and bounds checks. Bend alone owns table generation, fingerprint, search, cube rules, and replay.

This interface is deep: one public domain operation hides descriptor lifetime, checked size, chunking, endian conversion, layout and fingerprint policy. The lower-level effects remain private to the IO loader and outside `PROOF.bend`'s pure import graph. This concentrates raw-layout knowledge per model-the-domain and validates untrusted file/foreign parameters at the boundary per boundary-discipline. No old and new public raw-loading recipes should coexist after caller migration.

## Shape B: one foreign import returning a new array

The alternate caller has the same single operation, but creation and filling belong to one native/JS effect. Bend retains the fingerprint, small-table generation and worker behavior.

```bend
def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    table : Array<U32> <- IO.try(Array<U32>, W.import_raw_prefixed(path))
    table : Array<U32> <- Cache.require_raw_fingerprint(table, 8388608)
    small : Array<U32> <- H.checked_table(Array.size(U32, T.generate()))
    return Cache.prefix(8388608n, Cache.Prefix{table, small}, 0)

def W.import_raw_prefixed(path: String) -> IO(Result<&1, &1, U32 & String, Array<U32>>)
```

The effect opens and checks the fixed exact size with widened arithmetic, allocates a single owned Bend array of physical capacity 2^29, and fills words beginning at the prefix offset. Native worker threads may fill temporary byte buffers only; array creation and writes happen on the event loop with one owner. It loops over EINTR and partial reads and never exposes an array on failure. The JS implementation has the same outcome contract. The public interface hides more transport detail, but the foreign implementation must know Bend allocation and array representation and own cleanup for a large failed import. It duplicates raw-layout policy between native and JS and risks coupling the loader to runtime internals. That is information leakage and split policy ownership despite the small call surface.

## Synthesis decision

Choose A. Its direct-to-final-layout change removes the known full-array copy while preserving the already present bounded foreign read mechanism and Bend-side policy. B's one-call API is superficially smaller, but moves array construction and layout ownership into two foreign implementations and makes a local Bend layout edit unsafe. Neither candidate's speed is established. The feature gate is an alternating five-run cold-process comparison, not the elegance of its sketch.

## Tradeoffs accepted

- We accept repeated bounded IO-effect calls and a full Bend fingerprint pass in exchange for bounded temporary memory, a narrow foreign surface, and unchanged readiness checks.
- We accept a 2-GiB physical array despite roughly 1.14 GiB of occupied words in exchange for existing Bend array indexing and no runtime patch.
- We accept a separate host SHA-256 acceptance pass in exchange for cryptographic cache identity; the 32-bit worker fingerprint is not a proof.

## Alternatives considered and disproof tests

A pure Bend storage/layout rewrite avoids foreign IO but retains byte-list boxing unless it changes `File.read_bytes`' representation. That is a broad runtime-facing change with no established advantage and does not hide loading complexity. B is a complete alternative, not a second mode of A. Reject any menu of both public loaders, because an agent could copy the unverified route.

First test malformed lengths, including `count * 4` overflow, over-4-GiB files, offset overflow, EOF after an earlier successful chunk, short reads, EINTR, invalid/shared buffer, and failed-open cleanup. Assert no `ready` on failure and no publication of an incomplete chunk. Then compare loaded words and generated prefix against the baseline at boundaries and sampled/interior indices, run identical distance/replay/shallow-optimum cases, and confirm the SHA-256 before and after. Record binary/source identity, initialization separately from search, five alternating fresh-process runs under the authorized 8-GiB, two-low-priority-core, 30-minute ceiling, and median with raw per-run data. A result below 50%, a failed invariant, or memory-limit violation disproves this candidate's immediate goal. Inspect a fresh profile before another redesign.

## Implementation reconciliation and next step

No implementation deviation is accepted by this sketch. First implement the widened exact-size boundary and its overflow regression, then the direct-offset raw caller as a separate verified unit. Any necessary change to the pinned runtime, proof graph, or host acceptance contract requires a revised design and approval rather than an implicit fallback.
