# Matched warm-solve comparison

The accepted startup unit is complete. This separate experiment checks the
already-present search refinements at matched time budgets. Do not change the
solver, GUI, native entrypoints, public interfaces, or sealed inputs.

Use the established two-profile registry and paired-job collector from
`bench/layout-compare.mjs`. Adapt configuration data, round repetition,
validation, and evidence accounting. There is no new shared library or solver
API. If a materially new boundary is necessary, return a design sketch first.

The data shape is a pair of sealed profile records, fixed corpus records, five
fresh worker-pair rounds, and per-job outcomes with full candidate trajectories.
Profiles are the frozen raw baseline and the measured word-direct-262144 binary.
Both use the unchanged raw cache. Host hashes warm its file cache. Startup is
recorded separately and excluded from solving quality.

Each round warms both profiles with the same 163 shallow optima. Then run the
32 existing fast corpus cases at 1,000 ms, three hard exact cases at 2,000 ms,
and exact Superflip at 5,000 ms. Alternate profile order by round plus case index.
Close and await the complete pair before the next round. At most two owned
arrays may be live. Use native work steps, not expanded nodes.

Require a real native done event with valid counters. Reject errors, invalid
events, host emergency time limits, missing answers, worker generation changes,
nonzero exits, forced shutdown, and changed input identities. Preserve failed
records, count errors, and exclude failures from successful distributions.

For each trajectory, report best answer observed by the requested deadline
separately from terminal best. Record host elapsed time and overshoot. Separate
fast quality, hard exact intervals, and Superflip. Report paired wins, ties,
losses, and no-answer counts by case as well as overall summaries. A better
mean may not hide individual longer answers. No speed or strength win is chosen
until repeated evidence and independent review finish.

Seal executable, metadata, cache, corpora, and measurement/replay dependencies
before and after. Do not require the historical baseline source graph to equal
current sources. Use the startup script's established validation and shutdown
patterns locally. Never signal historical PIDs.

The implementation owner writes only its isolated worktree, produces small
synthetic protocol tests, and makes no commits. It does not run full raw data.
Root runs the eventual real batch at nice 10 on one pinned core, at most 6,144
MiB and 900 seconds. The granted global ceiling remains eight GiB, two low-
priority cores, and thirty minutes per batch. No Astra or visible windows.

## Reviewed failure-path refinements

The read-only Sol reviewer required an adapter watchdog before Engine's own
emergency restart. The accepted implementation closes Engine at budget plus
1,500 ms and rejects the job. It does not await closure inside that timer; round
cleanup retains its forced-shutdown backstop. Fixtures prove two original
workers, at most two live workers, and complete cleanup on stalled and ignored-
SIGTERM paths. The native `time_limit` reason is rejected separately.

The private comparison function accepts an optional configuration-file path.
The CLI supplies that path, seals it before and after, and checks that its parsed
content equals the supplied input record. Mutation and mismatch fixtures cover
this provenance boundary. These are accepted local adaptations of the existing
benchmark contract, not product interface changes.

## Acceptance floor before real measurement

All requested jobs must finish natively with valid replay, input identities,
and worker cleanup. Compare five-repeat case medians at the requested deadline.
Do not accept the search refinements if any fast case has a longer median answer,
the aggregate deadline mean is worse, or deadline no-answer count increases.
Exact and Superflip median intervals must not worsen. Preserve every individual
loss even if those medians tie. Do not claim a rate improvement smaller than
repeat variability or from instrumented profile work counters.
