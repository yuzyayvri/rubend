# Research findings

Research date: 2026-10-16, Asia/Manila. This is a design investigation, not a
performance report. References and inspected revisions are in
[SOURCES.json](SOURCES.json). No external solver was benchmarked in this phase.

Later implementation measurements are separate in
[PORTFOLIO.md](../verification/PORTFOLIO.md). In particular, the pinned Nissy
CLI's current metadata supersedes older documentation about its smallest table
size and option spelling; see
[ADVANCED-PROFILES.md](../benchmarks/ADVANCED-PROFILES.md).

## What success means

A cube is not an adversarial game. Here, strength means finding short solutions,
reliably recognizing legal input, and proving when a result is shortest. The
primary metric will be HTM: any face turn, including a half-turn, costs one.
Quarter-turn length and physical execution speed are different measurements.

The 3×3 HTM diameter is 20, established by Rokicki, Kociemba, Davidson, and
Dethridge. This bounds the shortest answer, not the time a solver needs to find
it, and not the length a restricted two-phase search must return. An 18-move
answer can still be suboptimal for a particular cube. No solver can improve on
an already optimal move count; exceeding established engines means better
latency, resources, usability, or assurance at equal answer quality.

Sources: [the original project](https://www.cube20.org/),
[the 2013 paper](https://kociemba.org/math/papers/rubik20.pdf).

## Bend 2: promising, but measure the actual workload

The reviewed checkout is `bendlang/bend` at
`7e120d5bd257ed3704daf1301b02fd17f5d1fb9d`. Its Nix package installs the
official 2.0.37 release, not a compiler rebuilt from that checkout. The release
tag points to `4ff8545f19b09b7d2b8ca2303668100eac8efd66`.

The language's useful combination is dependent types, explicit ownership, and
proofs alongside executable definitions. Our model should make invalid states
hard to construct and require evidence for accepted solutions. Proofs protect
the laws we actually state; they do not discover missing requirements.

The guide describes affine arrays with an owner, power-of-two storage, and
wrapping indexes. Array bounds must therefore be explicit domain obligations,
not assumptions about runtime exceptions. Closures cannot simply be shared.
Recursion needs a decreasing argument; search depth and work fuel should lead
recursive arguments. The JavaScript backend is sequential. It is suitable for
interactive state handling, not the primary native-strength search.

There is no native U64 in the reviewed language. Large exact-search table
coordinates will need segmented U32 arithmetic or another measured
representation, with overflow checks and matching browser/native codecs.

Sources: [Bend guide](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/guide/GUIDE.md),
[base library](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/bend2/base.bend).

### Assurance boundary

BendTT's paper presents a kernel formalized in Lean. Bend's `--verdict` translates
the checked program and asks that kernel to check it again. The upstream
documentation explicitly distinguishes this from a proof of the compiler,
parser, translation, or runtime backends. Foreign functions, unsafe definitions,
and floating-point graphics are outside the intended pure proof boundary.

The kernel requested by release 2.0.37 uses Lean 4.34.0 exactly. Our pinned
nixpkgs offers 4.34.1, so the project fetches the official 4.34.0 archive by SHA256
and builds the kernel from the Bend release's bundled source. It does not
silently substitute a different Lean version.

Sources: [BendTT paper](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/paper/BendTT.pdf),
[verdict implementation](https://github.com/bendlang/bend/blob/v2.0.37/bend2/safe.ts),
[upstream limitations](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/README.md#limitations).

### The primary technical risk

High-end cube search repeatedly reads large pruning tables. The native runtime
uses a fixed fork-join scheduler and expects reasonably balanced tasks, whereas
search subtrees vary wildly in size. A shared Data tree, per-worker owned arrays,
and a serial owned-array search have very different costs. Cloning a large table
per task would be disastrous. Neither attractive C/GPU benchmarks nor the type
system settle this question.

Our first implementation experiment must compare these representations,
including physical memory, table-read latency, and generated C. Use bounded
resumable search slices to control imbalance. Do not assume GPU acceleration:
this workstation exposes an AMD graphics device, while the reviewed Bend native
GPU paths target CUDA on Linux and Metal on macOS. WebGL rendering is a separate
capability and can still use that GPU.

Sources: [BendRT paper](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/paper/BendRT.pdf),
[runtime/compiler](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/bend2/comp.ts),
[parallelism notes](https://github.com/bendlang/bend/blob/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/guide/SHADERS.md).

## Algorithm comparison

| Approach | Why study it | Rubend decision |
| --- | --- | --- |
| Beginner/layer methods | Understandable playback, weak move counts | Not the search engine |
| Thistlethwaite-style subgroup stages | Useful reduction model | Background, not primary |
| Kociemba two-phase | Excellent first-answer path; mature coordinates | First full solver |
| IDA* with admissible pattern databases | Can establish shortest paths | Exact-search foundation |
| nxopt / vcube / H48 | Symmetries, compression, inverse estimates, locality | Competitive exact-search track |
| Learned value/beam search | Interesting move ordering and research extensions | Defer; not an admissible bound by default |

### Fast answers

Kociemba's first phase reaches the subgroup generated by U/D turns and side
half-turns; the second solves within it. The first-phase coordinates have
2,187 twists, 2,048 flips, and 495 slice placements. Search multiple reductions
and retain improving answers rather than committing to the first reduction.
This does not by itself establish full-cube optimality.

`min2phase` is a useful compact implementation reference and comparison engine.
Its source includes GPLv3-or-later notices, while its README also includes MIT
text. Preserve file-level notices and pin provenance instead of inferring
licensing from repository metadata. Kociemba's Python implementation is a
second reference, but not an appropriate speed baseline for a native engine.

Sources: [Kociemba's explanation](https://kociemba.org/math/twophase.htm),
[min2phase](https://github.com/cs0x7f/min2phase),
[Kociemba's solver](https://github.com/hkociemba/RubiksCube-TwophaseSolver).

### Exact answers

Korf's 1997 paper uses iterative deepening with pattern-database lower bounds.
Combining admissible bounds with `max` remains safe; summing overlapping bounds
is not automatically safe. Sound pruning and complete traversal matter as much
as move speed. A verified replay establishes that a solution works, not that no
shorter solution exists.

Sources: [Korf, AAAI 1997](https://cdn.aaai.org/AAAI/1997/AAAI97-109.pdf),
[Kociemba's pruning notes](https://kociemba.org/math/pruning.htm).

Modern exact solvers demonstrate the importance of symmetry, cache locality,
compressed bounds, and inverse positions. Nxopt describes multiple memory
profiles and batching. Vcube reports six optimal solutions per second using
22 GiB on its author's machine; that is an upstream throughput report, not a
Rubend result or per-cube latency promise. H48 documents full-cube symmetries,
special treatment of self-symmetric states, and compressed fallback bounds.
Compression that accidentally overestimates a distance destroys exactness.

Sources: [nxopt](https://github.com/rokicki/cube20src/blob/master/nxopt.md),
[vcube](https://github.com/Voltara/vcube),
[H48 design](https://github.com/sebastianotronto/nissy-core/blob/master/doc/h48.md).

The H48 benchmark suite is a useful model for stratifying cases by optimal
depth. Its published single-thread means for 18-move positions include about
4.85 s with a 3.5 GiB H48 table versus 4.36 s with a 7.3 GiB vcube table. The
machines, table formats, and threading must be matched before comparisons; we
will not transplant these figures into Rubend's targets as measured results.

Source: [H48 benchmark conditions and raw tables](https://github.com/sebastianotronto/nissy-core/blob/master/benchmarks/benchmarks.md).

### Learning is not the first investment

DeepCubeA reports solving its test configurations, with shortest paths in 60.3%
of cases. A later CayleyPy preprint reports 98.4% on the DeepCubeA 3×3 dataset.
Those are dataset-specific findings, not universal shortest-path guarantees.
They justify later move-ordering experiments, not replacing admissible bounds
or starting an expensive training project before classical baselines exist.

Sources: [DeepCubeA, original paper record](https://www.nature.com/articles/s42256-019-0070-z),
[CayleyPy preprint, version 1](https://arxiv.org/html/2502.13266v1).

## Application options

Bend has native window/image primitives and a pure-Bend 3D demo. That is a real
option, but building a renderer, accessible controls, and text UI would compete
with the solver work. Prefer a local browser application: TypeScript and
Three.js for presentation; Bend-generated JavaScript for cube rules and replay;
a native Bend process for strong search. This keeps Bend responsible for the
domain, without making it responsible for every button and pixel.

Cubing.js/Twizzle is also valuable for playback design and independent cube
checks. Its current README describes MPL/GPL dual licensing plus vendored
licenses. Under GPL Rubend can evaluate it without the earlier MIT-only concern.
Still prefer explicit control of our renderer unless TwistyPlayer satisfies
editing, animation, and canonical-state integration in an early spike.

Sources: [Bend's graphics demo](https://github.com/bendlang/bend/tree/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d/demos/app_slash_boss_3d),
[cubing.js licensing](https://github.com/cubing/cubing.js#license),
[Three.js renderer](https://threejs.org/docs/pages/WebGLRenderer.html),
[OrbitControls](https://threejs.org/docs/pages/OrbitControls.html).

## Conclusions and unresolved questions

1. Build the actual solver in Bend; foreign reference solvers are not the product.
2. Deliver an anytime answer without misrepresenting its optimality.
3. Prove the cube model and returned-solution contract before aggressive pruning.
4. Test ownership/table/scheduler costs before committing to large databases.
5. Compare engines on identical, unbiased legal states with matching budgets.
6. Keep GPL notices and provenance for every adapted upstream component.
7. Full formal search completeness, practical shared tables, optimal-mode tail
   latency, and browser/native transport are implementation questions, not
   accomplishments of this setup phase.
