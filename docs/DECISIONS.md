# Decision record

Original decisions dated 2026-10-16, Asia/Manila. Later entries give their dates.

| ID | Decision | Reason / revisit trigger |
| --- | --- | --- |
| D01 | Stop after setup, research, and planning | User explicitly requests a readiness report before implementation |
| D02 | GPL-3.0-or-later | User changed the initial MIT request to GPLv3 like their other engines; use the version-3-or-later grant |
| D03 | Standard 3×3, HTM first | Clear, established exactness benchmark; larger puzzles are a separate scope |
| D04 | Native Bend search; generated-JS domain model | Keep substantive language use while allowing a polished presentation layer |
| D05 | Fast two-phase plus a separate complete exact search | First answers and shortest-answer guarantees require distinct mechanisms |
| D06 | Table/representation feasibility before full search | Safe ownership and physical table footprint are unmeasured material risks |
| D07 | CPU search first on this workstation | Observed AMD GPU does not match Bend's current Linux CUDA target |
| D08 | Local browser GUI; renderer provisional | Accessible native browser controls avoid writing a toolkit; test Three.js versus TwistyPlayer early |
| D09 | Pin Nix inputs, Bend release, and exact Lean | No system rebuild or unreviewed installer; reproducible independent verdict |
| D10 | Separate solution validity, search optimality, formal certification | Neither a replay check nor a successful unrelated proof justifies all three |
| D11 | No push, release, visibility change, or deployment in this phase | Remote connection is configured; publication remains a separate action |
| D12 | No initial commit without configured author identity | Git user.name/email are absent; do not invent the user's commit attribution |
| D13 | Keep third-party source adaptations attributable | GPL permits relevant reuse, but never removes notice/provenance requirements |

## Setup findings that changed the plan

- GitHub confirms the target repository is private and empty. Public-browser 404
  was not evidence that it did not exist.
- Git's configured GitHub credential helper referenced a removed Nix store path.
  A repository-local helper uses the existing system GitHub CLI; no global
  authentication settings or secrets were changed. Authenticated remote read
  was rechecked successfully.
- Bend uses `bend version`, not `bend --version`.
- The release's generic JavaScript interop description is not enough to specify
  an ABI. The compiled Boolean probe uses primitive JS booleans; future codecs
  must be tested against actual generated output.
- The default nixpkgs Lean is 4.34.1, but Bend's checker requests 4.34.0. The
  exact official release is fetched and patched through Nix, then used to build
  the bundled kernel. The host system is unchanged.
- The independent kernel needed an explicit ELF fixup after Lean linking to
  run in a clean Nix sandbox. Both development and sandboxed checks now pass.

## Implementation updates

| ID | Date | Decision | Evidence / reason |
| --- | --- | --- | --- |
| D14 | 2026-10-16 | Autonomous local implementation supersedes D01's setup stop | User approved proceeding end-to-end; publication remains gated |
| D15 | 2026-10-17 | Local experiments: 8 GiB, two low-priority cores, 30 minutes per batch | User explicitly approved this ceiling; no cloud, GPU stack, or visible windows |
| D16 | 2026-10-17 | First larger bound is an unreduced joint phase-one table in Bend | Separates stronger bounds from stabilizer complexity; full data audit completed |
| D17 | 2026-10-17 | Keep larger profile experimental and light app default | Paired move-quality/latency improvement, but ~10-second initialization and 2-GiB array; `verification/JOINT.md` |
| D18 | 2026-10-17 | Use cgroup RAM enforcement for Bend experiments | Bend's unused virtual reservation makes a small address-space limit inappropriate |
| D19 | 2026-10-17 | Repair reference-only iterator consumers and disable synchronous progress reporter | Reproduced final-slot boundary; generation provenance in `research/NISSY-REFERENCE.md` |
| D20 | 2026-10-17 | Use the authenticated GitHub identity for the initial local commit | User explicitly selected their GitHub account; API-verified profile name and account-linked no-reply email, repository-local configuration only; no push authorization |
