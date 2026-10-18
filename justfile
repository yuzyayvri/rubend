check:
    node scripts/check.mjs

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
    node tests/exact.mjs
    node tests/engine.mjs
    node tests/http.mjs
    node tests/export.mjs
    node bench/corpus.mjs --check
    node tests/corpus.mjs
    node tests/scorecard.mjs
    node tests/score-warm-report.mjs
    node tests/resource-policy.mjs
    node tests/artifact-lease.mjs
    node tests/artifact-lease-integration.mjs
    node tests/archive-evidence.mjs
    node tests/search-observer.mjs
    node tests/process-cpu.mjs
    bend tests/search-profile.bend -o build/search-profile-test
    build/search-profile-test --threads 1
    bend tests/search-profile.bend -o build/search-profile-test.mjs
    node tests/search-domain.mjs
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

audit:
    bend bench/audit.bend -o build/audit
    build/audit --threads 1

proof:
    bend PROOF.bend --verdict

smoke:
    bend src/main.bend

guide:
    bend guide

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
