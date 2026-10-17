# Rubend build plan

Status: the initial local solver and GUI are implemented. This is the original
research plan; [CURRENT.md](CURRENT.md) and the
[implementation report](verification/PORTFOLIO.md) track actual completion.
Local advanced experiments were authorized on 2026-10-17 within the envelope in
`docs/benchmarks/ADVANCED-PROFILES.md`; larger work remains separately gated.
Prepared 2026-10-16, Asia/Manila. License: GPL-3.0-or-later, per Yuzy's updated
request. This is an evidence-gated plan, not a claim of world-class results.

## The outcome

An excellent 3×3 cube solver whose search and cube rules are written in Bend 2,
with a polished, local-first 3D application. It should give a useful answer
quickly, improve it while time remains, and establish a shortest answer when
exact search finishes. Correctness must not be traded away for speed.

Start with fixed-center 3×3 cubes, standard face notation, and the half-turn
metric. `R`, `R'`, and `R2` each cost one move. Cube rotations change the view or
normalize the frame; they do not secretly count as face turns. Larger cubes,
robot control, camera scanning, mobile packaging, and neural-network training
are outside the first release.

## Architecture

```text
                  3D workspace / input / playback
                          JavaScript UI
                               |
              Bend-generated JS cube model in a worker
                     validate / move / replay
                               |
                versioned, bounded local-only transport
                               |
                       native Bend engine
                 fast candidate -> exact improvement
                               |
                 Bend table generator + audited in-memory tables

            LAWS.bend + PROOF.bend protect the pure core
          independent facelet replay checks actual outputs
```

The small host adapter only handles browser transport, process lifecycle, and
serialization. It must not implement search, choose moves, or decide whether a
cube is solved. The same Bend domain model compiles for the browser and native
engine. A separately implemented test-only facelet model catches common-mode
mistakes between those backends.

The detailed [proof plan](architecture/PROOF-PLAN.md),
[application design](design/APPLICATION.md), and
[benchmark contract](benchmarks/PROTOCOL.md) refine these boundaries.

## Milestone 1 — establish that Bend fits this engine

Build bounded experiments, not the full solver first:

- Cubie transition on explicit scalar fields versus compact U32 encodings.
- Owned-array table lookup versus immutable Data structures; measure native
  heap usage and lookup latency at realistic cache sizes.
- Native serial depth-first search, small independent batches, and fixed-fuel
  resumable tasks. Compare 1, 2, 4, and 6 workers, then test 12 hardware threads.
- Determine the actual bytes per logical table entry. Do not budget memory as
  if every U32 array element necessarily occupies four physical bytes.
- Test segmented high/low U32 table indexes and overflow rules: Bend has no
  native U64, and large exact-search coordinates exceed a single U32. Avoid
  putting an unmeasured arbitrary-precision representation in every node.
- Compile one domain operation to JavaScript and C; verify identical results.
- Try cubing.js TwistyPlayer against editing/playback requirements before
  committing to a custom Three.js scene.

Use deterministic checksums, optimized native output, peak RSS, and generated-C
inspection. Keep initial experiments below 256 MiB and short enough to run
interactively. Promote larger experiments only after explicit resource approval.

Exit: a recorded choice of table ownership, representation, concurrency, and
renderer, with executable reproduction steps. If Bend's safe model cannot
deliver practical table access, stop and report the evidence. Do not quietly
move the hot search to C, use unsafe shared memory, or clone giant tables.

## Milestone 2 — trustworthy cube core

Define face/move types, cubies, orientation conventions, and a validated cube
boundary. Implement notation parsing, inverse sequences, composition, 54-facelet
conversion, and move application. Keep a transparent specification model beside
the optimized representation.

Formalize the first domain laws: move/inverse cancellation, four quarter-turns,
legality preservation, replay composition, and parser/encoder round trips.
Use structural recursion with explicit depth/fuel, not unbounded recursion.
Construct valid states through a validating boundary or proof-bearing values;
raw user strings must not become a `ValidCube` by convention alone.

Verification: all 18 face moves, inverse pairs, impossible input families,
exhaustive shallow states, deterministic long sequences, and independent
facelet comparisons. Check native and generated-JS agreement.

Exit: no known legality/replay mismatch; approved domain laws pass both Bend
and BendTT. No solver is needed to claim this milestone.

## Milestone 3 — fast full solver and first real 3D workflow

Implement coordinate ranking/unranking and small, uncompressed distance tables
first. Then implement Kociemba-style two-phase search in Bend, using min2phase
and Kociemba's descriptions as pinned implementation references. Any adapted
source keeps its required notices. Build the tables in Bend, not by opaque
downloads.

Deliver incremental candidates. Replay every candidate before acceptance,
retain only improvements, and expose cancellation at bounded work checkpoints.
Support solved input and arbitrary legal input, not merely reversing scrambles
created by our own interface. If no answer was found within a budget, say so.

At the same milestone, connect the working engine to the 3D workspace: scramble,
paste moves, edit stickers in a 2D net, solve, play/pause, step/backstep, scrub,
reset, and inspect validation errors. No invented performance counters or
decorative solver output.

Exit: 100% valid returned solutions over the frozen validation corpus; UI state
matches canonical Bend replay after every completed turn; cancellation and
stale-result isolation pass end-to-end tests. A first performance aspiration is
a warm first-answer p95 below 100 ms with mean length at most 21 HTM on the
specified baseline machine/corpus. That is an unmeasured goal, not a guarantee.

## Milestone 4 — exact search and honest optimality

Implement complete IDA* traversal over all 18 face moves, using safe canonical
move ordering and admissible projected-distance bounds. Two-phase answers give
an upper bound, not a lower bound. The exact engine searches shorter lengths
and never drops a branch merely because it looks unlikely.

Start with clear Korf-style pattern databases and prove their projection and
bound obligations. Use `max` for overlapping admissible estimates. Then add
symmetry-reduced/H48-inspired coordinates, handling stabilizers explicitly.
Introduce compressed tables only after an uncompressed reference version can
check them. Multi-axis and inverse estimates need proven move mappings.

Track an interval `[lower bound, best verified length]`. Interrupted traversal
cannot increase the lower bound for unfinished depths. A complete depth search
may establish optimality; a timeout cannot. Distinguish a search-established
optimal answer from a formally certified optimal result until completeness,
pruning, and data-validity obligations have actually been discharged.

Exit: exhaustive shallow-optimum agreement, independent exact-solver agreement
on a depth-stratified corpus, no unchecked path to an optimal label, and a
documented proof-coverage report. A proof of successful replay alone is not
enough for this exit.

## Milestone 5 — competitive performance, with quality held fixed

Use Nissy/H48 and vcube as external competitors. Compare individual latency and
batch throughput separately; include min2phase for first-answer performance.
Run the same cases, thread counts, memory ceilings, and timer boundaries. No
unqualified comparison to upstream screenshots or headline numbers.

Optimize in measured order: representation, bound strength, lookup locality,
move ordering, symmetry, then bounded parallel work. Inspect generated C for
allocation and reference-count traffic. Check full result quality after each
change. Do not assume more threads help an unbalanced fork-join search.

Profiles are proposals: a light mode below 512 MiB process RSS, an exact desktop
mode below 8 GiB, and an explicitly enabled larger mode only if this machine has
safe headroom. Include resident table copies and generation scratch space, not
just file size. A smaller profile may take longer but must not weaken an exact
answer's meaning.

Competitive target: at matched resources, first achieve correct optimal results
and a measured latency baseline, then approach and attempt to beat the strongest
reference on median, p95, and throughput. Record regressions and failures. Do
not set a universal subsecond exact-search promise before measuring 19/20-move
tail cases. Beating an optimal solver cannot mean using fewer than optimal moves.

Exit: reproducible quality/latency/memory curves, raw records, comparison
revisions, and a specific defensible statement of where Rubend matches, beats,
or trails each reference.

## Milestone 6 — finish the application and release readiness

Polish lighting, turn animation, keyboard controls, touch layout, reduced motion,
color-independent face labels, and the no-WebGL 2D fallback. Keep the engine
responsive and stop stale work when input changes. Support local saved sessions
and exportable solve records. Rendering uses floats; canonical puzzle state does
not.

Targets: 60 fps at 1080p during cube interaction on this machine, no rendering
task blocked by native search, and cancellation acknowledgement within 100 ms.
Measure these; include slow/failing renderer states and corrupted table recovery.

Prepare a reproducible package, dependency notices, source/proof/benchmark
records, and a short user-focused README. Publication, releases, deployment,
merges, or changes to repository visibility still require task authorization.

Exit: end-to-end acceptance suite, dependency-license audit, clean-machine setup
test, and an honest release checklist. No deployment is part of this phase.

## Critical risks and responses

| Risk | Earliest test | Response |
| --- | --- | --- |
| Safe table access too costly | Milestone 1 | Change safe representation; report if infeasible |
| Huge formal proof effort | Milestone 2 | Small lemmas; publish exact proof coverage |
| Pruning silently loses solutions | Milestone 4 | Prove rules; shallow exhaustive oracle |
| Fork-join imbalance | Milestone 1/5 | Resumable batches; keep serial fallback |
| Large table startup/RSS | Milestone 3/5 | Cached profiles, admission budget, checksums |
| GUI drifts from engine | Milestone 3 | One Bend model, versioned jobs, independent replay |
| New compiler/backend bugs | Every milestone | Pin release, dual-backend tests, minimal repro |
| GPL provenance is lost in ports | Before adapting code | Preserve notices and an adaptation ledger |

## Current next step

The six-view solver, exact path, proof gate, application, and Nix package exist.
An experimental joint phase-one bound now has an exhaustive audit and paired
measurements; see `docs/verification/JOINT.md`. Its initialization and hard exact
tail still need substantial work. Continue bounded experiments under the
approved envelope in
[`docs/benchmarks/ADVANCED-PROFILES.md`](benchmarks/ADVANCED-PROFILES.md) before
any larger resource request. No world-class claim has been established.
