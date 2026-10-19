import assert from "node:assert/strict";
import {readFileSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {inputs} from "../scripts/manifest.mjs";

assert.equal(process.argv.length,3,"Expected fresh background run id");const id=process.argv[2];assert.match(id,/^[a-z0-9-]+$/);
const revision=spawnSync("git",["rev-parse","HEAD"],{encoding:"utf8"});assert.equal(revision.status,0);
const sourceHashes=inputs(),manifest=JSON.parse(readFileSync("build/manifest.json","utf8"));assert.deepEqual(manifest.sourceHashes,sourceHashes,"Rebuild before planning unattended package checks");
for(const path of["bench/background-tests.mjs","bench/background-profile-checks.mjs","bench/background-test-plan.mjs","bench/run-limited.mjs","bench/build-experiment.mjs","bench/source-snapshot.mjs","tests/native-lifecycle.mjs","tests/native-control-failures.mjs","tests/package.mjs","tests/http.mjs","tests/engine.mjs","tests/export.mjs","build/manifest.json","build/rubend",...Object.keys(manifest.artifacts).map(name=>"build/"+name)])sourceHashes[path]=createHash("sha256").update(readFileSync(path)).digest("hex");
const directory=resolve("build/experiments",id),jobs=[["optional-build","build"],["optional-lifecycle","profiles"],["staged-package","package"]].map(([name,mode])=>({id:name,memoryMiB:4096,seconds:600,cpus:[2,3,4,5],command:[process.execPath,"bench/background-profile-checks.mjs",mode,directory]}));
const plan={format:"rubend-background-tests-v1",id,root:process.cwd(),revision:revision.stdout.trim(),sourceHashes,jobs,expectedMinutes:15,queueHardLimitMinutes:30,scope:"Build and check six existing optional native profiles, then verify staged package/native/HTTP/export and unchanged proof/toolchain. No new tables, visible preview, Nix daemon build, commit, push, or AI wakeup."};
const path=resolve("build/evidence",id+"-plan.json");writeFileSync(path,JSON.stringify(plan,null,2)+"\n",{flag:"wx"});console.log(JSON.stringify({path,expectedMinutes:plan.expectedMinutes,maximumQueueMinutes:plan.queueHardLimitMinutes,jobs:jobs.map(job=>job.id),automaticModelWakeups:false}));
