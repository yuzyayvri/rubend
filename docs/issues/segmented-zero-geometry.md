# Invalid geometry matched an unavailable profile

Status is fixed in the isolated segmented prototype before promotion.
The owner reports zero words when any of its three actual dimensions is wrong.
The generated profile registry also used zero to mean unavailable. Matching
those two zeros accidentally admitted a forged Light profile with invalid
storage, even though valid raw initialization correctly rejected the same owner.

The executable failing-before case reported rawRejected=1, lightRejected=0,
and lightZeroAccepted=1. The generated boundary now requires a strictly positive
expected geometry as well as exact equality. The passing case reports 1, 1,
and 0. Both Light and Block profiles reject zero. Generator fixtures reject an
unmodeled change to this matching contract before writing output.

This was found by extending the prototype's real P.initialize check, not by
running a malformed search. No shipped/default engine, stored cube, or table
was affected. The current laws do not state this storage contract, so a passing
kernel verdict alone did not establish it. The finite regression and source
guard are included in the segmented foundation evidence.
See [the raw regression records](../verification/r03-segmented-foundation-v1/index.json).
