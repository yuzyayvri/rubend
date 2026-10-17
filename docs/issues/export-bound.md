# Export loses later lower-bound progress

Status is fixed with solo verification. Found during the hidden R02 browser check on
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

The browser now uses apps/solve-state.mjs to refine the canonical solution on
each current-job event. Bounds cannot regress or exceed the verified move count.
An optimal flag still requires equality. apps/export.mjs keeps its replay and
bound checks. No engine, domain law, or file-format change is required.

After extracting the old done-only update without changing its behavior, the
focused regression fails with actual bound one versus expected bound three.
After the fix, tests/export.mjs passes progress-only, done-only optimality,
incomplete, missing-bound, immutable-input, and invalid-bound cases. The complete
build, package-manifest check, and sixteen toolchain/proof checks pass.

The rebuilt hidden GUI repeats the exact same pilot-0 request. Its final display
and export both retain lower bound fifteen, upper bound nineteen, and false
optimality. Text, screenshot, build provenance, and before/after check receipts
are under docs/verification/r06-export-v1/. The preview's enforced 300-second
lease expires during the usage-limit interruption with exit 124. This is the
server lease ending, not a solver/test success or a solver timeout. The completed
UI result remains in the hidden tab and is captured after resumption. The tab is
then closed, and direct process inspection finds no preview or native child.
No independent review or Nix package rollout is claimed.
