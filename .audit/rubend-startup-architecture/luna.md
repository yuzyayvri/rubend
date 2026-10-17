# Cache startup loader design

## Problem

The advanced and block entrypoints need one owned Bend `Array<U32>` containing an already audited 277,136,640-word little-endian cache before their existing Bend-side checks, small-table generation, layout preparation, and worker startup. The current byte-list route boxes bytes; the native prototype reads bounded chunks into a single affine array, but its generic size calculation uses wrapping `U32` multiplication. Cache identity must remain checked by the host acceptance gate, and the Bend fingerprint is only a consistency check. File IO may stay foreign only outside the pure proof graph. No search or table mathematics moves out of Bend.

## Usage (caller's view)

Recommended caller shape:

```bend
def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    words : Array<U32> <- Cache.load_words(path, [0 : U32^29n], 0, 277136640)
    words : Array<U32> <- verify_and_prepare(words)
    return words
```

The block profile uses the same loader with its own checked destination offset and expected count. A test caller supplies a temporary cache path and verifies exact words, rejection, and readiness behavior. The public entrypoint stays one call; callers do not manage file handles, chunk sizes, byte buffers, or retry policy.

## Shape

### Candidate A: bounded effect fills caller-owned affine array (recommended)

The caller preallocates the final capacity once. The loader owns file lifecycle, exact-size validation, checked chunk arithmetic, bounded reads, and final failure handling. Each successful effect writes one complete chunk on the event loop into that one unshared Bend array. A later failure terminates the load; no caller receives a partially loaded array.

```bend
type LoadRequest = { path: String, destination: Array<U32>, offset: U32, count: U32 }
type Loaded = Array<U32>
def load_words(request: LoadRequest) -> IO(Loaded)
def read_words(file: File, destination: Array<U32>, offset: U32, count: U32)
  -> IO(File & (Array<U32> & Result<&1, &1, U32 & String, Unit>))
```

Before opening or scheduling reads, validate `count <= floor(MAX_U32 / 4)`, checked `count * 4`, destination capacity, `offset + count` without overflow, exact file size, and chunk/fuel limits. Each read retries `EINTR`, completes short reads, and publishes no writes until all bytes in that chunk exist. Failure closes the file and returns a failure/terminates through the loader boundary; the partial destination is unreachable to the caller. One owner remains responsible for the Bend array. Keep the effect module outside `PROOF.bend`'s pure dependency graph. Host cache identity verification remains before launch; Bend's existing fingerprint remains a secondary consistency check, not proof.

The public interface is one deep operation. It hides file, chunk, buffer, retry, and close policy while leaving destination placement explicit because raw and block layouts differ. This follows boundary discipline and keeps the proof boundary pure. The design does not move fingerprinting, table generation, shifting, or search out of Bend.

### Candidate B: one-shot importer returns a fresh exact array

Callers delegate allocation and reading to a single foreign import operation, receiving a newly owned array already filled from offset zero.

```bend
def table() -> IO(Array<U32>):
  do IO<Array<U32>>:
    path : String <- IO.try(String, IO.get_env("RUBEND_JOINT_CACHE"))
    words : Array<U32> <- Cache.import_words(path, 277136640)
    words : Array<U32> <- verify_and_prepare(words)
    return words
```

```bend
type ImportRequest = { path: String, count: U32 }
def import_words(request: ImportRequest) -> IO(Array<U32>)
```

The importer must establish file size using checked wide arithmetic, allocate one exact-sized Bend buffer, read fully with EINTR/partial-read handling, and publish only on total success. Failure returns no array and closes/frees all resources. The caller then performs the same Bend fingerprint, layout transform, and generated-table work.

This removes destination-offset knowledge and chunk orchestration from callers, but ownership/allocation of Bend storage becomes a more demanding foreign contract. It may require runtime-private allocation interfaces and concentrates a potentially long operation in one effect. Its interface is smaller and deeper, but implementation portability and safe array construction are materially riskier. It must not patch or depend on an unpinned Bend runtime.

## Synthesis decision

Use Candidate A. It matches the existing effect's demonstrated runtime contract and confines foreign code to bounded IO plus writes into an explicitly owned array. It supports both profiles' distinct layout offsets without exposing byte transport types. Candidate B is structurally distinct and attractive at the call site, but safe fresh-array construction from foreign code is not established by the grounding evidence and risks depending on runtime internals.

## Tradeoffs accepted

- We accept explicit destination offset and capacity at the loader boundary in exchange for a single array owner and compatibility with both layouts.
- We accept repeated bounded effect scheduling in exchange for bounded temporary memory and complete-chunk publication.
- We accept that failure may leave internal destination memory modified in earlier chunks in exchange for never returning it as a usable result.

## Alternatives considered

Candidate B's one-shot importer exposes only path and count and hides placement policy, but requires a foreign-owned Bend allocation contract not evidenced by the pinned runtime API. The current byte-list implementation exposes a `+List<U32>` transport and allocates per byte; it has no performance case to justify retaining it as a parallel production route. A pure Bend storage rewrite cannot avoid the pinned file effect's list-cell representation without another foreign IO boundary.

## Implementation reconciliation

No implementation deviations accepted. Preserve the requested outcome that failures never publish a usable partial array; revise this contract before any implementation unit if a concrete runtime limitation requires another outcome.

## Open questions and risks

- Can the pinned Bend runtime's effect ownership model guarantee the supplied array remains unshared through each event-loop write, as the current prototype assumes?
- Does five alternating cold process-to-ready runs show the required at least 50% median reduction while preserving exact distances, replay behavior, and shallow optima?
- Can tests exercise malformed sizes, wrapped byte products, short reads, EINTR, EOF, and failure after a prior successful chunk without modifying the sealed baseline cache?

## Next implementation step

Add checked wide size and offset validation plus isolated read-effect regression tests before changing either experimental entrypoint.
