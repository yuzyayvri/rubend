# Private Nix package build admission

The [fresh final-source regression](FINAL-REGRESSION.md) passes. It does not
replace an actual Nix package build, export, isolated import or installed-app
check. The old downloaded CI artifact has different application sources. Do not
relabel it as the final artifact or create a new CI push without authority.

The October 24 completion/report/no-push order remains unchanged. Complete
the roadmap verification and local package, then research and set up additional
3x3 solvers. Freeze all configurations before the coordinated untouched U07
evaluation. Deliver the numerical report before ending the existing automation.
Yuzy separately decides any later push or merge.

## Build ownership and actual prerequisites

The host Nix daemon does not inherit a user batch's memory or CPU limits.
Do not delegate the heavy package build to that daemon and claim it is capped.
The selected alternative uses a fresh private local chroot store. It uses the
normal logical `/nix/store` paths but keeps its files and database under the
ignored experiment directory. Nix documents direct local-store operation and
Linux namespace requirements in its [local-store manual](https://nix.dev/manual/nix/2.34/store/types/local-store).
The installed 2.34.8 help is also checked. The online version-family page
currently identifies 2.34.9; no version update is requested.

Freeze the actual original flake derivation and application source graph.
The installed CLI emits derivation JSON version four. Ordinary requested
outputs carry paths. A fixed-output npm-cache declaration carries a content
hash and method instead. Resolve its expected path with Nix's read-only query
and retain that query. An expected path is not evidence that the output exists.
The initial read-only attempt refuses the missing field before any copy/build.
Controls now reject absent or malformed fixed-output resolutions.

The current read-only inventory finds sixteen required top-level outputs.
Twelve are cached. Three npm hooks and the pinned npm dependency cache are
absent. They remain explicit prerequisites for a later bounded package build.
This preflight neither downloads nor builds those missing inputs. The cached
closure has 2,133 paths and about 2.55 GB of NAR data in the planning observation.
The actual committed plan freezes its own exact identities and sizes.

Admit at most 4,096 cached paths and 6 GiB of input NAR data. Require that free
disk also covers 6 GiB for future scratch/runtime copies and an 8-GiB desktop
disk reserve. This is separate from RESOURCE-POLICY.md's RAM reserve. There is
no arbitrary large cache or whole-machine inventory in the input set.

## Direct copies and content checks

Copy only the admitted store paths directly through the owned process, not a
host-daemon bulk export. Preserve symlinks and execute bits. Query only that
closure's metadata with `nix-store --dump-db`, then load it into the private
database. The installed help documents the path-selected subset. Never dump
the entire host store database. `--load-db` targets only the validated private
store, not the host store.

Run the private store's `--verify --check-contents` with no repair or signature
bypass. Compare every imported NAR hash, size and reference set against the
frozen source metadata. Direct hashing and file copying stay in the resource
command tree. The host daemon supplies metadata only; no build or large data
stream is delegated. Preserve partial files and logs if any check fails.

## Tiny real build before the full package

The next job constructs one small derivation using the copied pinned Node
runtime. It records actual `/proc` cgroup membership, CPU affinity and process
priority from inside the builder. The parent independently reads its cgroup's
`memory.max` and `memory.swap.max`. Require identical parent/builder cgroup,
CPU2 affinity, priority at least nice 10, exactly 512 MiB and zero swap.

Keep Nix sandboxing enabled and `sandbox-fallback` false. The single-user build
group setting is an argument to this private invocation only. It does not alter
global configuration, accounts or services. One job and one build core are
declared. The real probe cannot be replaced with a configuration flag or a
synthetic output file. Its Node program has a direct runtime test, but that
test alone is not a Nix build result.

`u07-package-preflight-v1` has three serial jobs. Preparation uses 1 GiB and
five minutes on CPU2. The actual probe uses 512 MiB and ninety seconds on CPU2.
Confirmation uses 512 MiB and sixty seconds on CPU2. The whole queue cap is
ten minutes, with a three-minute estimate, nice 10, desktop reserve, no swap
and aggregate-memory backstops. Nix CLI paths and bytes are sealed.

A passing preflight establishes only this local build mechanism and copied
input identity. It is not the full package build, completed missing prerequisites,
license audit, installed HTTP or hidden browser acceptance. Those gates remain
open, followed by additional-solver setup, frozen evaluation and the final
comparative report. No solver or law changes, new table, holdout evaluation,
performance claim, publication or push occurs. Independent review is not run.

The [CLI dispatch issue](../../../issues/nix-multicall-cli-dispatch.md) preserves
a pre-queue launcher failure. Resolving the `nix-store` multicall alias changed
its parser identity and caused `unrecognised flag '--query'`. No plan or worker
was created. The focused real-CLI test fails before and passes after preserving
the command alias; the underlying binary remains content-sealed. This is not a
failed private-store build, and no resource receipt is fabricated for it.
