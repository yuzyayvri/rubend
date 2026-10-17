# Packed small-tier result

The opt-in packed backend passes the finite memory-tier gate. Native RSS after
the shallow checks falls from 43,948 to 15,276 KiB, a 65.2% reduction, in all
five fresh pairs. This excludes Node and browser memory. The normal engine's
search, portfolio, runtime, and table source files are unchanged.

Startup median increases from 220.884 to 313.141 ms. This is an optional memory
trade, not a default change or a general speed claim. Complete browser/package
rollout and independent review are not closed. The user prohibits subagents.

## Representation and generation

The pure Bend codec stores 891,780 transitions in sixteen-bit fields and
4,031,685 distances in four-bit fields. The 949,851 used U32 words fit a
1,048,576-word allocation, or four MiB instead of thirty-two. Logical array
allocation is eight times smaller. Observed process RSS is about 2.9 times
smaller, because queues and runtime memory remain.

The first implementation packed an already generated large table inside the
worker. All 1,630 shallow jobs passed, but ready RSS increased from 43,776 to
47,876 KiB. It retained the temporary table's resident footprint. The exact
allocator mechanism is unproved. That implementation is rejected for memory.

The accepted pilot instead generates transitions and BFS distances directly in
the packed array. It retains the original coordinate graphs and BFS schedule.
Nibble fifteen marks unknown. Generation rejects before assigning that distance.
The current audited maximum is fourteen. Checked setters reject bad geometry,
indexes, and values. Unused final nibbles and tail words remain zero.

The small search, portfolio, runtime, builder, and fixed-work observer are
generated from their authoritative files. Exact transforms route seven search
reads and builder accesses, change geometry, and reject unsupported profiles.
The default runtime imports no packed search variant. Five negative generator
fixtures reject stale output or unmodeled source changes before writing outputs.
This avoids silently maintaining a second hand-edited solver.

## Correctness and proof scope

The reference codec matches all 4,923,465 used raw entries. The direct builder
matches all 1,048,576 physical reference words, including padding. Field/tail
fixtures and three malformed families pass. This is complete finite data
equality for these generated tables, not a universal compression theorem.

Full fixed-work output matches the frozen R01 light backend on 350 canary
snapshots and 4,075 shallow snapshots, with 170 and 3,911 candidates respectively.
All 163 known optima agree. Cubes, paths, coordinate fields, bounds, completion,
and work counts remain in the comparison. No field is masked or synthesized.

The full development regression passes, including native/HTTP behavior, replay,
all independent model checks, malformed loaders, generation, and export.
With RUBEND_BINARY explicitly selecting build/r03-small-direct-v2, the existing
34-case Engine suite and HTTP suite also pass. The integration receipt records
15,280 KiB native peak RSS, eight-millisecond cancellation, and 318-millisecond
worker recovery. These are a single integration run, not latency distributions.
The default-backend regression and this opt-in integration are separate checks.
A hidden GUI smoke check also renders the 3D cube, establishes the expected
four-move optimum, seeks to the solved cube, and exports the matching four/four
interval. Its text, screenshot, and bounded server receipt are retained. The
temporary tab, server, and native child are stopped. This is not full browser
coverage or a package rollout.
Sixteen toolchain checks and the independent BendTT verdict pass. The pure codec
and packed search/portfolio and direct table builder are in PROOF.bend.
Runtime IO remains outside it.
No existing law changes and no new domain law is added. Eighteen laws still
check. Full admissibility, refinement, and traversal/data proof bridges remain
unfinished as described in PROOF-COVERAGE.md. Source generation is not a formal
equivalence proof of the entire compiler or backend.

## Repeated measurements

Ten fresh workers alternate control and packed order. Each passes 163 known
shallow optima before the after-search memory sample. All 1,630 jobs pass and
all worker identities stop with owned IPC removed.

| Measurement | Control | Packed |
| --- | --- | --- |
| Native ready RSS, each of five | 43,776 KiB | 15,104 KiB |
| Native after-shallow RSS, each of five | 43,948 KiB | 15,276 KiB |
| Native HWM after shallow, each of five | 43,948 KiB | 15,276 KiB |
| Median ready time | 220.884 ms | 313.141 ms |
| Ready-time range | 217.397 to 242.230 ms | 309.482 to 453.171 ms |

Startup includes fresh generation, not a disk-table load. Both sides use one
native thread on CPU 2 at nice 10. Available-memory admission, no swap, a
512-MiB batch cap, and 180-second wall cap apply. The added startup cost is
about ninety-two milliseconds at the median, or 41.8%. Background desktop
activity is uncontrolled. The packed outlier remains in the evidence.

A separate five-pair deadline run passes all 1,750 jobs, including 1,630 shallow
warmups and 120 measurements. Eight pilot fast cases use one second, three
earlier exact diagnoses use two seconds, and Superflip uses five seconds.
All sixty solution-length pairs tie. Coverage, lower bounds, and deadline
answers also tie with no losses. Hard exact jobs remain incomplete.

First-answer p95 is 35 versus 25 ms on forty fast samples, 37 versus 24 ms on
fifteen exact samples, and 1,657 versus 1,521 ms on five Superflip samples.
These are finite canaries, not a general latency or strength guarantee. Work-
step rates are not promoted as a search-speed result. The shared cutoff and
coverage-first scorecard retain every answer, timeout, and lower-bound loss.
The deadline batch takes 201.066 seconds and peaks at 145,548 KiB aggregate RSS
under a 512-MiB, 600-second, CPU-2 scope. It excludes a browser.

The quality tool now names generated versus cached table sources explicitly.
Generated profiles cannot claim or select a disk cache. Mixed sources are
rejected. Existing cached-profile requirements remain. Positive generated
fixtures and three rejecting source fixtures pass alongside all older failure,
timeout, mutation, and cleanup tests. No synthetic unused cache was supplied.

## Reproduction and status

The implementation is src/small-table.bend and generated src/small/. Run
scripts/generate-small-profile.mjs --check before building. The experimental
runtime is src/small/main.bend, not the default src/main.bend. Its checked
build, source snapshots, and binary digest are in build/r03-small-direct-v2.json.
Generated binaries and snapshots remain ignored.

bench/small-table-audit.bend audits every table entry and word.
bench/small-memory-compare.mjs repeats ready/RSS and shallow checks.
bench/small-fixed.bend supports the unchanged semantic comparison.
bench/warm-compare.mjs and bench/score-warm.mjs reproduce the deadline gate.
Raw compressed reports and compaction receipts are in r03-small-v1/. Pretty
shallow reports are losslessly reformatted before the bounded archive, retaining
all records and both hashes. No pruning table, binary, or dependency tree is in Git.

Model the Domain made generated and cached table sources explicit. Build the
Lever produced the checked source generator and repeatable audits. Explain the
Number separated logical allocation, native RSS, startup, and deadline quality.
Fix Root Causes removed the temporary allocation when its footprint remained.
Prove It Works required complete data identity and live native jobs.
Sequence Work into Verifiable Units kept rejected frame changes out of this tier.

No world-class claim or release-holdout tuning is made. The profile remains
opt-in until further integration. Independent review is not run, never replaced
with a solo verdict. No subagent, Astra, visible window, push, PR, merge, or
deployment occurs in this pilot.
