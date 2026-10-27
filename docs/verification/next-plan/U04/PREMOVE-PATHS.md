# One-move premove path conventions

Ordering did not confirm its pilot gain on development. Keep the original
round-robin baseline and test a different candidate-generation mechanism.
This preflight implements only path transformations. It adds no search tasks,
changes no pruning, and measures no strength benefit.

Words act on the right. A preturn m changes root g to g*m. If q solves that
child, m*q solves g. Engine paths are stored reversed, so reconstruction appends
m to the reversed child path. A conventional left preword needs a different
formula and is not silently substituted here.

`Seed` is either `NoSeed` or one typed `Model.Move`. The numeric boundary rejects
invalid seeds and frames before their interpretation. Frame variants retain
the existing three axis views and their inverses. `local_incumbent` derives a
valid child incumbent by prefixing inverse(m) to an original solution, then
applies the existing axis/inverse path mapping. `reconstruct` maps back,
prepends m in forward order and normalizes adjacent turns of the same face.
Normalization reduces HTM count but does not claim optimality.

The solo design pass compared an overloaded numeric task axis with explicit
seed/path operations. Use explicit operations in `bench/premove-paths.bend`.
Search and portfolio records remain untouched. Independent sticker geometry
checks the actual transformed roots. Pinned KPuzzle replays local solutions,
and the independent sticker model replays reconstructed original solutions.
All eighteen preturns, no-preturn control and six frames are tested on sixty-four
frozen reaching words. Pair/cascade cancellation and random normalization words
are checked separately. Wrong prefix side, missing inverse frame and wrong
turn modulus are actual compiled-source corruptions, not labels on mocks.

A native checksum consumes the complete frame/path packets for the same 7,296
cases. It is compared with the independently replay-checked JavaScript lane.
This is backend parity, not an independent native oracle or a speed result.
Type/kernel checking is not a universal composition theorem. No new domain law
is added or assumed, and no NP04–NP08 approval is inferred.

The queue is `u04-premove-paths-v1`, expected four minutes with a fifteen-minute
cap. Compilation uses four low-priority lanes; the oracle and native jobs run
serially. Each job is capped at three GiB or less. No PDB/cache generation,
release corpus, production integration or publication occurs. It also checks
automatic bounded archival of large traces, the original eight receipt/seal
negative controls, and unchanged proof/toolchain gates. Further premove
candidate search and quality/deadline measurement remain open.

The [completed archive](u04-premove-paths-v1/index.json) verifies 1,943 source
seals, four receipts, clean worker exit and no resource stop. All 7,296 frame
cases, 14,592 independent replays and 2,375 normalization cases pass. Each
source corruption has an actual geometry or original-replay counterexample.
The native backend consumes all 7,296 packets with matching checksum
3,678,616,013. Pure definitions pass BendTT and unchanged proof/toolchain gates
pass. This is finite transformation evidence and backend parity, not a strength
result or universal composition theorem.
