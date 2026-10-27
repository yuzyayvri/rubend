import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {deriveTestRecovery} from "../bench/just-test-recovery.mjs";

const fixture="test: build\n    node first.mjs\n    node failed.mjs\n    just tail\n\nother:\n    node unrelated.mjs\n",result=deriveTestRecovery(fixture,"node failed.mjs");assert.equal(result.failedLine,3);assert.deepEqual(result.prefix,["node first.mjs"]);assert.deepEqual(result.remaining,["node failed.mjs","just tail"]);assert.equal(result.source,"recover:\n    node failed.mjs\n    just tail\n");
for(const recipe of[fixture.replace("test: build","test:"),fixture.replace("    just tail","    node failed.mjs"),fixture.replace("    node first.mjs","    -node first.mjs"),fixture.replace("    node first.mjs","  node first.mjs")])assert.throws(()=>deriveTestRecovery(recipe,"node failed.mjs"));assert.throws(()=>deriveTestRecovery(fixture,"node absent.mjs"));
const actual=deriveTestRecovery(readFileSync("justfile","utf8"),"node tests/keyboard-playback.mjs");assert.equal(actual.prefix[0],"node tests/package.mjs");assert.equal(actual.remaining.at(-1),"node tests/control-detached-probe.mjs");assert.ok(actual.remaining.includes("node tests/frame-driver.mjs"));
console.log(JSON.stringify({passed:true,rejectedFixtures:5,actualFailedLine:actual.failedLine,prefixCommands:actual.prefix.length,remainingCommands:actual.remaining.length,buildNotRepeated:true}));
