# Private review pass 2

- [ ] Reproduce it yourself on the matching surface via the driver skill (Non-negotiables), even when a debug or instrumentation protocol says to ask the user to reproduce. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires.
- [x] Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives.
- [x] Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent using your configured bug-fix model (default in poteto-mode's Models section) with a specific scope.
  skip: delegation and parallel exploration are prohibited by the project solo boundary. Existing protocol and ModelClient state are sufficient. No signature change is needed.
- [ ] Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
- [x] Stage the commits so the failing repro lands before the fix in git history.
- [ ] Run **Opening a PR**.
- [ ] Start the file-backed bounded full suite and hand back its result paths and ETA.
- [ ] Close PR 1 and create its complete replacement against main without deleting the old branch.
- [ ] BLOCKED: independent review. Solo instruction prohibits independent, comment, and trail reviewers. No merge-ready claim.

The throughput checkpoint is two reported defects, one fixture protocol integration test, one actual-entry-module keyboard test, and one unattended full test/check batch capped at thirty minutes. No expensive solver comparison or table rebuild is needed.
