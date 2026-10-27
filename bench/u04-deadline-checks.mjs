import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {resolve} from "node:path";
import {createHash} from "node:crypto";
import {execFileSync,spawnSync} from "node:child_process";
import {inputs} from "../scripts/manifest.mjs";

const[mode,id]=process.argv.slice(2);assert.equal(process.argv.length,4);assert.ok(["plan","compile","measure","confirm"].includes(mode));assert.match(id,/^u04-deadline-[a-z0-9-]+$/);
const read=p=>JSON.parse(readFileSync(p,"utf8")),hash=p=>createHash("sha256").update(readFileSync(p)).digest("hex"),directory=resolve("build/experiments",id),binary=resolve(directory,"native/deadline-bank"),files=["bench/u04-deadline-checks.mjs","bench/deadline-bank-worker.bend","bench/deadline-seed-model.mjs","bench/deadline-seed-run.mjs","bench/deadline-seed-spec.json","tests/deadline-seed-model.mjs","docs/verification/next-plan/U04/DEADLINE-SEED-PROBE.md","build/model.mjs","build/cubie.mjs","build/notation.mjs","build/manifest.json"];
if(mode==="plan"){
  const paths=execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);paths.push(...files);
  const path=resolve("build/evidence",id+"-plan.json"),jobs=[{id:"compile",memoryMiB:3072,seconds:240,cpus:[2,3,4,5]},{id:"measure",memoryMiB:3072,seconds:360,cpus:[2]},{id:"confirm",memoryMiB:3072,seconds:180,cpus:[2,3,4,5]}].map(j=>({...j,command:[process.execPath,"bench/u04-deadline-checks.mjs",j.id,id]}));
  writeFileSync(path,JSON.stringify({format:"rubend-background-tests-v1",id,root:process.cwd(),revision:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),sourceHashes:Object.fromEntries(paths.map(p=>[p,hash(p)])),jobs,expectedMinutes:5,queueHardLimitMinutes:15,scope:"U04 native Fast-only R vs NoSeed deadline probe, unchanged quanta/cache. Eight fresh confirmation development520..527, separate known-gain diagnostics512/518,100/1000ms,5alternating cohorts, same-binary A/A and shallow warmups. Charge initialization/certificate/output; score only availability by deadline; retain coverage/bound losses. No exact policy change, app/CPU speed claim, product integration/default, new law, large table, holdout evaluation or publication."},null,2)+"\n",{flag:"wx"});
  console.log(JSON.stringify({path,expectedMinutes:5,maximumMinutes:15}));process.exit();
}
const earlier=read("docs/verification/next-plan/U04/u04-fast-only-v1/index.json"),previous=read("build/evidence/u04-fast-only-v1-plan.json");assert.equal(earlier.passed,true);assert.equal(hash("bench/seed-bank.bend"),previous.sourceHashes["bench/seed-bank.bend"]);assert.equal(hash("bench/bounded-portfolio.bend"),previous.sourceHashes["bench/bounded-portfolio.bend"]);
const sourceHashes={...inputs(),...Object.fromEntries(files.map(p=>[p,hash(p)]))};
function run(program,args,seconds=150){const r=spawnSync(program,args,{encoding:"utf8",timeout:seconds*1000,maxBuffer:4*1024*1024});assert.ifError(r.error);process.stdout.write(r.stdout??"");process.stderr.write(r.stderr??"");assert.equal(r.status,0,program+" failed");return r.stdout;}
if(mode==="compile"){
  run(process.execPath,["tests/deadline-seed-model.mjs"]);run(process.execPath,["tests/fast-seed-policy.mjs"]);mkdirSync(resolve(directory,"native"),{recursive:true});
  run(process.execPath,["bench/build-experiment.mjs","bench/deadline-bank-worker.bend",binary]);run("bend",["bench/deadline-bank-worker.bend","-o",binary+".c"]);run(process.execPath,["scripts/check-array-mode.mjs",binary+".c"]);
  const bendPath=run("bash",["-c","command -v bend"]).trim(),now=resolve(bendPath,"../../libexec/bend/bend2/effs/now.c");assert.match(readFileSync(now,"utf8"),/io_tick\(\)\s*\/\s*1000000/);
  const artifacts=[binary,binary+".json",binary+".c"];
  writeFileSync(resolve(directory,"compile.json"),JSON.stringify({passed:true,sourceHashes,artifacts:Object.fromEntries(artifacts.map(p=>[p,hash(p)])),clock:{path:now,sha256:hash(now),integerMilliseconds:true},existingSeedBankEvidenceReused:true,productionSourcesUnchanged:true})+"\n",{flag:"wx"});process.exit();
}
const compile=read(resolve(directory,"compile.json"));assert.equal(compile.passed,true);for(const[p,h]of Object.entries(compile.artifacts))assert.equal(hash(p),h);assert.equal(hash(compile.clock.path),compile.clock.sha256);
if(mode==="measure")run(process.execPath,["bench/deadline-seed-run.mjs",binary,resolve(directory,"observation.json")],280);
if(mode==="confirm"){
  const observation=read(resolve(directory,"observation.json"));assert.equal(observation.passed,true);assert.equal(observation.errors.length,0);run("just",["check"],160);
  writeFileSync(resolve(directory,"confirmation.json"),JSON.stringify({passed:true,disposition:observation.disposition,errorCount:0,existingSeedBankEvidenceReused:true,nativeDeadlineMeasured:true,applicationLatencyMeasured:false,cpuSpeedupMeasured:false,performanceAcceptance:false,productIntegrated:false,newDomainLaw:false,releaseHoldoutOpened:false,independentReview:false})+"\n",{flag:"wx"});
}
for(const[p,h]of Object.entries(sourceHashes))assert.equal(hash(p),h);
