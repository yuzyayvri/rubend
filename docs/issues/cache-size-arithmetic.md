# Cache length arithmetic needs a checked boundary

Status is open. The read-only loader trace identified U32 multiplication in
`src/joint-cache.bend` at `sized`. `count * 4` can wrap for counts above the
U32 byte-size range. Existing raw and block profile constants fit, and failed
reads stop before a solver becomes ready. This is a general loader-contract
gap, not evidence of a wrong returned cube solution.

The loader design review must choose an overflow-safe length check. Add a
regression case that requests a count whose byte product wraps. Do not remove
the low-level effect's separate physical-array and chunk bounds.

Evidence is `.audit/rubend-startup-grounding.md` and the `sized` definition.
