# Non-exact contracts are not censored exact searches

The pre-freeze statistics check initially counted every missing proof event as
right-censored optimality search. That mixes contracts. A first-returned solver
does not perform an exact-search completion experiment merely because its path
is independently verified. A fast solver can report an incidental exact bound
without promising a full optimality search.

The focused test on 320 synthetic non-exact rows fails before the fix with
`320 !== null`. `tests/final-evaluation-statistics.mjs` passes after the fix.
No solver, budget, case selection or runtime observation changes.

The statistics now keep proof-not-established counts separate. Optimality-time
distributions and right-censor counts apply only to `exact-request` and
`optimal-return-only` contracts. Error and unavailable attempts have explicit
failure counts. Unknown and non-exact timing is null, not a censored duration.
Incidental proof events remain visible. All old raw records are preserved.

The report supplies frozen contract metadata even if every attempt in a group
is unavailable. This correction precedes final configuration freeze and any
untouched case evaluation. It does not strengthen formal proof coverage.

Measured rows carry the explicit `contract-aware-optimality-v2` normalization
revision. The earlier forty raw calibration envelopes are reanalyzed without
rerunning solvers. Every physical metric, path and proof event must remain
identical. The old generic missing-proof flag is preserved under
`proofNotEstablishedByDeadline`; only contract-aware censor applicability changes.
