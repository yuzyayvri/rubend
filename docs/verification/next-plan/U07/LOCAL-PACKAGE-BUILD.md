# Original local Nix package build

The [private-store preflight](PRIVATE-PACKAGE-PREFLIGHT.md) passes. The next
fixed queue builds the original frozen flake derivation. It does not modify the
package recipe to skip checks or substitute a staged development build.

The October 24 order remains unchanged. Finish roadmap verification and local
delivery, then research and set up additional solvers. Freeze all actors before
the coordinated untouched U07 evaluation and numerical report. No push or merge
is authorized before Yuzy reviews that report and decides separately.

## Frozen source and build admission

The package source revision is `c7d74d63e20dc7d90bb0865dc84edaa7952b4969`.
Its actual application graph matches the later HEAD and the passed fresh
regression. Later benchmark/controller and evidence edits are not installed
application changes. The frozen derivation is
`/nix/store/kydi843kamqj5y7g24zrqblayk9jw3l5-rubend-0.0.0.drv`.
Its declared output is
`/nix/store/zb35vb7ivc3j4j4vy4rgby5zqhwpcml5-rubend-0.0.0`.

Reuse the preflight's private store and checked 2,133-path closure. Do not copy
it again. A read-only dry run identifies only two required local builds, the
original fixed-output npm cache and the original package. Twenty paths can be
substituted from the official Nix cache. Their exact unpacked NAR sum is
15,012,592 bytes in the planning observation, below the frozen 256-MiB limit.
The three previously missing npm hooks are among those substitutes.

`bench/nix-build-admission.mjs` checks the exact requested output, every planned
local derivation, path cardinality and complete dry-run lists. Any compiler or
other unexpected local build fails admission. Paths are compared as canonical
sorted sets, not dependent on cache response order. Seven malformed plans reject
in the focused test. Singular and plural Nix messages are covered.

Admission first fetches only the declared binary substitutes, with signatures
required, zero local build jobs and no remote builders. The fetched hashes,
sizes and references must match the frozen remote metadata. Repeat the dry run
offline and require no remaining binary substitution before the heavy job.
This is ordinary local dependency acquisition, not cloud compute or a global
package installation. No signature or security check is disabled.

The npm cache is a fixed-output derivation tied to the original
`sha256-UdVqJLfQ0wq+ZA3cZpnCLmtXrshlWYZbhFLrjkvsZNE=` hash and package lock.
Its builder may download the lockfile-pinned public npm tarballs. The hash and
integrity checks remain mandatory. No network-byte quota is claimed. Memory,
wall time and disk admission remain explicit. Npm dependency install scripts
stay disabled by the original package's `--ignore-scripts` setting.

## Actual build and checks

Run the unchanged derivation in the private local store with sandboxing enabled,
fallback disabled, one local build job, four declared cores and no remote
builders. The original `doCheck=1` and package check phase remain enabled.
Preserve failed build directories and all command logs if a step fails.

The heavy job checks its actual 4-GiB cgroup, zero swap and CPU2 through CPU5
affinity. It reuses the same private-store mechanism whose actual tiny builder
passed cgroup, affinity and nice-10 checks. The package is not delegated to the
host daemon. No new global setting, account, profile or service is created.

After Nix succeeds, run the actual package checker on the installed files.
Require the installed manifest's application graph to match current source and
the final native hash after Nix fixups. Check source-identical LICENSE, README,
third-party notices and every retained license file. Record built native,
generated modules, browser assets, wrappers and original Nix build log.
This verifies notice preservation, not an independent legal review.

## Fixed resource queue and unfinished delivery

`u07-package-build-v1` has three serial jobs. Admission uses 512 MiB, CPU2 and
at most two minutes. The package build uses 4 GiB, CPU2 through CPU5 and at most
twenty minutes. Confirmation uses 512 MiB, CPU2 and sixty seconds. The whole
queue cap is twenty-five minutes, with an eight-minute estimate. Keep nice 10,
the eight-GiB RAM reserve, no swap and aggregate-memory backstops. Disk must
cover the earlier six-GiB scratch/runtime reserve and eight-GiB desktop reserve.

A built package is not installed acceptance. Export to a reproducible local
artifact, import into another fresh runtime-only store, installed HTTP/native
checks and hidden real-browser acceptance remain separate gates. Then complete
additional-solver research/setup, configuration freeze, final comparison and
the numerical report. Do not end the automation at compilation. No holdout
evaluation, speed claim, publication, push or independent review occurs here.

## Verified original package

The [canonical archive](u07-package-build-v1/index.json) verifies 8,141 seals
and all three resource receipts, with no stop and the detached worker gone.
The twenty declared substitutes match their frozen identities. The original
fixed-output npm cache and package both build. The original Nix check phase is
enabled. The actual installed package checker passes after native ELF fixups.

The installed application graph matches the final-source regression and current
source. The native SHA256 is
`2fcce66780c152906b9b32d4a14b7f8d04169aee77a0976efb29cedb8909637c`.
All five source license/notice/document files match their installed bytes.
The original Nix build log is retained. This verifies file preservation, not
an independent legal or security review.

The build job takes 75,744 ms and peaks at 3,139,588 KiB sampled aggregate RSS
under its four-GiB cap. These are one-run resource observations, not solver or
build-speed comparisons. The 191-ms confirmation has no nonzero sampled peak;
do not interpret that missed short window as zero memory use.

The product NAR is 7,385,992 bytes. Its runtime closure has 67 paths and
276,999,368 NAR bytes. Neither is a RAM figure. The next
[local-delivery queue](LOCAL-DELIVERY.md) exports and imports the actual artifact
before installed HTTP and hidden-browser acceptance. The whole workflow,
additional competitors and numerical report remain incomplete. No holdout
evaluation or push follows from this build.
