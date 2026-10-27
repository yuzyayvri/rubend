# A checkpoint length check exhausted the JavaScript stack

The second checkpoint queue passed the packet-decoder regression, then its
fresh-process restore failed with `Maximum call stack size exceeded` in the
generated `$List$length$` function. The actual input has 10,560 table values.
The adapter's call to Base `List.length` uses non-tail recursion in this backend.

The [failed archive](../verification/next-plan/U03/u03-checkpoint-v2-failed/index.json)
preserves 2,777 seals and both receipts, worker gone. The
[additional snapshot](../verification/next-plan/U03/u03-checkpoint-v2-failed/stack-and-partials.json.gz)
contains the exact pure source, compiled module, diagnostic and 23 partial files.
The original UI-converter failure remains a separate preserved run.

`tests/edge-checkpoint-stack.mjs` directly calls that old module's actual restore.
Using it as the candidate reproduces the same RangeError before a fix.
The fixed adapter replaces only this generic length call with `sized`, a
tail-recursive exact-length check bounded by the pilot's geometry. The current
module restores all 10,560 values and returns the full 10,565-value packet.
Inputs one value shorter or longer refuse. Node's stack settings, product
limits and the table builder are unchanged.

The focused before/after check and the fresh pure verdict pass. The complete
[v3 guard](../verification/next-plan/U03/u03-checkpoint-v3/index.json) also passes
34 process restarts, six repeat and crash controls, full table equality and
four native-memory restore cases. The old stack overflow remains a control.
This list-based tiny pilot is not a scalable six-edge file format. A larger
native implementation needs bounded chunked transport and its own measured
scratch/admission evidence, not a larger JavaScript stack.
