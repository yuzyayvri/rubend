# A table checkpoint is not a UI move list

The first tiny-checkpoint run passed the pure Bend verdict and generated module.
Its JavaScript restart suite then failed with `List limit exceeded` at
`apps/model.mjs:22`. A three-edge table has 10,560 entries. Its checkpoint adds
five metadata values, so the actual packet has 10,565 values.

The suite incorrectly used the UI move-list converter. Its 10,000-item limit
is appropriate for that boundary and remains unchanged. The fix is a
benchmark-only decoder that requires exactly the declared pilot's cardinality
plus five. It validates U32 elements, a final Nil, supported counts and bounded
traversal even for a cyclic malformed list. Counts four through six are not
admitted by this tiny-pilot decoder.

`tests/edge-checkpoint-codec.mjs` uses the actual unchanged compiled Bend packet.
It reproduces the original converter's failure, then requires full packet
equality through the corrected converter. Malformed and cyclic lists and
unsupported counts must reject. The failed run remains failed in
[its archive](../verification/next-plan/U03/u03-checkpoint-v1-failed/index.json).
The additional [source and failure snapshot](../verification/next-plan/U03/u03-checkpoint-v1-failed/checkpoint-sources-and-failure.json.gz)
retains the exact pure source, generated module and original diagnostic.
The [partial-checkpoint snapshot](../verification/next-plan/U03/u03-checkpoint-v1-failed/partial-checkpoints.json.gz)
preserves all 22 files written before that failure.

Recovery reuses that successful proof and byte-identical module. No table
builder, established law, production limit or expected distance changes.
The complete restart/native recovery subsequently passes in
[v3](../verification/next-plan/U03/u03-checkpoint-v3/index.json). The actual old
converter failure remains an executable control. The production limit is unchanged.
