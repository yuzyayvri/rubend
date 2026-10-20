import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {execFileSync,spawnSync} from "node:child_process";
import {resolve} from "node:path";
import {createHash} from "node:crypto";

if(process.argv[2]==="run"){
  assert.equal(process.argv.length,4);assert.ok(["check","test"].includes(process.argv[3]));const result=spawnSync("just",[process.argv[3]],{stdio:"inherit"});assert.ifError(result.error);assert.equal(result.status,0);process.exit(0);
}
const id=process.argv[2];assert.equal(process.argv.length,3);assert.match(id,/^u01-checks-[a-z0-9-]+$/);
const revision=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes={};
for(const path of execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean))sourceHashes[path]=createHash("sha256").update(readFileSync(path)).digest("hex");
const jobs=[{id:"proof",memoryMiB:4096,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/u01-check-plan.mjs","run","check"]},{id:"regression",memoryMiB:4096,seconds:1200,cpus:[2,3,4,5],command:[process.execPath,"bench/u01-check-plan.mjs","run","test"]}];
const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision,sourceHashes,jobs,expectedMinutes:12,queueHardLimitMinutes:30,scope:"Check unchanged laws and full development regression after browser-test infrastructure changes. Includes fixture-session startup abort, origin protection, capability refusal, and owned-process cleanup. No large data generation, publication, or performance claim."},null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:12,maximumMinutes:30,automaticWakeups:false}));
