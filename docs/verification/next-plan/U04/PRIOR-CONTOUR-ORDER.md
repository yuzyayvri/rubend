# Prior-contour task ordering screen

The previous observer [preserved every canonical state](../U03/u03-pilot-u04-events-v1/index.json).
It measured completed contour work separately from interrupted spans. This
screen now changes task order. It does not add a bound or select a default.

The pure prototype is `bench/prior-contour-policy.bend`. A six-entry history
tracks each Improve axis's last fully completed contour cost. An incumbent
change invalidates its old estimate and censors unfinished work. The first
incumbent clears the history because the portfolio restarts its searches.
Unknown estimates sort last. Ties preserve queue order.

The solo architecture pass compared sorting every quantum with sorting once
per complete round. Use per-round sorting. Every active Improve task keeps one
turn per round, and exact tasks keep their queue slots. The exact task is never
ranked by an improving task's cost. No task is discarded. Normal quanta remain
20,000 Improve steps and 60,000 Exact steps. The measurement worker truncates
only a final quantum at the shared budget boundary. Both sides receive the
same total work allowance, rather than equal advance counts with unequal work.

`Track` and `Book` are small reusable metadata. The existing search array has
one owner. Both policies use the same contour observer and bookkeeping. Sorting
cost belongs only to the treatment. Diagnostic overhead is not called a
product speedup. A fully exhausted tree cannot shrink merely through ordering.

The frozen `bench/prior-order-spec.json` declares 160,000- and 640,000-step
budgets, four pilot roots plus public Superflip, and both request modes. Two
same-policy A/A cohorts precede five alternating A/B cohorts. Five cohorts
repeat the same frozen cases. They are timing repetitions, not independent
new cube samples. Require deterministic repeated quality and replay every
candidate. A lost answer, longer answer, lower established bound or lost optimum
rejects the screen, even if another field improves. A promising fixed-work
result alone permits a disjoint eight-root development confirmation.

The native guard first compares all 330 control snapshots with the frozen
baseline. It also checks shallow optima, zero work, one step and a non-quantum
budget. Numeric fixtures cover 512 permutations, stable unknown/tied estimates,
1,400 fairness turns, exact-slot placement and interrupted-cost rejection.
Every native transition must reconcile work, preserve incumbent/bound
monotonicity and stay within its admitted budget.

Native compute intervals include policy, observer and sorting work. They exclude
startup, snapshot serialization and event transport. The ms timer and a missing
dedicated search profile prevent a latency promotion. Deadline quality, first
answer p95, application/browser acceptance and fresh integration confirmation
remain unmeasured. Keep `performanceAcceptance:false` regardless of this screen.
Earlier rejected short-first and exact-reserve policies remain rejected.

The fixed queue is `u04-prior-order-v1`, expected seven minutes with a
twenty-five-minute hard cap. Compilation/proof jobs use four low-priority lanes.
Native jobs run serially on one lane, each capped at three GiB with the desktop
reserve. The joint cache is read-only and sealed before/after. No release
holdout, new domain laws, large table, publication or independent review is
included. Preserve a rejected or inconclusive result instead of tuning until
one run happens to win.

The [completed run](u04-prior-order-v1/index.json) verifies 1,921 seals, five
receipts, clean worker exit and no resource stop. The control reproduces every
frozen snapshot. Shallow optimum, zero/one-step and truncated-quantum guards
pass. The pilot has ten wins and ninety ties across five deterministic repeats,
meaning two distinct case/budget/request wins out of twenty, with no losses.
The disjoint development set has 160 ties across five repeats, meaning all
thirty-two distinct pairs tie. No pilot gain is confirmed there. Round robin
remains the baseline; the private policy is not promoted or integrated.

The pilot's A/A timing spread exceeds five percent in fifteen of twenty pairs.
Do not infer a speed or deadline-quality benefit. The guard replays 420
candidates, the pilot 5,258 and development 8,190. The pilot and development
consume 96,000,000 and 128,000,000 total work steps, including repetitions.

The raw pilot/development JSON exceeded the synchronous archiver's 32-MiB
input cap. After canonical source/resource verification without archive writes,
the bounded streaming helper preserved their exact bytes under two-GiB,
ninety-second resource receipts. The unchanged canonical checker then verified
the complete archive. No source seal, result or receipt was rewritten. Read
the [archival recovery record](../../../issues/background-evidence-size-limit.md).
