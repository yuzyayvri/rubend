# Preserve Nix CLI invocation identity

The package planner initially resolves both CLI paths through `realpath`.
On installed Nix 2.34.8, `nix-store` is a multicall alias of `nix`. Invoking the
resolved binary as `nix` selects the modern parser and rejects the required
legacy query with `unrecognised flag '--query'`.

The failure occurs at signed source `6a82a97`, before a plan file, detached
worker, resource receipt, private-store copy or build exists. The attempted
start then refuses the missing plan. Neither attempt is a started or passed
batch. Do not invent source seals or a resource receipt for that unstarted run.

`tests/nix-cli-path.mjs` reproduces the wrong dispatch before the fix. Its failing
test and helper source, hashes, stderr and revision are retained in
`build/evidence/u07-nix-cli-red.json`. The next queue preserves that record in
its canonical archive. The signed historical controller source remains in Git.

`bench/nix-cli-path.mjs` now preserves the absolute command alias and basename.
Content hashing still follows the alias to seal the underlying executable.
The actual legacy query passes after the change, while the deliberate realpath
mutation still rejects `--query`. Unknown command names are refused. This tests
the real installed CLI, not a mocked parser or a fabricated version string.

The dispatch defect is fixed. Actual private-store copying, sandbox probe and
full package acceptance remain unverified until their separate receipts pass.
No solver, law, package input, security setting, holdout or push changes.
