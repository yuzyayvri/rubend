# Bit-level packed corner routing

The [reference inversion confirmation](u02-reference-inversion-v1/index.json)
passed with 1,725 matching seals, no resource stop and its worker gone. Work now
starts connecting the actual packed implementation to the reference model.

## U32 has proof-visible bits

Inspection of the pinned toolchain's `bend base U32`, `bend base Word` and
`bend base Bool` shows that `U32` contains `Word(32n)`. `Word` is a fixed-width
Boolean structure. Packed arithmetic is therefore not an opaque obstacle in
the proof checker. The guard preserves the actual definitions it inspected.
Earlier research sketches did not establish this fact and are not used as a
reason to defer bit-level refinement.

The new proof-producing generator parses the corner-permutation field of the
actual `Cubie.turn` implementation. It expands constant shifts, masks and ORs
into Boolean expressions. Small checked Boolean lemmas simplify each output
bit, and 32-bit extensionality joins the resulting equalities. The emitted
proof's goal still calls the actual `Cubie.turn`; the generator's interpretation
is not accepted as a correctness oracle.

The target corner-position permutation is independently derived from the current
literal `Model.turn_*` definitions and checked against the source-bound cell
manifest. Stale manifests or unsupported syntax are rejected. Build the Lever
shaped this proof generator instead of hand-written bit-case enumeration.

## Exact scope

There is one statement per move, covering all eighteen moves and every 32-bit
corner-permutation word. The other packed fields are arbitrary. Each statement
proves that the resulting corner word routes its eight nibbles according to
the reference-induced corner-position permutation. No legal-label, parity or
orientation assumption is used for this word-routing fact.

The single-move pilot and complete eighteen-move module pass Bend and BendTT.
The generated complete proof source is about 1.28 MB. It stays under `build/`.
The committed generator reproduces it, while the receipt binds its exact bytes,
source inputs and statement inventory. Generating into a second directory must
produce identical proof bytes. No distance table is generated.

The guard changes an actual packed U-move nibble source and requires rejection
at `cp_route_U`. It separately corrupts the reference target and requires the
same rejection. Both public checker entrypoints must reject both false claims.
A runtime mutant omits those proof claims and supplies the actual packed-routing
counterexample. Backend checks cover zero, all ones, each one-hot bit and 1,000
deterministic words, for 18,612 move comparisons.

These are source-semantic proofs plus emitted-JavaScript checks. They do not
certify the native compiler backend. Corner orientation, edge fields, packed
inverse reconstruction, validated-input reachability and loaded-bound
admissibility remain open. The full packed/reference theorem is not complete.
No production pruning or default changes are enabled.

## Fixed confirmation

```sh
nix develop --command node bench/u02-packed-routing-checks.mjs plan u02-packed-routing-v1
nix develop --command node bench/background-tests.mjs start build/evidence/u02-packed-routing-v1-plan.json
```

The guard checks the root verdict, Boolean proof helpers, all eighteen packed
statements, actual mutation rejection, backend samples and sixteen toolchain
gates. The [passing guard](u02-packed-routing-guard-v1/guard.json.gz) preserves
the four expected proof rejections and inspected Base definitions. Its
[backend samples](u02-packed-routing-guard-v1/samples.json.gz) contain the actual
packed-word counterexample. There is no resource stop.
Confirmation rechecks the complete pure routing module and reuses its
source-bound samples. Expected duration is three minutes with a three-minute
cap, three GiB and at most four low-priority lanes. Independent review is not
run. There is no application rebuild, timing retry, holdout use or publication.
