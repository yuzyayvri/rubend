import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {randomBytes} from "node:crypto";

const id="u01-checks-fixture-"+randomBytes(8).toString("hex"),out=JSON.parse(execFileSync(process.execPath,["bench/u01-check-plan.mjs",id],{encoding:"utf8"})),plan=JSON.parse(readFileSync(out.path,"utf8"));
assert.equal(plan.format,"rubend-background-tests-v1");assert.equal(plan.jobs.length,2);assert.ok(Object.keys(plan.sourceHashes).length>100);assert.equal(plan.queueHardLimitMinutes,30);assert.equal(plan.jobs.reduce((sum,j)=>sum+j.seconds,0),1800);
for(const [index,job]of plan.jobs.entries()){assert.equal(job.command[0],process.execPath);assert.deepEqual(job.command.slice(1),["bench/u01-check-plan.mjs","run",index===0?"check":"test"]);assert.equal(job.memoryMiB,4096);assert.equal(job.cpus.length,4);}
console.log(JSON.stringify({passed:true,jobs:2,pinnedNodeEntrypoint:true,totalSeconds:1800}));
