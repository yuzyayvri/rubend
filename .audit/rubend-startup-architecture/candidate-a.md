# Raw cache initialization design

## Problem

The experimental worker must load 277,136,640 audited words, preserve every distance, and retain Bend search and replay. Inspection of `src/joint-cache.bend` and `bench/advanced-main.bend` shows byte-list loading, a proposed bounded word reader, a separate fingerprint pass, and a full backward layout copy. Removing byte boxing and that copy is a plausible startup improvement. A 50% reduction remains unmeasured.

This Phase B package uses `.audit/rubend-startup-grounding.md`, the live loader and foreign readers, both experimental entrypoints, `bench/advanced-profile.mjs`, and `docs/issues/cache-size-arithmetic.md`. Application files and experiments remain untouched.

## Usage, caller's view

These are language-neutral contracts, not compilable Bend implementations. Callers receive the existing worker array layout. They cannot choose chunk size or destination offsets.

Design A lets Bend own allocation and transfers that owner through bounded IO.

```text
advanced worker:
	table <- RawCache.prepare(path)
	print ready
	H.worker_loop(fuel, table, request)

advanced one-shot command:
	table <- RawCache.prepare(path)
	H.command_budget(budget, facelets, mode, table)
```

Design B makes one foreign import responsible for creating the destination array.

```text
advanced worker:
	table <- RawImport.prepare(path)
	print ready
	H.worker_loop(fuel, table, request)

advanced one-shot command:
	table <- RawImport.prepare(path)
	H.command_budget(budget, facelets, mode, table)
```

Both calls either return a complete array or terminate startup with exit code 2. Neither exposes a partial table. The host acceptance check verifies the pinned SHA-256 before accepting benchmark results. These APIs alone do not certify cryptographic identity.

## Shape

Recommend A. `RawCache.prepare` owns the raw format, final layout, initialization, and failure policy. Its result stays compatible with current search signatures.

```text
public prepare(path: String) -> IO(Array<U32>)

internal RawLayout = fixed raw word count, prefix, capacity, fingerprint
internal LoadState = File * Array<U32> * nextWord * remainingWords
internal open_exact(path: String, words: U32) -> IO(Result<Error, File>)
internal read_exact_words(file: File, table: Array<U32>,
	destination: U32, count: U32)
	-> IO(File * Array<U32> * Result<Error, Unit>)
internal close_exact(file: File, words: U32) -> IO(Result<Error, Unit>)
```

`prepare` allocates `[U32; 2^29]` in Bend, reads into destination 8,388,608, and fingerprints the loaded range using logical indices starting at zero. It expects the existing raw fingerprint 2620826876. Bend generates and checks the small table, then copies its 8,388,608 words into the prefix. It never shifts the raw words. Search accesses the same final indices as before.

`LoadState` consumes and returns one array owner. Only the event-loop completion callback writes Bend memory. The IO worker owns at most one 1-MiB temporary byte buffer and never dereferences the Bend array. A chunk returns success only after complete decoding and copying. Partial reads retry, EINTR retries, and EOF fails. A failed chunk writes no words. Earlier successful chunks are discarded with the failed startup, not returned to search.

The private native file boundary uses `fstat` and unsigned 64-bit checked arithmetic. It rejects nonregular files, negative sizes, counts above 1,073,741,823, and sizes unequal to `4 * words` before narrowing. This deliberately limits the generic helper to representable U32 byte lengths. The chunk boundary independently checks owner tag, unshared buffer, positive count at most 262,144, and `destination <= capacity` plus `count <= capacity - destination`. Bend advances indices only within the validated layout. JS uses equivalent integer and capacity checks and small-fixture parity tests.

`close_exact` checks the final file size and EOF before closing. Every failure closes the handle and releases scratch before terminating. Memory-allocation failure must also terminate without ready. Crashes leave no persistent loader state. A new process begins from an empty array.

`src/joint-cache.bend` retains serialization utilities used by cache generation. The raw preparation policy belongs in a dedicated effectful raw initializer. `src/word-io.bend` and its C and JS implementations own only file transport. `bench/advanced-main.bend` calls the initializer. `PROOF.bend` remains independent of these IO modules. The default light app remains unchanged. Block-cache loading is a separate experimental format, not another raw-loader choice.

Per Model the Domain, the caller supplies a path instead of a loose tuple of dimensions, offsets, and fingerprints. Per Boundary Discipline, the foreign boundary validates arithmetic and ownership while Bend retains table mathematics. The public call hides chunking, lifecycle, layout preparation, and rejection. The internal effect is not a supported application API. If Bend cannot enforce module privacy, the dependency check must reject imports outside the owning cache module and its fixture tests.

## Alternatives considered

Design B has the same public contract but a different allocation boundary.

```text
public prepare(path: String) -> IO(Array<U32>)
internal import_raw(path: String) -> IO(Result<Error, Array<U32>>)
```

The foreign worker opens and validates the raw file, reads all 1,108,546,560 bytes into private scratch, and closes it. On successful completion the event loop creates the 2-GiB Bend array, decodes into the final offset, and frees scratch. Bend then performs the same fingerprint and small-table work. Failure publishes no array. All length, EOF, identity, and failure contracts match A.

B hides more lifecycle behind one effect and avoids intermediate array transfer. It loses because it needs roughly 1.03 GiB of additional scratch and foreign Bend-array construction, which the existing prototype has not validated. Its final callback performs one unbounded full-cache copy. A needs only the already demonstrated owned-buffer update mechanism. This is an ABI-risk judgment, not measured evidence that B is slower.

Per Exhaust the Design Space, these alternatives move allocation and whole-file failure ownership across the foreign boundary. They are not two chunk sizes.

## Synthesis decision

This runner recommends A. Panel synthesis remains the orchestrator's responsibility. Retain direct final-offset loading and checked wide file sizes together. Do not graft B's full-file scratch into A.

Both designs pass the caller-coordination screen. A's private helpers must remain unreachable to ordinary callers. Keep one raw preparation path, derive chunk bounds from remaining work, and reject stale duplicated format constants through executable checks.

## Tradeoffs accepted

- Accept the existing 2-GiB allocation to preserve hot lookup and search contracts.
- Accept the Bend fingerprint pass to retain the current consistency check.
- Accept one bounded temporary copy per chunk to keep background IO away from affine memory.

## Verification and risks

Disprove A with fixtures for endian patterns, chunk boundaries, nonzero offsets, EINTR, short reads, premature EOF, appended data, and failed second chunks. Test wrapped counts and offsets before allocation. Check unchanged canary words on rejected chunks. Compare native and JS outputs. Compare all loaded raw words against the sealed file, then rerun replay cases and all 163 shallow optima. Run `just check` and the independent proof verdict after implementation.

Require five alternating fresh-process runs per candidate and frozen baseline under the authorized resource ceilings. Report median process-to-ready, SHA acceptance time separately, total startup, and aggregate peak memory. Retain identical checks and disclose filesystem cache state. Passing requires candidate median at most half the baseline median, plus correctness gates.

Can the input change while hashing or loading? The current acceptance flow assumes a stable sealed local file. Size and fingerprint checks do not defeat adversarial same-size mutation. Preserve that explicit precondition and reject observed metadata changes. A general mutable-input contract would require further design.

## Implementation reconciliation

No implementation or experiments ran. No accepted deviations exist.

## Next implementation step

Build the small fault-injection fixture for checked file sizing and atomic chunk publication before replacing the experimental raw initialization call.
