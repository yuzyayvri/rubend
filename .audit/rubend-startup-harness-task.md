# Startup measurement implementation contract

The original writer owned an isolated worktree at
`/home/yuzy/.codex/worktrees/startup-harness/rubend`, branch
`codex/startup-harness`, based on `a6d3592`. Do not modify the main checkout or
any cache or baseline binary. Do not run a full-size benchmark yet.

The accepted design is `.audit/rubend-startup-synthesis.md` in the main checkout.
The next implementation unit is measurement code, not an optimization.

This contract is historical. The reviewed implementation was integrated in
`7fd975c`. Its owner is stopped. The main checkout now holds the canonical code
and durable evidence. Do not dispatch new work against the old owner checkout.

## Data shape

One JSON configuration contains a list of profile records. A profile has an id,
binary path, a cache path, its expected SHA256 and byte/word counts, and a small
explicit environment map. Each run records its profile and iteration, host
validation time, new-worker-to-ready time, time including host validation,
observed native RSS, solved replay outcome, and error state. One result records
the ordered runs, counts, medians, ranges, and binary/source identities.

## Required behavior

Implement `bench/startup-measure.mjs`, its small fixture tests, and any narrowly
needed fixture worker under tests. Use the existing Engine and Bend-generated
model for the real worker protocol and solved replay. Both real and fixture
runs must traverse the same measurement implementation.

Each side gets at least five fresh worker processes. Alternate profile order
between iterations. Start timing before worker construction and stop only on
the real ready event. Measure host SHA256 separately and also report the sum.
Verify the complete cache stream outside the worker timer and state explicitly
that this warms the file cache. Record actual hash bytes. Validate regular-file
shape and identity metadata before and after. Recheck SHA256 after the batch.
Reject changed inputs, wrong hashes, malformed configurations, early exits,
timeouts, invalid solutions, and missing ready. Do not turn failed runs into
fast observations. Report error and completed-work counts even on failure.

After each ready event, request the solved cube and require its checked empty
solution and optimal zero bound. Always await worker shutdown. Record native
RSS with samples and an immediate ready-time read. Verify binary identity
before and after. Do not claim actual native read counters from declared
configuration counts. Label input geometry and measured host-byte counts.

The interface must support the frozen raw baseline at
`/home/yuzy/rubend/build/rubend-raw-baseline` and future candidate binaries by
absolute path. It must not assume matching current source hashes for the
intentionally frozen baseline. Preserve its experimental build metadata.

Prove sensitivity using small generated fixtures. A known delayed ready must
separate from an easier case. Wrong SHA must fail before launch. A failed child,
missing ready, and wrong solved output must fail and count errors. Tests must
check complete cleanup. The fixture must not replace the production measurement
logic with a mock-only path.

Use built-in Node libraries. The worktree has no node_modules or generated SDK.
You may copy only the root build/model.mjs, build/cubie.mjs, and
build/notation.mjs into your own worktree's ignored build directory for tests.
Do not symlink the entire shared build directory. Use the pinned Node executable
at `/nix/store/gxq2cd70i077rah1d4hkzc1lpq8q4pv8-nodejs-24.21.0/bin/node`.
Pin local checks to CPU 1 at nice 10. Keep fixture tests below 256 MiB and short.

## Delivery

Do not edit application code or run full-cache measurements. Do not create
commits or change shared Git configuration. Read the poteto-mode skill and
Codex mapping completely, plus the Model the Domain, Build the Lever, and
benchmark-checklist skills before implementation. You are the delegated code
owner, not the orchestrator. Do not spawn agents. No Astra calls are allowed.
Return the exact changed paths, test commands/results, limitations, and a
proposed single command. The root will review and freeze the measurement code
before an optimization attempt begins.
