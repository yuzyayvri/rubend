check:
    node scripts/check.mjs

resource-evidence-test:
    node tests/resource-evidence.mjs

build:
    node scripts/build.mjs

dev: build
    node apps/server.mjs

test: build
    node tests/package.mjs
    node tests/block-layout.mjs
    bend src/block-table.bend -o build/block-table.mjs
    node tests/block-table.mjs
    bend tests/block-codec.bend -o build/block-codec-test
    build/block-codec-test --threads 1
    bend tests/joint-cache.bend -o build/joint-cache-test
    node tests/joint-cache.mjs
    just loader-test
    node tests/fixed-work.mjs
    node tests/fixed-work-inputs.mjs
    node tests/core.mjs
    just symmetry48-test
    just h0-corners-test
    just h0-classes-test
    just h0-distances-test
    just h0-edges-test
    just h0-meta-test
    just h0-table-test
    just h0-profile-test
    just segmented-profile-test
    node tests/exact.mjs
    node tests/engine.mjs
    node tests/engine-lifecycle.mjs
    node tests/native-lifecycle.mjs
    bend tests/worker-control.bend -o build/worker-control-test
    node tests/worker-control.mjs
    bend tests/worker-control-batch.bend -o build/worker-control-batch-test
    node tests/worker-control-batch.mjs
    node tests/http.mjs
    node tests/export.mjs
    node tests/model-client.mjs
    node bench/corpus.mjs --check
    node tests/corpus.mjs
    node tests/scorecard.mjs
    node tests/score-warm-report.mjs
    node tests/resource-policy.mjs
    node tests/artifact-lease.mjs
    node tests/artifact-lease-integration.mjs
    node tests/experiment-build.mjs
    node tests/archive-evidence.mjs
    node tests/search-observer.mjs
    node tests/process-cpu.mjs
    bend tests/search-profile.bend -o build/search-profile-test
    build/search-profile-test --threads 1
    bend tests/search-profile.bend -o build/search-profile-test.mjs
    node tests/search-domain.mjs
    bend tests/search-initialization.bend -o build/search-initialization-test
    build/search-initialization-test --threads 1
    node tests/small-profile-generator.mjs
    bend bench/small-table-audit.bend -o build/small-table-audit
    build/small-table-audit --threads 1
    bend bench/corner-pilot.bend -o build/corner-pilot-test
    bend tests/corner-table.bend -o build/corner-table-test
    node tests/corner-pilot.mjs build/corner-pilot-test build/corner-table-test
    node tests/corner-profile-generator.mjs
    node bench/corner-stratum.mjs --check
    bend tests/corner-bound.bend -o build/corner-bound-test
    build/corner-bound-test --threads 1
    bend tests/corner-first-bound.bend -o build/corner-first-bound-test
    build/corner-first-bound-test --threads 1
    bend tests/inverse-bound.bend -o build/inverse-bound-test
    build/inverse-bound-test --threads 1
    bend tests/inverse-bound.bend -o build/inverse-bound-test.mjs
    node tests/inverse-bound.mjs
    node tests/contour-compare.mjs
    node tests/corner-contour-summary.mjs
    node tests/corner-orders.mjs
    node tests/startup-measure.mjs
    node tests/warm-compare.mjs
    node tests/lifecycle-compare.mjs
    node tests/control-ownership-inspect.mjs

audit:
    bend bench/audit.bend -o build/audit
    build/audit --threads 1

proof:
    bend PROOF.bend --verdict

smoke:
    bend src/main.bend

guide:
    bend guide

symmetry48-test:
    node scripts/generate-symmetry48.mjs --check
    node tests/symmetry48-laws.mjs
    bend src/symmetry48.bend -o build/symmetry48.mjs
    node tests/symmetry48.mjs
    bend tests/symmetry48-native.bend -o build/symmetry48-native-test
    node tests/symmetry48-native.mjs
    node tests/symmetry48-proof-negative.mjs

h0-corners-test:
    bend src/h0-corners.bend -o build/h0-corners.mjs
    bend tests/h0-corners.bend -o build/h0-corners-test
    node tests/h0-corners.mjs

h0-classes-test:
    bend bench/h0-class-pilot.bend -o build/h0-class-pilot
    bend tests/h0-classes.bend -o build/h0-class-audit
    node tests/h0-classes.mjs

h0-distances-test:
    bend bench/h0-distance-pilot.bend -o build/h0-distance-pilot
    bend tests/h0-distances.bend -o build/h0-distance-audit
    node tests/h0-distances.mjs

h0-edges-test:
    bend bench/h0-edge-pilot.bend -o build/h0-edge-pilot
    bend tests/h0-edges.bend -o build/h0-edge-audit
    node tests/h0-edges.mjs
    bend tests/h0-product.bend -o build/h0-product-test
    build/h0-product-test --threads 1

h0-meta-test:
    bend bench/h0-meta-pilot.bend -o build/h0-meta-pilot
    bend tests/h0-meta.bend -o build/h0-meta-audit
    node tests/h0-meta.mjs

h0-table-test:
    bend bench/h0-class-pilot.bend -o build/h0-class-pilot
    bend bench/h0-edge-pilot.bend -o build/h0-edge-pilot
    bend bench/h0-meta-pilot.bend -o build/h0-meta-pilot
    bend tests/h0-table-orbit.bend -o build/h0-table-orbit-test
    bend tests/h0-table-audit.bend -o build/h0-table-audit-test
    node tests/h0-table-check.mjs

h0-profile-test:
    node scripts/generate-h0-profile.mjs --check
    node tests/h0-profile-generator.mjs
    bend tests/h0-bound.bend -o build/h0-bound-test
    build/h0-bound-test --threads 1

h0-fused-rejected-check:
    bend tests/h0-fast-codec.bend -o build/h0-fast-codec-test
    build/h0-fast-codec-test --threads 1

segmented-profile-test:
    node scripts/generate-segmented-profile.mjs --check
    node tests/segmented-profile-generator.mjs
    bend tests/segmented-table.bend -o build/segmented-table-test
    build/segmented-table-test --threads 1
    bend tests/segmented-loader.bend -o build/segmented-loader-test
    node tests/segmented-loader.mjs

loader-test:
    mkdir -p build/evidence
    bend tests/word-io.bend -o build/word-io-test
    bend tests/word-io.bend -o build/word-io-test.js
    bend tests/word-io.bend -o build/word-io-test.c
    clang -O2 build/word-io-test.c tests/word-read-wrap.c -Wl,--wrap=read -o build/word-io-wrapped-test -lpthread -lm
    node tests/word-io.mjs --wrapped
    bend tests/loader-boundary.bend -o build/loader-boundary-test
    bend tests/loader-boundary.bend -o build/loader-boundary-test.js
    bend tests/loader-boundary.bend -o build/loader-boundary-test.c
    clang -O2 build/loader-boundary-test.c tests/loader-growth.c -Wl,--wrap=read -Wl,--wrap=close -o build/loader-boundary-wrapped-test -lpthread -lm
    node tests/loader-boundary.mjs --wrapped
