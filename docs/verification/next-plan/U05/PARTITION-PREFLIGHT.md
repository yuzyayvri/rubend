# Private partition preparation

This is a design checkpoint, not implemented partition search. NP07 remains
unapproved and unproved. The completed duplicate-context screen does not justify
a cache on its observed workload, but partition coverage is a separate question.

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
