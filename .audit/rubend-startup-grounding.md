# Loader grounding

This explanation came from the read-only `startup_how` agent on gpt-6.1-sol.
It traces the prototypes present when the user added pstack routing.

## Overview

The experimental native entrypoints turn a raw little-endian word file into an
owned Bend lookup array. They verify its length and fingerprint, add the generated
small tables, and only then print `ready`. This initializes the Bend solver.
It does not implement foreign search. The entrypoints are
`bench/advanced-main.bend` and `bench/block-main.bend`.

## Key concepts

`Cache.load` is the byte-list loader. `Cache.load_words` is the foreign word-read
prototype used by both current entrypoints. Both return the array through IO.
The latter preserves the file and array in its effect result instead of creating
a separate table. The cache contains raw words without an embedded header.
Expected dimensions and fingerprints come from the consuming entrypoint.

## How it works

```text
environment path
    |
exact file-size check
    |
bounded word reads into owned array
    |
Bend fingerprint check
    |
small-table generation and layout preparation
    |
ready and Bend worker loop
```

`load_words` opens the file and requires its size to equal `count * 4`. Each
chunk contains at most 262,144 words. An 8,192-step fuel limit bounds the loop.
Completion closes the file and returns the array. File-size errors, read errors,
and exhausted fuel terminate through `IO.die` with exit code 2.

The native effect accepts only an unshared `TAG_BUF`, a positive chunk count no
greater than 262,144, and an offset range within the physical power-of-two
capacity. It checks the range with 64-bit arithmetic before scheduling the read.
Invalid arguments produce `EINVAL`.

The read callback fills a temporary byte buffer. It retries `EINTR`, continues
partial reads, and treats premature EOF as `EIO`. The pack callback writes
nothing unless the whole chunk succeeds. It then decodes little-endian U32
values and calls `blk_write` against the owned buffer on the event loop. It frees
the temporary allocation and returns the file, original table, and result.
Earlier successful chunks remain written if a later chunk fails. The Bend
wrapper terminates instead of returning that partial table.

The JS counterpart also fills its byte buffer before changing the table.
It checks JS-array shape and bounds but has no native ownership-tag check.

The older `Cache.load` boxes each byte through `File.read_bytes`. Its `decoded`
function consumes four list cells per U32. The pinned runtime's
`bend2/effs/file_read.c` calls `io_list`, which creates those list cells.
The word reader avoids that representation. Unlike the word reader, the older
loader rejects a short chunk instead of retrying it.

After loading, Bend fingerprints every expected word with its logical index.
The raw entrypoint requires 2620826876, then moves the joint words backward to
leave an 8,388,608-word prefix. Backward copying avoids overwriting unread words.
The block entrypoint loads after the prefix and requires 3919871918. Both
generate the small table, check its size, and copy it into the prefix.

## Where things live

- `src/joint-cache.bend` owns chunking, decoding, fingerprints, and layout copies.
- `src/word-io.bend` declares the foreign IO boundary.
- `src/word-read.c` and `src/word-read.js` implement that effect.
- `PROOF.bend` imports pure domain, table, audit, and search modules. It does not
  import the loader effects or benchmark entrypoints.

## Gotchas

The fingerprint is a 32-bit consistency check, not a collision-free certificate
or a full distance-table audit. `ready` means the initialization checks returned.
It does not establish formal search completeness or optimality.

Foreign reads and direct writes remain outside the pure proof boundary. Their
runtime ownership checks do not prove the foreign implementation correct.

Generic `count * 4` arithmetic uses U32 and can wrap for large caller-supplied
counts. Present entrypoint counts fit. The file-size check does not prevent
concurrent modification while loading.

This code trace establishes mechanisms, not a measured startup limiter,
native and JS equivalence, or a speedup.
