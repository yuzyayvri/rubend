# Current state — light app verified; larger Bend bound measured

## Optimization resume checkpoint

The user requested a safe pause on 2026-10-17 with 7% usage remaining, then
explicitly resumed. They now prohibit Astra calls. Use the scoped Sol and Luna
roles recorded in AGENTS.md. The local `wip:` commit preserves the current
prototypes. It is not an accepted performance improvement or a release.

The verified commits in this batch are `97974c6`, full-table layout statistics,
and `3f9913d`, the pure lossless block codec and its unit checks. Conversion then
checked all 2,217,093,120 decoded values against the audited raw table. The
1-GiB block variant's preliminary search comparison did less work and missed one
shorter answer, so it is not selected for the speed profile.

The remaining prototypes add bounded word IO, direct array writes outside the
proof graph, offset fingerprinting, specialized getters, and reuse of an exact
search child. Word IO passed 32 native, JS, injected-read, and sanitizer cases.
The expanded pure proof entrypoint passed BendTT. Full regression, repeated
startup measurements, fixed-work comparisons, and independent approval remain
incomplete. Earlier Nix package evidence does not cover this WIP.

Pstack routing arrived during this batch. Read the latest user-provided AGENTS
instructions, `.audit/rubend-startup.todo.md`, and `.audit/rubend-startup.tsv`.
The How trace and three architecture candidates are saved under `.audit/`.
The design cross-judge was interrupted at the pause. Its gate remains closed.
The generic cache-size arithmetic issue in `docs/issues/` remains open.

Resume through the project-local pstack checkpoint locator. The first action is
to finish the independent design judgment, then freeze a five-repeat startup
measurement before accepting any prototype. No benchmark, server, or worker was
left running. Large caches and frozen baseline binaries remain ignored on disk.

The user resumed autonomous implementation after a usage-limit pause. Keep all
browser previews hidden: no visible windows may obstruct their work. The
small-memory app and solver are implemented; do not claim the full world-class
objective is complete.

## Run and verify

- `nix run .` builds the packaged local app and prints its loopback URL. It does
  not open a window.
- Development: `nix develop`, `npm ci --ignore-scripts`, then `just dev`.
- `just test` builds and tests the core, shallow exact solver, native process,
  HTTP boundary, and export records.
- `just check` checks the pinned toolchain, independent proof gate, and negative
  proof fixtures. `just audit` exhaustively audits all four projected tables.
- `nix flake check --no-update-lock-file` additionally tests the packaged runtime
  inside the Nix sandbox.

The package and tests target x86_64 Linux/NixOS only. GPU search is not configured;
this machine's AMD GPU does not match Bend's current Linux CUDA path.

## Implemented architecture

The actual search, cube rules, table generation, notation, and candidate replay
certificate are Bend code. Three.js presents the 3D cube; a small Node host
manages loopback transport and the native process. No foreign solver is used in
the product.

Six rotated/inverse searches share one owned table, with duplicate roots removed.
UD-preserving root symmetries reduce equivalent first branches. A first-answer
depth heuristic is removed by restarting improvement work after the first result.
Exact mode keeps the improving searches active alongside complete depth search,
sharing a verified incumbent and monotone lower bound. An optimal label requires
the two bounds to meet.

Private FIFOs avoid the Node-stdio socket reopening problem. Native output is
line-buffered. Progress reaching the browser is throttled, while candidates are
immediate. Shutdown waits for child cleanup; failed startup must not leak IPC
directories or restart indefinitely. Table-generation incompleteness and failed
candidate certificates fail closed.

## Evidence and limitations

Use [JOINT.md](verification/JOINT.md) for the 2026-10-17 engine experiment and
`docs/verification/joint-v1/` for its raw evidence. The local GUI and original
small-memory tier are documented in [PORTFOLIO.md](verification/PORTFOLIO.md)
and `docs/verification/portfolio-v1/`. Earlier records in
`docs/verification/implementation/` and `SETUP.md` are historical.

- 18 laws check through Bend and BendTT, including replay-certificate soundness,
  move identities, codec roundtrips, and frame/move-set transformations.
- 10,000 independent cubing.js move comparisons, 1,000 arbitrary legal states,
  18,000 packed/specification transitions, inverse/frame checks, and 2,000
  subgroup-frame checks pass.
- All 85,394 coordinate roundtrips pass.
- All 46,741 states through depth four were enumerated; 163 depth-stratified
  native optima agree with the shallow oracle.
- The four projected distance tables pass full neighbor/decreasing-path audits.
- The native suite has 34 solve cases, replay checks, cancellation, warm recovery,
  missing-binary handling, and owned-IPC cleanup checks.
- A fresh 32-state release-smoke measurement solved every case at a 1-second
  budget. Its mean best length was about 19.3 HTM and first-answer p95 about
  64 ms. The record separately reports first-answer quality and a one-shot
  cubing.js comparison. These are preliminary small-sample results, not a
  matched world-class benchmark.
- Native peak RSS is about 43 MiB, excluding Node/browser. Native cancellation
  measured roughly 7–9 ms, versus about 0.23 seconds for full worker replacement.
- Hidden browser checks covered playback/pause/seek/backstep, exact short solves,
  invalid input, cancellation/stale reset, selectable JSON export, and narrow
  light/dark layouts. A 1920×1080 viewport showed about 60 fps with p95 frame
  intervals around 16.8 ms. Browser download events and the user's clipboard
  were not fully tested; export has a selectable JSON fallback.

Saved cube state is browser-origin-local. Use a stable `PORT` when persistence
across server restarts matters, or export the record; random loopback ports have
separate browser storage. Dedicated session import/management remains future work.

Full validator correctness, representation refinement, search completeness,
table/data linkage, parser/compiler translation, and backend equivalence are
not all formally proved. See [PROOF-COVERAGE.md](architecture/PROOF-COVERAGE.md).
Hard random exact positions remain incomplete within short budgets. Superflip
still returns a non-optimal 21-move answer near 1.5–2 seconds in the small profile.

Before this optimization batch, the package passed all three Nix sandbox checks.
Those packaged and development runtime source hashes agreed; the derivations and
raw packaged HTTP/native records are in `docs/verification/joint-v1/`.

## Advanced profile

Read [ADVANCED-PROFILES.md](benchmarks/ADVANCED-PROFILES.md). A pinned Nissy
reference was compiled only in the ignored `.cache/nissy-reference` directory.
Metadata reports h48h7 data at 3,793,842,344 bytes and h48h8 at 7,585,624,040 bytes.
The earlier 10-second h0 probe was superseded by a completed local h0 cache and
replay-checked smoke cases. Generation-only local fixes and a boundary regression
test are in `docs/research/NISSY-REFERENCE.md`. Three uniform reference cases
timed out at five seconds; this is not a competitive exact-solver comparison.

On 2026-10-17, Yuzy explicitly approved the proposed local envelope: up to 8 GiB
RAM including scratch, at most two low-priority CPU cores, and 30 minutes per
experiment batch. This is a ceiling, not a memory target. Recheck headroom,
enforce the limits, and stop cleanly at them. No cloud use, GPU installation,
publication, deployment, or visible windows are authorized.

The Bend joint phase-one table has now been generated and exhaustively audited:
2,217,093,120 states, 39,907,676,160 directed edges, maximum distance 12. Its
four-bit cache is about 1.03 GiB, but the owned Bend array occupies 2 GiB.
It is experimental, not enabled in the default app or packaged automatically.

A same-core paired 32-state run at one second improved mean best length from
19.3125 to 18.75 HTM, and first-answer p95 from 83 to 37 ms; 13 shorter answers,
19 ties, no losses. Initialization increased from 278 ms to 9,890 ms. All 163
shallow optima agreed. Three difficult exact diagnoses reached lower bound 15
instead of 12 after two seconds, but did not finish. Superflip remained 21 moves
at five seconds. Full world-class strength and formal exactness are not achieved.

## Resume after the decision

1. Reduce the experimental profile's padding/startup cost and strengthen the
   exact bound with symmetry/inverse estimates. Validate representation changes
   against the audited joint table. Never use a foreign product backend.
2. Use Nissy/H48 only as an independent exact oracle/competitor. Its CLI can
   generate data automatically when a cache is missing; inspect before running.
3. Freeze larger development/release corpora and perform matched-resource
   latency/quality/initialization/memory comparisons. The 32-case sample is not
   enough for a world-class claim.
4. Continue formal coverage without weakening established laws. Investigate the
   data-to-admissibility and traversal-completeness bridges explicitly.
5. Verify fallback/context loss and download/clipboard behavior in external
   browsers when it can be done without disturbing the user.

## Build/provenance details

Six generators emit the model, packed cubies, coordinates, facelet and packed
frame symmetries, and pruning laws. The build checks generated sources for staleness. Generated
JavaScript constructor tags are namespaced, so public move codecs use numeric
IDs rather than passing constructors between separately compiled modules.

`build/manifest.json` binds artifacts to source hashes and pinned toolchains.
Benchmarks reject stale/changing builds. Rebuild after changes to runtime files,
scripts, or the flake before benchmarking. The Nix post-fixup step updates the
packaged native binary digest. Generated binaries, dependencies, large tables,
and temporary outputs remain ignored.

GPL-3.0-or-later is selected. Third-party runtime licenses are retained. Git is
initialized with the private remote. On 2026-10-17 the user authorized using the
authenticated GitHub account's identity for the initial local commit. The name
was verified through GitHub's API; the account-linked ID-based no-reply address
is used because the profile keeps its email private. Configuration is local to
this repository, not global. Consult `git log` for local snapshots. No push, PR,
release, deployment, or repository-visibility change is authorized or performed.
Preserve any remaining staged/uncommitted work.
The agent-owned preview and worker are stopped when handing off this checkpoint.
