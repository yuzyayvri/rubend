# Missing web assets in application replay preparation

The first [data-admission queue](../verification/next-plan/U07/u07-final-app-data-v1/index.json)
passes its recorded four-record and 28-control checks. Canonical verification
confirms 5,140 source seals, two receipts and worker cleanup. Inspection before
browser use then finds an empty `webAssets` map. This artifact is not admitted
for serving the frontend. Its passing queue status is not browser acceptance.

The preparer selected `web/` entries from `manifest.artifacts`. That manifest
lists six generated model modules, not bundled web files. The final freeze
already pins all seven installed web files by absolute path. The correction
derives the asset map from those frozen hashes and checks the essential entry
points, safe names, hash shapes and actual installed bytes before writing it.

A focused check against the preserved original artifact fails with
`Missing admitted installed web asset main.js`. Its bounded resource receipt is
`build/evidence/u07-final-app-assets-red-v1.json`. Four added rejection controls
cover an empty map, missing main entry, invalid digest and traversal name.

No browser consumes the incomplete artifact. Captured answers still replay and
their original immutable measurements do not change. The old artifact, queue,
source revision and failing check remain preserved. A fresh bounded data queue
must pass canonical verification before browser use. No product, solver, table,
frozen analysis or completed holdout attempt is changed or repeated.
