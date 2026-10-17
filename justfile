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
