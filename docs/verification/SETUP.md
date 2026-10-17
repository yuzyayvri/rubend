# Setup verification

Historical setup record. For the implemented app and later evidence, use
[`CURRENT.md`](../CURRENT.md) and [`PORTFOLIO.md`](PORTFOLIO.md).

Date: 2026-10-16, Asia/Manila. Scope: prerequisites, repository foundation, and
planning. The cube solver and GUI are not implemented.

## Environment

- NixOS / x86_64 Linux. No NixOS system rebuild or global package/profile change.
- Nix inputs pinned in `flake.lock`; development entrypoint is `nix develop`.
- Bend 2.0.37 from the official release, packaged by the pinned upstream flake.
- Lean 4.34.0 official binary release, verified by its release SHA256 and patched
  for Nix. Approximate installed footprint: 3.0 GiB. This is a toolchain download,
  not a search-table allocation.
- BendTT kernel built from the Bend release's bundled Lean source using that
  exact Lean version. The kernel is selected through `BENDTT` in the dev shell.
- Clang, Node.js 24, Git, and Just provided through the same Nix environment.
- Bend telemetry disabled for these commands through `BEND_NO_TELEMETRY=1`.
- No frontend dependencies, pruning databases, GPU SDKs, or external solvers
  installed. No benchmark or training jobs launched.

Only this architecture has been configured and tested. There is no portability
claim for other Nix systems yet.

## Executable checks

Run:

```sh
nix develop --command just check
nix flake check --no-update-lock-file
```

The check program tests:

1. Pinned Bend and Lean versions.
2. A Boolean round-trip law through Bend and the independent BendTT verdict.
3. Rejection of false, missing, and unsafe proofs through both check entrypoints.
4. IO execution, native compilation, and native execution.
5. JavaScript module compilation and actual Boolean interop.
6. Absence of unsafe definitions and unresolved proof holes in production Bend.

Passing these checks establishes a working toolchain only. It does not establish
any law about cubes, search completeness, optimality, playing strength, or speed.
Raw evidence is retained beside this file after the final run; temporary build
outputs remain ignored under `build/`.

Latest verified result: all 16 development checks pass, and the isolated
`nix flake check --no-update-lock-file` passes. See
[`setup-check.json`](setup-check.json) for raw output, durations, and source
hashes. These are toolchain results only.

## Failures investigated during setup

- The initial upstream remote flake command attempted to write a lockfile into
  immutable fetched input. Metadata inspection used `--no-write-lock-file`;
  the actual project has its own checked-in lockfile with explicit inputs.
- Git's inherited GitHub helper pointed at a removed Nix store path. Resetting
  the helper only for this repository to the installed GitHub CLI restored
  authenticated remote reads. No tokens were printed or stored in the repo.
- A generic constructor-object ABI assumption did not match the emitted Bool
  function. The generated module uses primitive booleans; the test uses its
  observed representation. Future host codecs need their own checks.
- The first sandboxed Nix check failed while launching the kernel, despite the
  development-shell test passing. Lean's linker emitted a conventional Linux
  loader path. The kernel package now applies Nix's ELF interpreter/dependency
  fixup; the isolated check passed after this fix.

## Repository state

Local Git repository initialized on `main`. `origin` is
`https://github.com/yuzyayvri/rubend.git`. GitHub confirmed the target is private
and empty. Its visibility was not changed. Local project files are staged;
there is no initial commit because an author name/email is not configured.
No push, pull request, release, or deployment was performed.

License changed from the initially requested MIT to GPL-3.0-or-later following
Yuzy's later instruction. `LICENSE` contains the full GPLv3 text; the README and
package metadata supply the version-3-or-later grant.

## Readiness

Implementation begins with the small feasibility experiments in
[`docs/PLAN.md`](../PLAN.md), not a large table build. The complete domain-law
proposal, benchmark protocol, and application specification are saved in the
repository. Any missing or failed final check must be reported, not marked as
passed by this document alone.
