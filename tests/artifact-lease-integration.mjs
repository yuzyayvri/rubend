import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {withArtifactLease} from "../scripts/artifact-lease.mjs";

withArtifactLease();
const files=["build/model.mjs","build/cubie.mjs","build/notation.mjs"];
function seal(path){const s=statSync(path,{bigint:true});return {sha256:createHash("sha256").update(readFileSync(path)).digest("hex"),identity:[s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].map(String)};}
const before=files.map(seal),env={...process.env};delete env.RUBEND_ARTIFACT_LEASE;
for(const args of [["scripts/build.mjs","--engine-only"],["bench/run-limited.mjs","lease-conflict-probe","512","10","2",process.execPath,"-e","process.exit(99)"]]){
  const r=spawnSync(process.execPath,args,{env,encoding:"utf8",timeout:5000});assert.equal(r.error,undefined);assert.equal(r.status,73);assert.match(r.stderr,/artifacts are in use/);
}
assert.deepEqual(files.map(seal),before);
console.log(JSON.stringify({passed:true,actualBuildRejectedBeforeWrites:true,actualExperimentRejectedBeforeLaunch:true,generatedInputIdentitiesUnchanged:true}));
