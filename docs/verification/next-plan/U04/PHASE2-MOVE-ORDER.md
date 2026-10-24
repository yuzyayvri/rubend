# Phase-two move ordering

Task ordering and premoves have measured dispositions. This unit starts the
separate move-ordering experiment from U04. It changes traversal order only in
restricted Subgroup finishing. FullCube and reduction retain their existing
move order. Production sources stay unchanged.

The proposed key uses the maximum of the two existing small phase-two child
bounds. Visit children with an estimate below the next radius first, then tight
children, then overflowing children. Keep every column, including moves that the
existing legality or bound guards reject. No estimate becomes a new pruning rule.
Sorting cannot reduce the complete exhausted tree. Its possible benefit is
finding an incumbent earlier; its cost can outweigh that benefit.

There are ten phase-two columns. Store three disjoint ten-bit masks in the
existing `Node.next` U32, with bit30 marking a prepared cursor. A fresh zero
cursor gathers scores once. Select the lowest pending column from the first
nonempty bucket, then clear only that bit. The prepared empty word ends the
node. Child frames and retry frames still start at zero. Do not treat a prepared
cursor as an ordinary ordinal or allow it into another goal.

A cached sorted list would add a copied frame field and allocation. Recomputing
the full order for each choice would repeat probes. The packed buckets keep the
frame layout unchanged and make complete-column coverage directly testable.
This is a solo sequential design comparison, not independent review.

Before search measurements, exhaust all59,049bucket assignments on ten columns.
Check stable ties, every column exactly once, disjoint masks, pause/resume,
prepared-empty handling, radius boundaries and malformed input. Compile actual
omission, duplicate-selection and goal-routing corruptions and require concrete
counterexamples. Compare actual generated Search child sets with the unchanged
Search on the same ordinary Light table, roots, goals, radii and prior faces.
Include coordinates and packed child state in an order-independent checksum.
The table is the same normal small initialization, not a new distance database.
The native check covers4,800combinations of sixteen seeded restricted walks,
three goals, ten radii and ten prior-face/root-mask codes. Another160checks
compare gathered child scores against direct turn-and-encode lookups. Synthetic
cursor checksums cover128packets on both backends. Root words are deterministic
fixtures, not independent solution-quality cases.

This preflight proves no universal search theorem and reports no performance
acceptance. It adds no domain law or new bound. If it passes, the next experiment
measures the isolated ordering policy on fixed native budgets, including all
score collection and cursor work. Deadline quality and exact progress retain
their existing floors. Do not reuse the cold pilot roots as fresh confirmation.

The fixed queue is `u04-move-v2`, expected four minutes, capped at twelve.
Compilation and proof checks use at most3GiB and four low-priority lanes.
The oracle/native job uses one lane and1GiB. No browser or raw-cache read.
The unused v1 plan was not launched. A prelaunch ABI probe returns primitive
JavaScript booleans, not tagged Bool objects. The fixture now uses that actual
representation for `valid`, `active` and the nonfresh cursor argument.

The [canonical archive](u04-move-v2/index.json) verifies 2,401 seals and three
resource receipts, worker gone and no resource stop. All59,049bucket assignments,
123boundary cases, eleven resume points and fourteen refusals pass. Both actual
cursor corruptions fail. The unchanged and generated search agree on all4,800
child-set cases and160score checks. The goal-routing corruption has3,200
counterexamples. All128native cursor packets match JavaScript, checksum861589760.
The pure cursor and generated Search pass BendTT. Unchanged proof and toolchain
gates pass. No universal coverage proof, full-search quality, CPU gain or
production integration follows from this finite preflight.
