# The actual packed inverse

The [fixed guard](u02-packed-inverse-v1/index.json) passes with 1,823 matching
source seals, no resource stop and its worker gone. Both Bend and BendTT prove
the complete actual function for every root presented by a reaching word:

```text
Cubie.inverse(pack(reference_root(word)))
  = pack(reference_inverse_word_root(word))
```

The resulting reconstruction bridge uses `Cubie.inverse` itself. It connects
that function to the kernel's exact reverse-and-invert convention, not an
assumed inverse-state witness.

## Construction

`bench/generate-packed-inverse.mjs` generates a source-shape module and a
separate refinement module. The shape module checks all five actual output
expressions on arbitrary packed inputs. The refinement uses the twenty proved
position lookups. Finite orientation-cancellation lemmas recover corner twists
and edge flips from two-sided reference composition. Small Boolean assembly
proofs then join the five words into the complete inverse cube.

The complete proof is about 353 KB outside Git. Repeated generation produces
identical bytes. No large enumeration or pruning-table build is needed.

## Verification

The emitted JavaScript agrees on 1,024 reachable roots and all 5,120 output
words across the actual inverse, typed inverse-word replay and separately built
cubie implementation. Another 1,280 raw-word comparisons check backend
compatibility, not legality of malformed inputs.

Actual corner-assembly, twist-sign and edge-assembly corruptions each fail
through both public checker entrypoints and have backend counterexamples.
A deliberately wrong root claim also fails both entrypoints and its runtime
adapter disagrees. The archive preserves all eight rejection diagnostics.
The root verdict and all sixteen toolchain gates pass.

The twelve-input assembler also exposed a bit-variable naming collision.
The parser now rejects ambiguous symbol lists. The guard reproduces the old
`v110` alias and requires the previous routing, packing and packed-move proof
outputs to remain byte-identical. See
[the collision record](../../../issues/packed-bit-name-collision.md).

## Boundary

The theorem covers roots presented by reaching words. It does not construct
a reaching word for every input accepted by validation. Coordinate/target
correspondence, loaded-distance admissibility, full search certification and
performance acceptance remain open. Production search is unchanged.
Independent review is not run. U03–U07 remain open.
