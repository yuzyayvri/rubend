# H0 corner classes

The Bend builder reaches 3,393 classes covering all 153,090 raw corner states.
Every stored transformation returns its raw state to the recorded representative.
The audit recomputes all forty-eight stabilizer choices for every class and
checks that orbit size times stabilizer size is forty-eight. Repeating the
audit preserves the result because the derived counters are reset first.

An independent JavaScript corner-color oracle enumerates the same orbits and
compares all 1,048,576 physical words, including unused values and metadata.
There are 3,020 full-size orbits and 373 self-symmetric classes. The raw report
contains the complete orbit-size distribution. The four-MiB payload remains
ignored in build/evidence with mode 0444 and a recorded SHA256.

Six rejecting mutations cover an out-of-range transform, out-of-range
representative, missing stabilizer identity, invalid high mask bits, wrong
array size, and a false completion count. Each fails at its intended audit
code. A missing corner stabilizer bit is not the later missing edge-orbit test.

Full just test, just check, and standalone BendTT pass. The pure class builder
and auditor are imported by PROOF.bend. The same twenty-three laws remain.
This does not add a universal quotient or projection-refinement theorem.

Run just h0-classes-test in nix develop. The
[archive index](r04-corner-classes-v1/index.json) identifies raw results,
resource receipts, final source hashes, and the payload. Failed compiler
attempts are retained. They exposed reusable-binding annotations, a forbidden
computed tuple match, and the affine IO argument list. None counts as a pass.

Raw and quotient distances are the next check. No H0 pruning profile, search
gain, or full product table is claimed here. Independent review remains unrun
under the solo-work instruction.
