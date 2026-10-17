# Fixed-work comparison must seal binary identity

Status is resolved with a regression. Root review found that the runner hashed
each executable only after execution. A binary that modified itself could
receive a successful comparison with misleading provenance. A small fixture
reproduced that behavior before the fix.

The runner now requires regular files and checks SHA256 plus stable file
identity before and after execution. The regression rejects a self-mutating
fixture and a directory input. It is part of `just test`.

The earlier real native comparisons used coordinator-owned frozen binaries,
whose post-run hashes matched the build manifests recorded before execution.
Those inputs did not change. A fresh native comparison after the fix reproduced
every prior transcript byte and both pre-execution build identities. Evidence is
in `docs/verification/fixed-work-v1/input-seal-repro.json`,
`input-seal-regression.json`, and `sealed-comparison-limits.json`.
Independent acceptance remains blocked by host capacity.
