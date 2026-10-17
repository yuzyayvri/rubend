# Fixed-work regression lever

`bench/fixed-work.bend` drives the existing Bend portfolio state machine without
reading the clock. Each TSV request fixes a case ID, facelets, request mode, and
number of `P.advance` calls. It emits the initial state and every resulting slice.
The recorded `nodes` value counts actual `S.advance` calls, including shortened
slices when a task ends. Completed sessions remain unchanged in later slices.

Every snapshot includes ordered best moves, length, lower bound, status, and the
complete ordered task metadata and search frames. Comparisons use the full
semantic JSON, not a lossy fingerprint. The report also includes SHA256 identities
for locating mismatches. It excludes the initialized table payload. Raw table
initialization retains the production advanced entrypoint's digest check.

Every available solution passes the existing Bend replay-certificate path before
its snapshot is printed. The Node runner independently replays the moves with a
geometric facelet permutation implementation. That implementation imports neither
the Bend engine nor generated Bend JavaScript. The runner rejects missing or
extra records, missing certificates, mismatched candidates, nonmonotone or
oversized work counts, invalid terminal bounds, and failed replay.

The standard corpus fixes solved, one-turn, short, the first three uniform
holdout cases, and superflip. Both fast and exact requests use the same slice
count. Both tiers use exactly the same input corpus. The committed fixture is
`bench/fixed-work-cases.json`. It is not a quality or timing benchmark.

Compile this entrypoint in each source tree being compared. For a frozen source
snapshot, copy that snapshot into a fresh private directory and add this
entrypoint beside its original `bench/advanced-main.bend`. Never modify the
frozen snapshot. Record each binary's build manifest with
`bench/build-experiment.mjs`. The two entrypoints must use identical lever
sources and fixtures. Only the intended production implementation may differ.

```sh
nix develop --command node bench/build-experiment.mjs bench/fixed-work.bend build/fixed-work
nix develop --command node tests/fixed-work.mjs
nix develop --command node tests/fixed-work-native.mjs build/fixed-work
nix develop --command node bench/fixed-work.mjs --reference /absolute/reference --candidate /absolute/candidate --tier light --slices 6
RUBEND_JOINT_CACHE=/absolute/cache nix develop --command node bench/fixed-work.mjs --reference /absolute/reference --candidate /absolute/candidate --tier raw --slices 6
```

Use the existing `bench/run-limited.mjs` wrapper for compilation and execution.
Its external safety timeout is not a search-work budget. The runner itself does
not choose work from elapsed time. Run the two binaries sequentially so large
raw table allocations cannot overlap. No full raw execution is authorized by
this lever's existence alone.

The optional `--corpus` argument accepts the saved 163-case shallow optimum
corpus, including each record's `depth` and `facelets`. It requires every final
snapshot to establish that depth with optimal status and an equal lower bound.
Choose an explicit fixed slice count adequate for the corpus. A timeout or
unfinished result fails rather than being relabeled optimal.

```sh
nix develop --command node bench/fixed-work.mjs --reference /absolute/reference --candidate /absolute/candidate --tier raw --slices 64 --corpus docs/verification/optimization-v1/resume-exact.json --output build/evidence/fixed-work-raw-shallow.json
```

This check establishes equality on its specified inputs and work counts only.
It does not establish general search completeness or optimality. A changed
traversal deliberately fails even when returned solution quality is unchanged.

## Frozen-reference comparison

The frozen original and current prototype agree on every recorded state in
both tiers. Fourteen cases at 64 slices produced 910 snapshots per tier. The raw
profile also matched all 163 shallow optima at 16 slices, producing 2,771
snapshots. Together, each binary performed 45,291,987 state-machine steps and
checked 3,907 candidate snapshots. These counters are not expanded-node counts.

`fixed-work-v1/comparison.json` records counts, binary identities, and raw and
compressed SHA256 values. The full semantic transcripts are compressed in the
adjacent `.json.gz` files. They omit no state fields. The raw ignored originals
remain under `build/evidence/`. Build manifests preserve both source graphs.
The bounded comparison batch passed in 31.1 seconds with 2,283,068 KiB peak
aggregate RSS. Independent approval remains blocked by the host's agent limit.

The runner also seals executable SHA256 and file identity before and after each
execution. A self-mutating fixture reproduced the missing check before the fix
and is now rejected, as is a directory input. A fresh sealed native run produced
byte-identical transcripts and matching pre-execution build hashes. The initial
reproduction, passing regression, and sealed rerun have separate evidence files.

The isolated lever self-comparison passed 98 snapshots over 14 requests and six
slices per request. It checked 36 certificates and independent replays. Its
record is `docs/verification/fixed-work-v1/lever-self.json`. This is not a
comparison with the frozen baseline. Native entrypoint compilation exceeded the
initial 512-MiB build envelope and succeeded under the separately approved
2-GiB envelope. Light execution stayed within the 512-MiB execution envelope.
The native request reader also passed 100 requests crossing a read boundary,
including a final line without a newline, plus malformed and oversized input
rejections. That record is `docs/verification/fixed-work-v1/native-input.json`.
