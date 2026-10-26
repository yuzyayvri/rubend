# Local artifact export, import and installed HTTP

The [original Nix package](LOCAL-PACKAGE-BUILD.md) is built and checked. This
unit tests a real local delivery artifact, not a development-tree launch or a
relabelled historical GitHub CI artifact. It does not publish or upload files.

The October 24 order remains unchanged. Complete roadmap and delivery
verification, then obtain additional 3x3 competitors from primary upstreams.
Freeze every configuration before one coordinated untouched evaluation. Deliver
the numerical report before ending the automation. Yuzy decides any later push
after reviewing that report. No push or merge is currently authorized.

## Artifact and runtime-only store

Freeze the built source revision, logical package path, actual binary/asset
hashes and runtime reference closure. The package itself has a 7,385,992-byte
NAR. The complete runtime closure has 67 paths and 276,999,368 NAR bytes. Those
sizes are serialized filesystem data, not RAM usage or compressed artifact size.
The 2.55-GB earlier build-input closure is not the runtime payload.

Export that runtime closure twice from the private build store. Each stream has
a two-GiB raw ceiling and 512-MiB compressed ceiling. Meter and hash both streams
without buffering the archive. Require equal raw counts and hashes and equal
compressed bytes and hashes. This checks two same-run exports under the sealed
toolchain, not universal cross-platform bit reproducibility. Keep both artifacts.

The local delivery directory contains the gzip NAR, exact source revision,
logical store path, LICENSE, README, third-party notices and SHA256SUMS. Binaries
and dependency trees stay ignored. Commit the small source-bound receipts and
raw validation records. Do not represent this locally built artifact as CI
attestation, a release, or a deployed service.

Import the first archive into a new runtime-only private store. Check artifact
bytes before import, decompressed count and hash during import, and the exact
imported path set afterward. Verify actual imported contents and every NAR hash,
size and reference set. Check the installed manifest, final native binary,
generated modules, web assets and source-identical notices/licenses. No compiler
or development checkout is mounted for the application.

## Actual installed entrypoint

`bench/local-package-launch.mjs` constructs an empty mount namespace with only
the imported read-only `/nix`, a fresh tmpfs and empty `/work`. It clears the
environment and starts the installed `bin/rubend`. Seven invalid target controls
reject broad, nested, wrong-family or path-traversal requests. Existing CI
delivery pins and their guards remain unchanged.

`bench/local-installed-http.mjs` runs three sequential real installed sessions.
The first tests solved, all eighteen face turns and the existing four-move
commutator fixture. Two further sessions test solved input and repeated full
lifecycle. Every retained candidate, including recovery and observed cancelled
stream packets, independently replays through integer sticker geometry.
This is functional acceptance on known fixtures, not holdout evaluation.

Check actual served asset bytes, CSP, origin/session rejection, invalid input
and unsupported request fields. Abort a running six-face request and resubmit
solved input. Require the native PID/start identity to stay retained. Record
cancel-to-recovery observations against the existing 100-ms target without
claiming p95, a stable performance comparison or a speedup. Retain target misses.

Before shutdown, hash the actual native `/proc/PID/exe` against the installed
manifest, check installed server source through the process root and confirm
the repository is unavailable there. Session tokens stay only in memory.
Record wrapper, application and native identities, and verify they are gone
after normal wrapper shutdown. A driver-forced SIGKILL fails acceptance.

PID-root IPC paths disappear with the isolated tmpfs namespace. This does not
separately prove deletion before namespace teardown. Native termination signal
is not independently observed through the HTTP boundary. Keep these limits
explicit rather than inventing a native SIGTERM witness. Source-identical
engine lifecycle evidence is retained separately.

## Fixed queue and remaining gates

The original queue fails at its immediate descendant-cleanup assertion after
export, import and the first HTTP session's requests pass. Its full failed
evidence is [preserved](u07-delivery-v1-failed/index.json), with 8,176 source
seals, three resource receipts and the detached worker gone. All observed
processes are gone at later inspection. The [root cause and executable
regression](../../../issues/installed-http-descendant-close.md) record the
outer-child-close timing mistake without relabelling the failed run.

The distinct `u07-delivery-http-v1` recovery reuses the exact exports and import.
It verifies the preserved records, artifact hashes, current application graph,
installed native and modules, and all 67 runtime metadata and content records.
No export, import or build is duplicated. Three fresh HTTP sessions use bounded
one-second owner settlement, retaining first and final identities. A persistent
owner or IPC path still fails. Normal wrapper exit and no forced kill remain.

Recovery has three serial nice-10 CPU2 jobs. Check and HTTP each use one GiB
and at most three minutes. Confirmation uses 512 MiB and sixty seconds. The
queue cap is eight minutes, with a two-minute estimate. No performance claim
follows from settlement observations. Actual installed integration is pending.

`u07-delivery-v1` has four serial nice-10 CPU2 jobs. Export, import and installed
HTTP each use one GiB and at most three minutes. Confirmation uses 512 MiB and
sixty seconds. The whole queue cap is twelve minutes, with a three-minute
estimate. Keep desktop reserve, no swap, aggregate-memory checks and disk
reserves. The byte-meter controls reject oversized and invalid streams.

Passing this unit does not establish real-browser interaction or rendering.
Hidden installed-app live lanes remain, followed by additional-solver research
and local setup, configuration freeze, final comparative evaluation and the
numerical report. No new solver algorithm, law, database, formal application
proof, performance promotion, publication or independent review is claimed.
