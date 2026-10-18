# Full-symmetry proof cost

Status: resolved by a structural color action. The approved laws are unchanged.

Premise under test: changing flat finite matches to nested matches makes the
monolithic symmetry-composition proofs fit the routine 2-GiB check budget.
Both complete attempts hit the aggregate-RSS backstop, at about 2,100,000 KiB
after 37 seconds. They produced no proof verdict. The specification alone
compiles within the smaller 1-GiB cap. Layout alone did not solve the cost.

The fixed-left diagnostic exposed an earlier logical reduction problem. A
numeric wildcard does not let the checker reduce nested renaming for every
remaining U32 value. It printed an expected symbolic U32 word against an
unreduced color action, rather than a counterexample to the law.

The action now checks high bits structurally before changing the six known
colors. A small proof helper takes those bits in match order. The first direct
bit-pattern attempt violated Bend's binder-order rule and failed before a
verdict. The corrected fixed-left diagnostic passes in the same 1,536-MiB cap.
The complete five-law proof passes the ordinary checker at 1,346,132 KiB peak
aggregate RSS in 7.13 seconds. These are development check costs, not solver
performance results. The complete PROOF.bend graph also passes BendTT.

The first BendTT command combined --verdict and -o. The CLI rejects that
combination. The corrected standalone --verdict command passes. The rejected
command is not counted as a proof result. Translation export is a separate step.

Raw records: build/evidence/r04-sym48-proof-attempt-v1.json,
build/evidence/r04-sym48-proof-attempt-v2.json, and
build/evidence/r04-sym48-spec-v1.json. Preserve these in the eventual verification
archive alongside the successful checks. The final source uses generic paint
composition and separately generated finite position cases. No law was narrowed
to legal colors or sampled cubes to make it pass.
