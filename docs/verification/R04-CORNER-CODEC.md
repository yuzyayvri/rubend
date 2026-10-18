# H0 corner coordinate

The first H0 corner unit is implemented in Bend. All 153,090 dense indexes
round-trip, produce legal canonical representatives, and have unique sparse
keys. This is the raw coordinate, not the symmetry quotient or pruning table.

The coordinate stores the four-of-eight tetrad-separation mask and the existing
seven-trit twist rank. The decoder rejects 153,090 and U32 max. Independent
JavaScript enumeration checks every separation, twist, canonical corner
permutation, edge-parity correction, and sparse key. A native audit validates
every representative and reproduces the same 3316567590 fingerprint over all
765,450 packed cubie words.

One thousand uniform legal cubes give 18,000 transition comparisons with the
original packed move model. Another 6,144 checks compare reference symmetry
actions on arbitrary cubes with actions on canonical representatives. All
forty-eight reference transforms fix the target coordinate. Its measured dense
index is 23. U is not the target, even though it is in the old reduction
subgroup. Superflip's solved corners remain at the target.

The pure module is reachable from PROOF.bend. The same twenty-three laws pass
the ordinary checker and BendTT. No new law is added. This does not establish
a universal rank/unrank or projection-refinement theorem.

Full just test, just check, and a separate BendTT run pass. A final focused run
adds the explicit target checks. The default engine's emitted C remains
byte-identical to the frozen pre-change C. No default search source changes.
The full regression batch exits zero after 199 seconds with no resource stop,
using the existing 6,144-MiB ceiling and four low-priority CPU lanes. These are
single development-run observations, not a speedup claim.

Run just h0-corners-test in nix develop. The
[archive index](r04-corner-codec-v1/index.json) identifies the raw checks,
resource records, source hashes, and ignored translation/default-C identities.
The first compile attempt failed because the unranking fuel was used more
than once without its reusable annotation. The corrected version passes. The
rejected attempt is retained and not counted as a result.

Next are the expected 3,393 symmetry classes, all transformations to
representative, complete stabilizers, and raw-versus-quotient distance checks.
Those have not run. No full H0 table is built or admitted. Independent review
remains not run under the solo-work instruction. No solver-strength gain or
universal formal optimality follows from this unit.
