# GitHub Actions

The [CI workflow](../../.github/workflows/ci.yml) runs on pushes to main, pull
requests, and manual dispatch. It supports the project's x86-64 Linux target.
Its thirty-minute job limit applies to the complete run, including downloads.
Superseded runs on the same branch or PR are cancelled.

## Checks

The job runs serially on Ubuntu 24.04:

1. Install Nix with one concurrent build and two build cores.
2. Lint the workflow with actionlint from the repository's pinned nixpkgs input.
3. Install locked JavaScript dependencies with lifecycle scripts disabled.
4. Run `nix develop --command just check`, including the independent BendTT verdict.
5. Run `nix develop --command just test`, including the native worker and playback regressions.
6. Run `nix flake check --no-update-lock-file --print-build-logs` for the sandboxed package, setup, and installed runtime checks.

The workflow uses existing tests. It does not generate the large optional
pruning caches or run performance comparisons on a shared hosted runner.
Three executable test fixtures previously named one workstation's Node store
path. They now select Node from the pinned development environment. The
fixture-portability check prevents that dependency from returning.

Logs, the setup receipt, and the build manifest are uploaded even after a
failure, when those files exist. Artifacts expire after fourteen days. A
cancelled job or failed download is not a passing verification result.

## Continuous delivery

After all checks pass on main, the job exports the Nix package and its complete
runtime store closure. Download `rubend-x86_64-linux-COMMIT` from the successful
Actions run. It contains a compressed Nix export, the root store path, source
commit, checksums, README, license, and third-party notices.

This is a Nix artifact for Linux, not a standalone portable executable. From
the extracted artifact directory, with Nix installed:

```sh
sha256sum --check SHA256SUMS
gunzip --stdout rubend-x86_64-linux.nar.gz | nix-store --import
"$(cat store-path.txt)/bin/rubend"
```

The server binds to loopback and prints its URL. No release, tag, registry push,
public service deployment, or repository protection change is automated.
Pull requests cannot enter the delivery steps. Manual dispatch can produce a
package only when its selected ref is main.

## Security and maintenance

The token has `contents: read` only. Checkout does not retain Git credentials.
The workflow uses `pull_request`, never `pull_request_target`, and does not
interpolate PR text into shell commands. All external actions use full commit
pins. Current upstream release mappings are:

| Action | Release | Commit |
| --- | --- | --- |
| actions/checkout | v7.0.1 | 3d3c42e5aac5ba805825da76410c181273ba90b1 |
| cachix/install-nix-action | v31.11.2 | 448cde739abec1eaf0646249e3d25bb8d9bc7702 |
| actions/upload-artifact | v7.0.2 | cf430e030ddbb5b0abf93d22962f4752f3646cd9 |

Pins and input names were checked against the upstream action manifests.
See GitHub's [secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use),
the [Nix installer](https://github.com/cachix/install-nix-action), and
[artifact action](https://github.com/actions/upload-artifact).

Check workflow edits locally with
`nix run --inputs-from . nixpkgs#actionlint -- .github/workflows/ci.yml`.
Passing local checks does not establish hosted-runner acceptance. Inspect the
actual Actions run and downloadable artifact before calling delivery verified.
Independent review is not run under the project's solo instruction.

## Initial validation

Local actionlint passes, including ShellCheck. The fixture portability check
covers five workers. The existing engine lifecycle test passes nineteen workers,
the startup harness passes thirty cases and checks ninety-seven worker exits,
and the lifecycle benchmark fixtures pass thirty cycles over twenty-five workers.
These are test-fixture results, not solver performance measurements.

Hosted-runner execution, sandboxed package acceptance at this revision, and
download/import of the delivered closure are pending the first GitHub run.
No successful hosted build is inferred from the local checks.
