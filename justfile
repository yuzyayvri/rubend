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
    node tests/core.mjs
    node tests/exact.mjs
    node tests/engine.mjs
    node tests/http.mjs
    node tests/export.mjs
    node tests/startup-measure.mjs

audit:
    bend bench/audit.bend -o build/audit
    build/audit --threads 1

proof:
    bend PROOF.bend --verdict

smoke:
    bend src/main.bend

guide:
    bend guide
