# Forward coordinate reuse prototype

This is the independent coordinate-reuse treatment in U02. It does not add
pruning or bypass the remaining inference proof/data gates. The private
prototype passes functional checks. Performance has not been measured and no
search profile imports it.

## Mechanism and control

`ForwardAxes` holds twist, flip and slice coordinates for UD, FB and RL frames.
Initialization ranks the original cube and its two rotations. A child updates
each frame through its own correctly mapped face move. This replaces repeated
rotation/ranking with transition reads, at the cost of six extra coordinates.
It is not a method for maintaining inverse state. No NP08 rule is assumed.

The control advances its original three coordinates through the same table,
then rotates and ranks the child for the other frames. It does not rerank the
original coordinates and inflate the baseline. Both functional adapters return
all nine values so they can be compared field by field.

The prototype generates only the existing 85,140 move-transition entries in
an owned array with 131,072 slots. It reuses `Tables.fill`, not a second codec
or a new distance PDB. No joint, corner or H0 data is changed or regenerated.
The emitted native buffer stores U32 values, so its payload is 524,288 bytes.
That static payload calculation excludes the runtime heap and process RSS.

## Evidence

The [guard archive](u02-axis-guard-v1/index.json) passes the unchanged root
verdict, candidate type/termination verdict and emitted owned-array-mode check.
The native executable compares all nine carried coordinates with direct
recomputed ranks after each of 100,000 moves. Its result is consumed and checked.
The JavaScript check compares all 85,140 table entries with the existing
coordinate implementation and performs 38,000 whole-vector comparisons across
solved input, 999 uniform roots, all eighteen moves and twenty-move walks.
This is cross-backend testing, not an independent new coordinate oracle or a
universal refinement proof.

Both negative controls have actual mismatching vectors. Using the original
move in every frame leaves the rotated U-turn coordinates at zero instead of
their nonzero expected values. Corrupting transition 39,366 changes the UD flip
coordinate from zero to one. The temporary array entry is restored; no sealed
cache is opened for writing. Exact values are preserved in the sample receipt.

## Next comparison

Do not time the functional adapter and call the whole solver faster. Its
control also returns a nine-value record for comparison; it does not model the
existing retained frame size. An actual comparison must include the six extra
frame fields, initialization, additional reads and allocation. It must preserve
the current first-axis and predecessor filters, rather than force every node
through all three probes. Measure conditional pipeline frequency and costs.
Keep each treatment separate from subgroup inference and scheduling.

The next bounded confirmation is prepared with:

```sh
nix develop --command node bench/u02-axis-checks.mjs plan u02-axis-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-axis-v1-plan.json
```

It reuses the completed native and JavaScript checks, verifies artifact seals,
and reruns unchanged proof/toolchain gates. Expected duration is two minutes,
with a three-minute cap, three GiB and four low-priority lanes. No application
rebuild, PDB generation, holdout use or performance acceptance is included.
Independent review is not run under the solo instruction.
