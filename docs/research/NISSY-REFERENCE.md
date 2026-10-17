# Nissy reference preparation

This is an independent reference, not Rubend's backend. Upstream:
<https://github.com/sebastianotronto/nissy-core> at
`1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88`, GPL-3.0-or-later.
The ignored checkout uses Clang, AVX2, and `THREADS=1`.

## Local changes

The single-thread build executes the worker synchronously. Its following
progress loop can have a zero sleep interval. More importantly, two generation
consumers stopped when the iterator's cursor equaled capacity. The iterator
advances the cursor *after* returning a valid last-slot entry, so this condition
can discard that entry. An unprocessed entry also explains a count shortfall
that keeps the progress loop running. The first bounded attempt was stopped;
its incomplete output was not used as an oracle.

The local generation-only patch is:

```diff
-             j != arg->map->capacity;
+             kv.val != MAP_UNSET_VAL;
-     if (NISSY_CANSLEEP) {
+     if (NISSY_CANSLEEP && THREADS > 1) {
-             if (*dfsarg->next == dfsarg->shortcubes->capacity) {
+             if (kv.val == MAP_UNSET_VAL) {
```

The sentinel changes process the valid last entry before stopping. The logging
guard avoids entering the periodic reporter after synchronous completion. No
search routine, heuristic compression, compiler optimization, or security
setting was changed. These are local modifications, not an upstream release.

`bench/reference-iterator-test.c` reproduces the boundary using the actual
upstream map header with a three-slot map. Build and run with:

```sh
nix develop --command clang -std=c11 -O2 bench/reference-iterator-test.c -o build/reference-iterator-test
build/reference-iterator-test
```

After applying both fixes, h0 was generated again. The pre-iterator-fix cache
was moved aside and is not used. `bench/reference-smoke.mjs` checks solved input,
all 18 moves, short walks, and three uniform states; every returned path must
replay in Rubend's Bend model. Timeouts remain explicit incomplete results.
This smoke test does not prove universal optimality of the reference.

Source inspection and smoke tests are not a matched world-class performance
comparison. Generation records, binary/table identities, and timeouts belong in
`docs/verification/joint-v1/`. All caches and compiled reference artifacts remain
ignored. No issue, patch, or benchmark has been published externally.
