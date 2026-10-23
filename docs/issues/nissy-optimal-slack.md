# Nissy CLI default does not restrict answers to the optimum

The pinned CLI at `1f7e8e937d0e71e7eb3b5deab38b34d0a0159d88` initializes `optimal`
to 20. Its `src/nissy.h` defines this parameter as the maximum number of moves
above an optimal solution. The shell passes `-O` into that parameter. The solver's
name alone is therefore not an optimal-result contract.

The historical reference smoke test omits `-O`. Preserve it as solution/replay
smoke evidence, not a matched optimal comparison. It already disclaims universal
optimality and a warm comparison. Do not relabel its old results or rewrite seals.

The new calibration passes `-O 0 -n 1 -m 0 -M 20 -t 1` explicitly and records those
flags. A provenance negative control rejects the default slack of 20. Correct
options and returned replay checks still do not formally certify external search.
Keep reference-reported or configured search modes separate from proven optimality.
