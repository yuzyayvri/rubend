# Cache loading design task

Produce a loader design package, not an implementation. Do not edit application
code, tests, instructions, caches, binaries, logs, or another candidate's files.
Write only the output path supplied in your agent message. Do not spawn agents.

Read the installed poteto-mode skill and its Codex mapping completely. Read the
architect skill, its runner prompt, rationale template, and design red flags.
The workflow is architect Phase B. Do not rerun its orchestration. Use prose
contracts instead of code comments or TODO comments. The user forbids code
comments except notices and tool directives.

The grounding is `.audit/rubend-startup-grounding.md`. Trace referenced live code
as needed. Existing uncommitted prototypes are candidates, not approved designs.
They include `Cache.load_words`, `word-io.bend`, and native and JS word readers.

The consumer loads an already audited raw cache of 277,136,640 little-endian U32
words, verifies the pinned content, adds small Bend-generated tables, and starts
the native worker. Existing raw loading boxes each byte as a list cell. The
existing raw profile allocates one power-of-two 2-GiB array and shifts data for
its small-table prefix. No search or table mathematics may move out of Bend.

The immediate goal is at least 50% lower process-to-ready median over five
alternating runs, with exactly the same distances, replay behavior, and shallow
optima. Candidate claims are predictions until measured. Startup improvement
must not disguise skipped loading, checks, or a warm process as cold startup.

Consider at least two structurally distinct complete designs. Give each a
caller-first usage example and type/signature sketch. Recommend one with a
rationale. One existing possibility is a bounded foreign IO word-read operation
that copies a complete temporary chunk into an affine array on the event loop.
Other whole shapes may include a single import operation returning a new array
or a pure Bend storage change. Do not average these into a vague middle.

Respect these constraints.

- One owner per Bend array. No unsafe definitions or shared-memory lookup.
- File IO may be foreign only outside the pure proof dependency graph.
- Do not patch the pinned Bend runtime or silently rely on another compiler.
- Partial reads and EINTR must not publish incomplete chunks.
- Bad sizes and offset arithmetic must fail closed. See the open local issue
  `docs/issues/cache-size-arithmetic.md`.
- Keep cryptographic cache identity in the host acceptance check and do not
  describe the 32-bit native consistency fingerprint as a proof.
- Local experiments have an 8-GiB total ceiling, two low-priority CPU cores, and
  30 minutes per batch. Do not run an experiment during this design task.
- No visible windows, publication, deployment, external messages, or global
  configuration changes. No changes to sealed cache files or baseline binaries.
- The default light app must remain usable. The raw and compressed variants
  are experimental entrypoints, not enabled product profiles.

Keep the package under 1400 words. Include concrete signatures, ownership and
failure outcomes, alternatives, and tests that could disprove the design.
Do not claim formal correctness or benchmark wins from inspection.
