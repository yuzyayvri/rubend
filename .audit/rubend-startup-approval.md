# Experimental raw startup approval

The primary agent accepts the scoped raw-profile initialization change after
independent review of code at `e6d5e6f`. The accepted unit uses bounded word IO
and final-position loading. It preserves the sealed raw cache and keeps all
search, fingerprint mathematics, table generation, and replay checks in Bend.
This approval does not enable the large profile in the default application.

## Correctness review

The `startup_independent_review` agent used `gpt-6-sol`. It approved loader and
foreign-IO correctness, the fixed-work comparison tool, and the evidence trail.
It found no actionable defect. It checked the owned-array tag and sharing
guard, wide range arithmetic, one-MiB private scratch, worker-thread versus
runtime-thread writes, little-endian publication, and explicit file cleanup.
It checked these against the pinned Bend runtime, not only the test summaries.
It made no edits and ran no builds or tests.

The reviewer initially included a package recheck in an overall caveat. On scope
clarification at the same code revision, it explicitly corrected that caveat.
A package recheck is required before a packaged-app or rollout claim, not to
accept this experimental native binary's warm-file-cache startup measurement.
`nixPackageRechecked` remains false.

## Evidence and comment review

The `startup_evidence_review` agent used `gpt-6-luna`. It approved the evidence
and trail after checking the complete compressed records, archive hashes,
counts, alternating orders, input identities, and fixed-work transcripts.
It approved the scoped comment scan with zero added comments, suppressions, or
exceptions. It made no edits and ran no builds or tests. No separate comment
agent was dispatched; the read-only review performed that required scoped scan.

Both reviewers reconcile 55 successful comparison workers and zero errors.
The confirmation has five fresh workers per profile. Its median changes from
9,413.19 to 1,849.06 ms, an 80.36% reduction under warm-file-cache conditions.
The full-state comparison has 4,591 snapshot pairs, including all 163 raw-profile
shallow optima and 3,907 certified candidate snapshots per side.

## Scope limits

The result excludes cold disk, browser startup, and packaged-app performance.
It does not establish world-class strength, universal search completeness,
foreign-IO correctness by proof, or equal quality at every wall-time budget.
The raw array still occupies two GiB. The block codec remains rejected for the
speed profile. Search refinements require their own matched warm-solve tests.

The required four startup review gates are closed. No new performance benchmark
was needed for this review-only completion. The source, archived transcripts,
and baseline and candidate binaries are unchanged. Local commits are authorized;
publication, deployment, merges, and pushes are not.
