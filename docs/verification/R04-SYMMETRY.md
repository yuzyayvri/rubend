# Forty-eight spatial symmetries

The specification action and all five approved laws are implemented. The
ordinary checker and BendTT accept all twenty-three laws. The original eighteen
statements are unchanged. This completes the symmetry foundation of R04, not an
H0 table or a solver-strength improvement.

## Checked behavior

The generator enumerates signed axis-permutation matrices. Its closed Bend type
contains twenty-four proper rotations and twenty-four reflections. Identity,
composition, inverse action, move conjugacy, and the solved fixed point hold
for every specification cube, including arbitrary U32 sticker values. A
separate check compares the executable laws exactly with the approved text.

The position and color actions agree with an independently enumerated closure
of two quarter-rotations and a mirror. Tests cover all forty-eight distinct
actions, eight raw cube patterns, 18,432 composition comparisons, and 6,912
move-conjugacy comparisons. Thirty-two uniform legal cubes give 27,648 mapped
move comparisons against cubing.js 0.66.0 KPuzzle.

The native driver agrees on 384 raw cube actions, all 2,304 composition IDs,
and all 864 mapped moves. Its 20,736 emitted sticker values agree with the
checked positional data. The JavaScript test adapts the generated module's
qualified move tags explicitly. It compares cube fields rather than assuming
that constructor tags match between separately compiled modules.

Three deliberate behavioral errors fail the oracle checks. Two source
mutations also fail the ordinary proofs at their intended obligations: wrong
reflection turn sense fails move conjugacy, and changing out-of-palette values
fails color composition. These are proof rejection checks, not an independent
human or agent review.

Full just test, just check, standalone BendTT, and translation export pass.
The emitted default-engine C is byte-identical to the frozen pre-change C.
An initial comparison with an older main-worktree binary was not a matched
baseline and is not used as a result. No default search source or profile
changes in this unit.

## Reproduction and evidence

Run in the pinned development shell:

```sh
just symmetry48-test
just test
just check
bend PROOF.bend --verdict
bend PROOF.bend -o build/symmetry48-proof.bendtt
```

The [archive index](r04-symmetry-v1/index.json) identifies nineteen lossless raw
records. The summary archive binds final source hashes, unchanged law sources,
the twenty-MiB proof translation, and equal default-engine C hashes. Large
translations and compiled outputs stay in ignored build/evidence, not Git.
bench/symmetry48-evidence.mjs recreates an archive set in a fresh destination
after the named local records exist.

The final regression batch finishes in 188 seconds with exit zero and no
resource stop. It uses a 6,144-MiB ceiling, CPUs 2 through 5, nice 10, no swap,
and the desktop-memory backstop. Peak aggregate RSS is 2,203,928 KiB. These
single development-run observations are not a benchmark or speedup claim.

Failed development attempts remain in the archives. Two monolithic proof
layouts hit a two-GiB backstop. A smaller diagnostic exposed a numeric-wildcard
reduction problem. The structural color action resolves it without narrowing
the law. Other rejected attempts used an invalid match order, combined mutually
exclusive CLI options, omitted reusable native-driver indexes, or expected an
unqualified proof-location name. None counts as a successful check. Historical
intermediate generated sources were not sealed, so those diagnostic costs are
not reproducible performance comparisons. The final source and checks are
reproducible.

## Remaining R04 work

The specification is not the packed coordinate kernel. Next come the corner
projection, the small 153,090-state reference and expected 3,393-class quotient,
complete stabilizer handling, edge placements, and bounded generation admission.
No H0 pruning data or integrated search result exists yet. The action laws do
not prove projection refinement, data admissibility, or search completeness.

Independent review remains not run under Yuzy's solo-work instruction. There
is no default switch, packaging promotion, or world-class result in this unit.
