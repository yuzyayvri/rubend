check:
    node scripts/check.mjs

build:
    node scripts/build.mjs

dev: build
    node apps/server.mjs

test: build
    node tests/package.mjs
    bend tests/joint-cache.bend -o build/joint-cache-test
    node tests/joint-cache.mjs
    node tests/core.mjs
    node tests/exact.mjs
    node tests/engine.mjs
    node tests/http.mjs
    node tests/export.mjs

audit:
    bend bench/audit.bend -o build/audit
    build/audit --threads 1

proof:
    bend PROOF.bend --verdict

smoke:
    bend src/main.bend

guide:
    bend guide
