import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";

const run=args=>spawnSync("build/worker-control-batch-test",[...args,"--threads","1"],{encoding:"utf8",timeout:5000});
const ok=run([]);assert.equal(ok.status,0,ok.stderr);assert.deepEqual(ok.stdout.trim().split("\n"),["4 1 no","429496 6 yes","0 0 yes","0 0 no","0 0 no","0 0 yes","0 0 yes","0 0 no","42 2 no"]);
for(const text of["4294967296\n","\n","0\n","00000000001\n","x\n","-1\n"]){const bad=run([text]);assert.equal(bad.status,2,bad.stderr);assert.match(bad.stderr,/Invalid engine control record/);}
console.log(JSON.stringify({passed:true,fragmentedU32Maximum:true,coalescedRecords:true,staleIdIgnored:true,incompleteIdDoesNotCancel:true,negativeRecords:6}));
