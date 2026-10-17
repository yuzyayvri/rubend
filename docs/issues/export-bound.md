# Export loses later lower-bound progress

Status is reproduced and open. Found during the hidden R02 browser check on
2026-10-17, after the solver pilot commit 8802d45, main equivalent 4fe900c.
No visible window opened.

The pilot-0 exact run returns a replay-checked nineteen-move answer at a
two-second budget. The GUI's final lower-bound display is fifteen. The exported
record instead has lowerBound thirteen and searchOptimal false.
The reproduction is docs/verification/r02-v1/r02-hidden-incomplete-export-before.txt
and its screenshot. The matched native canary's final events also establish
fifteen in r02-v1/r02-deadline-compare-v1.json.gz.

The browser creates solution.lower from a candidate. Later progress and done
events update the DOM's lower-bound field but do not update that solution field.
apps/export.mjs serializes solution.lower. An optimal done event can also set
solution.optimal while leaving its old lower bound, causing the export validator
to reject an otherwise valid final result.

The fix belongs at the canonical solution update, not in the presentation label.
Keep replay verification and the bound/optimality checks. Test a candidate followed
by progress and completion without another candidate. The exported interval must
match the last established bound. A timeout or cancellation must never manufacture
an optimal label. Recheck the real hidden GUI after rebuilding its bundle.
