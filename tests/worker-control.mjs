import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";

const result=spawnSync("build/worker-control-test",["--threads","1"],{encoding:"utf8",timeout:5000});
assert.equal(result.status,0,result.stderr);
assert.deepEqual(result.stdout.trim().split("\n"),["bad","more 4294967295 10","bad","bad","bad","bad","send 42","bad","more 42 2"]);
console.log(JSON.stringify({passed:true,cases:9,overflowRejected:true,zeroAndEmptyRejected:true}));
