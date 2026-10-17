# Cache length arithmetic needs a checked boundary

Status is implemented with bounded synthetic regression evidence. The read-only loader trace identified U32 multiplication in
`src/joint-cache.bend` at `sized`. `count * 4` can wrap for counts above the
U32 byte-size range. Existing raw and block profile constants fit, and failed
reads stop before a solver becomes ready. This is a general loader-contract
gap, not evidence of a wrong returned cube solution.

Both loaders reject counts above 1073741823 before opening the file. They also
check index and remaining destination capacity before IO. The pinned Base
File.size rejects file sizes above U32_MAX using its wide host size. Both loaders
check size again after the last complete read and explicitly close handles on
read, size, validation, and fuel failures. The low-level effect retains its
separate physical-array and chunk bounds.

`tests/loader-boundary.mjs` checks wrapped count and index/capacity rejection
against an unwritten FIFO, sparse 4 GiB files, short/trailing data, nonzero
destination offsets, and injected growth or truncation after a complete chunk.
Native byte and word loaders and generated JavaScript word loading are covered.
The legacy byte reader uses Bun-specific FFI and is not claimed to run in Node.
Same-size concurrent modification remains outside this local immutable-cache
contract.

Evidence is `.audit/rubend-startup-grounding.md` and the `sized` definition.
