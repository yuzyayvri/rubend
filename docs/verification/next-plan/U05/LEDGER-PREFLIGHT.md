# Private partition ledger

The finite prefix preflight passes. This unit adds bookkeeping only. It does not
run partition workers, certify their exhaustion or raise a global lower bound.
NP07 remains unapproved and unproved.

The scope fixes the complete packed root, FullCube goal, raw-inverse-three
profile, contour, prefix depth, epoch, table digest and policy digest. Both
digests contain all eight U32 limbs. The numerical boundary rejects other
goals/profiles, invalid roots, zero epochs, depths outside two through four and
contours outside the supported range.

Each ledger owns one fixed array of explicit slot states. Prefix IDs come from
the verified current-mask enumerator. A separate short-word job covers all
lengths below the frontier, including length zero. Missing, pending, running,
exhausted, failed and cancelled slots are distinct. Array indexes are checked
before access because Bend indexes wrap.

Start and exhaustion retries are idempotent. A pending job cannot exhaust
without a start. Failure and cancellation are terminal. Repeated events never
add completion evidence. Stale scopes and unknown jobs cannot mutate the ledger.
This protocol is not permission to trust a worker's unsupported exhaustion claim.

Two representations were considered. A mutable completed counter would make
duplicate/missing event bugs affect the completion decision. The selected design
stores slot states and independently scans the required prefix set at close.
It also requires the short-word slot. No received total is authoritative. The
repeated prefix scan is acceptable for this bookkeeping preflight and has no
claimed engine cost benefit.

Test the transition matrix, retries, missing/unknown IDs, pending exhaustion,
terminal failures, stale fields and out-of-range alias attempts. Compare all
root/scope/digest components, not a truncated fingerprint. Seed actual missing-
short, incomplete-scan, weak-scope, pending-exhaustion and wrapped-index defects.
Require independent protocol counterexamples. Compare separate synthetic native
scenario packets with the checked JavaScript lane. Reuse passing finite prefix
evidence instead of repeating the full word tree.

The pure module verdict checks ordinary definitions, not a domain theorem.
Ledger completion is bookkeeping under admitted events, not certified contour
exclusion. No new law, shared state, multiple workers, database, search policy,
global-bound promotion, holdout, publication or independent-review claim.

The fixed `u05-ledger-v2` batch checks forty slot transitions, 24 independent
scope-component changes, twelve full frontier ledgers and missing/terminal/stale
job cases. Five compiled mutations must have concrete protocol counterexamples.
Ten synthetic native packets must match the JavaScript fixture lane. Prefix
coverage evidence is reused by source/artifact hashes, not rerun.

Generated JavaScript qualifies imported constructor names by module path. The
test adapter therefore passes fixed-length numeric scope packets into each
module's own factory. It does not transfer foreign Scope/Job constructors or
rewrite tags. The unused v1 plan was prepared before this boundary was corrected
and is not launched. The sealed batch is `u05-ledger-v2`.

The module compiles. Spot fixtures distinguish complete, missing-short,
missing-prefix, failed, stale and unstarted-exhaustion states. Full checks remain
pending. Estimate four minutes, capped at fifteen, serial nice-10 jobs with four
build lanes and one oracle lane. Request at most 3 GiB with desktop reserve.
No search worker, table/cache load, browser or new law.

The [canonical archive](u05-ledger-v2/index.json) verifies 2,318 seals and three
receipts, worker gone/no resource stop. All forty transitions, 24 scope-component
changes, 21 refusals, four malformed scope packets and twelve complete frontier
ledgers pass. Each of the five actual source corruptions has a counterexample.
All ten synthetic native packets agree. Both pure modules and unchanged
proof/toolchain gates pass. Passing prefix coverage was reused without repeating
the full word tree.

The ledger has no actual worker-exhaustion certificate, global contour theorem
or production integration. NP07 and independent review remain gated. This result
does not authorize real multiworker exclusion or change optimality labels.
