# Resource receipt overwrote a child report

Status is fixed and the failing-before/passing-after regression passes. The H0 timing
smoke used the same output filename for its child report and resource receipt.
The final write in bench/run-limited.mjs silently replaced the sixteen-job raw
report with the outer receipt. Source, sealed tables, and older evidence were
unchanged. That smoke is invalid for performance adjudication and must be rerun.

The regression drives the real bounded launcher. Its child creates an artifact
with an exclusive write and reports that it did so. Before the fix, the artifact
field reads undefined rather than child. The runner now rejects an existing
receipt before launching and uses an exclusive final write. A child collision
therefore preserves the child artifact and fails the run instead of overwriting
it. Fresh names are required for all resource receipts. Removing the exclusive
write in an actual temporary launcher reproduces the overwrite again; this
mutation is detected by the same check.

The [archived evidence](../verification/r04-evidence-guard-v1/index.json)
retains the invalid receipt and its explicit exclusion, the replacement child
report and distinct receipt, mutation results, nearby ownership/policy checks,
and all sixteen toolchain/proof checks. The replacement smoke passes all
sixteen measured jobs and all shallow warmups. It is only a smoke, not the
five-cohort performance verdict.

Run nix develop --command node tests/resource-evidence.mjs on a host admitted
by the local resource policy. This integration test needs a user systemd scope
and eight GiB of desktop reserve. It is separate from portable policy fixtures.
