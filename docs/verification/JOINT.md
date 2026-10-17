# Larger Bend bound: measured experiment

2026-10-17. This is an experimental engine, not the default packaged profile
and not a world-class claim. Raw records are under `joint-v1/`. The local GUI
continues to use the small-memory engine by default.

## Result

A paired 32-state run used the same one-core affinity, low priority, one-second
search budgets, 163 identical shallow warmup jobs, and alternating engine order.
Other desktop activity remained uncontrolled.

| Measurement | Light | Joint |
| --- | ---: | ---: |
| Mean first-answer length, HTM | 20.4375 | 20.40625 |
| Mean best length after one second, HTM | 19.3125 | 18.75 |
| First-answer p95 | 83 ms | 37 ms |
| Initialization, separate from search | 278 ms | 9,890 ms |

The larger profile found shorter answers on 13 cases and tied on 19; it lost
none in this run. Both solved every case and agreed with all 163 shallow optima.
This is a preliminary, reused development corpus, not a fresh release test or
independent full-depth optimality benchmark. See `paired-profile.json` and the
bounded-run record `paired-profile-v1.json` for provenance and limitations.

In a separate three-case exact diagnosis, lower bounds rose from the previous
12 to 15 after two seconds. Incumbents were 19, 18, and 20 moves. None was proved
optimal. Superflip still had a 21-move incumbent and lower bound 16 at five
seconds. The difficult optimal-search objective remains unfinished.

## What changed

The new Bend table stores exact distances to the phase-one subgroup for the
joint coordinate `(twist * 2048 + flip) * 495 + slice`: 2,217,093,120 states.
It uses four-bit entries, without symmetry reduction. The logical cache is
1,108,546,560 bytes; Bend's power-of-two array occupies 2 GiB. There are no
per-search copies. The measured experiment tree, including its Node host,
peaked around 2.2 GiB; individual raw records give exact sampled RSS.

Two-phase reduction uses only the bound for its own fixed axis. Full exact
search additionally takes bounds from two diagonal frames. Applying these
other-axis bounds to fixed-axis subgroup reduction would be incorrect; the
implementation deliberately distinguishes those cases. The frame transforms
are generated directly on packed cubies, with 3,000 facelet comparisons and
54,000 move-conjugation checks in the core suite.

The default solver checks for the larger table only after its existing bound
has admitted a branch. No large allocation or cache load occurs in the default
app. An alternating seven-start check measured median initialization at 277 ms
for the previous package and 269 ms for the updated light binary. An HTTP test
initially hit its 600-ms recovery polling assumption while a compiler shared
its pinned core. Isolated recovery passed; the test now allows five seconds
for readiness, while cancellation latency remains separately measured.

## Data evidence

The smaller 4,478,976-state joint twist/flip graph was generated both as ordinary
U32 distances with the existing queue BFS and as packed values with a separate
layer-scan builder. Every value agreed. Both representations passed complete
80,621,568-edge audits and produced fingerprint 2664812503.

Two separate full-size runs finished and audited all 39,907,676,160 directed
edges. The checks require a unique zero goal, finite entries, a decreasing
successor for each non-goal, and `h(s) <= 1 + h(t)` on every projected edge.
Maximum distance was 12; the entry fingerprint was 1448581281. The cache-producing
run took about 245 seconds including generation, audit, and serialization, with
a 3-GiB hard cgroup ceiling, one low-priority core, and a 20-minute deadline.

The cache SHA256 is
`2ccfd40fdc0cf4769c58d9646f6b0ea787571ce5200b5d124c8f17dcc70f73b5`.
The experiment host checks that digest. The native reader checks the exact file
size and a separately pinned word fingerprint, 2620826876, before relocating
the data. A 70,001-word codec test checks little-endian bytes, chunk boundaries,
overlapping relocation/prefix insertion, and rejection of truncated, extended,
missing, or nonempty output files. The serializer uses append-only output and
refuses nonempty files; it is not an atomic publication API. Use private output
paths. Raw caches, source snapshots, and binaries remain ignored.

These are exhaustive executable certificates, not universal BendTT proofs of
the generator, coordinate refinement, or traversal. The 18 existing laws remain
unchanged and pass; pure joint-table/audit and packed-frame definitions also
pass the independent type/proof gate. Cached byte loading and its host remain
trusted boundaries. Do not call this formally certified optimal search.

The updated light package passes all three Nix sandbox checks, including the
new cache codec test, independent proof checker, core/shallow oracle, projected
table audit, packaged artifact integrity, HTTP, and native lifecycle tests.
The exact derivations and build identity are retained in `joint-v1/nix-check.json`.

## Reproduce locally

Within the authorized resource envelope, use the pinned development shell:

```sh
node bench/build-experiment.mjs bench/joint.bend build/joint-cache
node bench/run-limited.mjs joint-cache-rebuild 3072 1200 0 /home/yuzy/rubend/build/joint-cache large /home/yuzy/rubend/.cache/joint/new-private-output.raw --threads 1
node bench/inspect-joint-cache.mjs .cache/joint/new-private-output.raw
node bench/build-experiment.mjs bench/advanced-main.bend build/rubend-advanced
```

The output path must be new and private. The advanced benchmark currently uses
`.cache/joint/phase1-v1.raw`. Its startup is deliberately separate from the
default app; it is not packaged or enabled automatically. `run-limited.mjs`
requires a user systemd resource scope, disables swap within it, pins at most
two CPUs, lowers priority, and enforces memory, wall, CPU-time, and output caps.
It refuses insufficient available memory. Bend reserves a large unused virtual
address range, so an address-space limit alone is not an appropriate RAM limit;
the first small attempt failed closed on that reservation before cgroup-based
enforcement was selected. No persistent service or system configuration changed.

`bench/paired-profile.mjs` performs the paired run. Build identities and ignored
source snapshots bind each experimental binary to its exact inputs, even if
later source edits occur. Production benchmarks still reject stale builds.

## Reference and next work

Nissy H48 h0 now has a completed, pinned local reference cache and replay-checked
smoke cases. Three uniform states timed out at five seconds; no matched
world-class reference comparison is claimed. Generation-only local iterator
and reporting fixes are explained and reproduced in
[`NISSY-REFERENCE.md`](../research/NISSY-REFERENCE.md). The regenerated h0 bytes
were identical to the pre-iterator-fix cache; that does not establish correctness
for other profiles. No upstream code is the product solver.

Next: reduce the larger array's padding/startup cost, strengthen exact bounds
with symmetry and inverse estimates, validate deeper cases against a stronger
reference, and expand formal projection/data/traversal coverage. The 32-case
sample must not be promoted into a world-class claim.
