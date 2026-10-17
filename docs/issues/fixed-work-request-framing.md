# Fixed-work requests need byte-chunk framing

Status is resolved before adoption. The first comparison-tool prototype treated
each `File.read(file, 4096)` result as one TSV request. That operation returns a
byte chunk, not a line. Multiple requests or a split request would invalidate
the comparison.

The tool now accumulates a bounded request file, closes it, then splits complete
lines. A native regression uses 100 requests across the 4,096-byte boundary and
an unterminated final line. Malformed requests and input over 64 KiB fail.

Evidence is `docs/verification/fixed-work-v1/native-input.json`. Frozen and
current native comparisons subsequently matched 4,591 full-state snapshots per
side, including all 163 raw-profile shallow optima.
