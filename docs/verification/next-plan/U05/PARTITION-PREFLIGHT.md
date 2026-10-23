# Private partition preparation

A private prefix prototype passes its finite checks. It is not implemented
partition search or a ledger. NP07 remains unapproved and unproved.
The completed duplicate-context screen does not justify a cache on its observed
workload, but partition coverage is a separate question.

The current `Search.root_frame` derives its first-move mask from actual `ud` and
`flip` stabilizers. `root_allowed` applies that mask only at the root. Later moves
exclude repeated faces and one ordering of commuting opposite faces. Finishing
goals and FullCube have different move sets. Keep this first partition preflight
private to FullCube and reuse the existing move policy exactly.

Two designs were considered. Reuse the existing root masks and enumerate their
normal-form prefixes. Alternatively, quotient prefixes by all 48 cube symmetries.
The second needs additional stabilizer/path-normalization coverage. Start with
the first. Do not silently replace the existing symmetry policy while building
the ledger. Prefix depth is two through four. Shorter words need their own
explicit coverage, including a solved root at length zero.

The prototype encodes a word as a base-18 integer with its depth fixed separately.
Leading zero moves are retained by that depth. The generated experiment checks
its normal-form expression against the actual `Search.enumerate` source before
compilation. The public numerical test boundary rejects other goals, invalid
masks, excessive depth and noncanonical packed roots.

The intended pure Bend module owns required prefix identities and ledger states.
An immutable scope fixes the complete root, goal, profile, contour, prefix depth,
table identity and search-policy identity. Required IDs come from the prefix
enumerator, not received worker events. Distinguish pending, running, exhausted,
failed and cancelled partitions. Duplicate, missing, stale or unfinished events
cannot make the bookkeeping complete. This boolean is not a contour theorem or
a `CompletedFailure` proof.

First compare finite prefix coverage and reconstructed paths with independent
enumeration on shallow asymmetric and symmetric roots. Test the short-word
boundary and actual omitted-prefix corruptions. Then test ledger failure states
and native/JavaScript parity. Do not launch multiple engine workers, raise a
global lower bound, integrate pruning or claim complete exact search from the
private finite preflight. No large data, new law, publication or independent
review is authorized by this design checkpoint.

The fixed `u05-prefix-v1` batch compares twenty censuses and twelve cumulative
endpoint-orbit sets with independent KPuzzle words through length four. The full
word tree has 111,151 words including empty and noncanonical words. Geometry
supplies the existing ud/flip move actions. Test all 144 mapped moves and actual
root masks for solved, U, R, U R and Superflip. No full-48 quotient is introduced.
Each cumulative comparison includes shorter words. Omitted-move and omitted-empty
variants must lose actual endpoint coverage. Opposite-order and goal-coercion
variants must also fail. Native census counts/checksums must match the same data.

Estimate four minutes with a fifteen-minute cap, serial low-priority jobs and at
most 3 GiB. No joint-cache load, search worker, new database or global exclusion.
The pure module's verdict checks ordinary typed definitions, not NP07. A passing
finite endpoint-orbit comparison is not universal coverage or optimality proof.

The first queue failed in the JavaScript oracle after the pure verdict and all
native census rows completed. Its [preserved failure](u05-prefix-v1-failed/index.json)
checks 2,284 seals and executed receipts. The supplemental record preserves all
eleven frozen Bend sources and twenty native rows. The oracle used the app's
move-list decoder, which cannot consume a legitimate 43,254-entry census.

The [adapter issue](../../../issues/partition-prefix-list-adapter.md) has a focused
regression that fails before the fix and passes afterward. The census decoder is
bounded by 18^depth, at most 104,976 entries. Thirteen malformed/boundary controls
pass. The application move limit and all Bend sources are unchanged. The fresh
`u05-prefix-recovery-v1` queue reuses verified compiled artifacts and native rows,
then reruns the corrected oracle and unchanged proof gates. Estimate three
minutes, capped at ten. No coverage verdict is accepted yet.

The [recovery archive](u05-prefix-recovery-v1/index.json) verifies 2,307 seals and
three receipts, worker gone/no resource stop. All twenty censuses, twelve finite
endpoint-orbit comparisons, five actual root masks, 144 geometry move mappings,
four compiled corruption controls and two missing-endpoint controls pass. Native
counts/checksums agree. The census-reader regression, thirteen malformed/boundary
controls and unchanged proof/toolchain gates pass. Unchanged compiled modules and
native rows were reused. The original run remains failed.

At depth four, the unrestricted-mask normal-form census has 43,254 words.
Including shorter words gives 46,756 selected words covering 46,741 endpoints.
Those duplicates are retained, not silently removed by a new equivalence rule.
The existing-mask endpoint-orbit comparisons pass only for the tested depths.
No ledger, global contour theorem, multiple workers, accepted performance gain
or NP07 proof follows. Implement the private bookkeeping ledger next.
