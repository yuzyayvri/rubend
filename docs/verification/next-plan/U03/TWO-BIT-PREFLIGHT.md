# Small edge-table two-bit preflight

Historical finite preflight. Yuzy's October 25 grant now approves NP04–NP08.
The subsequent [NP04 unit](NP04-CONSERVATIVE.md) adds its quantified semantic
proof and concrete checks. The original result and its earlier approval status
below remain unchanged as historical evidence.

Reuse the six audited native tables from `u03-pilot-u04-events-v1`. They contain
22,224 valid entries across one-, two- and three-edge domains. Do not regenerate
distances or extrapolate their distributions to the full six-edge database.

The private Bend codec stores sixteen two-bit codes per U32 and one fallback
minimum per 64 valid entries. One global base belongs to each packed table.
Values at or below the base get code zero. Larger values get the smaller of
their difference and three. Decode zero using the actual block minimum, never
the base. Other codes decode to base plus code. Reject unknown entries, wrong
source capacity, bases above 252 and invalid lookup indexes before array access.
Padding is outside the valid domain and does not affect fallback minima.

Two designs were considered. An exact escape side table preserves every byte
but needs another index and variable payload. The bounded saturating layout has
fixed allocation and explicit information loss. Test its loss and code-zero
fallback on the existing references first. Do not replace the existing exact
block-table codec or add another engine bound in this experiment.

The independent oracle compares every decoded entry with the exact byte value
for every base from zero through the table diameter. Record exact entries,
fallback uses, saturation, total lost distance and the full loss histogram.
Report payload and rounded U32-array capacity separately from an exact packed
byte baseline. Exclude runtime object overhead and do not call the difference a
measured process-memory improvement. No timing or speedup claim is planned.

Require actual missing-fallback, unsaturated-code and wrong-block corruptions
to fail. Exercise code-word/block boundaries, partial final blocks, refused
sentinels, malformed arrays and overflow guards. Compare native/JavaScript
checksums on separate synthetic fixtures. The native check does not relabel
synthetic fixtures as independently generated distance tables.

NP04 and NP05 remain unapproved and unproved. The module's checker verdict only
checks its typed ordinary definitions. Exhaustive finite checks on these small
references do not establish universal conservative decoding or admissibility.
Keep all code and packed data private. No production pruning, loader, full PDB,
new domain law, release holdout, independent review or publication.

The [canonical archive](u03-two-bit-v1/index.json) verifies 2,242 seals and three
resource receipts. The worker is gone with no resource stop. All 154,368
entry/base comparisons, 188 boundary checks, 99 refusals and three actual
corruption controls pass. Twenty-one synthetic native cases match JavaScript.
The pure module and unchanged proof/toolchain gates pass.

For illustration, each three-edge packed table uses 3,300 payload bytes and
5,120 rounded array bytes, plus two U32 scalar fields and runtime object overhead.
An exact packed-byte layout would have 10,560 payload bytes and 16,384 rounded
array bytes. That byte layout is a comparison, not an observed process allocation.
At base 3, 10,025 and 10,013 of each pattern's 10,560 values remain exact. Maximum
loss is three. Those finite results do not choose a production base or establish
useful pruning. Screen conditional information on saved native contexts next.
