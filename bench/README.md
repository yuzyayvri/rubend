# Bounded benchmarks

`compare.mjs` measures fixed-budget Rubend answers against a labeled one-shot
cubing.js reference. `exact-profile.mjs` diagnoses the exact-search gap, and
`hard.mjs` records the Superflip tail. Lookup/generation/audit programs are Bend.

Build first; the comparison rejects stale or changing artifacts. Current
comparison limits are 40 cases and 1.5 seconds each. Large corpora, prolonged
generation, and large memory profiles require resource authorization.

See the [benchmark contract](../docs/benchmarks/PROTOCOL.md),
[advanced-profile decision](../docs/benchmarks/ADVANCED-PROFILES.md), and
[verification report](../docs/verification/PORTFOLIO.md). Small preliminary
samples are not world-class performance evidence.

The later [joint-table experiment](../docs/verification/JOINT.md) adds bounded
resource enforcement, experimental build identities, a full large-table audit,
cache codec tests, and paired light/joint measurements. It does not replace the
default application engine with a foreign reference or silently allocate a
large table.

`startup-measure.mjs` measures five fresh workers per profile, alternating profile
order. It checks complete cache SHA256 streams before each worker and after the
batch, so these are warm-file-cache measurements. The ready timer excludes the
host hash and includes process and FIFO setup. Failed runs never enter medians.
The JSON includes errors, completed replays, measured host hash bytes, and native
RSS samples. Declared cache geometry is not an observed native byte counter.

The local `startup-baseline.json` pins the preserved raw-cache experiment.
Run `node bench/startup-measure.mjs /absolute/path/to/config.json` inside the
bounded experiment runner. All binary and cache paths are explicit. This is an
experimental profile, not the default small-memory application.
