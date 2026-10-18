# Identical binaries can have different source snapshots

Status: closed with solo verification. The focused fixture, corrected real
legacy-reader compile, native builder/run, full regression, and unchanged-law
BendTT checks pass.

The old experiment builder keyed source snapshots only by the binary hash.
Unused source can change without changing emitted machine code, as the exact
initializer correction demonstrated. A second build could then overwrite the
first build's frozen sources even though its metadata retained old source hashes.

The focused compiler fixture reproduces the actual overwrite. The first source
contains value one and the second value two, while both binaries have identical
bytes. The failing-before assertion shows two where the frozen first snapshot
requires one. This is a fixture-only reproduction, not evidence that a product
solver or existing stored measurement was corrupted.

Snapshots now include both binary and canonical source-manifest digests. They
publish through a private temporary directory and atomic rename, reuse matching
content without rewriting it, and reject conflicting content. New source files
are read-only. The builder rejects reused binary/metadata output names, seals
captured source identities before and after compilation, and writes metadata
only after snapshot validation. Both build tools participate in the artifact
lease. The fixed-work timer reader uses the metadata-selected location while
retaining read access to old immutable artifacts that predate that field.

The fixture passes for same-binary/different-source preservation, overwrite
rejection, unchanged snapshot identities on reuse, and conflict rejection
without publishing metadata. A separate audit matches every source hash in
eight existing frozen graphs. The first real timer probe mistakenly selected
application metadata that did not contain the required fixed-work entrypoint.
It failed before producing a binary and is not accepted as a compatibility
result. The reader now rejects that incomplete graph before creating output
sources. The corrected probe compiles from the actual r01-domain-fixed metadata
and the new builder compiles and runs the real initializer regression. Both
preserve the legacy sources. No direct timing result comes from these probes.
No old snapshot or measured binary is rewritten.

This changes development artifact handling only. It makes no solver-speed,
solution-quality, or independent-review claim. Existing domain laws are unchanged.
Raw red/green, frozen-audit, invalid/corrected probe, and full-regression receipts
are under docs/verification/source-snapshots-v1/. Independent review has not run.
