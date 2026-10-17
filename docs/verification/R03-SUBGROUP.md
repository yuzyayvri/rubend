# Coordinate-frame experiment status

Both implementations are rejected for speed. Their slower search code is not
integrated into main. The source is retained as a recoverable experiment and
patch. The production search keeps its original Node/Retry representation.
No independent review runs under the user's explicit no-agents instruction.

The [design](../architecture/R03-SUBGROUP-DESIGN.md) adds coordinate-only SubNode
frames and light/raw opt-in profiles. It preserves move order, goals, heuristics,
path reconstruction, and work-step counts. Candidate replay is unchanged.

Version one matches 4,607 complete fixed-work semantic snapshots and 4,193
candidate snapshots across light, raw, and 163 shallow optimum cases. Independent
facelet replay and generated coordinate ranking validate 77,182 frame states,
including 3,509 subgroup Nodes and 708 Retry frames. Seven mutated frame fixtures
fail. No field is masked for comparison. The observer rejects unsupported frames.
The complete development regression and sixteen proof/toolchain checks pass.
The regression receipt takes 112.984 seconds and peaks at 940,140 KiB aggregate
RSS. The generation/serialization work is separate from search timing.

The equal-work comparison runs five fresh pairs, 1,630 shallow warmups, and 110
timed jobs with exactly 500 portfolio slices. Complete final semantic states
match. Native monotonic time ends before output and abstract-cube reconstruction.
Process CPU time also includes output, making any extra reconstruction work a
conservative cost. Native wall ratios show the same slowdown, so output alone
does not explain the regression.

Against the frozen R01 timer, version one's geometric CPU ratios are 1.1838 fast
and 1.1471 exact. Their five-cohort bootstrap intervals are 1.1568 to 1.2034 and
1.1340 to 1.1592. Individual paired ratios range from 0.9815 to 1.2791 fast and
1.1099 to 1.1889 exact. This fails the speed gate. It is not a memory-tier result.

A second five-pair comparison keeps the expanded source graph and selects its
legacy RawJoint frames as the control. Ratios become 0.9888 fast and 0.9968 exact.
Intervals are 0.9821 to 0.9967 and 0.9777 to 1.0147. Neither reaches the required
ten-percent gain. This isolates the active representation policy from the common
expanded program, but does not prove the source of that program's overhead.
No hardware cache or branch-counter measurement exists. Compiler fusion/layout
or ownership effects remain hypotheses, not measured causes.

Version two replaces reusable whole-frame aliases with explicit field
destruction/reconstruction in its hot helpers. It matches all 350 raw canary
snapshots and 208 candidates against version one. All 11,322 active frame states
refine, including 2,623 subgroup Nodes. Sixteen checks and the independent BendTT
verdict pass. Its five fresh R01-relative cohorts also fail the gate. Geometric
CPU ratios are 1.1922 fast and 1.1491 exact. Bootstrap intervals are 1.1684 to
1.2185 and 1.1347 to 1.1643. Individual ratios range from 1.1224 to 1.3571 fast
and 1.1053 to 1.2135 exact. All equal-work states still match with zero errors.

Across the three comparisons, 4,890 shallow warmups and 330 timed jobs pass.
Run times are 102.176, 109.977, and 101.984 seconds. Aggregate RSS peaks are
4,413,140, 4,405,680, and 4,415,188 KiB. All workers stop and remove owned IPC.

The shared premise was that removing stored cubies and turns would cut total
search time by at least ten percent. The same-source policy comparison directly
tests that premise and does not support it on this workload. The second alias
variation does not recover the R01-relative regression. Do not try another
field-deletion variant before identifying the common runtime/code-generation
cost. Its exact cause remains unresolved. No profiler or hardware counter
isolates it, so no attribution or compiler-fix claim is made.

This rejection ends the coordinate-frame pilot, not R03 as a whole. Pivot to
the independent packed-small-table memory hypothesis. Do not combine these
rejected frame changes with table packing or stronger bounds.

Raw reports, bounds, source/build identities, receipts, and adjudications are
under r03-v1/. The 44,133,854-byte shallow report was reserialized without
formatting whitespace to 7,444,054 bytes before bounded archival. Every field
and record survives JSON equality. The compaction receipt preserves both hashes.
The recovery patch restores version one's exact search source from version two.
It does not change other files. Frozen native binaries and complete source
snapshots also remain ignored on disk and must not be overwritten.

The rejected-coordinate-frames.patch applies the version-two source experiment
to main at a073c1e. recover-v1-from-v2.patch then restores version one's exact
search source. The local experiments/r03-coordinate-frames branch also retains
the complete experiment. No default app, browser behavior, or package rollout
was changed by these rejected kernels. Publication remains pending completion.

The timing runs use CPU 2, one native thread, nice 10, 6,144 MiB admission,
no swap, and a 600-second wall cap. Some non-timing compilation/check work ran
on other cores during isolation, and desktop load is uncontrolled. Interpret
small differences conservatively. The ten-percent promotion rule is unchanged.
All compared jobs retain failures and complete-state equality checks.
