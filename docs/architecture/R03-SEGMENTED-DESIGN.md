# Segmented raw-layout pilot

Status is a functionally checked, performance-unmeasured prototype. Keep this hypothesis separate from H0 probe
ordering, owned stacks, and portfolio scheduling. The unchanged raw nibble
payload has 277,136,640 words. The search also needs an 8,388,608-word prefix.

Use one affine Bend owner with three arrays.

| Field | Physical words | Logical global addresses |
| --- | ---: | --- |
| Prefix | 8,388,608 | 0 through 8,388,607 |
| Lower raw block | 268,435,456 | 8,388,608 through 276,824,063 |
| Upper raw block | 16,777,216 | 276,824,064 through 285,525,247 |

The physical allocation is 293,601,280 words, or 1,120 MiB. This is geometry,
not a measured RSS saving. Do not report the old 536,870,912-word array size
for the new owner. Validate all three actual array sizes at initialization.
Parse external indexes against the logical end, not the padded allocation.
Internal coordinate lookups retain their existing trusted-domain contract.
Reject zero expected geometry explicitly. It means an unavailable profile and
must not match the invalid-owner sentinel. The real initialization regression
and generator check encode this boundary.

Read the raw file directly into the lower and upper arrays through one file
handle. Preserve the existing bounded word reader, exact initial/final file
size checks, and fingerprint. Never allocate the old two-GiB array first and
then convert it. Generate the small prefix directly into its final owner.
No foreign lookup, unsafe sharing, or foreign solver is needed.

The isolated generator must migrate the search, portfolio, inverse reader,
native runtime, and fixed-work harness to the new owner in one wave. Remove
unavailable block-profile paths rather than leaving ill-typed adapters. Keep
the original sources and frozen controls unchanged. Reject stale generator
inputs and mismatched profile/storage shapes.

Before any performance verdict, compare every used prefix/raw word against
the original loader in a bounded native test. Check segment boundaries,
out-of-range parsing, malformed/truncated files, and initialization dimensions.
Require identical fixed-work states, shallow optima, and replayed answers.
Then run five matched fresh cohorts for actual RSS, initialization, equal-work
CPU, and deadline quality. Any RSS saving is an optional tier until its quality
floor passes. Independent review remains unrun under solo work.

The owned-stack experiment follows separately. Bend supports Array.get and
Array.set for Data elements, and Array.swap for affine elements. A generic
owned stack can therefore keep Frame constructors in the search module without
an import cycle. First derive live occupancy from the Node/Retry transitions.
Keep one bounded move-path array per task and materialize a persistent list
only for a candidate. Task owners become affine; deduplicate reusable root
descriptors before allocating them. Rehydrate diagnostic snapshots and compare
them against the reference. These are proposed implementation details, not
completed work or a new formal law.
