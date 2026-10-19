import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {inputs} from "../scripts/manifest.mjs";

assert.equal(process.argv.length,3,"Expected fresh scheduling run id");const id=process.argv[2];assert.match(id,/^[a-z0-9-]+$/);
const revision=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"});assert.equal(revision.status,0);const sourceHashes=inputs();
for(const path of["bench/background-tests.mjs","bench/scheduling-batch.mjs","bench/scheduling-plan.mjs","bench/run-limited.mjs","bench/build-experiment.mjs","bench/source-snapshot.mjs","bench/warm-compare.mjs","bench/score-warm.mjs","bench/scorecard.mjs","bench/fixed-work-model.mjs","bench/inverse-main.bend","bench/advanced-main.bend","tests/native-lifecycle.mjs","build/model.mjs","build/cubie.mjs","build/notation.mjs","build/evidence/r06-quality-config-v5.json"])sourceHashes[path]=createHash("sha256").update(readFileSync(path)).digest("hex");
const directory=resolve("build/experiments",id),jobs=[{id:"build-and-guards",memoryMiB:4096,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/scheduling-batch.mjs","build",directory]},...["short-first","exact-reserve"].map(policy=>({id:policy,memoryMiB:6144,seconds:600,cpus:[2],command:[process.execPath,"bench/scheduling-batch.mjs",policy,directory]}))];
const plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:revision.stdout.trim(),sourceHashes,jobs,expectedMinutes:12,queueHardLimitMinutes:30,scope:"R05 isolated inverse-three scheduling pilots only. Check compilation, fifteen budget cases, pure portfolio verdicts, native cancellation, unshared arrays, and all23laws before two separate five-cohort deadline comparisons. Preserve all native output and independently replay candidates. No new tables, default change, automatic promotion, commit, push, or model wakeup."};
const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify(plan,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,jobs:jobs.map(job=>job.id),expectedMinutes:12,maximumQueueMinutes:30,automaticModelWakeups:false}));
