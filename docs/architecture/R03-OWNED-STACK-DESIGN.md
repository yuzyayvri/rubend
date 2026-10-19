# Owned search continuations

Status is an isolated solo store and search implementation with bounded
state-equivalence evidence. Portfolio migration and performance remain open.
The relevant source is src/search.bend and src/portfolio.bend at81bb524.
The prior coordinate-only and segmented outcomes do not predict this treatment.
Independent design review cannot run under the solo instruction.

## Problem

Search.Frame carries a persistent path in every Node and Retry. Search.stack and
Portfolio.Task are reusable lists, even though only one task currently owns the
large pruning array. Node enumeration pops and re-pushes parents, and accepted
children create another list/path prefix. The proposed treatment removes that
continuation allocation without changing move order, heuristic evaluation,
portfolio scheduling, or candidate certification.

The first question is whether a bounded owned continuation is cheaper in Bend.
It is not enough to replace a list with an array and assume a gain. Generic
array access, boxed Frame cells, capacity guards, and task ownership can cost
more. Inspect generated ownership operations and use unchanged traversal.

## Caller usage

The portfolio owns a list of affine tasks. A slice temporarily moves one task's
continuation and the sole table into search, then receives both back. Candidate
paths become persistent lists only when recording a better solution.

```text
RootDescriptor(axis, validated cube) -> distinct root descriptors
initialize_task(descriptor, profile) -> Task
run_slice(table, Task, incumbent) -> table × Task × result
observe(Task) -> Task × legacy-compatible semantic snapshot
```

These are proposed responsibilities, not existing exported names. Runtime
effects never own or share a search continuation between concurrent actors.

## Alternatives

The first alternative stores the existing complete Frame constructors in a
64-cell owned array and keeps their persistent paths. It changes stack storage
alone and has a smaller differential burden. However, it retains path sharing
and the work of constructing path prefixes, so it does not test the roadmap's
single-current-path idea.

The second alternative owns a 64-cell frame array and a 32-word current-path
array per task. Frames keep cube, coordinates, depth, previous move, next move,
goal, and path length, but no path list. This is the preferred prototype. It
hides storage, path-prefix reconstruction, and overflow behind one continuation
owner. The caller handles one task rather than coordinating parallel arrays.

This is a sequential comparison, not a multi-model synthesis. Foundational
Thinking selects the affine owner before caller changes. Model the Domain keeps
frame/path occupancy in one continuation. The installed Bend guide's ownership
cost model makes emitted-C inspection part of the decision.

## Occupancy and path argument

Each accepted child replaces one top Node with a child and its parent. The live
Node chain therefore grows by one with path length. Opening a reduction leaf
replaces that leaf by one Retry. Entering the subgroup replaces Retry with a
subgroup Node and its next Retry. Subgroup descendants then grow by one per
move. No second nested Retry is introduced by subgroup leaves.

For a continuation produced by the normal initializer, the proposed occupancy
bound is current path length plus two, including that one pending Retry. Exact
root contours do not have Retry and need only path length plus one. Engine
incumbent/ceiling rules keep admitted total depth at most30. A64-cell frame
array and32-word path therefore have margin. This is a source-derived argument,
not a universal theorem. Test maximum occupancy on actual transitions.

Every live frame's path is a prefix of the current path at that frame's length.
A child writes its move at its parent's length. Backtracking changes the live
length; stale deeper words are not observed. A Retry keeps the same phase-one
prefix while subgroup descendants overwrite only later positions. Materialize
the reversed prefix when recording a candidate, before any later branch can
overwrite it. Existing symmetry/path mapping consumes that immutable candidate.

Capacity must be checked before array indexing because Bend indexes wrap.
Unsupported initial depths and genuine storage overflow must fail explicitly.
They must never become SearchOptimal, TaskFinished, or a fabricated exclusion.
Use an explicit failure variant in the isolated prototype and runtime adapter.
Do not reuse a profile-mismatch sentinel for overflow.

## Ownership and modules

Use a generic pure owned-stack module or a local Frame store. Array.swap with an
empty slot can move a frame out without keeping another copy. Compare its
emitted code with Array.get/set before choosing. Do not add an unsafe shared
table or clone the pruning array.

Task becomes affine. Deduplicate reusable root descriptors before allocating
task storage; the current contains/distinct functions cannot copy affine Task.
Schedule and append use affine lists. Incumbent restarts reset the continuation's
logical occupancy and reuse its arrays. Meta and immutable best paths remain
reusable where their current readers require it.

Generate an isolated search/portfolio/runtime/fixed-work family from the frozen
reference. Exact rewrite anchors and source hashes reject drift. Do not change
the default search, table layout, or accepted bounds in this hypothesis. Keep
control IO outside PROOF.bend and add only the pure prototype dependency graph
to the existing kernel check. No domain law is added or weakened by this sketch.

## Verification and decision

First test push/pop, empty behavior, boundary occupancy, and rejection before
wrapping. Exercise split-phase Retry, subgroup rollback, exact contour restart,
incumbent restart, and symmetric root deduplication. Assert candidate replay
and monotonic intervals through the unchanged certificate boundary.

The observation adapter must reconstruct every legacy Frame path and preserve
frame order. Compare complete snapshots with the frozen typed reference,
including cubes, coordinates, paths, stage, profile, bounds, work, and completion.
Do not mask a differing field or compare only final moves. Keep observation
materialization out of release timing.

Then inspect emitted C and source-correlated diagnostics. Compare fixed work,
completed contours, first-answer latency, deadline quality, and native RSS in
five alternating cohorts. Use the existing ten-percent promotion rule and
unchanged quality floor. A stack-size reduction is not a whole-engine memory
claim while pruning tables dominate. Preserve a no-gain result and leave the
default unchanged if the treatment fails.

## Next step

Build a bounded pure continuation store and its failing capacity fixtures, then
migrate the isolated search and portfolio together. Reconcile any shape change
here before using it as a new caller contract.

## Resume implementation map

The store and isolated search are now implemented. Read
docs/verification/R03-OWNED-STACKS.md for checks and remaining work.
The resumed R06 diagnosis adds one prerequisite.
Both stack candidates must emit unshared-array mode. A shared opaque control
channel can change every array lookup even when pure search source is identical.
Use the final File-owner runtime as the contemporary reference and preserve
the historical R01 results separately.

Keep the first store local to the isolated search module, after Frame and
before Search. This avoids a Frame/store import cycle and keeps the concrete
element layout visible to the pinned compiler. A generic store can be compared
later, but is not presumed faster. Stored Node and Retry omit their path list.
The owner holds the frame array, one path array, frame occupancy, logical path
length, and sticky failure. Reset must set logical path length to zero. Prefix
reads must reject lengths beyond that cursor, rather than expose stale words.

Overflow must propagate through the whole result boundary. Add an explicit
continuation-failure completion only in the isolated family. Search.run stops
on it. Portfolio.finish_slice propagates it before ordinary scheduling,
incumbent, or lower-bound logic. The runtime fails before emitting done or
optimal. Merely dropping the failed task would fabricate exhausted work.
Test both a full frame store and a path write at its capacity before indexing.

Deduplicate copied root descriptors before allocating affine Tasks. Keep the
existing first-kept axis order. Scheduling and restart consume and return
owned task lists. Restart resets logical occupancy and reuses both arrays;
it must not clear an existing failure.

The observation path must consume and return the same arrays while reconstructing
legacy frames. Walk occupied cells from top to bottom and materialize each
frame's reversed prefix at its recorded length. Compare every existing snapshot
field with the frozen reference, not just solutions or aggregate counters.
Keep this serialization outside release timing.

The default search, table, and portfolio remain unchanged. Required independent
review remains not run under solo work. The capacity argument above still
needs execution evidence and is not a new universally proved law.
