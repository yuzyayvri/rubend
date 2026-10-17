# Implemented local workbench: verification report

This records the first small-memory portfolio tier. The later experimental
larger-bound results are in [JOINT.md](JOINT.md); its cache is not enabled by
default in this app.

The working app and native solver are implemented, GPL-3.0-or-later, and local
only. No commit, push, release, deployment, system rebuild, or GPU installation
has been performed. Git author identity is still unconfigured.

## Solver

The Bend engine has a two-phase improving search and an exact traversal. Six
rotated/inverse views share one owned table; equivalent symmetric roots are
deduplicated. Exact mode keeps fast improvement work running rather than
abandoning candidate quality after the first answer. Full root move symmetries
use checked conjugation/move-set identities.

All emitted answers pass the proof-bearing replay boundary and a second bridge
replay. The proof scope is documented in
[`PROOF-COVERAGE.md`](../architecture/PROOF-COVERAGE.md). There are 18 checked
laws; full search completeness and backend correctness are not formally proved.

Preliminary uniform-state samples found valid answers on every case. The fresh
32-case release-smoke sample averaged about 19.3 HTM after one second, with a
first-answer p95 around 64 ms. Treat the raw record's source/binary identities
and exact values as authoritative. This is a small sample, not a world-class
claim or the planned large release benchmark.

The cubing.js comparison returns one solution rather than a matched anytime
curve. The report records first-answer quality separately from quality after
Rubend's longer budget. No Nissy/H48 solve benchmark has been completed.

The native process peaked around 43 MiB in the bounded solver suite. That does
not include Node or the browser. Cancellation of the native process measured
about 7–9 ms; complete warm-worker replacement was about 0.23 seconds. These
measure different events and must not be conflated.

Hard random exact cases remain incomplete under short budgets. A bounded
three-case diagnosis showed roughly 12-move lower bounds against 19/20-move
incumbents after two seconds. Stronger bounds are the next substantial task,
under the resource decision in
[`ADVANCED-PROFILES.md`](../benchmarks/ADVANCED-PROFILES.md).

## Application

Hidden browser checks covered 3D rendering, notation input, a seven-move exact
solution, playback, pausing during animation, seeking, backstepping, invalid
sticker input, and narrow/light layouts. Screenshots are retained with the
evidence. No visible browser window was opened.

Rendering is capped around 60 fps to avoid wasting GPU work. Advanced details
show measured frame timing. Progress is throttled before reaching the browser;
candidate answers are delivered immediately. The 2D sticker net remains the
fallback when 3D is unavailable. A real GPU-context-loss scenario has not been
fully tested across browsers.

Export records are validated before serialization. Because the in-app browser's
download automation did not deliver a download event, the app offers a readable,
selectable JSON record as well as a download button. File download behavior in
external browsers is not claimed as fully verified. Clipboard writes were not
tested against the user's active clipboard.

## Packaging and checks

`nix run .` builds and launches the local server without opening a window.
The package uses pinned Nix/npm inputs and checks the proofs, core model,
shallow optima, export guards, and full projected tables during its build.
`nix flake check` additionally exercises packaged HTTP and native-process
behavior inside the Nix sandbox. The final command result, not this document
alone, establishes whether a particular source snapshot passed.

The build manifest binds generated modules and the native binary to source
hashes/toolchain versions. The benchmark rejects stale or changing builds.
The Nix fixup phase refreshes the packaged binary digest after loader patching.
Third-party licenses and runtime notices are retained.

Safe cleanup fixes include private FIFO permissions, startup-failure reporting,
waiting for process shutdown before exiting the server, and removing owned IPC
directories. No reference pruning table or large profile is silently generated.

Historical evidence under `implementation/` remains untouched. Current raw
snapshots are stored separately under `portfolio-v1/`; generated artifacts stay
under ignored `build/`. Next steps and any verification limits are in
[`CURRENT.md`](../CURRENT.md).
