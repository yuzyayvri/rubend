# Benchmark and acceptance contract

Planned, not yet run. Setup smoke tests are not solver benchmarks.

## Reproducibility

Every record includes source revision, toolchain versions, table-generator
revision, table schema and hashes, OS/CPU model, thread count, seed, case ID,
deadline, memory ceiling, result status, moves, HTM length, established lower
bound, elapsed time, peak RSS, and verification outcome. Record machine details
needed for reproduction, not hostnames, usernames, environment dumps, or secrets.

Keep raw JSONL and a small analysis summary in dated evidence directories.
Tables and binaries remain ignored. Identify incomplete work and resource
failures; never drop timed-out cases from latency/quality summaries.

## Case families

1. Solved input and all 18 single moves.
2. Exhaustive distinct states to depth 4 initially, extending to depth 5 once
   resource use is measured. Check known per-depth counts as a sanity check.
3. Impossible states: duplicate pieces, one flipped edge, one twisted corner,
   parity mismatch, invalid centers/colors, malformed text, and oversized input.
4. Seeded uniform legal cubie states: unbiased permutations and orientations
   conditioned on the cube invariants, using rejection sampling for bounded
   random choices. Validate independently. A random walk is not a uniform-state
   benchmark and its scramble length is not its optimal depth.
5. A frozen 1,000-case development corpus and a distinct 10,000-case release
   corpus. Publish generated seeds and state strings, not only the RNG version.
6. An exact-oracle depth-stratified set, including hard 19/20-move positions,
   superflip, symmetric/near-symmetric states, inverse pairs, and rotations.

Do not mine the holdout corpus to tune move ordering and then report it as
unseen evaluation. External datasets require provenance and license review
before vendoring; generating our own seeded corpus is the default.

## Separate questions and timers

- Correctness: does independent facelet replay solve the original cube?
- Quality: solution-length distribution; excess over an independently known
  optimum; solved fraction; optimal fraction where an oracle is available.
- First answer: cold-start and warm-start median/p95/p99 separately.
- Improvement: verified best length at 10/100/1,000 ms and 10 s budgets. These
  are comparison points, not promises that every case solves within them.
- Exact search: time to solution versus time to establish optimality.
- Throughput: cubes/second in explicit batch runs, distinct from single-cube
  latency; never invert batch throughput into individual latency.
- Resources: file size, physical resident memory, generation peak/scratch,
  startup/load time, and table-building wall/CPU time.
- UI: frame time, long tasks, input-to-frame delay, cancel acknowledgement,
  stale-result rejection, and playback/native-state agreement.

Measure native release builds after a warm-up, with at least five repeated
bounded runs where practical. Use the same randomized order for competitors;
report medians, distributions, sample sizes, and censored timeouts. Keep system
security mitigations enabled. Record background-load limitations.

## Competitors

- min2phase: first-answer and fixed-budget improvement.
- Nissy/H48: optimal solutions and single-cube multithreading.
- vcube: optimal results and batch throughput where its hardware requirements
  and memory profile fit.

Pin implementations, build flags, and table settings. Compare equal thread and
RSS ceilings, not nominal table-file size alone. Run single-thread and matched
multi-thread configurations separately. Reuse GPL code only with provenance;
an external competitor's output is never reported as Rubend's search result.

## Resource admission

The observed machine has a Ryzen 5 5600, 6 physical cores / 12 hardware threads,
and approximately 32 GiB RAM. Free memory is transient. Start with small tables;
do not allocate a 22 GiB reference profile while other desktop work is active.
Require measured headroom for resident tables, scratch space, UI, and the OS.
No cloud compute, GPU-stack install, prolonged benchmark, or multi-GiB table
generation is authorized by this setup phase.

## Claim policy

Any invalid accepted solution is a release blocker. Optimality disagreements
are blockers even if the answer happens to be short. Performance targets in
the plan are aspirations until these records exist. Use explicit claims such
as “lower p95 at matched 4-thread/8-GiB settings on corpus X,” not “world's
fastest.” The first release need not win every dimension to report honest,
useful progress toward that ambition.
