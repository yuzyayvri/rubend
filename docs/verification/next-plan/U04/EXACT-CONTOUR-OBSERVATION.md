# Exact contour work without a scheduling change

The first diagnostic found 115 contour-crossing snapshot intervals, but those
cannot identify exact contour costs. This unit observes actual search advances.
It still counts the engine's work steps, not tree-node visits or elapsed time.

The solo design pass compared changing `Search` to carry instrumentation with
an external wrapper. Use the wrapper in `bench/portfolio-observer.bend`.
It calls the actual `Search.advance`, retains metadata only when a contour,
incumbent, lower bound or terminal state changes, and delegates portfolio
updates to the actual `Portfolio.finish_slice`. Search/session layouts,
20,000/60,000-step quanta, restart logic and round-robin selection stay unchanged.
No array owner is duplicated. This is diagnostic allocation, not a treatment.

The generated fixed worker emits transition events alongside the existing
snapshots. Every canonical snapshot must equal the saved native baseline on
four pilot roots plus public Superflip, in both modes. Candidates still pass
the independent sticker replay. The raw table is read-only and hashed before
and after. No release corpus is opened.

`bench/contour-events-model.mjs` groups events by case, task, stage and restart
epoch. A p1/ceiling/bound transition after exhaustion closes a contour. Costs
include the advance that observes the empty stack. Local and shared incumbent
changes censor interrupted contours. A first-incumbent portfolio restart
begins new epochs. A terminal status alone is not exhaustion evidence.
Budget-ended tails remain censored. No completed-failure cache certificate is
created by these observations.

Fixtures cover several crossings within one quantum, spans across quanta,
missing events, wrong axis, incorrect node increments, local/shared incumbent
updates, restarts and terminal-without-transition rejection. The native check
requires both exact state equality and total-work reconciliation before using
the signal for a later ordering experiment. Required independent review remains
not run under the solo restriction.

This is the events job of `u03-pilot-u04-events-v1`. It makes no strength or
latency claim. A cost-based ordering key, premoves and phase-two projection
remain later U04 work.

The [canonical archive](../U03/u03-pilot-u04-events-v1/index.json) passed with
1,911 seals and no resource stop. All 330 canonical snapshots equal the saved
baseline and all 228 candidate events replay. The observer emits 887 changes
and reconciles 6,960,000 work steps. The analysis retains 843 exact completed
contour costs and 179 censored spans, with eight first-incumbent restarts and
fourteen local incumbent changes. These are diagnostic work counts, not search
completeness certificates or a latency gain. Next, compare a starvation-free
task-order treatment against round robin without changing the work quanta.
